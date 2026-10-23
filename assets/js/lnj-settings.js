// Turns brewm's Accessibility panel (built by the theme's accessibility.js) into a Settings panel:
// a gear button, changes saved as you make them, and About + RSS in place of Save / Reset / Close.
(() => {
    const details = document.getElementById('has-a11y');
    const panel = document.getElementById('a11y');
    const summary = document.getElementById('has-a11y-summary');
    if (!details || !panel || !summary) return;

    // brewm's "Accessibility" label becomes "Settings", shown only when the gear expands on hover
    summary.setAttribute('aria-label', 'Settings');
    const label = summary.querySelector('span');
    if (label) {
        label.className = 'lnj-pill__label';
        label.textContent = 'Settings';
    }

    // posts: brewm puts the BionRead toggle on the bottom bar; it becomes a switch in this panel
    // instead, styled like its OpenDyslexic switch (input.toggle + label). (brewm's focus mode is hidden.)
    const bion = document.getElementById('useBionRead');
    const bionSwitch = document.getElementById('bionReadSwitch');
    if (bion && bionSwitch?.nextElementSibling) {
        bionSwitch.classList.add('toggle');
        bionSwitch.nextElementSibling.textContent = 'BionRead';
        bion.classList.add('lnj-a11y-switch');
    }

    // the switches (Reading mode = brewm's screen-reader switch, OpenDyslexic, BionRead) share one row instead of a
    // row each. On posts Reading mode is hidden here: the page tools' button drives it (lnj-tools.js)
    const switches = document.createElement('div');
    switches.className = 'lnj-a11y-switches';
    ['optimizeSR', 'setOpenDyslexic', 'useBionRead'].forEach((id) => {
        const box = document.getElementById(id);
        if (box) switches.append(box);
    });
    panel.insertBefore(switches, document.getElementById('a11y-menu'));

    const menu = document.getElementById('a11y-menu');
    const template = document.getElementById('lnj-a11y-menu');
    if (menu && template) {
        menu.className = '';
        menu.replaceChildren(template.content.cloneNode(true));
    }

    // Same keys brewm's Save button writes, minus its auto-close. Runs after the theme's own
    // click handlers have applied the change, so it stores the new state.
    const el = (id) => document.getElementById(id);
    function save() {
        try {
            localStorage.scheme = scheme();
            localStorage.contrast = contrast();
            localStorage.colorPalette = el('colorPalette').value;
            localStorage.font = el('OpenDyslexic').checked ? 'OpenDyslexic' : '';
            localStorage.useSR = el('useSR').checked ? 'true' : 'false';
            localStorage.fontSize = el('fontSize').value;
            localStorage.stretchSize = el('baselineStretch').value;
        } catch (e) {
            // no localStorage (private mode etc.): settings just last for this page
        }
    }
    ['click', 'input', 'change'].forEach((type) =>
        panel.addEventListener(type, () => setTimeout(save, 0)));
})();
