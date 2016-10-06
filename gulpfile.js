var gulp = require('gulp');
var rigger = require('gulp-rigger');

gulp.task('html', function () {
    gulp.src('src/index.html')
        .pipe(rigger())
        .pipe(gulp.dest('build'));
});

gulp.task('js', function () {
    gulp.src('src/app/index.js')
        .pipe(rigger())
        .pipe(gulp.dest('build/app'));
});

gulp.task('libs', function () {
    gulp.src('src/libs/libs.js')
        .pipe(rigger())
        .pipe(gulp.dest('build/libs'));
});

gulp.task('build', function() {
    gulp.run('html');
    gulp.run('js');
    gulp.run('libs');
});
