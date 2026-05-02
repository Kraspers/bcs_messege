import { db } from '../store/db.js';

export class GovernmentService {
  getProfile(userId) {
    if (!db.governmentProfiles.has(userId)) {
      db.governmentProfiles.set(userId, {
        documents: [{ id: 'passport', status: 'valid' }],
        fines: [{ id: 'f-1', amount: 1200, paid: false }],
        taxes: [{ id: 't-1', amount: 5000, paid: false }]
      });
    }
    return db.governmentProfiles.get(userId);
  }
  pay(userId, section, id) {
    const profile = this.getProfile(userId);
    const entry = profile[section]?.find((x) => x.id === id);
    if (!entry) throw new Error('item not found');
    entry.paid = true;
    return entry;
  }
}
