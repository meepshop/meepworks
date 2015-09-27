import Application from '../../../build/application';

export default new Application({
  route: '/',
  component: './app-view',
  dirname: __dirname,
  locale: {
    path: '../locale',
    availableLocales: [
      'en_US'
    ]
  }
});
