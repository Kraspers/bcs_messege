export class NotificationService {
  buildPush({ userId, title, preview }) {
    return { userId, title, preview, sound: true, timestamp: Date.now() };
  }
}
