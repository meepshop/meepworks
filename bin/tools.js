var traceur = require('traceur');
var through = require('through2');
var reactTools = require('react-tools');
var co = require('co');
var cofs = require('co-fs');
var exec = require('co-exec');
var rename = require('gulp-rename');
var path = require('path');
var gulp = require('gulp');



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
  return through.obj(function(file, enc, next) {
    if (file.isNull()) {
      return next();
    } else if (file.path.match(/jsx$/i)) {
      if (file.isStream()) {
        var data = '';
        file.contents.on('data', function(chunk) {
          console.log(chunk);
          data += chunk.toString('utf8');
        });
        file.contents.on('end', function() {
          file.contents = reactTools.transform(data, options);
          this.push(file);
          next();

        });
      } else if (file.isBuffer()) {
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

function * buildFile(filepath, options) {
  return new Promise(function(resolve, reject) {

    try {
      var srcPath = filepath;
      var relativePath = path.relative(options.sourceDir, filepath);
      var destPath = options.destPath;
      //var srcNodePath;
      var destNodePath = options.destNodePath;

      if (options.glob) {
        srcPath = filepath + '/**';
        //srcNodePath = options.distPath + '/**';
      }
      //else {
      //  var relativePath = path.relative(options.sourceDir, filepath);
      //  destPath = path.dirname(path.resolve(destPath, relativePath));
      //  srcNodePath = path.resolve(options.distPath, relativePath);
      //  destNodePath = path.dirname(path.resolve(destNodePath, relativePath));
      //}
      var pipeline = gulp.src(srcPath);
      pipeline.on('error', reject);
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
                srcNodePath = path.resolve(options.destPath, relativePath);
                destNodePath = path.dirname(path.resolve(destNodePath, relativePath));
              }
              gulp.src(srcNodePath)
                .on('error', reject)
                .pipe(nodify())
                .pipe(gulp.dest(destNodePath))
                .on('end', resolve);
            } 
          });
      } else if(destNodePath) {
        if(!options.glob) {
          destNodePath = path.dirname(path.resolve(destNodePath, relativePath));
        }
          pipeline.pipe(nodify())
          .pipe(gulp.dest(destNodePath))
          .on('end', resolve);
      } else {
        reject();
      }

      // .pipe(gulp.dest(destPath))
      //  .on('end', function() {
      //    gulp.src(srcNodePath)
      //      .pipe(nodify())
      //      .pipe(gulp.dest(destNodePath))
      //      .on('end', function() {
      //        resolve();
      //      })
      //      .on('error', function(err) {
      //        reject(err);
      //      });
      //  })
      //  .on('error', function(err) {
      //    reject(err);
      //  });
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
