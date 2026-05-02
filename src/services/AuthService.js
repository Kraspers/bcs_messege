import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { db } from '../store/db.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

export class AuthService {
  register({ phone, email, password }) {
    const key = phone || email;
    if (!key || !password) throw new Error('phone/email and password are required');
    const exists = [...db.users.values()].find((u) => u.phone === phone || u.email === email);
    if (exists) throw new Error('user already exists');
    const id = uuid();
    db.users.set(id, { id, phone, email, passwordHash: bcrypt.hashSync(password, 10), createdAt: Date.now() });
    return this.createSession(id);
  }

  login({ phone, email, password }) {
    const user = [...db.users.values()].find((u) => (phone && u.phone === phone) || (email && u.email === email));
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) throw new Error('invalid credentials');
    return this.createSession(user.id);
  }

  createSession(userId) {
    const accessToken = signAccessToken({ userId });
    const refreshToken = signRefreshToken({ userId, sid: uuid() });
    db.sessions.set(refreshToken, { userId, createdAt: Date.now() });
    return { accessToken, refreshToken, user: db.users.get(userId) };
  }

  refresh(refreshToken) {
    if (!db.sessions.has(refreshToken)) throw new Error('session expired');
    const payload = verifyRefreshToken(refreshToken);
    return this.createSession(payload.userId);
  }

  requestRecovery({ phone, email }) {
    const user = [...db.users.values()].find((u) => (phone && u.phone === phone) || (email && u.email === email));
    if (!user) throw new Error('user not found');
    const code = String(Math.floor(100000 + Math.random() * 900000));
    db.recoveryCodes.set(user.id, { code, expiresAt: Date.now() + 5 * 60 * 1000 });
    return { message: 'Recovery code generated (SMS/email simulation)', code };
  }

  confirmRecovery({ phone, email, code, newPassword }) {
    const user = [...db.users.values()].find((u) => (phone && u.phone === phone) || (email && u.email === email));
    if (!user) throw new Error('user not found');
    const record = db.recoveryCodes.get(user.id);
    if (!record || record.code !== code || record.expiresAt < Date.now()) throw new Error('invalid or expired code');
    user.passwordHash = bcrypt.hashSync(newPassword, 10);
    db.recoveryCodes.delete(user.id);
    return { restored: true, historyRestored: true };
  }
}
