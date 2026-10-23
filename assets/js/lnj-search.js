// Site search pill (bottom left): searches the notes and tools in the JSON index Hugo builds
// (assets/json/search-index.json) and lists results above the input. Every word typed has to match
// somewhere; title hits rank first, then tags, description, body. "/" anywhere focuses it;
// ↑/↓ move, Enter opens, Esc clears.
(() => {
    const root = document.querySelector('.lnj-search');
    if (!root) return;
    const input = root.querySelector('.lnj-search__input');
    const list = root.querySelector('.lnj-search__results');
    const LIMIT = 6;
    const EXCERPT_WORDS = 18;
    const WEIGHTS = { title: 10, tags: 6, category: 4, description: 4, content: 1 };

    let index = null;
    let active = -1;

    async function load() {
        if (!index) {
            index = fetch(root.dataset.index)
                .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
                .then((pages) => pages.map((p) => ({
                    ...p,
                    lower: Object.fromEntries(Object.keys(WEIGHTS).map((k) => [k, (p[k] || '').toLowerCase()])),
                })));
            index.catch(() => { index = null; }); // retry on the next keystroke
        }
        return index;
    }

    const escapeHTML = (s) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
    const escapeRE = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    function score(page, terms) {
        let total = 0;
        for (const term of terms) {
            let hit = 0;
            for (const [field, weight] of Object.entries(WEIGHTS)) {
                if (page.lower[field].includes(term)) hit += weight;
            }
            if (!hit) return 0;
            total += hit;
        }
        return total;
    }

    // a few words around the first match in the body (or the description), matches in <mark>
    function excerpt(page, terms) {
        let text = page.content;
        let at = terms.map((t) => page.lower.content.indexOf(t)).filter((i) => i >= 0).sort((a, b) => a - b)[0];
        if (at === undefined) { text = page.description; at = 0; }
        const words = text.split(' ');
        let pos = 0;
        let w = 0;
        while (w < words.length && pos + words[w].length < at) pos += words[w++].length + 1;
        const start = Math.max(0, w - Math.floor(EXCERPT_WORDS / 3));
        let snippet = escapeHTML(words.slice(start, start + EXCERPT_WORDS).join(' '));
        if (start > 0) snippet = '… ' + snippet;
        if (start + EXCERPT_WORDS < words.length) snippet += ' …';
        const re = new RegExp(terms.map((t) => escapeRE(escapeHTML(t))).join('|'), 'gi');
        return snippet.replace(re, '<mark>$&</mark>');
    }

    function message(text) {
        list.replaceChildren(Object.assign(document.createElement('li'), {
            className: 'lnj-search__empty', textContent: text,
        }));
        open(true);
    }

    function open(state) {
        list.hidden = !state;
        input.setAttribute('aria-expanded', String(state));
        root.classList.toggle('is-open', state);
    }

    function highlight(i) {
        const items = [...list.querySelectorAll('a')];
        active = items.length ? (i + items.length) % items.length : -1;
        items.forEach((a, j) => a.classList.toggle('is-active', j === active));
        items[active]?.scrollIntoView({ block: 'nearest' });
    }

    async function run(query) {
        const terms = [...new Set(query.toLowerCase().split(/\s+/).filter(Boolean))];
        if (!terms.length) { open(false); list.replaceChildren(); return; }
        let pages;
        try {
            pages = await load();
        } catch (e) {
            message('Search is unavailable right now.');
            return;
        }
        if (input.value !== query) return; // a newer keystroke is on its way
        const results = pages
            .map((page) => ({ page, score: score(page, terms) }))
            .filter((r) => r.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, LIMIT);
        if (!results.length) { message(`Nothing found for “${query.trim()}”`); return; }

        list.replaceChildren(...results.map(({ page }) => {
            const li = document.createElement('li');
            li.setAttribute('role', 'option');
            const a = document.createElement('a');
            a.href = page.url;
            const title = document.createElement('strong');
            title.textContent = page.title;
            const text = document.createElement('span');
            text.innerHTML = excerpt(page, terms); // escaped above, only <mark> added
            a.append(title, text);
            li.append(a);
            return li;
        }));
        open(true);
        highlight(0);
    }

    input.addEventListener('focus', () => { load().catch(() => {}); if (input.value) run(input.value); });
    input.addEventListener('input', () => run(input.value));
    input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') { highlight(active + 1); e.preventDefault(); }
        else if (e.key === 'ArrowUp') { highlight(active - 1); e.preventDefault(); }
        else if (e.key === 'Enter') {
            const a = list.querySelectorAll('a')[active];
            if (a) { window.location.href = a.href; e.preventDefault(); }
        } else if (e.key === 'Escape') {
            input.value = ''; open(false); input.blur();
        }
    });

    // close when clicking elsewhere
    document.addEventListener('pointerdown', (e) => { if (!root.contains(e.target)) open(false); });

    document.addEventListener('keydown', (e) => {
        if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
        if (e.target.closest('input, textarea, select, [contenteditable]')) return;
        e.preventDefault();
        input.focus();
    });
})();
