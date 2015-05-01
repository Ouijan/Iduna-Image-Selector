var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var karma = require('gulp-karma');
var notify = require('gulp-notify');
 
gulp.task('default', function() {
	console.log('');
  console.log('--- Iduna Gulp Tasks ---');
  console.log('gulp build     - Compiles Sass & Javascript into dist folder');
  console.log('gulp sass      - Compiles Sass files into dist folder');
  console.log('gulp js        - Compiles Javascript files into dist folder');
  console.log('gulp watch     - Compiles Sass/Javascript & Watch files for changes');
  console.log('gulp test      - Starts running Karma/Jasmine Tests');
  console.log('');
});

gulp.task('build', function() {
	gulp.start('sass');
	gulp.start('js');
});

gulp.task('sass', function () {
  return gulp.src('./src/scss/*.scss')
    .pipe( sass({
        errLogToConsole: false,
        onError: function(err) {
          return notify().write(err);
        },
      }))
    .pipe(gulp.dest('./dist'))
});

gulp.task('js', function() {
  return gulp.src('./src/js/*.js')
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
	gulp.start('sass');
	gulp.start('js');
	return watch('./src/**/*', function() {
		gulp.start('sass');
		gulp.start('js');
	});
});

gulp.task('test', function() {
  var testFiles = [
    'node_modules/underscore/underscore-min.js',
    'node_modules/jquery/dist/jquery.min.js',
    'src/js/*.js',
    'test/**/*.spec.js',
  ];
	return gulp.src(testFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'watch'
    }));
});