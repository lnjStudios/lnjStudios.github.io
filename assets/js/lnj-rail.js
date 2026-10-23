// Right-hand rail (layouts/partials/rail.html): back-to-top appears once the page is scrolled,
// the Categories / Share drawers open in place (one at a time), and the Share drawer's copy buttons.
(() => {
    const rail = document.querySelector('.lnj-rail');
    if (!rail) return;

    // back to top: only when there's something above to go back to
    const top = rail.querySelector('.lnj-totop');
    if (top) {
        let ticking = false;
        const update = () => {
            top.classList.toggle('is-shown', window.scrollY > window.innerHeight * 0.5);
            ticking = false;
        };
        window.addEventListener('scroll', () => {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }, { passive: true });
        update();
        top.addEventListener('click', (e) => {
            e.preventDefault();
            const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
        });
    }

    // drawers (Categories, Share): the toggle opens its drawer in place, under the button; CSS animates the
    // height (grid rows 0fr -> 1fr) and spins the icon into an x. One open at a time; outside click / Esc
    // close. Closed drawers are inert (out of the tab order); the contents are clipped while they slide and
    // un-clipped once open (.is-settled) so the pills' hover glow shows.
    const pops = [...rail.querySelectorAll('.lnj-pop')];
    const toggleOf = (pop) => pop.querySelector('.lnj-pop__toggle');
    const drawerOf = (pop) => pop.querySelector('.lnj-drawer');

    function setOpen(pop, open) {
        if (pop.classList.contains('is-open') === open) return;
        pop.classList.toggle('is-open', open);
        pop.classList.remove('is-settled');
        toggleOf(pop).setAttribute('aria-expanded', String(open));
        drawerOf(pop).inert = !open;
    }

    pops.forEach((pop) => {
        toggleOf(pop).addEventListener('click', () => {
            const open = !pop.classList.contains('is-open');
            pops.forEach((other) => setOpen(other, other === pop && open));
        });
        drawerOf(pop).addEventListener('transitionend', (e) => {
            if (e.target === e.currentTarget && pop.classList.contains('is-open')) pop.classList.add('is-settled');
        });
    });
    document.addEventListener('pointerdown', (e) => {
        pops.forEach((pop) => { if (!pop.contains(e.target)) setOpen(pop, false); });
    });
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        pops.filter((pop) => pop.classList.contains('is-open')).forEach((pop) => {
            setOpen(pop, false);
            toggleOf(pop).focus();
        });
    });

    // share panel
    const share = rail.querySelector('.lnj-share');
    if (!share) return;
    // absolute even when the page was built with a relative baseURL (hugo server --baseURL / on a phone)
    const url = new URL(share.querySelector('[data-url]').dataset.url, window.location.href).href;

    function flash(button, text) {
        clearTimeout(button.lnjTimer);
        button.dataset.label ??= button.textContent;
        button.textContent = text;
        button.lnjTimer = setTimeout(() => { button.textContent = button.dataset.label; }, 1600);
    }

    share.querySelectorAll('[data-copy]').forEach((button) => button.addEventListener('click', async () => {
        try {
            if (button.dataset.copy === 'link') {
                await navigator.clipboard.writeText(url);
            } else {
                const blob = await (await fetch(share.querySelector('.lnj-share__qr').src)).blob();
                await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
            }
            flash(button, 'Copied');
        } catch (e) {
            flash(button, 'Couldn’t copy');
        }
    }));
})();

// Every page but home: floating buttons get out of the way while reading. Scrolling down hides them, a small
// scroll up (or being near the top) brings them back. Not while Settings is open or the search has focus.
// CSS: body.lnj-chrome-hidden. Phones / tablets (one column) hide the page tools, the rail and the gear +
// search; wide screens only the page tools, and not while their Contents drawer is open (it follows the
// section being read).
(() => {
    if (document.getElementById('home')) return;
    const mobile = window.matchMedia('(max-width: 1152px)');
    const SHOW_NEAR_TOP = 80;
    const SHOW_AFTER_UP = 24;
    let lastY = window.scrollY;
    let upBy = 0;
    let ticking = false;

    const busy = () => document.getElementById('has-a11y')?.open
        || document.activeElement?.closest('.lnj-search')
        || (!mobile.matches && document.querySelector('.lnj-tools .lnj-toc.is-open'));

    function update() {
        ticking = false;
        const y = window.scrollY;
        const dy = y - lastY;
        lastY = y;
        let hide = document.body.classList.contains('lnj-chrome-hidden');
        if (y < SHOW_NEAR_TOP || busy()) {
            hide = false;
        } else if (dy > 2) {
            hide = true;
            upBy = 0;
        } else if (dy < 0) {
            upBy -= dy;
            if (upBy > SHOW_AFTER_UP) hide = false;
        }
        document.body.classList.toggle('lnj-chrome-hidden', hide);
    }

    window.addEventListener('scroll', () => {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    mobile.addEventListener('change', update);
})();
