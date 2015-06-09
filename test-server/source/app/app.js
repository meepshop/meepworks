import Application from '../../../build/application';
import React from 'react';
import RouteHandler from '../../../build/components/route-handler';
import Link from '../../../build/components/link';
import Store from './store';

export default class App extends Application {
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
  static get stores() {
    return [
      Store
    ];
  }
  constructor(props, context) {
    super(props, context);

    console.log(Store.getInstance(this.context.appCtx));

    this.changeHandler = () => {

    };
  }
  componentDidMount() {
    this.context.appCtx.getStore(Store).on(this.changeHandler);
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


