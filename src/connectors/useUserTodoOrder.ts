import { makeDocumentListener } from 'firebase-app/firestore'
import { useFirebaseUser } from 'firebase-app/auth'
import firebase from 'firebase/app'
import { UserTodo } from 'types/data'

const listener = makeDocumentListener<UserTodo>(() => {
  const user = useFirebaseUser()
  if (user) {
    return firebase.firestore().collection('userTodos').doc(user.uid)
  }
})

export default listener
