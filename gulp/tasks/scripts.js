'use strict';

let gulp = require('gulp'),
  config = require('../config'),
  plugins = require('gulp-load-plugins')();

let webpack = require('webpack'),
  webpackStream = require('webpack-stream'),
  named = require('vinyl-named'),
  path = require('path');

// Compile scripts from source to destination
function compileScripts() {
  // Return stream
  return gulp
    // Read source
    .src(config.scripts.src)
    // Notify errors via Growl
    .pipe(plugins.plumber({
      errorHandler: plugins.notify.onError('compileScripts: <%= error.message %>')
    }))
    // Keep original filenames; prevent webpack from outputing a concatenated <hash>.js file
    .pipe(named())
    // Compile scripts with webpack
    .pipe(webpackStream({
      watch: false,
      resolve: {
        root: [ path.join(__dirname, 'node_modules/') ],
        extensions: [ '', '.js', '.html' ],
        modulesDirectories: [ 'node_modules' ],
        alias: config.scripts.webpackAliases
      },
      plugins: [
        // Make jQuery globally availble in all scripts
        new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery', 'window.jQuery': 'jquery' })
      ],
      module: {
        loaders: config.scripts.webpackLoaders
      }
    }))
    // Write to destination
    .pipe(gulp.dest(config.scripts.dest))
    // Print errors to console
    .on('error', plugins.util.log)
  ;
}

// Lint scripts from source
// TODO: jshint supports extraction of javascript from html, look into that, see: https://www.npmjs.com/package/gulp-jshint
function lintScripts() {
  // Return stream
  return gulp
    // Read source
    .src(config.scripts.watchSrc)
    // Notify errors via Growl
    .pipe(plugins.plumber({
      errorHandler: plugins.notify.onError('lintScripts: <%= error.message %>')
    }))
    // Don't read unchanged files, so the complete error list only shows up once
    .pipe(plugins.cached('jshint-filecache'))
    // Hint files with .jshintrc settings
    .pipe(plugins.jshint())
    // Use stylish jshint reporter (in console)
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    // Print errors to console
    .on('error', plugins.util.log)
  ;
}

// Uglify scripts from destination to destination
function uglifyScripts() {
  // Return stream
  return gulp
    // Read destination
    .src(config.build.jsSrc)
    // Notify errors via Growl
    .pipe(plugins.plumber({
      errorHandler: plugins.notify.onError('uglifyScripts: <%= error.message %>')
    }))
    // Keep original filenames; prevent webpack from outputing a concatenated <hash>.js file
    .pipe(named())
    // Add '.min' to filenames when writing at the end of the stream
    .pipe(plugins.rename({
      extname: '.min.js'
    }))
    // Start keeping track of filesizes
    .pipe(plugins.bytediff.start())
    // Uglify scripts
    .pipe(plugins.uglify())
    // Report filesize savings to console
    .pipe(plugins.bytediff.stop())
    // Write to destination
    .pipe(gulp.dest(config.build.jsDest))
    // Print errors to console
    .on('error', plugins.util.log)
  ;
}

// Secondary tasks
gulp.task('scripts:compile', compileScripts);
gulp.task('scripts:lint', lintScripts);
gulp.task('scripts:uglify', uglifyScripts);

// Primary tasks
gulp.task('scripts', gulp.series('scripts:lint', 'scripts:compile', 'scripts:uglify'));
