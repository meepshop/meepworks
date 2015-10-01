import Application from '../../../build/application';

import TestAction from './action';

export default class SubApp extends Application {
  get path() {
    return '/sub';
  }
  get component() {
    return './sub-view';
  }
  get locale() {
    return {
      path: '../locale',
      locales: [
        'en_US'
      ]
    }
  }
  title() {
    return 'meepworks/sub';
  }
  get dirname() {
    return __dirname;
  }
  async onEnter() {
    console.log(await this.runAction(new TestAction()));
  }
  onLeave() {
    //console.log('onLeave');
  }
  routerWillLeave() {
    //console.log('routerWillLeave');
  }
}
