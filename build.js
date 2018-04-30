var fs = require('fs');
var browserify = require('browserify');
var path = require('path');
if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}
function compileScripts(dir) {
  if (!fs.existsSync(path.join('public', dir))) {
    fs.mkdirSync(path.join('public', dir));
  }
  fs.readdir(dir, function (err, files) {
    if (err) throw err;
    files.forEach(file => {
      file = path.join(dir, file);
      var stats = fs.statSync(file);
      if (stats.isDirectory()) {
        compileScripts(file);
        return;
      }
      var b = browserify(file, {
        debug: process.env.NODE_ENV != 'production'
      });
      b.add(file);
      var out = fs.createWriteStream(path.join('public', file));
      b.bundle().pipe(out);
    });
  });
}
compileScripts('scripts');
