export const db = {
  users: new Map(),
  sessions: new Map(),
  recoveryCodes: new Map(),
  chats: new Map(),
  messages: new Map(),
  calls: new Map(),
  music: [
    { id: 'm1', title: 'Night Drive', artist: 'Boocs Audio', tags: ['chill'] },
    { id: 'm2', title: 'Metro Pulse', artist: 'Transit Wave', tags: ['electro'] }
  ],
  taxiOrders: new Map(),
  governmentProfiles: new Map()
};
