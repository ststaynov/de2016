'use strict';

let gulp = require('gulp'),
  config = require('../config'),
  plugins = require('gulp-load-plugins')();

// Compile stylesheets from source to destination
function compileStylesheets() {
  // Return stream
  return gulp
    // Read source
    .src(config.stylesheets.src)
    // Notify errors via Gulp
    .pipe(plugins.plumber({
      errorHandler: plugins.notify.onError('compileStylesheets: <%= error.message %>')
    }))
    // Start sourcemaps
    .pipe(plugins.sourcemaps.init())
    // Compile sass
    .pipe(plugins.sass(config.stylesheets.settings))
    // Compile sourcemaps
    .pipe(plugins.sourcemaps.write())
    // Write to destination
    .pipe(gulp.dest(config.stylesheets.dest))
    // Print errors to console
    .on('error', plugins.util.log)
  ;
}

// Lint stylesheets from source
function lintStylesheets() {
  // Return stream
  return gulp
    // Read source
    .src(config.stylesheets.watchSrc)
    // Notify errors via Gulp
    .pipe(plugins.plumber({
      errorHandler: plugins.notify.onError('lintStylesheets: <%= error.message %>')
    }))
    // Don't read unchanged files, so the complete error list only shows up once
    .pipe(plugins.cached('scsslint-filecache'))
    // Lint files with .scss-lint.yml settings
    .pipe(plugins.scssLint({
      config: '.scss-lint.yml',
      sync: true
    }))
    // Use console reporter
    .pipe(plugins.scssLint.failReporter('E'))
  ;
}

// Minify stylesheets from destination
function minifyStylesheets() {
  // Return stream
  return gulp
    // Read source
    .src(config.build.cssSrc)
    // Notify errors via Gulp
    .pipe(plugins.plumber({
      errorHandler: plugins.notify.onError('minifyStylesheets: <%= error.message %>')
    }))
    // Add '.min' to filenames when writing at the end of the stream
    .pipe(plugins.rename({
      extname: '.min.css'
    }))
    // Start keeping track of filesizes
    .pipe(plugins.bytediff.start())
    // Minify stylesheets
    .pipe(plugins.minifyCss({
      keepBreaks: true
    }))
    // Report filesize savings to console
    .pipe(plugins.bytediff.stop())
    // Write to destination
    .pipe(gulp.dest(config.build.cssDest))
    // Print errors to console
    .on('error', plugins.util.log)
  ;
}

// Secondary tasks
gulp.task('stylesheets:compile', compileStylesheets);
gulp.task('stylesheets:lint', lintStylesheets);
gulp.task('stylesheets:minify', minifyStylesheets);

// Primary tasks
gulp.task('stylesheets', gulp.series('stylesheets:lint', 'stylesheets:compile', 'stylesheets:minify'));
