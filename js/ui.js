/* ==========================================================================
   ui.js — Boot sequence, overlay windows (cork board, notebook, contact,
   photo album), RETRO-OS desktop with draggable Win98 windows, language
   switch (EN/繁), retro sound blips, motion preference.
   All personal content comes from content.js.
   ========================================================================== */

import {
  PROFILE, STICKY_NOTES, TIMELINE_AWARDS, SKILL_PAGES, PROJECTS,
  AWARD_TABS, PHOTOS, CONTACTS, BOOT_LINES, BOOT_HINT,
  APPS, WELCOME, TOUR, JOURNEY,
} from './content.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

export const state = {
  lang: localStorage.getItem('my-lang') || 'en', // 'en' | 'zh'
  sound: localStorage.getItem('my-sound') !== 'off',
  motion: localStorage.getItem('my-motion') !== 'off', // motion ON by default
  visited: new Set(JSON.parse(localStorage.getItem('my-visited') || '[]')),
};

export const t = (o) => (state.lang === 'zh' ? (o.zh ?? o) : (o.en ?? o));

/* ---------------- tiny retro sound engine ---------------- */
let actx = null;
function ac() {
  if (!actx) {
    try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch { return null; }
  }
  if (actx.state === 'suspended') actx.resume();
  return actx;
}
export function blip(kind = 'click') {
  if (!state.sound) return;
  const ctx = ac();
  if (!ctx) return;
  const now = ctx.currentTime;
  const seq = {
    hover: [[1350, 0, 0.03, 0.012]],
    click: [[620, 0, 0.05, 0.035], [930, 0.045, 0.06, 0.03]],
    open: [[520, 0, 0.06, 0.04], [780, 0.07, 0.09, 0.04]],
    close: [[760, 0, 0.05, 0.035], [430, 0.05, 0.08, 0.03]],
    boot: [[880, 0, 0.09, 0.05], [1174, 0.1, 0.12, 0.04]],
    flip: [[500, 0, 0.04, 0.03], [900, 0.05, 0.05, 0.03]],
    shutdown: [[660, 0, 0.12, 0.05], [440, 0.13, 0.16, 0.05], [220, 0.3, 0.25, 0.05]],
  }[kind] || [[660, 0, 0.05, 0.03]];
  seq.forEach(([f, at, dur, gain]) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'square';
    o.frequency.value = f;
    g.gain.setValueAtTime(gain, now + at);
    g.gain.exponentialRampToValueAtTime(0.0001, now + at + dur);
    o.connect(g).connect(ctx.destination);
    o.start(now + at); o.stop(now + at + dur + 0.02);
  });
}

/* ---------------- language ---------------- */
export function setLang(lang) {
  state.lang = lang;
  localStorage.setItem('my-lang', lang);
  document.documentElement.lang = lang === 'zh' ? 'zh-HK' : 'en';
  $$('[data-en]').forEach((el) => {
    el.textContent = lang === 'zh' ? el.getAttribute('data-zh') : el.getAttribute('data-en');
  });
  const chip = $('#langChip');
  if (chip) chip.textContent = lang === 'en' ? '繁' : 'EN';
  renderAll();
}

/* ---------------- overlay manager ---------------- */
let openOverlayId = null;
export function overlayOpen(id) { return openOverlayId === id; }
export function openOverlay(id) {
  if (openOverlayId) closeOverlay(true);
  const ov = $('#' + id);
  if (!ov) return;
  ov.classList.add('open');
  document.body.classList.add('overlay-open');
  openOverlayId = id;
  blip('open');
  // move focus into the dialog for keyboard users
  const inner = ov.querySelector('.ov-inner');
  if (inner) {
    if (!inner.hasAttribute('tabindex')) inner.setAttribute('tabindex', '-1');
    inner.focus({ preventScroll: true });
  }
}
export function closeOverlay(silent = false) {
  if (!openOverlayId) return;
  $('#' + openOverlayId).classList.remove('open');
  document.body.classList.remove('overlay-open');
  openOverlayId = null;
  if (!silent) blip('close');
}

/* ============================================================
   BOOT SEQUENCE
   ============================================================ */
