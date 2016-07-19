import Application from '../../../source/application'

import AdminComponent from './admin-view.react'

import AdminStore from './admin-store'

export default class Admin extends Application {
  get component() {
    return AdminComponent
  }

  get path() {
    return 'admin'
  }

  get childRoutes() {
    return []
  }

  get stores() {
    // must be added store if you wanna to update it.
    return [
      AdminStore
    ]
  }

  get locale() {
    return {}
  }

  get dirname() {
    return __dirname
  }

  title() {
    return 'meepworks-next'
  }

  async onEnter() {
    console.log('Enter Admin Server')
  }
}