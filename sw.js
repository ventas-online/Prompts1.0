const CACHE_NAME = "emprendetools-v1";
const APP_SHELL = ["./", "./index.html", "./manifest.json", "./css/styles.css", "./js/app.js"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((names) => Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(caches.match(event.request).then((cached) => {
    if (cached) return cached;
    return fetch(event.request).then((response) => {
      if (!response || response.status !== 200) return response;
      const clone = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)).catch(() => {});
      return response;
    }).catch(() => event.request.mode === "navigate" ? caches.match("./index.html") : new Response("", { status: 503, statusText: "Offline" }));
  }));
});