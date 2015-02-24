"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var koa = _babelHelpers.interopRequire(require("koa"));

var mount = _babelHelpers.interopRequire(require("koa-mount"));

var serve = _babelHelpers.interopRequire(require("koa-static"));

var favicon = _babelHelpers.interopRequire(require("koa-favicon"));

var path = _babelHelpers.interopRequire(require("path"));

var AppDriver = _babelHelpers.interopRequire(require("../dist/server-app-driver"));

var TestApp = _babelHelpers.interopRequire(require("./app"));

var debug = _babelHelpers.interopRequire(require("debug"));

var server = koa();
debug.enable("bind-url");

server.use(favicon());
server.use(mount("/jspm_packages", serve(path.resolve(__dirname, "../jspm_packages/"))));
server.use(mount("/dist", serve(path.resolve(__dirname, "../source"))));
server.use(mount("/meepworks", serve(path.resolve(__dirname, "../source"))));
server.use(mount("/test-server", serve(path.resolve(__dirname, "../server-client"))));

server.use(mount("/", new AppDriver(TestApp, {
  appPath: "app",
  jspm: {
    path: "jspm_packages",
    config: "jspm_packages/config.js"
  },
  distPath: {
    external: "test-server",
    internal: "server-client"
  },
  fileRoot: __dirname
})));

server.listen("15551");

//# sourceMappingURL=./server.js.map