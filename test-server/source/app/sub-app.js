import React from 'react';
import Application from '../../../build/application';

export default class SubApp extends Application {
  static willTransitionTo(transition, param, query) {
  }
  render() {
    return (
      <div>SubApp</div>
    );
  }
}
