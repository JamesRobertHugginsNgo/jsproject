const del = require('del');
const eslint = require('gulp-eslint');
const gulp = require('gulp');

function cleanup() {
  return del('dist');
}

function buildModuleJs() {
  return gulp.src('src/**/*.mjs', { since: gulp.lastRun(buildModuleJs) })
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(gulp.dest('dist'));
}

exports.default = gulp.series(cleanup, buildModuleJs);