export function runBoot(onDone) {
  const boot = $('#boot');
  const fill = $('#bootFill');
  const pct = $('#bootPct');
  const log = $('#bootLog');
  boot.classList.remove('done');
  fill.style.width = '0%';
  pct.textContent = '0%';
  log.innerHTML = '';
  blip('boot');

  const lines = BOOT_LINES.map((l) => {
    const d = document.createElement('div');
    d.className = 'line';
    d.textContent = '> ' + l;
    log.appendChild(d);
    return d;
  });
  const hint = document.createElement('div');
  hint.className = 'line hint';
  hint.textContent = BOOT_HINT;
  log.appendChild(hint);
  const ready = document.createElement('div');
  ready.className = 'line';
  ready.textContent = '> system ready';
  log.appendChild(ready);

  let p = 0;
  const timer = setInterval(() => {
    p = Math.min(100, p + 1.2 + Math.random() * 3.4);
    fill.style.width = p + '%';
    pct.textContent = Math.floor(p) + '%';
    lines.forEach((el, i) => { if (p > (i + 1) * 14) el.classList.add('on'); });
    if (p >= 100) {
      clearInterval(timer);
      ready.classList.add('on');
      hint.classList.add('on');
      setTimeout(() => {
        boot.classList.add('done');
        onDone && onDone();
      }, 520);
    }
  }, 74);
}

/* ============================================================
   CORK BOARD (career board)
   ============================================================ */
export function renderBoard() {
  const root = $('#boardCards');
  if (!root) return;
  root.innerHTML = TIMELINE_AWARDS.map((a) => `
    <div class="award-card">
      <span class="pin"></span>
      <div class="award-top">
        <span class="award-year">${a.year}</span>
        <span class="award-medal">${a.icon} ${a.medal}</span>
      </div>
      <div class="award-title">${t(a)}</div>
      <div class="award-sub">${a.sub}</div>
    </div>`).join('');
  const notes = $('#stickyNotes');
  notes.innerHTML = STICKY_NOTES.map((n) => `
    <div class="sticky"><span class="pin"></span>${t(n)}</div>`).join('');
  $('#profileZhName').textContent = PROFILE.nameZh;
  $('#profileEnName').textContent = PROFILE.nameEn;
  $('#profileBadges').innerHTML = PROFILE.badges
    .map((b) => `<span class="pb-badge">${t(b)}</span>`).join('<span class="pb-dot">·</span>');
  $('#profileSchool').textContent = t(PROFILE.schoolEn ? { en: PROFILE.schoolEn, zh: PROFILE.schoolZh } : '');
}

/* ============================================================
   SKILLS NOTEBOOK (keyboard)
   ============================================================ */
let skillPage = 0;
export function renderSkills() {
  const tabs = $('#nbTabs');
  const head = $('#nbHead');
  const chips = $('#nbChips');
  const prev = $('#nbPrev');
  const next = $('#nbNext');
  const page = $('#nbPage');
  if (!tabs) return;
  tabs.innerHTML = SKILL_PAGES.map((p, i) =>
    `<button class="nb-tab ${i === skillPage ? 'active' : ''}" data-p="${i}">${t(p.tab)}</button>`).join('');
  const p = SKILL_PAGES[skillPage];
  head.innerHTML = `<span class="zh">${t(p.head)}</span>`;
  chips.innerHTML = p.chips.map((c) => `<span class="chip">• ${c}</span>`).join('');
  prev.disabled = skillPage === 0;
  next.disabled = skillPage === SKILL_PAGES.length - 1;
  page.textContent = `PAGE ${skillPage + 1} / ${SKILL_PAGES.length}`;
  $$('.nb-tab', tabs).forEach((b) => b.addEventListener('click', () => {
    skillPage = +b.dataset.p;
    blip('click');
    renderSkills();
  }));
}

/* ============================================================
   CONTACT CARD (business card) + QR
   ============================================================ */
export function renderContact() {
  const card = $('#contactCard');
  if (!card) return;
  card.classList.remove('flipped');
  $('#ccEn').textContent = PROFILE.nameEn;
  $('#ccZh').textContent = PROFILE.nameZh;
  $('#ccRole').textContent = `${t(PROFILE.roleEn ? { en: PROFILE.roleEn, zh: PROFILE.roleZh } : '')}`;
  $('#ccRows').innerHTML = CONTACTS.rows.map((r) => `
    <a class="cc-row" href="${r.href}" target="_blank" rel="noopener">
      <span class="ic">${r.icon}</span><span>${r.text}</span>
    </a>`).join('');
  $('#ccScan').textContent = t(CONTACTS.qrCaption);
  const qrBox = $('#qrBox');
  if (qrBox && !qrBox.dataset.done && window.qrcode) {
    try {
      const qr = window.qrcode(0, 'M');
      qr.addData(CONTACTS.qrTarget);
      qr.make();
      qrBox.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
      qrBox.dataset.done = '1';
    } catch { qrBox.innerHTML = '<div style="padding:20px;font-size:12px">' + CONTACTS.qrTarget + '</div>'; }
  }
  $('#ccFlipHint').textContent = state.lang === 'zh' ? '○ 點擊翻面' : '○ CLICK TO FLIP';
  $('#ccCaption').textContent = state.lang === 'zh'
    ? 'CONTACT CARD — 點擊翻面' : 'CONTACT CARD — CLICK TO FLIP';
}

export function flipContact() {
  $('#contactCard').classList.toggle('flipped');
  blip('flip');
}

