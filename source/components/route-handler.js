import Router from 'react-router';
import { PropTypes } from 'react';

export default class RouteHandler extends Router.RouteHandler {
  static get contextTypes() {
    return {
      appCtx: PropTypes.object,
      root: PropTypes.string,
      currentPath: PropTypes.string
    };
  }
}
