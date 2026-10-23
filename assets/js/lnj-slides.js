// LnJ home carousel: autoplays while the pointer is away; hovering pauses it.
// Change slides with the mouse wheel / trackpad over the pane, dragging/swiping, or arrow keys when focused.
(() => {
    const root = document.querySelector('.lnj-slides');
    if (!root) return;
    const slides = [...root.querySelectorAll('.lnj-slide')];
    const dots = [...root.querySelectorAll('.lnj-slides__dots > span')];
    if (slides.length < 2) return;

    const interval = Number(root.dataset.interval) || 7000;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.style.setProperty('--lnj-interval', `${interval}ms`);

    let current = 0;
    let timer = null;
    let hovering = false;
    let focused = false;

    // dir > 0: the new slide comes in from the right and the old one leaves to the left; dir < 0: the reverse
    function show(index, dir = 1) {
        const next = (index + slides.length) % slides.length;
        const prev = current;
        current = next;
        slides.forEach((slide, i) => {
            const active = i === next;
            if (active && i !== prev) {
                // park the incoming slide on the side it enters from, without animating
                slide.classList.add('no-anim');
                slide.classList.remove('is-active', 'is-left');
                slide.classList.toggle('is-left', dir < 0);
                void slide.offsetWidth;
                slide.classList.remove('no-anim', 'is-left');
            } else if (i === prev && !active) {
                slide.classList.toggle('is-left', dir > 0);
            } else if (!active) {
                slide.classList.remove('is-left');
            }
            slide.classList.toggle('is-active', active);
            slide.toggleAttribute('aria-hidden', !active);
            slide.querySelectorAll('a').forEach((a) => (a.tabIndex = active ? 0 : -1));
        });
        dots.forEach((dot, i) => {
            dot.classList.remove('is-active');
            if (i === current) {
                void dot.offsetWidth; // restart the progress animation
                dot.classList.add('is-active');
            }
        });
        schedule();
    }

    function paused() {
        return reducedMotion || hovering || focused || document.hidden;
    }

    function schedule() {
        clearTimeout(timer);
        root.classList.toggle('is-paused', paused());
        if (!paused()) timer = setTimeout(() => show(current + 1), interval);
    }

    // hover / focus pause the autoplay
    root.addEventListener('pointerenter', (e) => {
        if (e.pointerType === 'mouse') { hovering = true; schedule(); }
    });
    root.addEventListener('pointerleave', (e) => {
        if (e.pointerType === 'mouse') { hovering = false; resetParallax(); schedule(); }
    });
    // only keyboard focus pauses; a mouse click on the panel shouldn't freeze it
    root.addEventListener('focusin', (e) => {
        if (e.target.matches(':focus-visible')) { focused = true; schedule(); }
    });
    root.addEventListener('focusout', (e) => {
        if (!root.contains(e.relatedTarget)) { focused = false; schedule(); }
    });
    document.addEventListener('visibilitychange', schedule);

    // keyboard
    root.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { show(current + 1, 1); e.preventDefault(); }
        if (e.key === 'ArrowLeft') { show(current - 1, -1); e.preventDefault(); }
    });

    // Wheel / trackpad over the pane changes slides (down or right = next) and never scrolls the page
    // behind it. Small trackpad deltas add up until they're worth one slide; then a short lock.
    // On narrow screens the slides sit in the page flow, so there the wheel just scrolls as usual.
    let wheelLock = 0;
    let wheelSum = 0;
    root.addEventListener('wheel', (e) => {
        if (getComputedStyle(root).position !== 'fixed') return;
        e.preventDefault();
        const now = Date.now();
        if (now < wheelLock) return;
        wheelSum += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        if (Math.abs(wheelSum) < 40) return;
        const dir = wheelSum > 0 ? 1 : -1;
        wheelSum = 0;
        wheelLock = now + 800;
        show(current + dir, dir);
    }, { passive: false });

    // drag (mouse) and swipe (touch)
    let startX = null;
    root.addEventListener('pointerdown', (e) => {
        if (e.target.closest('a') || e.button !== 0) return;
        startX = e.clientX;
    });
    root.addEventListener('pointerup', (e) => {
        if (startX === null) return;
        const dx = e.clientX - startX;
        startX = null;
        if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    });
    root.addEventListener('pointercancel', () => { startX = null; });
    root.addEventListener('dragstart', (e) => e.preventDefault());

    // dots
    dots.forEach((dot, i) => dot.addEventListener('click', () => show(i, i < current ? -1 : 1)));

    // slight parallax on the image, following the mouse
    function resetParallax() {
        root.style.setProperty('--lnj-px', '0px');
        root.style.setProperty('--lnj-py', '0px');
    }
    if (!reducedMotion) {
        root.addEventListener('pointermove', (e) => {
            if (e.pointerType !== 'mouse') return;
            const r = root.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            root.style.setProperty('--lnj-px', `${(-x * 14).toFixed(1)}px`);
            root.style.setProperty('--lnj-py', `${(-y * 14).toFixed(1)}px`);
        });
    }

    show(0);
})();
