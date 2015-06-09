import koa from 'koa';
import serve from 'koa-static-cache';
import mount from 'koa-mount';
import favicon from 'koa-favicon';

import AppDriver from '../../build/server-app-driver';

import React from 'react';
import Router, {Route, RouteHandler} from 'react-router';


const server = new koa();

server.use(favicon());
server.use(function * (next) {
  console.log('req url: ', this.req.url);
  yield next;
});

let tt;

class Test extends React.Component {
  static get contextTypes() {
    return {
      router: React.PropTypes.func
    };
  }
  static willTransitionTo(transition, params, query, cb) {
    console.log('#', transition, this);
    cb();
  }
  static willTransitionFrom(transition, component, cb) {
    console.log('transition from ');
    cb();
  }
  render() {
    if(!tt) {
      tt = this.context.router;

    } else {
      console.log('@', tt == this.context.router);
    }
    return <div>Test<br /><RouteHandler /></div>;
  }
}

//let routes = (
//  <Route handler={Test} >
//    <Route path='sub' handler={Test} />
//  </Route>
//);
//
//server.use(function * () {
//  Router.run(routes, this.req.url, (Root, state) => {
//    console.log('*', state);
//    this.body = React.renderToString(<Root />);
//  });
//});

const app = new AppDriver({
  appPath: 'app/app',
  jspm: {
    path: 'jspm_packages',
    config: 'jspm_packages/config'
  },
  dirname: __dirname,
  localtest: true,
  abortPath: '/'
});
server.use(app.router);

server.listen(18881);
console.log('listening to 18881');


