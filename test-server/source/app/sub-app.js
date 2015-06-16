import React from 'react';
import Application from '../../../build/application';

export default class SubApp extends Application {
  static willTransitionFrom(transition) {
  }
  static title() {
    return 'Sub App';
  }
  static get routes() {
    return {
      'sub': {
        appPath: './not-found'
      }
    };
  }
  render() {
    return (
      <div>SubApp @ {this.context.currentPath}</div>
    );
  }
}