/* ============================================================
   PHOTO ALBUM (clipboard)
   ============================================================ */
let photoIdx = 0;
export function renderPhotos() {
  const stage = $('#albumStage');
  if (!stage) return;
  stage.innerHTML = PHOTOS.map((p, i) => {
    let rel = 'prev';
    if (i === photoIdx) rel = 'active';
    else if (i === (photoIdx + 1) % PHOTOS.length) rel = 'next';
    return `
    <figure class="photo-item ${rel}" data-i="${i}">
      <img src="${p.src}" alt="${t(p.titleEn ? { en: p.titleEn, zh: p.titleZh } : '')}" loading="lazy">
      <figcaption class="photo-cap">
        <b>${t({ en: p.titleEn, zh: p.titleZh })}</b>
        <span>${t({ en: p.descEn, zh: p.descZh })}</span>
      </figcaption>
    </figure>`;
  }).join('');
  $$('.photo-item', stage).forEach((el) => el.addEventListener('click', () => {
    const i = +el.dataset.i;
    if (i !== photoIdx) { photoIdx = i; blip('click'); renderPhotos(); }
    else window.open(PHOTOS[i].src, '_blank', 'noopener');
  }));
  $('#albumDots').innerHTML = PHOTOS.map((_, i) =>
    `<i class="${i === photoIdx ? 'on' : ''}" data-i="${i}"></i>`).join('');
  $$('#albumDots i').forEach((d) => d.addEventListener('click', () => {
    photoIdx = +d.dataset.i; blip('click'); renderPhotos();
  }));
}

/* ============================================================
   RETRO-OS
   ============================================================ */
const os = { wins: new Map(), zTop: 50, winCount: 0 };

function osIcon(icon) { return icon === 'folder' ? '📁' : '🗑️'; }

export function renderOSDesktop() {
  const left = $('#osIconsLeft');
  const right = $('#osIconsRight');
  left.innerHTML = PROJECTS.map((p, i) => `
    <button class="dicon" data-proj="${i}">
      <span class="di-ic">${osIcon(p.icon)}</span>
      <span class="di-lb">${t({ en: p.labelEn, zh: p.labelZh })}</span>
    </button>`).join('') + `
    <button class="dicon" data-bin="1">
      <span class="di-ic">🗑️</span>
      <span class="di-lb">${state.lang === 'zh' ? '回收站' : 'Recycle Bin'}</span>
    </button>`;
  const L = {
    profile: state.lang === 'zh' ? '個人簡介' : 'PROFILE.exe',
    skills: state.lang === 'zh' ? '技能清單' : 'SKILLS.txt',
    awards: state.lang === 'zh' ? '獲獎紀錄' : 'AWARDS.db',
    contact: state.lang === 'zh' ? '聯絡方式' : 'CONTACT.exe',
  };
  right.innerHTML = `
    <button class="dicon" data-act="board"><span class="di-ic">📄</span><span class="di-lb">${L.profile}</span></button>
    <button class="dicon" data-act="skills"><span class="di-ic">📃</span><span class="di-lb">${L.skills}</span></button>
    <button class="dicon" data-act="awards"><span class="di-ic">🗄️</span><span class="di-lb">${L.awards}</span></button>
    <button class="dicon" data-act="contact"><span class="di-ic">🖥️</span><span class="di-lb">${L.contact}</span></button>`;

  $$('#osIconsLeft .dicon').forEach((b) => b.addEventListener('click', () => {
    blip('click');
    if (b.dataset.bin) openBinWindow();
    else openProjectWindow(PROJECTS[+b.dataset.proj]);
  }));
  $$('#osIconsRight .dicon').forEach((b) => b.addEventListener('click', () => {
    blip('click');
    const act = b.dataset.act;
    if (act === 'awards') return openAwardsWindow();
    closeOverlay(true);
    ({ board: openBoard, skills: openSkills, contact: openContact }[act])();
  }));
  renderStartMenu();
  updateClock();
}

function renderStartMenu() {
  const sm = $('#startMenu');
  const M = [
    { ic: '📄', en: '簡歷 RESUME', zh: '簡歷 RESUME', act: 'board' },
    { ic: '🔧', en: '技能 SKILLS', zh: '技能 SKILLS', act: 'skills' },
    { ic: '🏆', en: '獎項 AWARDS', zh: '獎項 AWARDS', act: 'awards' },
    { ic: '💬', en: '聯絡 CONTACT', zh: '聯絡 CONTACT', act: 'contact' },
    { sep: true },
    { ic: '🖥️', en: '關機 SHUT DOWN', zh: '關機 SHUT DOWN', act: 'shutdown' },
  ];
  sm.innerHTML = `<div class="sm-side">RETRO-OS 95</div><div class="sm-items">` +
    M.map((m) => m.sep
      ? '<div class="sm-sep"></div>'
      : `<button class="sm-item" data-act="${m.act}"><span class="si">${m.ic}</span><span>${state.lang === 'zh' ? m.zh : m.en}</span></button>`
    ).join('') + '</div>';
  $$('.sm-item', sm).forEach((b) => b.addEventListener('click', () => {
    sm.classList.remove('open');
    $('#startBtn').classList.remove('on');
    blip('click');
    const act = b.dataset.act;
    if (act === 'shutdown') return shutdown();
    if (act === 'awards') return openAwardsWindow();
    closeOverlay(true);
    ({ board: openBoard, skills: openSkills, contact: openContact }[act])();
  }));
}

