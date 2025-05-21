import { postStory } from '../../data/api.js';

export default class AddStoryPresenter {
  #view;

  constructor({ view }) {
    this.#view = view;
  }

  init() {
    this.#view.bindMapClick(this.handleMapClick);
    this.#view.bindPhotoInput(this.handlePhotoInput);
    this.#view.bindCameraActions();
    this.#view.bindFormSubmit(this.handleFormSubmit);
  }

  handleMapClick = ({ lat, lon }) => {
    this.#view.updateLatLon(lat, lon);
    this.#view.showMarker(lat, lon);
  };

  handlePhotoInput = (photoURL) => {
    this.#view.showPhotoPreview(photoURL);
  };

  handleFormSubmit = async (formData) => {
    try {
      await postStory(formData);
      this.#view.showSuccessMessage();
      window.location.hash = '/home';
    } catch (error) {
      this.#view.showErrorMessage();
      console.error(error);
    }
  };
}
