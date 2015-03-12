import koa from 'koa';
import mount from 'koa-mount';
import serve from 'koa-static';
import router from 'koa-router';
import favicon from 'koa-favicon';
import path from 'path';

import RequireFilter from '../../dist/require-filter';

const version = new Date().getTime();
const requireFilter = new RequireFilter({
  fileRoot: path.resolve(__dirname, '..'),
  urlRoot: '/test-server/',
  version: version
});
requireFilter.filter('.css!');
requireFilter.filter('.*!asset');


import TestApp from './app/app';
import debug from 'debug';


let log = debug('req-log');

import AppDriver from '../../dist/server-app-driver';

let server = koa();
server.use(favicon());
server.use(mount('/jspm_packages', serve(path.resolve(__dirname, '../../jspm_packages/'), {
  maxage: 2*60*1000
})));
server.use(mount('/dist', serve(path.resolve(__dirname, '../../dist'), {
  maxage: 2*60*1000
})));
server.use(mount('/test-server/node', serve(path.resolve(__dirname, '../../test-server/node'), {
  maxage: 2*60*1000
})));


server.use(function * (next) {
  let start = new Date().getTime();
  yield next;
  log(`${this.req.url}, ${new Date().getTime() - start}ms.`);
});

//standalone server

import React from 'react';
import dedent from '../../dist/dedent';

server.use(router(server));
function *standaloneHandler (next) {
    this.body = '<!DOCTYPE html>' +
      React.renderToStaticMarkup(
        <html>
          <head>
            <title></title>
            <script key="sys" src="/jspm_packages/system.js"></script>
            <script key="config" src="/jspm_packages/config.js"></script>
            {
              // <script key="stand-alone" src={`/test-server/node/standalone.js?${version}`}></script>
            }
            <script key="bootstrap" dangerouslySetInnerHTML={{
              __html: dedent `
              System.baseURL='/';
              System.import('dist/standalone-driver')
              .then(function (m) {
              new m('test-server/node/app/app', '/standalone/', 'test-server/node');
              }).catch(console.log);
              `
            }}></script>
        </head>
        <body>
        </body>
      </html>);
}
server.get(/\/standalone(\/.*)?/, standaloneHandler);


server.use(mount('/', new AppDriver(TestApp, {
  appPath: 'app/app',
  jspm: {
    path: 'jspm_packages',
    config: 'jspm_packages/config.js'
  },
  distPath: {
    external: 'test-server/node',
    internal: 'test-server/node'
  },
  fileRoot: __dirname,
  localtest: true,
  version: version,
  debug: [],
  rootUrl: '/'
})));






server.listen('15551', () => {
  console.log('server listening to 15551');
});
