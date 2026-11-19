(() => {
  'use strict';

  const C = window.Chromia;
  if (!C) return;

  const $ = (s) => document.querySelector(s);
  const clamp = (n, a = 0, b = 100) => Math.min(b, Math.max(a, n));
  const hex = (h, s, l) => C.toHex(C.hslToRgb(h, s, l));
  const cr = (a, b) => C.ratio(C.hexRgb(a), C.hexRgb(b));
  const state = { fmt: 'css', autofix: true, colors: window.chromiaColors || [], code: '' };

  /* Which role is checked against which, and how it is judged */
  const PAIRS = {
    text: 'background', 'text-muted': 'background',
    primary: 'on-color', secondary: 'on-color', accent: 'on-color',
    success: 'on-color', warning: 'on-color', danger: 'on-color',
  };

  /* Move a color's lightness until it reaches the target contrast against ref */
  function fit(h, s, l, ref, target) {
    let x = l;
    let out = hex(h, s, x);
    if (!state.autofix) return out;
    const step = C.lum(C.hexRgb(ref)) > 0.4 ? -1 : 1;
    while (cr(out, ref) < target && x > 2 && x < 98) { x += step; out = hex(h, s, x); }
    return out;
  }

  /* Turn the 5 palette colors into 12 named roles for one theme */
  function build(dark) {
    const cols = state.colors.map((c) => C.hexToHsl(c));
    const bySat = [...cols].sort((a, b) => b.s - a.s);
    const n = cols.reduce((m, c) => (c.s < m.s ? c : m), cols[0]);
    const ns = clamp(n.s * 0.35, 4, 14);
    const bg = hex(n.h, ns, dark ? 8 : 97);
    const on = dark ? '#111111' : '#FFFFFF';
    const avg = clamp(cols.reduce((t, c) => t + c.s, 0) / cols.length, 50, 75);
    const l0 = dark ? 66 : 40;
    const brand = (c) => fit(c.h, clamp(c.s, 35, 90), l0, on, 4.5);
    return {
      background: bg,
      surface: hex(n.h, ns, dark ? 12 : 100),
      border: hex(n.h, ns, dark ? 24 : 88),
      text: fit(n.h, ns, dark ? 95 : 10, bg, 7),
      'text-muted': fit(n.h, ns, dark ? 68 : 40, bg, 4.5),
      primary: brand(bySat[0]),
      secondary: brand(bySat[1]),
      accent: brand(bySat[2]),
      success: brand({ h: 145, s: avg }),
      warning: brand({ h: 40, s: avg }),
      danger: brand({ h: 4, s: avg }),
      'on-color': on,
    };
  }

  function renderRoles(L, D) {
    const cell = (t, r) => {
      const p = PAIRS[r];
      const ratio = p ? cr(t[r], t[p]) : null;
      const note = ratio ? `<small class="${ratio >= 4.5 ? 'ok' : 'bad'}">${ratio.toFixed(1)}:1 ${ratio >= 4.5 ? 'AA' : 'Fail'}</small>` : '';
      return `<td><span class="sw" style="background:${t[r]}"></span><code>${t[r]}</code>${note}</td>`;
    };
    const rows = Object.keys(L).map((r) => `<tr><th scope="row">${r}</th>${cell(L, r)}${cell(D, r)}</tr>`).join('');
    $('#roles').innerHTML = `<table><thead><tr><th>Role</th><th>Light</th><th>Dark</th></tr></thead><tbody>${rows}</tbody></table>`;
  }

  const vars = (t) => Object.entries(t).map(([k, v]) => `--c-${k}:${v}`).join(';');

  function mock(t, label) {
    return `<div class="mock" style="${vars(t)}" role="img" aria-label="${label} theme preview">
      <div class="m-nav"><b>Brand</b><span>Docs</span><span>Pricing</span><i class="m-btn">Sign up</i></div>
      <h3>Build faster with a theme that just works</h3>
      <p>Supporting text stays readable on the background.</p>
      <div class="m-row"><i class="m-btn">Primary</i><i class="m-btn sec">Secondary</i><i class="m-btn acc">Accent</i></div>
      <div class="m-card"><span>Email</span><div class="m-input">you@example.com</div>
        <div class="m-chips"><i class="s-ok">&#10003; Success</i><i class="s-wr">! Warning</i><i class="s-er">&#10005; Error</i></div></div>
      <div class="m-bars"><i style="height:40%"></i><i style="height:70%"></i><i style="height:55%"></i><i style="height:90%"></i></div>
    </div>`;
  }

  function makeCode(L, D) {
    if (state.fmt === 'json') return JSON.stringify({ light: L, dark: D }, null, 2);
    const css = (t) => Object.entries(t).map(([k, v]) => `  --color-${k}: ${v};`).join('\n');
    const root = `:root {\n${css(L)}\n}\n\n[data-theme="dark"] {\n${css(D)}\n}`;
    if (state.fmt === 'css') return root;
    const map = Object.keys(L).map((k) => `        '${k}': 'var(--color-${k})',`).join('\n');
    return `/* 1. Add these variables to your global CSS */\n${root}\n\n/* 2. tailwind.config.js (Tailwind v3 style) */\nmodule.exports = {\n  darkMode: ['class', '[data-theme="dark"]'],\n  theme: {\n    extend: {\n      colors: {\n${map}\n      },\n    },\n  },\n};`;
  }

  function report(L, D) {
    const issues = [];
    const tips = [];
    [['Light', L], ['Dark', D]].forEach(([name, t]) => {
      Object.keys(PAIRS).forEach((r) => {
        if (cr(t[r], t[PAIRS[r]]) < 4.5) issues.push(`${name} theme: ${r} does not reach AA contrast.`);
      });
    });
    const names = ['success', 'warning', 'danger'];
    ['Protanopia', 'Deuteranopia', 'Tritanopia'].forEach((type) => {
      [['Light', L], ['Dark', D]].forEach(([name, t]) => {
        const s = names.map((k) => C.simulate(C.hexRgb(t[k]), type));
        for (let i = 0; i < 3; i++) {
          for (let j = i + 1; j < 3; j++) {
            if (Math.hypot(...s[i].map((x, k) => x - s[j][k])) < 40) tips.push(`${name} theme: ${names[i]} and ${names[j]} look alike with ${type}.`);
          }
        }
      });
    });
    let html = issues.length
      ? `<strong>Contrast issues</strong><ul>${issues.map((i) => `<li>${i}</li>`).join('')}</ul>`
      : '<strong>All text and button pairs pass WCAG AA in both themes.</strong>';
    html += tips.length
      ? `<p>Color blindness tip: ${tips.length} status color pair${tips.length > 1 ? 's' : ''} can look alike. Pair status colors with icons or labels, as the preview does.</p>`
      : '<p>Status colors stay distinct for protanopia, deuteranopia, and tritanopia.</p>';
    $('#sys-report').innerHTML = html;
  }

  function render() {
    state.colors = window.chromiaColors || state.colors;
    if (state.colors.length < 3) return;
    const L = build(false);
    const D = build(true);
    window.chromiaThemes = { light: L, dark: D };
    document.dispatchEvent(new CustomEvent('chromia:themes'));
    renderRoles(L, D);
    $('#preview').innerHTML = mock(L, 'Light') + mock(D, 'Dark');
    state.code = makeCode(L, D);
    $('#export-code').textContent = state.code;
    report(L, D);
  }

  $('#export-seg').addEventListener('click', (e) => {
    const b = e.target.closest('[data-x]');
    if (!b) return;
    state.fmt = b.dataset.x;
    document.querySelectorAll('#export-seg button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    render();
  });
  $('#autofix').addEventListener('change', (e) => { state.autofix = e.target.checked; render(); });
  $('#export-copy').addEventListener('click', async () => {
    C.toast((await C.copy(state.code)) ? 'Code copied' : 'Copy failed');
  });

  document.addEventListener('chromia:paint', render);
  render();
})();
