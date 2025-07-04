self.addEventListener("install", (event) => {
  console.log("✅ Service Worker Installed");

  event.waitUntil(
    caches.open("x7-cache").then((cache) => {
      return cache.addAll(["/index.html"]).catch((err) => {
        console.error("❌ Cache addAll failed:", err);
      });
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
