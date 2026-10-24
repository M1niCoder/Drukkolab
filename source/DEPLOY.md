# Деплой на Cloudflare Pages
1. Залийте папку проєкту в GitHub-репозиторій.
2. Cloudflare → Workers & Pages → Create → Pages → Connect to Git.
3. Build command: `node build.mjs`, Build output directory: `dist`, змінна `NODE_VERSION` = `20`.
4. Після деплою підключіть домен у вкладці Custom domains.
5. Коли все готово: у `src/config/site.mjs` поставте `noindex: false` і свій `siteUrl`, перезберіть.
Також можна просто завантажити готову папку `dist/` через Direct Upload.