function makeWindow({ title, width, bodyHTML, bodyClass = '', onClose }) {
  const layer = $('#osWinLayer');
  const w = document.createElement('div');
  w.className = 'win98 ' + bodyClass;
  w.style.width = width || 'min(480px, 86%)';
  w.style.left = (60 + (os.winCount % 5) * 34) + 'px';
  w.style.top = (46 + (os.winCount % 5) * 30) + 'px';
  w.innerHTML = `
    <div class="win-title">
      <span class="wt-txt">${title}</span>
      <span class="wt-btns"><i data-a="min">_</i><i data-a="max">□</i><i data-a="close">×</i></span>
    </div>
    <div class="win-menubar"><span>File</span><span>Edit</span><span>View</span><span>Help</span></div>
    <div class="win-body">${bodyHTML}</div>`;
  layer.appendChild(w);
  os.winCount++;
  const rec = { el: w, title };
  os.wins.set(title, rec);

  // taskbar button
  const tb = document.createElement('button');
  tb.className = 'task-btn on';
  tb.textContent = title;
  tb.addEventListener('click', () => focusWindow(rec));
  $('#taskBtns').appendChild(tb);
  rec.taskBtn = tb;

  w.addEventListener('pointerdown', () => focusWindow(rec));
  $('[data-a="close"]', w).addEventListener('click', (e) => { e.stopPropagation(); closeWindow(rec); });
  $('[data-a="min"]', w).addEventListener('click', (e) => { e.stopPropagation(); w.style.display = 'none'; tb.classList.remove('on'); });
  $('[data-a="max"]', w).addEventListener('click', (e) => {
    e.stopPropagation();
    const max = w.dataset.max === '1';
    Object.assign(w.style, max
      ? { left: w.dataset.l, top: w.dataset.t, width: w.dataset.w }
      : { left: '2%', top: '3%', width: '96%' });
    w.dataset.max = max ? '' : '1';
    if (!max) { w.dataset.l = w.dataset.l || w.style.left; w.dataset.t = w.dataset.t || w.style.top; w.dataset.w = w.dataset.w || w.style.width; }
  });

  // drag by title bar
  const titleEl = $('.win-title', w);
  titleEl.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.wt-btns')) return;
    const r = w.getBoundingClientRect();
    const lr = layer.getBoundingClientRect();
    const ox = e.clientX - r.left, oy = e.clientY - r.top;
    const move = (ev) => {
      w.style.left = THREEclamp(ev.clientX - ox - lr.left, -40, lr.width - 80) + 'px';
      w.style.top = THREEclamp(ev.clientY - oy - lr.top, 0, lr.height - 60) + 'px';
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  });

  focusWindow(rec);
  if (onClose) rec.onClose = onClose;
  return rec;
}
function THREEclamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

function focusWindow(rec) {
  rec.el.style.display = '';
  rec.el.style.zIndex = ++os.zTop;
  rec.taskBtn.classList.add('on');
  $$('.win98', $('#osWinLayer')).forEach((el) => el.classList.remove('focus'));
  rec.el.classList.add('focus');
}

export function closeWindow(rec) {
  rec.el.remove();
  rec.taskBtn.remove();
  os.wins.delete(rec.title);
  blip('close');
}
export function closeTopWindow() {
  let top = null, z = -1;
  os.wins.forEach((rec) => {
    const zz = +rec.el.style.zIndex || 0;
    if (zz > z && rec.el.style.display !== 'none') { z = zz; top = rec; }
  });
  if (top) { closeWindow(top); return true; }
  return false;
}

export function openProjectWindow(p) {
  const html = `
    <div class="win-proj-title">${t({ en: p.titleEn, zh: p.titleZh })}<span class="win-badge">${p.badge}</span></div>
    <div class="win-chips">${p.chips.map((c) => `<span class="win-chip">${c}</span>`).join('')}</div>
    <ul>${p.bullets.map((b) => `<li>${t(b)}</li>`).join('')}</ul>
    <div class="win-foot">
      <span>${p.foot}</span>
      ${p.link ? `<a href="${p.link}" target="_blank" rel="noopener">${p.linkLabel || 'OPEN LINK ↗'}</a>` : ''}
    </div>`;
  makeWindow({ title: p.exe, bodyHTML: html });
  blip('open');
}

