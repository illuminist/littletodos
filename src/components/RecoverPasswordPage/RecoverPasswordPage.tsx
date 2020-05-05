import _ from 'lodash'
import clsx from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import Container from '@material-ui/core/Container'
import FormGroup from '@material-ui/core/FormGroup'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import firebase from 'firebase/app'
import { Formik, Form, Field, FormikHelpers } from 'formik'
import WorkButton from 'components/WorkButton'

export interface RecoverPasswordPageProps {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
}

type RecoverFields = {
  email: string
}
const initialRecoverField: RecoverFields = {
  email: '',
}

export const RecoverPasswordPage: React.FC<RecoverPasswordPageProps> = (
  props,
) => {
  const classes = useStyles(props)
  const { className } = props

  const [sentTo, setSentTo] = React.useState('')

  const handleSubmit = React.useCallback(
    async (data: RecoverFields, formik: FormikHelpers<RecoverFields>) => {
      const auth = firebase.auth()
      try {
        await auth.sendPasswordResetEmail(data.email)
      } catch (e) {}
      setSentTo(data.email)
    },
    [],
  )

  return (
    <Container maxWidth="sm" className={clsx(className, classes.root)}>
      <Formik initialValues={initialRecoverField} onSubmit={handleSubmit}>
        {(formik) => (
          <Form>
            <FormGroup>
              <Typography variant="h5">Password Recovery</Typography>
              <Typography variant="body1">
                Input your email of your account, we will send an instruction to
                your mail box for password recovering step.
              </Typography>
              <Field
                as={TextField}
                name="email"
                type="email"
                label="Email"
                margin="normal"
                variant="outlined"
                disabled={formik.isSubmitting}
              />
              <WorkButton
                type="submit"
                variant="contained"
                isWorking={formik.isSubmitting}
                disabled={!formik.values.email}>
                Send recovery mail
              </WorkButton>
            </FormGroup>
          </Form>
        )}
      </Formik>
      {sentTo && (
        <Typography variant="body1">
          An instruction email has been sent to {sentTo}. Please check if for
          junk mail if you don't recieve in your inbox.
        </Typography>
      )}
    </Container>
  )
}

RecoverPasswordPage.defaultProps = {}

export default RecoverPasswordPage
