'use strict';

let gulp = require('gulp'),
  config = require('../config'),
  plugins = require('gulp-load-plugins')();

// Compress images in destination
function compressImages() {
  // Return stream
  return gulp
    // Read source
    .src(config.images.src)
    // Notify errors via Growl
    .pipe(plugins.plumber({
      errorHandler: plugins.notify.onError('compressImages: <%= error.message %>')
    }))
    // Start keeping track of filesizes
    .pipe(plugins.bytediff.start())
    // Optimize images
    .pipe(plugins.imagemin())
    // Report filesize savings to console
    .pipe(plugins.bytediff.stop())
    // Write to destination
    .pipe(gulp.dest(config.images.dest))
    // Print errors to console
    .on('error', plugins.util.log)
  ;
}

// Primary tasks
gulp.task('images', compressImages);
