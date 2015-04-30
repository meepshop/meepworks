import Instance from './instance';
import Dispatcher from './dispatcher';
import co from 'co';

const PAYLOAD = Symbol();
const CTX = Symbol();


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
  constructor(...payloads) {
    this[PAYLOAD] = payloads;
  }
  /**
   * @function
   * @override - this must be overriden by the actual action handler.
   *  This can be a simple function returning the payload, or a generator
   *  function the yields a payload in the end, or a function that returns
   *  a promise that would in the end resolve an payload.
   */
  action() {
    //allow actions to be used as events by defaulting to resolved promise
    return Promise.resolve();
  }
  /**
   *  @function
   *    Starts the execution of the action.
   */
  exec() {
    let self = this;
    return co(function *() {
      Dispatcher.getInstance(self[CTX]).dispatch({
        action: self.constructor,
        payload: yield self.action(...self[PAYLOAD])
      });

    });
  }

  get ctx() {
    return this[CTX];
  }
  set ctx(ctx) {
    this[CTX] = ctx;
  }
}

