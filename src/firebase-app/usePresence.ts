import * as React from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { useFirebaseUser } from './auth'

export const usePresense = ({
  onOnline,
}: Partial<{
  onOnline: (user: firebase.User | null) => void
  onOffline: () => void
}> = {}) => {
  const database = firebase.database()
  const user = useFirebaseUser()
  const uid = user?.uid

  // We'll create two constants which we will write to
  // the Realtime database when this device is offline
  // or online.

  // Create a reference to the special '.info/connected' path in
  // Realtime Database. This path returns `true` when connected
  // and `false` when disconnected.
  React.useEffect(() => {
    if (uid) {
      const userStatusDatabaseRef = database.ref('/ustatus/' + uid)
      const isOfflineForDatabase = {
        online: false,
        lastChanged: firebase.database.ServerValue.TIMESTAMP,
      }

      const isOnlineForDatabase = {
        online: true,
        lastChanged: firebase.database.ServerValue.TIMESTAMP,
      }

      const ref = database.ref('.info/connected')
      const handler = (snapshot: firebase.database.DataSnapshot) => {
        // If we're not currently connected, don't do anything.
        if (snapshot.val() == false) {
          return
        }

        // If we are currently connected, then use the 'onDisconnect()'
        // method to add a set which will only trigger once this
        // client has disconnected by closing the app,
        // losing internet, or any other means.
        userStatusDatabaseRef
          .onDisconnect()
          .set(isOfflineForDatabase)
          .then(function () {
            onOnline && onOnline(firebase.auth().currentUser)

            // The promise returned from .onDisconnect().set() will
            // resolve as soon as the server acknowledges the onDisconnect()
            // request, NOT once we've actually disconnected:
            // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

            // We can now safely set ourselves as 'online' knowing that the
            // server will mark us as offline once we lose connection.
            return userStatusDatabaseRef.set(isOnlineForDatabase)
          })
      }

      ref.on('value', handler)
      return () => {
        ref.off('value', handler)
      }
    }
  }, [uid])
}

export default usePresense
