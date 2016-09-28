'use strict';

var gulp = require('gulp'),
    gulpFilter = require('gulp-filter'),
    flatten = require('gulp-flatten'),
    mainBowerFiles = require('main-bower-files'),
    rename = require("gulp-rename"),
    minifycss = require('gulp-minify-css'),
    changed = require('gulp-changed'),
    sass = require('gulp-sass'),
    gulpUtil = require('gulp-util'),
    csso = require('gulp-csso'),
    autoprefixer = require('gulp-autoprefixer'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    livereload = require('gulp-livereload'),
    buffer = require('vinyl-buffer'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    reactify = require('reactify'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    notify = require('gulp-notify'),
    buffer = require('vinyl-buffer'),
    browserSync = require('browser-sync'),
    sourcemaps = require('gulp-sourcemaps'),
    reload = browserSync.reload,
    p = {
      jsx: './scripts/app.jsx',
      scss: 'styles/main.scss',
      scssSource: 'styles/**/*',
      font: 'fonts/**/*',
      bundle: 'app.js',
      images: 'images/**/*',
      distJs: 'public/dist/js',
      distCss: 'public/dist/css',
      distFont: 'public/dist/fonts',
      distImages: 'public/dist/images/*'
    };

gulp.task('clean', function(cb) {
  return del(['dist'], cb);
});

gulp.task('browserSync', function() {
  browserSync({
    notify: false,
    server: {
      baseDir: './public'
    }
  })
});

gulp.task('watchify', function() {
  var bundler = watchify(browserify(p.jsx, watchify.args));

  function rebundle() {
    return bundler
      .bundle()
      .on('error', notify.onError())
      .pipe(source(p.bundle))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(p.distJs))
      .pipe(reload({stream: true}));
  }

  bundler.transform(reactify)
  .on('update', rebundle);
  return rebundle();
});

gulp.task('browserify', function() {
  browserify(p.jsx)
    .transform(reactify)
    .bundle()
    .pipe(source(p.bundle))
    .pipe(buffer())
    .pipe(uglify().on('error', gulpUtil.log))
    .pipe(gulp.dest(p.distJs));
});

gulp.task('fonts', function() {
  return gulp.src(p.font)
    .pipe(gulp.dest(p.distFont));
});

// Images
gulp.task('images', function() {
  return gulp.src('images/**/*')
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('dist/images'));
});


gulp.task('styles', function() {
  return gulp.src(p.scss)
    .pipe(changed(p.distCss))
    .pipe(sass({errLogToConsole: true}))
    .on('error', notify.onError())
    .pipe(autoprefixer({
      browsers: ['last 1 version']
    }))
    .pipe(csso())
    .pipe(gulp.dest(p.distCss))
    .pipe(reload({stream: true}));
});

// Ugly hack to bring modernizr in
gulp.task('modernizr', function() {
  return gulp.src('bower_components/modernizr/modernizr.js')
  .pipe(gulp.dest(p.distJs));
});

gulp.task('bower-libs', function() {
  var jsFilter = gulpFilter('*.js', {restore: true});
  var cssFilter = gulpFilter('*.css', {restore: true});
  var fontFilter = gulpFilter(['*.eot', '*.woff', '*.svg', '*.ttf']);

  return gulp.src(mainBowerFiles())

  // JS from bower_components
  .pipe(jsFilter)
  .pipe(gulp.dest(p.distJs))
  .pipe(uglify().on('error', gulpUtil.log))
  .pipe(rename({
    suffix: ".min"
  }))
  .pipe(gulp.dest(p.distJs))
  .pipe(jsFilter.restore)

  // css from bower_components, minified
  .pipe(cssFilter)
  .pipe(gulp.dest(p.distCss))
  .pipe(minifycss())
  .pipe(rename({
    suffix: ".min"
  }))
  .pipe(gulp.dest(p.distCss))
  .pipe(cssFilter.restore)

  // font files from bower_components
  .pipe(fontFilter)
  .pipe(flatten())
  .pipe(gulp.dest(p.distFont));
});

gulp.task('libs', function() {
  gulp.start(['modernizr', 'bower-libs', 'fonts']);
});

gulp.task('watchTask', function() {
  gulp.watch(p.scssSource, ['styles']);
});

gulp.task('watch', ['clean'], function() {
  gulp.start(['libs', 'browserSync', 'watchTask', 'watchify', 'styles']);
});

gulp.task('build', ['clean'], function() {
  process.env.NODE_ENV = 'production';
  gulp.start(['libs', 'browserify', 'styles']);
});

// do libs locally
gulp.task('deploy', function() {
  process.env.NODE_ENV = 'production';
  gulp.start([ 'browserify' ]);
});

gulp.task('default', function() {
  console.log('Run "gulp watch or gulp build"');
});
