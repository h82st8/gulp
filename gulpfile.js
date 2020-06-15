"use strict";

const gulp = require("gulp"),
	rename = require("gulp-rename"),
	sass = require("gulp-sass"),
	autoprefixer = require("gulp-autoprefixer"),
	bwsync = require("browser-sync").create(),
	tinyimg = require("gulp-tinyimg"),
	pug = require("gulp-pug"),
	sourcemaps = require("gulp-sourcemaps");

// SERVER

const serv = () => {
	bwsync.init({
		server: {
			baseDir: "./dist/",
		},
		notify: false,
	});
	bwsync.watch("./src", bwsync.reload);
};

exports.serv = serv;

// HTML

const html = () => {
	return gulp
		.src("./src/*.html")
		.pipe(gulp.dest("./dist/"))
		.pipe(bwsync.stream());
};

exports.html = html;

// PUG

const pug_html = () => {
	return gulp
		.src("./src/pug/*.pug")
		.pipe(
			pug({
				pretty: true,
			})
		)
		.pipe(gulp.dest("./dist/"))
		.pipe(bwsync.stream());
};

exports.pug_html = pug_html;

// CSS

const css = () => {
	return gulp
		.src("./src/css/*.css")
		.pipe(gulp.dest("./dist/css"))
		.pipe(bwsync.stream());
};

exports.css = css;

// STYLES

const styles = () => {
	return gulp
		.src("./src/css/*.sass")
		.pipe(sourcemaps.init())
		.pipe(
			sass({
				errorLogToConsole: true,
				outputStyle: "expanded",
			})
		)
		.on("error", console.error.bind(console))
		.pipe(
			autoprefixer({
				cascade: false,
			})
		)
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest("./dist/css"))
		.pipe(bwsync.stream());
};

exports.styles = styles;

// SCRIPTS

const js = () => {
	return gulp
		.src("./src/js/*.js")
		.pipe(gulp.dest("./dist/js"))
		.pipe(bwsync.stream());
};

exports.js = js;

// TINYIMG

const tinyimage = () => {
	return gulp
		.src("./src/images/**/**.*")
		.pipe(tinyimg("CNhnD3jhl1Bf9zyWH5dPgcYLQXpl5F4h"))
		.pipe(gulp.dest("./dist/images"))
		.pipe(bwsync.stream());
};

exports.tinyimage = tinyimage;

// FONTS

const fonts = () => {
	return gulp
		.src("./src/fonts/**.*")
		.pipe(gulp.dest("./dist/fonts"))
		.pipe(bwsync.stream());
};

exports.fonts = fonts;

// WATCH

const watch = () => {
	gulp.watch("./src/css/*.sass", gulp.parallel(sass));
	gulp.watch("./src/css/*.css", gulp.parallel(css));
	gulp.watch("./src/*.html", gulp.parallel(html));
	gulp.watch("./src/pug/*.pug", gulp.parallel(pug_html));
	gulp.watch("./src/images/**/**.*", gulp.parallel(tinyimage));
	gulp.watch("./src/fonts/**.*", gulp.parallel(fonts));
	gulp.watch("./src/js/**.*", gulp.parallel(js));
};

exports.watch = watch;

exports.default = gulp.series(gulp.parallel(watch, serv));
