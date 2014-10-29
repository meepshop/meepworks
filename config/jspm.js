System.config({
  "paths": {
    "*": "*.js",
    "npm:*": "jspm_packages/npm/*.js",
    "github:*": "jspm_packages/github/*.js"
  }
});

System.config({
  "map": {
    "react": "npm:react@^0.11.2",
    "github:visionmedia/co": "github:tj/co@^3.1.0",
    "github:facebook/immutable-js": "github:facebook/immutable-js@^2.6.1",
    "github:tj/superagent": "github:visionmedia/superagent@^0.20.0",
    "npm:react@0.11.2": {
      "envify": "npm:envify@2"
    },
    "npm:envify@2.0.1": {
      "esprima-fb": "npm:esprima-fb@^3001.1.0-dev-harmony-fb",
      "through": "npm:through@^2.3.4",
      "jstransform": "npm:jstransform@3.0",
      "xtend": "npm:xtend@^2.1.2"
    },
    "npm:jstransform@3.0.0": {
      "esprima-fb": "npm:esprima-fb@^3001.1.0-dev-harmony-fb",
      "source-map": "npm:source-map@0.1.31",
      "base62": "npm:base62@0.1.1"
    },
    "npm:source-map@0.1.31": {
      "amdefine": "npm:amdefine@0.0"
    },
    "npm:esprima-fb@3001.1.0-dev-harmony-fb": {},
    "npm:through@2.3.6": {},
    "npm:xtend@2.2.0": {},
    "npm:amdefine@0.0.8": {},
    "npm:base62@0.1.1": {},
    "github:jspm/nodelibs@0.0.5": {
      "Base64": "npm:Base64@^0.2.0",
      "pbkdf2-compat": "npm:pbkdf2-compat@^2.0.1",
      "ieee754": "npm:ieee754@^1.1.1",
      "inherits": "npm:inherits@^2.0.1",
      "sha.js": "npm:sha.js@^2.2.6",
      "ripemd160": "npm:ripemd160@^0.2.0",
      "base64-js": "npm:base64-js@^0.0.4",
      "json": "github:systemjs/plugin-json@^0.1.0"
    },
    "npm:Base64@0.2.1": {},
    "npm:pbkdf2-compat@2.0.1": {},
    "npm:inherits@2.0.1": {},
    "npm:ieee754@1.1.4": {},
    "npm:sha.js@2.2.6": {
      "json": "npm:json@^9.0.1"
    },
    "npm:ripemd160@0.2.0": {},
    "npm:base64-js@0.0.4": {},
    "npm:json@9.0.1": {},
    "npm:json@9.0.2": {}
  }
});

System.config({
  "versions": {
    "npm:react": "0.11.2",
    "npm:envify": "2.0.1",
    "npm:esprima-fb": "3001.1.0-dev-harmony-fb",
    "npm:through": "2.3.6",
    "npm:jstransform": "3.0.0",
    "npm:xtend": "2.2.0",
    "npm:source-map": "0.1.31",
    "npm:amdefine": "0.0.8",
    "npm:base62": "0.1.1",
    "github:jspm/nodelibs": "0.0.5",
    "npm:Base64": "0.2.1",
    "npm:pbkdf2-compat": "2.0.1",
    "npm:ieee754": "1.1.4",
    "npm:inherits": "2.0.1",
    "npm:sha.js": "2.2.6",
    "npm:ripemd160": "0.2.0",
    "npm:base64-js": "0.0.4",
    "npm:json": [
      "9.0.2",
      "9.0.1"
    ],
    "github:systemjs/plugin-json": "0.1.0",
    "github:tj/co": "3.1.0",
    "github:visionmedia/superagent": "0.20.0",
    "github:facebook/immutable-js": "2.6.2"
  }
});

