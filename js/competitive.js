/* ============================================================
   COMPETITIVE.JS – VanillaTilt + Flip cards + Hackathon reveals
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── Hackathon card reveals ────────────────────────────────
    const hCards = document.querySelectorAll('.hackathon-card');
    const hIO = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 100);
                hIO.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    hCards.forEach(el => hIO.observe(el));

    // ── Cert flip card reveals ────────────────────────────────
    const certCards = document.querySelectorAll('.cert-flip-card');
    const certIO = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 120);
                certIO.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    certCards.forEach(el => certIO.observe(el));

    // ── Cert flip on click (toggle) ───────────────────────────
    certCards.forEach(card => {
        card.addEventListener('click', () => card.classList.toggle('flipped'));
    });

    // ── VanillaTilt on hackathon cards ────────────────────────
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('.hackathon-card'), {
            max: 12,
            speed: 400,
            glare: true,
            'max-glare': 0.08,
            perspective: 800
        });
    }

});
