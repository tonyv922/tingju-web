const C='tj-web-v1';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon.svg'];
self.addEventListener('install', e=>{ self.skipWaiting(); e.waitUntil(caches.open(C).then(c=>c.addAll(ASSETS).catch(()=>{}))); });
self.addEventListener('activate', e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch', e=>{
  const req=e.request;
  if(req.method!=='GET') return;
  const u=new URL(req.url);
  if(u.origin!==location.origin) return;           // 翻譯 API 走網路，不快取
  e.respondWith(
    caches.match(req).then(hit=> hit || fetch(req).then(res=>{
      const copy=res.clone(); caches.open(C).then(c=>c.put(req,copy)).catch(()=>{}); return res;
    }).catch(()=>caches.match('./index.html')))
  );
});
