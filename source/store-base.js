import Instance from './instance';
import Emitter from 'component-emitter';

export const ACTION_HANDLER = Symbol();

import Dispatcher from './dispatcher';

const EMITTER = Symbol();
const REGISTERED = Symbol();
const SYMBOLS = Symbol();


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
  constructor() {
    super();
    this[EMITTER] = new Emitter();
    this[SYMBOLS] = new Map();

    //bind main action handler with bounded this in the scope
    this[ACTION_HANDLER] = (payload) => {
       //run the actual action handlers using the action as the accessor
       let s = this[SYMBOLS].get(payload.action);
       if (typeof this[s] === 'function') {
         this[s](payload.payload);
       }
     };

  }
  bindHandler(action, handler) {
    if(!this[SYMBOLS].has(action)) {
      this[SYMBOLS].set(action, Symbol());
    }
    this[this[SYMBOLS].get(action)] = handler;
  }

  static getInstance(ctx) {
    let self = super.getInstance(ctx);

    if(!self[REGISTERED]) {
      ctx.stores.add(self);
      Dispatcher.getInstance(ctx).register(self);
      self[REGISTERED] = true;
    }
    return self;
  }

  get handlers() {
    return [];
  }

  /**
   * @function
   *  Returns the current state in JS object form.
   */
  dehydrate () {
  }
  /**
   * @function
   *  @param {Object} state - The state object to fill into the data store.
   *  Fill the data store with the state object, the underlying data is immutable.
   */
  rehydrate (state) {
  }

  changed() {
    this[EMITTER].emit('change');
  }
  on(fn) {
    this[EMITTER].on('change', fn);
  }
  off(fn) {
    this[EMITTER].off('change', fn);
  }
}

//Make Stores an event emitter

/**
 * @function
 * @private
 *    Initializes the store with handler bindings.
 */
//StoreBase.prototype[INIT_STORE] = function () {
//  if(!this[INIT]) {
//    //bind this to self for the main action handler
//    var self = this;
//
//    //map handlers to self by the action symbol
//    self.handlers.forEach((map) => {
//      if(!handlerCache.has(map.action)) {
//        handlerCache.set(map.action, Symbol());
//      }
//      let s = handlerCache.get(map.action);
//      self[s] = map.handler;
//    });
//    //bind main action handler with bounded self in the scope
//    self[ACTION_HANDLER] = (payload) => {
//      //run the actual action handlers using the action as the accessor
//      let s = handlerCache.get(payload.action);
//      if (typeof self[s] === 'function') {
//        self[s](payload.payload);
//      }
//    };
//    self[INIT] = true;
//  }
//};
