/* ============================================================
   PROJECTS.JS – Scroll-triggered project block reveals
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── Project block reveal ─────────────────────────────────
    const blocks = document.querySelectorAll('.project-block');
    const blockIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                blockIO.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    blocks.forEach(b => blockIO.observe(b));

});
