import forEach from 'lodash/forEach'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import omit from 'lodash/omit'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { createListenerCreator, Dispatch } from './listener-util'
import { setCallOnAppInitialize } from './common-pool'

type DocumentData = firebase.firestore.DocumentData
type QueryDocumentSnapshot<
  T = DocumentData
> = firebase.firestore.QueryDocumentSnapshot<T>
type QuerySnapshot<T = DocumentData> = firebase.firestore.QuerySnapshot<T>
type DocumentSnapshot<T = DocumentData> = firebase.firestore.DocumentSnapshot<T>
type CollectionReference<
  T = DocumentData
> = firebase.firestore.CollectionReference<T>
type DocumentReference<T = DocumentData> = firebase.firestore.DocumentReference<
  T
>
type Query<T = DocumentData> = firebase.firestore.Query<T>
type DocumentChange<T = DocumentData> = firebase.firestore.DocumentChange<T>

let inited = false
const initFirestore = () => {
  if (!inited) {
    inited = true
    if (process.env.NODE_ENV !== 'production') {
      // Note that the Firebase Web SDK must connect to the WebChannel port
      const firestore = firebase.firestore()
      firestore.settings({
        host:
          process.env.FIRESTORE_EMULATOR_HOST ||
          process.env.REACT_APP_FIRESTORE_EMULATOR_HOST ||
          'localhost:8080',
        ssl: false,
      })
      firestore.enablePersistence()
    }
  }
}

setCallOnAppInitialize(initFirestore)
let queryParamKey: string
const determineQueryParamKey = (query: Query) => {
  const k = Object.keys(query).find((p) =>
    ['limit', 'startAt', 'path'].every((k) => k in (query as any)[p]),
  )
  if (!k) throw new Error('could not detemine QueryParam key')
  queryParamKey = k
}
export const getQueryInfo = <T>(
  query: Query<T> | CollectionReference<T> | DocumentReference<T>,
) => {
  if (query instanceof firebase.firestore.Query) {
    if (!queryParamKey) determineQueryParamKey(query)
    return (query as any)[queryParamKey]
  } else if (query instanceof firebase.firestore.DocumentReference) {
  }
}

export const getQueryName = <T>(
  query: Query<T> | CollectionReference<T> | DocumentReference<T>,
) => {
  if (query instanceof firebase.firestore.DocumentReference) {
    return query.path
  }
  return getQueryInfo(query).toString()
}

interface Load {
  <T>(query: Query<T> | CollectionReference<T>): Promise<QuerySnapshot<T>>
  <T>(query: DocumentReference<T>): Promise<DocumentSnapshot<T>>
}
const load: Load = <T>(
  ref: Query<T> | CollectionReference<T> | DocumentReference<T>,
) => {
  return new Promise<QuerySnapshot<T> | DocumentSnapshot<T>>(
    (resolve, reject) => {
      const unsub = (ref.onSnapshot as any)(
        { includeMetadataChanges: true },
        {
          next: (snap: QuerySnapshot<T> | DocumentSnapshot<T>) => {
            if (!snap.metadata.fromCache) {
              resolve(snap)
              unsub()
            }
          },
          error: (error: Error) => {
            reject(error)
            unsub()
          },
        },
      )
    },
  ) as any
}

export type QueryState<T = DocumentData> = {
  data: { [id: string]: T | null }
  snap: { [id: string]: QueryDocumentSnapshot<T> }
  ordered: string[]
  error?: Error
}

export type DocState<T> = {
  data?: T | null
  snap: DocumentSnapshot<T>
  exists?: boolean
  error?: Error
}

type QueryAction<T = DocumentData> =
  | DocumentChange<T>
  | DocumentChange<T>[]
  | { type: 'error'; error: Error }
const docChangeReducer = <T = DocumentData>(
  state: QueryState<T> = { data: {}, snap: {}, ordered: [] },
  action: QueryAction<T>,
): QueryState<T> => {
  if (action instanceof Array) {
    return action.reduce(docChangeReducer, state)
  }

  switch (action.type) {
    case 'added':
      const newOrdered = [...state.ordered]
      newOrdered.splice(action.newIndex, 0, action.doc.id)
      return {
        data: { ...state.data, [action.doc.id]: action.doc.data() as T },
        snap: { ...state.snap, [action.doc.id]: action.doc },
        ordered: newOrdered,
      }
    case 'removed':
      const newOrderedRem = [...state.ordered]
      newOrderedRem.splice(action.oldIndex, 1)
      return {
        ordered: newOrderedRem,
        snap: omit(state.snap, action.doc.id),
        data: omit(state.data, action.doc.id),
      }
    case 'modified':
      const newOrderedMod =
        action.newIndex === action.oldIndex
          ? state.ordered
          : ((ordered) => {
              ordered.splice(action.oldIndex, 1)
              ordered.splice(action.newIndex, 0, action.doc.id)
              return ordered
            })([...state.ordered])

      return {
        data: { ...state.data, [action.doc.id]: action.doc.data() as T },
        snap: { ...state.snap, [action.doc.id]: action.doc },
        ordered: newOrderedMod,
      }
    default:
      return state
  }
}

