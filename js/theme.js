/* ============================================================
   THEME TOGGLE — Dark ↔ Light mode (jelly button)
   ============================================================ */
(function () {
    'use strict';

    const btn = document.getElementById('theme-toggle');
    const icon = btn.querySelector('.jt-icon');
    const label = btn.querySelector('.jt-label');

    /* Restore saved preference */
    const saved = localStorage.getItem('theme');
    if (saved === 'light') applyLight();

    btn.addEventListener('click', () => {
        if (document.body.classList.contains('light-mode')) {
            applyDark();
            localStorage.setItem('theme', 'dark');
        } else {
            applyLight();
            localStorage.setItem('theme', 'light');
        }
    });

    function applyLight() {
        document.body.classList.add('light-mode');
        icon.textContent = '☀️';
        label.textContent = 'Dark';
    }

    function applyDark() {
        document.body.classList.remove('light-mode');
        icon.textContent = '🌙';
        label.textContent = 'Light';
    }
})();
