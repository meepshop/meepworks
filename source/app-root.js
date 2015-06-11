import React from 'react';
import RouteHandler from './components/route-handler';
import Application from './application';
import { APPROOT } from './app-context';

export default class AppRoot extends Application {
  componentDidMount() {
    this.context.appCtx[APPROOT] = () => {
      this.forceUpdate();
    };
  }
  render() {
    return <RouteHandler />;
  }
}
