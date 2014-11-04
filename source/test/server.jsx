import koa from 'koa';
import serve from 'koa-static';
import mount from 'koa-mount';
import router from 'koa-router';
import path from 'path';
import React from 'react';
import fs from 'fs';
import favicon from 'koa-favicon';

import Traceur from 'traceur';
require(Traceur.RUNTIME_PATH);

import AppRouter from '../server/app-router';
import HtmlPage from '../views/html-page/html-page';
import IndexPage from './app/pages/index/index';
import TestPage from './app/pages/test/test';
import Immutable from 'immutable';
var app = new koa();

app.use(function*(next) {
  console.log(this.req.url);
  yield next;
});
app.use(mount('/jspm_packages', serve(path.resolve(__dirname, '../jspm_packages'))));
app.use(mount('/config', serve(path.resolve(__dirname, '../config'))));
app.use(mount('/build', serve(path.resolve(__dirname, '../../build'))));
app.use(favicon());

app.use(router(app));
app.get('/', function * (next) {
  this.req.url = '/index';
  yield next;
});

app.get('/index', function * (next) {
var doctype = '<!DOCTYPE html>';
  this.type = 'text/html, charset=utf-8';
  this.body = doctype + React.renderToStaticMarkup(
    <HtmlPage title="Meepworks Test Page" 
  scripts={[
    <script src="jspm_packages/traceur-runtime.js" key="traceur-runtime"></script>,
    <script src="jspm_packages/system.js" key="system"></script>,
    <script src="config/jspm.js" key="jspm"></script>,
    <script key="bootloader" dangerouslySetInnerHTML={{
      __html: ["System.import('build/test/app/pages/index/index')",
        ".then(function(app){app.default.init();})",
        ".catch(function(err){console.log(err);})"
      ].join('')
    }}></script>
  ]}  />);

});







//app.use(mount(AppRouter({
//  pages: [{
//    url: '/index',
//    path: '/biuld/app/pages/index',
//    component: IndexPage
//  }, {
//    url: '/test',
//    path: '/biuld/app/pages/test',
//    component: TestPage
//  }], scripts: ['jspm_packages/system.js', 'jspm_packages/traceur-runtime.js']
//})));


app.listen(13320, function() {
  console.log('listening on 13320');
});
