/* ============================================================
   SPIDER CURSOR — Vanilla JS port of 21st.dev/minhxthanh
   Matrix green color scheme, transparent overlay (no bg)
   Performance-tuned: 150 pts, 40-step line, single rAF loop
   ============================================================ */

(function () {
    'use strict';

    /* ── Canvas overlay (fixed, non-interactive, above everything) ── */
    const canvas = document.createElement('canvas');
    canvas.id = 'spider-canvas';
    canvas.style.cssText =
        'position:fixed;top:0;left:0;width:100%;height:100%;' +
        'pointer-events:none;z-index:9998;';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const { sin, cos, PI, hypot, min, max } = Math;
    let w = 0, h = 0;

    /* ── Colors (matrix green palette) ── */
    const COL_STROKE = 'rgba(57,255,20,0.55)';
    const COL_FILL = 'rgba(57,255,20,0.8)';

    /* ── Helpers ── */
    function rnd(x = 1, dx = 0) { return Math.random() * x + dx; }
    function lerp(a, b, t) { return a + (b - a) * t; }
    function many(n, f) { return [...Array(n)].map((_, i) => f(i)); }

    function noise(x, y, t = 101) {
        const w0 = sin(0.3 * x + 1.4 * t + 2.0 + 2.5 * sin(0.4 * y - 1.3 * t + 1.0));
        const w1 = sin(0.2 * y + 1.5 * t + 2.8 + 2.3 * sin(0.5 * x - 1.2 * t + 0.5));
        return w0 + w1;
    }

    function drawCircle(x, y, r) {
        ctx.beginPath();
        ctx.ellipse(x, y, r, r, 0, 0, PI * 2);
        ctx.fill();
    }

    /* drawLine with subtle noise — 40 steps instead of 100 for perf */
    function drawLine(x0, y0, x1, y1) {
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        for (let i = 1; i <= 40; i++) {
            const t = i / 40;
            const x = lerp(x0, x1, t);
            const y = lerp(y0, y1, t);
            const k = noise(x / 5 + x0, y / 5 + y0) * 2;
            ctx.lineTo(x + k, y + k);
        }
        ctx.stroke();
    }

    /* ── Spawn one spider ── */
    function spawn() {
        /* 150 ambient dots (was 333 — halved for performance) */
        const pts = many(300, () => ({
            x: rnd(window.innerWidth),
            y: rnd(window.innerHeight),
            len: 0,
            r: 0,
        }));

        /* 8 leg-tip anchors arranged in a circle */
        const legTips = many(8, (i) => ({
            x: cos((i / 8) * PI * 2),
            y: sin((i / 8) * PI * 2),
        }));

        const seed = rnd(100);
        let tx = rnd(window.innerWidth);
        let ty = rnd(window.innerHeight);
        let x = tx;
        let y = ty;
        const kx = rnd(0.5, 0.5);
        const ky = rnd(0.5, 0.5);
        const walkX = rnd(50, 50);
        const walkY = rnd(50, 50);
        const bodyR = window.innerWidth / rnd(100, 150);

        function paintDot(dot) {
            legTips.forEach((tip) => {
                if (!dot.len) return;
                drawLine(
                    lerp(x + tip.x * bodyR, dot.x, dot.len * dot.len),
                    lerp(y + tip.y * bodyR, dot.y, dot.len * dot.len),
                    x + tip.x * bodyR,
                    y + tip.y * bodyR
                );
            });
            drawCircle(dot.x, dot.y, dot.r);
        }

        return {
            follow(fx, fy) { tx = fx; ty = fy; },

            tick(t) {
                const fx = tx + cos(t * kx + seed) * walkX;
                const fy = ty + sin(t * ky + seed) * walkY;
                x += min(window.innerWidth / 100, (fx - x) / 10);
                y += min(window.innerHeight / 100, (fy - y) / 10);

                let activeCount = 0;
                pts.forEach((dot) => {
                    const dx = dot.x - x;
                    const dy = dot.y - y;
                    const len = hypot(dx, dy);
                    let r = min(2, window.innerWidth / len / 5);

                    const near = len < window.innerWidth / 22 && activeCount < 8;
                    const dir = near ? 0.1 : -0.1;
                    if (near) { r *= 1.5; activeCount++; }

                    dot.r = r;
                    dot.len = max(0, min(dot.len + dir, 1));
                    paintDot(dot);
                });

                /* Draw body circle */
                drawCircle(x, y, bodyR * 0.8);
            },
        };
    }

    /* ── One spider ── */
    const spiders = many(1, spawn);

    /* ── Track pointer globally, including during scroll ── */
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    /* ── Food dot — follows cursor much faster than spider ── */
    let foodX = window.innerWidth / 2;
    let foodY = window.innerHeight / 2;

    window.addEventListener('pointermove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        spiders.forEach((s) => s.follow(mouseX, mouseY));
    }, { passive: true });

    /* ── Animation loop ── */
    function anim(ts) {
        /* Resize only when dimensions actually change */
        if (w !== window.innerWidth) w = canvas.width = window.innerWidth;
        if (h !== window.innerHeight) h = canvas.height = window.innerHeight;

        /* Clear transparent (no black fill — website shows through) */
        ctx.clearRect(0, 0, w, h);

        ctx.fillStyle = COL_FILL;
        ctx.strokeStyle = COL_STROKE;
        ctx.lineWidth = 0.9;

        const t = ts / 1000;
        spiders.forEach((s) => s.tick(t));

        /* ── Draw food dot (faster cursor follower) ── */
        foodX += (mouseX - foodX) / 3;
        foodY += (mouseY - foodY) / 3;

        /* Soft glow ring */
        ctx.beginPath();
        ctx.arc(foodX, foodY, 7, 0, PI * 2);
        ctx.fillStyle = 'rgba(57,255,20,0.08)';
        ctx.fill();

        /* Bright core dot */
        ctx.beginPath();
        ctx.arc(foodX, foodY, 3.5, 0, PI * 2);
        ctx.fillStyle = 'rgba(57,255,20,1)';
        ctx.fill();

        requestAnimationFrame(anim);
    }

    requestAnimationFrame(anim);
})();
