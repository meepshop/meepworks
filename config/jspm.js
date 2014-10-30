System.config({
  "paths": {
    "*": "*.js",
    "npm:*": "jspm_packages/npm/*.js",
    "github:*": "jspm_packages/github/*.js"
  }
});

System.config({
  "map": {
    "react": "npm:react@^0.12.0",
    "immutable": "github:facebook/immutable-js@^3.0.1",
    "co": "github:tj/co@^3.1.0",
    "superagent": "github:u9520107/superagent@0.20.0-jspm",
    "npm:react@0.12.0": {
      "envify": "npm:envify@3"
    },
    "npm:envify@3.0.0": {
      "jstransform": "npm:jstransform@^6.1.0",
      "xtend": "npm:xtend@^2.1.2",
      "esprima-fb": "npm:esprima-fb@^4001.3001.0-dev-harmony-fb",
      "through": "npm:through@^2.3.4"
    },
    "npm:jstransform@6.3.2": {
      "base62": "npm:base62@0.1.1",
      "esprima-fb": "npm:esprima-fb@^6001.1.0-dev-harmony-fb",
      "source-map": "npm:source-map@0.1.31"
    },
    "npm:xtend@2.2.0": {},
    "npm:base62@0.1.1": {},
    "npm:through@2.3.6": {},
    "npm:esprima-fb@4001.3001.0-dev-harmony-fb": {},
    "npm:esprima-fb@6001.1.0-dev-harmony-fb": {},
    "npm:source-map@0.1.31": {
      "amdefine": "npm:amdefine@0.0"
    },
    "npm:amdefine@0.0.8": {},
    "github:jspm/nodelibs@0.0.5": {
      "ieee754": "npm:ieee754@^1.1.1",
      "ripemd160": "npm:ripemd160@^0.2.0",
      "inherits": "npm:inherits@^2.0.1",
      "Base64": "npm:Base64@^0.2.0",
      "pbkdf2-compat": "npm:pbkdf2-compat@^2.0.1",
      "base64-js": "npm:base64-js@^0.0.4",
      "sha.js": "npm:sha.js@^2.2.6",
      "json": "github:systemjs/plugin-json@^0.1.0"
    },
    "npm:ieee754@1.1.4": {},
    "npm:ripemd160@0.2.0": {},
    "npm:inherits@2.0.1": {},
    "npm:Base64@0.2.1": {},
    "npm:pbkdf2-compat@2.0.1": {},
    "npm:base64-js@0.0.4": {},
    "npm:sha.js@2.2.6": {
      "json": "npm:json@^9.0.2"
    },
    "npm:json@9.0.2": {},
    "github:u9520107/superagent@0.20.0-jspm": {
      "emitter": "github:component/emitter@^1.1.3",
      "reduce": "github:component/reduce@^1.0.1"
    }
  }
});

System.config({
  "versions": {
    "npm:react": "0.12.0",
    "npm:envify": "3.0.0",
    "npm:jstransform": "6.3.2",
    "npm:xtend": "2.2.0",
    "npm:base62": "0.1.1",
    "npm:esprima-fb": [
      "4001.3001.0-dev-harmony-fb",
      "6001.1.0-dev-harmony-fb"
    ],
    "npm:through": "2.3.6",
    "npm:source-map": "0.1.31",
    "github:jspm/nodelibs": "0.0.5",
    "npm:amdefine": "0.0.8",
    "npm:ieee754": "1.1.4",
    "npm:ripemd160": "0.2.0",
    "npm:inherits": "2.0.1",
    "npm:Base64": "0.2.1",
    "npm:pbkdf2-compat": "2.0.1",
    "npm:base64-js": "0.0.4",
    "npm:sha.js": "2.2.6",
    "npm:json": "9.0.2",
    "github:systemjs/plugin-json": "0.1.0",
    "github:facebook/immutable-js": "3.0.1",
    "github:tj/co": "3.1.0",
    "github:u9520107/superagent": "0.20.0-jspm",
    "github:component/reduce": "1.0.1",
    "github:component/emitter": "1.1.3"
  }
});

