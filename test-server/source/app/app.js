import Application from '../../../build/application';
import React from 'react';
import RouteHandler from '../../../build/components/route-handler';
import Link from '../../../build/components/link';
import Store from './store';
import * as Actions from './actions';

export default class App extends Application {
  static get routes() {
    return {
      'sub': {
        appPath: './sub-app'
      },
      '$default': {
        appPath: './default-app'
      },
      '$notfound': {
        appPath: './not-found'
      }
    };
  }
  static get title() {
    return 'Meepworks';
  }
  static get stores() {
    return [
      Store
    ];
  }
  static willTransitionTo(transition, params, query, cb) {
    this.context.appCtx.runAction(new Actions.Test('Hello')).then(cb).catch(cb);
  }
  constructor(props, context) {
    super(props, context);

    this.state = {
      store: Store.getInstance(this.context.appCtx).state
    };

    this.changeHandler = () => {
      this.setState({
        store: Store.getInstance(this.context.appCtx).state
      });
    };
  }
  componentDidMount() {
    Store.getInstance(this.context.appCtx).on(this.changeHandler);
  }
  componentWillUnmount() {
    Store.getInstance(this.context.appCtx).off(this.changeHandler);
  }
  render() {
    console.log('render');
    console.log(this.context);
    return (
      <div>Current Route: {this.context.router.getCurrentPath()}<br />
        Msg: {this.state.store.get('msg')}<br />
        <Link to={`${this.context.root}/`}>Home</Link><br />
        <Link to={`${this.context.root}/sub`}>Sub</Link><br />
        <RouteHandler />
      </div>
    );
  }
}


