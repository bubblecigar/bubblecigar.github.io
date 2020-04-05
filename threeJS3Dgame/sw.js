
const cacheVersion = 'v1'
const urlsToCache = [
  '/threeJS-environment.html',
  '/js/three.js-master//build/three.min.js',
  '/js/vue.develope.js',
  '/css/threeJS.css',
  '/pageController.js',
  '/js/dat.gui.min.js',
  '/js/three.js-master/examples/js/controls/OrbitControls.js',
  '/js/three.js-master/examples/js/loaders/LoaderSupport.js',
  '/js/three.js-master/examples/js/loaders/OBJLoader2.js',
  '/js/three.js-master/examples/js/loaders/MTLLoader.js',
  '/js/three.js-master/examples/js/loaders/GLTFLoader.js',
  '/js/Inflate.min.js',
  '/js/three.js-master/examples/js/loaders/FBXLoader.js',
  '/js/three.js-master/examples/js/utils/SkeletonUtils.js',
  '/js/threeJS-environment.js',
  '/js/vue.js',
  '/audio/gun-blast_A_minor.wav',
  '/audio/kicked_G_major.wav',
  '/audio/industrial-fx.wav',
  '/audio/long-stretched-huh-with-reverb.wav',
  '/audio/old-rhodes-chord_90bpm_D.wav',
  '/3dModel/Farm%20Animals%20by%20@Quaternius/FBX/Cow.fbx',
  '/3dModel/Farm%20Animals%20by%20@Quaternius/FBX/Zebra.fbx',
  '/3dModel/Farm%20Animals%20by%20@Quaternius/FBX/Horse.fbx',
  '/3dModel/guns%20by%20@Quaternius/AssaultRifle_1.fbx',
  '/3dModel/Trees%20by%20@Quaternius/BirchTree_1.fbx',
  '/3dModel/Trees%20by%20@Quaternius/BirchTree_Dead_1.fbx',
  '/3dModel/Trees%20by%20@Quaternius/BirchTree_Autumn_1.fbx',
  '/3dModel/Flag%20by%20@Quaternius.fbx'
]

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheVersion).then(
      cache => {
        const promises = urlsToCache.map(
          url => {
            return cache.add(url).catch(
              err => console.log(err, url)
            )
          }
        )
        return Promise.all(promises)
      }
    ).catch(
      error => {
        console.log('error:', error)
      }
    )
  )
})

self.addEventListener('fetch', e => {
  const requestUrl = new URL(e.request.url)
  e.respondWith(
    caches.match(e.request).then(
      response => {
        if (response === undefined) {
          console.log('serve frome network')
          return fetch(e.request)
        } else {
          console.log('serve frome cache')
          return response
        }
      }
    )
  )
})