export const setQueryListener = createListenerCreator({
  initializer: (ref: Query, dispatch: Dispatch<QueryAction>) => {
    const unsub = ref.onSnapshot({
      next: (snap) => {
        dispatch(snap.docChanges())
      },
      error: (e) => {
        dispatch({ type: 'error', error: e })
      },
    })
    return {
      unsub,
      stateReducer: docChangeReducer,
    }
  },
  serializer: (ref: Query) => getQueryName(ref),
} as any)

type DocAction<T = DocumentData> =
  | { doc: DocumentSnapshot<T> }
  | { error: Error }
const docReducer = <T = DocumentData>(
  state: any,
  action: DocAction<T>,
): DocState<T> => {
  if ('error' in action) {
    return {
      ...state,
      error: action.error,
    }
  }
  return {
    snap: action.doc,
    data: action.doc.exists ? (action.doc.data() as T) : null,
    exists: action.doc.exists,
  }
}

export const setDocumentListener = createListenerCreator({
  initializer: (ref: DocumentReference, dispatch: Dispatch<DocAction>) => {
    return {
      unsub: ref.onSnapshot({
        next: (snap) => {
          dispatch({ doc: snap })
        },
        error: (e) => {
          dispatch({ error: e })
        },
      }),
      stateReducer: docReducer,
    }
  },
  serializer: (ref: DocumentReference) => getQueryName(ref),
} as any)

type StateKey = keyof QueryState<any>

interface DataHook<T> {
  (id: string | null): T | null
  (): { [id: string]: T }
}

export const makeQueryListener = <
  T = firebase.firestore.DocumentData,
  Arg extends Array<any> = []
>(
  useArg: (
    ...arg: Arg
  ) =>
    | firebase.firestore.Query
    | firebase.firestore.CollectionReference
    | undefined,
) => {
  return (...arg: Arg) => {
    const callbackRef = React.useRef<
      Partial<Record<StateKey | 'subscribe', Set<(q: any) => void>>>
    >({
      ordered: new Set(),
      data: new Set(),
      error: new Set(),
      subscribe: new Set(),
    })
    const stateRef = React.useRef<QueryState<T>>()
    const query = useArg(...arg)
    React.useEffect(() => {
      ReactDOM.unstable_batchedUpdates(() => {
        forEach(callbackRef.current, (st) => st?.forEach((fn) => fn(undefined)))
      })
      if (query) {
        return setQueryListener(query, (state: any) => {
          ReactDOM.unstable_batchedUpdates(() => {
            stateRef.current = state
            callbackRef.current.subscribe?.forEach((fn) => fn(stateRef.current))
            forEach(state, (v, k) => {
              const fnSet = callbackRef.current[k as StateKey]
              fnSet?.forEach((fn) => fn(v))
            })
          })
        })
      }
    }, [query && getQueryName(query)])
    return React.useMemo(
      () => ({
        useOrdered: () => {
          const [state, setState] = React.useState<string[]>()
          React.useEffect(() => {
            const caller = (state: QueryState<T>) => {
              setState(state?.ordered)
            }
            stateRef.current && caller(stateRef.current)

            callbackRef.current.subscribe?.add(caller)
            return () => {
              callbackRef.current.subscribe?.delete(caller)
            }
          }, [])
          return state
        },

        useData: ((id?: string | null) => {
          const [state, setState] = React.useState<
            { [id: string]: T | null } | T | null | undefined
          >()
          React.useEffect(() => {
            setState(undefined)
            if (id === null) {
              return
            }
            const caller = (state: QueryState<T>) => {
              if (id) {
                setState(state.data[id])
              } else {
                setState(state.data)
              }
            }
            stateRef.current && caller(stateRef.current)
            callbackRef.current.subscribe?.add(caller)
            return () => {
              callbackRef.current.subscribe?.delete(caller)
            }
          }, [id])
          return state
        }) as DataHook<T>,

        useSubscribe: (
          callback: (state: QueryState<T>) => void,
          deps: any[],
        ) => {
          const inCallbackRef = React.useRef(callback)
          inCallbackRef.current = callback
          React.useEffect(() => {
            const caller = (state: QueryState<T>) =>
              inCallbackRef.current(state)
            stateRef.current && caller(stateRef.current)
            callbackRef.current.subscribe?.add(caller)
            return () => {
              callbackRef.current.subscribe?.delete(caller)
            }
          }, deps)
        },
      }),
      [],
    )
  }
}

export const makeQueryGetter = <
  T = firebase.firestore.DocumentData,
  Arg extends Array<any> = []
