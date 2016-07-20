import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory } from 'react-router'

import { ApplicationContext } from '../../source/'

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
    history={ browserHistory }
    onError={ _onError }
    routes={ routes }
    onUpdate={ _onUpdate } />
  , document.getElementById('app'))
