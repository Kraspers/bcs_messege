import { v4 as uuid } from 'uuid';
import { db } from '../store/db.js';

export class CallService {
  start({ chatId, initiatorId, type }) {
    const call = { id: uuid(), chatId, initiatorId, type, startedAt: Date.now(), active: true, muted: false, cameraEnabled: type === 'video', camera: 'front', recording: false };
    db.calls.set(call.id, call);
    return call;
  }
  toggleMute(id){ const c=db.calls.get(id); c.muted=!c.muted; return c; }
  toggleCamera(id){ const c=db.calls.get(id); c.cameraEnabled=!c.cameraEnabled; return c; }
  switchCamera(id){ const c=db.calls.get(id); c.camera=c.camera==='front'?'back':'front'; return c; }
  toggleRecording(id){ const c=db.calls.get(id); c.recording=!c.recording; return c; }
  end(id){ const c=db.calls.get(id); c.active=false; c.endedAt=Date.now(); return c; }
}
