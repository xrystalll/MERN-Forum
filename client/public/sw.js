const staticCache = 'forum-v1.0.0'
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
        const cachedResponse = await caches.match(event.request)
        if (event.request.url.split('/').pop() === '') {
          const index = await caches.match('index.html')
          if (index) return index
        }
        return cachedResponse ?? await fetch(event.request)
      })()
    )
  }
})
