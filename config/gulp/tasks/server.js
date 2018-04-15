let gulp = require('gulp');
let nodemon = require('gulp-nodemon');
let childProcess = require('child_process');
var path = require('path');
/**
 * Start server for development purposes.
 * Build and restart if changes are detected in the source.
 */

gulp.task('server', ['build'], () => {
  nodemon({
    script: 'build/src/server.js',
    watch: ['src/'],
    ext: 'ts json yaml',
    tasks: ['build'],
    env: { 'NODE_ENV': process.env.NODE_ENV || 'development', 'LOG_LEVEL': 'debug', 'actions.item_LOG_LEVEL': 'debug' },
    stdout: false
  })
    .on('readable', function () {
      // Pass output through bunyan formatter
      var bunyan = childProcess.fork(
        path.join('.', 'node_modules', 'bunyan', 'bin', 'bunyan'),
        ['--output', 'simple'], // <-- any of the CLI options that you prefer
        { silent: true }
      );
      bunyan.stdout.pipe(process.stdout);
      bunyan.stderr.pipe(process.stderr);
      this.stdout.pipe(bunyan.stdin);
      this.stderr.pipe(bunyan.stdin);
    });
});
