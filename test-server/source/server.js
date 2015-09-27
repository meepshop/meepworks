import Koa from 'koa';
import serve from 'koa-static-cache';
import mount from 'koa-mount';
import favicon from 'koa-favicon';
import path from 'path';


import RequireFilter from '../../build/require-filter';

import Router from '../../build/server-router';


const requireFilter = new RequireFilter({
  root: path.resolve(__dirname, '../../'),
  //baseURL: '',
  //version: Date.now
});

requireFilter.filter('.css!');

const server = new Koa();

server.use(favicon());

server.use(mount('/jspm_packages', serve(path.resolve(__dirname, '../../jspm_packages'), {
})));
server.use(mount('/build', serve(path.resolve(__dirname, '../../build'), {
})));
server.use(mount('/test-server/build', serve(__dirname, {
})));

server.use(function * (next) {
  console.log('req start: ', this.req.url);
  console.time('req');
  yield next;
  console.timeEnd('req');
});

const app = new Router({
  app: './app/app',
  jspm_config: 'jspm_packages/config.js',
  dirname: __dirname,
  root: path.resolve(__dirname, '../..'),
  buildPath: 'test-server/build',
  buildURL: 'test-server',
  meepdev: true,
});

app.on('error', (err) => {
  console.log(err);
  console.log(err.stack);
});

server.use(app.routes);

server.listen(18881);
console.log('listening to 18881...');
