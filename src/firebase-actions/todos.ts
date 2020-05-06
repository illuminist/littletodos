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
  const todoRef = firestore.collection('todos').doc(listId)
  Promise.all([
    userTodoRef.update({
      ordered: firebase.firestore.FieldValue.arrayRemove(listId),
      lastRemovedId: listId,
    }),
    todoRef.delete(),
  ])
  // await firestore.runTransaction(async (t) => {
  //   t.update(userTodoRef, {
  //     ordered: firebase.firestore.FieldValue.arrayRemove(listId),
  //     lastRemovedId: listId,
  //   })
  //   t.delete(todoRef)
  // })
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
  createdDate: new Date(),
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

  const todoRef = firestore.collection('todos').doc()
  todoRef.set({
    ...initialCard,
    ownerId: auth.currentUser.uid,
  })

  userTodoRef.set(
    {
      ordered: firebase.firestore.FieldValue.arrayUnion(todoRef.id),
    },
    { merge: true },
  )

  // const todosRef = firestore.collection('todos')
  // const todoRef = await todosRef.add({
  //   ...initialCard,
  //   ownerId: auth.currentUser.uid,
  // })

  // await userTodoRef.set(
  //   {
  //     ordered: firebase.firestore.FieldValue.arrayUnion(todoRef.id),
  //   },
  //   { merge: true },
  // )
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
  ref.update({
    ordered: firebase.firestore.FieldValue.arrayRemove(todoId),
    ['todoData.' + todoId]: firebase.firestore.FieldValue.delete(),
  })
}

export const checkTodo = () => {}

export const rearrangeCard = async (args: {
  listId: string
  sourceIndex: number
  targetIndex: number
  ordered: string[]
}) => {
  const { listId, sourceIndex, targetIndex, ordered } = args
  const auth = firebase.auth()
  if (!auth.currentUser) return

  if (sourceIndex !== targetIndex) {
    const firestore = firebase.firestore()
    const userTodoRef = firestore
      .collection('userTodos')
      .doc(auth.currentUser.uid)

    const idList = [...ordered]
    idList.splice(sourceIndex, 1)
    idList.splice(targetIndex, 0, listId)
    userTodoRef.update({ ordered: idList })
  }
}

export const rearrangeTodo = async (args: {
  sourceId: string
  sourceIndex: number
  sourceList: TodoList
  targetId: string
  targetIndex: number
  targetList: TodoList
  todoId: string
}) => {
  const {
    todoId,
    sourceId,
    sourceIndex,
    sourceList,
    targetId,
    targetIndex,
    targetList,
  } = args

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
      idList = targetList.todoIds
      idList.splice(sourceIndex, 1)
      idList.splice(targetIndex, 0, todoId)
      targetRef.update({ todoIds: idList })
      await sleep(1000)
    } else {
      const sourceIdList = sourceList.todoIds
      sourceIdList.splice(sourceIndex, 1)
      const targetIdList = targetList.todoIds
      targetIdList.splice(targetIndex, 0, todoId)
      const itemData = sourceList.todoData[todoId]
      sourceRef.update({
        todoIds: sourceIdList,
        [`todoData.${todoId}`]: firebase.firestore.FieldValue.delete(),
      })
      targetRef.update({
        todoIds: targetIdList,
        [`todoData.${todoId}`]: itemData,
      })
      await sleep(1000)
    }
  }
}
