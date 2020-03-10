/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp'),
    gp_concat = require('gulp-concat'),
    gp_rename = require('gulp-rename'),
    gp_uglify = require('gulp-uglify'),
    declare = require('gulp-declare'),
    jslint = require('gulp-jslint'),
    insert = require('gulp-insert'),
    prettify = require('gulp-prettify');
var markdown = require('gulp-markdown');
var shell = require('gulp-shell');
var path = require('path');


gulp.task('buildProductionPlugins', function () {
    return gulp.src('plugins/production/**/plugin.js')
        .pipe(gp_concat('plugins.js'))
        .pipe(gulp.dest('dist'))
        .pipe(gp_rename('plugins.min.js'))
        .pipe(gp_uglify())
        .pipe(gulp.dest('dist'));
});



gulp.task('buildplugins', function () {
    return gulp.src('plugins/**/plugin.js')
        .pipe(gp_concat('plugins.incubator.js'))
        .pipe(gulp.dest('dist'))
        .pipe(gp_rename('plugins.incubator.min.js'))
        .pipe(gp_uglify())
        .pipe(gulp.dest('dist'));
});



gulp.task('compileFunctions', function () {
    return gulp.src('functions/**/*.js')
        .pipe(declare({
            namespace: 'L', // Use NS as the base namespace
            noRedeclare: true, // Avoid duplicate declarations
            processName: function (filePath) {
                // Drop the client/templates/ folder from the namespace path
                var path = filePath.replace('functions\\production', '');
                path = path.replace('functions\\incubator', '')
                return declare.processNameByPath(path);
            }
        }))
        .pipe(gp_concat('LFunctions.incubator.js'))
        .pipe(gulp.dest('dist'))
        .pipe(gp_rename('LFunctions.incubator.min.js'))
        .pipe(gp_uglify())
        .pipe(gulp.dest('dist'));

    ;
});


gulp.task('compileFunctionsProduction', function () {
    return gulp.src('functions/production/**/*.js')
        .pipe(declare({
            namespace: 'L', // Use NS as the base namespace
            noRedeclare: true, // Avoid duplicate declarations
            processName: function (filePath) {
                // Drop the client/templates/ folder from the namespace path
                var path = filePath.replace('functions\\production', '');
                return declare.processNameByPath(path);
            }
        }))
        .pipe(gp_concat('LFunctions.js'))
        .pipe(gulp.dest('dist'))
        .pipe(gp_rename('LFunctions.min.js'))
        .pipe(gp_uglify())
        .pipe(gulp.dest('dist'));

    ;
});


gulp.task('staticCodeAnalysss', ['buildplugins', 'compileFunctions'], function () {
    return gulp.src(['plugins/production/**/*.js'])
        .pipe(prettify({ collapseWhitespace: true }))
        .pipe(insert.prepend('/*jslint browser: true*/\n/*global $, jQuery,QRCode*/'))

        // pass your directives 
        // as an object 
        .pipe(jslint({
            // these directives can 
            // be found in the official 
            // JSLint documentation. 
            node: true,
            evil: true,
            nomen: true,
            smarttabs: true,
            white: false,
            strict: false,

            // you can also set global 
            // declarations for all source 
            // files like so: 
            global: [],
            predef: [],
            // both ways will achieve the 
            // same result; predef will be 
            // given priority because it is 
            // promoted by JSLint 

            // pass in your prefered 
            // reporter like so: 
            reporter: 'default',
            // ^ there's no need to tell gulp-jslint 
            // to use the default reporter. If there is 
            // no reporter specified, gulp-jslint will use 
            // its own. 

            // specifiy custom jslint edition 
            // by default, the latest edition will 
            // be used 
            edition: '2014-07-08',

            // specify whether or not 
            // to show 'PASS' messages 
            // for built-in reporter 
            errorsOnly: false
        }))

        // error handling: 
        // to handle on error, simply 
        // bind yourself to the error event 
        // of the stream, and use the only 
        // argument as the error object 
        // (error instanceof Error) 
        .on('error', function (error) {
            console.error(String(error));
        });
});






gulp.task('documentation', function () {
    return gulp.src('plugins/**/*.md')
        .pipe(gp_concat('doc.md'))
        .pipe(markdown())
        .pipe(gulp.dest('dist'));
});







gulp.task('default', ['compileFunctionsProduction', 'compileFunctions', 'documentation'], function () { });