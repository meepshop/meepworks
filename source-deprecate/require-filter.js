import Module from 'module';
import path from 'path';
import url from 'url';
import escapeRegExp from 'greasebox/escape-reg-exp';



const _Enabled = Symbol();
const _OriginalRequire = Symbol();
const _Filters = Symbol();
const _Loaders = Symbol();
const _FileRoot = Symbol();
const _UrlRoot = Symbol();
const _Version = Symbol();

const meepworksCheck = /^meepworks\//;


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
    this[_Enabled] = true;
    this[_Filters] = new Map();
    this[_Loaders] = new Map();
    this[_OriginalRequire] = Module.prototype.require;

    //skip trailing '/'
    if(root[root.length - 1] === '/') {
      this[_FileRoot] = root.substr(0, root.length - 1);
    } else {
      this[_FileRoot] = root;
    }

    //skip trailing '/'
    if(baseURL[baseURL.length - 1] === '/') {
      this[_UrlRoot] = baseURL.substr(0, baseURL.length - 1);
    } else {
      this[_UrlRoot] = baseURL;
    }

    //prepare version string
    this[_Version] =  version ? `?${version}` : '';

    let instance = this;

    //don't use arrow function, cannot bind this here
    Module.prototype.require = function require(p) {
      if(instance[_Enabled]) {
        for(let [f, reg] of instance[_Filters]) {
          //f = filtername, reg = regex
          if(reg.test(p)) {
            if(instance[_Loaders].has(f)) {
              let l = instance[_Loaders].get(f);
              return this::l(p, (p) => {
                p = p.split('!')[0];
                let target = path.resolve(path.dirname(this.filename), p);
                return this::instance[_OriginalRequire](target);
              });
            } else {
              p = p.split('!')[0];
              let target = path.resolve(path.dirname(this.filename), p);
              let relToRoot = path.relative(instance[_FileRoot], target);
              return `${instance[_UrlRoot]}/${relToRoot}${instance[_Version]}`;
            }
          }
        }
      }
      return this::instance[_OriginalRequire](p);
    };
  }

  filter(f, loader) {
    if(!this[_Filters].has(f)) {
      if(f instanceof RegExp) {
        this[_Filters].set(f, f);
      } else {
        this[_Filters].set(f, new RegExp(`${asterickToAny(escapeRegExp(f))}$`, 'i'));
      }
      if(typeof loader === 'function') {
        this[_Loaders].set(f, loader);
      }
    }
  }
  removeFilter(f) {
    if(this[_Filters].has(f)) {
      this[_Filters].delete(f);
      if(this[_Loaders].has(f)) {
        this[_Loaders].delete(f);
      }
    }
  }
  enable() {
    this[_Enabled] = true;
  }
  disable() {
    this[_Enabled] = false;
  }
  get isEnabled() {
    return this[_Enabled];
  }

}
function asterickToAny(str) {
  return str.replace(/\\\*/g, '.*');
}


