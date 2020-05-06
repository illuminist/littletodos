import * as React from 'react'
import firebase from 'firebase/app'
import 'firebase/database'

export const useOnlineStatus = ({
  onOnline,
}: Partial<{
  onOnline: () => void
  onOffline: () => void
}> = {}) => {
  React.useEffect(() => {
    const database = firebase.database()
    const ref = database.ref('.info')
    const handler = (snapshot: firebase.database.DataSnapshot) => {
      if (snapshot.val() == false) {
        return
      }
    }

    ref.on('value', handler)
    return () => {
      ref.off('value', handler)
    }
  }, [])
}

export default useOnlineStatus
