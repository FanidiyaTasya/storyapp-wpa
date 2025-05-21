import StoryDB from '../../data/database.js';

export default class SavedPage {
  async render() {
    return `
      <section class="home-section container">
        <div class="home-header">
          <h3>Saved Story</h3>
        </div>
        <div id="saved-story-list" class="story-list">
          <div class="spinner"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const stories = await StoryDB.getAll();
    const container = document.getElementById('saved-story-list');

    if (!stories.length) {
      container.innerHTML = `<p>Tidak ada story tersimpan.</p>`;
      return;
    }

    container.innerHTML = stories
      .map(
        (story) => `
        <a href="#/detail/${story.id}" class="story-card-link">
          <article class="story-card">
            <img src="${story.photoUrl}" alt="Photo by ${story.name}" class="story-image" />
            <h3>${story.name}</h3>
            <p>${story.description}</p>
            <p><small>${new Date(story.createdAt).toLocaleString()}</small></p>
            ${
              story.location
                ? `<p class="story-location"><i class="fas fa-map-marker-alt"></i> ${story.location}</p>`
                : ''
            }
          </article>
        </a>
      `,
      )
      .join('');
  }
}
