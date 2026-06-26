/* =====================================================================
   Камилла Тимошенко — интерактив лендинга
   Без зависимостей. Прогрессивное улучшение.
   ===================================================================== */
(function () {
  'use strict';

  var doc = document;
  var body = doc.body;

  /* ----------------------- Sticky header shadow --------------------- */
  var header = doc.querySelector('.header');
  var fab = doc.querySelector('.fab-bar');
  var toTop = doc.querySelector('.to-top');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (toTop) toTop.classList.toggle('is-visible', y > 600);
    // Плавающую CTA показываем после первого экрана
    if (fab) fab.classList.toggle('is-visible', y > 560);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------- Mobile menu ---------------------------- */
  var burger = doc.querySelector('.burger');
  var menu = doc.querySelector('.mobile-menu');

  function closeMenu() { body.classList.remove('menu-open'); if (burger) burger.setAttribute('aria-expanded', 'false'); }
  function toggleMenu() {
    var open = body.classList.toggle('menu-open');
    if (burger) burger.setAttribute('aria-expanded', String(open));
  }
  if (burger) burger.addEventListener('click', toggleMenu);
  if (menu) {
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });
  }
  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* --------------------- Smooth scroll (anchors) -------------------- */
  doc.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id.length < 2) return;
      var target = doc.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      var top = target.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top: top, behavior: 'smooth' });
      history.replaceState(null, '', id);
    });
  });

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----------------------------- FAQ -------------------------------- */
  doc.querySelectorAll('.faq__item').forEach(function (item) {
    var q = item.querySelector('.faq__q');
    var a = item.querySelector('.faq__a');
    if (!q || !a) return;
    q.setAttribute('aria-expanded', 'false');
    q.addEventListener('click', function () {
      var open = item.classList.toggle('is-open');
      q.setAttribute('aria-expanded', String(open));
      a.style.maxHeight = open ? a.scrollHeight + 'px' : '0px';
    });
  });
  // Пересчёт высоты открытых ответов при ресайзе
  window.addEventListener('resize', function () {
    doc.querySelectorAll('.faq__item.is-open .faq__a').forEach(function (a) {
      a.style.maxHeight = a.scrollHeight + 'px';
    });
  });

  /* ------------------- Reveal on scroll (IO) ------------------------ */
  var reveals = doc.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* --------------------------- Form --------------------------------- */
  var form = doc.querySelector('#zayavka-form');
  if (form) {
    var success = doc.querySelector('.form-success');

    function setError(field, on, msg) {
      var input = field.querySelector('input, textarea');
      var err = field.querySelector('.err');
      if (input) input.setAttribute('aria-invalid', on ? 'true' : 'false');
      if (err) { err.classList.toggle('show', on); if (msg) err.textContent = msg; }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot — если заполнено, тихо игнорируем (бот)
      var hp = form.querySelector('[name="company"]');
      if (hp && hp.value) return;

      var valid = true;
      var nameField = form.querySelector('.field--name');
      var contactField = form.querySelector('.field--contact');
      var consent = form.querySelector('#consent');

      var name = nameField.querySelector('input').value.trim();
      var contact = contactField.querySelector('input').value.trim();

      if (name.length < 2) { setError(nameField, true, 'Пожалуйста, напишите ваше имя'); valid = false; }
      else setError(nameField, false);

      if (contact.length < 3) { setError(contactField, true, 'Укажите Telegram или телефон для связи'); valid = false; }
      else setError(contactField, false);

      var consentErr = doc.querySelector('#consent-err');
      if (consent && !consent.checked) { if (consentErr) consentErr.classList.add('show'); valid = false; }
      else if (consentErr) consentErr.classList.remove('show');

      if (!valid) {
        var firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // TODO (бэкенд заказчика): отправка на почту / в Telegram-бота.
      // Заглушка: имитация успешной отправки + цель Метрики.
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Отправляем…'; }

      // Здесь будет реальный fetch на эндпоинт заказчика.
      window.setTimeout(function () {
        if (typeof window.ym === 'function' && window.YM_ID) {
          window.ym(window.YM_ID, 'reachGoal', 'form_submit');
        }
        form.style.display = 'none';
        if (success) success.classList.add('show');
        success && success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 600);
    });

    // Снимаем ошибку при вводе
    form.querySelectorAll('input, textarea').forEach(function (el) {
      el.addEventListener('input', function () {
        var f = el.closest('.field');
        if (f) setError(f, false);
      });
    });
  }

  /* ----------- Цель Метрики на клики по Telegram-кнопкам ------------ */
  doc.querySelectorAll('a[href*="t.me/"]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (typeof window.ym === 'function' && window.YM_ID) {
        window.ym(window.YM_ID, 'reachGoal', 'telegram_click');
      }
    });
  });

  /* ------------------ Год в футере ---------------------------------- */
  var yearEl = doc.querySelector('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
