const staticCache = 'forum-v0.1.0'
const assets = [
  'index.html',
]

self.addEventListener('install', async (event) => {
  const cache = await caches.open(staticCache)
  await cache.addAll(assets)
})

self.addEventListener('activate', async (event) => {
  const cacheNames = await caches.keys()
  await Promise.all(
    cacheNames
      .filter(name => name !== staticCache)
      .map(name => caches.delete(name))
  )
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  if (url.origin === location.origin) {
    event.respondWith(
      (async () => {
        try {
          const cachedResponse = await caches.match(event.request)
          return cachedResponse ?? await fetch(event.request)
        } catch(err) {
          console.error(err)
        }
      })()
    )
  }
})
