import firebase from 'firebase/app'
import { handleAppInitialize } from './common-pool'

export const initFirebase = (firebaseConfig: object, appName = '[DEFAULT]') => {
  if (firebase.apps.find((app) => app.name === appName)) {
    return firebase
  }

  const firebaseConfig2 =
    process.env.NODE_ENV !== 'production' &&
    typeof window !== 'undefined' &&
    window?.location?.hostname === 'localhost'
      ? {
          ...firebaseConfig,
          databaseURL:
            'http://localhost:9000?ns=' + (firebaseConfig as any).projectId,
        }
      : firebaseConfig

  firebase.initializeApp(
    firebaseConfig2,
    appName === '[DEFAULT]' ? undefined : appName,
  )

  handleAppInitialize()

  // firebase.auth().onAuthStateChanged(user => {
  //   if (user && isBrowser()) {
  //     initMessaging(user)
  //   }
  // })

  if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
    // require('firebase/performance')
    window.firebase = firebase
  }

  return firebase
}
