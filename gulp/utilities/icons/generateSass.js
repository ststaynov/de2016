'use strict';

let gulp = require('gulp'),
  config = require('../../config'),
  plugins = require('gulp-load-plugins')();

// Generate icon font sass file
function generateIconFontSass(codepoints, options) {
  // Return stream
  return gulp
    // Read source
    .src(config.icons.template)
    // Notify errors via Growl
    .pipe(plugins.plumber({
      errorHandler: plugins.notify.onError('generateIconFontSass: <%= error.message %>')
    }))
    // Generate SASS file
    .pipe(plugins.swig({
      data: {
        // Map icons
        icons: codepoints.map(function(icon) {
          return { name: icon.name, code: icon.codepoint.toString(16) };
        }),

        fontName: config.icons.options.fontName,
        fontPath: config.icons.fontPath,
        className: config.icons.className
      }
    }))
    // Rename file
    .pipe(plugins.rename(config.icons.sassOutputName))
    // Write to destination
    .pipe(gulp.dest(config.icons.sassDest))
    // TODO: Should errors be printed to the console?
  ;
}

module.exports = generateIconFontSass;
