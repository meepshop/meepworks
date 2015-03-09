import React from 'react';
import RouterStore from '../../../dist/stores/router-store';

import test from './something.mp3!asset';
import 'normalize.css/normalize.css!';
import './test.css!';

const App = React.createClass({
  componentDidMount () {
    RouterStore.getInstance().on('change', this.handleRouteChange);
  },
  componentWillUnmount () {
    RouterStore.getInstance().off('change', this.handleRouteChange);
  },
  handleRouteChange() {
    this.forceUpdate();
  },
  render() {
    let Content = RouterStore.getChildComponent(App);

    if(!Content) {
      Content = Home;
    }

    return <div>
      <a href="/">Home</a><br />
      <a href="/modules">Modules</a><br />
      <Content />
    </div>;
  }
});

const Home = React.createClass({
  render() {
    return <div>Welcome to Meepworks!</div>;
  }
});
export default {
  component: App,
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