export function openBinWindow() {
  const quote = state.lang === 'zh'
    ? '「我走得很慢，但我從不後退」'
    : '"I am a slow walker, but I never walk backwards."';
  makeWindow({
    title: state.lang === 'zh' ? '回收站' : 'Recycle Bin',
    bodyHTML: `<div style="text-align:center;padding:26px 10px;">
      <div style="font-size:34px">🗑️</div>
      <p style="margin-top:12px;font-size:12px;color:#7b7770">0 items</p>
      <p style="margin-top:16px;font-size:14px;color:#37412e;font-weight:700">${quote}</p>
      <p style="margin-top:6px;font-size:11px;color:#8d897f">— ${PROFILE.nameEn} ${PROFILE.nameZh}</p>
    </div>`,
  });
  blip('open');
}

let awTab = 0;
export function openAwardsWindow() {
  markVisited('awards');
  const rec = makeWindow({
    title: state.lang === 'zh' ? '獲獎紀錄 AWARDS' : 'AWARDS — 60+ Honors',
    width: 'min(640px, 94%)',
    bodyHTML: awardTabsHTML(),
    bodyClass: 'wide',
  });
  rec.el.querySelector('.win-body').style.maxHeight = '340px';
  bindAwardTabs(rec.el);
  blip('open');
}

function awardTabsHTML() {
  return `
    <div class="aw-tabs">${AWARD_TABS.map((a, i) =>
      `<button class="aw-tab ${i === awTab ? 'active' : ''}" data-t="${i}">${state.lang === 'zh' ? a.labelZh : a.labelEn}</button>`).join('')}
    </div>
    <div class="aw-list">
      <div class="aw-cat">${t({ en: AWARD_TABS[awTab].titleEn, zh: AWARD_TABS[awTab].titleZh })}</div>
      ${AWARD_TABS[awTab].rows.map((r) => `
        <div class="aw-row"><span class="yr">${r.year}</span><span class="nm">${r.name}</span><span class="org">${r.sub}</span></div>`).join('')}
    </div>`;
}
function bindAwardTabs(root) {
  $$('.aw-tab', root).forEach((b) => b.addEventListener('click', () => {
    awTab = +b.dataset.t;
    blip('click');
    $('.win-body', root).innerHTML = awardTabsHTML();
    bindAwardTabs(root);
  }));
}

/* OS overlay wrapper — opens the full CRT overlay then desktop */
export function openOS() {
  markVisited('work');
  // fresh session every time the OS boots (shutdown/reboot clears windows)
  os.wins.forEach((rec) => { rec.el.remove(); rec.taskBtn.remove(); });
  os.wins.clear();
  os.winCount = 0;
  $('#osWinLayer').innerHTML = '';
  $('#taskBtns').innerHTML = '';
  $('#startMenu').classList.remove('open');
  renderOSDesktop();
  openOverlay('osOverlay');
}

/* ---------- shutdown / reboot ---------- */
function shutdown() {
  blip('shutdown');
  closeOverlay(true);
  setTimeout(() => $('#shutdown').classList.add('on'), 350);
}
export function reboot() {
  $('#shutdown').classList.remove('on');
  blip('boot');
  runBoot(() => window.__sceneIntro && window.__sceneIntro());
}

/* ---------- clock ---------- */
function updateClock() {
  const el = $('#osClock');
  if (!el) return;
  const d = new Date();
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  el.innerHTML = `🕓 ${h}:${m} ${ap}`;
}
setInterval(updateClock, 20000);

/* ============================================================
   OPEN HELPERS (hotspot + launcher targets)
   ============================================================ */
export function markVisited(id) {
  if (state.visited.has(id)) return;
  state.visited.add(id);
  localStorage.setItem('my-visited', JSON.stringify([...state.visited]));
  renderLauncher();
}

export function openBoard() { markVisited('profile'); renderBoard(); openOverlay('boardOverlay'); }
export function openSkills() { markVisited('skills'); renderSkills(); openOverlay('skillsOverlay'); }
export function openContact() { markVisited('contact'); renderContact(); openOverlay('contactOverlay'); }
export function openPhotos() { markVisited('moments'); renderPhotos(); openOverlay('photosOverlay'); }

