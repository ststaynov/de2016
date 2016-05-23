'use strict';

let gulp = require('gulp');

// Build tasks
gulp.task('build:fast', gulp.series('icons', gulp.parallel('stylesheets:compile', 'scripts:compile'))); // Fast build is without uglify or linters due to performance.
gulp.task('build:complete', gulp.series('icons', gulp.parallel('stylesheets', 'scripts', 'images', 'media')));

// Primary tasks
gulp.task('build', gulp.series('build:complete'));
gulp.task('default', gulp.series('build:fast', 'watch'));
