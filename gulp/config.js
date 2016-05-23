'use strict';

// Gulp configuration

let localConfig;

// Try to load local configuration; more efficient then extending the configuration object afterwards.
try {
  localConfig = require('./config.local.js');
} catch(e) {
  try {
    localConfig = require('./config.local.default.js');
  } catch(e2) {
    localConfig = {};
  }
}

// Global (default) configuration
let src = 'website/static',
  dest = 'website/static',
  projectName = 'DE2016 Website',
  projectSlug = 'de2016-website';

module.exports = {
  src: src,
  dest: dest,

  stagingHost: 'de2016.fabriquehq.nl',
  stagingDirectory: 'de2016',

  projectName: projectName,
  projectSlug: projectSlug,

  stylesheets: {
    src: [ src + '/stylesheets/website/*.scss', '!' + src + '/stylesheets/website/{*__*,*scsslint*}' ], // Prevent PyCharm linter from interfering (bad, nasty linter! putting files everywhere like that! dirty!)
    dest: dest + '/css/website',
    watchSrc: [ src + '/stylesheets/website/**/*.scss', '!' + src + '/stylesheets/website/**/{*__*,*scsslint*}' ],

    settings: {
      indentedSyntax: false,
      imagePath: 'images' // Used by the image-url helper
    }
  },

  images: {
    src: src + '/images/**',
    dest: dest + '/images',
    watchSrc: src + '/images/**'
  },

  media: {
    src: src + '/media/**',
    dest: dest + '/media',
    watchSrc: src + '/media/**'
  },

  icons: {
    name: 'DE2016 Icons',
    src: src + '/icons/*.svg',
    watchSrc: src + '/icons/*.svg',
    dest: dest + '/fonts/ddd-icons',
    sassDest: src + '/stylesheets',
    template: './gulp/utilities/icons/templates/_icons.scss.swig',
    sassOutputName: 'website/fonts/_icons.scss',
    fontPath: '/static/fonts',
    className: 'icon',
    formats: [ 'ttf', 'eot', 'woff' ],
    appendUnicode: true,
    timestamp: Math.round(Date.now() / 1000),

    options: {
      fontName: 'de2016-icons',
      appendCodepoints: true,
      normalize: true,
      fontHeight: 1024,
      fixedWidth: true
    }
  },

  scripts: {
    src: src + '/scripts/website/*.js', // Don't process scripts in subfolders, these should be include()d.
    dest: dest + '/js',
    watchSrc: src + '/scripts/website/**/*.js',

    webpackAliases: {
      'TweenLite': __dirname + '/../node_modules/gsap/src/uncompressed/TweenLite.js',
      'TweenMax': __dirname + '/../node_modules/gsap/src/uncompressed/TweenMax.js',
      'TimelineLite': __dirname + '/../node_modules/gsap/src/uncompressed/TimelineLite.js',
      'TimelineMax': __dirname + '/../node_modules/gsap/src/uncompressed/TimelineMax.js',
      'scrollmagic': __dirname + '/../node_modules/scrollmagic/scrollmagic/uncompressed/ScrollMagic.js',
      'animation.gsap': __dirname + '/../node_modules/scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js',
      'debug.addIndicators': __dirname + '/../node_modules/scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js'
    },

    webpackLoaders: [
      { loader: 'babel', test: /.*\/scripts\/website\/.*\.jsx?$/, exclude: /(node_modules|bower_components)/ }, // Babel ES6 loader
    ]
  },

  build: {
    cssSrc: [ dest + '/css/website/*.css', '!' + dest + '/css/website/*.min.css' ],
    jsSrc: [ dest + '/js/*.js', '!' + dest + '/js/*.min.js' ],
    cssDest: dest + '/css/website/',
    jsDest: dest + '/js'
  }
};