>(
  useArg: (
    ...arg: Arg
  ) =>
    | firebase.firestore.Query
    | firebase.firestore.CollectionReference
    | undefined,
) => {
  return (...arg: Arg) => {
    const query = useArg(...arg)
    const [ended, setEnded] = React.useState(false)
    const [atStart, setAtStart] = React.useState(false)
    const [isWorking, setWorking] = React.useState(false)
    const [error, setError] = React.useState<Error>()
    const [snap, setSnap] = React.useState<firebase.firestore.QuerySnapshot>()
    const [docSnapArray, setDocSnap] = React.useState<
      firebase.firestore.QueryDocumentSnapshot[]
    >([])

    const loadStart = React.useCallback(async () => {
      if (!query) return
      setWorking(true)
      try {
        const newSnap = await load(query)
        setAtStart(true)
        if (newSnap.size) {
          setDocSnap(newSnap.docs)
        }
        const queryInfo = getQueryInfo(query)
        if (queryInfo.limit && newSnap.size >= queryInfo.limit) {
          setEnded(true)
        }
      } catch (e) {
        setError(e)
      } finally {
        setWorking(false)
      }
    }, [query && getQueryName(query)])

    const loadNext = React.useCallback(async () => {
      if (!query) return
      setWorking(true)
      try {
        const nextSnap = docSnapArray[docSnapArray.length - 1]
        const nextQuery = nextSnap ? query.startAfter(nextSnap) : query

        const newSnap = await load(nextQuery)
        if (newSnap.size) {
          setDocSnap(newSnap.docs)
          setAtStart(false)
        }
        const queryInfo = getQueryInfo(nextQuery)
        if (!queryInfo.limit || newSnap.size < queryInfo.limit) {
          setEnded(true)
        }
      } catch (e) {
        setError(e)
      } finally {
        setWorking(false)
      }
    }, [query && getQueryName(query), docSnapArray])

    const loadAppend = React.useCallback(async () => {
      if (!query) return
      setWorking(true)
      try {
        const nextSnap = docSnapArray[docSnapArray.length - 1]
        const nextQuery = nextSnap ? query.startAfter(nextSnap) : query
        const newSnap = await nextQuery.get()
        if (newSnap.size) {
          setDocSnap((s) => [...s, ...newSnap.docs])
        }
        const queryInfo = getQueryInfo(nextQuery)

        if (!queryInfo.limit || newSnap.size < queryInfo.limit) {
          setEnded(true)
        }
      } catch (e) {
        setError(e)
      } finally {
        setWorking(false)
      }
    }, [query && getQueryName(query), docSnapArray])

    const allData = React.useMemo(() => {
      const ordered = docSnapArray.map((docSnap) => docSnap.id)
      const data = docSnapArray.reduce(
        (acc, docSnap) => ({ ...acc, [docSnap.id]: docSnap.data() }),
        {},
      ) as { [id: string]: T }
      return {
        ordered,
        data,
        useOrdered: () => ordered,
        useData: (id?: string | null) => {
          if (id === null) return undefined
          if (id === undefined) return data
          return data[id]
        },
      }
    }, [docSnapArray])

    React.useEffect(() => {
      if (query) {
        loadStart()
      }
    }, [query && getQueryName(query)])
    return {
      loadStart,
      loadAppend,
      loadNext,
      ...allData,
      ended,
      atStart,
      isWorking,
      error,
    }
  }
}

type DocStateKey = keyof DocState<any>

export const makeDocumentListener = <T = firebase.firestore.DocumentData>(
  useArg: (
    ...arg: any[]
  ) =>
    | firebase.firestore.DocumentReference
    | undefined
    | ((
        firestore: firebase.firestore.Firestore,
      ) => firebase.firestore.DocumentReference | undefined),
) => {
  return (...arg: any[]) => {
    const callbackRef = React.useRef<
      Partial<Record<DocStateKey, (q: any) => void>>
    >({})
    const prequery = useArg(...arg)
    const query =
      typeof prequery === 'function' ? prequery(firebase.firestore()) : prequery
    React.useEffect(() => {
      ReactDOM.unstable_batchedUpdates(() => {
        forEach(callbackRef.current, (fn) => fn && fn(undefined))
      })
      if (query) {
        return setDocumentListener(query, (state: any) => {
          ReactDOM.unstable_batchedUpdates(() => {
            forEach(state, (v, k) => {
              const fn = callbackRef.current[k as DocStateKey]
              fn && fn(v)
            })
          })
        })
      }
    }, [query && getQueryName(query)])
    return React.useMemo(
      () => ({
        useData: () => {
          const [state, setState] = React.useState<T>()
          callbackRef.current.data = setState
          return state as T | null | undefined
        },
        useError: () => {
          const [state, setState] = React.useState<Error>()
          callbackRef.current.error = setState
          return state
        },
        useSnap: () => {
          const [state, setState] = React.useState<
            firebase.firestore.DocumentSnapshot
          >()
          callbackRef.current.snap = setState
          return state
        },
        useExists: () => {
          const [state, setState] = React.useState<boolean>()
          callbackRef.current.exists = setState
          return state
        },
      }),
      [],
    )
  }
}
