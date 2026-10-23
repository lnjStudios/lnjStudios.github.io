// "About this post" (layouts/partials/about-post.html), two copies: the card that ends the article (.lnj-meta--end,
// every screen) and, on wide screens, the sidebar (.lnj-meta--side) fixed in the left gutter.
// The sidebar slides in once the header (title, image, intro) has scrolled off the top, so it never repeats
// what's already on screen. When the end card comes up into view, the sidebar slides away as the card builds up
// (its rows rise in, the level bars charge): the panel leaves the side and lands at the end. Scrolling back up
// past the card reverses it. A post too short for the header to leave before the card arrives just has the card.
// Its × collapses it into a pill in the same corner (.lnj-meta-pill), which shows and hides by the same rules;
// the pill expands it again. Expanded by default; a collapse is remembered across posts (localStorage).
(() => {
    const end = document.querySelector('.lnj-meta--end');
    const side = document.querySelector('.lnj-meta--side');
    const pill = document.querySelector('.lnj-meta-pill');
    const header = document.querySelector('#main-article > header');
    if (!end || !header) return;
    const wide = matchMedia('(min-width: 1280px)');
    const KEY = 'lnj-meta-collapsed';
    let collapsed = false;
    try { collapsed = localStorage.getItem(KEY) === '1'; } catch { /* storage blocked: start expanded */ }
    let ticking = false;

    // armed: the card's rows wait hidden until it builds up (without this script they're simply shown)
    end.classList.add('lnj-meta--armed');

    const update = () => {
        ticking = false;
        const top = end.getBoundingClientRect().top;
        if (top < innerHeight - 48) end.classList.add('is-shown');
        // wide screens replay the hand-off each time; phones build the card once
        else if (wide.matches && top > innerHeight) end.classList.remove('is-shown');
        const room = wide.matches
            && header.getBoundingClientRect().bottom < 64
            && !end.classList.contains('is-shown');
        side?.classList.toggle('is-collapsed', collapsed);
        side?.classList.toggle('is-shown', room && !collapsed);
        pill?.classList.toggle('is-shown', room && collapsed);
    };
    const request = () => {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };

    const setCollapsed = (value) => {
        collapsed = value;
        try { localStorage.setItem(KEY, value ? '1' : '0'); } catch { /* not remembered, still works */ }
        pill?.setAttribute('aria-expanded', String(!value));
        update();
        // keep keyboard focus on the control that took the panel's place
        (value ? pill : side?.querySelector('.lnj-meta__close'))?.focus({ preventScroll: true });
    };
    side?.querySelector('.lnj-meta__close')?.addEventListener('click', () => setCollapsed(true));
    pill?.addEventListener('click', () => setCollapsed(false));
    pill?.setAttribute('aria-expanded', String(!collapsed));

    addEventListener('scroll', request, { passive: true });
    addEventListener('resize', request);
    wide.addEventListener('change', request);
    update();
})();
