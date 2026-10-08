const CACHE_PREFIX = "katalog-publik-";
const CACHE_NAME = `${CACHE_PREFIX}v1`;
const OFFLINE_URL = "/offline.html";
const ASET_AMAN = [OFFLINE_URL, "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    for (const path of ASET_AMAN) {
      const request = new Request(new URL(path, self.location.origin), { credentials: "omit", cache: "reload" });
      const response = await fetch(request);
      if (!response.ok || response.redirected) throw new Error("Aset offline belum tersedia.");
      await cache.put(request, response);
    }
  })());
  // Tidak skipWaiting: worker baru menunggu halaman lama ditutup tanpa memaksa reload.
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  // Auth, API, admin, Server Action (POST), RSC, dan origin lain selalu lewat jaringan.
  if (request.method !== "GET" || url.origin !== self.location.origin ||
      url.pathname === "/admin" || url.pathname.startsWith("/admin/") ||
      request.headers.has("Next-Action") || request.headers.has("RSC")) return;

  if (request.mode === "navigate" && (url.pathname === "/" || /^\/produk\/\d+\/?$/.test(url.pathname))) {
    event.respondWith((async () => {
      try {
        // Respons produk tidak pernah disimpan; HTTP error asli juga tidak ditutupi fallback.
        return await fetch(request, { cache: "no-store" });
      } catch {
        const cache = await caches.open(CACHE_NAME);
        return (await cache.match(OFFLINE_URL)) ?? new Response("Koneksi diperlukan untuk memuat katalog terbaru.", {
          status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }
    })());
    return;
  }

  if (!url.search && ASET_AMAN.includes(url.pathname)) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      return (await cache.match(url.pathname)) ?? fetch(request, { credentials: "omit" });
    })());
  }
});
