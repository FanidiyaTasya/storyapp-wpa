import AddStoryPresenter from './add-story-presenter.js';
import { createMap, addMarker } from '../../utils/map.js';
import { startCamera, stopCamera, takePhoto } from '../../utils/camera.js';

export default class AddStoryPage {
  #presenter;
  #map;
  #marker;
  #cameraStream;

  async render() {
    return `
      <section class="add-story-section">
        <div class="add-story-card">
          <h2>Add Story</h2>
          <form id="add-story-form" class="add-story-form" enctype="multipart/form-data">
            <label for="description">Description</label>
            <textarea id="description" name="description" required></textarea>

            <label for="photo">Photo</label>
            <div class="photo-upload-controls">
              <button type="button" id="camera-btn" class="form-button">
                <i class="fas fa-camera"></i> Take Photo
              </button>
              <button type="button" id="file-btn" class="form-button">
                <i class="fas fa-folder-open"></i> Choose Photo
              </button>
              <input type="file" id="photo" name="photo" accept="image/*" hidden  />
            </div>

            <video id="camera-stream" style="display:none; max-width:100%;"></video>
            <button type="button" id="take-photo-btn" style="display:none;">
              <i class="fas fa-camera"></i>
            </button>
            <canvas id="canvas" style="display:none;"></canvas>
            <img id="photo-preview" src="" alt="Preview Foto" />

            <label for="map">Location</label>
            <div id="map"></div>

            <input type="hidden" id="lat" name="lat" />
            <input type="hidden" id="lon" name="lon" />

            <button type="submit">Upload</button>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#initElements();
    this.photoPreview.style.display = 'none';
    this.#initMap();
    this.#presenter = new AddStoryPresenter({ view: this });
    this.#presenter.init();
  }

  #initElements() {
    this.form = document.getElementById('add-story-form');
    this.description = document.getElementById('description');
    this.photoInput = document.getElementById('photo');
    this.photoPreview = document.getElementById('photo-preview');
    this.cameraBtn = document.getElementById('camera-btn');
    this.fileBtn = document.getElementById('file-btn');
    this.cameraStream = document.getElementById('camera-stream');
    this.takePhotoBtn = document.getElementById('take-photo-btn');
    this.canvas = document.getElementById('canvas');
    this.lat = document.getElementById('lat');
    this.lon = document.getElementById('lon');
  }

  #initMap() {
    this.#map = createMap('map');
    this.#map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      this.#presenter.handleMapClick({ lat, lon: lng });
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        this.#map.setView([lat, lon], 13);
        this.updateLatLon(lat, lon);
        this.showMarker(lat, lon);
      });
    }
  }

  bindMapClick(handler) {
    this.#map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      handler({ lat, lon: lng });
    });
  }

  bindPhotoInput(handler) {
    this.photoInput.addEventListener('change', () => {
      const file = this.photoInput.files[0];
      if (!file) return;

      const maxSize = 1 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('The selected file is too large. Maximum size is 1MB.');
        this.photoInput.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => handler(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  bindCameraActions() {
    this.cameraBtn.addEventListener('click', async () => {
      await startCamera(this.cameraStream);
      this.cameraStream.style.display = 'block';
      this.takePhotoBtn.style.display = 'inline-block';
    });

    this.takePhotoBtn.addEventListener('click', () => {
      const photoDataUrl = takePhoto(this.cameraStream, this.canvas);
      this.showPhotoPreview(photoDataUrl);
      stopCamera(this.cameraStream);
      this.cameraStream.style.display = 'none';
      this.takePhotoBtn.style.display = 'none';
    });

    this.fileBtn.addEventListener('click', () => {
      this.photoInput.click();
    });
  }


  bindFormSubmit(handler) {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append('description', this.description.value);

      const photoFile = this.photoInput.files[0];
      const isPreviewEmpty =
        !this.photoPreview.src || this.photoPreview.style.display === 'none';

      if (!photoFile && isPreviewEmpty) {
        alert('Please provide a photo using the camera or file picker.');
        return;
      }

      if (photoFile) {
        formData.append('photo', photoFile);
      } else {
        const blob = await (await fetch(this.photoPreview.src)).blob();
        formData.append('photo', blob, 'photo.jpg');
      }

      if (this.lat.value && this.lon.value) {
        formData.append('lat', this.lat.value);
        formData.append('lon', this.lon.value);
      }

      handler(formData);
    });
  }

  updateLatLon(lat, lon) {
    this.lat.value = lat;
    this.lon.value = lon;
  }

  showMarker(lat, lon) {
    if (this.#marker) this.#marker.remove();
    this.#marker = addMarker(this.#map, lat, lon);
  }

  showPhotoPreview(src) {
    this.photoPreview.src = src;
    this.photoPreview.style.display = 'block';
  }

  showSuccessMessage() {
    alert('Successfully added!');
  }

  showErrorMessage() {
    alert('Failed to add story.');
  }
}
