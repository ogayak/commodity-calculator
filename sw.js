self.addEventListener('install', e => {
    e.waitUntil(
        caches.open('commodity-calc-v1').then(cache => {
            return cache.addAll([
                'index.html',
                'history.html',
                'app.js',
                'style.css',
                'favicon.png',
                'manifest.json'
            ]);
        })
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        })
    );
});