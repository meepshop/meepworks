import React from 'react';
import Application from '../../../build/application';

export default class DefaultApp extends Application {
  static willTransitionTo(transition, param, query) {
  }
  render() {
    return (
      <div>Default</div>
    );
  }
}
