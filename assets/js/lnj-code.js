// Code blocks: a Copy pill on every <pre> in the page (styles in custom.css, "Code blocks"). Chroma's
// .highlight is the frame; a bare <pre> (no language, or raw HTML) gets wrapped in one so it looks the same.
// The button sits on the frame, not in the scrolling <pre>, so it stays in view however far the code is
// scrolled sideways. One-line blocks get .lnj-code--one (button centred on the right).
(() => {
    const blocks = document.querySelectorAll('main pre');
    if (!blocks.length) return;

    const icons =
        '<svg class="lnj-copy__icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2.5"/><path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5"/></svg>' +
        '<svg class="lnj-copy__done" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12.5l5 5 10-11"/></svg>';

    // navigator.clipboard needs a secure context; over plain http (the phone on the LAN) fall back to a
    // hidden textarea + execCommand
    const copy = async (text) => {
        if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
        document.body.append(ta);
        ta.select();
        const ok = document.execCommand('copy');
        ta.remove();
        if (!ok) throw new Error('copy failed');
    };

    blocks.forEach((pre) => {
        let frame = pre.parentElement;
        if (!frame.classList.contains('highlight')) {
            frame = document.createElement('div');
            frame.className = 'highlight';
            pre.before(frame);
            frame.append(pre);
        }
        if (!pre.querySelector('code')) pre.innerHTML = `<code>${pre.innerHTML}</code>`;
        const code = pre.querySelector('code');
        const text = () => code.textContent.replace(/\n$/, '');
        frame.classList.add('lnj-code');
        frame.classList.toggle('lnj-code--one', !text().includes('\n'));

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'lnj-btn lnj-copy';
        btn.setAttribute('aria-label', 'Copy code');
        btn.innerHTML = `${icons}<span class="lnj-pill__label" aria-live="polite">Copy</span>`;
        const label = btn.querySelector('.lnj-pill__label');
        let timer;
        btn.addEventListener('click', async () => {
            try {
                await copy(text());
                label.textContent = 'Copied';
                btn.classList.add('is-copied');
            } catch {
                label.textContent = 'Press Ctrl+C';
                const range = document.createRange();
                range.selectNodeContents(code);
                getSelection().removeAllRanges();
                getSelection().addRange(range);
            }
            clearTimeout(timer);
            timer = setTimeout(() => {
                btn.classList.remove('is-copied');
                label.textContent = 'Copy';
            }, 1800);
        });
        frame.append(btn);
    });
})();
