// Мінімум JavaScript: тінь шапки, поява блоків, стрічка робіт, нижня панель.
// Сайт читається і без нього.
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Шапка: лінія під нею після прокрутки
  var header = document.querySelector('[data-header]');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // --- Поява блоків
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
      reveals.forEach(function (el) { io.observe(el); });
    }
  }

  // --- Стрічка робіт: стрілки на комп'ютері, свайп на телефоні працює сам
  var strip = document.querySelector('[data-strip]');
  if (strip) {
    var prev = document.querySelector('[data-strip-prev]');
    var next = document.querySelector('[data-strip-next]');
    var step = function () {
      var s = strip.querySelector('.slide');
      return s ? s.getBoundingClientRect().width + 14 : 300;
    };
    var sync = function () {
      if (!prev || !next) return;
      prev.disabled = strip.scrollLeft < 4;
      next.disabled = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 4;
    };
    var go = function (dir) { strip.scrollBy({ left: dir * step() * 2, behavior: reduce ? 'auto' : 'smooth' }); };
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    strip.addEventListener('scroll', sync, { passive: true });
    strip.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
    sync();
  }

  // --- Нижня панель: ховаємо, коли видно блок зв'язку
  var dock = document.querySelector('[data-dock]');
  var contact = document.querySelector('[data-contact]');
  if (dock && contact && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      dock.classList.toggle('is-hidden', entries[0].isIntersecting);
    }, { threshold: 0.15 }).observe(contact);
  }
})();
