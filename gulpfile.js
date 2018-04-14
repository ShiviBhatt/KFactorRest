var gulp = require('gulp');
var requireDir = require('require-dir');
require('reflect-metadata');

/**
 * Require all task files.
 */

requireDir('./config/gulp', { recurse: true });

/**
 * Gracefully exit.
 */

process.once('SIGINT', function () {
  process.exit(0);
});
