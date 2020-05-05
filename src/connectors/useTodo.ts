import { makeDocumentListener } from 'firebase-app/firestore'
import firebase from 'firebase/app'
import { TodoList } from 'types/data'

const listener = makeDocumentListener<TodoList>((id) => {
  return firebase.firestore().collection('todos').doc(id)
})

export default listener
