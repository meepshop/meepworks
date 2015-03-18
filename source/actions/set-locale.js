import ActionBase from '../action-base';

const SET_LOCALE = Symbol();
export default class SetLocale extends ActionBase {
  static get symbol() {
    return SET_LOCALE;
  }
  *action(l) {
    return l;
  }
}
