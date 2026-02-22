/* ============================================================
   ABOUT.JS – Skills reveal + Counter animation
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── Skill items stagger fade-in ─────────────────────────
    const skillItems = document.querySelectorAll('.skill-item');
    const skillIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.skill-item');
                items.forEach((item, i) => {
                    setTimeout(() => item.classList.add('visible'), i * 60);
                });
                skillIO.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.skill-icons').forEach(el => skillIO.observe(el));

    // ── Skill category cards fade in ─────────────────────────
    const catIO = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 100);
                catIO.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.skill-category').forEach(el => catIO.observe(el));

    // ── Animated counter ─────────────────────────────────────
    function animateCounter(el, target, duration = 2000) {
        const start = performance.now();
        const prefix = '';
        const suffix = el.dataset.suffix || '';
        const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out quad
            const eased = 1 - (1 - progress) * (1 - progress);
            const current = Math.floor(eased * target);
            el.textContent = prefix + current + (progress === 1 ? suffix : '');
            if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    }

    const counterEls = document.querySelectorAll('[data-count]');
    const countIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count, 10);
                animateCounter(el, target, 1800);
                countIO.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counterEls.forEach(el => countIO.observe(el));

});
