import Application from 'meepworks/application';

import TestAction from './action';

export default class SubApp extends Application {
  get path() {
    return 'sub';
  }
  get childRoutes() {
    return [
      '../child1/sub',
      '../child2/sub'
    ];
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
    console.log('@onEnter');
    console.log(await this.runAction(new TestAction()));
  }
  onLeave() {
    //console.log('onLeave');
  }
  routerWillLeave() {
    //console.log('routerWillLeave');
  }
}
