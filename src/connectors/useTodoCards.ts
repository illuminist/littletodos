import { makeQueryListener } from 'firebase-app/firestore'
import { TodoList } from 'types/data'
import firebase from 'firebase/app'

const listener = makeQueryListener<TodoList>(() => {
  return firebase.firestore().collection('todos')
})

export default listener
