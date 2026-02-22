/* ============================================================
   TIMELINE.JS – Scroll-drawn timeline + card reveals
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    const progressLine = document.getElementById('timeline-progress');
    const wrapper = document.querySelector('.timeline-wrapper');

    if (!progressLine || !wrapper) return;

    // Set total path length
    const lineLength = progressLine.getTotalLength ? progressLine.getTotalLength() : 1000;
    progressLine.style.strokeDasharray = lineLength;
    progressLine.style.strokeDashoffset = lineLength;

    // Draw line on scroll
    function updateTimeline() {
        const rect = wrapper.getBoundingClientRect();
        const winH = window.innerHeight;
        // How far we've scrolled into the wrapper (0 → 1)
        const start = winH * 0.8;
        const end = -rect.height;
        const raw = (start - rect.top) / (start - end);
        const ratio = Math.max(0, Math.min(1, raw));
        progressLine.style.strokeDashoffset = lineLength * (1 - ratio);
    }

    window.addEventListener('scroll', updateTimeline, { passive: true });
    updateTimeline();

    // ── Entry cards ─────────────────────────────────────────
    const entries = document.querySelectorAll('.timeline-entry');
    const entryIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entryIO.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    entries.forEach(el => entryIO.observe(el));

});
