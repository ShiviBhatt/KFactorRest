let gulp = require('gulp');
var open = require('opn');

gulp.task('swagger', ['server'], (done) => {
  var url = 'http://localhost:1339/swagger';

  open(url);
  done();
});
