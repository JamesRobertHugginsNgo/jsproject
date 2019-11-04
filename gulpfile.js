const del = require('del');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const gulpfile = require('gulp-file');
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

function scaffoldMain() {
  let app = 'newapp';
  const appArgIndex = process.argv.indexOf('--app');
  if (appArgIndex !== -1 && process.argv[appArgIndex + 1]) {
    app = process.argv[appArgIndex + 1];
  }

  const pkg = require('./package.json');

  pkg.name = app;
  pkg.version = '0.0.0';

  delete pkg.bugs;
  delete pkg.homepage;
  delete pkg.repository;

  return gulp.src([
    '.editorconfig',
    '.eslintignore',
    '.eslintrc.json',
    '.gitignore',
    'babel.config.js',
    'gulpfile.js',
    'src/**/.*',
    'src/**/*',
    'test/**/.*',
    'test/**/*',
    'webpack.config.js'
  ], { base: '.' })
    .pipe(gulpfile('package.json', JSON.stringify(pkg, null, 2)))
    .pipe(gulpfile('README.md', `# ${app}\n\nDescription`))
    .pipe(gulp.dest(`../${app}`));
}

exports.scaffold = scaffoldMain;
