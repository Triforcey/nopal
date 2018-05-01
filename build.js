var fs = require('fs');
var browserify = require('browserify');
var babel = require('babel-core');
var path = require('path');
function mkdir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}
mkdir('public');
mkdir('dist');
function compileJSX(file, out) {
  fs.readFile(file, (err, data) => {
    if (err) throw err;
    var code = babel.transform(data, {
      sourceMaps: process.env.NODE != 'production' ? 'inline' : false,
      plugins: [
        'transform-react-jsx'
      ]
    }).code;
    fs.writeFile(out, code, err => {
      if (err) throw err;
    });
  });
}
function compileScript(file, out, pack) {
  if (!pack) {
    compileJSX(file, out);
    return;
  }
  var b = browserify(file, {
    debug: process.env.NODE_ENV != 'production'
  }).transform('babelify', {
    presets: [
      'react'
    ]
  });
  b.add(file);
  var writeStream = fs.createWriteStream(out);
  b.bundle().pipe(writeStream);
}
function compileScripts(dir, out, pack) {
  mkdir(out);
  fs.readdir(dir, function (err, files) {
    if (err) throw err;
    files.forEach(name => {
      var file = path.join(dir, name);
      var stats = fs.statSync(file);
      if (stats.isDirectory()) {
        compileScripts(file, path.join(out, name), pack);
        return;
      }
      compileScript(file, path.join(out, name), pack);
    });
  });
}
compileScript('src/index.js', 'dist/index.js');
compileScripts('src/components', 'dist/components');
compileScripts('src/scripts', 'public/scripts', true);
