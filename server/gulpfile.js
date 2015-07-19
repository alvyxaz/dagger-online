var _ = require('lodash');
var gulp = require('gulp');
var replace = require('gulp-replace');
var watch = require('gulp-watch');
var insert = require('gulp-insert');
var rename = require("gulp-rename");
var mocha = require('gulp-mocha');

/*
Constants
 */
var unityClientSourcePath = '../client/Dagger/Assets/Scripts/Dagger/'

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
    },
    'build.gameObjectType' : function () {
        return gulp.src('./src/gameServer/enums/GameObjectType.ts')
            .pipe(replace('export = GameObjectType;', ''))
            .pipe(insert.prepend('public '))
            .pipe(rename('GameObjectType.cs'))
            .pipe(gulp.dest(unityClientSourcePath));
    },
    'build.objectHintType' : function () {
        return gulp.src('./src/gameServer/enums/ObjectHintType.ts')
            .pipe(replace('export = ObjectHintType;', ''))
            .pipe(insert.prepend('public '))
            .pipe(rename('ObjectHintType.cs'))
            .pipe(gulp.dest(unityClientSourcePath));
    }
}

gulp.task('build.unity', function () {
    unity['build.messageCode']();
    unity['build.parameterCode']();
    unity['build.gameObjectType']();
    unity['build.objectHintType']();
})

gulp.task('develop.unity', ['build.unity'], function () {
    // Watch for changes in enums
    watch('./src/common/MessageCode.ts', unity['build.messageCode'])
    watch('./src/common/ParameterCode.ts', unity['build.parameterCode'])
    watch('./src/gameServer/enums/GameObjectType.ts', unity['build.gameObjectType'])
    watch('./src/gameServer/enums/ObjectHintType.ts', unity['build.objectHintType'])
});

gulp.task('default', function () {

});

/* -----------------------------------------------------------
Testing tasks
 */

var handleTestError = function (err) {
    console.log(err.toString());
    this.emit('end');
}

var tests = {
    'all' : _.debounce(function () {
        return gulp.src('./tests/tests.js', {read : false})
            .pipe(mocha({reporter: 'spec'}))
            .on('error', handleTestError);
    }, 500)
}

gulp.task('test', function () {
   return tests['all']();
});

gulp.task('test.live', function () {
    watch('./src/**/*.js' ,tests['all']);
    tests['all']();
});