import React, { PropTypes } from 'react';
import RouteHandler from './components/route-handler';
import Application from './application';

export const APPROOT = Symbol();

/**
 * @class AppRoot
 * @description Internal Application class used as the root application
 *              This is designed to provide ways to initialized an empty locale object.
 *              This is also used to trigger update when locale changes.
 */
export default class AppRoot extends Application {
  getChildContext() {
    return {
      currentPath: this.context.router.getCurrentPath()
    };
  }
  static get childContextTypes () {
    return {
      appCtx: PropTypes.object,
      baseURL: PropTypes.string,
      currentPath: PropTypes.string,
      locale: PropTypes.func
    }
  }
  componentDidMount() {
    //sets up change handler to appContext
    //this is called when locale changes
    this.context.appCtx[APPROOT] = () => {
      this.forceUpdate();
    };
  }
  render() {
    return <RouteHandler />;
  }
}
