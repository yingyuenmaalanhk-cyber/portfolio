/* ==========================================================================
   config.js — Security gate configuration (LIVE).
   Turnstile widget: portfolio-gate (domain: yingyuenmaalanhk-cyber.github.io)
   Backend: Cloudflare Worker "mayingyuen-gate" — validates every token
   server-side via Cloudflare siteverify. The Secret Key lives ONLY in the
   Worker's encrypted secrets, never in this file.
   ========================================================================== */

export const SECURITY = {
  siteKey: '0x4AAAAAAFDHcnqULLffCLuG',

  endpoint: 'https://mayingyuen-gate.mayingyuen-gate.workers.dev',

  // How long a verified session lasts before re-verification (hours).
  // The Worker issues the signed session token; this only controls UX copy.
  sessionHours: 12,
};
