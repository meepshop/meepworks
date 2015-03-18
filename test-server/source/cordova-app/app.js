import React from 'react';
import ApplicationStore from './stores/application-store';
import RouteChange from './actions/route-change';
import 'normalize.css/normalize.css!';
import path from 'path';

import Locale from '../../../dist/locale';
import enUS from './locales/en-US.json!';

const lc = new Locale({
  path: path.resolve(__dirname,'./locales' ),
  locales: [
    'en-US'
  ],
  preload: {
    'en-US': enUS
  }
});

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      app: ApplicationStore.getInstance().state
    };
    this.handleChange = this.handleChange.bind(this);
  }
  shouldComponentUpdate(nextProps, nextState) {
    for(let name in this.state) {
      if(this.state[name] !== nextState[name]) {
        return true;
      }
    }
    return false;
  }
  componentDidMount() {
    ApplicationStore.getInstance().on('change', this.handleChange);
    setTimeout(() => {
      new RouteChange('/changed').exec();
    }, 1000);
  }
  componentWillUnmount() {
    ApplicationStore.getInstance().off('change', this.handleChange);
  }
  handleChange() {
    this.setState({
      app: ApplicationStore.getInstance().state
    });
  }
  render() {
    let route = this.state.app.get('route');
    return <div>
      App<br />
      <br />
      Route: {route}
      <br />
      Content: {lc.format('content', {
        name: 'Jack'
      })}
    </div>;
  }
}

export default {
  component: App,
  stores: [
    ApplicationStore
  ]
};
