import HomePresenter from './home-presenter.js';
import * as StoryAPI from '../../data/api.js';
import {
  isCurrentPushSubscriptionAvailable,
  subscribe,
  unsubscribe
} from '../../utils/notification.js';

export default class HomePage {
  #presenter = null;

  async render() {
    return `
      <section class="home-section container">
        <div class="home-header">
          <div class="btn-group-navigation">
            <a href="#/add" class="form-button">
              <i class="fas fa-plus"></i> New Story
            </a>
            <a href="#/saved" id="saved-story-page" class="form-button">
              <i class="fas fa-bookmark"></i> Saved Story
            </a>
          </div>
          <button id="subscribe-btn" class="form-button outline">
            <i class="fas fa-bell"></i> Subscribe
          </button>
        </div>
        <div id="story-list" class="story-list">
          <div class="spinner"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const container = document.getElementById('story-list');
    if (!container) {
      console.error('Element #story-list not found!');
      return;
    }

    this.#presenter = new HomePresenter({
      view: this,
      model: StoryAPI,
    });

    await this.#presenter.loadStories();

    const button = document.getElementById('subscribe-btn');
    const isSubscribed = await isCurrentPushSubscriptionAvailable();
    button.innerHTML = isSubscribed
      ? `<i class="fas fa-bell-slash"></i> Unsubscribe`
      : `<i class="fas fa-bell"></i> Subscribe`;

    button.addEventListener('click', async () => {
      if (await isCurrentPushSubscriptionAvailable()) {
        await unsubscribe();
      } else {
        await subscribe();
      }

      const newStatus = await isCurrentPushSubscriptionAvailable();
      button.innerHTML = newStatus
        ? `<i class="fas fa-bell-slash"></i> Unsubscribe`
        : `<i class="fas fa-bell"></i> Subscribe`;
    });
  }

  showLoading() {
    const container = document.getElementById('story-list');
    if (!container) return;
    container.innerHTML = `<div class="spinner"></div>`;
  }

  showStories(stories) {
    const container = document.getElementById('story-list');
    if (!container) return;

    container.innerHTML = stories
      .map(
        (story) => `
          <a href="#/detail/${story.id}" class="story-card-link">
            <article class="story-card">
              <img src="${story.photoUrl}" alt="Photo by ${story.name}" class="story-image" loading="lazy" />
              <h3>${story.name}</h3>
              <p>${story.description}</p>
              <p><small>${new Date(story.createdAt).toLocaleString()}</small></p>
              ${story.location
                ? `<p class="story-location"><i class="fas fa-map-marker-alt"></i> ${story.location}</p>`
                : ''
              }
            </article>
          </a>
        `
      )
      .join('');
  }

  showError(message) {
    const container = document.getElementById('story-list');
    if (!container) {
      console.warn('showError: #story-list not found.');
      return;
    }
    container.innerHTML = `<p class="error-message">Error loading stories: ${message}</p>`;
  }
}
