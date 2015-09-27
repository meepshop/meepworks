import Application from '../../../build/application';

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
  get path() {
    return '/';
  }
  get component() {
    return './app-view';
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
