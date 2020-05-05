import _ from 'lodash'
import classNames from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import firebase from 'firebase/app'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Container from '@material-ui/core/Container'
import FormGroup from '@material-ui/core/FormGroup'
import Collapse from '@material-ui/core/Collapse'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import NextLink from 'next/link'
import useSubmitHandler from 'hooks/useSubmitHandler'
import WorkButton from 'components/WorkButton'
import { AuthProvider, getProvider } from 'firebase-app/auth'
import GoogleLogo from 'components/icons/GoogleLogo'
import { Formik, Form, Field, FormikHelpers } from 'formik'
import { mapFirebaseAuthErrorToFormik } from 'lib/mapFirebaseAuthErrorToFormik'
import { useSnackbar } from 'notistack'

type EmailForm = {
  email: string
  password: string
  confirmPassword: string
}
const initialEmailForm: EmailForm = {
  email: '',
  password: '',
  confirmPassword: '',
}

const sendResetEmail = async (email: string) => {
  const auth = firebase.auth()
  auth.sendPasswordResetEmail(email)
}

const EmailLogin = (props: { disabled?: boolean }) => {
  const classes = useStyles(props)

  const [registering, setRegistering] = React.useState(false)

  const { enqueueSnackbar } = useSnackbar()

  const {
    handleSubmit: handleSubmitEmail,
    isWorking,
    setWorking,
  } = useSubmitHandler(
    async (data: EmailForm, formik: FormikHelpers<EmailForm>) => {
      const auth = firebase.auth()
      if (registering) {
        if (data.password === data.confirmPassword) {
          await auth.createUserWithEmailAndPassword(data.email, data.password)
        } else {
          formik.setErrors({
            confirmPassword: 'password-not-match',
          })
          throw new Error('password-not-match')
        }
      } else {
        try {
          await auth.signInWithEmailAndPassword(data.email, data.password)
        } catch (e) {
          if (
            e.code &&
            e.code.startsWith('auth/') &&
            mapFirebaseAuthErrorToFormik(e, formik as any)
          ) {
            return
          }
          enqueueSnackbar(e.message || e.code, { variant: 'error' })
          throw e
        } finally {
          setWorking(false)
        }
      }
    },
    [registering],
  )

  return (
    <Formik initialValues={initialEmailForm} onSubmit={handleSubmitEmail}>
      {(formik) => {
        const makeProps = (name: keyof EmailForm) => ({
          name,
          error: Boolean(formik.errors[name]),
          helperText: formik.errors[name],
          disabled: formik.isSubmitting || isWorking,
        })
        return (
          <Form>
            <FormGroup>
              <Field
                as={TextField}
                type="email"
                {...makeProps('email')}
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <Field
                as={TextField}
                type="password"
                {...makeProps('password')}
                label="Password"
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <Collapse in={registering}>
                <Field
                  as={TextField}
                  type="password"
                  {...makeProps('confirmPassword')}
                  label="Confirm Password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
              </Collapse>
              <Collapse in={!registering}>
                <WorkButton
                  className={classes.authButton}
                  isWorking={formik.isSubmitting}
                  type="submit"
                  color="primary"
                  fullWidth
                  variant="contained">
                  Sign In
                </WorkButton>
              </Collapse>
              <Collapse in={registering}>
                <WorkButton
                  className={classes.authButton}
                  isWorking={formik.isSubmitting}
                  type="submit"
                  color="primary"
                  fullWidth
                  variant="contained">
                  Create an Account
                </WorkButton>
              </Collapse>
            </FormGroup>

            {!registering ? (
              <FormGroup>
                <NextLink href="/recover" passHref>
                  <Button component="a">Forgot Password?</Button>
                </NextLink>
                <Button onClick={() => setRegistering(true)}>
                  Create an account
                </Button>
              </FormGroup>
            ) : (
              <FormGroup>
                <Button onClick={() => setRegistering(false)}>
                  Already have an account, signin here
                </Button>
                <span>&nbsp;</span>
              </FormGroup>
            )}
          </Form>
        )
      }}
    </Formik>
  )
}

export interface SignInPageProps {
  classes?: object
  className?: string
  size?: 'full' | 'half' | 'compact'
  showLogo?: boolean
}

export const SignInPage: React.FC<SignInPageProps> = (props) => {
  const classes = useStyles(props)
  const { className, size = 'full', showLogo } = props

  const [showEmail, setShowEmail] = React.useState(false)

  const {
    handleSubmit: handleSubmitAuth,
    isWorking: isWorking2,
  } = useSubmitHandler<AuthProvider>(async (providerName) => {
    const auth = firebase.auth()
    const provider = getProvider(providerName)
    await auth.signInWithPopup(provider)
  }, [])

  const isWorking = isWorking2
  return (
    <Container maxWidth="sm">
      <Card className={classNames(className, classes.root)} elevation={7}>
        <CardContent>
          {showLogo && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              marginBottom={3}>
              <Box display="flex" flexDirection="column">
                <span className={classes.kradanLogoTitle}>LittleTodos</span>
              </Box>
            </Box>
          )}
          {(size === 'full' || !showEmail) && (
            <FormGroup>
              <Button
                className={classNames(
                  classes.authButton,
                  classes.socialAuthButton,
                  classes.googleButton,
                )}
                variant="contained"
                onClick={() => handleSubmitAuth('google.com')}
                disabled={isWorking}>
                <GoogleLogo
                  className={classes.socialAuthButtonLogo}
                  classes={{ segment: classes.googleSegment }}
                />
                Signin with Google
              </Button>
            </FormGroup>
          )}
          {size === 'half' && showEmail && (
            <Button
              variant="contained"
              onClick={() => setShowEmail(false)}
              disabled={isWorking}
              fullWidth>
              {'Signin with Social Network account'}
            </Button>
          )}
          <div className={classes.divider}>
            <Divider className={classes.innerDivider} />
            <span className={classes.dividerText}>OR</span>
            <Divider className={classes.innerDivider} />
          </div>
          {size === 'half' && !showEmail && (
            <Button
              variant="contained"
              onClick={() => setShowEmail(true)}
              disabled={isWorking}
              fullWidth>
              {'Signin with Email'}
            </Button>
          )}
          {(size === 'full' || showEmail) && (
            <EmailLogin disabled={isWorking} />
          )}
        </CardContent>
        <div className={classes.cardFooter}>
          <NextLink href="/terms-and-conditions" passHref>
            <Link>Term and Conditions</Link>
          </NextLink>
          {' | '}
          <NextLink href="/privacy-policy" passHref>
            <Link>Privacy policy</Link>
          </NextLink>
        </div>
      </Card>
    </Container>
  )
}

SignInPage.defaultProps = {}

export default SignInPage
