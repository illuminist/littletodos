import firebase from 'firebase/app'
import { FormikBag, FormikHelpers } from 'formik'

const fields = ['password', 'email', 'phone'] as const
type Field = typeof fields[number]

const errorCodePerField: {
  [code: string]: Field | null
} = {
  // 'auth/claims-too-large': null,
  'auth/email-already-exists': 'email',
  // 'auth/id-token-expired': null,
  // 'auth/id-token-revoked': null,
  // 'auth/insufficient-permission': null,
  // 'auth/internal-error': null,
  // 'auth/invalid-argument': null,
  // 'auth/invalid-claims': null,
  // 'auth/invalid-continue-uri': null,
  // 'auth/invalid-creation-time': null,
  // 'auth/invalid-credential': null,
  // 'auth/invalid-disabled-field': null,
  // 'auth/invalid-display-name': null,
  // 'auth/invalid-dynamic-link-domain': null,
  'auth/invalid-email': 'email',
  // 'auth/invalid-email-verified': null,
  // 'auth/invalid-hash-algorithm': null,
  // 'auth/invalid-hash-block-size': null,
  // 'auth/invalid-hash-derived-key-length': null,
  // 'auth/invalid-hash-key': null,
  // 'auth/invalid-hash-memory-cost': null,
  // 'auth/invalid-hash-parallelization': null,
  // 'auth/invalid-hash-rounds': null,
  // 'auth/invalid-hash-salt-separator': null,
  // 'auth/invalid-id-token': null,
  // 'auth/invalid-last-sign-in-time': null,
  // 'auth/invalid-page-token': null,
  'auth/invalid-password': 'password',
  // 'auth/invalid-password-hash': null,
  // 'auth/invalid-password-salt': null,
  'auth/invalid-phone-number': 'phone',
  // 'auth/invalid-photo-url': null,
  // 'auth/invalid-provider-data': null,
  // 'auth/invalid-provider-id': null,
  // 'auth/invalid-session-cookie-duration': null,
  // 'auth/invalid-uid': null,
  // 'auth/invalid-user-import': null,
  // 'auth/maximum-user-count-exceeded': null,
  // 'auth/missing-android-pkg-name': null,
  // 'auth/missing-continue-uri': null,
  // 'auth/missing-hash-algorithm': null,
  // 'auth/missing-ios-bundle-id': null,
  // 'auth/missing-uid': null,
  // 'auth/operation-not-allowed': null,
  // 'auth/phone-number-already-exists': null,
  // 'auth/project-not-found': null,
  // 'auth/reserved-claims': null,
  // 'auth/session-cookie-expired': null,
  // 'auth/session-cookie-revoked': null,
  // 'auth/uid-already-exists': null,
  // 'auth/unauthorized-continue-uri': null,
  'auth/user-not-found': 'email',
  'auth/weak-password': 'password',
  'auth/wrong-password': 'password',
}

export const mapFirebaseAuthErrorToFormik = (
  error: firebase.auth.Error,
  formik: FormikHelpers<Record<Field, string>>,
) => {
  const field = errorCodePerField[error.code]
  if (field) {
    formik.setFieldError(field, error.message)
    return true
  }
  return false
}
