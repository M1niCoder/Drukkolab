// ЦЕНТРАЛІЗОВАНА КОНФІГУРАЦІЯ САЙТУ
// Усі бізнес-дані зібрано тут. Значення null означають "ще не налаштовано".

export const site = {
  brand: {
    name: "Drukkolab",
    legalName: null, // ЗАМІНИТИ: юридична назва/ФОП, якщо потрібно показувати
  },

  // ЗАМІНИТИ на ваш домен після підключення до Cloudflare Pages
  siteUrl: "https://your-domain.example",

  defaultLocale: "uk",
  locales: ["uk"], // щоб додати англійську: додайте "en" та папку src/content/en

  localeMeta: {
    uk: { htmlLang: "uk", ogLocale: "uk_UA" },
    en: { htmlLang: "en", ogLocale: "en_US" },
  },

  // Хто виконує замовлення. Для фото покладіть файл у public/photos/ і впишіть шлях,
  // наприклад "photos/artem.jpg" (квадратне, від 600x600). Поки null: показується знак-заглушка.
  owner: {
    name: "Артем",
    photo: null,
  },

  // Цифри з блоку "Про мене" та хука
  stats: {
    orders: "4000+",
    years: "4+",
  },

  // ЗАМІНИТИ на свої профілі (зараз тимчасові адреси-заглушки).
  // Якщо поставити null, кнопка веде до блоку "Напишіть мені".
  social: {
    telegram: "https://t.me/drukkolab",
    instagram: "https://instagram.com/drukkolab",
    tiktok: null, // за потреби: з'явиться в підвалі та блоку зв'язку
  },

  // true = сайт закритий від індексації (noindex + robots.txt Disallow).
  // Змініть на false, коли будете готові до публікації та пошуку в Google.
  noindex: true,

  analytics: {
    enabled: false,
    provider: null,
    id: null,
  },

  seo: {
    titleSeparator: " · ",
    ogImage: null,
  },
};
