import { PropTypes } from 'react';
import Component from './component';
import Dispatcher from './dispatcher';

/**
 * @class Application
 * @description Application base class
 */
export default class Application extends Component {
  constructor(props, context) {
    super(props, context);
  }
  static get contextTypes() {
    return {
      router: PropTypes.func,
      appCtx: PropTypes.object,
      baseURL: PropTypes.string,
      appURL: PropTypes.string,
      currentPath: PropTypes.string,
      locale: PropTypes.func
    };
  }
  static get stores() {
    return [];
  }
  static get routes() {
    return {};
  }
  static get locales() {
    return {};
  }
  static title() {
    return void 0;
  }
  render() {
    return null;
  }
}
