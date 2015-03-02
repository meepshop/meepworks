import koa from 'koa';
import mount from 'koa-mount';
import serve from 'koa-static';
import favicon from 'koa-favicon';
import path from 'path';
import requireFilter from '../../dist/require-filter';

requireFilter.filter('.css!');

import 'test.css!';

import TestApp from './app/app';
import debug from 'debug';

debug.enable('bind-url');
debug.enable ('req-log');

let log = debug('req-log');

import AppDriver from '../../dist/server-app-driver';

let server = koa();
server.use(favicon());
server.use(mount('/jspm_packages', serve(path.resolve(__dirname, '../../jspm_packages/'))));
server.use(mount('/dist', serve(path.resolve(__dirname, '../../dist'))));
server.use(mount('/test-server', serve(path.resolve(__dirname, '../../test-server'))));


server.use(function * (next) {
  let start = new Date().getTime();
  yield next;
  log(`${this.req.url}, ${new Date().getTime() - start}ms.`);
});

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
  localtest: true
})));

server.listen('15551', () => {
  console.log('server listening to 15551');
});
