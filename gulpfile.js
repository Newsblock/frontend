var gulp = require('gulp'),
  browserSync = require('browser-sync'),
  nodemon = require('gulp-nodemon'),
  fs = require('fs'),
  sass = require('gulp-sass'),
  csslint = require('gulp-csslint'),
  sourcemaps = require('gulp-sourcemaps'),
  stylelint = require('gulp-stylelint'),
  cssnano = require('gulp-cssnano'),
  del = require('del'),
  gulpSequence = require('gulp-sequence'),
  uglify = require('gulp-uglify'),
  source = require('vinyl-source-stream'),
  sourcemaps = require('gulp-sourcemaps'),
  rev = require('gulp-rev'),
  concat = require('gulp-concat'),
  glob = require('glob'),
  es = require('event-stream');

var BROWSER_SYNC_RELOAD_DELAY = 400;

var paths = {
  styles:'./public/css',
  scripts:'./public/scripts'
};

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({
    script: 'app.js',
    ext: 'hbs, handlebars, json, js, html',
    watch: ['app.js', './app']
  })
    .on('start', function onStart() {
      // ensure start only got called once
      if (!called) { cb(); }
      called = true;
    })
    .on('restart', function onRestart() {
      // reload connected browsers after a slight delay
      setTimeout(function reload() {
        browserSync.reload({stream: false});
      }, BROWSER_SYNC_RELOAD_DELAY);
    });
});

gulp.task('browser-sync', ['nodemon'], function () {

  // for more browser-sync config options: http://www.browsersync.io/docs/options/
  browserSync({
    proxy: 'http://localhost:3000',
    port: 4000,
    browser: ['google-chrome']
  });
});

gulp.task('styles', function () {
  gulp.src('./public/css/**/*.scss')
    .pipe(stylelint({
      reporters: [
        {formatter: 'string', console: false}
      ],
      syntax: 'scss',
      failAfterError: false
    }))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnano({safe: true, autoprefixer: {
      browsers: 'last 3 version',
      add: true
    }
    }))
    .pipe(sourcemaps.write('.', {includeContents: false})) // uncomment to move sourcemaps out to a sep file
    // .pipe(sourcemaps.write())
    .pipe(csslint.reporter()) // Display errors
    .pipe(csslint.reporter('fail')) // Fail on error (or csslint.failReporter())
    .pipe(gulp.dest(paths.styles))
    .pipe(browserSync.reload({ stream: true, match: '**/*.css' }));
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('bundle-js', function() {

  return gulp.src('public/scripts/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('main.bundle.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/scripts/bundle'));
});


gulp.task('bundle-css', function () {

  return gulp
    .src('./public/css/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnano({safe: true, autoprefixer: {browsers: 'last 3 version', add: true}
    }))
    .pipe(sourcemaps.write('.', {includeContents: false})) // uncomment to move sourcemaps out to a sep file
    .pipe(csslint.reporter()) // Display errors
    .pipe(csslint.reporter('fail')) // Fail on error (or csslint.failReporter())
    .pipe(gulp.dest(paths.styles));

});

gulp.task('clean', function() {
  return del(['dist']);
});

gulp.task('dist-copy', function () {
  gulp.src('./public/*.json').pipe(gulp.dest('dist'));
  gulp.src('./public/font/*').pipe(gulp.dest('dist/font'));
});

gulp.task('rev-css', function () {
  return gulp.src('public/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('dist'))  // write rev'd assets to build dir
    .pipe(rev.manifest('css-manifest.json'))
    .pipe(gulp.dest('dist')); // write manifest to build dir
});

gulp.task('rev-js',['bundle-js'], function () {
  return gulp.src('public/scripts/bundle/*.bundle.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('dist/scripts/bundle'))  // write rev'd assets to build dir
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist')); // write manifest to build dir
});

gulp.task('default', ['browser-sync','styles','bundle-js'], function () {
  gulp.watch(['public/**/*.scss'], ['styles']);
  gulp.watch(['public/**/*.js'], ['bundle-js', 'bs-reload']);
});

gulp.task('build', gulpSequence('bundle-css','rev-css','bundle-js','rev-js','dist-copy'));

gulp.task('local-build', gulpSequence('clean','build'));
