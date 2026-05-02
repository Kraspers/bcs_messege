import { v4 as uuid } from 'uuid';
import { db } from '../store/db.js';

export class MessageService {
  createChat({ type, title, members, ownerId }) {
    const id = uuid();
    const chat = { id, type, title: title || 'Untitled', members: [...new Set([...(members || []), ownerId])], pinnedMessageId: null, createdAt: Date.now() };
    db.chats.set(id, chat);
    return chat;
  }

  sendMessage({ chatId, senderId, content, media, kind = 'text' }) {
    if (!db.chats.has(chatId)) throw new Error('chat not found');
    const msg = { id: uuid(), chatId, senderId, content, media, kind, reactions: {}, createdAt: Date.now(), editedAt: null, deletedFor: [] };
    db.messages.set(msg.id, msg);
    return msg;
  }

  react({ messageId, userId, emoji }) { const m = db.messages.get(messageId); if (!m) throw new Error('message not found'); m.reactions[userId] = emoji; return m; }
  edit({ messageId, userId, content }) { const m = db.messages.get(messageId); if (!m || m.senderId !== userId) throw new Error('forbidden'); m.content = content; m.editedAt = Date.now(); return m; }
  delete({ messageId, userId, forEveryone }) { const m = db.messages.get(messageId); if (!m) throw new Error('message not found'); if (forEveryone && m.senderId !== userId) throw new Error('forbidden'); if (forEveryone) db.messages.delete(messageId); else m.deletedFor.push(userId); return { ok: true }; }
  pin({ chatId, messageId }) { const c = db.chats.get(chatId); if (!c) throw new Error('chat not found'); c.pinnedMessageId = messageId; return c; }
  listMessages(chatId) { return [...db.messages.values()].filter((m) => m.chatId === chatId).sort((a,b)=>a.createdAt-b.createdAt); }
}
