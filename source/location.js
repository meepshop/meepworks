import { HistoryLocation } from 'react-router';
import escapeRegExp from 'greasebox/escape-reg-exp';


export default class Location {
  constructor(baseURL='') {
    this.baseURL = baseURL;
    let escapeBaseURL = escapeRegExp(baseURL);
    this.reg = new RegExp(`/${escapeBaseURL}/?`);
    HistoryLocation.addChangeListener((change) => {
      if(this.baseURL !== '') {
        change.path = change.path.replace(this.reg, '/');
      }
      this.listeners.slice().forEach(fn => {
        if(typeof fn === 'function') {
          fn(change);
        }
      });
    });
    this.listeners = [];
  }
  addChangeListener(listener) {
    if(this.listeners.indexOf(listener) === -1) {
      this.listeners.push(listener);
    }
  }
  removeChangeListener(listener) {
    let idx = this.listeners.indexOf(listener);
    if( idx !== -1) {
      this.listeners.splice(idx, 1);
    }
  }
  push(...args) {
    let res = HistoryLocation.push(...args);
    return res;
  }
  replace(...args) {
    return HistoryLocation.replace(...args);
  }
  pop(...args) {
    return HistoryLocation.pop(...args);
  }
  getCurrentPath() {
    let p = HistoryLocation.getCurrentPath();
    if(this.baseURL !== '') {
      p = p.replace(this.reg, '/');
    }
    return p;
  }
  toString() {
    return '<MeepworkLocation>';
  }
}
