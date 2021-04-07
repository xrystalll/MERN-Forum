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
  event.respondWith(async () => {
    const cached = await caches.match(event.request)
    return cached ?? await fetch(event.request)
  })
})
