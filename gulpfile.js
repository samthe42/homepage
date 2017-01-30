"use strict";

var gulp = require("gulp"),
    sass = require("gulp-sass"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    mqpacker = require("css-mqpacker"),
    csso = require("gulp-csso"),
    rename = require("gulp-rename"),
    server = require("browser-sync").create();

gulp.task("style", function() {
    gulp.src("assets/sass/style.scss")
        .pipe(sass())
        .pipe(postcss([
            autoprefixer({
                browsers: ["last 2 versions"]
            }),
            mqpacker({
                sort: true
            })
        ]))
        .pipe(gulp.dest("./build/css"))
        .pipe(csso())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("build/css"))
        .pipe(server.stream());
});

gulp.task("start-server", function() {
    server.init({
        server: "./",
        notify: false,
        open: true,
        cors: true,
        ui: false
    })

    gulp.watch("assets/sass/**/*.{scss,s sass}", ["style"]);
    gulp.watch("*.html").on("change", server.reload);
});