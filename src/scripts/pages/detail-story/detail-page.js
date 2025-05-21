import DetailPresenter from './detail-presenter.js';
import * as StoryAPI from '../../data/api.js';
import { createMap, addMarker } from '../../utils/map.js';

export default class DetailPage {
  #presenter;

  async render() {
    return `
      <section class="detail-section container">
        <a href="#/home" class="back-link">
          <i class="fas fa-arrow-left"></i> Back to Home
        </a>
        <div id="story-detail" class="story-detail">
          <div class="spinner"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const container = document.getElementById('story-detail');
    const id = window.location.hash.split('/')[2];

    this.#presenter = new DetailPresenter({
      view: this,
      model: StoryAPI,
    });

    if (!id) {
      container.innerHTML = '<p>Story ID not found.</p>';
      return;
    }

    const result = await StoryAPI.getStoryById(id);
    if (result.error) {
      container.innerHTML = `<p>Error: ${result.message}</p>`;
      return;
    }

    const story = result.story;
    this.currentStory = story;

    container.innerHTML = `
      <div class="story-detail-card">
        <img src="${story.photoUrl}" alt="Photo by ${story.name}" class="story-image" />
        <h2>${story.name}</h2>
        <p>${story.description}</p>
        <p><small>${new Date(story.createdAt).toLocaleString()}</small></p>
        ${story.lat && story.lon ? `<div id="map"></div>` : ''}
        <div class="save-btn-wrapper"></div>
      </div>
    `;

    if (story.lat && story.lon) {
      const map = createMap('map', story.lat, story.lon, 13);
      addMarker(map, story.lat, story.lon);
    }

    await this.#presenter.showSaveButton(this.currentStory.id);
  }

  renderSaveButton(id) {
    const saveContainer = document.querySelector('.save-btn-wrapper');
    saveContainer.innerHTML = `
    <button id="save-btn" class="save-btn">
      <i class="fa-regular fa-bookmark"></i> Save
    </button>
  `;

    document.getElementById('save-btn').addEventListener('click', async () => {
      await this.#presenter.saveStory(this.currentStory);
      await this.#presenter.showSaveButton(id);
    });
  }

  saveToBookmarkSuccessfully(message) {
    alert(message);
  }

  saveToBookmarkFailed(message) {
    alert(message);
  }

  renderRemoveButton(id) {
    const saveContainer = document.querySelector('.save-btn-wrapper');
    saveContainer.innerHTML = `
    <button id="remove-btn" class="save-btn">
      <i class="fa-solid fa-bookmark"></i> Unsave
    </button>
  `;

    document.getElementById('remove-btn').addEventListener('click', async () => {
      await this.#presenter.removeStory(id);
      await this.#presenter.showSaveButton(id);
    });
  }

  removeFromBookmarkSuccessfully(message) {
    alert(message);
  }

  removeFromBookmarkFailed(message) {
    alert(message);
  }
}
