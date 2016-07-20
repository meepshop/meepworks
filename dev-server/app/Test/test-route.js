import { Application } from '../../../source'

import TestComponent from './test-view.react'
import AdminComponent from '../Admin/admin-route'

export default class Test extends Application {
  get component() {
    return TestComponent
  }

  get path() {
    return '/'
  }

  get childRoutes() {
    return [
      AdminComponent
    ]
  }

  get stores() {
    return []
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
    console.log('Enter Test Server')
  }
}
