import debug from 'debug';

const log = debug('tmpl-log');
/**
 * @exports default
 * @class Tmpl
 */
export default class Tmpl {
  /**
   * @constructor
   * @param {String} tmpl - the template string
   */
  constructor(tmpl) {
    this.tmpl = tmpl;
  }

  /**
   * @static
   * @function
   * @param {String} tmpl - the template string
   * @param {Object} map - the variable map for template
   * @return {String} - return the formatted string using tmpl and params.
   *                  - return empty string if tmpl is not a string.
   */
  static format(tmpl, params) {
    if(typeof tmpl !== 'string') {
      return '';
    }
    let res = tmpl;
    for(let p in params) {
      log(`params[${p}] = '${params[p]}'`);
      let reg = new RegExp(`\\$\\{${escapeRegExp(p)}\\}`, 'g');
      log(`RegExp: ${reg}`);
      res = res.replace(reg, params[p]);
    }
    return res;
  }
  /**
   * @function
   * @param {Object} params - the variable map for the template.
   * @return {String} - return the result of Tmpl.format using this.tmpl and params.
   */
  format(params) {
    return Tmpl.format(this.tmpl, params);
  }
}

function escapeRegExp(string){
  return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

