import Instance from './instance';
import Dispatcher from './dispatcher';

const PAYLOAD = Symbol();
const CTX = Symbol();


/**
 *  @exports default
 *  @class ActionBase
 *    Base class for actions
 */
export default class Action {
  /**
   * @constructor
   * @param {any} payload - parameter passed into the action handler
   */
  constructor(payload) {
    this[PAYLOAD] = payload;
  }
  /**
   * @function
   *
   */
  async action() {
    //allow actions to be used as events by defaulting to resolved promise
    return this[PAYLOAD];
  }

  get payload() {
    return this[PAYLOAD];
  }
  get ctx() {
    return this[CTX];
  }
  set ctx(ctx) {
    this[CTX] = ctx;
  }
}

