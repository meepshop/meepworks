import Instance from './instance';
import Emitter from 'component-emitter';


import Dispatcher from './dispatcher';

const ACTION_HANDLER = Symbol();
const EMITTER = Symbol();
const REGISTERED = Symbol();
const SYMBOLS = Symbol();
const CTX = Symbol();


/**
 * @exports default
 * @class StoreBase
 * @extends Instance
 * @extends Emitter
 *    Base store class for implementing data stores.
 */
export default class Store extends Instance {
  constructor() {
    super();
    this[EMITTER] = new Emitter();
    this[SYMBOLS] = new Map();

    //bind main action handler with bounded this in the scope
    this[ACTION_HANDLER] = payload => {
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
      Dispatcher.getInstance(ctx).register(self, this[ACTION_HANDLER]);
      self[CTX] = ctx;
      self[REGISTERED] = true;
    }
    return self;
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
  get ctx() {
    return this[CTX];
  }
}

