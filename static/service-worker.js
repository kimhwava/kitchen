const CACHE_NAME = "nonlapong-cache-v2";

// รายการไฟล์ที่ต้องการ cache ไว้ใช้งาน offline
const urlsToCache = [
  "/", // หน้าแรก
  "/manifest.json",
  "/static/style.css",
  "/static/script.js",
  "/static/icons/icon-192.png",
  "/static/icons/icon-512.png"
  // ถ้ามีไฟล์รูปเมนู/วัตถุดิบ ให้เพิ่ม path ตรงนี้
];

// ติดตั้ง Service Worker และ cache ไฟล์
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("[ServiceWorker] Caching app shell");
      return cache.addAll(urlsToCache);
    })
  );
});

// ดึงข้อมูลจาก cache ก่อน ถ้าไม่มีให้ไปดึงจาก network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // ถ้ามีใน cache → ใช้เลย, ถ้าไม่มี → fetch จาก network
      return response || fetch(event.request).then(fetchResponse => {
        // เก็บไฟล์ใหม่ลง cache ด้วย (dynamic caching)
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      }).catch(() => {
        // ถ้า offline และไม่มีใน cache → อาจส่งหน้า offline.html (ถ้าทำไว้)
      });
    })
  );
});

// ลบ cache เก่าเมื่อมีเวอร์ชันใหม่
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
});
