import { Component, PropTypes } from 'react';
import Dispatcher from './dispatcher';

export default class Application extends Component {
  constructor(props, context) {
    super(props, context);



  }
  static get contextTypes() {
    return {
      router: PropTypes.func,
      appCtx: PropTypes.object
    };
  }
  static get stores() {
    return [];
  }
  static get routes() {
    return {};
  }
  render() {
    return null;
  }
}
