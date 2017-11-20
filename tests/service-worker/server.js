var path = require('path');

var express = require('express');
var app = express();

var WWW_FOLDER = path.join(__dirname, 'www');

app.get('/', serveIndex);

app.get('/sw.js', serveServiceWorker);
app.use(express.static(WWW_FOLDER));

let indexPreload = 0;
let notFoundPreload = 0;

function serveServiceWorker(req, res) {
  res.sendFile(path.join(WWW_FOLDER, 'sw.js'), {
    cacheControl: false,
    acceptRanges: false,
    headers: {
      'Cache-Control': 'no-cache'
    }
  });
}

function serveIndex(req, res) {
  res.sendFile(path.join(WWW_FOLDER, 'index.html'), {
    cacheControl: false,
    acceptRanges: false,
    headers: {
      'Cache-Control': 'no-cache'
    }
  });
}

module.exports = new Promise((resolve) => {
  const server = app.listen('9191', '127.0.0.1', () => {
    resolve(server);
  });
});