/* ---- JOURNEY app (leadership & service, from the original site) ---- */
export function renderJourney() {
  const root = $('#journeyCards');
  if (!root) return;
  root.innerHTML = JOURNEY.map((j) => `
    <article class="jcard">
      <span class="jtag">${j.tag}</span>
      <h3 class="jtitle">${t({ en: j.titleEn, zh: j.titleZh })}</h3>
      <div class="jorg">${t({ en: j.orgEn, zh: j.orgZh })}</div>
      <p class="jdesc">${t({ en: j.descEn, zh: j.descZh })}</p>
      <ul class="jpoints">
        ${(state.lang === 'zh' ? j.pointsZh : j.pointsEn).map((p) => `<li>${p}</li>`).join('')}
      </ul>
    </article>`).join('');
}
export function openJourney() { markVisited('journey'); renderJourney(); openOverlay('journeyOverlay'); }

/* ---- AWARDS as a standalone app (same content as the OS window) ---- */
export function openAwardsOverlay() {
  renderAwardsOverlay();
  markVisited('awards');
  openOverlay('awardsOverlay');
}
function renderAwardsOverlay() {
  const root = $('#awardsOverlayBody');
  if (!root) return;
  root.innerHTML = awardTabsHTML();
  bindAwardTabs(root);
}

/* ============================================================
   LAUNCHER — persistent mini navigation with progress ticks
   ============================================================ */
export function renderLauncher() {
  const root = $('#launcher');
  if (!root) return;
  const items = root.querySelectorAll('.litem[data-app]');
  items.forEach((btn) => {
    const app = APPS.find((a) => a.id === btn.dataset.app);
    if (!app) return;
    $('.li-lb', btn).textContent = t({ en: app.en, zh: app.zh });
    btn.classList.toggle('seen', state.visited.has(app.id));
  });
  $('#tourItemLabel').textContent = state.lang === 'zh' ? '導覽' : 'TOUR';
  const prog = $('#launcherProg');
  if (prog) {
    const n = APPS.filter((a) => state.visited.has(a.id)).length;
    prog.textContent = `${n} / ${APPS.length}`;
    prog.setAttribute('aria-label', `${n} of ${APPS.length} sections explored`);
  }
}

export function openApp(id) {
  const map = {
    profile: openBoard, work: openOS, journey: openJourney,
    awards: openAwardsOverlay, skills: openSkills, moments: openPhotos, contact: openContact,
  };
  (map[id] || (() => {}))();
  document.body.classList.remove('launcher-open');
}

/* ============================================================
   FLOATING HOTSPOT LABELS (3D → screen projection)
   ============================================================ */
const HOT_MAP = { monitor: 'work', keyboard: 'skills', card: 'contact', board: 'profile', photos: 'moments' };

export function renderHotLabels() {
  const root = $('#hotLabels');
  if (!root) return;
  root.innerHTML = Object.entries(HOT_MAP).map(([hot, appId]) => {
    const app = APPS.find((a) => a.id === appId);
    return `<button class="hlab" data-hot="${hot}" aria-label="${t({ en: app.en, zh: app.zh })}">
      <span class="hl-dot"></span>${t({ en: app.en, zh: app.zh })}</button>`;
  }).join('');
}

/* delegated once on the persistent container — survives innerHTML re-renders */
export function initHotLabels() {
  const root = $('#hotLabels');
  if (!root || root.dataset.wired) return;
  root.dataset.wired = '1';
  root.addEventListener('click', (e) => {
    const b = e.target.closest('.hlab');
    if (!b) return;
    const app = HOT_MAP[b.dataset.hot];
    if (!app) return;
    blip('click');
    openApp(app);
  });
}

export function handleProject(positions) {
  const root = $('#hotLabels');
  if (!root || document.body.classList.contains('overlay-open') ||
      document.body.classList.contains('tour-open') ||
      !document.getElementById('boot').classList.contains('done')) {
    return;
  }
  $$('.hlab', root).forEach((b) => {
    const p = positions[b.dataset.hot];
    if (!p || !p.visible) { b.style.opacity = '0'; b.style.pointerEvents = 'none'; return; }
    b.style.opacity = '1';
    b.style.pointerEvents = 'auto';
    b.style.left = p.x + 'px';
    b.style.top = p.y + 'px';
  });
}

/* ============================================================
   IDENTITY PANEL — Level-1 "who am I" on the first screen
   ============================================================ */
export function renderIdentity() {
  const el = $('#idPanel');
  if (!el) return;
  $('#idNameEn').textContent = PROFILE.nameEn;
  $('#idNameZh').textContent = PROFILE.nameZh;
  $('#idRole').textContent = `${t({ en: PROFILE.roleEn, zh: PROFILE.roleZh })} · HK`;
  $('#idSchool').textContent = t({ en: PROFILE.schoolEn, zh: PROFILE.schoolZh });
  $('#idCta').textContent = state.lang === 'zh' ? '▶ 系統導覽' : '▶ SYSTEM TOUR';
}

/* ============================================================
   WELCOME (first visit) + GUIDED TOUR
   ============================================================ */
