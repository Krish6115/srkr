/* ============================================================
   CAROUSEL.JS – Horizontal auto-playing drag carousel
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    const track = document.querySelector('.carousel-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    if (!track) return;

    const cardWidth = () => {
        const card = track.querySelector('.passion-card');
        return card ? card.offsetWidth + 24 : 364; // card width + gap
    };

    // Arrow nav
    nextBtn?.addEventListener('click', () => {
        track.scrollBy({ left: cardWidth(), behavior: 'smooth' });
    });
    prevBtn?.addEventListener('click', () => {
        track.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
    });

    // Drag to scroll
    let isDown = false, startX, scrollLeft;

    track.addEventListener('pointerdown', (e) => {
        isDown = true;
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
        track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointerup', () => { isDown = false; });
    track.addEventListener('pointercancel', () => { isDown = false; });
    track.addEventListener('pointermove', (e) => {
        if (!isDown) return;
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 1.4;
        track.scrollLeft = scrollLeft - walk;
    });

    // Auto-play: advance every 3.5s
    let autoTimer = setInterval(() => {
        const maxScroll = track.scrollWidth - track.clientWidth;
        if (track.scrollLeft >= maxScroll - 2) {
            track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            track.scrollBy({ left: cardWidth(), behavior: 'smooth' });
        }
    }, 3500);

    // Pause on hover/drag
    track.addEventListener('pointerenter', () => clearInterval(autoTimer));
    track.addEventListener('pointerleave', () => {
        autoTimer = setInterval(() => {
            const maxScroll = track.scrollWidth - track.clientWidth;
            if (track.scrollLeft >= maxScroll - 2) {
                track.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                track.scrollBy({ left: cardWidth(), behavior: 'smooth' });
            }
        }, 3500);
    });

});
