"use strict";

const dirs = {
  source: "src",
  build: "build",
}

var gulp = require("gulp"),
  sass = require("gulp-sass"),
  plumber = require("gulp-plumber"),
  postcss = require("gulp-postcss"),
  autoprefixer = require("autoprefixer"),
  mqpacker = require("css-mqpacker"),
  beautify = require("gulp-cssbeautify"),
  cssMinify = require("gulp-csso"),
  jsMinify = require("gulp-uglify"),
  concat = require("gulp-concat"),
  rename = require("gulp-rename"),
  svgstore = require("gulp-svgstore"),
  svgmin = require("gulp-svgmin"),
  imagemin = require("gulp-imagemin"),
  server = require("browser-sync").create();

gulp.task("style", function() {
  gulp.src("src/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({
        browsers: [
          "last 2 versions",
          'IE >= 9'
        ]
      }),
      mqpacker({
        sort: true
      })
    ]))
    .pipe(beautify())
    .pipe(gulp.dest("./build/css"))
    .pipe(server.stream())
    .pipe(cssMinify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"));
});

gulp.task("serve", function() {
  server.init({
    server: "./",
    notify: false,
    open: true,
    cors: true,
    ui: false
  })
  gulp.watch("src/sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("*.html").on("change", server.reload);
});

gulp.task("svgstore", function() {
  return gulp.src(dirs.source + "/img/icons/*.svg")
    .pipe(svgmin(function(file) {
      return {
        plugins: [{
          cleanupIDs: {
            minify: true
          }
        }]
      }
    }))
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest(dirs.source + "/img/"))
});

gulp.task("js", function() {
  return gulp.src([
    dirs.source + '/js/*.js'
  ])
  .pipe(plumber())
  .pipe(concat("script.min.js"))
  .pipe(jsMinify())
  .pipe(gulp.dest(dirs.build + "/js"));
});
