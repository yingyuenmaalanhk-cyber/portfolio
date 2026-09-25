/* ==========================================================================
   main.js — entry point: waits for fonts, builds the 3D scene, wires UI.
   ========================================================================== */

import { buildScene } from './scene.js';
import { initUI, runBoot, setLang, state, blip, handleProject, maybeShowWelcome } from './ui.js';

async function start() {
  // Make sure the pixel + handwriting fonts are ready before baking
  // canvas textures (posters, notepad, business card).
  try {
    await Promise.race([
      document.fonts.load('16px "Press Start 2P"').then(() => document.fonts.load('700 30px "Caveat"')),
      new Promise((r) => setTimeout(r, 2500)),
    ]);
  } catch { /* fonts optional — fallbacks are fine */ }

  const sceneCtl = buildScene(document.getElementById('sceneLayer'), {
    reduceMotion: !state.motion,
    onHover: (id) => { if (id) blip('hover'); },
    onSelect: (id) => { window.__sceneSelect && window.__sceneSelect(id); },
    onProject: (positions) => handleProject(positions),
  });
  window.__sceneIntro = () => sceneCtl.intro();

  initUI(sceneCtl);
  setLang(state.lang);

  runBoot(() => {
    sceneCtl.intro();
    setTimeout(maybeShowWelcome, 700);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
