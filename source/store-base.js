import Instance from './instance';
import Emitter from 'component-emitter';
import debug from 'debug';

const log = debug('store-base');

export const ACTION_HANDLER = Symbol();
export const INIT_STORE = Symbol();
export const INIT = Symbol();

/**
 * @exports default
 * @class StoreBase
 * @extends Instance
 * @extends Emitter
 *    Base store class for implementing data stores.
 */
export default class StoreBase extends Instance {
  /**
   * @property {Array} handlers
   *    The list of handler mappings in the form of:
   *    {
   *      action: Symbol() representing the action,
   *      handler: this.handler
   *    }
   *    This is used to map the handlers back to self using the action symbol as the key.
   */
  get handlers() {
    return [];
  }

  /**
   * @function
   *  Returns the current state in JS object form.
   */
  dehydrate () {
    log('Class ${this.constructor.name} has not implemented dehydrate function.');
  }
  /**
   * @function
   *  @param {Object} state - The state object to fill into the data store.
   *  Fill the data store with the state object, the underlying data is immutable.
   */
  rehydrate (state) {
    log('Class ${this.constructor.name} has not implemented rehydrate function.');
  }

}

//Make Stores an event emitter
Emitter(StoreBase.prototype);

/**
 * @function
 * @private
 *    Initializes the store with handler bindings.
 */
StoreBase.prototype[INIT_STORE] = function () {
  if(!this[INIT]) {
    //bind this to self for the main action handler
    var self = this;

    //map handlers to self by the action symbol
    this.handlers.forEach((map) => {
      this[map.action] = map.handler;
    });
    //bind main action handler with bounded self in the scope
    this[ACTION_HANDLER] = (payload) => {
      //run the actual action handlers using the action as the accessor
      if (typeof self[payload.action] === 'function') {
        self[payload.action](payload.payload);
      }
    };
    this[INIT] = true;
  }
};
