import React from 'react';
import RouterStore from '../../../dist/stores/router-store';

import test from './something.mp3!asset';
import 'normalize.css/normalize.css!';
import './test.css!';

import ActionBase from '../../../dist/action-base';
import StoreBase from '../../../dist/store-base';

class Action1 extends ActionBase {
  action() {
    console.log('action1');
    return Promise.resolve();
  }
}
class Action2 extends ActionBase {
  action() {
    console.log('action2');
    return Promise.resolve();
  }
}
class Action3 extends ActionBase {
  action() {
    console.log('action3');
    return Promise.resolve();
  }
}

class TestStore extends StoreBase {
  get handlers() {
    return [{
      action: Action1,
      handler: this.handleAction1
    }, {
      action: Action2,
      handler: this.handleAction2
    },{
      action: Action3,
      handler: this.handleAction3
    }];
  }
  handleAction1() {
    console.log('handleAction1');
  }
  handleAction2() {
    console.log('handleAction2');
  }
  handleAction3() {
    console.log('handleAction3');
  }
}



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      router: RouterStore.state
    };
    this.handleRouteChange = this.handleRouteChange.bind(this);
  }
  componentDidMount() {
    RouterStore.getInstance().subscribe(this.handleRouteChange);
    new Action2().exec();
  }
  componentWillUnmount() {
    RouterStore.getInstance().unsubscribe(this.handleRouteChange);
  }
  handleRouteChange() {
    this.setState({
      router: RouterStore.state
    });
  }
  render() {
    let Content = RouterStore.getChildComponent(App);
    let rootUrl = RouterStore.rootUrl;

    if(!Content) {
      Content = Home;
    }

    return <div>
      <a href={`${rootUrl}/`}>Home</a><br />
      <a href={`${rootUrl}/modules`}>Modules</a><br />
      <Content />
    </div>;

  }
}


class Home extends React.Component {
  render() {
    return <div>Welcome to Meepworks!</div>;
  }
}
export default {
  component: App,
  stores: [
    TestStore
  ],
  routes: {
    '/': {
      name: 'Home',
      title: 'Meepworks'
    },
    '/modules': {
      name: 'Modules',
      app: './modules',
      title: 'Modules'
    }
  }
};


