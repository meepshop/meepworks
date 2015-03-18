

import App from './cordova-app/app';
import FileDriver from '../../dist/file-driver';

window.onload = () => {
  new FileDriver(App);
};


