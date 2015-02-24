"use strict";

System.register(["koa", "koa-mount", "koa-static", "koa-favicon", "path", "../dist/server-app-driver", "./app", "debug"], function (_export) {
  var koa, mount, serve, favicon, path, AppDriver, TestApp, debug, server;
  return {
    setters: [function (_koa) {
      koa = _koa["default"];
    }, function (_koaMount) {
      mount = _koaMount["default"];
    }, function (_koaStatic) {
      serve = _koaStatic["default"];
    }, function (_koaFavicon) {
      favicon = _koaFavicon["default"];
    }, function (_path) {
      path = _path["default"];
    }, function (_distServerAppDriver) {
      AppDriver = _distServerAppDriver["default"];
    }, function (_app) {
      TestApp = _app["default"];
    }, function (_debug) {
      debug = _debug["default"];
    }],
    execute: function () {
      server = koa();

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
    }
  };
});

//# sourceMappingURL=./server.js.map