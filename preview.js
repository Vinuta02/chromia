(() => {
  'use strict';

  const X = window.ChromiaIndustries;
  if (!X) return;
  const { IND, ICON, ART, detect, MOODS } = X;
  const $ = (s) => document.querySelector(s);
  const state = { view: 'landing', theme: 'light', ind: 'generic' };

  /* Defaults used when an industry does not define its own content */
  const DEFAULT_ART = `<svg viewBox="0 0 320 260" aria-hidden="true">
    <circle cx="284" cy="34" r="22" fill="var(--c-primary)" opacity=".18"/>
    <rect x="20" y="30" width="230" height="170" rx="18" fill="var(--c-surface)" stroke="var(--c-border)"/>
    <rect x="38" y="50" width="90" height="10" rx="5" fill="var(--c-text)" opacity=".8"/>
    <rect x="38" y="68" width="140" height="8" rx="4" fill="var(--c-text-muted)" opacity=".5"/>
    <path d="M38 170 L80 140 L118 156 L160 108 L205 128 L232 84" fill="none" stroke="var(--c-primary)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="232" cy="84" r="7" fill="var(--c-accent)"/>
    <rect x="190" y="150" width="110" height="80" rx="16" fill="var(--c-secondary)"/>
    <circle cx="228" cy="184" r="14" fill="var(--c-on-color)" opacity=".9"/>
    <rect x="250" y="176" width="36" height="8" rx="4" fill="var(--c-on-color)" opacity=".8"/>
    <rect x="250" y="192" width="24" height="8" rx="4" fill="var(--c-on-color)" opacity=".5"/>
    <circle cx="40" cy="226" r="18" fill="var(--c-accent)" opacity=".9"/></svg>`;

  const G = {
    brand: 'Brand', nav: ['Product', 'Pricing', 'Docs'], btn: 'Get started', pill: 'New: version 2.0 is here',
    h: 'Design that feels right from the first click', p: 'Ship a polished, accessible interface faster, with colors that already work together.',
    meta: '', b1: 'Start free', b2: 'Watch demo', proof: 'Loved by 12,000 teams',
    feats: [['bolt', 'Fast by default', 'Pages load in a blink, so visitors stay.'], ['shield', 'Secure and private', 'Your data stays protected.'], ['chart', 'Clear insights', 'See what matters at a glance.']],
    ban: ['Ready to build something great?', 'Join today. No credit card needed.', 'Create account'],
    dash: {
      nav: ['Overview', 'Projects', 'Reports', 'Team', 'Settings'], title: 'Overview', sub: 'Here is what happened this week',
      stats: [['Revenue', '$48,290', '&#9650; 12.4%', 'ok'], ['Active users', '8,420', '&#9650; 4.1%', 'ok'], ['Open tickets', '37', '! 5 overdue', 'wr']], chart: 'Revenue', list: 'Recent orders',
      rows: [['Maya Rao', '$240.00', '&#10003; Paid', 'ok'], ['Leo Chen', '$89.50', '! Pending', 'wr'], ['Sam Ortiz', '$512.00', '&#10005; Failed', 'er'], ['Ana Silva', '$130.00', '&#10003; Paid', 'ok']],
    },
    app: {
      hi: 'Hi, Alex', sub: 'Good morning', card: ['Daily goal', '72% done', '3 of 4 habits complete', 72], chips: ['All', 'Focus', 'Health', 'Study'],
      items: [['Morning run', '6:30 AM', 'p', 1], ['Read 20 pages', '8:00 PM', 's', 1], ['Deep work block', '10:00 AM', 'a', 1], ['Meditate', '9:30 PM', 'p', 0]],
    },
  };

  const vars = (t) => Object.entries(t).map(([k, v]) => `--c-${k}:${v}`).join(';');
  const bar = (url) => `<div class="pv-bar"><i></i><i></i><i></i><span>${url}</span></div>`;
  const logo = (b) => `<b class="pv-logo"><span></span>${b}</b>`;
  const info = () => ({ ...G, ...IND[state.ind] });

  const landing = () => {
    const c = info();
    const art = ART[c.art] || DEFAULT_ART;
    return `<div class="pv-browser">${bar(c.brand.toLowerCase().replace(/[^a-z]+/g, '') + '.com')}<div class="pv-page">
      <header class="pv-nav">${logo(c.brand)}<nav>${c.nav.map((n) => `<i>${n}</i>`).join('')}</nav><span class="pv-btn sm">${c.btn}</span></header>
      <section class="pv-hero${c.center ? ' center' : ''}">
        <div>
          <span class="pv-pill">${c.pill}</span>
          <h2>${c.h}</h2>
          <p>${c.p}</p>
          ${c.meta ? `<p class="pv-meta">${c.meta}</p>` : ''}
          <div class="pv-cta"><span class="pv-btn">${c.b1}</span><span class="pv-btn ghost">${c.b2}</span></div>
          <div class="pv-proof"><span class="pv-faces"><i></i><i></i><i></i></span>${c.proof}</div>
        </div>
        <div class="pv-art">${art}</div>
      </section>
      <section class="pv-feats">${c.feats.map(([i, t, p]) => `<div class="pv-card"><span class="pv-ic p"><svg viewBox="0 0 24 24"><path d="${ICON[i]}"/></svg></span><h3>${t}</h3><p>${p}</p></div>`).join('')}</section>
      <section class="pv-banner"><div><h3>${c.ban[0]}</h3><p>${c.ban[1]}</p></div><span class="pv-btn inv">${c.ban[2]}</span></section>
    </div></div>`;
  };

  const dashboard = () => {
    const c = info();
    const d = c.dash || G.dash;
    return `<div class="pv-browser">${bar('app.' + c.brand.toLowerCase().replace(/[^a-z]+/g, '') + '.com')}<div class="pv-dash">
      <aside class="pv-side">${logo(c.brand)}${d.nav.map((n, i) => `<i${i ? '' : ' class="on"'}>${n}</i>`).join('')}</aside>
      <div class="pv-main">
        <div class="pv-top"><div><h2>${d.title}</h2><p>${d.sub}</p></div><span class="pv-avatar">AK</span></div>
        <div class="pv-stats">${d.stats.map(([l, v, ch, k]) => `<div class="pv-card"><small>${l}</small><strong>${v}</strong><span class="pv-chip ${k}">${ch}</span></div>`).join('')}</div>
        <div class="pv-panels">
          <div class="pv-card"><h3>${d.chart}</h3><div class="pv-bars">${[40, 62, 48, 75, 58, 82, 66, 90, 72, 95, 80, 100].map((h, i) => `<i style="height:${h}%"${i === 11 ? ' class="hi"' : ''}></i>`).join('')}</div></div>
          <div class="pv-card"><h3>${d.list}</h3>${d.rows.map(([n, a, ch, k]) => `<div class="pv-row"><span class="pv-avatar sm">${n[0]}</span><div><b>${n}</b><small>${a}</small></div><span class="pv-chip ${k}">${ch}</span></div>`).join('')}</div>
        </div>
      </div></div></div>`;
  };

  const mobile = () => {
    const a = info().app || G.app;
    return `<div class="pv-phone"><div class="pv-screen">
      <div class="pv-status"><span>9:41</span><span>&#9679;&#9679;&#9679;</span></div>
      <div class="pv-top"><div><small>${a.sub}</small><h2>${a.hi}</h2></div><span class="pv-avatar">A</span></div>
      <div class="pv-goal"><div><small>${a.card[0]}</small><strong>${a.card[1]}</strong><p>${a.card[2]}</p></div>
        <svg viewBox="0 0 64 64" aria-hidden="true"><circle class="trk" cx="32" cy="32" r="26"/><circle class="val" cx="32" cy="32" r="26" pathLength="100" stroke-dasharray="${a.card[3]} 100" transform="rotate(-90 32 32)"/></svg></div>
      <div class="pv-fchips">${a.chips.map((c, i) => `<span${i ? '' : ' class="on"'}>${c}</span>`).join('')}</div>
      <ul class="pv-list">${a.items.map(([t, s, k, d]) => `<li><span class="pv-ic ${k}"></span><div><b>${t}</b><small>${s}</small></div><span class="pv-tick${d ? ' on' : ''}">${d ? '&#10003;' : ''}</span></li>`).join('')}</ul>
      <div class="pv-tabs"><span class="on">Home</span><span>Stats</span><span>Plan</span><span>Me</span></div>
    </div></div>`;
  };

  const VIEWS = { landing, dashboard, mobile };
  const NAMES = { landing: 'landing page', dashboard: 'dashboard', mobile: 'mobile app' };

  function render() {
    const T = window.chromiaThemes;
    if (!T) return;
    const stage = $('#pv-stage');
    stage.setAttribute('style', vars(T[state.theme]));
    stage.setAttribute('aria-label', `Your palette applied to a ${IND[state.ind].label.toLowerCase()} ${NAMES[state.view]} in the ${state.theme} theme`);
    $('#pv-mock').innerHTML = VIEWS[state.view]();
  }

  function press(id, attr, value) {
    document.querySelectorAll(`${id} button`).forEach((b) => b.setAttribute('aria-pressed', String(b.getAttribute(attr) === value)));
  }

  function setIndustry(key) {
    state.ind = IND[key] ? key : 'generic';
    state.view = IND[state.ind].view || 'landing';
    $('#pv-ind').value = state.ind;
    press('#pv-views', 'data-v', state.view);
    render();
  }

  function seg(id, key, attr) {
    $(id).addEventListener('click', (e) => {
      const b = e.target.closest(`[${attr}]`);
      if (!b) return;
      state[key] = b.getAttribute(attr);
      press(id, attr, state[key]);
      render();
    });
  }
  seg('#pv-views', 'view', 'data-v');
  seg('#pv-themes', 'theme', 'data-t');

  $('#pv-ind').innerHTML = Object.entries(IND).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join('');
  $('#pv-ind').addEventListener('change', (e) => setIndustry(e.target.value));

  /* Choosing a project type or a mood picks a matching preview */
  $('#ai-form').addEventListener('submit', () => setIndustry(detect($('#ai-input').value)));
  $('#mood-grid').addEventListener('click', (e) => {
    const b = e.target.closest('[data-mood]');
    if (b) setIndustry(MOODS[Number(b.dataset.mood)]);
  });

  document.addEventListener('chromia:themes', render);
  render();
})();
