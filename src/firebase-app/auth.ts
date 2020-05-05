import pick from 'lodash/pick'
import firebase from 'firebase/app'
import 'firebase/auth'
import { makeSubscription } from 'hooks/makeSubscription'
import { handleAuthClearCallback, setCallOnAppInitialize } from './common-pool'

const ProviderClasses = {
  'facebook.com': firebase.auth.FacebookAuthProvider,
  'google.com': firebase.auth.GoogleAuthProvider,
  'twitter.com': firebase.auth.TwitterAuthProvider,
  'github.com': firebase.auth.GithubAuthProvider,
}

export type AuthProvider = keyof typeof ProviderClasses

export const getProvider = (
  providerName: AuthProvider | string,
): firebase.auth.AuthProvider => {
  const providerClass =
    ProviderClasses[providerName as keyof typeof ProviderClasses]
  if (!providerClass) throw new Error('invalid-auth-provider')
  const provider = new providerClass()
  return provider
}

export type FirebaseUserData = Pick<
  firebase.User,
  | 'displayName'
  | 'email'
  | 'emailVerified'
  | 'isAnonymous'
  | 'metadata'
  | 'phoneNumber'
  | 'photoURL'
  | 'providerData'
  | 'providerId'
  | 'refreshToken'
  | 'tenantId'
  | 'uid'
>

let userCallback: ((user: FirebaseUserData | null) => void) | null = null
export const setUserCallback = (fn: (user: firebase.User | null) => void) => {
  userCallback = fn as (user: FirebaseUserData | null) => void
}
let claimCallback:
  | ((claims: firebase.auth.IdTokenResult | null | undefined) => void)
  | null = null
export const setClaimCallback = (
  fn: (claims: firebase.auth.IdTokenResult | null | undefined) => void,
) => {
  claimCallback = fn
}

export const assignUser = async () => {
  const user = firebase.auth().currentUser
  userCallback &&
    userCallback(
      user &&
        pick(user, [
          'displayName',
          'email',
          'emailVerified',
          'isAnonymous',
          'metadata',
          'phoneNumber',
          'photoURL',
          'providerData',
          'providerId',
          'refreshToken',
          'tenantId',
          'uid',
        ]),
    )
  if (user) {
    const claims = await user.getIdTokenResult(true)
    claimCallback && claimCallback(claims)
  } else {
    claimCallback && claimCallback(null)
  }
}

let inited = false
const initAuth = () => {
  if (inited) return
  inited = true
  const auth = firebase.auth()
  auth.onAuthStateChanged(assignUser)
  auth.onAuthStateChanged((user) => {
    if (!user) {
      handleAuthClearCallback()
    }
  })
}
setCallOnAppInitialize(initAuth)

export const linkAccountWithProvider = async (providerName: AuthProvider) => {
  const provider = getProvider(providerName)
  await firebase.auth().currentUser?.linkWithPopup(provider)
  await firebase.auth().updateCurrentUser(firebase.auth().currentUser)
  assignUser()
}

const {
  useSubsciption: useUserSubsciption,
  setValue: setUser,
} = makeSubscription<FirebaseUserData | null | undefined>(undefined)

const {
  useSubsciption: useClaimSubsciption,
  setValue: setClaim,
} = makeSubscription<firebase.auth.IdTokenResult | null | undefined>(undefined)

setClaimCallback(setClaim)
setUserCallback(setUser)

export const useFirebaseUser = useUserSubsciption
export const useUserClaims = useClaimSubsciption
