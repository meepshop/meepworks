import React from 'react';
import ActionBase from '../../../dist/action-base';
import StoreBase from '../../../dist/store-base';
import RouterStore from '../../../dist/stores/router-store';



const Modules = React.createClass({
  getInitialState() {
    return {
      now: TimeStore.getInstance().now
    };
  },
  componentDidMount() {
    TimeStore.getInstance().subscribe(this.handleTimeChange);
      requestAnimationFrame(this.triggerUpdateTime);
  },
  componentWillUnmount() {
    TimeStore.getInstance().unsubscribe(this.handleTimeChange);
  },
  triggerUpdateTime() {
    if(this.isMounted()) {
      new UpdateTime().exec();
      requestAnimationFrame(this.triggerUpdateTime);
    }
  },
  handleTimeChange(){
    let t = TimeStore.getInstance().now;
    if(t!== this.state.now) {
      this.setState({
        now: t
      });
    }
  },
  render () {
    let Child = RouterStore.getInstance().getChildComponent(Modules);
    let rootUrl = RouterStore.rootUrl;
    let content;
    if(Child) {
      content = <Child />;
    }
    return <div>
      Modules: <br />
      <a href={ `${rootUrl}/modules/nest1` }>Nested App 1</a><br />
      {content}
    </div>;
  }
});

class UpdateTime extends ActionBase {
  action (payload) {
    return Promise.resolve(new Date().toString());
  }
}

class TimeStore extends StoreBase {
  constructor() {
    super();
    this.time = new Date().toString();
  }
  get handlers() {
    return [{
      action: UpdateTime,
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
  stores: [TimeStore],
  routes: {
    '/:nested': {
      app: './nested/nest1',
      title: '${nested} App'
    }
  }
};
