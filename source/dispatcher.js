import Flux from 'flux';
import Instance from './instance';

const DISPATCH_TOKEN = Symbol();
const DISPATCHER = Symbol();
/**
 * @exports default
 * @class Dispatcher
 *    Wraps Flux.Dispatcher to provide instanced
 *    dispatcher.
 */
export default class Dispatcher extends Instance {
  constructor() {
    super();
    this[DISPATCHER] = new Flux.Dispatcher();
  }
  /**
   * @function
   * @param {StoreBase} store - store to be registered
   */

  register(store, fn) {
    store[DISPATCH_TOKEN] = this[DISPATCHER].register(fn);
  }
  /**
   *  @function
   *  @param {StoreBase} store - store to be unregistered
   */
  unregister(store) {
    this[DISPATCHER].unregister(store[DISPATCH_TOKEN]);
  }

  /**
   *  @function
   *  @param {Array<StoreBase>} stores - array of stores to wait for.
   */
  waitFor(stores) {
    if(!Array.isArray(stores)) {
      stores = [stores];
    }
    this[DISPATCHER].waitFor(stores.map(s => s[DISPATCH_TOKEN]));
  }

  dispatch(payload) {
    this[DISPATCHER].dispatch(payload);
  }
  isDispatching() {
    return this[DISPATCHER].isDispatching();
  }
}
