'use strict';

let gulp = require('gulp'),
  config = require('../config'),
  plugins = require('gulp-load-plugins')();

let generateSass = require('../utilities/icons/generateSass');

// Compile svg's to webfont
function compileIcons() {
  // Return stream
  return gulp
    // Read source
    .src(config.icons.src)
    // Notify errors via Growl
    .pipe(plugins.plumber({
      errorHandler: plugins.notify.onError('compileIcons: <%= error.message %>')
    }))
    // Compile to webfont
    .pipe(plugins.iconfont(config.icons.options))
    // Generate SASS file for import
    .on('codepoints', generateSass)
    // Write to destination
    .pipe(gulp.dest(config.icons.dest))
  ;
}

// Primary tasks
gulp.task('icons', compileIcons);
