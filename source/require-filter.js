import Module from 'module';
import path from 'path';
import url from 'url';
import escapeRegExp from 'greasebox/escape-reg-exp';



const ENABLED = Symbol();
const ORIGINAL_REQUIRE = Symbol();
const FILTERS = Symbol();
const LOADERS = Symbol();
const FILEROOT = Symbol();
const URLROOT = Symbol();
const VERSION = Symbol();

export default class RequireFilter {
  /**
   * @constructor
   * @param {object} param {
   *    root: root absolute folder path on the server,
   *    baseURL: baseURL for the hosted application
   *    version: version string to append to output
   * }
   */

  constructor({ root, baseURL = '', version}) {
    this[ENABLED] = true;
    this[FILTERS] = new Map();
    this[LOADERS] = new Map();
    this[ORIGINAL_REQUIRE] = Module.prototype.require;

    //skip trailing '/'
    if(root[root.length - 1] === '/') {
      this[FILEROOT] = root.substr(0, root.length - 1);
    } else {
      this[FILEROOT] = root;
    }

    //skip trailing '/'
    if(baseURL[baseURL.length - 1] === '/') {
      this[URLROOT] = baseURL.substr(0, baseURL.length - 1);
    } else {
      this[URLROOT] = baseURL;
    }

    //prepare version string
    this[VERSION] =  version ? `?${version}` : '';

    let instance = this;

    //don't use arrow function, cannot bind this here
    Module.prototype.require = function require(p) {
      if(instance[ENABLED]) {
        for(let [f, reg] of instance[FILTERS]) {
          //f = filtername, reg = regex
          if(reg.test(p)) {
            p = p.split('!')[0];
            let target = path.resolve(path.dirname(this.filename), p);
            if(instance[LOADERS].has(f)) {
              let l = instance[LOADERS].get(f);
              return instance[LOADERS].get(f)(target);
            } else {
              let relToRoot = path.relative(instance[FILEROOT], target);
              return `${instance[URLROOT]}/${relToRoot}${instance[VERSION]}`;
            }
          }
        }
      }
      return this::instance[ORIGINAL_REQUIRE](p);
    };
  }

  filter(f, loader) {
    if(!this[FILTERS].has(f)) {
      this[FILTERS].set(f, new RegExp(`${asterickToAny(escapeRegExp(f))}$`, 'i'));
      if(typeof loader === 'function') {
        this[LOADERS].set(f, loader);
      }
    }
  }
  removeFilter(f) {
    if(this[FILTERS].has(f)) {
      this[FILTERS].delete(f);
      if(this[LOADERS].has(f)) {
        this[LOADERS].delete(f);
      }
    }
  }
  enable() {
    this[ENABLED] = true;
  }
  disable() {
    this[ENABLED] = false;
  }
  get isEnabled() {
    return this[ENABLED];
  }

}
function asterickToAny(str) {
  return str.replace(/\\\*/g, '.*');
}


