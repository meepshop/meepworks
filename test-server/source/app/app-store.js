import Store from '../../../build/store';


export default class AppStore extends Store {
  constructor() {
    super();
    this._data = {
      message: 'Hello'
    };
  }
  rehydrate(data) {
    console.log('@rehydrate', data);
    this._data = data;
  }
  dehydrate() {
    return this._data;
  }
}
