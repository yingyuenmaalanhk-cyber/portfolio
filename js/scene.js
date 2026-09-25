/* ==========================================================================
   scene.js — "Future Workspace": Ma Ying Yuen's near-future personal
   creative lab. Procedural Three.js, all textures canvas-generated.
   Hotspots: display→work · keyboard→skills · card→contact ·
             notepad→profile · clipboard→photos · lamp→light toggle
   ========================================================================== */

import * as THREE from 'three';

const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

/* ---------- canvas texture helper ---------- */
function makeTex(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  draw(ctx, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

const TECH = '"Chakra Petch", "Noto Sans TC", sans-serif';

/* ============================================================
   LIVE SCREENS (canvas textures with subtle animation)
   ============================================================ */

/* --- future display: smart-city · spatial-data dashboard --- */
class DashboardScreen {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1024; this.canvas.height = 512;
    this.ctx = this.canvas.getContext('2d');
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.acc = 99; // draw first frame immediately
    this.t = 0;
    this.dots = Array.from({ length: 14 }, () => ({
      x: 60 + Math.random() * 500,
      y: 90 + Math.random() * 330,
      r: 2 + Math.random() * 3,
      ph: Math.random() * 6.28,
    }));
  }
  update(dt, motion) {
    this.t += dt;
    this.acc += dt;
    if (this.acc < (motion ? 0.5 : 999)) return;
    this.acc = 0;
    const x = this.ctx, W = 1024, H = 512;
    x.fillStyle = '#0b120d'; x.fillRect(0, 0, W, H);
    x.fillStyle = '#111b14'; x.fillRect(0, 0, W, 54);
    x.fillStyle = '#7CFF9E';
    x.font = `600 26px ${TECH}`;
    x.fillText('SMART CITY · SPATIAL DATA', 26, 36);
    x.fillStyle = '#5a7a62';
    x.font = `500 20px ${TECH}`;
    x.fillText('MA YING YUEN — LAB CONSOLE', 470, 36);
    x.fillStyle = '#7CFF9E';
    x.fillText('● LIVE', 930, 36);
    // map panel (left)
    x.fillStyle = '#0e1a12'; x.fillRect(24, 74, 570, 414);
    x.strokeStyle = 'rgba(124,255,158,0.18)'; x.lineWidth = 1;
    for (let gx = 24; gx <= 594; gx += 38) { x.beginPath(); x.moveTo(gx, 74); x.lineTo(gx, 488); x.stroke(); }
    for (let gy = 74; gy <= 488; gy += 38) { x.beginPath(); x.moveTo(24, gy); x.lineTo(594, gy); x.stroke(); }
    x.strokeStyle = 'rgba(200,201,188,0.28)'; x.lineWidth = 5;
    x.beginPath(); x.moveTo(24, 200); x.lineTo(594, 160); x.stroke();
    x.beginPath(); x.moveTo(24, 340); x.lineTo(594, 400); x.stroke();
    x.beginPath(); x.moveTo(200, 74); x.lineTo(300, 488); x.stroke();
    x.beginPath(); x.moveTo(430, 74); x.lineTo(380, 488); x.stroke();
    x.strokeStyle = 'rgba(124,255,158,0.5)'; x.lineWidth = 2;
    x.strokeRect(90, 100, 130, 90); x.strokeRect(330, 240, 150, 110); x.strokeRect(120, 380, 110, 70);
    for (const d of this.dots) {
      const a = motion ? 0.35 + 0.65 * Math.abs(Math.sin(this.t * 1.4 + d.ph)) : 0.8;
      x.fillStyle = `rgba(124,255,158,${a})`;
      x.beginPath(); x.arc(d.x, d.y, d.r, 0, 7); x.fill();
    }
    const mx = 330 + Math.sin(this.t * 0.5) * 40, my = 240 + Math.cos(this.t * 0.4) * 26;
    x.strokeStyle = '#B6FFC7'; x.lineWidth = 2;
    x.beginPath(); x.arc(mx, my, 10 + (motion ? (this.t % 1) * 12 : 4), 0, 7); x.stroke();
    x.fillStyle = '#B6FFC7'; x.beginPath(); x.arc(mx, my, 5, 0, 7); x.fill();
    // stats panel (right)
    x.fillStyle = '#0e1a12'; x.fillRect(618, 74, 382, 414);
    x.fillStyle = '#5a7a62'; x.font = `600 19px ${TECH}`;
    x.fillText('DISTRICT MONITOR', 642, 108);
    const bars = [
      ['FLOW', 0.72], ['AIR Q', 0.41], ['TRANSIT', 0.58], ['SENSOR NET', 0.86],
    ];
    bars.forEach(([lb, v], i) => {
      const by = 140 + i * 62;
      x.fillStyle = '#8fa392'; x.font = `500 17px ${TECH}`; x.fillText(lb, 642, by);
      x.fillStyle = '#16221a'; x.fillRect(642, by + 10, 330, 14);
      x.fillStyle = '#7CFF9E'; x.fillRect(642, by + 10, 330 * v, 14);
    });
    x.fillStyle = '#3f9e63'; x.font = `500 17px ${TECH}`;
    const lines = ['> python spatial_analysis.py', '> qgis --render district_07', '> arduino sensor_net --sync'];
    lines.forEach((l, i) => x.fillText(l, 642, 420 + i * 26));
    this.texture.needsUpdate = true;
  }
}

/* --- printer mini display --- */
class PrinterScreen {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 256; this.canvas.height = 128;
    this.ctx = this.canvas.getContext('2d');
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
  }
  update(progress) {
    const x = this.ctx, W = 256, H = 128;
    x.fillStyle = '#0b120d'; x.fillRect(0, 0, W, H);
    x.fillStyle = '#7CFF9E'; x.font = `600 17px ${TECH}`;
    x.fillText('PRINTING', 14, 30);
    x.fillStyle = '#8fa392'; x.font = `500 13px ${TECH}`;
    x.fillText('smart_city_model.gcode', 14, 54);
    const pct = Math.floor(progress * 100);
    x.fillStyle = '#5a7a62'; x.font = `600 20px ${TECH}`;
    x.fillText(pct + '%', 200, 54);
    x.fillStyle = '#16221a'; x.fillRect(14, 78, 228, 12);
    x.fillStyle = '#7CFF9E'; x.fillRect(14, 78, 228 * progress, 12);
    x.fillStyle = '#3f9e63'; x.font = `500 12px ${TECH}`;
    x.fillText('LAYER ' + Math.max(1, Math.floor(progress * 42)) + ' / 42', 14, 112);
    this.texture.needsUpdate = true;
  }
}

