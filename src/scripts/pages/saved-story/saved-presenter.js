import StoryDB from '../../data/database.js';

export default class SavedPresenter {
  #view;

  constructor(view) {
    this.#view = view;
  }

  async loadSavedStories() {
    try {
      const stories = await StoryDB.getAll();
      this.#view.renderStories(stories);
    } catch (error) {
      console.error('Failed to load saved stories:', error);
      const container = document.getElementById('saved-story-list');
      if (container) {
        container.innerHTML = `<p>Gagal memuat story tersimpan.</p>`;
      }
    }
  }
}
