var gulp = require('gulp');
var rigger = require('gulp-rigger');
var connect = require('gulp-connect');

gulp.task('build-html', function () {
    gulp.src('src/index.html')
        .pipe(rigger())
        .pipe(gulp.dest('build'));
});

gulp.task('build-css', function () {
    gulp.src('src/css/bootstrap.css')
        .pipe(gulp.dest('build/css'));
});

gulp.task('build-app-js', function () {
    gulp.src('src/app/index.js')
        .pipe(rigger())
        .pipe(gulp.dest('build/app'));
});

gulp.task('build-libs-js', function () {
    gulp.src('src/libs/libs.js')
        .pipe(rigger())
        .pipe(gulp.dest('build/libs'));
});

gulp.task('build-server-sources', function () {
    gulp.src('src/server/*')
        .pipe(gulp.dest('build/server'));
});

gulp.task('build', function() {
    gulp.run('build-html');
    gulp.run('build-css');
    gulp.run('build-app-js');
    gulp.run('build-libs-js');
    gulp.run('build-server-sources');
});

gulp.task('server', function() {
  connect.server({
    livereload: true,
    root: ['.', 'build']
  });
});
