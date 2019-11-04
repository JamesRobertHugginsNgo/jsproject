const babel = require('gulp-babel');
const del = require('del');
const eslint = require('gulp-eslint');
const gulp = require('gulp');

function cleanup() {
  return del('dist');
}

function buildJs() {
  return gulp.src('src/**/*.js', { since: gulp.lastRun(buildJs) })
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(babel())
    .pipe(gulp.dest('dist'));
}

exports.default = gulp.series(cleanup, buildJs);
