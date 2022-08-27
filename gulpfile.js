const { task, src, dest, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync");
const cssnano = require("cssnano");
const rename = require("gulp-rename");
const postcss = require("gulp-postcss");
const csscomb = require("gulp-csscomb");
const autoprefixer = require("autoprefixer");
const mqpacker = require("css-mqpacker");
const sortCSSmq = require("sort-css-media-queries");
const terser = require("gulp-terser");
const concat = require("gulp-concat");
// const del = require("del");

const PATH = {
  scssRoot: "./assets/scss/style.scss",
  scssFiles: "./assets/scss/**/*.scss",
  scssFolder: "./assets/scss",
  cssMinFiles: "./assets/css/**/*.min.css",
  cssFolder: "./assets/css",
  htmlFiles: "./*.html",
  jsFiles: [
    "./assets/js/**/*.js",
    "!./assets/js/**/*.min.js",
    "!./assets/js/**/bundle.js"
  ],
  jsMinFiles: "./assets/js/**/*.min.js",
  jsFolder: "./assets/js",
  jsBundleName: "bundle.js",
  buildFolder: "dist",
};

const PLUGINS = [
  autoprefixer({
    overrideBrowserslist: ["last 5 versions", "> 1%"],
    cascade: true,
  }),
  mqpacker({
    sort: sortCSSmq,
  }),
];

function scss() {
  return src(PATH.scssRoot) // входные файлы для обработки
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError)) // плагин, который что-то делает с файлами
    .pipe(postcss(PLUGINS))
    .pipe(csscomb())
    .pipe(dest(PATH.cssFolder)) // куда будем выгружать файлы
    .pipe(browserSync.stream());
}

function scssMin() {
  const pluginsExtended = [...PLUGINS, cssnano({ preset: "default" })];

  return src(PATH.scssRoot)
    .pipe(sass().on("error", sass.logError))
    .pipe(csscomb())
    .pipe(postcss(pluginsExtended))
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest(PATH.cssFolder));
}

function scssDev() {
  return src(PATH.scssRoot, { sourcemaps: true }) //sourcemaps для карты кода (чтобы искать в консоли scss)
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(postcss(PLUGINS))
    .pipe(dest(PATH.cssFolder, { sourcemaps: true })) // если вместо true поставить '.' то создается отдельный файл, который надо удалять
    .pipe(browserSync.stream());
}

function comb() {
  return src(PATH.scssFiles).pipe(csscomb()).pipe(dest(PATH.scssFolder));
}

function syncInit() {
  browserSync.init({
    server: { baseDir: "./" },
    // notify: false
  });
}

async function reload() {
  browserSync.reload();
}

function watchFiles() {
  syncInit();
  watch(PATH.scssFiles, scss); //для ф-ии scssDev дублируем watch... и вставляем вместо scss
  watch(PATH.htmlFiles, reload);
  watch(PATH.jsFiles, reload);
  // watch(PATH.cssFiles, reload);
}

function concatJS() {
  return src(PATH.jsFiles)
    .pipe(concat(PATH.jsBundleName))
    .pipe(dest(PATH.jsFolder));
}

function uglifyJS() {
    return src(PATH.jsFiles)
      .pipe(terser({
        toplevel: true,
        output: {quote_style: 3}
      }))
      .pipe(rename({ suffix: ".min" }))
      .pipe(dest(PATH.jsFolder));
}

function buildJS() {
  return src(PATH.jsMinFiles)
   .pipe(dest(PATH.buildFolder + '/js'));
}

function buildHTML() {
  return src(PATH.htmlFiles)
   .pipe(dest(PATH.buildFolder + '/templates'));
}

function buildCSS() {
  return src(PATH.cssMinFiles)
   .pipe(dest(PATH.buildFolder + '/css'));
}

// async function clearFolder() {
//  await del(PATH.buildFolder, {force: true})
//   return true;
// }

task("min", scssMin); //минифицированный файл
task("dev", scssDev); // добавляет карту кода для просмотра в консоли
task("scss", series(scss, scssMin)); //создает и обычный css файл и минифицированый
task("comb", comb); // делает код читаемым и "красивым"
task("watch", watchFiles); // просмотр в браузере
task("concat", concatJS); // сливает все в один файл JS
task("uglify", uglifyJS); // создает минимизируемые файлы JS
task("build", series( buildJS, buildHTML, buildCSS)); // выгружает min файлы JS в папку dist, и остальные в соответствующие папки
// task("dell", clearFolder); 
// clearFolder,- Вставить в build