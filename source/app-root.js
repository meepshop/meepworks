import React from 'react';
import RouteHandler from './components/route-handler';
import Application from './application';
import { APPROOT } from './app-context';

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
      currentPath: PropTypes.string
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
