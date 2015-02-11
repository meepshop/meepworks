import debug from 'debug';

const log = debug('class-instance');

const _cache = new WeakMap();
/**
 * Use weak maps for instances so that instances can easily be gc'ed
 * if the key is the request object itself.
 *
 */



const KEY = Symbol();
export const PROMOTE = Symbol();
export const DEMOTE = Symbol();
/**
 * @class Instance
 *  simple implementation of instanced objects
 */
export default class Instance {

  /**
   * @function
   * @param {object} key - optional object to use as a key
   *  Symbol value does not work on IE.
   *
   * Function getInstance returns the singleton if no key is passed in.
   * If an object is passed in as the key, it returns an unique instance
   * identified only by the object. If the object key is gc'ed, the unique
   * instance will be gc'ed as well. Unless it is being held by another
   * reference.
   */
  static getInstance(key) {
    if(!_cache.has(this)) {
      _cache.set(this, new WeakMap());
    }
    let cache = _cache.get(this);

    if(key) {
      if(!cache.has(key)) {
        let tmp = new this();
        //bind promote/demote functions
        tmp[PROMOTE] = promote;
        tmp[DEMOTE] = demote;


        cache.set(key, tmp);
        //keep a reference to the key for destroy
        tmp[KEY] = key;
      }
      return cache.get(key);
    } else {
      if(!cache.has(this)) {
        let tmp  = new this();
        cache.set(this, tmp);
      }
      return cache.get(this);
    }
  }

  /**
   * @function
   *
   * Remove the singleton from the internal cache.
   */
  destroy() {
    let cache = _cache.get(this.constructor);
    if(this[KEY]) {
      log('destroy key');
      //use key to clear _cache
      if(cache.has( this[KEY] )) {
        log('destroyed key');
        cache.delete( this[KEY] );
      }
    } else {
      log('destroy global');
      if(cache.has( this.constructor )) {
        log('destroyed global');
        cache.delete( this.constructor );
      }
    }
  }
}
/**
 * @function
 *    promote an instanced object to be the global instance
 *    that can be accessed via getInstance without passing
 *    the key
 */
function promote () {
  let cache = _cache.get(this.constructor);
  cache.set(this.constructor, this);
}
/**
 * @function
 *    demote a global instance by removing it from the _cache
 *    with the constructor as the key.
 */
function demote() {
  let cache = _cache.get(this.constructor);
  if(cache.get(this.constructor)=== this) {
    cache.delete(this.constructor);
  }
}


