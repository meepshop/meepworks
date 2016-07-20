import escapeRegExp from 'greasebox/escape-reg-exp'

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
    this.tmpl = tmpl
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
    if (typeof tmpl !== 'string') {
      return ''
    }
    let res = tmpl
    if (params) {
      for (const p in params) { /* eslint no-restricted-syntax: 0 */
        if ({}.hasOwnProperty.call(params, p)) {
          const reg = new RegExp(`\\$\\{${escapeRegExp(p)}\\}`, 'g')
          res = res.replace(reg, params[p])
        }
      }
    }
    return res
  }
  /**
   * @function
   * @param {Object} params - the variable map for the template.
   * @return {String} - return the result of Tmpl.format using this.tmpl and params.
   */
  format(params) {
    return Tmpl.format(this.tmpl, params)
  }
}
