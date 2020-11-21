const { watch, series, src, dest } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const bs = require('browser-sync');
const header = require('gulp-header');
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const terser = require('gulp-terser');
const pkg = require('./package.json');

const server = bs.create();
const banner = `
/**
 * <%= pkg.name %> - <%= pkg.description %>
 * @version v<%= pkg.version %>
 * @link <%= pkg.homepage %>
 * @copyright 2020 <%= pkg.author.name %>, <%= pkg.author.url %>
 * @license <%= pkg.license %>
 */
`;

const serve = (cb, dir, port) => {
  server.init({
    server: {
      baseDir: dir,
    },
    ui: false,
    notify: false,
    open: false,
    port: port,
  });

  cb();
};

const serveDev = (cb) => {
  serve(cb, 'src', 8080);
};

const serveBuild = (cb) => {
  serve(cb, 'build', 8081);
};

const reload = (cb) => {
  server.reload();
  cb();
};

const watchFiles = () => {
  return watch(['src/**/*.html', 'src/**/*.css', 'src/**/*.js'], reload);
};

const html = () => {
  return src('src/index.html').pipe(dest('build'));
};

const css = () => {
  return src('src/**/*.css')
    .pipe(autoprefixer())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(dest('build'));
};

const mincss = () => {
  return src('src/tag-input.css')
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('build'));
};

const js = () => {
  return src('src/**/*.js')
    .pipe(
      babel({
        sourceType: 'script',
        presets: ['@babel/env'],
        retainLines: true,
      })
    )
    .pipe(header(banner, { pkg: pkg }))
    .pipe(dest('build'));
};

const minjs = () => {
  return src('src/tag-input.js')
    .pipe(
      babel({
        sourceType: 'script',
        presets: ['@babel/env'],
        retainLines: true,
      })
    )
    .pipe(terser())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('build'));
};

const clean = () => del('build');
const build = series(clean, html, css, mincss, js, minjs);

exports.clean = clean;
exports.build = build;
exports.serveBuild = series(build, serveBuild);
exports.default = series(serveDev, watchFiles);
