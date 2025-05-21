import StoryDB from '../../data/database.js';

export default class DetailPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async loadDetail(id) {
    this.#view.showLoading();

    try {
      const result = await this.#model.getStoryById(id);
      if (result.error) {
        this.#view.showError(result.message);
        return;
      }

      let location = '';
      if (result.lat && result.lon) {
        location = await this.#getLocationName(result.lat, result.lon);
      }

      const storyWithLocation = { ...result, location };
      this.#view.showDetail(storyWithLocation);
    } catch (error) {
      console.error('loadDetail error:', error);
      this.#view.showError('Failed to load story detail.');
    }
  }

  async #getLocationName(lat, lon) {
    const key = `location_${lat.toFixed(5)}_${lon.toFixed(5)}`;
    const cached = localStorage.getItem(key);
    if (cached) return cached;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
        {
          headers: {
            'User-Agent': 'StoryApp/1.0 (fanidiyatasya@email.com)',
          },
        },
      );
      const data = await response.json();
      const city = data.address.city || data.address.town || data.address.village || '';
      const country = data.address.country || '';
      const location = `${city}${city && country ? ', ' : ''}${country}`;
      localStorage.setItem(key, location);
      return location;
    } catch {
      return 'Location unavailable';
    }
  }

  async saveStory(story) {
    try {
      console.log('Saving story:', story);
      await StoryDB.put(story);
      this.#view.saveToBookmarkSuccessfully('Story berhasil disimpan!');
    } catch (err) {
      console.error('Error saving story:', err);
      this.#view.saveToBookmarkFailed('Gagal menyimpan story.');
    }
  }

  async removeStory(id) {
    try {
      await StoryDB.delete(id);
      this.#view.removeFromBookmarkSuccessfully('Story berhasil dihapus!');
    } catch (err) {
      this.#view.removeFromBookmarkFailed('Gagal menghapus story.');
    }
  }

  async showSaveButton(id) {
    const isSaved = await this.#isStorySaved(id);

    if (isSaved) {
      this.#view.renderRemoveButton(id);
    } else {
      this.#view.renderSaveButton(id);
    }
  }

  async #isStorySaved(id) {
    return await StoryDB.isSaved(id);
  }
}
