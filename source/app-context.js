import Dispatcher from './dispatcher';


const DISPATCHER = Symbol();


export default class AppContext {
  constructor() {
    this[DISPATCHER] = Dispatcher.getInstance(this);
  }
}
