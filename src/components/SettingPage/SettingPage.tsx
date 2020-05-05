import _ from 'lodash'
import clsx from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormGroup from '@material-ui/core/FormGroup'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { Formik, Field, Form, FormikHelpers } from 'formik'
import Router from 'next/router'
import { useFirebaseUser } from 'firebase-app/auth'
import firebase from 'firebase/app'
import SignInPage from 'components/SignInPage'
import useSubmitHandler from 'hooks/useSubmitHandler'
import WorkButton from 'components/WorkButton'
import { mapFirebaseAuthErrorToFormik } from 'lib/mapFirebaseAuthErrorToFormik'
import { useSnackbar } from 'notistack'

type PasswordChangeValues = {
  password: string
  confirmPassword: string
  oldPassword: string
}
const initialPasswordChangeValues: PasswordChangeValues = {
  password: '',
  confirmPassword: '',
  oldPassword: '',
}

const PasswordChange = () => {
  const user = useFirebaseUser()
  if (!user) return null

  const { enqueueSnackbar } = useSnackbar()

  const { handleSubmit, isWorking, setWorking, error } = useSubmitHandler(
    async (
      data: typeof initialPasswordChangeValues,
      formik: FormikHelpers<PasswordChangeValues>,
    ) => {
      const auth = firebase.auth()
      const user = auth.currentUser
      try {
        if (!user) throw new Error('not-loged-in')
        if (!user.email) throw new Error('no-associated-email')
        if (data.confirmPassword !== data.password)
          throw new Error('password-not-match')
        await auth.signInWithEmailAndPassword(user.email!, data.oldPassword)
        await user.updatePassword(data.password)
        enqueueSnackbar('Change password successfully', { variant: 'success' })
        formik.resetForm()
      } catch (e) {
        enqueueSnackbar(e.message || e.code, { variant: 'error' })
        if (e.message === 'password-not-match') {
          formik.setFieldError('confirmPassword', 'Password does not match')
        } else if (e.code?.startsWith('auth/')) {
          if (e.code === 'auth/wrong-password') {
            formik.setFieldError('oldPassword', e.message)
          } else if (!mapFirebaseAuthErrorToFormik(e, formik as any)) {
            throw e
          }
        } else {
          throw e
        }
      }
      setWorking(false)
    },
    [],
  )

  return (
    <Formik initialValues={initialPasswordChangeValues} onSubmit={handleSubmit}>
      {(formik) => {
        const getProps = (name: keyof PasswordChangeValues) => ({
          error: Boolean(formik.errors[name]),
          helperText: formik.errors[name],
          name,
          margin: 'normal' as const,
          variant: 'outlined' as const,
          as: TextField,
          type: 'password',
          disabled: formik.isSubmitting,
        })
        return (
          <Form>
            <FormGroup>
              <Typography variant="h5">Change Password</Typography>
              <Field {...getProps('oldPassword')} label="Old password" />
              <Field {...getProps('password')} label="New password" />
              <Field
                {...getProps('confirmPassword')}
                label="Confirm new password"
              />
              <WorkButton
                type="submit"
                disabled={
                  !formik.values.confirmPassword ||
                  !formik.values.password ||
                  !formik.values.oldPassword
                }
                isWorking={formik.isSubmitting}>
                Change password
              </WorkButton>
            </FormGroup>
          </Form>
        )
      }}
    </Formik>
  )
}

export interface SettingPageProps {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
}

export const SettingPage: React.FC<SettingPageProps> = (props) => {
  const classes = useStyles(props)
  const { className } = props

  const user = useFirebaseUser()

  if (user === undefined) {
    return <CircularProgress size={80} />
  }

  if (user === null) {
    return <SignInPage showLogo />
  }

  return (
    <Container maxWidth="sm" className={clsx(className, classes.root)}>
      <Typography variant="h4">Account</Typography>
      <Card>
        <CardContent>
          <Typography variant="h5">Email</Typography>
          <Typography variant="body1" gutterBottom>
            {user.email}
          </Typography>
          {user.providerData.map((provider) => {
            switch (provider?.providerId) {
              case 'password':
                return <PasswordChange key="password" />
              case 'google.com':
                return 'Linked with Google Account'
              default:
                return (
                  <React.Fragment key={provider?.providerId || 'wut?'}>
                    {provider?.providerId}
                  </React.Fragment>
                )
            }
          })}
        </CardContent>
      </Card>
    </Container>
  )
}

SettingPage.defaultProps = {}

export default SettingPage
