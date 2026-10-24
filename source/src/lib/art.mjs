// Оригінальні "шарові" ілюстрації для концепт-проєктів.
// Кожен об'єкт складається з горизонтальних шарів, як у реальному друці.
// Це абстрактні візуалізації, а не фотографії робіт.

const PI = Math.PI;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

// t: 0 (верх) -> 1 (низ). Повертає сегменти шару: c = центр, w = ширина (частки ширини 360).
export const profiles = {
  creature(t) {
    if (t < 0.13) return [{ c: -0.2, w: 0.11 }, { c: 0.2, w: 0.11 }];
    if (t < 0.34) return [{ c: 0, w: 0.36 + (t - 0.13) * 1.0 }];
    if (t < 0.4) return [{ c: 0, w: 0.34 }];
    if (t < 0.84) return [{ c: 0, w: 0.5 + 0.35 * Math.sin(((t - 0.4) / 0.44) * PI * 0.9) }];
    return [{ c: -0.2, w: 0.2 }, { c: 0.2, w: 0.2 }];
  },
  knight(t) {
    if (t < 0.04) return [{ c: 0, w: 0.06 }];
    if (t < 0.14) return [{ c: 0, w: 0.2 }];
    if (t < 0.2) return [{ c: 0, w: 0.14 }];
    if (t < 0.3) return [{ c: 0, w: 0.5 }];
    if (t < 0.6) {
      const body = { c: 0.04, w: 0.46 - 0.2 * ((t - 0.3) / 0.3) };
      return t > 0.34 ? [{ c: -0.31, w: 0.16 }, body] : [body];
    }
    if (t < 0.9) return [{ c: -0.09, w: 0.14 }, { c: 0.09, w: 0.14 }];
    return [{ c: 0, w: 0.66 }];
  },
  organizer(t) {
    if (t >= 0.9) return [{ c: 0, w: 0.94 }];
    const cols = [{ c: -0.3, top: 0.12 }, { c: 0, top: 0.36 }, { c: 0.3, top: 0.58 }];
    return cols.filter((k) => t >= k.top).map((k) => ({ c: k.c, w: 0.26 }));
  },
  enclosure(t) {
    if (t >= 0.46 && t < 0.5) return [];
    if (t >= 0.2 && t < 0.34) return [{ c: -0.22, w: 0.3 }, { c: 0.22, w: 0.3 }];
    if (t >= 0.8 && t < 0.86) return [{ c: -0.3, w: 0.2 }, { c: 0.3, w: 0.2 }];
    return [{ c: 0, w: 0.8 }];
  },
  ergonomic(t) {
    return [{ c: 0.18 * Math.sin(t * PI * 1.2) - 0.05, w: 0.26 + 0.2 * Math.sin(t * PI) }];
  },
  architecture(t) {
    if (t < 0.12) return [{ c: 0, w: 0.1 }];
    const idx = Math.min(4, Math.floor(((t - 0.12) / 0.88) * 5));
    return [{ c: 0, w: [0.28, 0.4, 0.52, 0.64, 0.78][idx] }];
  },
  vase(t) {
    return [{ c: 0, w: 0.26 + 0.32 * Math.abs(Math.sin(t * PI * 1.15 + 0.3)) }];
  },
  bracket(t) {
    if (t < 0.74) return [{ c: -0.27, w: 0.24 }];
    if (t >= 0.8 && t < 0.92) return [{ c: -0.16, w: 0.46 }, { c: 0.28, w: 0.22 }];
    return [{ c: 0, w: 0.78 }];
  },
  prototype(t) {
    if (t < 0.46) return [{ c: 0, w: 0.52 }];
    if (t < 0.54) return [{ c: 0, w: 0.36 }];
    return [{ c: 0, w: 0.66 }];
  },
  series(t) {
    const cols = [{ c: -0.31, top: 0.1 }, { c: 0, top: 0.3 }, { c: 0.31, top: 0.2 }];
    if (t >= 0.94) return [];
    return cols
      .filter((k) => t >= k.top)
      .map((k) => {
        const u = clamp((t - k.top) / (0.94 - k.top), 0, 1);
        return { c: k.c, w: 0.12 + 0.14 * Math.abs(Math.sin(u * PI * 0.9 + 0.15)) };
      });
  },
};

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, k) => {
  const A = hex(a);
  const B = hex(b);
  return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, "0")).join("");
};

const themes = {
  dark: { from: "#D5A579", to: "#7a4e2b", ghost: "#433a32" },
  light: { from: "#C18A5A", to: "#6B4426", ghost: "#cfc3b3" },
};

/**
 * @param {object} o
 * @param {keyof typeof profiles} o.profile
 * @param {number} [o.layers]
 * @param {'solid'|'outline'|'duotone'|'exploded'} [o.mode]
 * @param {'dark'|'light'} [o.theme]
 * @param {boolean} [o.animate]
 * @param {string} [o.label]  альтернативний текст; без нього зображення декоративне
 */
export function art({ profile, layers = 22, mode = "solid", theme = "dark", animate = false, label = "" }) {
  const fn = profiles[profile] || profiles.vase;
  const th = themes[theme] || themes.dark;
  const W = 360;
  const top = 20;
  const total = 360;
  const step = total / layers;
  const barH = step * (mode === "exploded" ? 0.58 : 0.74);
  const rects = [];
  for (let i = 0; i < layers; i++) {
    const t = (i + 0.5) / layers;
    const y = top + i * step + (step - barH) / 2;
    const k = i / Math.max(1, layers - 1);
    let fill = mix(th.from, th.to, k);
    if (mode === "duotone") fill = i % 2 ? th.to : th.from;
    const dx = mode === "exploded" ? (i % 2 ? 7 : -7) : 0;
    fn(t).forEach((s) => {
      const w = Math.max(4, s.w * W);
      const x = 200 + s.c * W - w / 2 + dx;
      const rx = Math.min(barH / 2, w / 2);
      const style = animate ? ` style="--i:${layers - 1 - i}"` : "";
      const cls = animate ? ' class="layer"' : "";
      const paint = mode === "outline" ? `fill="none" stroke="${fill}" stroke-width="1.6"` : `fill="${fill}"`;
      rects.push(
        `<rect${cls}${style} x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${barH.toFixed(1)}" rx="${rx.toFixed(1)}" ${paint}/>`
      );
    });
  }
  const ghost =
    profile === "prototype"
      ? `<rect x="104" y="30" width="206" height="340" rx="14" fill="none" stroke="${th.ghost}" stroke-width="1.6" stroke-dasharray="6 6"/>`
      : "";
  const a11y = label ? `role="img" aria-label="${label}"` : `aria-hidden="true"`;
  return `<svg class="art" viewBox="0 0 400 400" ${a11y} focusable="false">${ghost}${rects.join("")}</svg>`;
}
