import koa from 'koa';
import mount from 'koa-mount';
import serve from 'koa-static';
import favicon from 'koa-favicon';
import path from 'path';
import AppDriver from '../dist/server-app-driver';
import TestApp from './app';
import debug from 'debug';

let server = koa();
debug.enable('bind-url');

server.use(favicon());
server.use(mount('/jspm_packages', serve(path.resolve(__dirname, '../jspm_packages/'))));
server.use(mount('/dist', serve(path.resolve(__dirname, '../source'))));
server.use(mount('/meepworks', serve(path.resolve(__dirname, '../source'))));
server.use(mount('/test-server', serve(path.resolve(__dirname, '../server-client'))));

server.use(mount('/', new AppDriver(TestApp, {
  appPath: 'app',
  jspm: {
    path: 'jspm_packages',
    config: 'jspm_packages/config.js'
  },
  distPath: {
    external: 'test-server',
    internal: 'server-client'
  },
  fileRoot: __dirname
})));

server.listen('15551');
