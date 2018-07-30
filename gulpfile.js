const gulp     = require('gulp');
const sass     = require('gulp-sass');
const bulkSass = require('gulp-sass-bulk-import');
const plumber  = require('gulp-plumber');

// PATHS
const paths = {
  'docroot': './src/static/',
};

const styles = {
  'path': './src/sass/',
  'entry': 'app.scss',
  'dist': paths.docroot
};

gulp.task('sass', () => {
  return gulp
    .src(styles.path + styles.entry)
    .pipe(bulkSass())
    .pipe(sass())
    .pipe(plumber())
    .pipe(gulp.dest(styles.dist))
});

// WATCH
gulp.task('default', () => {
  gulp.watch(styles.path + '**/*.scss', ['sass']);
});
