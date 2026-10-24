import { art } from "../lib/art.mjs";
import { symbol } from "../lib/logo.mjs";
import { btn, anchor, socialLink, socialButtons, details, visual, esc } from "../lib/html.mjs";

const tick = `<svg class="get-tick" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const chevL = `<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M12 4l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const chevR = `<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M8 4l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export function render(ctx) {
  const { site, home: h, c } = ctx;
  const tg = socialLink(ctx, "telegram");
  const tgLabel = site.social.telegram ? h.cta.writeTelegram : h.cta.write;
  const hasExamples = c.projects.some((p) => !p.photo);

  const hero = `<section class="hero section--dark" id="top" aria-labelledby="hero-title">
  <div class="container hero-grid">
    <div class="hero-copy">
      <p class="eyebrow">${h.hero.eyebrow}</p>
      <h1 id="hero-title">${h.hero.title}</h1>
      <p class="lead">${h.hero.lead}</p>
      <div class="cta-row">
        ${btn({ href: tg.href, label: tgLabel, external: tg.external })}
        ${btn({ href: "#works", label: h.cta.works, variant: "ghost", icon: "down" })}
      </div>
      <ul class="chips">${h.hero.chips.map((x) => `<li class="chip"><b>${x.b}</b> ${x.t}</li>`).join("")}</ul>
    </div>
    <div class="hero-art">${art({ profile: "creature", layers: 26, theme: "dark", animate: true })}</div>
  </div>
</section>`;

  const works = `<section class="section section--cream works" id="works" aria-labelledby="works-title">
  <div class="container">
    <div class="works-head">
      <h2 class="section-title" id="works-title">${h.works.title}</h2>
      <div class="strip-nav">
        <button class="strip-btn" type="button" data-strip-prev aria-label="${h.works.prev}">${chevL}</button>
        <button class="strip-btn" type="button" data-strip-next aria-label="${h.works.next}">${chevR}</button>
      </div>
    </div>
    <div class="strip" data-strip role="group" aria-label="${h.works.title}" tabindex="0">
      ${c.projects
        .map(
          (p) => `<figure class="slide"><div class="slide-art">${visual(ctx, p, "light")}${p.photo ? "" : `<span class="badge">${h.works.badge}</span>`}</div><figcaption><strong>${p.title}</strong><span>${p.tech}</span></figcaption></figure>`
        )
        .join("")}
    </div>
    <div class="works-foot">
      <p class="strip-hint"><span aria-hidden="true">←</span> ${h.works.hint} <span aria-hidden="true">→</span></p>
      <a class="skip-works" href="#get">${h.works.skip} <span aria-hidden="true">↓</span></a>
    </div>
    ${hasExamples ? `<p class="works-note">${h.works.note}</p>` : ""}
  </div>
</section>`;

  const get = `<section class="section section--espresso" id="get" aria-labelledby="get-title">
  <div class="container">
    <h2 class="section-title reveal" id="get-title">${h.get.title}</h2>
    <ul class="get-list">
      ${h.get.items.map((i) => `<li class="get-item reveal">${tick}<h3>${i.t}</h3><p>${i.d}</p></li>`).join("")}
    </ul>
  </div>
</section>`;

  const how = `<section class="section section--cream" id="how" aria-labelledby="how-title">
  <div class="container">
    <h2 class="section-title reveal" id="how-title">${h.how.title}</h2>
    <ol class="how-steps">
      ${h.how.steps.map((s) => `<li class="how-step reveal"><h3>${s.t}</h3><p>${s.d}</p></li>`).join("")}
    </ol>
    <p class="how-note reveal">${h.how.note}</p>
  </div>
</section>`;

  const more = `<section class="section section--dark" id="more" aria-labelledby="more-title">
  <div class="container">
    <h2 class="section-title reveal" id="more-title">${h.more.title}</h2>
    <div class="more-grid">
      ${h.more.items.map((i) => `<article class="more-card reveal"><h3>${i.t}</h3><p>${i.d}</p></article>`).join("")}
    </div>
  </div>
</section>`;

  const photo = site.owner.photo
    ? `<img src="${esc(ctx.file(site.owner.photo))}" alt="${esc(h.about.photoAlt)}" width="600" height="600" loading="lazy" decoding="async">`
    : symbol({ size: 96 });
  const about = `<section class="section section--cream" id="about" aria-labelledby="about-title">
  <div class="container about">
    <div class="about-photo">${photo}</div>
    <div class="about-text">
      <h2 class="section-title" id="about-title">${h.about.title}</h2>
      ${h.about.lines.map((l, i) => `<p class="${i === 0 ? "about-name" : "about-line"}">${l}</p>`).join("")}
      <ul class="stats">${h.about.stats.map((s) => `<li class="stat"><b>${s.b}</b><span>${s.t}</span></li>`).join("")}</ul>
      <p class="about-write">${h.about.write}</p>
      <div class="social-row">${socialButtons(ctx, [["telegram", "Telegram"], ["instagram", "Instagram"], ...(site.social.tiktok ? [["tiktok", "TikTok"]] : [])])}</div>
    </div>
  </div>
</section>`;

  const faq = `<section class="section section--sand" id="faq" aria-labelledby="faq-title">
  <div class="container container-narrow">
    <h2 class="section-title reveal" id="faq-title">${h.faq.title}</h2>
    <div class="reveal">${details(h.faq.items)}</div>
  </div>
</section>`;

  const ct = h.contact;
  const icons = {
    telegram: `<svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21 4 3 11.2l5.6 2L10.8 20l3.2-3.9 4.6 3.4L21 4Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="m8.6 13.2 9-6.4-6.8 8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
    instagram: `<svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="17" cy="7" r="1.1" fill="currentColor"/></svg>`,
    tiktok: `<svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.4 2.6 2 4.2 5 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  };
  const channels = ct.channels
    .filter((ch) => ch.kind !== "tiktok" || site.social.tiktok)
    .map((ch) => {
      const l = socialLink(ctx, ch.kind);
      return `<a class="channel${ch.main ? " channel-main" : ""}" href="${esc(l.href)}"${l.external ? ' target="_blank" rel="noopener"' : ""}>
      <span class="channel-icon">${icons[ch.kind]}</span>
      <span class="channel-text"><strong>${ch.name}</strong><span>${ch.note}</span></span>
      <svg class="btn-arrow" width="18" height="18" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </a>`;
    })
    .join("");

  const contact = `<section class="section section--dark final-cta" id="contact" aria-labelledby="contact-title" data-contact>
  <div class="container contact-box">
    <h2 class="section-title" id="contact-title">${ct.title}</h2>
    <p class="lead">${ct.lead}</p>
    <div class="channels">${channels}</div>
    <ul class="contact-points">${ct.points.map((x) => `<li>${x}</li>`).join("")}</ul>
  </div>
</section>`;

  const dock = `<div class="dock" data-dock>
  ${btn({ href: tg.href, label: tgLabel, external: tg.external })}
  ${btn({ href: socialLink(ctx, "instagram").href, label: "Instagram", variant: "ghost", external: socialLink(ctx, "instagram").external, icon: "" })}
</div>`;

  const jsonld = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: h.faq.items.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return {
    title: h.meta.title,
    description: h.meta.description,
    main: hero + works + get + how + more + about + faq + contact + dock,
    jsonld,
  };
}
