import React from 'react'
import { initFirebase } from 'firebase-app/init'
import firebaseConfig from 'configs/firebase'
import 'firebase-app/firestore'
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from 'store'
import { Provider } from 'react-redux'
import { theme } from 'theme'
import AppLayout from 'components/AppLayout'
import { MemoryRouter } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'theme/ThemeProvider'
import { AppProps } from 'next/app'
import AppLoading from 'components/AppLoading'
import useOnlineStatus from 'firebase-app/useOnlineStatus'
import { SnackbarProvider } from 'notistack'
import Head from 'next/head'

const Router: React.ComponentType = process.browser
  ? BrowserRouter
  : MemoryRouter

initFirebase(firebaseConfig)

const App: React.FC<AppProps> = (props) => {
  const { Component, pageProps } = props

  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles)
    }
  }, [])

  useOnlineStatus()

  return (
    <Router>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Head>
            <title>Little Todos</title>
            <meta name="description" content="Simple checklist app" />
            <meta property="og:url" content="https://littletodos.web.app/" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content="Little Todos" />
            <meta
              property="og:description"
              content="Simple checklist web app"
            />
            <meta
              property="og:image"
              content="https://littletodos.web.app/littletodospreview.png"
            />
            {theme.palette?.primary && (
              <meta
                name="theme-color"
                content={
                  'main' in theme.palette.primary
                    ? theme.palette.primary.main
                    : theme.palette.primary[500]
                }
              />
            )}
            <link rel="apple-touch-icon" href="/logo-192.png" />
          </Head>
          <AppLayout>
            <SnackbarProvider>
              <PersistGate persistor={persistor} loading={<AppLoading />}>
                <Component {...pageProps} />
              </PersistGate>
            </SnackbarProvider>
          </AppLayout>
        </ThemeProvider>
      </Provider>
    </Router>
  )
}
export default App

type Bar = { a: number }
const foo = { fooKeyA: {} as Bar, fooKeyB: {} as Bar }
