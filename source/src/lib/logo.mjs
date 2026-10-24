// ЦЕНТРАЛЬНИЙ КОМПОНЕНТ ЛОГОТИПА. Змініть тут, і оновиться весь сайт.
// Символ "Layered D" (варіант A): повна D, сходинка у від'ємному просторі,
// нижня плита як "перший шар". Тимчасовий оригінальний знак; не перевірений як торгова марка.

export const SYMBOL_PATH =
  "M4 4H48A44 44 0 0 1 87.19 68H70V32H54V44H38V56H22V68H4ZM4 76H81.94A44 44 0 0 1 48 92H4Z";

export function symbol({ size = 32, className = "", title = "" } = {}) {
  const a11y = title ? `role="img" aria-label="${title}"` : `aria-hidden="true"`;
  return `<svg class="symbol ${className}" width="${size}" height="${size}" viewBox="0 0 96 96" ${a11y} focusable="false"><path fill="currentColor" d="${SYMBOL_PATH}"/></svg>`;
}

// Іконка для favicon та web-app: символ у бронзі на obsidian
export function iconSvg({ maskable = false } = {}) {
  const pad = maskable ? 0 : 0;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="${maskable ? 0 : 20}" fill="#171513" transform="translate(${pad} ${pad})"/><g transform="translate(14.4 14.4) scale(.7)"><path fill="#C18A5A" d="${SYMBOL_PATH}"/></g></svg>`;
}
