let gulp = require('gulp');
let tslint = require('gulp-tslint');
let paths = require('../path-constants');

/**
 * Run the tslint task
 */
gulp.task('tslint', function () {
  return gulp.src(paths.SRC_AND_TEST_GLOB)
    .pipe(tslint({
      configuration: 'node_modules/typescript_style_guide/tslint.json'
    }))
    .pipe(tslint.report({
      emitError: true,
      summarizeFailureOutput: true
    }));
});
