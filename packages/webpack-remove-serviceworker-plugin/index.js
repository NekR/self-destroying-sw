var fs = require('fs');
var path = require('path');

function RemoveServiceWorkerPlugin(options) {
  this.filename = options && options.filename || 'sw.js';
}

RemoveServiceWorkerPlugin.prototype.apply = function(compiler) {
  var filename = this.filename;

  compiler.plugin('emit', function(compilation, callback) {
    fs.readFile(path.join(__dirname, 'sw.js'), function(err, content) {
      if (err) {
        callback(err);
        return;
      }

      compilation.assets[filename] = getSource(content);
      callback();
    });
  });
};

module.exports = RemoveServiceWorkerPlugin;

function getSource(source) {
  return {
    source() {
      return source
    },
    size() {
      return Buffer.byteLength(source, 'utf8');
    }
  };
}