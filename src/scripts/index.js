// CSS imports
import '../styles/styles.css';

import { stopCamera } from './utils/camera';
import App from './pages/app';
import { registerServiceWorker } from './utils/index.js';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    skipLinkButton: document.getElementById('skip-link'),
  });
  await app.renderPage();

  document.getElementById('skip-link').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('main-content').focus();
  });

  await registerServiceWorker();
  console.log('Berhasil mendaftarkan service worker.');

  window.addEventListener('hashchange', async () => {
    const videoElement = document.getElementById('camera-stream');
    if (videoElement && videoElement.srcObject) {
      stopCamera(videoElement);
      videoElement.style.display = 'none';
    }

    await app.renderPage();
  });
});
