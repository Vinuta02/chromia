(() => {
  'use strict';

  const KEY = 'chromia:palettes';
  const MAX_SAVED = 24;
  const HEX_RE = /^#[0-9A-F]{6}$/i;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const clamp = (n, a = 0, b = 100) => Math.min(b, Math.max(a, n));
  const rand = (a, b) => a + Math.random() * (b - a);
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ---------- Color math ---------- */
  function hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360; s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => { const k = (n + h / 30) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); };
    return [f(0), f(8), f(4)].map((v) => Math.round(v * 255));
  }
  const toHex = (rgb) => '#' + rgb.map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase();
  const hexRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  function hexToHsl(hex) {
    const [r, g, b] = hexRgb(hex).map((v) => v / 255);
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
    let h = 0, s = 0;
    if (d) {
      s = d / (1 - Math.abs(2 * l - 1));
      h = (mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4) * 60;
    }
    return { h: (h + 360) % 360, s: s * 100, l: l * 100 };
  }
  const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const delin = (v) => Math.round(255 * clamp(v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055, 0, 1));
  const lum = (rgb) => { const [r, g, b] = rgb.map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const grade = (r) => (r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'AA Large' : 'Fail');
  function textOn(rgb) {
    const w = ratio(rgb, [255, 255, 255]), d = ratio(rgb, [17, 17, 17]);
    return w >= d ? { fg: '#FFFFFF', r: w } : { fg: '#111111', r: d };
  }
  function hsb(h, s, l) {
    s /= 100; l /= 100;
    const v = l + s * Math.min(l, 1 - l);
    return [Math.round(h), Math.round(v ? 2 * (1 - l / v) * 100 : 0), Math.round(v * 100)];
  }

  /* ---------- State ---------- */
  const state = {
    colors: ['#5B6C8F', '#8FA3AD', '#C9B79C', '#D39B8A', '#A5B8A0'].map((h) => ({ ...hexToHsl(h), locked: false })),
    sOff: 0, lOff: 0, fmt: 'hex', saved: [],
  };

  function view(c) {
    const s = clamp(c.s + state.sOff), l = clamp(c.l + state.lOff, 4, 96), rgb = hslToRgb(c.h, s, l);
    return { h: ((c.h % 360) + 360) % 360, s, l, rgb, hex: toHex(rgb) };
  }
  function fmt(c, f = state.fmt) {
    if (f === 'rgb') return `rgb(${c.rgb.join(', ')})`;
    if (f === 'hsl') return `hsl(${Math.round(c.h)}, ${Math.round(c.s)}%, ${Math.round(c.l)}%)`;
    if (f === 'hsb') { const [h, s, b] = hsb(c.h, c.s, c.l); return `hsb(${h}, ${s}%, ${b}%)`; }
    return c.hex;
  }
  const views = () => state.colors.map(view);

  /* ---------- Palette generation ---------- */
  const OFFS = { analogous: [-30, -15, 0, 15, 30], complementary: [0, 24, 180, 204, -24], triadic: [0, 24, 120, 240, 264] };
  const MONO = [24, 40, 56, 72, 88];
  const WHEEL_L = [32, 46, 58, 72, 84];

  function harmony(mode, base, sat) {
    return Array.from({ length: 5 }, (_, i) => {
      if (mode === 'monochrome') return { h: base, s: sat ?? rand(30, 55), l: MONO[i] };
      if (mode === 'random') return { h: rand(0, 360), s: rand(35, 70), l: rand(35, 78) };
      return { h: base + OFFS[mode][i], s: sat == null ? rand(35, 70) : clamp(sat + (i - 2) * 4), l: sat == null ? rand(38, 76) : WHEEL_L[i] };
    });
  }
  function apply(list) {
    list.forEach((c, i) => { if (!state.colors[i].locked) state.colors[i] = { ...c, locked: false }; });
  }
  function generate() {
    apply(harmony($('#mode').value, rand(0, 360)));
    paint();
  }

  const PRESETS = { soft: [[30, 50], [65, 82]], pastel: [[40, 65], [80, 90]], vibrant: [[75, 95], [42, 60]], deep: [[40, 70], [18, 34]], muted: [[12, 30], [40, 65]] };
  function preset(name) {
    const [[s0, s1], [l0, l1]] = PRESETS[name];
    state.colors.forEach((c, i) => {
      if (c.locked) return;
      c.s = lerp(s0, s1, (i * 0.37 + 0.13) % 1);
      c.l = lerp(l0, l1, (i * 0.23 + 0.31) % 1);
    });
    state.sOff = state.lOff = 0;
    $('#sat').value = $('#lit').value = 0;
    paint();
  }

  /* ---------- Prompt-based palettes (runs in the browser, no API) ---------- */
  const THEMES = [
    ['Sport', /fitness|gym|sport|energ|run|workout/, [10, 28, 48, 200, 350], [70, 92], [42, 60]],
    ['Finance', /financ|bank|trust|corporate|business|law|insur/, [215, 205, 225, 165, 195], [35, 60], [24, 62]],
    ['Wellness', /well|spa|calm|medit|yoga|health|sleep|peace|relax/, [150, 175, 195, 45, 200], [30, 50], [68, 86]],
    ['Playful', /kid|toy|play|fun|game|joy|happy|cheer/, [0, 48, 200, 280, 140], [70, 90], [50, 70]],
    ['Luxury', /luxur|fashion|premium|jewel|elegan|wine|gold/, [42, 280, 0, 30, 320], [25, 50], [16, 48]],
    ['Food', /food|restaurant|cafe|coffee|bak|kitchen|warm|cozy/, [20, 32, 12, 45, 95], [40, 70], [32, 62]],
    ['Nature', /nature|eco|organic|garden|plant|green|sustain|forest|outdoor/, [100, 130, 85, 45, 170], [28, 55], [30, 68]],
    ['Tech', /tech|\bai\b|startup|saas|software|dashboard|app|cyber|futur/, [250, 220, 280, 190, 320], [55, 85], [40, 66]],
    ['Romance', /roman|wedding|love|soft|beauty|cosmetic|baby/, [340, 350, 10, 320, 30], [40, 65], [74, 88]],
    ['Moody', /night|dark|moody|myster|gothic|bold|drama/, [260, 240, 285, 220, 330], [40, 70], [14, 38]],
    ['Travel', /ocean|beach|travel|summer|sea|sky|water/, [195, 180, 45, 15, 210], [45, 80], [45, 78]],
    ['Retro', /retro|vintage|nostalg|90s|80s/, [35, 15, 190, 50, 350], [40, 65], [40, 72]],
  ];
  const NAMED = { red: 0, orange: 25, yellow: 50, green: 130, teal: 175, cyan: 185, blue: 215, purple: 270, violet: 270, pink: 330, brown: 25 };

  function fromPrompt(text) {
    const t = text.toLowerCase();
    const hits = THEMES.filter((x) => x[1].test(t)).slice(0, 2);
    const hues = hits.length
      ? hits.flatMap((x) => x[2].slice(0, hits.length > 1 ? 3 : 5))
      : Array.from({ length: 5 }, (_, i) => rand(0, 60) + i * 25);
    const named = Object.keys(NAMED).find((k) => t.includes(k));
    if (named) hues.unshift(NAMED[named]);
    const avg = (k) => hits.length ? [0, 1].map((j) => hits.reduce((n, x) => n + x[k][j], 0) / hits.length) : k === 3 ? [40, 70] : [35, 75];
    const [s0, s1] = avg(3), [l0, l1] = avg(4);
    const list = Array.from({ length: 5 }, (_, i) => ({
      h: hues[i % hues.length] + rand(-6, 6),
      s: rand(s0, s1),
      l: lerp(l1, l0, clamp((i + rand(-0.3, 0.3)) / 4, 0, 1)),
    }));
    return { list, names: hits.map((x) => x[0]), named };
  }

  /* ---------- Moods ---------- */
  const MOODS = [
    ['Calm', 'A quiet morning at the lake before anyone else is awake.', ['#DDE7EE', '#B7CAD9', '#8FA9BF', '#6E8CA3', '#4A6378']],
    ['Joy', 'Saturday market: citrus, laughter, and a bright awning.', ['#FFD166', '#F78C6B', '#EF476F', '#06D6A0', '#118AB2']],
    ['Bold', 'The headline you cannot scroll past.', ['#1B1B3A', '#693668', '#A74482', '#F84AA7', '#FF3562']],
    ['Romance', 'Rose petals on a candlelit table.', ['#F6D5DA', '#E8A5B3', '#C9667C', '#8E3A59', '#4B1D3F']],
    ['Nostalgia', 'Faded polaroids from a summer long ago.', ['#E9D8A6', '#EE9B00', '#CA6702', '#BB3E03', '#7F5539']],
    ['Forest', 'Rain on pine needles and wet moss.', ['#DAD7CD', '#A3B18A', '#588157', '#3A5A40', '#344E41']],
    ['Luxury', 'Midnight, brass, and a velvet lobby.', ['#14110F', '#3B2F2F', '#8C6A3D', '#D4AF37', '#F3E9D2']],
    ['Energy', 'The final sprint while the crowd roars.', ['#FF4D00', '#FF9E00', '#FFD400', '#00B4D8', '#0F1B3D']],
  ];
  function loadHexes(hexes) {
    state.colors = hexes.map((h) => ({ ...hexToHsl(h), locked: false }));
    state.sOff = state.lOff = 0;
    $('#sat').value = $('#lit').value = 0;
    paint();
  }

  /* ---------- Helpers ---------- */
  let timer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => el.classList.remove('show'), 1800);
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch {
      const a = document.createElement('textarea');
      a.value = text; a.style.cssText = 'position:fixed;opacity:0';
      document.body.append(a); a.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch { /* ignore */ }
      a.remove();
      return ok;
    }
  }
  const smooth = () => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');

  /* ---------- Rendering ---------- */
  function buildSwatches() {
    $('#palette').innerHTML = state.colors.map((_, i) => `
      <section class="swatch" data-i="${i}" aria-label="Color ${i + 1}">
        <button class="lock" type="button" aria-pressed="false">
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2.5"></rect><path class="shackle" d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg>
        </button>
        <div class="info"><button class="code" type="button"></button><span class="badge" title="Contrast of the text on this color"></span></div>
      </section>`).join('');
  }

  function paint() {
    const v = views();
    $$('.swatch').forEach((el, i) => {
      const c = v[i], t = textOn(c.rgb), locked = state.colors[i].locked, label = fmt(c);
      el.style.setProperty('--bg-c', c.hex);
      el.style.setProperty('--fg-c', t.fg);
      const code = el.querySelector('.code');
      code.textContent = label;
      code.dataset.copy = label;
      code.setAttribute('aria-label', `Copy ${label}`);
      el.querySelector('.badge').textContent = `${t.r.toFixed(1)}:1 ${grade(t.r)}`;
      const lock = el.querySelector('.lock');
      lock.setAttribute('aria-pressed', String(locked));
      lock.setAttribute('aria-label', `${locked ? 'Unlock' : 'Lock'} ${c.hex}`);
    });
    renderTints(v); renderGradients(v); renderCvd(v); renderPair(v); drawWheel(v);
  }

  function renderTints(v) {
    const steps = [94, 84, 74, 64, 54, 44, 34, 24, 14];
    $('#tints').innerHTML = v.map((c) => `<div class="tint-row">${steps.map((l) => {
      const rgb = hslToRgb(c.h, c.s, l), hex = toHex(rgb);
      return `<button class="tint" type="button" style="background:${hex};color:${textOn(rgb).fg}" data-copy="${hex}" aria-label="Copy ${hex}">${hex.slice(1)}</button>`;
    }).join('')}</div>`).join('');
  }

  function renderGradients(v) {
    const h = v.map((c) => c.hex);
    const G = [
      ['Linear', `linear-gradient(120deg, ${h.join(', ')})`],
      ['Mesh', `radial-gradient(circle at 15% 20%, ${h[0]}, transparent 55%), radial-gradient(circle at 85% 25%, ${h[2]}, transparent 55%), radial-gradient(circle at 50% 95%, ${h[4]}, transparent 60%), ${h[1]}`],
      ['Conic', `conic-gradient(from 90deg, ${[...h, h[0]].join(', ')})`],
    ];
    $('#grad-grid').innerHTML = G.map(([n, css]) => `
      <article class="card"><div class="gprev" style="background:${css}"></div>
        <div class="row"><h3>${n}</h3><button class="btn" type="button" data-copy="background: ${css};">Copy CSS</button></div></article>`).join('');
  }

  /* Color blindness simulation (Machado et al. 2009, full severity, linear RGB) */
  const CVD = {
    Protanopia: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
    Deuteranopia: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]],
    Tritanopia: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.3039]],
  };
  function simulate(rgb, type) {
    const l = rgb.map(lin);
    if (type === 'Achromatopsia') { const y = 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2]; return [y, y, y].map(delin); }
    return CVD[type].map((r) => delin(r[0] * l[0] + r[1] * l[1] + r[2] * l[2]));
  }
  function renderCvd(v) {
    const types = ['Normal vision', 'Protanopia', 'Deuteranopia', 'Tritanopia', 'Achromatopsia'];
    $('#cvd').innerHTML = types.map((t) => {
      const sims = v.map((c) => (t === 'Normal vision' ? c.rgb : simulate(c.rgb, t)));
      let min = Infinity;
      for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) min = Math.min(min, Math.hypot(...sims[i].map((x, k) => x - sims[j][k])));
      const ok = min >= 40;
      const status = t === 'Normal vision' ? 'Reference' : ok ? 'Colors stay distinct' : 'Some colors look alike';
      return `<div class="cvd-row"><span>${t}</span><div class="strip">${sims.map((r) => `<span style="background:${toHex(r)}"></span>`).join('')}</div><span class="cvd-status ${ok ? 'ok' : 'warn'}">${status}</span></div>`;
    }).join('');
  }

  function renderPair(v) {
    const opts = [...v.map((c) => c.hex), '#FFFFFF', '#111111'];
    [['#fg', '6'], ['#bg', '0']].forEach(([id, def]) => {
      const sel = $(id), cur = sel.value || def;
      sel.innerHTML = opts.map((h, i) => `<option value="${i}">${i < 5 ? 'Color ' + (i + 1) : i === 5 ? 'White' : 'Black'} ${h}</option>`).join('');
      sel.value = cur;
    });
    const fg = opts[$('#fg').value], bg = opts[$('#bg').value], r = ratio(hexRgb(fg), hexRgb(bg));
    const s = $('#pair-sample').style;
    s.color = fg; s.background = bg;
    const p = (ok) => (ok ? 'pass' : 'fail');
    $('#pair-result').textContent = `Contrast ${r.toFixed(2)}:1. Normal text AA: ${p(r >= 4.5)}. Normal text AAA: ${p(r >= 7)}. Large text AA: ${p(r >= 3)}.`;
  }

  /* Color wheel */
  const W = 300, RAD = W / 2 - 6;
  const wheel = $('#wheel'), wc = wheel.getContext('2d');
  let wheelImg;
  function initWheel() {
    wheelImg = wc.createImageData(W, W);
    for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) {
      const dx = x - W / 2, dy = y - W / 2, r = Math.hypot(dx, dy) / RAD;
      if (r > 1) continue;
      wheelImg.data.set([...hslToRgb(Math.atan2(dy, dx) * 180 / Math.PI, r * 100, 55), 255], (y * W + x) * 4);
    }
  }
  function drawWheel(v) {
    wc.clearRect(0, 0, W, W);
    wc.putImageData(wheelImg, 0, 0);
    const pts = v.map((c) => [W / 2 + Math.cos(c.h * Math.PI / 180) * c.s / 100 * RAD, W / 2 + Math.sin(c.h * Math.PI / 180) * c.s / 100 * RAD]);
    wc.beginPath();
    pts.forEach(([x, y], i) => (i ? wc.lineTo(x, y) : wc.moveTo(x, y)));
    wc.closePath(); wc.lineWidth = 1.5; wc.strokeStyle = 'rgba(255,255,255,.75)'; wc.stroke();
    pts.forEach(([x, y], i) => {
      wc.beginPath(); wc.arc(x, y, i === 0 ? 9 : 6, 0, 7);
      wc.fillStyle = v[i].hex; wc.fill(); wc.lineWidth = 2.5; wc.strokeStyle = '#fff'; wc.stroke();
    });
  }
  function fromWheel(h, s) {
    const mode = $('#mode').value;
    apply(harmony(mode === 'random' ? 'analogous' : mode, h, s));
    $('#wheel-info').textContent = `Base hue ${Math.round(h)}°, saturation ${Math.round(s)}%`;
    paint();
  }
  function pick(e) {
    const r = wheel.getBoundingClientRect();
    const x = (e.clientX - r.left) * W / r.width - W / 2, y = (e.clientY - r.top) * W / r.height - W / 2;
    fromWheel((Math.atan2(y, x) * 180 / Math.PI + 360) % 360, clamp(Math.hypot(x, y) / RAD * 100, 10, 100));
  }
  wheel.addEventListener('pointerdown', (e) => { wheel.setPointerCapture(e.pointerId); pick(e); });
  wheel.addEventListener('pointermove', (e) => { if (e.buttons) pick(e); });
  wheel.addEventListener('keydown', (e) => {
    const d = { ArrowLeft: [-6, 0], ArrowRight: [6, 0], ArrowUp: [0, 5], ArrowDown: [0, -5] }[e.key];
    if (!d) return;
    e.preventDefault();
    const c = views()[0];
    fromWheel(c.h + d[0], clamp(c.s + d[1], 10, 100));
  });

  /* Saved palettes */
  function loadSaved() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY));
      if (Array.isArray(raw)) state.saved = raw.filter((p) => Array.isArray(p) && p.length === 5 && p.every((h) => HEX_RE.test(h))).map((p) => p.map((h) => h.toUpperCase()));
    } catch { /* start fresh */ }
  }
  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(state.saved)); } catch { toast('Saving is unavailable in this browser'); }
  }
  function renderSaved() {
    $('#saved').innerHTML = state.saved.length
      ? state.saved.map((p, i) => `<div class="saved-item"><button class="load" type="button" data-load="${i}" aria-label="Load palette ${p.join(', ')}">${p.map((h) => `<span style="background:${h}"></span>`).join('')}</button><button class="del" type="button" data-del="${i}" aria-label="Delete palette ${i + 1}">&times;</button></div>`).join('')
      : '<p class="note">Nothing saved yet. Press Save to keep a palette.</p>';
  }

  /* ---------- Events ---------- */
  $('#palette').addEventListener('click', (e) => {
    const sw = e.target.closest('.swatch');
    if (sw && e.target.closest('.lock')) {
      const c = state.colors[Number(sw.dataset.i)];
      c.locked = !c.locked;
      paint();
    }
  });
  document.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    const text = b.dataset.copy;
    toast((await copy(text)) ? `Copied ${text.length < 24 ? text : 'CSS'}` : 'Copy failed');
  });

  $('#generate').addEventListener('click', generate);
  $('#mode').addEventListener('change', generate);
  $('#sat').addEventListener('input', (e) => { state.sOff = +e.target.value; paint(); });
  $('#lit').addEventListener('input', (e) => { state.lOff = +e.target.value; paint(); });
  $('#presets').addEventListener('click', (e) => { const b = e.target.closest('[data-p]'); if (b) preset(b.dataset.p); });
  $('#fmt').addEventListener('click', (e) => {
    const b = e.target.closest('[data-f]');
    if (!b) return;
    state.fmt = b.dataset.f;
    $$('#fmt button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    paint();
  });
  $('#fg').addEventListener('change', () => renderPair(views()));
  $('#bg').addEventListener('change', () => renderPair(views()));

  $('#save').addEventListener('click', () => {
    const p = views().map((c) => c.hex);
    if (state.saved.some((x) => x.join() === p.join())) return toast('Palette already saved');
    state.saved = [p, ...state.saved].slice(0, MAX_SAVED);
    persist(); renderSaved(); toast('Palette saved');
  });
  $('#copyall').addEventListener('click', async () => toast((await copy(views().map((c) => fmt(c)).join(', '))) ? 'Palette copied' : 'Copy failed'));
  $('#css').addEventListener('click', async () => {
    const css = `:root {\n${views().map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n')}\n}`;
    toast((await copy(css)) ? 'CSS variables copied' : 'Copy failed');
  });
  $('#saved').addEventListener('click', (e) => {
    const l = e.target.closest('[data-load]'), d = e.target.closest('[data-del]');
    if (l) loadHexes(state.saved[Number(l.dataset.load)]);
    if (d) { state.saved.splice(Number(d.dataset.del), 1); persist(); renderSaved(); }
  });

  $('#ai-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const text = $('#ai-input').value.trim();
    if (!text) return;
    const { list, names, named } = fromPrompt(text);
    state.colors = list.map((c) => ({ ...c, locked: false }));
    state.sOff = state.lOff = 0;
    $('#sat').value = $('#lit').value = 0;
    paint();
    $('#ai-note').textContent = names.length || named
      ? `Built from: ${[...names, named].filter(Boolean).join(' + ')}. Fine-tune it below.`
      : 'No keywords matched, so this is a balanced palette. Try words like fitness, bank, cozy cafe, or a color name.';
    $('#generator').scrollIntoView({ behavior: smooth() });
  });

  document.addEventListener('keydown', (e) => {
    if (e.code !== 'Space' || e.repeat) return;
    if (e.target.closest('button, select, input, textarea, a, canvas')) return;
    e.preventDefault();
    generate();
  });

  /* ---------- Init ---------- */
  $('#chips').innerHTML = ['calm meditation app', 'bold fitness brand', 'cozy coffee shop', 'fintech dashboard', 'romantic wedding invite', 'eco travel blog']
    .map((t) => `<button type="button">${t}</button>`).join('');
  $('#chips').addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') return;
    $('#ai-input').value = e.target.textContent;
    $('#ai-form').requestSubmit();
  });
  $('#mood-grid').innerHTML = MOODS.map(([n, story, hx], i) => `
    <button class="card" type="button" data-mood="${i}" aria-label="Use the ${n} palette">
      <div class="strip">${hx.map((h) => `<span style="background:${h}"></span>`).join('')}</div>
      <div class="card-body"><h3>${n}</h3><p>${story}</p></div>
    </button>`).join('');
  $('#mood-grid').addEventListener('click', (e) => {
    const b = e.target.closest('[data-mood]');
    if (!b) return;
    loadHexes(MOODS[Number(b.dataset.mood)][2]);
    $('#generator').scrollIntoView({ behavior: smooth() });
  });

  buildSwatches();
  initWheel();
  loadSaved();
  renderSaved();
  paint();
})();
