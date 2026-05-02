# Boocs Messenger API

## Render (исправление ошибки `Publish directory npm start does not exist`)

Эта ошибка появляется, когда в Render создается **Static Site** вместо **Web Service**.

Делай строго так:

1. Удали текущий неуспешный сервис.
2. `New +` → `Blueprint`.
3. Подключи репозиторий.
4. Render прочитает `render.yaml` и создаст именно **Web Service** с `startCommand`.

Используемый конфиг уже готов в `render.yaml`.

## Local run

```bash
npm install
npm run dev
```

## Healthcheck

`GET /health`
