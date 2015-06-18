import koa from 'koa';
import serve from 'koa-static-cache';
import mount from 'koa-mount';
import favicon from 'koa-favicon';
import path from 'path';
import AppDriver from '../../build/server-app-driver';

import React from 'react';
import Router, {Route, RouteHandler} from 'react-router';

import RequireFilter from '../../build/require-filter';
//console.log('start');
//console.time('setFilter');
const requireFilter = new RequireFilter({
  root: path.resolve(__dirname, '../..'),
  baseURL: 'test-server',
  //version: version
});
requireFilter.filter('.css!');
//console.timeEnd('setFilter');

//console.time('koa-mount');
const server = new koa();

server.use(favicon());


server.use(mount('/jspm_packages', serve(path.resolve(__dirname, '../../jspm_packages'), {
})));
server.use(mount('/build', serve(path.resolve(__dirname, '../../build'), {
})));
server.use(mount('/test-server', serve(__dirname, {
})));
//console.timeEnd('koa-mount');


server.use(function * (next) {
  console.log('req start: ', this.req.url);
  //console.time('req');
  yield next;
  //console.timeEnd('req');
});

//console.time('mountApp');
const app = new AppDriver({
  appPath: 'app/app',
  jspm: {
    path: 'jspm_packages',
    config: 'jspm_packages/config.js'
  },
  dirname: __dirname,
  root: path.resolve(__dirname, '../..'),
  localtest: true,
  buildPath: 'test-server/build',
  buildURL: 'test-server',
  abortPath: '/my-app/sub',
  baseURL: 'my-app'
});
server.use(mount('/my-app', app.router));
//console.timeEnd('mountApp');

server.listen(18881);
console.log('listening to 18881');


