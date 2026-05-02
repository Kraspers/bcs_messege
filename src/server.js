import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { AuthService } from './services/AuthService.js';
import { MessageService } from './services/MessageService.js';
import { CallService } from './services/CallService.js';
import { MediaService } from './services/MediaService.js';
import { NotificationService } from './services/NotificationService.js';
import { TaxiService } from './services/TaxiService.js';
import { MusicService } from './services/MusicService.js';
import { GeoService } from './services/GeoService.js';
import { GovernmentService } from './services/GovernmentService.js';
import { auth } from './middleware/auth.js';

const services = { auth: new AuthService(), msg: new MessageService(), call: new CallService(), media: new MediaService(), notif: new NotificationService(), taxi: new TaxiService(), music: new MusicService(), geo: new GeoService(), gov: new GovernmentService() };

const app = express();
app.use(cors());
app.use(express.json());
app.get('/health', (req,res)=>res.json({status:'ok'}));

app.post('/auth/register', (req, res) => { try { res.json(services.auth.register(req.body)); } catch (e) { res.status(400).json({ error: e.message }); }});
app.post('/auth/login', (req, res) => { try { res.json(services.auth.login(req.body)); } catch (e) { res.status(400).json({ error: e.message }); }});
app.post('/auth/refresh', (req, res) => { try { res.json(services.auth.refresh(req.body.refreshToken)); } catch (e) { res.status(400).json({ error: e.message }); }});
app.post('/auth/recovery/request', (req, res) => { try { res.json(services.auth.requestRecovery(req.body)); } catch (e) { res.status(400).json({ error: e.message }); }});
app.post('/auth/recovery/confirm', (req, res) => { try { res.json(services.auth.confirmRecovery(req.body)); } catch (e) { res.status(400).json({ error: e.message }); }});

app.post('/chats', auth, (req, res) => res.json(services.msg.createChat({ ...req.body, ownerId: req.userId })));
app.get('/chats/:chatId/messages', auth, (req, res) => res.json(services.msg.listMessages(req.params.chatId)));
app.post('/messages', auth, (req, res) => res.json(services.msg.sendMessage({ ...req.body, senderId: req.userId })));
app.post('/messages/:id/react', auth, (req, res) => res.json(services.msg.react({ messageId: req.params.id, userId: req.userId, emoji: req.body.emoji })));

app.post('/calls/start', auth, (req, res) => res.json(services.call.start({ ...req.body, initiatorId: req.userId })));
app.post('/media/voice', auth, (req, res) => res.json(services.media.createVoiceMeta(req.body)));
app.post('/media/video-note', auth, (req, res) => res.json(services.media.createVideoMeta(req.body)));
app.get('/music/search', auth, (req, res) => res.json(services.music.search(req.query.q)));
app.get('/music/recommendations', auth, (req, res) => res.json(services.music.recommendations()));
app.post('/taxi/order', auth, (req, res) => res.json(services.taxi.order({ ...req.body, userId: req.userId })));
app.get('/transport/metro', auth, (req, res) => res.json(services.geo.metroRoutes(req.query)));
app.get('/government/profile', auth, (req, res) => res.json(services.gov.getProfile(req.userId)));
app.post('/government/pay', auth, (req, res) => res.json(services.gov.pay(req.userId, req.body.section, req.body.id)));

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });
io.on('connection', (socket) => {
  socket.on('join_chat', (chatId) => socket.join(chatId));
  socket.on('typing', ({ chatId, userId }) => io.to(chatId).emit('typing', { userId }));
  socket.on('send_realtime_message', (payload) => {
    const msg = services.msg.sendMessage(payload);
    io.to(payload.chatId).emit('new_message', msg);
    io.to(payload.chatId).emit('push', services.notif.buildPush({ userId: 'chat_members', title: 'New message', preview: msg.content || msg.kind }));
  });
});

const port = process.env.PORT || 3000;
httpServer.listen(port, () => console.log(`Boocs API on :${port}`));
