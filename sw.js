// 머물다 — 최소 서비스워커
// Supabase 데이터는 항상 최신이어야 하므로 API 응답은 캐시하지 않고,
// 앱 껍데기(index.html)만 오프라인 첫 진입이 가능하도록 최소한으로 캐시한다.
const CACHE_NAME = "moomulda-shell-v1";
const SHELL_FILES = ["./index.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // 항상 네트워크 우선, 실패했을 때만(오프라인) 캐시된 껍데기로 대체
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
