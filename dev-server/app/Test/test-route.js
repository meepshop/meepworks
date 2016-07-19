import Application from '../../../source/application'

import TestComponent from './test-view.react'

export default class Test extends Application {
  get component() {
    return TestComponent
  }

  get path() {
    return '/'
  }

  get childRoutes() {
    return []
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
