self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("static").then((cache) => {
      return cache.addAll([
        "./",
        "./icons/android-chrome-192x192.png",
        "/icons/android-chrome-512x512.png",
      ]);
    })
  );
});

self.addEventListener("fetch", (e) => {
  console.log(e.request.url);
});
