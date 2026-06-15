/* ============================================================
   FORMA — interakcje strony
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Rok w stopce --- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* --- Tło nawigacji po przewinięciu --- */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* --- Menu mobilne --- */
  const burger = document.getElementById('burger');
  const links = document.getElementById('navLinks');
  const toggleMenu = (open) => {
    burger.classList.toggle('open', open);
    links.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  burger.addEventListener('click', () => toggleMenu(!links.classList.contains('open')));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

  /* --- Pojawianie się elementów przy przewijaniu --- */
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  reveals.forEach(el => io.observe(el));

  /* --- Liczniki statystyk --- */
  const counters = document.querySelectorAll('.stat__num');
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 60));
      const tick = () => {
        current += step;
        if (current >= target) { el.textContent = target + '+'; }
        else { el.textContent = current; requestAnimationFrame(tick); }
      };
      tick();
      countIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(el => countIO.observe(el));

  /* --- Formularz kontaktowy (walidacja po stronie przeglądarki) --- */
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const message = (data.get('message') || '').toString().trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !emailOk || !message) {
      note.textContent = 'Uzupełnij poprawnie wszystkie pola formularza.';
      note.className = 'form__note err';
      return;
    }
    // Strona statyczna nie wysyła e-maili sama — otwieramy program pocztowy.
    const subject = encodeURIComponent('Zapytanie ze strony FORMA — ' + name);
    const body = encodeURIComponent(message + '\n\n—\n' + name + '\n' + email);
    window.location.href = `mailto:kontakt@forma-wnetrza.pl?subject=${subject}&body=${body}`;
    note.textContent = 'Dziękujemy! Otwieramy Twój program pocztowy, aby wysłać wiadomość.';
    note.className = 'form__note ok';
    form.reset();
  });
});
