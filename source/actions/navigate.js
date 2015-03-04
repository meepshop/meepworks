import ActionBase from '../action-base';

export const NAVIGATE = Symbol();
/**
 * @default
 * @class Navigate
 * @extends ActionBase
 */
export default class Navigate extends ActionBase {
  get symbol() {
    return NAVIGATE;
  }
  *action(payload) {
    return payload;
  }
}
