var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglifyjs');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
 
gulp.task('default', function() {
  console.log('Running Gulp');
});

gulp.task('build', function() {
	gulp.start('sass');
	gulp.start('js');
});

gulp.task('sass', function () {
  return gulp.src('./src/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./dist'))
});

gulp.task('js', function() {
  return gulp.src('./src/js/*.js')
    .pipe(gulp.dest('./dist'))
    .pipe(uglify('iduna.min.js', {
      outSourceMap: true
    }))
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