/* --- wall display: mini live map --- */
class WallScreen {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 512; this.canvas.height = 320;
    this.ctx = this.canvas.getContext('2d');
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.acc = 99; this.t = 0;
  }
  update(dt, motion) {
    this.t += dt; this.acc += dt;
    if (this.acc < (motion ? 1 : 999)) return;
    this.acc = 0;
    const x = this.ctx, W = 512, H = 320;
    x.fillStyle = '#0b120d'; x.fillRect(0, 0, W, H);
    x.strokeStyle = 'rgba(124,255,158,0.14)'; x.lineWidth = 1;
    for (let gx = 0; gx <= W; gx += 32) { x.beginPath(); x.moveTo(gx, 0); x.lineTo(gx, H); x.stroke(); }
    for (let gy = 0; gy <= H; gy += 32) { x.beginPath(); x.moveTo(0, gy); x.lineTo(W, gy); x.stroke(); }
    x.strokeStyle = 'rgba(200,201,188,0.3)'; x.lineWidth = 4;
    x.beginPath(); x.moveTo(0, 110); x.lineTo(W, 80); x.stroke();
    x.beginPath(); x.moveTo(0, 230); x.lineTo(W, 260); x.stroke();
    x.beginPath(); x.moveTo(170, 0); x.lineTo(240, H); x.stroke();
    const px = 60 + ((this.t * 22) % (W - 80)), py = 100 + Math.sin(this.t * 0.8) * 18;
    x.fillStyle = '#B6FFC7'; x.beginPath(); x.arc(px, py, 6, 0, 7); x.fill();
    x.strokeStyle = 'rgba(182,255,199,0.5)';
    x.beginPath(); x.arc(px, py, 14, 0, 7); x.stroke();
    x.fillStyle = '#7CFF9E'; x.font = `600 18px ${TECH}`;
    x.fillText('LIVE · SPATIAL FEED', 16, 36);
    this.texture.needsUpdate = true;
  }
}

/* ============================================================
   STATIC TEXTURES
   ============================================================ */

function woodTex() {
  return makeTex(512, 256, (x, w, h) => {
    x.fillStyle = '#5c4128'; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 60; i++) {
      x.strokeStyle = `rgba(${Math.random() > 0.5 ? '25,16,8' : '92,66,42'},${0.12 + Math.random() * 0.15})`;
      x.lineWidth = 1 + Math.random() * 2.4;
      const y0 = Math.random() * h;
      x.beginPath(); x.moveTo(0, y0);
      for (let px = 0; px <= w; px += 32) x.lineTo(px, y0 + Math.sin(px * 0.02 + i) * 4);
      x.stroke();
    }
  });
}

function noteTex(label, lines) {
  return makeTex(220, 170, (x, w, h) => {
    x.fillStyle = '#F3F0DF'; x.fillRect(0, 0, w, h);
    x.strokeStyle = 'rgba(0,0,0,0.08)'; x.strokeRect(1, 1, w - 2, h - 2);
    x.fillStyle = '#3c3628';
    x.font = `16px "Press Start 2P", monospace`;
    x.textAlign = 'center';
    x.fillText(label, w / 2, 48);
    x.strokeStyle = 'rgba(60,54,40,0.5)'; x.lineWidth = 2; x.lineCap = 'round';
    let y = 84;
    for (let i = 0; i < lines; i++) {
      const len = 60 + Math.random() * 90;
      x.beginPath(); x.moveTo((w - len) / 2, y); x.lineTo((w + len) / 2, y); x.stroke();
      y += 22;
    }
  });
}

function heartTex() {
  return makeTex(256, 256, (x, w, h) => {
    x.fillStyle = '#0c0e0c'; x.fillRect(0, 0, w, h);
    x.strokeStyle = '#57d877'; x.lineWidth = 8; x.strokeRect(8, 8, w - 16, h - 16);
    const m = ['01100110', '11111111', '11111111', '11111111', '01111110', '00111100', '00011000'];
    const s = 26, ox = (w - 8 * s) / 2, oy = (h - 7 * s) / 2;
    m.forEach((row, ry) => [...row].forEach((v, rx) => {
      if (v === '1') {
        x.fillStyle = (rx + ry) % 2 ? '#e86a8a' : '#f28aa6';
        x.fillRect(ox + rx * s, oy + ry * s, s - 2, s - 2);
      }
    }));
  });
}

function helloTex() {
  return makeTex(560, 460, (x, w, h) => {
    x.fillStyle = '#F3F0DF'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#191713';
    x.font = `40px "Press Start 2P", monospace`;
    x.textAlign = 'center';
    x.fillText('HELLO,', w / 2, 165);
    x.fillText('WORLD!', w / 2, 235);
    x.fillStyle = '#a09a8c'; x.font = `13px "Press Start 2P", monospace`;
    x.fillText('404: SLEEP NOT FOUND', w / 2, 330);
  });
}

function blueprintTex() {
  return makeTex(512, 680, (x, w, h) => {
    x.fillStyle = '#F3F0DF'; x.fillRect(0, 0, w, h);
    const ink = '#2f6b45';
    x.strokeStyle = 'rgba(47,107,69,0.5)'; x.lineWidth = 1;
    for (let gx = 20; gx < w - 20; gx += 32) { x.beginPath(); x.moveTo(gx, 20); x.lineTo(gx, h - 20); x.stroke(); }
    for (let gy = 20; gy < h - 20; gy += 32) { x.beginPath(); x.moveTo(20, gy); x.lineTo(w - 20, gy); x.stroke(); }
    x.strokeStyle = ink; x.lineWidth = 3; x.strokeRect(24, 24, w - 48, h - 48);
    x.lineWidth = 2.5;
    x.strokeRect(60, 70, 130, 100); x.strokeRect(210, 70, 100, 100);
    x.strokeRect(60, 200, 250, 90); x.strokeRect(330, 90, 120, 180);
    x.strokeRect(340, 300, 110, 130); x.strokeRect(80, 330, 140, 160);
    x.beginPath(); x.moveTo(60, 180); x.lineTo(460, 180); x.stroke();
    x.beginPath(); x.moveTo(60, 310); x.lineTo(460, 310); x.stroke();
    x.beginPath(); x.moveTo(190, 24); x.lineTo(190, h - 24); x.stroke();
    x.beginPath(); x.moveTo(320, 24); x.lineTo(320, h - 24); x.stroke();
    x.save(); x.beginPath(); x.rect(60, 200, 250, 90); x.clip();
    x.lineWidth = 1.5;
    for (let d = -90; d < 260; d += 12) { x.beginPath(); x.moveTo(60 + d, 200); x.lineTo(60 + d + 90, 290); x.stroke(); }
    x.restore();
    x.fillStyle = ink; x.font = `600 20px ${TECH}`; x.textAlign = 'left';
    x.fillText('SMART CITY · DISTRICT 07', 40, h - 64);
    x.font = `500 15px ${TECH}`;
    x.fillText('spatial plan — M.Y.  ·  scale 1:500', 40, h - 40);
    x.beginPath(); x.moveTo(w - 70, 60); x.lineTo(w - 70, 110); x.stroke();
    x.beginPath(); x.moveTo(w - 70, 52); x.lineTo(w - 78, 68); x.lineTo(w - 62, 68); x.closePath(); x.fill();
  });
}

