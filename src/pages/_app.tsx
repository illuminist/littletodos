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

  return (
    <Router>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Head>
            <title>Little Todos</title>
            <meta name="description" content="Simple checklist app" />
          </Head>
          <AppLayout>
            <SnackbarProvider>
              <PersistGate persistor={persistor}>
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
