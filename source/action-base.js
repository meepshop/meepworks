import Instance from './instance';
import Dispatcher from './dispatcher';
import co from 'co';
import debug from 'debug';

const log = debug('ActionBase');
const PAYLOAD = Symbol();
const KEY = Symbol();
export const SET_KEY = Symbol();


/**
 *  @exports default
 *  @class ActionBase
 *    Base class for actions
 */
export default class ActionBase {
  /**
   * @constructor
   * @param {any} payload - parameter passed into the action handler
   */
  constructor(payload) {
    this[PAYLOAD] = payload;
  }
  /**
   * @property {Symbol} symbol
   * @override - this.must be overriden by extended classes
   */
  get symbol() {
    log('Class ${this.constructor.name} has not implemented symbol.');
  }
  /**
   * @function
   * @override - this must be overriden by the actual action handler.
   *  This can be a simple function returning the payload, or a generator
   *  function the yields a payload in the end, or a function that returns
   *  a promise that would in the end resolve an payload.
   */
  action() {
    log(`Class ${this.constructor.name} has not implemented action.`);
    return Promise.reject();
  }
  /**
   *  @function
   *    Starts the execution of the action.
   */
  exec() {
    let self = this;
    return co(function *() {
      Dispatcher.getInstance(self[KEY]).dispatch({
        action: self.symbol,
        payload: yield self.action(self[PAYLOAD])
      });

    });
  }
}
/**
 * @function
 * @param {Object} key - instance key
 *   Used on the server side to bind request specific key to the action.
 */
ActionBase.prototype[SET_KEY] = function (key) {
  this[KEY] = key;
  return this;
};


