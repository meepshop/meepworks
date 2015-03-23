import ActionBase from '../action-base';

const SET_APPROOT = Symbol();

export default class SetApproot extends ActionBase {
  static get symbol() {
    return SET_APPROOT;
  }
  *action(root) {
    return root;
  }
}