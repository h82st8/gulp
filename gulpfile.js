"use strict";

const gulp = require("gulp"),
  rename = require("gulp-rename"),
  sass = require("gulp-sass"),
  autoprefixer = require("gulp-autoprefixer"),
  uglify = require('gulp-uglify'),
  bwsync = require("browser-sync").create(),
  tinyimg = require("gulp-tinyimg"),
  pug = require("gulp-pug"),
  sourcemaps = require("gulp-sourcemaps"),
  concat = require("gulp-concat"),
  removeHtmlComments = require('gulp-remove-html-comments'),
  stripCssComments = require('gulp-strip-css-comments');

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
    .src(["./src/pug/pages/*.pug", "!./src/pug/includes/*.pug"])
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(removeHtmlComments())
    .pipe(gulp.dest("./dist/"))
    .pipe(bwsync.stream());
};

exports.pug_html = pug_html;

// CSS

// const css = () => {
//   return gulp
//     .src("./src/css/*.css")
//     .pipe(
//       sass({
//         outputStyle: "compressed",
//       })
//     )
//     .pipe(rename({
//       suffix: ".min"
//     }))
//     .pipe(gulp.dest("./dist/css"))
//     .pipe(bwsync.stream());
// };

// exports.css = css;

// STYLES

const styles = () => {
  return gulp
    .src(["./src/css/*.css", "./src/css/*.sass", "./src/css/*.scss", "!./src/css/**/_**.*"])
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
    .pipe(concat("style.css"))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(stripCssComments())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./dist/css"))
    .pipe(bwsync.stream());
};

exports.styles = styles;

// SCRIPTS

const js = () => {
  return gulp
    .src(["./src/js/*.min.js", "./src/js/*.js"])
    // .pipe(concat("script.js"))
    // .pipe(rename({
    //   suffix: ".min"
    // }))
    .pipe(gulp.dest("./dist/js"))
    .pipe(bwsync.stream());
};

exports.js = js;

// IMAGES

const images = () => {
  return gulp
    .src("./src/just_images/**/**.*")
    .pipe(gulp.dest("./dist/images"))
    .pipe(bwsync.stream());
};

exports.images = images;

// TINYIMG

const tinyimage = () => {
  return gulp
    .src("./src/tiny_images/**/**.*")
    .pipe(tinyimg("CNhnD3jhl1Bf9zyWH5dPgcYLQXpl5F4h"))
    .pipe(gulp.dest("./dist/images"))
    .pipe(bwsync.stream());
};

exports.tinyimage = tinyimage;

// FONTS

const fonts = () => {
  return gulp
    .src(["./src/fonts/**.woff", "./src/fonts/**.woff2"])
    .pipe(gulp.dest("./dist/fonts"))
    .pipe(bwsync.stream());
};

exports.fonts = fonts;

// FILES

const files = () => {
  return gulp
    .src(["./src/downloads/**/*.*"])
    .pipe(gulp.dest("./dist/downloads"))
    .pipe(bwsync.stream());
};

exports.files = files;

// BUILD

const build = (done) => {
  const buildHtml = gulp.src('./src/**/*.html')
    .pipe(gulp.dest('./prod'));

  const buildPug = gulp.src(["./src/pug/pages/*.pug", "!./src/pug/includes/*.pug"])
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(removeHtmlComments())
    .pipe(gulp.dest("./prod/"));

  // const buildCss = gulp.src('./src/css/**/*.css')
  //   .pipe(rename({
  //     suffix: ".min"
  //   }))
  //   .pipe(gulp.dest('./prod/css'));

  const buildScss = gulp.src(["./src/css/*.css", "./src/css/*.sass", "./src/css/*.scss", "!./src/css/**/_**.*"])
    // .pipe(sourcemaps.init())
    .pipe(
      sass({
        errorLogToConsole: true,
        outputStyle: "compressed",
      })
    )
    .on("error", console.error.bind(console))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(concat("style.css"))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(stripCssComments())
    // .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./prod/css"));

  const buildJs = gulp.src(["./src/js/*.min.js", "./src/js/*.js"])
    // .pipe(uglify())
    // .pipe(concat("script.js"))
    // .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest('./prod/js'));

  const buildFonts = gulp.src('./src/fonts/**/*.*')
    .pipe(gulp.dest('./prod/fonts'));

  const buildFiles = gulp.src('./src/downloads/**/*.*')
      .pipe(gulp.dest('./prod/downloads'));

  const buildImg = gulp.src('./src/just_images/**/*.*')
    .pipe(gulp.dest('./prod/images'));

  const buildTinyImg = gulp.src('./src/tiny_images/**/*.*')
    .pipe(tinyimg("CNhnD3jhl1Bf9zyWH5dPgcYLQXpl5F4h"))
    .pipe(gulp.dest('./prod/images'));

  done();
};

exports.build = build;

// WATCH

const watch = () => {
  gulp.watch("./src/css/**/*.*", gulp.parallel(styles));
  // gulp.watch("./src/css/*.css", gulp.parallel(css));
  gulp.watch("./src/*.html", gulp.parallel(html));
  gulp.watch("./src/pug/**/*.pug", gulp.parallel(pug_html));
  gulp.watch("./src/just_images/**/*.*", gulp.parallel(images));
  gulp.watch("./src/tiny_images/**/*.*", gulp.parallel(tinyimage));
  gulp.watch(["./src/fonts/*.woff", "./src/fonts/*.woff2"], gulp.parallel(fonts));
  gulp.watch("./src/downloads/**/*.*", gulp.parallel(files));
  gulp.watch("./src/js/*.*", gulp.parallel(js));
};

exports.watch = watch;

exports.default = gulp.series(gulp.parallel(watch, serv));
