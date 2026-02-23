/* ============================================================
   THEME TOGGLE — Dark ↔ Light mode
   is-on  = dark mode  (🌙 moon,  jelly pressed)
   is-off = light mode (☀️ sun,   jelly raised)
   ============================================================ */
(function () {
    'use strict';

    const btn = document.getElementById('theme-toggle');

    /* Default: dark mode → button is-on with moon */
    function applyDark() {
        document.body.classList.remove('light-mode');
        btn.classList.add('is-on');
        btn.textContent = '🌙';
        btn.setAttribute('aria-label', 'Switch to Light Mode');
        localStorage.setItem('theme', 'dark');
    }

    function applyLight() {
        document.body.classList.add('light-mode');
        btn.classList.remove('is-on');
        btn.textContent = '☀️';
        btn.setAttribute('aria-label', 'Switch to Dark Mode');
        localStorage.setItem('theme', 'light');
    }

    /* Restore saved preference (default = dark) */
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
        applyLight();
    } else {
        applyDark();
    }

    btn.addEventListener('click', () => {
        if (document.body.classList.contains('light-mode')) {
            applyDark();
        } else {
            applyLight();
        }
    });
})();
