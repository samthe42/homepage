"use strict";

var gulp = require("gulp"),
  sass = require("gulp-sass"),
  plumber = require("gulp-plumber"),
  postcss = require("gulp-postcss"),
  autoprefixer = require("autoprefixer"),
  mqpacker = require("css-mqpacker"),
  beautify = require("gulp-cssbeautify"),
  minify = require("gulp-csso"),
  rename = require("gulp-rename"),
  svgstore = require("gulp-svgstore"),
  svgmin = require("gulp-svgstore"),
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
    .pipe(minify())
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
  return gulp.src("src/img/icons/*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"))
});