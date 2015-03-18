import ActionBase from '../action-base';

const NAVIGATE = Symbol();
/**
 * @default
 * @class Navigate
 * @extends ActionBase
 */
export default class Navigate extends ActionBase {
  static get symbol() {
    return NAVIGATE;
  }
  *action(payload) {
    return payload;
  }
}
