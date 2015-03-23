import React from 'react';
import RouterStore from '../../../dist/stores/router-store';

import test from './something.mp3!asset';
import 'normalize.css/normalize.css!';
import './test.css!';



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


