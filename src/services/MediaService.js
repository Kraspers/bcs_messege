export class MediaService {
  createVoiceMeta({ durationSec, waveform, speed = 1 }) {
    return { kind: 'voice', durationSec, waveform, speed };
  }
  createVideoMeta({ durationSec, shape = 'circle' }) {
    if (!['circle', 'square', 'triangle'].includes(shape)) throw new Error('unsupported shape');
    return { kind: 'video_note', durationSec, shape, autoSent: true };
  }
}
