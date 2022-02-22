const CACHE_ELEMENTS = [
  "./",
  "https://unpkg.com/react@17/umd/react.production.min.js",
  "https://unpkg.com/react-dom@17/umd/react-dom.production.min.js",
  "./index.css",
  "https://unpkg.com/@babel/standalone/babel.min.js",
  "./my-app/components/Contador.js",
  "./favicon.png",
];

const CACHE_NAME = "v3_cache_contador_react";

const selfRef = this;

selfRef.addEventListener("install", (e) => {
  // console.log(e);
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      cache
        .addAll(CACHE_ELEMENTS)
        .then(() => {
          selfRef.skipWaiting();
        })
        .catch((err) => {
          console.log(err);
        });
    })
  );
});

selfRef.addEventListener("activate", (e) => {
  const cacheWhitelist = [CACHE_NAME];
  e.waitUntil(
    caches
      .keys()
      .then((cachesNames) => {
        return Promise.all(
          cachesNames.map((cachesName) => {
            return (
              cacheWhitelist.indexOf(cachesName) === -1 &&
              caches.delete(cachesName)
            );
          })
        );
      })
      .then(() => selfRef.clients.claim())
  );
});

selfRef.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      if (res) {
        return res;
      }
      return fetch(e.request);
    })
  );
});
