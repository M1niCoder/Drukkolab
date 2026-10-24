# Drukkolab — сайт

## Структура архіву
```
index.html, 404.html, icons/ ...   ← готовий сайт, index.html одразу в корені
source/                            ← вихідники (тексти, стилі, генератор)
```
Щоб сайт працював, нічого збирати не треба: відкрийте `index.html` або завантажіть корінь архіву на Cloudflare Pages (Direct Upload; без Build command, Output directory `/`).

## Редагування
Усе в папці `source/`:
- `src/config/site.mjs` — Telegram/Instagram, фото (`public/photos/artem.jpg`), домен, `noindex`.
- `src/content/uk/home.mjs` — усі тексти; `projects.mjs` — стрічка робіт.
- `src/styles/`, `src/scripts/main.js` — вигляд і скрипти.

Після змін (потрібен Node 18+): `cd source && node build.mjs --html-links --flat --out=..` — оновлює `index.html` та інші файли в корені.
Для Git-деплою Cloudflare з папки `source`: Build command `node build.mjs`, Output directory `dist`.

## Перед запуском
1. Замінити тимчасові адреси Telegram/Instagram на свої. 2. Додати фото. 3. `noindex: false` і реальний `siteUrl`.
