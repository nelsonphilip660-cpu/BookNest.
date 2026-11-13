const CACHE_NAME = "booknest-shell-v1";
const APP_SHELL = [
  "./index.html",
  "./style.css",
  "./script.js",
  "./pwa.js",
  "./manifest.webmanifest",
  "./booknest-icon.svg",
  "./book.avif",
  "./book8.avif"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key.startsWith("booknest-shell-") && key !== CACHE_NAME)
        .map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      if (response.ok && /\.(?:css|js|svg|png|avif|webp|jpg|jpeg|woff2?)$/i.test(url.pathname)) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      }
      return response;
    }).catch(() => {
      if (request.mode === "navigate") return caches.match("./index.html");
      return new Response("Offline", { status: 503, statusText: "Offline" });
    }))
  );
});
