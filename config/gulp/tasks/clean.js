let gulp = require('gulp');
let del = require('del');
let paths = require('../path-constants');

gulp.task('clean', () => {
  del.sync(paths.APP_BUILD_PATH + '/**/*');
});
