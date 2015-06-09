import { Component, PropTypes } from 'react';

export default class Application extends Component {
  constructor() {
    super();
  }
  static get contextTypes() {
    return {
      router: PropTypes.func,
      appCtx: PropTypes.object
    };
  }
  static get routes() {
    return {};
  }
  render() {
    return null;
  }
}