function keyboardTex() {
  return makeTex(1024, 320, (x, w, h) => {
    x.fillStyle = '#12180f'; x.fillRect(0, 0, w, h);
    const kw = 52, kh = 44, gap = 10;
    const legends = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G'];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 15; c++) {
        const kx = 60 + c * (kw + gap), ky = 34 + r * (kh + gap);
        x.fillStyle = '#1c241d';
        x.fillRect(kx, ky, kw, kh);
        x.strokeStyle = 'rgba(124,255,158,0.25)'; x.lineWidth = 1.5;
        x.strokeRect(kx + 3, ky + 3, kw - 6, kh - 6);
        x.fillStyle = 'rgba(124,255,158,0.35)';
        x.font = `600 15px ${TECH}`;
        x.textAlign = 'center';
        x.fillText(legends[c] || '·', kx + kw / 2, ky + kh / 2 + 5);
      }
    }
    x.fillStyle = '#1c241d'; x.fillRect(300, 234, 420, 52);
    x.strokeStyle = 'rgba(124,255,158,0.25)'; x.strokeRect(303, 237, 414, 46);
  });
}

function pcbTex() {
  return makeTex(512, 320, (x, w, h) => {
    x.fillStyle = '#14532d'; x.fillRect(0, 0, w, h);
    x.strokeStyle = 'rgba(200,255,210,0.35)'; x.lineWidth = 3;
    for (let i = 0; i < 14; i++) {
      x.beginPath();
      x.moveTo(30 + Math.random() * (w - 60), 30 + Math.random() * (h - 60));
      x.lineTo(30 + Math.random() * (w - 60), 30 + Math.random() * (h - 60));
      x.stroke();
    }
    for (let i = 0; i < 40; i++) {
      x.fillStyle = 'rgba(240,220,130,0.8)';
      x.beginPath(); x.arc(24 + Math.random() * (w - 48), 24 + Math.random() * (h - 48), 4, 0, 7); x.fill();
    }
    x.fillStyle = '#0d0f0d';
    x.fillRect(150, 90, 90, 70); x.fillRect(320, 140, 110, 60); x.fillRect(90, 200, 70, 50);
    x.strokeStyle = 'rgba(240,220,130,0.6)'; x.lineWidth = 2;
    [150, 320, 90].forEach((cx0, i) => { x.strokeRect(cx0, [90, 140, 200][i], [90, 110, 70][i], [70, 60, 50][i]); });
    x.fillStyle = '#F3F0DF'; x.font = `600 22px ${TECH}`;
    x.fillText('MYY-01 · SENSOR NODE', 150, 292);
  });
}

function notepadTex() {
  return makeTex(560, 400, (x, w, h) => {
    x.fillStyle = '#F7F3E6'; x.fillRect(0, 0, w, h);
    x.strokeStyle = 'rgba(125,170,195,0.5)'; x.lineWidth = 1.4;
    for (let y = 118; y < h - 14; y += 42) { x.beginPath(); x.moveTo(28, y); x.lineTo(w - 22, y); x.stroke(); }
    x.strokeStyle = 'rgba(214,110,110,0.55)'; x.lineWidth = 2;
    x.beginPath(); x.moveTo(64, 0); x.lineTo(64, h); x.stroke();
    x.fillStyle = '#8b8b8f';
    for (let i = 0; i < 9; i++) { x.beginPath(); x.ellipse(52 + i * 54, 26, 9, 15, 0.35, 0, 7); x.fill(); }
    x.fillStyle = '#c04c3c'; x.font = '700 44px "Caveat", cursive';
    x.fillText('技能清單 SKILL LIST', 84, 92);
    x.fillStyle = '#3c3628'; x.font = '600 27px "Caveat", cursive';
    ['HTML · CSS · JavaScript', 'Python · C++ · MySQL', 'QGIS · Arduino'].forEach((r, i) => x.fillText(r, 92, 158 + i * 62));
    x.fillStyle = '#4f9e5f';
    ['HTML · CSS · JavaScript', 'Python · C++ · MySQL', 'QGIS · Arduino'].forEach((_, i) => x.fillText('✓', 66, 158 + i * 62));
  });
}

function clipboardPaperTex() {
  return makeTex(256, 340, (x, w, h) => {
    x.fillStyle = '#F9F6EA'; x.fillRect(0, 0, w, h);
    x.strokeStyle = 'rgba(125,170,195,0.45)'; x.lineWidth = 1.2;
    for (let y = 60; y < h - 16; y += 34) { x.beginPath(); x.moveTo(20, y); x.lineTo(w - 20, y); x.stroke(); }
    x.strokeStyle = 'rgba(60,54,40,0.65)'; x.lineWidth = 2; x.lineCap = 'round';
    for (let y = 52; y < h - 22; y += 34) {
      const len = 90 + Math.random() * 100;
      x.beginPath(); x.moveTo(26, y - 8); x.lineTo(26 + len, y - 8); x.stroke();
    }
    x.fillStyle = '#c04c3c'; x.font = '700 26px "Caveat", cursive';
    x.fillText(' My Awards & Photos', 28, 34);
  });
}

function cardTex() {
  return makeTex(512, 300, (x, w, h) => {
    x.fillStyle = '#0b120c'; x.fillRect(0, 0, w, h);
    x.strokeStyle = '#7CFF9E'; x.lineWidth = 4; x.strokeRect(14, 14, w - 28, h - 28);
    x.fillStyle = '#7CFF9E';
    x.font = '800 74px "Noto Sans TC", sans-serif';
    x.fillText('馬英源', 44, 128);
    x.fillStyle = '#e8b33a'; x.font = `600 20px ${TECH}`;
    x.fillText('MA YING YUEN', 46, 190);
    x.fillStyle = '#6fae77'; x.font = `500 13px ${TECH}`;
    x.fillText('STEM STUDENT · HK', 46, 236);
  });
}

