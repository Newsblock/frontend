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
  rev = require('gulp-rev'),
  glob = require('glob'),
  es = require('event-stream');

var BROWSER_SYNC_RELOAD_DELAY = 400;

var paths = {
  styles:'./public/css',
  scripts:'./public/scripts',
  distViews:'./dist/views',
  distPublic:'./dist/public'
};

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({
    script: 'app.js',
    ext: 'hbs, json, js',
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

gulp.task('uglify-js',  function () {
  return gulp.src('public/scripts/*.js')
    .pipe(uglify())
    .pipe(gulp.dest(paths.distPublic+'/scripts'));
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

gulp.task('bundle-js', function(done) {
  return glob(paths.scripts+'/main-**.js', function(err, files) {
    if(err) done(err);
    // todo: browserify bundle
    //var tasks = files.map(function(entry) {});
    //es.merge(tasks).on('end', done);
  })
});

gulp.task('bundle-css', function () {

  var stream = gulp
    .src('./public/css/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnano({safe: true, autoprefixer: {browsers: 'last 3 version', add: true}
    }))
    .pipe(sourcemaps.write('.', {includeContents: false})) // uncomment to move sourcemaps out to a sep file
    // .pipe(sourcemaps.write())
    .pipe(csslint.reporter()) // Display errors
    .pipe(csslint.reporter('fail')) // Fail on error (or csslint.failReporter())
    .pipe(gulp.dest(paths.styles));

  return stream; // needed for sequence
});

gulp.task('clean', function() {
  return del(['dist']);
});

gulp.task('dist-copy', function () {
  gulp.src('./app/views/**').pipe(gulp.dest(paths.distViews));
  gulp.src('./public/font/*').pipe(gulp.dest(paths.distPublic+'/font'));
  return gulp.src('./public/css/*').pipe(gulp.dest(paths.distPublic+'/css'));
});

gulp.task('rev',['uglify-js'], function () {
  return gulp.src(['dist/public/**/*.css', 'dist/public/**/*.js'])
    .pipe(gulp.dest(paths.distPublic))  // copy original assets to build dir paths.distPublic
    .pipe(rev())
    .pipe(gulp.dest(paths.distPublic))  // write rev'd assets to build dir
    .pipe(rev.manifest())
    .pipe(gulp.dest(paths.distPublic)); // write manifest to build dir
});

gulp.task('default', ['browser-sync','bundle-js', 'styles'], function () {
  gulp.watch(['public/scripts/*.js', 'public/scripts/modules/*.js', 'public/data/*.json'], ['bundle-js', browserSync.reload]);
  gulp.watch('public/css/**/*.scss',  ['styles']);
  gulp.watch('public/**/*.html', ['bs-reload']);
});

gulp.task('build', gulpSequence('bundle-css','dist-copy','rev'));

gulp.task('local-build', gulpSequence('clean','build'));
