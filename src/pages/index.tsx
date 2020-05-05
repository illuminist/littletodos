import * as React from 'react'
import { NextPage } from 'next'
import SignInPage from 'components/SignInPage'
import TodoBoard from 'components/TodoBoard'
import { useFirebaseUser } from 'firebase-app/auth'
import AppLoading from 'components/AppLoading'

export const IndexPage: NextPage = () => {
  const user = useFirebaseUser()

  return !process.browser || user === undefined ? (
    <AppLoading />
  ) : user === null ? (
    <SignInPage showLogo />
  ) : (
    <TodoBoard />
  )
}

export default IndexPage
