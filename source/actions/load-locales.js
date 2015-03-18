import ActionBase from '../action-base';
import path from 'path';
import forEach from 'greasebox/co-foreach';
import url from 'url';

const LOAD_LOCALES = Symbol();
export default class LoadLocales extends ActionBase {
  static get symbol() {
    return LOAD_LOCALES;
  }
  *action (payload) {
    let data = payload.lStore.data.toJS();
    let mapping = payload.lStore.mapping.toJS();
    let locale = payload.lStore.locale;
    let accept = payload.lStore.acceptLanguages.toJS();

    for(let [p, c] of payload.LC) {
      if(!data[p]) {
        data[p] = {};
      }
      let match = findMatch(locale, c.locales);

      //find a match from acceptLanguages
      if(!match) {
        if(accept.every((l) => {
          match = findMatch(l, c.locales);
          return !match;
        })) {
          //pick the first available language if no match is found at all
          match = c.locales.entries().next().value.shift();
        }
      }
      if(!data[p][match]) {
        if(c.preload[match]) {
          data[p][match] = c.preload[match];
        } else {
          if(typeof window === 'undefined') {
            data[p][match] = require(`${p}/${match}.json`);
          } else {
            data[p][match] = yield System.import(`${p}/${match}.json!`);
          }
          c.preload[match] = data[p][match];
        }
      }
      mapping[p] = match;
    }

    return {
      data,
      mapping
    };

  }
}

function findMatch(locale, list) {
  if(list.has(locale)) {
    return locale;
  } else {
    let ln = locale.split('-').shift();
    if(list.has(ln)) {
      //locale = zh-TW, list has zh
      return ln;
    } else {
    //locale = zh, list has zh-TW
      for(let entry of list) {
        if(entry.split('-').shift() === ln) {
          return entry;
        }
      }
    }
  }
}
