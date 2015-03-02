import Module from 'module';
import escapeRegExp from 'greasebox/escape-reg-exp';

const ENABLED = Symbol();
const ORIGINAL_REQUIRE = Symbol();
const FILTERS = Symbol();

class RequireFilter {
  constructor() {
    this[ENABLED] = true;
    this[FILTERS] = new Map();
    this[ORIGINAL_REQUIRE] = Module.prototype.require;
    let instance = this;
    Module.prototype.require = (() => {
      return function (path) {
        if(instance[ENABLED]) {
          for(let entry of instance[FILTERS]) {
            if(entry[1].test(path)) {
              return null;
            }
          }
        }
        return instance[ORIGINAL_REQUIRE].call(this, path);

      };
    })();
  }

  filter(f) {
    if(!this[FILTERS].has(f)) {
      this[FILTERS].set(f, new RegExp(`${escapeRegExp(f)}$`, 'i'));
    }
  }
  removeFilter(f) {
    if(this[FILTERS].has(f)) {
      this[FILTERS].delete(f);
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

export default new RequireFilter();
