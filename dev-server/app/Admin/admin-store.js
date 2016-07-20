/* eslint no-use-before-define: 0 */
/* eslint no-console: 0 */

import { data } from './admin-mock'

import { Store } from '../../../source'
import { fromJS } from 'immutable'

// import dispatch action
import {
  FetchUser,
  CreateUser
} from './admin-action'

export default class AdminStore extends Store {
  constructor() {
    super()

    this.storeDisplayName = 'admin-store'
    this.data = fromJS(data)

    this.bindHandler(FetchUser, handleFetchUser)
    this.bindHandler(CreateUser, handleCreateUser)
  }

  get getState() {
    return this.data
  }
}

function trans_immutable_toJS(immutable) {
  return immutable.toJS()
}

function handleFetchUser() {
  if (this.getState) {
    const state = trans_immutable_toJS(this.getState)
    console.log(state)
  }
}

function handleCreateUser() {
  const old_data_len = this.data.getIn([ 'users' ]).size
  this.data = this.data.setIn([ 'users' ], this.data.getIn([ 'users' ]).push({ name: 'Hello', gender: 'World' }))
  if (old_data_len < this.data.getIn([ 'users' ]).size) {
    console.log(`update completed, size - ${this.getState.getIn([ 'users' ]).size}`)
  }
  this.changed()
}
