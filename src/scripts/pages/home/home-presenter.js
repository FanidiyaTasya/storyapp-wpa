export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async loadStories() {
    this.#view.showLoading();

    try {
      const result = await this.#model.getAllStories({ withLocation: true });
      if (result.error) {
        this.#view.showError(result.message);
        return;
      }

      const storiesWithLocation = await Promise.all(
        result.listStory.map(async (story) => {
          let location = '';
          if (story.lat && story.lon) {
            location = await this.#getLocationName(story.lat, story.lon);
          }
          return { ...story, location };
        }),
      );

      this.#view.showStories(storiesWithLocation);
    } catch (error) {
      console.error('loadStories error:', error);
      this.#view.showError('Failed to load stories.');
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
}
