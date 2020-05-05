import firebase from 'firebase/app'

export type Timestamp = firebase.firestore.Timestamp | Date

export type Todo = {
  text: string
  type: 'checkbox'
  checked: boolean
}

export type UserTodo = {
  ordered: string[]
}

export type TodoList = {
  createdDate: Timestamp
  title?: string
  note?: string
  ownerId: string
  sharing: 'private' | 'public'
  colorPrimary: string
  colorSecondary: string
  todoIds: string[]
  archivedIds: string[]
  todoData: { [id: string]: Todo }
}
