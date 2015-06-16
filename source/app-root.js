import React, { PropTypes } from 'react';
import RouteHandler from './components/route-handler';
import Application from './application';

export const APPROOT = Symbol();

export default class AppRoot extends Application {
  getChildContext() {
    return {
      currentPath: this.context.router.getCurrentPath()
    };
  }
  static get childContextTypes () {
    return {
      appCtx: PropTypes.object,
      root: PropTypes.string,
      currentPath: PropTypes.string,
      locale: PropTypes.func
    }
  }
  componentDidMount() {
    this.context.appCtx[APPROOT] = () => {
      this.forceUpdate();
    };
  }
  render() {
    return <RouteHandler />;
  }
}
