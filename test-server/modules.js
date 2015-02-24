import React from 'react';
import ActionBase from '../dist/action-base';
import StoreBase from '../dist/store-base';



const Modules = React.createClass({
  render () {
    console.log(TimeStore.getInstance().now);
    return <div>{ TimeStore.getInstance().now }</div>;
  }
});

const UPDATE_TIME = Symbol();
class UpdateTime extends ActionBase {
  get symbol() {
    return UPDATE_TIME;
  }
  action (payload) {
    return Promise.resolve(new Date().toString());
  }
}

class TimeStore extends StoreBase {
  constructor() {
    this.time = new Date().toString();
  }
  get handlers() {
    return [{
      action: UPDATE_TIME,
      handler: this.handleUpdateTime
    }];
  }
  handleUpdateTime(payload) {
    this.time = payload;
    this.emit('change');
  }
  dehydrate() {
    return this.time;
  }
  rehydrate(time) {
    this.time = time;
  }
  get now() {
    return this.time;
  }
}
export default {
  component: Modules,
  stores: [TimeStore]
};
