/* ==========================================================================
   gate.js — Secure entry gate.
   Real human verification via Cloudflare Turnstile + server-side validation
   in a Cloudflare Worker (see /worker). The secret key never touches the
   frontend. Session tokens are signed server-side (HMAC) and re-validated
   by the server on every visit — localStorage is only transport, never proof.
   ========================================================================== */

import { SECURITY } from './config.js';

const $ = (s) => document.querySelector(s);

const state = {
  session: localStorage.getItem('my-session') || '',
};

// localhost is never in the Turnstile domain allowlist, so local development
// falls back to preview mode; production domains always run real verification.
export const isPreviewMode = () => !SECURITY.endpoint || location.hostname === 'localhost' || location.hostname === '127.0.0.1';

function setStatus(lines) {
  const box = $('#gateStatus');
  if (!box) return;
  if (!Array.isArray(lines)) lines = [lines];
  box.innerHTML = lines
    .map((l) => (l.startsWith('<span') ? l : `<span class="gs-line">${l}</span>`))
    .join('');
}

function gateFail(msgEn, msgZh) {
  const zh = document.documentElement.lang === 'zh-HK';
  setStatus(`<span class="gs-line fail">${zh ? msgZh : msgEn}</span>`);
  $('#gateRetryBtn').hidden = false;
}

function gatePreview(msgEn, msgZh) {
  const zh = document.documentElement.lang === 'zh-HK';
  setStatus(`<span class="gs-line warn">${zh ? msgZh : msgEn}</span>`);
  $('#gatePreviewBtn').hidden = false;
}

function loadTurnstile() {
  return new Promise((resolve, reject) => {
    if (window.turnstile) return resolve();
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true;
    s.onload = resolve;
    s.onerror = () => reject(new Error('turnstile-load-failed'));
    document.head.appendChild(s);
  });
}

let widgetId = null;
async function renderWidget() {
  await loadTurnstile();
  if (widgetId !== null) return;
  widgetId = window.turnstile.render('#gateWidget', {
    sitekey: SECURITY.siteKey,
    theme: 'dark',
    retry: 'never',
    callback: () => onTokenReady(),
    'error-callback': () => gateFail('VERIFICATION ERROR — please try again.', '驗證錯誤 — 請重試。'),
    'expired-callback': () => gateFail('VERIFICATION EXPIRED — please try again.', '驗證已過期 — 請重試。'),
  });
}

let lastToken = '';
function onTokenReady() {
  lastToken = window.turnstile.getResponse(widgetId) || '';
  setStatus('<span class="gs-line">SYSTEM STATUS ......... VERIFYING</span>');
  verifyWithServer(lastToken);
}

async function verifyWithServer(token) {
  try {
    const res = await fetch(SECURITY.endpoint + '/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    if (!res.ok) throw new Error('verify-failed');
    const data = await res.json();
    if (!data.ok || !data.session) throw new Error('verify-rejected');
    state.session = data.session;
    localStorage.setItem('my-session', data.session);
    accessGranted('HUMAN VERIFICATION .... PASS');
  } catch {
    // Never reveal internal details.
    gateFail('VERIFICATION FAILED — human verification could not be completed. Please try again.',
             '驗證失敗 — 無法完成人類驗證，請重試。');
    if (widgetId !== null && window.turnstile) {
      window.turnstile.reset(widgetId);
    }
  }
}

/* Returning visitors: re-validate the stored session SERVER-SIDE. */
async function checkSession() {
  setStatus('<span class="gs-line">RESTORING SECURE SESSION ...</span>');
  try {
    const res = await fetch(SECURITY.endpoint + '/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session: state.session }),
    });
    if (!res.ok) throw new Error('session-invalid');
    const data = await res.json();
    if (!data.ok) throw new Error('session-rejected');
    accessGranted('SECURE SESSION ...... VALID');
    return true;
  } catch {
    localStorage.removeItem('my-session');
    state.session = '';
    return false;
  }
}

let onPassCallback = null;

function accessGranted(extraLine) {
  const zh = document.documentElement.lang === 'zh-HK';
  setStatus([
    'IDENTITY CHECK ........ PASS',
    extraLine,
    'SECURE CHANNEL ........ READY',
    'SYSTEM STATUS ......... ONLINE',
  ].map((l) => `<span class="gs-line ok">${l}</span>`).join(''));
  setTimeout(() => {
    const gate = $('#gateOverlay');
    gate.classList.add('granted');
    setStatus([
      '<span class="gs-line ok big">ACCESS GRANTED</span>',
      '<span class="gs-line">INITIALIZING MA YING YUEN OS...</span>',
    ]);
    setTimeout(() => {
      gate.classList.add('done');
      document.body.classList.add('gate-passed');
      onPassCallback && onPassCallback();
    }, 900);
  }, 700);
}

function enterPreview() {
  localStorage.setItem('my-gate-preview', '1');
  const badge = $('#secBadge');
  if (badge) badge.hidden = false;
  accessGranted('VERIFICATION ....... OFFLINE');
}

export function initGate(onPass) {
  onPassCallback = onPass;
  const gate = $('#gateOverlay');
  gate.classList.remove('done', 'granted');
  document.body.classList.remove('gate-passed');

  $('#gateRetryBtn').addEventListener('click', () => {
    $('#gateRetryBtn').hidden = true;
    setStatus('<span class="gs-line">SYSTEM STATUS ......... WAITING</span>');
    if (isPreviewMode()) return;
    renderWidget();
  });
  $('#gatePreviewBtn').addEventListener('click', enterPreview);

  const isReturnPreview = isPreviewMode() && localStorage.getItem('my-gate-preview');

  if (isPreviewMode()) {
    // No backend configured yet — be honest: verification is OFFLINE.
    $('#gateWidgetBox').classList.add('offline');
    if (isReturnPreview) {
      const badge = $('#secBadge');
      if (badge) badge.hidden = false;
      // returning preview visitor: short status, straight in
      setStatus([
        '<span class="gs-line warn">SECURITY MODULE ..... OFFLINE</span>',
        '<span class="gs-line ok">PREVIEW SESSION ..... ACTIVE</span>',
      ]);
      setTimeout(() => {
        gate.classList.add('done');
        document.body.classList.add('gate-passed');
        onPassCallback && onPassCallback();
      }, 900);
      return;
    }
    setStatus([
      '<span class="gs-line warn">SECURITY MODULE ..... OFFLINE</span>',
      '<span class="gs-line">VERIFICATION UNAVAILABLE — PREVIEW ACCESS ONLY</span>',
    ]);
    gatePreview('Verification module is offline. Preview access is clearly marked as UNVERIFIED.',
                '驗證模組離線。預覽通道將清楚標示為「未驗證」。');
    return;
  }

  // Real verification path
  $('#secBadge').hidden = true;
  if (state.session) {
    checkSession().then((valid) => {
      if (!valid) renderWidget();
    });
  } else {
    renderWidget();
  }
}
