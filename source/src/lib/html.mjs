import { symbol } from "./logo.mjs";
import { art } from "./art.mjs";

export const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Контекст сторінки: усі посилання відносні, тож сайт працює з будь-якої папки
// і з кореня домену Cloudflare Pages.
export function makeCtx({ site, c, locale, route, htmlLinks = false, absolute = false }) {
  const prefix = locale === site.defaultLocale ? "" : "/" + locale;
  const full = prefix + route;
  const depth = absolute ? 0 : full.split("/").filter(Boolean).length;
  const root = absolute ? "/" : depth ? "../".repeat(depth) : "./";

  const url = (p) => {
    const [noHash, hash = ""] = p.split("#");
    const target = prefix + noHash;
    let rel = absolute ? target : root + target.replace(/^\//, "");
    if (htmlLinks && !absolute && rel.endsWith("/")) rel += "index.html";
    if (rel === "") rel = "./";
    return rel + (hash ? "#" + hash : "");
  };
  const file = (p) => (absolute ? "/" : root) + p.replace(/^\//, "");

  return { site, c, home: c.home, locale, route, prefix, full, root, url, file, htmlLinks, absolute, inline: null };
}

// Посилання на розділ: на головній простий #якір, на інших сторінках повний шлях
export const anchor = (ctx, id) => (ctx.route === "/" ? "#" + id : ctx.url("/#" + id));

// Посилання на соцмережу; якщо профіль не налаштовано, веде до блоку зв'язку
export function socialLink(ctx, kind) {
  const u = ctx.site.social[kind];
  return u ? { href: u, external: true } : { href: anchor(ctx, "contact"), external: false };
}

const arrowSvg = `<svg class="btn-arrow" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const downSvg = `<svg class="btn-arrow btn-arrow-down" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 3v10M4 9l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export function btn({ href, label, variant = "primary", external = false, icon = "arrow", cls = "" }) {
  const ext = external ? ' target="_blank" rel="noopener"' : "";
  const ic = icon === "down" ? downSvg : icon === "arrow" ? arrowSvg : "";
  return `<a class="btn btn-${variant}${cls ? " " + cls : ""}" href="${esc(href)}"${ext}>${label}${ic}</a>`;
}

export function socialButtons(ctx, items, variant = "ghost") {
  return items
    .map(([kind, label]) => {
      const s = socialLink(ctx, kind);
      return btn({ href: s.href, label, variant, external: s.external, icon: "" });
    })
    .join("");
}

export const details = (items) =>
  `<div class="faq-list">${items
    .map(
      (it) =>
        `<details class="faq-item"><summary><span>${it.q}</span><svg class="faq-icon" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M10 4v12M4 10h12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></summary><div class="faq-answer"><p>${it.a}</p></div></details>`
    )
    .join("")}</div>`;

export const field = (id, label, control, { hint = "", required = false } = {}) =>
  `<div class="field" data-field="${id}"><label for="${id}">${label}${required ? ' <span class="req" aria-hidden="true">*</span>' : ""}</label>${control}${hint ? `<p class="hint" id="${id}-hint">${hint}</p>` : ""}<p class="error" id="${id}-error" role="alert" hidden></p></div>`;

// Візуал роботи: фото, якщо воно вказано, інакше шарова ілюстрація
export function visual(ctx, p, theme = "light") {
  if (p.photo) {
    return `<img class="work-photo" src="${esc(ctx.file(p.photo))}" alt="${esc(p.title)}" width="600" height="600" loading="lazy" decoding="async">`;
  }
  return art({ profile: p.art.profile, layers: p.art.layers || 22, theme });
}

function headerHtml(ctx) {
  const h = ctx.home;
  const tg = socialLink(ctx, "telegram");
  const nav = h.nav.map((n) => `<li><a href="${anchor(ctx, n.id)}">${n.label}</a></li>`).join("");
  return `<header class="site-header" data-header>
  <div class="container header-inner">
    <a class="brand" href="${ctx.route === "/" ? "#top" : ctx.url("/")}" aria-label="${esc(ctx.site.brand.name)}">${symbol({ size: 28 })}<span class="brand-name">${ctx.site.brand.name}</span></a>
    <ul class="header-nav">${nav}</ul>
    ${btn({ href: tg.href, label: h.cta.write, external: tg.external, icon: "" })}
  </div>
</header>`;
}

function footerHtml(ctx) {
  const h = ctx.home;
  const links = h.nav.map((n) => `<li><a href="${anchor(ctx, n.id)}">${n.label}</a></li>`).join("");
  const socials = [["telegram", "Telegram"], ["instagram", "Instagram"], ["tiktok", "TikTok"]]
    .filter(([k]) => k !== "tiktok" || ctx.site.social.tiktok);
  return `<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-brand">
      <a class="brand" href="${ctx.route === "/" ? "#top" : ctx.url("/")}" aria-label="${esc(ctx.site.brand.name)}">${symbol({ size: 34 })}<span class="brand-name">${ctx.site.brand.name}</span></a>
      <p>${h.footer.tagline}</p>
    </div>
    <ul class="footer-links">${links}</ul>
    <div class="footer-social">${socialButtons(ctx, socials)}</div>
  </div>
  <div class="container footer-bottom"><p>© ${new Date().getFullYear()} ${ctx.site.brand.name}. ${h.footer.rights}</p></div>
</footer>`;
}

export function layout(ctx, { title, description, main, jsonld = [] }) {
  const { site } = ctx;
  const fullTitle = title.includes(site.brand.name) ? title : `${title}${site.seo.titleSeparator}${site.brand.name}`;
  const meta = site.localeMeta[ctx.locale];
  const canonical = site.noindex ? "" : `<link rel="canonical" href="${site.siteUrl}${ctx.full}">`;
  const og = [
    ["og:type", "website"],
    ["og:title", fullTitle],
    ["og:description", description],
    ["og:locale", meta.ogLocale],
    ["og:site_name", site.brand.name],
    ...(site.noindex ? [] : [["og:url", site.siteUrl + ctx.full]]),
    ...(site.seo.ogImage ? [["og:image", site.siteUrl + site.seo.ogImage]] : []),
  ]
    .map(([k, v]) => `<meta property="${k}" content="${esc(v)}">`)
    .join("");

  const ld = [{ "@context": "https://schema.org", "@type": "WebSite", name: site.brand.name, inLanguage: meta.htmlLang }, ...jsonld]
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`)
    .join("");

  const analytics =
    site.analytics.enabled && site.analytics.provider === "cloudflare" && site.analytics.id
      ? `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"${esc(site.analytics.id)}"}'></script>`
      : "";

  const css = ctx.inline ? `<style>${ctx.inline.css}</style>` : `<link rel="stylesheet" href="${ctx.file("site.css")}">`;
  const js = ctx.inline ? `<script>${ctx.inline.js}</script>` : `<script src="${ctx.file("main.js")}" defer></script>`;

  return `<!doctype html>
<html lang="${meta.htmlLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#171513">
${site.noindex ? '<meta name="robots" content="noindex, nofollow">' : ""}
${canonical}
${og}
<link rel="icon" href="${ctx.file("favicon.svg")}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${ctx.file("icons/apple-touch-icon.png")}">
<link rel="manifest" href="${ctx.file("site.webmanifest")}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500&family=Space+Grotesk:wght@400;500&display=swap">
${css}
<script>document.documentElement.classList.add('js')</script>
${ld}
</head>
<body>
<a class="skip-link" href="#main">Перейти до змісту</a>
${headerHtml(ctx)}
<main id="main" tabindex="-1">
${main}
</main>
${footerHtml(ctx)}
${js}
${analytics}
</body>
</html>`;
}
