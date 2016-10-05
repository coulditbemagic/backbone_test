var gulp = require('gulp');
var rigger = require('gulp-rigger');

gulp.task('html', function () {
    gulp.src('src/index.html')
        .pipe(rigger())
        .pipe(gulp.dest('build'));
});

gulp.task('js', function () {
    gulp.src('src/js/main.js')
        .pipe(rigger())
        .pipe(gulp.dest('build/js'));
});

gulp.task('libs', function () {
    gulp.src('src/libs/libs.js')
        .pipe(rigger())
        .pipe(gulp.dest('build/libs'));
});