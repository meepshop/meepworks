var traceur = require('traceur');
var through = require('through2');
var reactTools = require('react-tools');



function nodify(options) {
  options = options || {
    modules: 'commonjs',
    sourceMap: true,
    generators: 'parse'
  };
  return through.obj(function (file, enc, next) {
    if(file.isNull()) {
      return next();
    } else if(file.isStream()) {
      console.log('error');
      next();
    } else if(file.isBuffer()){
      file.contents = new Buffer(traceur.compile(file.contents.toString('utf8'), options));
      this.push(file);
      next();
    } else {
      this.push(file);
      next();
    }
  });  
}
function jsxTransform(options) {
  options = options || {
    sourceMap: true,
    harmony: true
  };
  return through.obj(function (file, enc, next) {
    if(file.isNull()) {
      return next();
    } else if(file.path.match(/jsx$/i)) {
      if(file.isStream()) {
        var data = '';
        file.contents.on('data', function (chunk) {
          console.log(chunk);
          data+=chunk.toString('utf8');
        });
        file.contents.on('end', function () {
          file.contents = reactTools.transform(data, options);
          this.push(file);
          next();

        });
      } else if(file.isBuffer()) {
        file.contents = new Buffer(reactTools.transform(file.contents.toString('utf8'), options));
        this.push(file);
        next();
      }
    } else {
      this.push(file);
      next();
    }
  });
}

module.exports = {
  nodify: nodify,
  jsxTransform: jsxTransform
};
