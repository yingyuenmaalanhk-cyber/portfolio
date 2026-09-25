/* ==========================================================================
   config.js — Security gate configuration.
   --------------------------------------------------------------------------
   1. Create a Turnstile widget at https://dash.cloudflare.com/?to=/:account/turnstile
      → copy the SITE KEY here (public, safe to expose).
   2. Deploy the Cloudflare Worker in /worker (see worker/README.md)
      → `wrangler secret put TURNSTILE_SECRET`  (the SECRET key, never here)
      → `wrangler secret put SESSION_SECRET`    (any long random string)
      → copy the worker URL (https://…workers.dev) here as endpoint.
   Until both are filled in, the gate runs in clearly-labelled PREVIEW mode.
   ========================================================================== */

export const SECURITY = {
  // Cloudflare Turnstile TEST site key — always passes, for development only.
  // Replace with your real site key (starts with "0x").
  siteKey: '1x00000000000000000000AA',

  // Cloudflare Worker endpoint that performs server-side verification.
  // e.g. 'https://mayingyuen-gate.your-subdomain.workers.dev'
  // Leave '' to run the gate in preview mode (verification offline).
  endpoint: '',

  // How long a verified session lasts before re-verification (hours).
  // The Worker issues the signed session token; this only controls UX copy.
  sessionHours: 12,
};
