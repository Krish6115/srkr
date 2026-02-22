/* ============================================================
   MAIN.JS – Navigation + Global scroll effects
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll shrink ─────────────────────────────────
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ── Active nav link highlight on scroll ─────────────────
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => io.observe(s));

  // ── Smooth scroll for all internal links ─────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ── Reveal .section-label and .section-title ─────────────
  const revealEls = document.querySelectorAll('.section-label, .section-title');
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          e.target.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
          e.target.style.opacity    = '1';
          e.target.style.transform  = 'translateY(0)';
        }, i * 120);
        revealIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealIO.observe(el));

  // ── Counter card animations (About section) ──────────────
  const counterCards = document.querySelectorAll('.counter-card');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        e.target.style.opacity    = '1';
        e.target.style.transform  = 'translateY(0)';
        counterIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  counterCards.forEach(el => counterIO.observe(el));

});