export function maybeShowWelcome() {
  if (localStorage.getItem('my-welcome')) return;
  const w = $('#welcomeOverlay');
  if (!w) return;
  w.classList.add('open');
  $('#wSys').textContent = t({ en: WELCOME.sysEn, zh: WELCOME.sysZh });
  $('#wBody').textContent = t({ en: WELCOME.bodyEn, zh: WELCOME.bodyZh });
  $('#wStart').textContent = t({ en: WELCOME.startEn, zh: WELCOME.startZh });
  $('#wExplore').textContent = t({ en: WELCOME.exploreEn, zh: WELCOME.exploreZh });
  blip('open');
}
function closeWelcome() {
  localStorage.setItem('my-welcome', '1');
  $('#welcomeOverlay').classList.remove('open');
}

let tourIdx = -1;
function tourSteps() {
  const steps = [{
    sel: '#idPanel',
    title: t({ en: TOUR.identityEn, zh: TOUR.identityZh }),
    body: t({ en: TOUR.identityBodyEn, zh: TOUR.identityBodyZh }),
  }];
  APPS.forEach((a) => steps.push({
    sel: `#launcher .litem[data-app="${a.id}"]`,
    title: `${a.num} / ${t({ en: a.en, zh: a.zh })}`,
    body: t({ en: a.tourEn, zh: a.tourZh }),
  }));
  return steps;
}

export function startTour() {
  closeOverlay(true);
  document.body.classList.remove('launcher-open');
  closeWelcome();
  tourIdx = 0;
  document.body.classList.add('tour-open');
  blip('open');
  renderTour();
}

function endTour() {
  tourIdx = -1;
  localStorage.setItem('my-welcome', '1');
  document.body.classList.remove('tour-open');
  $$('.tour-hl').forEach((el) => el.classList.remove('tour-hl'));
}

function renderTour() {
  const layer = $('#tourLayer');
  const steps = tourSteps();
  const done = tourIdx >= steps.length;
  const step = steps[tourIdx];
  $$('.tour-hl').forEach((el) => el.classList.remove('tour-hl'));
  if (!done) {
    const target = $(step.sel);
    if (target) target.classList.add('tour-hl');
    $('#tourTitle').textContent = step.title;
    $('#tourBody').textContent = step.body;
    $('#tourProg').textContent = `STEP ${tourIdx + 1} / ${steps.length}`;
    $('#tourBack').style.visibility = tourIdx === 0 ? 'hidden' : 'visible';
    $('#tourNext').textContent = t({ en: TOUR.nextEn, zh: TOUR.nextZh });
  } else {
    $('#tourTitle').textContent = t({ en: TOUR.doneTitleEn, zh: TOUR.doneTitleZh });
    $('#tourBody').textContent = t({ en: TOUR.doneEn, zh: TOUR.doneZh });
    $('#tourProg').textContent = '100%';
    $('#tourBack').style.visibility = 'visible';
    $('#tourNext').textContent = t({ en: TOUR.exploreEn, zh: TOUR.exploreZh });
  }
  $('#tourSkip').textContent = t({ en: TOUR.skipEn, zh: TOUR.skipZh });
}

function tourNext() {
  blip('click');
  if (tourIdx >= tourSteps().length) { endTour(); return; }
  tourIdx++;
  renderTour();
}
function tourBack() {
  blip('click');
  if (tourIdx <= 0) return;
  tourIdx--;
  renderTour();
}
function tourSkip() {
  blip('close');
  endTour();
}


/* ============================================================
   GLOBAL WIRING
   ============================================================ */
export function renderAll() {
  renderBoard();
  renderSkills();
  renderContact();
  renderPhotos();
  renderJourney();
  renderLauncher();
  renderIdentity();
  renderHotLabels();
  if (overlayOpen('awardsOverlay')) renderAwardsOverlay();
  if (overlayOpen('osOverlay')) renderOSDesktop();
  // refresh open project windows' language
  os.wins.forEach((rec) => {
    if (rec.el.dataset.langApplied && rec.el.dataset.langApplied !== state.lang) {
      rec.el.querySelector('.win-body');
    }
    rec.el.dataset.langApplied = state.lang;
  });
}

