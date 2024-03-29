const gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    sass = require('gulp-sass'),
    browserify = require("browserify"),
    babelify = require("babelify"),
    source = require('vinyl-source-stream'),
    gutil = require('gulp-util'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    streamify = require('gulp-streamify'),
    fileinclude  = require('gulp-file-include');
const src = {
    js: 'src/Plugin/js/**/*.js',
    css: 'src/Plugin/css/*.scss',
    file: 'src/**/*.html',
    img: 'src/Image/**/*',
    php:'src/php/**/*'
};


gulp.task('copyIndexJs', function () {
    browserify({debug: true})
        .transform("babelify", {presets: ["es2015"]})
        .require("src/Plugin/js/index.js", {entry: true})
        .bundle()
        .on('error',gutil.log)
        .pipe(source('index.js'))
        // .pipe(streamify(uglify()))
        .pipe(gulp.dest('dist/Plugin/js/'))
        .pipe(livereload());
});

gulp.task('copyEditJs', function () {
    browserify({debug: true})
        .transform("babelify", {presets: ["es2015"]})
        .require("src/Plugin/js/edit.js", {entry: true})
        .bundle()
        .on('error',gutil.log)
        .pipe(source('edit.js'))
        // .pipe(streamify(uglify()))
        .pipe(gulp.dest('dist/Plugin/js/'))
        .pipe(livereload());
});

gulp.task('sass', function () {
    return gulp.src('src/Plugin/css/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/Plugin/css'))
        .pipe(livereload());
});

gulp.task('copyRoot',function(){
    return gulp.src('src/Blog/root/*.html')
        .pipe(gulp.dest('dist/Blog/root/'))
});

gulp.task('copyPHP',function(){
    return gulp.src('src/php/**/*.php')
        .pipe(gulp.dest('dist/php/'))
        .pipe(livereload());
});

gulp.task('copyFile', function () {
    return gulp.src('src/**/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(livereload());
});

gulp.task('copyImage', function () {
    return gulp.src('src/Image/**/*')
        .pipe(gulp.dest('dist/Image/'));
});

gulp.task('watch', ['copyIndexJs','copyEditJs','copyPHP', 'sass','copyRoot', 'copyFile', 'copyImage'], function () {
    livereload.listen();
    gulp.watch(src.js, ['copyIndexJs']);
    gulp.watch(src.js, ['copyEditJs']);
    gulp.watch(src.css, ['sass']);
    gulp.watch(src.file, ['copyFile']);
    gulp.watch(src.php,['copyPHP']);
});

gulp.task('default', ['watch']);