var gulp = require('gulp'),
  sequence = require('gulp-sequence'),
  gutil = require('gulp-util'),
  fs = require('fs'),
  argv = require('yargs').argv,
  exec = require('child_process').execSync,
  mysql = require('mysql'),
  db = require('db-migrate'),
  path = require('path');

// Drop the environment's database
gulp.task('drop', function (done) {
  var env = argv.env || 'dev',
    json = readMysqlJson(env);
  drop(json, env, done);
});

gulp.task('drop-testdb', function (done) {
  var env = argv.env || 'dev',
    json = readTestMysqlJson(env);
  drop(json, env, done);
});

// Create the environment's database
gulp.task('create', function (done) {
  var env = argv.env || 'dev',
    json = readMysqlJson(env);
  create(json, env, done);
});

gulp.task('create-testdb', function (done) {
  var env = argv.env || 'dev',
    json = readTestMysqlJson();
  create(json, env, done);
});

gulp.task('up', function () {
  var env = argv.env || 'dev';
  var cmd = 'npm run up -- --env ' + env;
  gutil.log('Running ' + cmd);
  exec(cmd, { stdio: [0, 1, 2] });
});

gulp.task('reset', (done) => {
  sequence('drop', 'create', 'up', done)
});

// Given an env, read the database.json file
// and return an Object with the environment's DB settings.
function readMysqlJson(env) {
  let relpath = '../../../database.json';
  let databaseConfigFilePath = path.join(__dirname, relpath);
  return JSON.parse(fs.readFileSync(databaseConfigFilePath, 'utf8'))[env];
}

// Given an env, read the database.json file
// and return an Object with the environment's DB settings.
function readTestMysqlJson() {
  let relpath = '../../localtest.json';
  let databaseConfigFilePath = path.join(__dirname, relpath);
  return JSON.parse(fs.readFileSync(databaseConfigFilePath, 'utf8'))['dbConfig'];
}

function drop(json, env, done) {
  gutil.log('Dropping the ' + json.database + ' from the ' + env + ' environment...');

  var connection = mysql.createConnection(json),
    sql_query = 'DROP DATABASE ' + json.database;

  var query = connection.query(sql_query, function (err, result) {
    if (err) throw err;
    gutil.log('Dropped successfully!');
    connection.destroy();
    done();
  });
  gutil.log(' Calling: ' + query.sql);
}

function create(json, env, done) {
  let database = json.database;
  delete json.database;
  json.multipleStatements = true;

  gutil.log('Creating the ' + database + ' from the ' + env + ' environment...');

  var connection = mysql.createConnection(json),
    sql_query = [
      'CREATE DATABASE',
      database,
      'DEFAULT CHARACTER SET = utf8mb4',
      'DEFAULT COLLATE = utf8mb4_bin;',
      'SELECT 1;'
    ].join(' ');

  var query = connection.query(sql_query, function (err, result) {
    if (err) throw err;
    gutil.log('Created successfully!');
    connection.destroy();
    done();
  });
  gutil.log(' Calling: ' + query.sql);
}
