import React from 'react'
import ReactDOM from 'react-dom'
import Router from 'react-router'

import createBrowserHistory from 'history/lib/createBrowserHistory'

import ApplicationContext from '../../source/application-context'

import Test from './Test/test-route'

const ctx = new ApplicationContext({})
const routes = new Test(ctx).routes

const _onError = (err) => {
  ctx.emit('error', err)
}
const _onUpdate = () => {
  ctx.init = true
}

ReactDOM.render(
  <Router
    history={ createBrowserHistory() }
    onError={ _onError }
    routes={ routes }
    onUpdate={ _onUpdate } />
  , document.getElementById('app'))
