import { db } from '../store/db.js';

export class MusicService {
  search(query = '') {
    const q = query.toLowerCase();
    return db.music.filter((t) => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q));
  }
  recommendations() {
    return db.music;
  }
}
