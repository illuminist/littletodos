import Router from 'next/router'
import { History } from 'history'

const bindNextRouter = (history: History) => {
  Router.events.on('routeChangeComplete', (url) => {
    history.push(url)
  })
}

export default bindNextRouter
