import { openDB } from 'idb';

const DATABASE_NAME = 'storyapp';
const DATABASE_VERSION = 1;
const STORE_NAME = 'saved-stories';

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
  },
});

const StoryDB = {
  async put(story) {
    return (await dbPromise).put(STORE_NAME, story);
  },

  async get(id) {
    return (await dbPromise).get(STORE_NAME, id);
  },

  async getAll() {
    return (await dbPromise).getAll(STORE_NAME);
  },

  async delete(id) {
    return (await dbPromise).delete(STORE_NAME, id);
  },

  async isSaved(id) {
    const story = await this.get(id);
    return !!story;
  },
};

export default StoryDB;
