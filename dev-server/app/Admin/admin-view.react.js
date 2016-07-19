import React from 'react'
import Component from '../../../source/component'

import {
  FetchData
} from './admin-action'

export default class AdminView extends Component {

  constructor() {
    super()
    this.onGetData = () => this._onGetData()
  }

  componentDidMount() {
    console.log('Admin component mounted !')
  }

  componentWillUnmount() {
    console.log('Admin component unmounted !')
  }

  async _onGetData() {
    this.runAction(new FetchData)
  }

  render() {
    return (
      <div>
        <div>This is AdminViewer</div>
        <button
          onClick={ this.onGetData }>Get Data</button>
      </div>
    )
  }
}
