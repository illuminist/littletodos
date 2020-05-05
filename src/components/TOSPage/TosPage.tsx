import _ from 'lodash'
import clsx from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'

export interface TosPageProps {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
}

export const TosPage: React.FC<TosPageProps> = (props) => {
  const classes = useStyles(props)
  const { className } = props

  return (
    <Container maxWidth="md" className={clsx(className, classes.root)}>
      <Typography variant="h4">Terms and Conditions</Typography>
      <Typography variant="h5">Introduction</Typography>
      <Typography variant="body1" paragraph>
        Little Todos is a web application developed by Witsarut Sawetkanit,
        hosting on Firebase Hosting server.
      </Typography>
      <Typography variant="body1" paragraph>
        These Terms will be applied fully and affect to your use of this web
        application. By using this web application, you agreed to accept all
        terms and conditions written in here. You must not use this web
        application if you disagree with any of these Terms and Conditions.
      </Typography>
      <Typography variant="h5">MIT License</Typography>
      <Typography variant="body1" paragraph>
        Copyright (c) 2020 Witsarut Sawetkanit
      </Typography>
      <Typography variant="body1" paragraph>
        Permission is hereby granted, free of charge, to any person obtaining a
        copy of this software and associated documentation files (the
        "Software"), to deal in the Software without restriction, including
        without limitation the rights to use, copy, modify, merge, publish,
        distribute, sublicense, and/or sell copies of the Software, and to
        permit persons to whom the Software is furnished to do so, subject to
        the following conditions: The above copyright notice and this permission
        notice shall be included in all copies or substantial portions of the
        Software.
      </Typography>
      <Typography variant="body1" paragraph>
        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
        OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
        IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
        CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
        TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
        SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
      </Typography>
      <Typography variant="h5">Changes to This Terms and Conditions</Typography>
      <Typography variant="body1" paragraph>
        I may update our Terms and Conditions from time to time. Thus, you are
        advised to review this page periodically for any changes. I will notify
        you of any changes by posting the new Terms and Conditions on this page.
      </Typography>
      <Typography variant="body1" paragraph>
        These terms and conditions are effective as of 2020-05-04
      </Typography>
      <Typography variant="h5">Contact Us</Typography>
      <Typography variant="body1" paragraph>
        If you have any questions or suggestions about my Terms and Conditions,
        do not hesitate to contact me at Nomadn.
      </Typography>
    </Container>
  )
}

TosPage.defaultProps = {}

export default TosPage
