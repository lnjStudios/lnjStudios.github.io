// Page tools (layouts/partials/page-tools.html), article pages, top right:
// Contents slides the table of contents open under it (a drawer like the rail's) and keeps it open (no
// outside-click close) until clicked again, highlighting the section being read; Reading mode drives brewm's
// own #useSR switch (hidden in Settings), so brewm still applies and remembers it; Print prints.
(() => {
    const tools = document.querySelector('.lnj-tools');
    if (!tools) return;

    // Contents
    const toc = tools.querySelector('.lnj-toc');
    if (toc) {
        const toggle = toc.querySelector('.lnj-pop__toggle');
        const panel = toc.querySelector('.lnj-drawer');
        toggle.addEventListener('click', () => {
            const open = !toc.classList.contains('is-open');
            toc.classList.toggle('is-open', open);
            toc.classList.remove('is-settled');
            toggle.setAttribute('aria-expanded', String(open));
            panel.inert = !open;
        });
        // clipped while it slides, un-clipped once open so the pills' hover glow shows (as in lnj-rail.js)
        panel.addEventListener('transitionend', (e) => {
            if (e.target === panel && toc.classList.contains('is-open')) toc.classList.add('is-settled');
        });

        // the current section: the last heading that has scrolled past the top third of the screen
        const links = [...panel.querySelectorAll('a[href^="#"]')];
        const targets = links.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))));
        let ticking = false;
        const spy = () => {
            ticking = false;
            const line = window.innerHeight / 3;
            let current = -1;
            targets.forEach((h, i) => { if (h && h.getBoundingClientRect().top <= line) current = i; });
            links.forEach((a, i) => a.classList.toggle('is-current', i === current));
        };
        window.addEventListener('scroll', () => {
            if (!ticking) { ticking = true; requestAnimationFrame(spy); }
        }, { passive: true });
        spy();
    }

    // Reading mode: mirror brewm's screen-reader switch, which brewm has already restored from localStorage
    const readingButton = tools.querySelector('.lnj-reading');
    const srSwitch = document.getElementById('useSR');
    if (readingButton && srSwitch) {
        const sync = () => readingButton.setAttribute('aria-pressed', String(srSwitch.checked));
        readingButton.hidden = false;
        readingButton.addEventListener('click', () => {
            srSwitch.click(); // runs brewm's handler; the click bubbles to Settings, which saves it
            sync();
        });
        sync();
    }

    tools.querySelector('.lnj-print')?.addEventListener('click', () => window.print());
})();
