import debug from 'debug';

//debug.enable('tmpl-log');
const log = debug('tmpl-log');

export default class Tmpl {
  static format(tmpl, params) {
    for(let p in params) {
      log(`params[${p}] = '${params[p]}'`);
      let reg = new RegExp(`\\$\\{${escapeRegExp(p)}\\}`, 'g');
      log(`RegExp: ${reg}`);
      tmpl = tmpl.replace(reg, params[p]);
    }
    return tmpl;
  }
  format(params) {
    let res = this.tmpl;
    for(let p in params) {
      log(`params[${p}] = '${params[p]}'`);
      let reg = new RegExp(`\\$\\{${escapeRegExp(p)}\\}`, 'g');
      log(`RegExp: ${reg}`);
      res = res.replace(reg, params[p]);
    }
    return res;

  }
  constructor(tmpl) {
    this.tmpl = tmpl;
  }
}

function escapeRegExp(string){
  return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

