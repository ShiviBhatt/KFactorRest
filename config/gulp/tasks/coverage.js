let gulp = require('gulp');
let exit = require('gulp-exit');
let del = require('del');
let paths = require('../path-constants');
let istanbul = require('gulp-istanbul');
let remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');
let mocha = require('gulp-mocha');
let sequence = require('gulp-sequence');

/**
 * Clean the coverage folder.
 */

gulp.task('clean-coverage', () => {
  return del.sync(paths.COVERAGE + '/**/*');
});

/**
 * Prepare istanbul for coverage.
 */

gulp.task('pre-coverage', () => {
  return gulp.src(paths.APP_BUILD_PATH + '/**/*.js')
    .pipe(istanbul({
      includeUntested: true
    }))
    .pipe(istanbul.hookRequire());
});

/**
 * Run tests under istanbul coverage. Report to console and produce json for later remapping.
 */

gulp.task('run-coverage', () => {
  process.env.NODE_ENV = 'localtest';
  process.env.SUPPRESS_NO_CONFIG_WARNING = 'SUPPRESS_NO_CONFIG_WARNING';
  return gulp.src([paths.UNIT_TEST_BUILD_PATH + '/**/*.spec.js'])
    .pipe(mocha({ reporter: 'spec' }))
    .pipe(istanbul.writeReports({
      reporters: ['json'],
      reportOpts: {
        json: { dir: './coverage', file: 'coverage-js.json' }
      }
    }));
});

/**
 * Run coverage tests against compiled JS then remaps to show coverage against source TS.
 */

gulp.task('coverage-report', () => {
  return gulp.src('coverage/coverage-js.json')
    .pipe(remapIstanbul({
      reports: {
        'text': '',
        'json': './coverage/coverage-final.json',
        'html': './coverage/html-report'
      }
    })).pipe(exit());;
})

gulp.task('coverage', sequence('clean-coverage', 'pre-coverage', 'run-coverage', 'coverage-report'));
