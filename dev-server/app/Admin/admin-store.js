/* eslint no-use-before-define: 0 */
/* eslint no-console: 0 */

import Store from '../../../source/store'
import { Map } from 'immutable'

// import dispatch action
import {
  FetchData
} from './admin-action'

export default class AdminStore extends Store {
  constructor() {
    super()

    this.storeDisplayName = 'admin-store'
    this.data = Map({})

    this.bindHandler(FetchData, handleFetchData)
  }

  get getState() {
    return this.data
  }
}

function trans_immutable_toJS(immutable) {
  return immutable.toJS()
}

function handleFetchData() {
  if (this.getState) {
    const state = trans_immutable_toJS(this.getState)
    console.log(state)
  }
}
