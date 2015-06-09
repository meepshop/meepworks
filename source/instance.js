const _cache = new WeakMap();
/**
 * Use weak maps for instances so that instances can easily be gc'ed
 * if the key is the request object itself.
 *
 */



const KEY = Symbol();
export const PROMOTE = Symbol();
export const DEMOTE = Symbol();
const BACKUP = {};
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
        let inst = new this();
        //bind promote/demote functions
        inst[PROMOTE] = promote;
        inst[DEMOTE] = demote;


        cache.set(key, inst);
        //keep a reference to the key for destroy
        inst[KEY] = key;
      }
      return cache.get(key);
    } else {
      if(!cache.has(this)) {
        let inst  = new this();
        cache.set(this, inst);
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
      //use key to clear _cache
      if(cache.has( this[KEY] )) {
        cache.delete( this[KEY] );
      }
    } else {
      if(cache.has( this.constructor )) {
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
  let g = cache.get(this);
  if(g) {
    cache.set(BACKUP, g);
  }
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
    let g = cache.get(BACKUP);
    if(g) {
      cache.set(this.constructor, g);
      cache.delete(BACKUP);
    }
  }
}


