var fs = require('fs');
var babel = require('babel-core');
var path = require('path');

function mkdir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

function compileJSX(code) {
  return babel.transform(code, {
    sourceMaps: 'inline',
    presets: [
      'react'
    ]
  }).code;
}

function compileScript(file, out, pack) {
  fs.readFile(file, (err, data) => {
    if (err) throw err;
    var code = compileJSX(data);
    fs.writeFile(out, code, err => {
      if (err) throw err;
    });
  });
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

mkdir('dist');
compileScripts('src/server', 'dist/server');
compileScripts('src/components', 'dist/components');
