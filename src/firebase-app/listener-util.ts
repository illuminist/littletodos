import { callOnAuthClear } from './common-pool'

export type Dispatch<Action> = (action: Action) => void

export type UnsubFunction = () => void

export type StoreFoundation<State, Action> = {
  unsub: () => void
  state?: State
  stateReducer: (state: State, action: Action) => State
  dispatch: Dispatch<Action>
  callbacks: Set<(arg: State) => void>
  timer?: ReturnType<typeof setTimeout>
  handleClearOnLogout?: () => void
}

export type ListenCreatorOptions<Query, State, Action, SL> = {
  initializer: (
    ref: Query,
    dispatch: (action: Action) => void,
  ) => Omit<StoreFoundation<State, Action>, 'dispatch' | 'callbacks' | 'timer'>
  serializer?: (ref: Query) => SL
  removalTime?: number
  clearOnLogout?: boolean
}

export const createListenerCreator = <Query, State, Action, SL>({
  initializer,
  serializer,
  removalTime = 5000,
  clearOnLogout,
}: ListenCreatorOptions<Query, State, Action, SL>) => {
  const storeAll = new Map<SL | Query, StoreFoundation<State, Action>>()

  return (ref: Query, callback: (state: State) => void): UnsubFunction => {
    const key = serializer ? serializer(ref) : ref
    if (!storeAll.has(key)) {
      const actionList: Action[] = []
      const dispatch = (action: Action) => {
        actionList.push(action)
        if (actionList.length === 1)
          setTimeout(() => {
            const store = storeAll.get(key)!
            store.state = useMultiAction(store.stateReducer)(
              store.state!,
              multiAction(actionList) as any,
            )
            actionList.splice(0, actionList.length)
            store.callbacks.forEach((fn) => fn(store.state!))
          }, 15)
      }
      storeAll.set(key, {
        dispatch,
        callbacks: new Set(),
        ...initializer(ref, dispatch),
        ...(clearOnLogout && {
          handleClearOnLogout: callOnAuthClear(() => {
            const store = storeAll.get(key)!
            store.unsub()
            delete store.unsub
          }),
        }),
      })
    }
    const store = storeAll.get(key)!

    store.timer && clearTimeout(store.timer)
    delete store.timer

    store.callbacks.add(callback)
    if (store.state) callback(store.state)

    return () => {
      store.callbacks.delete(callback)
      store.timer && clearTimeout(store.timer)
      store.timer = setTimeout(() => {
        if (store.callbacks.size <= 0 && store.unsub) {
          store.unsub()
          store.handleClearOnLogout && store.handleClearOnLogout()
          storeAll.delete(key)
        }
      }, removalTime)
    }
  }
}

export const multiAction = <Action>(actions: Action[]) => {
  return { type: '@MULTIACTION', payload: actions }
}
export const useMultiAction = <State, Action>(
  reducer: (state: State, action: Action) => State,
) => (
  state: State,
  action: { type: '@MULTIACTION'; payload: Action[] } | Action,
) => {
  if ('type' in action && action.type === '@MULTIACTION') {
    return action.payload.reduce(reducer, state)
  }
  return reducer(state, action as Action)
}
