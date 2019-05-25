<<<<<<< HEAD
importScripts("/precache-manifest.b0c59c10c72b245f8d48b5c7c38a1e6e.js", "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");
=======
importScripts("/precache-manifest.72edc8dda41a29064d443f442a9743fa.js", "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");
>>>>>>> d32564e43a1080feb5c30d0efc27efb22a3df967


workbox.core.setCacheNameDetails({prefix: "vue-pwa"});

self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// 动态ajax请求缓存
workbox.routing.registerRoute(function(obj){
    let pathname = obj.url.pathname
    if(pathname.startsWith('/api/user/login') || pathname.startsWith('/api/user/register') || pathname.startsWith('/api/user/sendCode')){
        return false
    }
    // true缓存，false不缓存，这样可以选择缓存那些请求
    return true
},workbox.strategies.networkFirst())
// workbox.strategies.cacheFirst()缓存优先
// workbox.strategies.networkFirst()网络优先

