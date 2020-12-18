'use strict';

const gulp = require('gulp');
const rimraf = require('gulp-rimraf');
const tslint = require('gulp-tslint');
const mocha = require('gulp-mocha');
const shell = require('gulp-shell');
const env = require('gulp-env');

gulp.task('clean', function () {
	return gulp.src('./build', { read: false })
		.pipe(rimraf());
});

gulp.task('compile', shell.task([
	'npm run tsc',
]));

gulp.task('watch', shell.task([
	'npm run tsc-watch',
]));

gulp.task('build', gulp.series('compile'), () => {
	console.log('Building the project ...');
});

gulp.task('default', gulp.series('build'));