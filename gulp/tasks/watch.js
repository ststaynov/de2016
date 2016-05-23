'use strict';

let gulp = require('gulp'),
  config = require('../config'),
  plugins = require('gulp-load-plugins')();

// Watch for changes
function watchFiles() {

  // Fire up all the watchers
  gulp.watch(config.stylesheets.watchSrc, gulp.series('stylesheets:compile'));
  gulp.watch(config.scripts.watchSrc, gulp.series('scripts:compile'));
  gulp.watch(config.icons.watchSrc, gulp.series('icons', 'stylesheets:compile'));

}

// Primary tasks
gulp.task('watch', watchFiles);
