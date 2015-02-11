import ActionBase from '../action-base';
import RouterStore from '../stores/router-store';

export const NAVIGATE = Symbol();

export default class Navigate extends ActionBase {
  get symbol() {
    return NAVIGATE;
  }
  *action(payload) {
    return payload;
  }
}
