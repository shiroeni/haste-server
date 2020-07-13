const gulp = require('gulp');
const uglify = require('gulp-uglify');
// const rename = require('gulp-rename');
const concat = require('gulp-concat');

gulp.task('compile:javascript', () => {
    return gulp.src(['assets/js/application.js'])
        .pipe(concat('application.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./static'))
});

gulp.task('compile:styles', () => {
    return gulp.src([
            'assets/css/application.css',
            'node_modules/highlight.js/styles/gruvbox-dark.css'
        ])
        .pipe(concat('application.css'))
        .pipe(gulp.dest('./static'))
});