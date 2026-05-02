# Boocs Messenger (Backend Foundation)

Полноценная backend-основа для мессенджера уровня super-app с модульной архитектурой:

- Auth (JWT, refresh, recovery)
- Chats/messages/reactions
- Voice/video-note metadata (включая `triangle` форму)
- Calls (audio/video + mute/camera/recording)
- Music
- Taxi
- Metro transport
- Government services
- Realtime (Socket.io): сообщения, typing, push-события

## Запуск локально

```bash
npm install
npm run dev
```

API: `http://localhost:3000`

## Render deploy

В репозитории уже есть `render.yaml`.

1. Запушить репозиторий на GitHub.
2. В Render: **New +** → **Blueprint**.
3. Выбрать этот репозиторий.
4. Render автоматически прочитает `render.yaml` и создаст сервис.
5. После деплоя использовать URL Render для API.

## Базовые endpoints

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/recovery/request`
- `POST /auth/recovery/confirm`
- `POST /chats` (auth)
- `POST /messages` (auth)
- `POST /calls/start` (auth)
- `POST /taxi/order` (auth)
- `GET /transport/metro` (auth)
- `GET /government/profile` (auth)

## Health

`GET /health`
