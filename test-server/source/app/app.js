import Application from 'meepworks/application';
import AppStore from './app-store';

//export default new Application({
//  route: '/',
//  component: './app-view',
//  dirname: __dirname,
//  locale: {
//    path: '../locale',
//    availableLocales: [
//      'en_US'
//    ]
//  }
//});
//
export default class TestApp extends Application {
  get component() {
    return './app-view';
  }
  get path() {
    return '/';
  }
  get childRoutes() {
    return [
      '../sub/sub'
    ];
  }

  get stores() {
    return [
      AppStore
    ];
  }
  async onEnter() {
    console.log('@onEnter');
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
    return 'meepworks';
  }
  get dirname() {
    return __dirname;
  }
}
