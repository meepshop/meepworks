import React from 'react'
import { Component } from '../../../source'

import {
  FetchUser,
  CreateUser
} from './admin-action'

export default class AdminView extends Component {

  constructor() {
    super()
    this.onGetUser = () => this._onGetUser()
    this.onCreateUser = () => this._onCreateUser()
  }

  componentDidMount() {
    console.log('Admin component mounted !')
  }

  componentWillUnmount() {
    console.log('Admin component unmounted !')
  }

  _onGetUser() {
    this.runAction(new FetchUser)
  }

  _onCreateUser() {
    this.runAction(new CreateUser)
  }

  render() {
    return (
      <div>
        <div>This is AdminViewer</div>
        <button
          onClick={ this.onGetUser }>Get Users</button>
        <button
          onClick={ this.onCreateUser }>Create Users</button>
      </div>
    )
  }
}
