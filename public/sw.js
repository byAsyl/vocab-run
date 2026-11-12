const CACHE_NAME = 'memory-heist-shell-v1';
const CORE_URLS = ['/', '/manifest.webmanifest', '/favicon.svg', '/og.png'];

async function cacheResponse(cache, request, response) {
  if (response?.ok && response.type !== 'opaque') await cache.put(request, response.clone());
  return response;
}

function discoverAssetUrls(text, baseUrl) {
  const candidates = [];
  const patterns = [
    /(?:src|href)=["']([^"']+)["']/g,
    /(?:from\s*|import\s*\(\s*)["'`]([^"'`]+)["'`]/g,
    /url\(\s*["']?([^"')]+)["']?\s*\)/g,
  ];
  patterns.forEach((pattern) => {
    for (const match of text.matchAll(pattern)) candidates.push(match[1]);
  });
  return candidates.flatMap((candidate) => {
    if (!candidate.startsWith('/') && !candidate.startsWith('./') && !candidate.startsWith('../')) return [];
    try {
      const url = new URL(candidate, new URL(baseUrl, self.location.origin));
      return url.origin === self.location.origin ? [`${url.pathname}${url.search}`] : [];
    } catch {
      return [];
    }
  });
}

async function warmAppShell() {
  const cache = await caches.open(CACHE_NAME);
  const queued = [...CORE_URLS];
  const seen = new Set();
  for (let index = 0; index < queued.length; index += 1) {
    const url = queued[index];
    if (seen.has(url)) continue;
    seen.add(url);
    try {
      const response = await fetch(url, { cache: 'reload' });
      await cacheResponse(cache, url, response);
      const contentType = response.headers.get('content-type') || '';
      if (/text\/html|text\/css|javascript/.test(contentType)) {
        const discovered = discoverAssetUrls(await response.text(), url);
        discovered.forEach((assetUrl) => { if (!seen.has(assetUrl)) queued.push(assetUrl); });
      }
    } catch {
      if (url === '/') throw new Error('The app shell could not be cached.');
    }
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(warmAppShell().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(Promise.all([
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))),
    self.clients.claim(),
  ]));
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const response = await fetch(request);
        await cacheResponse(cache, '/', response);
        return response;
      } catch {
        return (await cache.match(request)) || (await cache.match('/')) || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      const cache = await caches.open(CACHE_NAME);
      return await cacheResponse(cache, request, response);
    } catch {
      return Response.error();
    }
  })());
});
