const { src, dest, watch, parallel } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const ejs = require('gulp-ejs')
const rename = require('gulp-rename')
const eslint = require('gulp-eslint')
const mocha = require('gulp-mocha')
const sync = require('browser-sync').create()
const gulpEjs = require('gulp-ejs-template')

// js
//----------------------------------
function copy(cb) {
  src('routes/*.js').pipe(dest('copies'))
  cb()
}

exports.copy = copy

// sass
//----------------------------------
function generateCSS(cb) {
  src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('main.css'))
    .pipe(dest('public/css/'))
    .pipe(sync.stream())
  cb()
}

exports.css = generateCSS

// ejs templating
//----------------------------------
gulp.task('ejsTemplate', function () {
  return gulp
    .src('test/fixtures/*.html')
    .pipe(
      gulpEjs({
        moduleName: 'templates',
      })
    )
    .pipe(gulp.dest('test'))
})

// ejs
//----------------------------------
function generateHTML(cb) {
  src('./views/layouts/full-width.ejs')
    .pipe(ejs({ title: 'Home' }))
    .pipe(rename({ extname: '.html' }))
    .pipe(dest('public'))
  cb()
}

exports.html = generateHTML

// eslint
//----------------------------------
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

// mocha test
//----------------------------------
function runTests(cb) {
  return src(['**/*.test.js'])
    .pipe(mocha())
    .on('error', function () {
      cb(new Error('Test failed'))
    })
    .on('end', function () {
      cb()
    })
}
exports.test = runTests

// watch
//----------------------------------
function watchFiles(cb) {
  watch('views/**.ejs', generateHTML)
  watch('sass/**.scss', generateCSS)
  watch(['**/*.js', '!node_modules/**'], parallel(runLinter, runTests))
}

exports.watch = watchFiles

// browser Sync
//----------------------------------
function browserSync(cb) {
  sync.init({
    server: {
      baseDir: './public',
    },
  })

  watch('views/**.ejs', generateHTML)
  watch('sass/**.scss', generateCSS)
  watch('./public/**.html').on('change', sync.reload)
}

exports.sync = browserSync
