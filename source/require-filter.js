import Module from 'module';
import Instance from './instance';
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

export default class RequireFilter extends Instance {
  constructor(param) {
    this[ENABLED] = true;
    this[FILTERS] = new Map();
    this[LOADERS] = new Map();
    this[ORIGINAL_REQUIRE] = Module.prototype.require;

    if(param.fileRoot[param.fileRoot.length - 1] === '/') {
      this[FILEROOT] = param.fileRoot.substr(0, param.fileRoot.length - 1);
    } else {
      this[FILEROOT] = param.fileRoot;
    }

    if(param.urlRoot[param.urlRoot.length - 1] === '/') {
      this[URLROOT] = param.urlRoot.substr(0, param.urlRoot.length - 1);
    } else {
      this[URLROOT] = param.urlRoot;
    }
    this[VERSION] =  param.version ? `?${param.version}` : '';

    let instance = this;

    Module.prototype.require = function (p) {
      if(instance[ENABLED]) {
        for(let [f, reg] of instance[FILTERS]) {
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
      return instance[ORIGINAL_REQUIRE].call(this, p);
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
  get enabled() {
    return this[ENABLED];
  }

}
function asterickToAny(str) {
  return str.replace(/\\\*/g, '.*');
}

