/* ============================================================
   TERMINAL.JS – Terminal typewriter simulation
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    const termWindow = document.querySelector('.terminal-window');
    const termBody = document.getElementById('term-body');
    if (!termWindow || !termBody) return;

    // Reveal terminal on scroll
    const termIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                termWindow.classList.add('visible');
                setTimeout(runTerminalSequence, 600);
                termIO.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    termIO.observe(termWindow);

    // ── Type a string into a DOM element char by char ────────
    function typeInto(el, text, speed = 55) {
        return new Promise(resolve => {
            let i = 0;
            const tid = setInterval(() => {
                el.textContent += text[i++];
                if (i >= text.length) { clearInterval(tid); resolve(); }
            }, speed);
        });
    }

    // ── Append a raw line to terminal body ───────────────────
    function appendLine(html, cls = '') {
        const div = document.createElement('div');
        div.className = cls;
        div.innerHTML = html;
        termBody.appendChild(div);
        termBody.scrollTop = termBody.scrollHeight;
        return div;
    }

    // ── Build a prompt line then type the command ─────────────
    async function promptAndType(cmd, speed = 55) {
        const line = appendLine(
            `<span class="term-prompt">krish</span>` +
            `<span class="term-host">@portfolio</span>` +
            `<span class="term-path"> ~/contact</span> ` +
            `<span class="term-cmd" id="cmd-target"></span>`,
            'term-line'
        );
        const cmdEl = line.querySelector('#cmd-target');
        await typeInto(cmdEl, cmd, speed);
    }

    async function runTerminalSequence() {

        // Clear body
        termBody.innerHTML = '';

        // Step 1: whoami
        await promptAndType('whoami', 65);
        await sleep(300);
        appendLine('<span class="term-output">siva.rama.krishna.reddy.padala</span>', 'term-output');

        // Step 2: ls contacts
        await sleep(500);
        await promptAndType('ls contacts/', 60);
        await sleep(300);
        appendLine('github  linkedin  email', 'term-output');

        // Step 3: open contacts
        await sleep(500);
        await promptAndType('open contacts/', 60);
        await sleep(300);

        appendLine(
            `<span class="term-key">github</span>` +
            `<a href="https://github.com/Krish6115" target="_blank" rel="noopener">` +
            `<i class="fab fa-github"></i> github.com/Krish6115</a>`,
            'term-output-line'
        );
        await sleep(200);
        appendLine(
            `<span class="term-key">linkedin</span>` +
            `<a href="https://www.linkedin.com/in/siva-rama-krishna-reddy-padala/" target="_blank" rel="noopener">` +
            `<i class="fab fa-linkedin"></i> siva-rama-krishna-reddy-padala</a>`,
            'term-output-line'
        );
        await sleep(200);
        appendLine(
            `<span class="term-key">email</span>` +
            `<a href="mailto:sivaramakrishnareddy6115@gmail.com">` +
            `<i class="fas fa-envelope"></i> sivaramakrishnareddy6115@gmail.com</a>`,
            'term-output-line'
        );

        // Step 4: idle prompt with cursor
        await sleep(600);
        const idleLine = appendLine(
            `<span class="term-prompt">krish</span>` +
            `<span class="term-host">@portfolio</span>` +
            `<span class="term-path"> ~/contact</span> ` +
            `<span class="term-cursor"></span>`,
            'term-line'
        );
    }

    const sleep = ms => new Promise(r => setTimeout(r, ms));

});
