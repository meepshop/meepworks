var koa = require('koa');
var serve = require('koa-static');
var mount = require('koa-mount');
var path = require('path');

var app = new koa();
var cwd = process.cwd();

app.use(mount('/jspm_packages', serve(path)));
app.listen(13320, function () {
  console.log('listening on 13320');
});
