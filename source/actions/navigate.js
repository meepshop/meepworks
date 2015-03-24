import ActionBase from '../action-base';

/**
 * @default
 * @class Navigate
 * @extends ActionBase
 */
export default class Navigate extends ActionBase {
  *action(payload) {
    return payload;
  }
}
