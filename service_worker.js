const CACHE_NAME = 'stopwatch'
const FILES_TO_CACHE = ['./', './index.html', './js/main.js', './css/main.css']

self.addEventListener('install', e => {
  self.skipWaiting()
  e.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      await cache.addAll(FILES_TO_CACHE)
    })()
  )
})

async function cleanupCaches () {
  const keys = await caches.keys()
  for (let key of keys) {
    if (key !== CACHE_NAME) {
      await caches.delete(key)
    }
  }
}

self.addEventListener('activate', event => {
  event.waitUntil(cleanupCaches())
})

self.addEventListener('fetch', e => {
  e.respondWith(
    (async () => {
      try {
        const response = await fetch(e.request)
        const cache = await caches.open(CACHE_NAME)
        if (response) {
          cache.put(e.request, response.clone())
          return response
        }
      } catch (error) {
        response = await caches.match(e.request)
        return response
      }
    })()
  )
})
