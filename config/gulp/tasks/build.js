let gulp = require('gulp');
let ts = require('gulp-typescript');
let sourcemaps = require('gulp-sourcemaps');
let paths = require('../path-constants');
let sequence = require('gulp-sequence');

const APP_PROJECT = ts.createProject('tsconfig.json');

gulp.task('build-step', () => {
  // Copy static content.
  gulp.src(paths.STATIC_APP_GLOB)
    .pipe(gulp.dest(paths.APP_BUILD_PATH));

  // Build source.
  return gulp.src(paths.SRC_FILE_GLOB)
    .pipe(sourcemaps.init())
    .pipe(APP_PROJECT())
    .js.pipe(sourcemaps.write('.', {
      includeContent: false,
      mapSources: function (path) {
        // need to build sources so that we walk up the 
        // path once for each path divider beyond the first
        let depth = path.split('/').length - 2;
        return `../`.repeat(depth) + path;
      }
    }))
    .pipe(gulp.dest(paths.APP_BUILD_PATH));
});

gulp.task('build', sequence('clean', 'tslint', 'build-step'));
