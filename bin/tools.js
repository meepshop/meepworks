var traceur = require('traceur');
var through = require('through2');
var reactTools = require('react-tools');
var co = require('co');
var cofs = require('co-fs');
var exec = require('co-exec');
var rename = require('gulp-rename');
var path = require('path');
var gulp = require('gulp');
var esprima = require('esprima');
var plumber = require('gulp-plumber');
var fs = require('fs');



function nodify(options) {
  options = options || {
    modules: 'commonjs',
    sourceMap: true,
    generators: 'parse'
  };
  return through.obj(function(file, enc, next) {
    if (file.isNull()) {
      return next();
    } else if (file.isStream()) {
      throw new Error('nodify should not be receiving streams');
    } else if (file.isBuffer() && file.path.match(/js$/i)) {

      var source = file.contents.toString(enc);
      var output = [];
      var ast = esprima.tokenize(source, {
        range: true       
      });
      var lastIdx = 0;
      ast.forEach(function (token, idx){
        if(token.value === 'import' &&
                  ast[idx + 1].value.indexOf('.css!')> -1) {
        output.push(source.substring(lastIdx, token.range[0]));
        lastIdx = ast[idx + 1].range[1] + 1;
        }
      
      });
      if(lastIdx < source.length) {
        output.push(source.substring(lastIdx));
      }

      file.contents = new Buffer(traceur.compile(output.join(''), options));
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
  return through.obj(function(file, enc, next) {
    if (file.isNull()) {
      return next();
    } else if (file.path.match(/jsx$/i)) {
      if (file.isBuffer()) {
       try { 
        file.contents = new Buffer(reactTools.transform(file.contents.toString('utf8'), options));
        this.push(file);
        next();
       } catch(err) {
        next(err);
       }
      }
    } else {
      this.push(file);
      next();
    }
  });
}

function buildFile(filepath, options) {
  return new Promise(function(resolve, reject) {
    try {
      var srcPath = filepath;
      var relativePath = path.relative(options.sourceDir, filepath);
      var destPath = options.destPath;
      //var srcNodePath;
      var destNodePath = options.destNodePath;

      if (options.glob) {
        srcPath = filepath + '/**';
      }

      var pipeline = gulp.src(srcPath).pipe(plumber({
        errorHandler: function (err) {
          reject(err);
        }
      }));      
      pipeline.pipe(jsxTransform())
      .pipe(rename(function(filepath) {
          if (filepath.extname === '.jsx') {
            filepath.extname = '.js';
          }
        }));
      if (destPath) {
        if (!options.glob) {
          destPath = path.dirname(path.resolve(destPath, relativePath));
        }
        pipeline.pipe(gulp.dest(destPath))
        .on('end', function() {
            if(destNodePath) {
              var srcNodePath;
              if(options.glob){
                srcNodePath = options.destPath + '/**';
              } else {
                if(relativePath.match(/\.jsx$/i)) {
                  relativePath = relativePath.replace(/\.jsx$/i, '.js');
                }
                srcNodePath = path.resolve(options.destPath, relativePath);
                destNodePath = path.dirname(path.resolve(destNodePath, relativePath));
              }
              gulp.src(srcNodePath)
                .pipe(plumber({
                  errorHandler: function (err) {
                    reject(err);
                  }
                }))
                .pipe(nodify())
                .pipe(gulp.dest(destNodePath))
                .on('end', resolve);
            } 
          });
      }
      else if(destNodePath) {
        if(!options.glob) {
          destNodePath = path.dirname(path.resolve(destNodePath, relativePath));
        }
          pipeline.pipe(nodify())
          .pipe(gulp.dest(destNodePath))
          .on('end', resolve);
      } else {
        reject();
      }
    } catch (err) {
      reject(err);
    }
  });
}

function * cleanPath(filepath) {
  if (yield cofs.exists(filepath)) {
    yield exec('rm -R ' + filepath);
  }
}

module.exports = {
  nodify: nodify,
  jsxTransform: jsxTransform,
  buildFile: buildFile,
  cleanPath: cleanPath
};