export function initUI(sceneCtl) {
  // hotspot dispatch
  const actions = {
    monitor: openOS,
    keyboard: openSkills,
    card: openContact,
    board: openBoard,
    photos: openPhotos,
  };
  window.__sceneSelect = (id) => actions[id] && actions[id]();
  window.__sceneIntro = () => sceneCtl && sceneCtl.intro();

  // launcher navigation
  initHotLabels();
  $$('#launcher .litem[data-app]').forEach((b) =>
    b.addEventListener('click', () => { blip('click'); openApp(b.dataset.app); }));
  $('#tourItem').addEventListener('click', () => { blip('click'); startTour(); });
  $('#launcherToggle').addEventListener('click', () => {
    blip('click');
    const open = document.body.classList.toggle('launcher-open');
    $('#launcherToggle').setAttribute('aria-expanded', String(open));
  });
  // click outside the launcher sheet closes it (mobile)
  document.addEventListener('click', (e) => {
    if (document.body.classList.contains('launcher-open') &&
        !e.target.closest('#launcher') && !e.target.closest('#launcherToggle')) {
      document.body.classList.remove('launcher-open');
    }
  });

  // welcome dialog
  $('#wStart').addEventListener('click', () => { closeWelcome(); startTour(); });
  $('#wExplore').addEventListener('click', () => { closeWelcome(); blip('click'); });

  // identity panel: minimize + tour CTA
  $('#idCta').addEventListener('click', () => { blip('click'); startTour(); });
  $('#idClose').addEventListener('click', () => {
    blip('close');
    document.body.classList.add('id-mini');
  });

  // guided tour controls
  $('#tourNext').addEventListener('click', tourNext);
  $('#tourBack').addEventListener('click', tourBack);
  $('#tourSkip').addEventListener('click', tourSkip);
  window.__tourSkip = tourSkip;

  // close buttons / hints
  $('#hintClose').addEventListener('click', () => {
    if (overlayOpen('osOverlay') && closeTopWindow()) return;
    closeOverlay();
  });

  // contact flip
  $('#contactCard').addEventListener('click', (e) => {
    if (!e.target.closest('a')) flipContact();
  });

  // skills notebook nav
  $('#nbPrev').addEventListener('click', () => { if (skillPage > 0) { skillPage--; blip('click'); renderSkills(); } });
  $('#nbNext').addEventListener('click', () => { if (skillPage < SKILL_PAGES.length - 1) { skillPage++; blip('click'); renderSkills(); } });

  // photos nav
  $('#albumPrev').addEventListener('click', () => { photoIdx = (photoIdx - 1 + PHOTOS.length) % PHOTOS.length; blip('click'); renderPhotos(); });
  $('#albumNext').addEventListener('click', () => { photoIdx = (photoIdx + 1) % PHOTOS.length; blip('click'); renderPhotos(); });

  // OS start button + overlay backdrop click
  $('#startBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    $('#startMenu').classList.toggle('open');
    $('#startBtn').classList.toggle('on');
    blip('click');
  });
  document.addEventListener('click', (e) => {
    const sm = $('#startMenu');
    if (sm.classList.contains('open') && !e.target.closest('.start-menu') && !e.target.closest('#startBtn')) {
      sm.classList.remove('open');
      $('#startBtn').classList.remove('on');
    }
  });
  $$('.overlay').forEach((ov) => {
    ov.addEventListener('click', (e) => {
      if (e.target === ov) {
        if (ov.id === 'osOverlay') return; // OS needs explicit close (like template)
        if (ov.id === 'welcomeOverlay') { closeWelcome(); return; }
        closeOverlay();
      }
    });
  });
  // ESC closes topmost thing
  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (document.body.classList.contains('tour-open')) { tourSkip(); return; }
    if ($('#welcomeOverlay').classList.contains('open')) { closeWelcome(); return; }
    if ($('#shutdown').classList.contains('on')) return;
    if (overlayOpen('osOverlay')) {
      if (closeTopWindow()) return;
      closeOverlay();
      return;
    }
    if (openOverlayId) closeOverlay();
  });

  // language chip
  $('#langChip').addEventListener('click', () => {
    blip('click');
    setLang(state.lang === 'en' ? 'zh' : 'en');
  });

  // sound / motion chips
  const soundChip = $('#soundChip');
  const motionChip = $('#motionChip');
  function syncChips() {
    soundChip.classList.toggle('on', state.sound);
    soundChip.textContent = state.sound ? '♪ SOUND ON' : '♪ SOUND OFF';
    motionChip.classList.toggle('on', state.motion);
    motionChip.textContent = state.motion ? '◉ MOTION ON' : '◉ MOTION OFF';
    document.body.classList.toggle('reduce-motion', !state.motion);
  }
  soundChip.addEventListener('click', () => {
    state.sound = !state.sound;
    localStorage.setItem('my-sound', state.sound ? 'on' : 'off');
    syncChips();
    blip('click');
  });
  motionChip.addEventListener('click', () => {
    state.motion = !state.motion;
    localStorage.setItem('my-motion', state.motion ? 'on' : 'off');
    syncChips();
    if (sceneCtl) sceneCtl.setReduceMotion(!state.motion);
    blip('click');
  });
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    state.motion = false;
    localStorage.setItem('my-motion', 'off');
  }
  syncChips();
  sceneCtl && sceneCtl.setReduceMotion(!state.motion);

  // shutdown reboot button
  $('#rebootBtn').addEventListener('click', reboot);
}
