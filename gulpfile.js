(function() {
  'use strict';

  var gulp = require('gulp');
  var $ = require('gulp-load-plugins')();
  var karma = require('karma');
  var del = require('del');
  var root = __dirname;
  var version;

  var startKarma = function(config, done) {
    new karma.Server({
      configFile: __dirname + '/karma.conf.js',
      singleRun: (typeof config.singleRun !== 'undefined' ? config.singleRun : true),
      autoWatch: (typeof config.autoWatch !== 'undefined' ? config.autoWatch : false)
    }, done).start();
  };

  var getVersion = function(callback) {
    var rl = require('readline').createInterface({
      input: require('fs').createReadStream('CHANGELOG.md')
    });
    if (version) {
      callback(version);
    } else {
      rl.on('line', function(line) {
        if (!version) {
          version = line.trim();
          rl.close();
        }
      });

      rl.on('close', function() {
        if (!version) {
          version = '1.0.0';
        }

        callback(version);
      });
    }
  };

  gulp.task('default', ['tdd']);

  gulp.task('test', function(done) {
    startKarma({
      singleRun: true,
      autoWatch: false
    }, done);
  });

  gulp.task('tdd', function(done) {
    startKarma({
      singleRun: false,
      autoWatch: true
    }, done);
  });

  gulp.task('jshint', function() {
    return gulp.src('lib/*.js')
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish'))
      .pipe($.jshint.reporter('fail'));
  });

  gulp.task('clean', function() {
    return del(['dist/*'], { force: true });
  });

  gulp.task('dist', function(done) {
    getVersion(function(version) {
      gulp.src('lib/*.js')
        .pipe($.uglify())
        .pipe($.rename(function(path) {
          path.basename += '.' + version + '.min';
        }))
        .pipe(gulp.dest(require('path').join(root, '/dist')));
      done();
    });
  });

  gulp.task('build', function(done) {
    require('run-sequence')(['clean', 'updateVersion'], 'dist', done);
  });

  gulp.task('updateVersion', function(done) {
    getVersion(function(version) {
      gulp.src('package.json')
      .pipe($.bump({
        version: version
      }))
      .pipe(gulp.dest(root));
      done();
    });
  });
})();
