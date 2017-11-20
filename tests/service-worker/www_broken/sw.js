self.addEventListener('install', (e) => {
  e.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  e.respondWith(new Response(`
    <!doctype html>
    <script>
      navigator.serviceWorker.register('/sw.js');
    </script>
    Cached
  `, {
    headers: {
      'Content-Type': 'text/html'
    }
  }));

  // fetch(e.request);
});