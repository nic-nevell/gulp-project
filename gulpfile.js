// js
//----------------------------------
const { src, dest } = require('gulp')

function copy(cb) {
	src('routes/*.js').pipe(dest('copies'))
  cb()
}

exports.copy = copy


// sass
//----------------------------------
const sass = require('gulp-sass')(require('sass'))

function generateCSS(cb) {
	src('./sass/**/*.scss')
	.pipe(sass().on('error', sass.logError))
	.pipe(dest('public/stylesheets'))
  cb()
}

exports.css = generateCSS


// ejs
//----------------------------------
const ejs = require('gulp-ejs')
const rename = require('gulp-rename')

function generateHTML(cb) {
	src('./views/index.ejs')
    .pipe(
      ejs({
        title: 'Hello Semaphore!',
      })
    )
    .pipe(
      rename({
        extname: '.html',
      })
    )
    .pipe(dest('public'))
  cb()
}

exports.html = generateHTML


// eslint
//----------------------------------
const eslint = require('gulp-eslint')

function runLinter(cb) {
  return src(['**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .on('end', function () {
      cb()
    })
}

exports.lint = runLinter


// mocha
//----------------------------------
const mocha = require("gulp-mocha");

function runTests(cb) {
    return src(['**/*.test.js'])
        .pipe(mocha())
        .on('error', function() {
            cb(new Error('Test failed'));
        })
        .on('end', function() {
            cb();
        });
}
exports.test = runTests;