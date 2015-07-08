/*
 * 2015/07/08 安部作成
 */

var browserify = require('browserify');
var source = require("vinyl-source-stream");

module.exports = function(options) {
  gulp.task("browserify", function() {
      browserify({
          entries: ["./build/scripts/a.js"]
      })
      .bundle()
      .pipe(source("lib.js"))
      .pipe(gulp.dest("./build/"));
  });
};
