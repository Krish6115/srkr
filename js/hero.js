/* ============================================================
   HERO.JS – Decode/Scramble Animation + Neural Network Particles
   ============================================================ */

// ── Charset for scramble effect ───────────────────────────────
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*<>/{}[]|';

function getRandomChar() {
    return CHARS.charAt(Math.floor(Math.random() * CHARS.length));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Decode a string into an element (scramble → reveal) — DOM-safe —
async function decodeText(element, finalString, opts = {}) {
    const { cyclesPerChar = 5, charDelay = 42, spaceDelay = 55 } = opts;

    // Clear element and build a container for settled chars + a live cursor span
    element.textContent = '';
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    element.appendChild(cursor);

    // One span per settled character (textContent-safe, no innerHTML parsing)
    const settledSpans = [];

    // The single "active" scramble span reused each cycle
    const scrambleSpan = document.createElement('span');
    scrambleSpan.style.cssText = 'color:#39ff14;opacity:0.85;';

    for (let i = 0; i < finalString.length; i++) {
        const target = finalString[i];

        if (target === ' ') {
            // Settled space
            const sp = document.createElement('span');
            sp.textContent = '\u00a0'; // non-breaking space so it renders
            settledSpans.push(sp);
            element.insertBefore(sp, cursor);
            await sleep(spaceDelay);
            continue;
        }

        // Insert scramble span before cursor
        element.insertBefore(scrambleSpan, cursor);

        // Scramble cycles
        for (let c = 0; c < cyclesPerChar; c++) {
            scrambleSpan.textContent = CHARS.charAt(Math.floor(Math.random() * CHARS.length));
            await sleep(charDelay);
        }

        // Remove scramble span and replace with settled span
        element.removeChild(scrambleSpan);
        const settled = document.createElement('span');
        settled.textContent = target;
        element.insertBefore(settled, cursor);
        settledSpans.push(settled);
        await sleep(10);
    }

    // Remove cursor when done — no lingering block
    cursor.remove();
}

// ── Typewriter role loop (runs after the decode finishes) ─────
const roles = [
    'Full-Stack Developer',
    'AI / ML Engineer',
    'Generative AI Builder',
    'Competitive Programmer',
    'Cloud Enthusiast'
];
let roleIndex = 0, charIndex = 0, isDeleting = false;
let typeEl;

function typeWriter() {
    if (!typeEl) return;
    const current = roles[roleIndex];
    if (isDeleting) {
        typeEl.textContent = current.slice(0, charIndex--);
    } else {
        typeEl.textContent = current.slice(0, charIndex++);
    }
    let delay = isDeleting ? 55 : 100;
    if (!isDeleting && charIndex === current.length + 1) {
        delay = 2000; isDeleting = true;
    } else if (isDeleting && charIndex === -1) {
        isDeleting = false; charIndex = 0;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 400;
    }
    setTimeout(typeWriter, delay);
}

// ── Main hero entrance sequence ────────────────────────────────
async function runHeroSequence() {
    const line1El = document.getElementById('hero-decode-line1');
    const line2El = document.getElementById('hero-decode-line2');
    typeEl = document.getElementById('typewriter-text');

    if (!line1El || !line2El) return;

    // Small initial pause for page load
    await sleep(400);

    // Show initial blinking cursor on line 1
    const initCursor = document.createElement('span');
    initCursor.className = 'typewriter-cursor';
    line1El.appendChild(initCursor);
    await sleep(1800);
    initCursor.remove();

    // Decode line 1 – name
    await decodeText(line1El, 'Siva Rama Krishna Reddy Padala', {
        cyclesPerChar: 6, charDelay: 36, spaceDelay: 48
    });

    // Brief pause then immediately decode line 2 (no gap cursor)
    await sleep(500);

    // Decode line 2 – handle hash tag
    await decodeText(line2El, '#Tech Enthusiast', {
        cyclesPerChar: 5, charDelay: 40, spaceDelay: 48
    });

    // Fade in the badge, tagline, and CTA
    await sleep(300);
    ['hero-cta-row', 'hero-tagline-wrap', 'hero-badge'].forEach((id, i) => {
        setTimeout(() => {
            const el = document.getElementById(id) || document.querySelector('.' + id);
            if (el) el.style.opacity = '1';
        }, i * 200);
    });

    // Start the role typewriter (runs in the tagline area)
    await sleep(600);
    typeWriter();
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    runHeroSequence();
});

