// Caches the app shell so it opens with no signal.
//
// IMPORTANT WHEN PUBLISHING A CHANGE: this cache is served first and the
// network only when it misses, so a phone that has already installed the app
// keeps showing the old doses until the cache name below changes. Bump the
// version in C on every release — it is the only thing that retires the old
// copy. Bumping it also deletes the previous cache on activate, so nothing
// stale is left behind.
const C = "paeds-doses-v6";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-180.png", "./icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request).then(res => {
    const copy = res.clone(); caches.open(C).then(c => c.put(e.request, copy)); return res;
  }).catch(() => caches.match("./index.html"))));
});
