import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { BASE_URL } from './config';

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ url }) =>
    url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts',
  })
);

registerRoute(
  ({ url }) =>
    url.origin === 'https://cdnjs.cloudflare.com' || url.origin.includes('fontawesome'),
  new CacheFirst({
    cacheName: 'fontawesome',
  })
);

registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(BASE_URL);
    return baseUrl.origin === url.origin && request.destination !== "image";
  },
  new NetworkFirst({
    cacheName: "story-api",
  }),
);

registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(BASE_URL);
    return baseUrl.origin === url.origin && request.destination === "image";
  },
  new StaleWhileRevalidate({
    cacheName: "story-api-images",
  }),
);

registerRoute(
  ({ url }) => {
    return (
      url.origin === 'https://story-api.dicoding.dev' &&
      url.pathname.startsWith('/v1/stories/story-')
    );
  },
  new NetworkFirst({
    cacheName: 'story-detail-api',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  })
);

registerRoute(
  ({ url }) => {
    return url.origin.includes("maptiler");
  },
  new CacheFirst({
    cacheName: "maptiler-api",
  }),
);

self.addEventListener('push', (event) => {
  console.log('Service worker pushing...');
  async function chainPromise() {
    const data = await event.data.json();
    await self.registration.showNotification(data.title, {
      body: data.options.body,
    });
  }
  event.waitUntil(chainPromise());
});
