import ActionBase from '../action-base';

const DETECT_BROWSER_LANGUAGE = Symbol();
export default class DetectBrowserLanguage extends ActionBase {
  static get symbol() {
    return DETECT_BROWSER_LANGUAGE;
  }
}
