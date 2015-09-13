'use strict';

var gulp = require('gulp');
var gutil = require("gulp-util");
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var historyApiFallback = require('connect-history-api-fallback');
var watchify = require('watchify');
var del = require('del');

var $ = require('gulp-load-plugins')();

var webpack = require("webpack");
var webpackConfig = require("./webpack.config");

var appDir= './app/'
var buildDir = './build/';
var distDir = './dist/';

gulp.task('lint', function() {
    return gulp.src(appDir + 'src/**/*')
        .pipe($.eslint({
            useEsLintrc: true
        }))
        .pipe($.eslint.format());
});

gulp.task('html', function() {
    return gulp.src(appDir + '*.html')
        .pipe(gulp.dest(buildDir))
        .pipe($.size());
});

gulp.task('clean', function(cb) {
    del([
        buildDir,
        distDir
    ], cb);
});

gulp.task('build-watch', function(callback) {
    var config = Object.create(webpackConfig);
    config.devtool = "sourcemap";
    config.debug = true;
    config['output-pathinfo'] = true;
    webpack(config).run(function(err,stats){
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task('build', function(callback) {
    var config = Object.create(webpackConfig);
    webpack(config).run(function(err,stats){
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task('watch', ['html', 'build-watch'], function() {
    browserSync.init({
        server: {
            baseDir: buildDir,
            middleware: [historyApiFallback()]
        }
    });

//    gulp.watch('assets/**/*', ['build-watch']);

    gulp.watch(appDir + '*.html', ['html']);

    gulp.watch(["app/**/*"], ['build-watch']);

    $.watch([
        buildDir + '**/*.js',
        buildDir + '**/*.css',
        buildDir + '**/*.html'
    ], browserSync.reload);
});

gulp.task('serve', function(cb) {
    runSequence(
//        'clean',
        'watch',
        cb
    );
});

gulp.task('dist', function() {
    runSequence(
        'clean',
        'build'
    );
});

gulp.task('default', ['serve']);
