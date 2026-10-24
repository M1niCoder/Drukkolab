import { btn } from "../lib/html.mjs";
import { symbol } from "../lib/logo.mjs";

export function render(ctx) {
  const n = ctx.home.notFound;
  return {
    title: n.title,
    description: n.lead,
    main: `<section class="section section--dark notfound"><div class="container notfound-inner">
      <div class="notfound-mark" aria-hidden="true">${symbol({ size: 120 })}</div>
      <p class="eyebrow">404</p>
      <h1>${n.title}</h1>
      <p class="lead">${n.lead}</p>
      <div class="cta-row">${btn({ href: ctx.url("/"), label: n.home })}</div>
    </div></section>`,
  };
}
