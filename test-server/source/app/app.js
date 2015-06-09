import Application from '../../../build/application';
import React from 'react';
import RouteHandler from '../../../build/components/route-handler';
import Link from '../../../build/components/link';

export default class App extends Application {
  constructor() {
    super();
  }
  static get routes() {
    return {
      'sub': {
        appPath: './sub-app'
      },
      '$default': {
        appPath: './default-app'
      },
      '$notfound': {
        appPath: './not-found'
      }
    };
  }
  render() {
    return (
      <div>Hello World!<br />
        <Link to="/">Home</Link><br />
        <Link to="sub">Sub</Link><br />
        <RouteHandler />
      </div>
    );
  }
}