function saveBoxTex() {
  return makeTex(256, 340, (x, w, h) => {
    x.fillStyle = '#1f2024'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#F3F0DF'; x.fillRect(44, 36, w - 88, 64);
    x.fillStyle = '#17181c'; x.font = `26px "Press Start 2P", monospace`;
    x.textAlign = 'center'; x.fillText('SAVE', w / 2, 80);
    x.fillStyle = '#F3F0DF'; x.fillRect(w / 2 - 40, 150, 80, 80);
    x.fillStyle = '#1f2024'; x.fillRect(w / 2 - 24, 150, 30, 34); x.fillRect(w / 2 - 28, 196, 56, 34);
  });
}

/* ==========================================================================
   buildScene
   ========================================================================== */
export function buildScene(container, opts = {}) {
  let motionOn = !opts.reduceMotion;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, IS_MOBILE ? 1.75 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  container.appendChild(renderer.domElement);
  renderer.domElement.style.touchAction = 'none';

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0f1712);

  const camera = new THREE.PerspectiveCamera(44, window.innerWidth / window.innerHeight, 0.1, 40);

  /* ----- materials ----- */
  const MAT = {
    metal: new THREE.MeshStandardMaterial({ color: 0x232a25, metalness: 0.85, roughness: 0.38 }),
    metalDark: new THREE.MeshStandardMaterial({ color: 0x151b16, metalness: 0.8, roughness: 0.45 }),
    alu: new THREE.MeshStandardMaterial({ color: 0x5c665e, metalness: 0.9, roughness: 0.3 }),
    glass: new THREE.MeshStandardMaterial({ color: 0xaecdb8, metalness: 0, roughness: 0.06, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false }),
    ivory: new THREE.MeshStandardMaterial({ color: 0xe9e4d2, roughness: 0.85 }),
    accent: new THREE.MeshStandardMaterial({ color: 0x0f1712, emissive: 0x7CFF9E, emissiveIntensity: 1.6, roughness: 0.4 }),
  };

  /* ----- room ----- */
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x1c2a20, roughness: 0.96 });
  const wall = new THREE.Mesh(new THREE.BoxGeometry(9, 4.6, 0.18), wallMat);
  wall.position.set(0, 2.3, -1.78);
  wall.receiveShadow = true;
  scene.add(wall);
  const sideL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 4.6, 7), wallMat);
  sideL.position.set(-3.6, 2.3, 1.6);
  scene.add(sideL);
  const sideR = sideL.clone(); sideR.position.x = 3.6;
  scene.add(sideR);
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(9, 8),
    new THREE.MeshStandardMaterial({ color: 0x141f18, roughness: 0.95 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, 1.2);
  floor.receiveShadow = true;
  scene.add(floor);

  /* ----- lights ----- */
  scene.add(new THREE.HemisphereLight(0xa8c2ae, 0x101a12, 0.95));
  const fill = new THREE.DirectionalLight(0xbfd8c4, 0.56);
  fill.position.set(2.4, 3.6, 3.2);
  scene.add(fill);

  const lampSpot = new THREE.SpotLight(0xffd9a0, 26, 7, 0.62, 0.55, 1.6);
  lampSpot.castShadow = true;
  lampSpot.shadow.mapSize.set(IS_MOBILE ? 512 : 1024, IS_MOBILE ? 512 : 1024);
  lampSpot.shadow.bias = -0.0004;
  scene.add(lampSpot.target);
  const lampBulb = new THREE.PointLight(0xffca7a, 3.2, 2.6, 2);
  scene.add(lampBulb);

  /* ----- desk ----- */
  const wood = woodTex();
  wood.wrapS = wood.wrapT = THREE.RepeatWrapping;
  const deskMat = new THREE.MeshStandardMaterial({ map: wood, color: 0xffffff, roughness: 0.72 });
  const legMat = new THREE.MeshStandardMaterial({ color: 0x2a1d12, roughness: 0.7 });
  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.09, 1.05), deskMat);
  deskTop.position.set(0, 0.82, 0.12);
  deskTop.castShadow = deskTop.receiveShadow = true;
  scene.add(deskTop);
  const edge = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.02, 0.02), MAT.alu);
  edge.position.set(0, 0.855, 0.645);
  scene.add(edge);
  const legGeo = new THREE.BoxGeometry(0.09, 0.78, 0.92);
  [-1.16, 1.16].forEach((lx) => {
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(lx, 0.39, 0.12);
    leg.castShadow = leg.receiveShadow = true;
    scene.add(leg);
  });
  const beam = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.07, 0.07), legMat);
  beam.position.set(0, 0.16, 0.52);
  scene.add(beam);

  const DESK_Y = 0.865;

  /* ============================================================
   01 · FUTURE COMPUTER — panoramic curved ultra-thin display
   ============================================================ */
  const computer = new THREE.Group();
  const ARC_R = 1.15, ARC_L = 0.46, ARC_H = 0.42;

  const dash = new DashboardScreen();
  const arcFrontZ = 0.04; // world z of the screen's front midpoint
  function curvedStrip(height, radius, material, y) {
    const g = new THREE.CylinderGeometry(radius, radius, height, 40, 1, true, -ARC_L / 2, ARC_L);
    const m = new THREE.Mesh(g, material);
    m.position.set(0, y, arcFrontZ - radius); // arc midpoint bulges toward +z
    m.castShadow = true;
    return m;
  }
  const shellTop = curvedStrip(0.045, ARC_R, MAT.metal, 0.245);
  const shellBottom = curvedStrip(0.06, ARC_R, MAT.metal, -0.245);
  const screen = curvedStrip(ARC_H, ARC_R - 0.014, new THREE.MeshBasicMaterial({ map: dash.texture }), 0);
  computer.add(shellTop, shellBottom, screen);
  [-1, 1].forEach((s) => {
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.5, 0.055), MAT.metalDark);
    cap.position.set(s * Math.sin(ARC_L / 2) * ARC_R, 0, arcFrontZ - ARC_R * (1 - Math.cos(ARC_L / 2)));
    cap.rotation.y = s * ARC_L / 2;
    computer.add(cap);
  });
  const led = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.008, 0.012), MAT.accent);
  led.position.set(0, -0.285, arcFrontZ + 0.012);
  computer.add(led);
  const pylon = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.34, 0.045), MAT.metal);
  pylon.position.set(0, -0.44, arcFrontZ - 0.16);
  pylon.rotation.x = -0.12;
  pylon.castShadow = true;
  computer.add(pylon);
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.018, 0.24), MAT.metalDark);
  base.position.set(0, -0.606, arcFrontZ - 0.12);
  base.castShadow = true;
  computer.add(base);
  const baseLed = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.004, 0.02), MAT.accent);
  baseLed.position.set(0, -0.595, arcFrontZ - 0.005);
  computer.add(baseLed);

  computer.position.set(-0.12, DESK_Y + 0.62, 0.02);
  computer.rotation.y = 0.03;
  scene.add(computer);

  const screenGlow = new THREE.PointLight(0xaef0c2, 0.9, 2.2, 2);
  screenGlow.position.set(-0.12, DESK_Y + 0.55, 0.55);
  scene.add(screenGlow);

  /* ============================================================
   02 · 3D PRINTER — glass chamber, gantry, city-in-progress
   ============================================================ */
  const printer = new THREE.Group();
  const pScreen = new PrinterScreen();

  const baseBox = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.06, 0.32), MAT.metalDark);
  baseBox.position.y = 0.03;
  baseBox.castShadow = true;
  printer.add(baseBox);
  const pillarGeo = new THREE.BoxGeometry(0.022, 0.34, 0.022);
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
    const p = new THREE.Mesh(pillarGeo, MAT.metal);
    p.position.set(sx * 0.155, 0.23, sz * 0.125);
    p.castShadow = true;
    printer.add(p);
  });
  const railX = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.02, 0.022), MAT.metal);
  railX.position.set(0, 0.405, -0.125);
  printer.add(railX);
  const railX2 = railX.clone(); railX2.position.z = 0.125;
  printer.add(railX2);
  const railZ = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.02, 0.28), MAT.metal);
  railZ.position.set(-0.155, 0.405, 0);
  printer.add(railZ);
  const railZ2 = railZ.clone(); railZ2.position.x = 0.155;
  printer.add(railZ2);
  const glassFront = new THREE.Mesh(new THREE.PlaneGeometry(0.31, 0.3), MAT.glass);
  glassFront.position.set(0, 0.22, 0.126);
  printer.add(glassFront);
  const glassL = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 0.3), MAT.glass);
  glassL.rotation.y = Math.PI / 2;
  glassL.position.set(-0.156, 0.22, 0);
  printer.add(glassL);
  const glassR = glassL.clone(); glassR.position.x = 0.156;
  printer.add(glassR);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(0.31, 0.3), MAT.metalDark);
  back.position.set(0, 0.22, -0.126);
  printer.add(back);
  const gantry = new THREE.Mesh(new THREE.BoxGeometry(0.29, 0.014, 0.014), MAT.alu);
  gantry.position.set(0, 0.33, 0);
  printer.add(gantry);
  const printHead = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 0.045), MAT.metalDark);
  printHead.position.set(0, 0.30, 0);
  printHead.castShadow = true;
  printer.add(printHead);
  const nozzle = new THREE.Mesh(new THREE.ConeGeometry(0.008, 0.02, 10), MAT.accent);
  nozzle.rotation.x = Math.PI;
  nozzle.position.set(0, 0.268, 0);
  printer.add(nozzle);
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.012, 24), MAT.metalDark);
  plate.position.set(0, 0.068, -0.02);
  printer.add(plate);
  const cityPrint = new THREE.Group();
  const buildings = [];
  const bSeed = [[-0.03, -0.04, 0.05], [0.02, -0.03, 0.08], [0.04, 0.02, 0.04], [-0.04, 0.03, 0.06], [0.0, 0.0, 0.1], [-0.02, 0.05, 0.045], [0.05, -0.02, 0.05], [-0.06, -0.01, 0.04]];
  bSeed.forEach(([bx, bz, bh], i) => {
    const b = new THREE.Mesh(
      new THREE.BoxGeometry(0.028, bh, 0.028),
      new THREE.MeshStandardMaterial({ color: 0xd8d2bd, roughness: 0.7 })
    );
    b.position.set(bx, bh / 2, bz - 0.02);
    b.castShadow = true;
    cityPrint.add(b);
    buildings.push({ mesh: b, h: bh, order: i / bSeed.length });
  });
  cityPrint.position.set(0, 0.074, 0);
  printer.add(cityPrint);
  const miniScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.11, 0.055), new THREE.MeshBasicMaterial({ map: pScreen.texture }));
  miniScreen.position.set(0.08, 0.05, 0.161);
  printer.add(miniScreen);
  const pLed = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.006, 0.008), MAT.accent);
  pLed.position.set(0, 0.062, 0.158);
  printer.add(pLed);
  const spoolMount = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.09, 0.03), MAT.metal);
  spoolMount.position.set(0.19, 0.28, -0.06);
  printer.add(spoolMount);
  const spool = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.045, 24), MAT.ivory);
  spool.rotation.z = Math.PI / 2;
  spool.position.set(0.225, 0.28, -0.06);
  spool.castShadow = true;
  printer.add(spool);
  const spoolHub = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.05, 16), MAT.metalDark);
  spoolHub.rotation.z = Math.PI / 2;
  spoolHub.position.copy(spool.position);
  printer.add(spoolHub);

  printer.position.set(0.92, DESK_Y, -0.02);
  printer.rotation.y = -0.22;
  scene.add(printer);

  const printerLight = new THREE.PointLight(0x7CFF9E, 0.5, 0.6, 2);
  printerLight.position.set(0.92, DESK_Y + 0.28, 0.0);
  scene.add(printerLight);

  /* ============================================================
   03 · DESK PROPS
   ============================================================ */
  const kbGroup = new THREE.Group();
  const kbBase = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.016, 0.21), MAT.metalDark);
  kbBase.position.y = 0.008;
  kbBase.castShadow = true;
  kbGroup.add(kbBase);
  const kbTex = keyboardTex();
  const kbTop = new THREE.Mesh(
    new THREE.BoxGeometry(0.66, 0.004, 0.19),
    new THREE.MeshStandardMaterial({
      map: kbTex, roughness: 0.5, metalness: 0.2,
      emissive: 0x1a3324, emissiveMap: kbTex, emissiveIntensity: 0.85,
    })
  );
  kbTop.rotation.x = -Math.PI / 2;
  kbTop.position.y = 0.0175;
  kbGroup.add(kbTop);
  kbGroup.position.set(0.02, DESK_Y, 0.5);
  kbGroup.rotation.x = 0.04;
  scene.add(kbGroup);

  const mouseMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, 20, 16),
    new THREE.MeshStandardMaterial({ color: 0x22281f, roughness: 0.4, metalness: 0.3 })
  );
  mouseMesh.scale.set(0.052, 0.03, 0.085);
  mouseMesh.position.set(0.62, DESK_Y + 0.024, 0.52);
  mouseMesh.castShadow = true;
  scene.add(mouseMesh);

  const card = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.007, 0.13),
    [
      new THREE.MeshStandardMaterial({ color: 0x101810 }), new THREE.MeshStandardMaterial({ color: 0x101810 }),
      new THREE.MeshStandardMaterial({ map: cardTex(), roughness: 0.5 }),
      new THREE.MeshStandardMaterial({ color: 0x101810 }), new THREE.MeshStandardMaterial({ color: 0x101810 }), new THREE.MeshStandardMaterial({ color: 0x101810 }),
    ]
  );
  card.position.set(0.4, DESK_Y + 0.004, 0.56);
  card.rotation.y = 0.18;
  scene.add(card);

  const notepad = new THREE.Mesh(
    new THREE.BoxGeometry(0.36, 0.01, 0.27),
    [
      new THREE.MeshStandardMaterial({ color: 0xdcd6c2 }), new THREE.MeshStandardMaterial({ color: 0xdcd6c2 }),
      new THREE.MeshStandardMaterial({ map: notepadTex(), roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: 0xf2eddc }), new THREE.MeshStandardMaterial({ color: 0xdcd6c2 }), new THREE.MeshStandardMaterial({ color: 0xdcd6c2 }),
    ]
  );
  notepad.position.set(-0.62, DESK_Y + 0.006, 0.56);
  notepad.rotation.y = -0.35;
  notepad.castShadow = true;
  scene.add(notepad);
  const pen = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.16, 10), MAT.metal);
  pen.rotation.z = Math.PI / 2;
  pen.rotation.y = 0.5;
  pen.position.set(-0.42, DESK_Y + 0.012, 0.62);
  pen.castShadow = true;
  scene.add(pen);

  const clipboard = new THREE.Group();
  const cbBoard = new THREE.Mesh(new THREE.BoxGeometry(0.27, 0.014, 0.36), new THREE.MeshStandardMaterial({ color: 0xb98d5a, roughness: 0.8 }));
  clipboard.add(cbBoard);
  const cbPaper = new THREE.Mesh(
    new THREE.BoxGeometry(0.23, 0.006, 0.31),
    [
      new THREE.MeshStandardMaterial({ color: 0xf6f2e4 }), new THREE.MeshStandardMaterial({ color: 0xf6f2e4 }),
      new THREE.MeshStandardMaterial({ map: clipboardPaperTex(), roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: 0xf6f2e4 }), new THREE.MeshStandardMaterial({ color: 0xf6f2e4 }), new THREE.MeshStandardMaterial({ color: 0xf6f2e4 }),
    ]
  );
  cbPaper.position.y = 0.009;
  clipboard.add(cbPaper);
  const clip = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.05), new THREE.MeshStandardMaterial({ color: 0x9a9a9e, metalness: 0.7, roughness: 0.35 }));
  clip.position.set(0, 0.02, -0.145);
  clipboard.add(clip);
  clipboard.position.set(-0.98, DESK_Y + 0.01, 0.32);
  clipboard.rotation.y = 0.55;
  scene.add(clipboard);

  const pcb = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.006, 0.1),
    [
      new THREE.MeshStandardMaterial({ color: 0x14532d }), new THREE.MeshStandardMaterial({ color: 0x14532d }),
      new THREE.MeshStandardMaterial({ map: pcbTex(), roughness: 0.6 }),
      new THREE.MeshStandardMaterial({ color: 0x14532d }), new THREE.MeshStandardMaterial({ color: 0x14532d }), new THREE.MeshStandardMaterial({ color: 0x14532d }),
    ]
  );
  pcb.position.set(0.62, DESK_Y + 0.004, 0.06);
  pcb.rotation.y = -0.4;
  scene.add(pcb);
  [[0.58, 0.05], [0.66, 0.08]].forEach(([cx, cz]) => {
    const chip = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.008, 0.024), MAT.metalDark);
    chip.position.set(cx, DESK_Y + 0.012, cz);
    scene.add(chip);
  });

  /* ============================================================
   04 · DESK LAMP (identity + key light)
   ============================================================ */
  const lamp = new THREE.Group();
  const lampMat = new THREE.MeshStandardMaterial({ color: 0x191919, roughness: 0.42, metalness: 0.5 });
  const lb = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.035, 24), lampMat);
  lamp.add(lb);
  const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.013, 0.62, 10), lampMat);
  arm1.position.set(-0.1, 0.3, -0.05);
  arm1.rotation.z = 0.32; arm1.rotation.x = -0.18;
  lamp.add(arm1);
  const joint = new THREE.Mesh(new THREE.SphereGeometry(0.026, 10, 10), lampMat);
  joint.position.set(-0.2, 0.585, -0.1);
  lamp.add(joint);
  const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.5, 10), lampMat);
  arm2.position.set(-0.11, 0.72, 0.02);
  arm2.rotation.z = -0.55; arm2.rotation.x = 0.28;
  lamp.add(arm2);
  const head = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.17, 20, 1, true), lampMat);
  head.position.set(0.02, 0.88, 0.14);
  head.rotation.z = -0.7; head.rotation.x = 0.5;
  lamp.add(head);
  lamp.position.set(-1.28, DESK_Y, -0.12);
  scene.add(lamp);
  const headWorld = new THREE.Vector3();
  head.getWorldPosition(headWorld);
  lampSpot.position.copy(headWorld);
  lampSpot.target.position.set(-0.75, 1.5, -1.4);
  lampBulb.position.copy(headWorld).add(new THREE.Vector3(0.05, -0.05, 0.1));

  /* ============================================================
   05 · WALL — idea wall
   ============================================================ */
  const corkGroup = new THREE.Group();
  const corkMat = new THREE.MeshStandardMaterial({ color: 0xb98347, roughness: 0.9 });
  const cork = new THREE.Mesh(new THREE.BoxGeometry(1.04, 0.7, 0.035), corkMat);
  corkGroup.add(cork);
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x7a4e26, roughness: 0.7 });
  const fh = new THREE.BoxGeometry(1.13, 0.05, 0.05);
  const fv = new THREE.BoxGeometry(0.05, 0.75, 0.05);
  [[0, 0.365], [0, -0.365]].forEach(([fx, fy]) => {
    const f = new THREE.Mesh(fh, frameMat); f.position.set(fx, fy, 0.005); corkGroup.add(f);
  });
  [[-0.545, 0], [0.545, 0]].forEach(([fx, fy]) => {
    const f = new THREE.Mesh(fv, frameMat); f.position.set(fx, fy, 0.005); corkGroup.add(f);
  });
  const pinGeo = new THREE.SphereGeometry(0.016, 10, 10);
  const pinMat = new THREE.MeshStandardMaterial({ color: 0xd0342a, roughness: 0.4 });
  const noteDefs = [
    { t: 'TODO', x: -0.26, y: 0.16, r: -0.04 },
    { t: 'SHIP IT', x: 0.27, y: 0.16, r: 0.05 },
    { t: 'CTRL+S', x: -0.26, y: -0.18, r: 0.03 },
    { t: 'IDEAS', x: 0.27, y: -0.18, r: -0.05 },
  ];
  noteDefs.forEach((d) => {
    const n = new THREE.Mesh(new THREE.PlaneGeometry(0.21, 0.165), new THREE.MeshStandardMaterial({ map: noteTex(d.t, 2), roughness: 0.85 }));
    n.position.set(d.x, d.y, 0.024);
    n.rotation.z = d.r;
    corkGroup.add(n);
    const p = new THREE.Mesh(pinGeo, pinMat);
    p.position.set(d.x + 0.075, d.y + 0.072, 0.036);
    corkGroup.add(p);
  });
  corkGroup.position.set(-1.35, 2.02, -1.67);
  scene.add(corkGroup);

  const heart = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3), new THREE.MeshStandardMaterial({ map: heartTex(), roughness: 0.8 }));
  heart.position.set(-0.68, 2.42, -1.68);
  heart.rotation.z = 0.05;
  scene.add(heart);

  const hello = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.58), new THREE.MeshStandardMaterial({ map: helloTex(), roughness: 0.88 }));
  hello.position.set(-0.55, 1.85, -1.68);
  scene.add(hello);

  const blueprint = new THREE.Mesh(new THREE.PlaneGeometry(0.52, 0.69), new THREE.MeshStandardMaterial({ map: blueprintTex(), roughness: 0.9 }));
  blueprint.position.set(0.28, 2.3, -1.68);
  blueprint.rotation.z = -0.01;
  scene.add(blueprint);

  const wallScreen = new WallScreen();
  const wallDisp = new THREE.Group();
  const wdBezel = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.03), MAT.metalDark);
  wallDisp.add(wdBezel);
  const wdScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.35), new THREE.MeshBasicMaterial({ map: wallScreen.texture }));
  wdScreen.position.z = 0.017;
  wallDisp.add(wdScreen);
  wallDisp.position.set(1.35, 2.25, -1.67);
  scene.add(wallDisp);
  const wallGlow = new THREE.PointLight(0x9fe8b0, 0.35, 1.4, 2);
  wallGlow.position.set(1.35, 2.2, -1.35);
  scene.add(wallGlow);

  const shelf = new THREE.Group();
  const shelfBoard = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.025, 0.18), new THREE.MeshStandardMaterial({ map: wood, color: 0xffffff, roughness: 0.75 }));
  shelfBoard.castShadow = true;
  shelf.add(shelfBoard);
  [-0.32, 0.32].forEach((bx) => {
    const br = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.09, 0.14), MAT.metalDark);
    br.position.set(bx, -0.055, 0.01);
    shelf.add(br);
  });
  const protoCity = new THREE.Group();
  [[-0.1, 0.03, 0.06], [-0.05, -0.02, 0.09], [0.02, 0.02, 0.05], [0.07, -0.01, 0.07]].forEach(([bx, bz, bh]) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.035, bh, 0.035), new THREE.MeshStandardMaterial({ color: 0xd8d2bd, roughness: 0.7 }));
    b.position.set(bx, bh / 2 + 0.0125, bz);
    b.castShadow = true;
    protoCity.add(b);
  });
  protoCity.position.set(-0.22, 0.013, 0);
  shelf.add(protoCity);
  const bridge = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 10, 20, Math.PI), MAT.ivory);
  bridge.position.set(0.1, 0.012, 0);
  bridge.castShadow = true;
  shelf.add(bridge);
  const saveBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.17, 0.24, 0.06),
    [
      lampMat, lampMat, lampMat, lampMat,
      new THREE.MeshStandardMaterial({ map: saveBoxTex(), roughness: 0.7 }),
      lampMat,
    ]
  );
  saveBox.position.set(0.3, 0.132, 0);
  saveBox.rotation.y = -0.2;
  saveBox.castShadow = true;
  shelf.add(saveBox);
  shelf.position.set(1.32, 1.72, -1.62);
  scene.add(shelf);

  /* ----- dust motes ----- */
  const dustCount = IS_MOBILE ? 30 : 60;
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 2.6;
    dustPos[i * 3 + 1] = 0.8 + Math.random() * 1.8;
    dustPos[i * 3 + 2] = -0.5 + Math.random() * 1.6;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
    color: 0xfff4d8, size: 0.014, transparent: true, opacity: 0.35, sizeAttenuation: true,
  }));
  scene.add(dust);

  /* ---------- camera control ---------- */
  const target = new THREE.Vector3(0.12, 1.24, 0.05);
  const S = {
    radius: IS_MOBILE ? 4.9 : 3.62,
    theta: 0, phi: 1.34,
    tRadius: IS_MOBILE ? 4.9 : 3.62,
    tTheta: 0, tPhi: 1.34,
    parX: 0, parY: 0,
    dragging: false, lastX: 0, lastY: 0,
    downX: 0, downY: 0, downT: 0,
    introT: -1,
  };
  if (IS_MOBILE) S.tPhi = S.phi = 1.38;

  function applyCamera() {
    const th = S.theta + S.parX * 0.14;
    const ph = THREE.MathUtils.clamp(S.phi + S.parY * -0.08, 0.9, 1.52);
    camera.position.set(
      target.x + S.radius * Math.sin(ph) * Math.sin(th),
      target.y + S.radius * Math.cos(ph),
      target.z + S.radius * Math.sin(ph) * Math.cos(th)
    );
    camera.lookAt(target);
  }

  /* ---------- pointer / hotspot interaction ---------- */
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const hotspots = [];
  let hovered = null;
  const onHover = opts.onHover || (() => {});
  const onSelect = opts.onSelect || (() => {});

  function registerHotspot(obj, id) {
    obj.traverse((o) => { if (o.isMesh) hotspots.push({ mesh: o, id }); });
  }
  registerHotspot(computer, 'monitor');
  registerHotspot(kbGroup, 'keyboard');
  registerHotspot(card, 'card');
  registerHotspot(notepad, 'board');
  registerHotspot(clipboard, 'photos');
  registerHotspot(lamp, 'lamp');

  const anchors = {
    monitor: new THREE.Vector3(-0.12, DESK_Y + 0.88, 0.1),
    keyboard: new THREE.Vector3(0.02, DESK_Y + 0.14, 0.5),
    card: new THREE.Vector3(0.4, DESK_Y + 0.14, 0.56),
    board: new THREE.Vector3(-0.62, DESK_Y + 0.12, 0.58),
    photos: new THREE.Vector3(-0.98, DESK_Y + 0.14, 0.32),
  };
  const onProject = opts.onProject || (() => {});
  const projV = new THREE.Vector3();
  function projectHotspots() {
    const out = {};
    for (const id in anchors) {
      projV.copy(anchors[id]).project(camera);
      out[id] = {
        x: (projV.x * 0.5 + 0.5) * window.innerWidth,
        y: (-projV.y * 0.5 + 0.5) * window.innerHeight,
        visible: projV.z < 1 && projV.z > -1,
      };
    }
    onProject(out);
  }

  function pick(e) {
    ndc.x = (e.clientX / window.innerWidth) * 2 - 1;
    ndc.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(hotspots.map((h) => h.mesh), false);
    return hits.length ? hotspots.find((h) => h.mesh === hits[0].object) : null;
  }

  let lampOn = true;
  function setLamp(on) {
    lampOn = on;
    lampSpot.intensity = on ? 26 : 0;
    lampBulb.intensity = on ? 3.2 : 0;
  }

  const el = renderer.domElement;
  el.addEventListener('pointermove', (e) => {
    if (S.dragging) {
      S.tTheta = THREE.MathUtils.clamp(S.tTheta + (e.clientX - S.lastX) * 0.0035, -0.85, 0.85);
      S.tPhi = THREE.MathUtils.clamp(S.tPhi - (e.clientY - S.lastY) * 0.0028, 0.98, 1.48);
      S.lastX = e.clientX; S.lastY = e.clientY;
      return;
    }
    if (!IS_MOBILE) {
      S.parX = (e.clientX / window.innerWidth) * 2 - 1;
      S.parY = (e.clientY / window.innerHeight) * 2 - 1;
    }
    const hit = IS_MOBILE ? null : pick(e);
    const id = hit ? hit.id : null;
    if (id !== hovered) {
      hovered = id;
      onHover(id);
      el.style.cursor = id ? 'pointer' : 'grab';
    }
  });
  el.addEventListener('pointerdown', (e) => {
    S.dragging = true;
    S.lastX = S.downX = e.clientX; S.lastY = S.downY = e.clientY;
    S.downT = performance.now();
    el.setPointerCapture(e.pointerId);
    el.style.cursor = 'grabbing';
  });
  el.addEventListener('pointerup', (e) => {
    S.dragging = false;
    el.style.cursor = hovered ? 'pointer' : 'grab';
    const moved = Math.hypot(e.clientX - S.downX, e.clientY - S.downY);
    const dt = performance.now() - S.downT;
    if (moved < 9 && dt < 500) {
      const hit = pick(e);
      if (hit) {
        if (hit.id === 'lamp') setLamp(!lampOn);
        onSelect(hit.id);
      }
    }
  });
  el.addEventListener('pointercancel', () => { S.dragging = false; });
  el.addEventListener('wheel', (e) => {
    e.preventDefault();
    S.tRadius = THREE.MathUtils.clamp(S.tRadius + e.deltaY * 0.0016, 3.0, 5.4);
  }, { passive: false });

  /* ---------- resize ---------- */
  function onResize() {
    const w = window.innerWidth, h = window.innerHeight;
    camera.aspect = w / h;
    const portrait = h > w;
    camera.fov = portrait ? 56 : 44;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    if (portrait) { S.tRadius = Math.max(S.tRadius, 5.0); }
  }
  window.addEventListener('resize', onResize);
  onResize();

  /* ---------- loop ---------- */
  const clock = new THREE.Clock();
  let raf = 0;
  let running = true;
  let projAcc = 1;
  let printAcc = 26; // start mid-print so the model is already visible

  function tick() {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(clock.getDelta(), 0.1);
    const t = clock.elapsedTime;

    const k = 1 - Math.exp(-7 * dt);
    S.theta += (S.tTheta - S.theta) * k;
    S.phi += (S.tPhi - S.phi) * k;
    S.radius += (S.tRadius - S.radius) * k;
    if (!S.dragging) {
      S.tTheta *= Math.exp(-0.5 * dt);
    }
    if (S.introT >= 0) {
      S.introT += dt;
      const p = Math.min(S.introT / 1.7, 1);
      const e = 1 - Math.pow(1 - p, 3);
      S.radius = S.tRadius = THREE.MathUtils.lerp(S.introFrom, S.tRadius, e);
      S.phi = S.tPhi = THREE.MathUtils.lerp(1.48, 1.34, e);
      if (p >= 1) S.introT = -1;
    }

    applyCamera();

    projAcc += dt;
    if (projAcc > 0.12) { projAcc = 0; projectHotspots(); }

    if (motionOn) {
      printAcc += dt;
      const progress = (printAcc % 60) / 60;
      buildings.forEach(({ mesh, h, order }) => {
        const local = THREE.MathUtils.clamp((progress - order * 0.8) / 0.2, 0, 1);
        mesh.scale.y = Math.max(0.001, local);
      });
      printHead.position.x = Math.sin(t * 0.5) * 0.1;
      printHead.position.z = Math.cos(t * 0.33) * 0.07;
      nozzle.position.x = printHead.position.x;
      nozzle.position.z = printHead.position.z;
      pScreen.update(progress);
      dash.update(dt, true);
      wallScreen.update(dt, true);
      const pos = dust.geometry.attributes.position;
      for (let i = 0; i < dustCount; i++) {
        let y = pos.getY(i) + dt * 0.035;
        if (y > 2.7) y = 0.8;
        pos.setY(i, y);
        pos.setX(i, pos.getX(i) + Math.sin(t * 0.6 + i) * 0.0004);
      }
      pos.needsUpdate = true;
      if (lampOn) {
        const f = 1 + Math.sin(t * 13.7) * 0.008 + Math.sin(t * 31.3) * 0.006;
        lampSpot.intensity = 26 * f;
      }
    } else {
      dash.update(0, false);
      wallScreen.update(0, false);
      pScreen.update(0.62);
    }

    renderer.render(scene, camera);
  }

  tick(); // start render loop

  return {
    intro() {
      S.introFrom = S.tRadius + 1.1;
      S.radius = S.introFrom;
      S.introT = 0;
    },
    lamp: { toggle: () => { setLamp(!lampOn); return lampOn; } },
    pause() { running = false; cancelAnimationFrame(raf); },
    resume() { if (!running) { running = true; clock.getDelta(); tick(); } },
    setReduceMotion(v) { motionOn = !v; },
  };
}
