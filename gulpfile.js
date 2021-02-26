'use strict';
const { src, dest, series } = require('gulp');
var postcss = require('gulp-postcss');

var watchify = require('watchify');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var log = require('gulplog');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
const babel = require('gulp-babel')

// add custom browserify options here
var customOpts = {
  entries: ['./src/index.js'],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
// var b = watchify(browserify(opts));

function cssTask(cb) {
  // place code for your default task here
    const postcss = require('gulp-postcss')
    const sourcemaps = require('gulp-sourcemaps')

    return src('./css/*.css')
      .pipe( sourcemaps.init() )
      .pipe( postcss([ require('precss'), require('autoprefixer'), require('tailwindcss') ]) )
      .pipe( sourcemaps.write('.') )
      .pipe( dest('./build') )
      // cb();
}

function bundle() {
  return browserify(['./src/index.js'])
  .transform("babelify", {presets: ["@babel/preset-env"]})
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(dest('./build'));
}

// b.on('update', bundle); // on any dep update, runs the bundler
// b.on('log', log.info); // output build logs to terminal

exports.css = cssTask;
exports.build = bundle;
exports.default = series(cssTask, bundle)
