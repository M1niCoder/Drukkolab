// Генератор статичного сайту Drukkolab. Без залежностей: потрібен лише Node.js 18+.
//   node build.mjs                          → dist/ (для Cloudflare Pages)
//   node build.mjs --flat --out=..          → index.html одразу в папці вище (без вкладених папок)
//   node build.mjs --html-links --artifact --out=preview → варіант для перегляду з файлів / в чаті
// CSS і JS вбудовуються прямо в HTML: це один запит замість трьох, тож швидше на телефоні.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { site } from "./src/config/site.mjs";
import { makeCtx, layout } from "./src/lib/html.mjs";
import { iconSvg } from "./src/lib/logo.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const htmlLinks = args.includes("--html-links");
const artifact = args.includes("--artifact");
const flat = args.includes("--flat"); // писати прямо в папку --out без очищення (index.html у корені)
const outName = (args.find((a) => a.startsWith("--out=")) || "--out=dist").split("=")[1];
const out = path.join(root, outName);

const rm = (p) => fs.rmSync(p, { recursive: true, force: true });
const write = (rel, data) => {
  const f = path.join(out, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, data);
};
const copyDir = (from, to) => {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, e.name);
    const b = path.join(to, e.name);
    if (e.isDirectory()) copyDir(a, b);
    else fs.copyFileSync(a, b);
  }
};

if (!flat) rm(out);
fs.mkdirSync(out, { recursive: true });

// 1. Статичні файли (public/)
copyDir(path.join(root, "public"), out);

// 2. CSS та JS: стиснення й вбудовування
const cssFiles = ["tokens.css", "base.css", "components.css", "pages.css"];
const css = cssFiles
  .map((f) => fs.readFileSync(path.join(root, "src/styles", f), "utf8"))
  .join("\n")
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\s+/g, " ")
  .replace(/ ?([{};,]) ?/g, "$1")
  .replace(/;}/g, "}")
  .trim();
const js = fs.readFileSync(path.join(root, "src/scripts/main.js"), "utf8").replace(/^\s*\/\/.*$/gm, "");

// 3. Іконка та маніфест (з єдиного компонента логотипа)
write("favicon.svg", iconSvg());
write(
  "site.webmanifest",
  JSON.stringify(
    {
      name: site.brand.name,
      short_name: site.brand.name,
      lang: site.defaultLocale,
      start_url: "./",
      display: "standalone",
      background_color: "#171513",
      theme_color: "#171513",
      icons: [
        { src: "icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
        { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
        { src: "icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        { src: "favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      ],
    },
    null,
    2
  )
);

// 4. Сторінки
const home = await import(pathToFileURL(path.join(root, "src/pages/home.mjs")).href);
const notfound = await import(pathToFileURL(path.join(root, "src/pages/notfound.mjs")).href);

const sitemap = [];
let count = 0;

for (const locale of site.locales) {
  let c;
  try {
    c = await import(pathToFileURL(path.join(root, `src/content/${locale}/index.mjs`)).href);
  } catch (e) {
    console.warn(`! Немає контенту для "${locale}", пропускаю`);
    continue;
  }
  const prefix = locale === site.defaultLocale ? "" : "/" + locale;

  const emit = (mod, route, { absolute = false, file } = {}) => {
    const ctx = makeCtx({ site, c, locale, route, htmlLinks, absolute });
    ctx.inline = { css, js };
    let html = layout(ctx, mod.render(ctx));
    // --artifact: сторінка віддається фрагментом, бо хостинг для перегляду сам додає каркас
    if (artifact && route === "/" && locale === site.defaultLocale) {
      const head = html
        .match(/<head>([\s\S]*?)<\/head>/)[1]
        .replace(/<meta charset[^>]*>\s*/, "")
        .replace(/<meta name="viewport"[^>]*>\s*/, "")
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${site.brand.name}</title>`);
      const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/)[1];
      html = head + body;
    }
    write(file || (prefix + route).replace(/^\//, "") + "index.html", html);
    count++;
  };

  emit(home, "/");
  sitemap.push(prefix + "/");

  // 404 лише для мови за замовчуванням; абсолютні посилання, бо Cloudflare віддає її на будь-якому шляху
  if (locale === site.defaultLocale) emit(notfound, "/404/", { absolute: true, file: "404.html" });
}

// 5. robots.txt і sitemap.xml
write(
  "robots.txt",
  site.noindex
    ? "User-agent: *\nDisallow: /\n\n# Сайт закрито від індексації. Вимкніть site.noindex у src/config/site.mjs, коли будете готові до публікації.\n"
    : `User-agent: *\nAllow: /\n\nSitemap: ${site.siteUrl}/sitemap.xml\n`
);
write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap
    .map((u) => `  <url><loc>${site.siteUrl}${u}</loc></url>`)
    .join("\n")}\n</urlset>\n`
);

console.log(`Готово: ${count} сторінок → ${path.relative(root, out) || "."}/`);
