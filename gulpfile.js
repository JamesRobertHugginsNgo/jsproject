const del = require('del');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

function cleanup() {
  return del('dist');
}

function buildModuleJs() {
  return gulp.src('src/**/*.mjs', { since: gulp.lastRun(buildModuleJs) })
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(gulp.dest('dist'));
}

function bundleWithWebpack() {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      if (err) {
        return reject(err)
      }
      if (stats.hasErrors()) {
        return reject(new Error(stats.compilation.errors.join('\n')))
      }
      resolve()
    })
  })
}

exports.default = gulp.series(cleanup, gulp.parallel(buildModuleJs, bundleWithWebpack));
