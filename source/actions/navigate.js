import ActionBase from '../action-base';

export const NAVIGATE = Symbol();

export default class Navigate extends ActionBase {
  get symbol() {
    return NAVIGATE;
  }
  *action(payload) {
    return payload;
  }
}
