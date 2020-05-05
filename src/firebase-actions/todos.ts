import firebase from 'firebase/app'
import 'firebase/firestore'
import { TodoList, Todo, UserTodo } from 'types/data'
import { sleep } from 'utils/helpers'

export const updateCard = async (
  listId: string,
  settings: Partial<Pick<TodoList, 'colorPrimary' | 'title'>>,
) => {
  const firestore = firebase.firestore()
  const todoRef = firestore.collection('todos').doc(listId)
  await todoRef.update(settings)
}

export const deleteCard = async (listId: string) => {
  const auth = firebase.auth()
  if (!auth.currentUser) return
  const firestore = firebase.firestore()
  const userTodoRef = firestore
    .collection('userTodos')
    .doc(auth.currentUser.uid)
  await userTodoRef.update({
    ordered: firebase.firestore.FieldValue.arrayRemove(listId),
    lastRemovedId: listId,
  })
}

const initialTodo: Todo = {
  checked: false,
  text: '',
  type: 'checkbox',
}

const initialCard: TodoList = {
  colorPrimary: '',
  colorSecondary: '',
  ownerId: '',
  sharing: 'private',
  note: '',
  createdDate: (firebase.firestore.FieldValue.serverTimestamp() as unknown) as Date,
  title: '',
  todoData: {},
  todoIds: [],
  archivedIds: [],
}

export const addCard = async () => {
  const firestore = firebase.firestore()
  const auth = firebase.auth()
  if (!auth.currentUser) return

  const userTodoRef = firestore
    .collection('userTodos')
    .doc(auth.currentUser.uid)

  const todosRef = firestore.collection('todos')
  const todoRef = await todosRef.add({
    ...initialCard,
    ownerId: auth.currentUser.uid,
  })

  await userTodoRef.set(
    {
      ordered: firebase.firestore.FieldValue.arrayUnion(todoRef.id),
    },
    { merge: true },
  )
  return todoRef.id
}

export const editTodo = (
  listId: string,
  id: string | null,
  text: string = '',
) => {
  const firestore = firebase.firestore()
  const ref = firestore.collection('todos').doc(listId)

  if (id) {
    ref.update({
      todoIds: firebase.firestore.FieldValue.arrayUnion(id),
      ['todoData.' + id]: { ...initialTodo, text },
    })
  } else {
    const id = firestore.collection('todos').doc().id
    ref.update({
      todoIds: firebase.firestore.FieldValue.arrayUnion(id),
      ['todoData.' + id]: { ...initialTodo, text },
    })
  }
}

export const deleteTodo = async (listId: string, todoId: string) => {
  const firestore = firebase.firestore()
  const ref = firestore.collection('todos').doc(listId)
  await ref.update({
    ordered: firebase.firestore.FieldValue.arrayRemove(todoId),
    ['todoData.' + todoId]: firebase.firestore.FieldValue.delete(),
  })
}

export const checkTodo = () => {}

export const rearrangeCard = async (args: {
  listId: string
  sourceIndex: number
  targetIndex: number
}) => {
  const { listId, sourceIndex, targetIndex } = args
  const auth = firebase.auth()
  if (!auth.currentUser) return

  if (sourceIndex !== targetIndex) {
    const firestore = firebase.firestore()
    const userTodoRef = firestore
      .collection('userTodos')
      .doc(auth.currentUser.uid)

    await firestore.runTransaction(async (t) => {
      const targetSnap = await t.get(userTodoRef)
      const targetData = targetSnap.data() as UserTodo
      const idList = targetData.ordered
      idList.splice(sourceIndex, 1)
      idList.splice(targetIndex, 0, listId)
      t.update(userTodoRef, { ordered: idList })
    })
  }
}

export const rearrangeTodo = async (args: {
  sourceId: string
  sourceIndex: number
  targetId: string
  targetIndex: number
  todoId: string
}) => {
  const { todoId, sourceId, sourceIndex, targetId, targetIndex } = args

  if (
    targetId &&
    typeof targetIndex === 'number' &&
    (targetId !== sourceId || targetIndex !== sourceIndex)
  ) {
    const firestore = firebase.firestore()
    const sourceRef = firestore.collection('todos').doc(sourceId)
    const targetRef = firestore.collection('todos').doc(targetId)

    if (targetId === sourceId) {
      let idList: string[]
      await firestore.runTransaction(async (t) => {
        const targetSnap = await t.get(targetRef)
        const targetData = targetSnap.data() as TodoList
        idList = targetData.todoIds
        idList.splice(sourceIndex, 1)
        idList.splice(targetIndex, 0, todoId)
        t.update(targetRef, { todoIds: idList })
      })
      await sleep(1000)
    } else {
      await firestore.runTransaction(async (t) => {
        const [sourceSnap, targetSnap] = await Promise.all([
          t.get(sourceRef),
          t.get(targetRef),
        ])

        const sourceData = sourceSnap.data() as TodoList
        const sourceIdList = sourceData.todoIds
        sourceIdList.splice(sourceIndex, 1)
        const targetData = targetSnap.data() as TodoList
        const targetIdList = targetData.todoIds
        targetIdList.splice(targetIndex, 0, todoId)
        const itemData = sourceData.todoData[todoId]
        t.update(sourceRef, {
          todoIds: sourceIdList,
          [`todoData.${todoId}`]: firebase.firestore.FieldValue.delete(),
        })
        t.update(targetRef, {
          todoIds: targetIdList,
          [`todoData.${todoId}`]: itemData,
        })
      })
      await sleep(1000)
    }
  }
}
