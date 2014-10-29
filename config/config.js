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
    "npm:react": "npm:react@^0.12.0",
    "npm:immutable": "npm:immutable@^2.6.2",
    "github:visionmedia/co": "github:tj/co@^3.1.0",
    "superagent": "github:visionmedia/superagent@^0.20.0",
    "npm:react@0.12.0": {
      "envify": "npm:envify@3"
    },
    "npm:envify@3.0.0": {
      "esprima-fb": "npm:esprima-fb@^4001.3001.0-dev-harmony-fb",
      "xtend": "npm:xtend@^2.1.2",
      "through": "npm:through@^2.3.4",
      "jstransform": "npm:jstransform@^6.1.0"
    },
    "npm:jstransform@6.3.2": {
      "esprima-fb": "npm:esprima-fb@^6001.1.0-dev-harmony-fb",
      "source-map": "npm:source-map@0.1.31",
      "base62": "npm:base62@0.1.1"
    },
    "npm:source-map@0.1.31": {
      "amdefine": "npm:amdefine@0.0"
    },
    "npm:immutable@2.6.2": {},
    "npm:xtend@2.2.0": {},
    "npm:through@2.3.6": {},
    "npm:esprima-fb@4001.3001.0-dev-harmony-fb": {},
    "npm:esprima-fb@6001.1.0-dev-harmony-fb": {},
    "npm:base62@0.1.1": {},
    "npm:amdefine@0.0.8": {},
    "github:jspm/nodelibs@0.0.5": {
      "base64-js": "npm:base64-js@^0.0.4",
      "ripemd160": "npm:ripemd160@^0.2.0",
      "pbkdf2-compat": "npm:pbkdf2-compat@^2.0.1",
      "inherits": "npm:inherits@^2.0.1",
      "Base64": "npm:Base64@^0.2.0",
      "ieee754": "npm:ieee754@^1.1.1",
      "sha.js": "npm:sha.js@^2.2.6",
      "json": "github:systemjs/plugin-json@^0.1.0"
    },
    "npm:base64-js@0.0.4": {},
    "npm:ripemd160@0.2.0": {},
    "npm:pbkdf2-compat@2.0.1": {},
    "npm:inherits@2.0.1": {},
    "npm:Base64@0.2.1": {},
    "npm:ieee754@1.1.4": {},
    "npm:sha.js@2.2.6": {
      "json": "npm:json@^9.0.2"
    },
    "npm:json@9.0.2": {}
  }
});

System.config({
  "versions": {
    "npm:react": "0.12.0",
    "npm:immutable": "2.6.2",
    "npm:envify": "3.0.0",
    "npm:esprima-fb": [
      "4001.3001.0-dev-harmony-fb",
      "6001.1.0-dev-harmony-fb"
    ],
    "npm:xtend": "2.2.0",
    "npm:through": "2.3.6",
    "npm:jstransform": "6.3.2",
    "github:tj/co": "3.1.0",
    "npm:source-map": "0.1.31",
    "npm:base62": "0.1.1",
    "npm:amdefine": "0.0.8",
    "github:jspm/nodelibs": "0.0.5",
    "npm:base64-js": "0.0.4",
    "npm:ripemd160": "0.2.0",
    "npm:pbkdf2-compat": "2.0.1",
    "npm:inherits": "2.0.1",
    "npm:Base64": "0.2.1",
    "npm:ieee754": "1.1.4",
    "npm:sha.js": "2.2.6",
    "npm:json": "9.0.2",
    "github:systemjs/plugin-json": "0.1.0",
    "github:visionmedia/superagent": "0.20.0"
  }
});

