import ActionBase from '../action-base';

const DETECT_INTL = Symbol();

export default class DetectIntl extends ActionBase {
  static get symbol() {
    return DETECT_INTL;
  }
  //get symbol() {
  //  return DETECT_INTL;
  //}
  *action() {
      console.log('check', typeof global.Intl);
    if(!global.Intl) {
      if(typeof window === 'undefined') {
        return {
          intl: require('intl'),
          shim: true
        };
      } else {
        return {
          intl: yield System.import('intl'),
          shim: true
        };
      }
    }
    return {
      intl: global.Intl,
      shim: false
    };
  }
}
