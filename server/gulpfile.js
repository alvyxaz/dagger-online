var gulp = require('gulp');
var replace = require('gulp-replace');
var watch = require('gulp-watch');
var insert = require('gulp-insert');
var rename = require("gulp-rename");
var mocha = require('gulp-mocha');

/*
Constants
 */
var unityClientSourcePath = 'D:/Programming/Dagger/client/Dagger/Assets/Scripts/Dagger/'

/*
Unity client Functions
 */
var unity = {
    'build.messageCode' : function () {
        return gulp.src('./src/common/MessageCode.ts')
            .pipe(replace('export = MessageCode;', ''))
            .pipe(insert.prepend('public '))
            .pipe(rename('MessageCode.cs'))
            .pipe(gulp.dest(unityClientSourcePath));
    },
    'build.parameterCode' : function () {
        return gulp.src('./src/common/ParameterCode.ts')
            .pipe(replace('export = ParameterCode;', ''))
            .pipe(insert.prepend('public '))
            .pipe(rename('ParameterCode.cs'))
            .pipe(gulp.dest(unityClientSourcePath));
    }
}

gulp.task('build.unity', function () {
    unity['build.messageCode']();
    unity['build.parameterCode']();
})

gulp.task('develop.unity', ['build.unity'], function () {
    // Watch for changes in enums
    watch('./src/common/MessageCode.ts', unity['build.messageCode'])
    watch('./src/common/ParameterCode.ts', unity['build.parameterCode'])
});

gulp.task('default', function () {

});

/* -----------------------------------------------------------
Testing tasks
 */

gulp.task('test', function () {
   return gulp.src('./tests/tests.js', {read : false})
       .pipe(mocha({reporter: 'spec'}));
});