'use strict';

let gulp = require('gulp'),
  config = require('../config'),
  plugins = require('gulp-load-plugins')();

// Compress media in destination
function compressMedia() {
  // Return stream
  return gulp
    // Read source
    .src(config.media.src)
    // Notify errors via Growl
    .pipe(plugins.plumber({
      errorHandler: plugins.notify.onError('compressMedia: <%= error.message %>')
    }))
    // Start keeping track of filesizes
    .pipe(plugins.bytediff.start())
    // Optimize images
    .pipe(plugins.imagemin())
    // Report filesize savings to console
    .pipe(plugins.bytediff.stop())
    // Write to destination
    .pipe(gulp.dest(config.media.dest))
    // Print errors to console
    .on('error', plugins.util.log)
  ;
}

// Primary tasks
gulp.task('media', compressMedia);
