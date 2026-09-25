/* ==========================================================================
   scene.js — "Holographic Workspace": Ma Ying Yuen's cream + orange-red
   near-future engineering studio. Procedural Three.js, canvas textures.
   Hotspots: holo display→work · keyboard→skills · card→contact ·
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
const ORANGE = '#E85A3F';
const ORANGE_DEEP = '#B83E2A';
const IVORY = '#FFFDF7';
const CHARCOAL = '#25221E';

/* ============================================================
   HOLOGRAPHIC SCREENS (transparent canvas textures)
   ============================================================ */

/* --- main panel: district digital twin --- */
class HoloMainScreen {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1024; this.canvas.height = 512;
    this.ctx = this.canvas.getContext('2d');
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.acc = 99; this.t = 0;
    this.dots = Array.from({ length: 16 }, () => ({
      x: 70 + Math.random() * 480,
      y: 110 + Math.random() * 300,
      r: 2 + Math.random() * 3,
      ph: Math.random() * 6.28,
    }));
  }
  update(dt, motion) {
    this.t += dt; this.acc += dt;
    if (this.acc < (motion ? 0.5 : 999)) return;
    this.acc = 0;
    const x = this.ctx, W = 1024, H = 512;
    x.clearRect(0, 0, W, H);
    // translucent warm panel
    x.fillStyle = 'rgba(255,253,247,0.55)';
    x.beginPath(); x.roundRect(4, 4, W - 8, H - 8, 18); x.fill();
    x.strokeStyle = 'rgba(232,90,63,0.95)'; x.lineWidth = 3;
    x.beginPath(); x.roundRect(4, 4, W - 8, H - 8, 18); x.stroke();
    // header
    x.fillStyle = ORANGE_DEEP; x.font = `700 30px ${TECH}`;
    x.fillText('DISTRICT 07 · DIGITAL TWIN', 30, 52);
    x.fillStyle = 'rgba(255,253,247,0.85)'; x.font = `500 20px ${TECH}`;
    x.fillText('MA YING YUEN — SPATIAL LAB', 560, 52);
    x.fillStyle = ORANGE_DEEP; x.fillText('● LIVE', 920, 52);
    // map area
    x.fillStyle = 'rgba(255,253,247,0.07)'; x.fillRect(30, 84, 560, 330);
    x.strokeStyle = 'rgba(232,90,63,0.3)'; x.lineWidth = 1;
    for (let gx = 30; gx <= 590; gx += 40) { x.beginPath(); x.moveTo(gx, 84); x.lineTo(gx, 414); x.stroke(); }
    for (let gy = 84; gy <= 414; gy += 40) { x.beginPath(); x.moveTo(30, gy); x.lineTo(590, gy); x.stroke(); }
    // roads
    x.strokeStyle = 'rgba(37,34,30,0.75)'; x.lineWidth = 6;
    x.beginPath(); x.moveTo(30, 210); x.lineTo(590, 170); x.stroke();
    x.beginPath(); x.moveTo(30, 350); x.lineTo(590, 385); x.stroke();
    x.beginPath(); x.moveTo(210, 84); x.lineTo(310, 414); x.stroke();
    x.beginPath(); x.moveTo(440, 84); x.lineTo(390, 414); x.stroke();
    // building blocks (2.5d)
    const blocks = [[90, 110], [250, 105], [120, 240], [470, 120], [420, 250], [90, 300], [480, 300], [250, 300]];
    blocks.forEach(([bx, by], i) => {
      const bw = 46, bh = 34, hgt = 14 + (i % 4) * 8;
      x.fillStyle = 'rgba(255,253,247,0.6)';
      x.fillRect(bx, by - hgt, bw, bh);
      x.strokeStyle = ORANGE_DEEP; x.lineWidth = 2.5;
      x.strokeRect(bx, by - hgt, bw, bh);
      x.beginPath(); x.moveTo(bx, by - hgt); x.lineTo(bx + 10, by - hgt - 10); x.lineTo(bx + bw + 10, by - hgt - 10); x.lineTo(bx + bw, by - hgt); x.stroke();
      x.beginPath(); x.moveTo(bx + bw, by - hgt); x.lineTo(bx + bw + 10, by - hgt - 10); x.lineTo(bx + bw + 10, by - 10); x.lineTo(bx + bw, by); x.stroke();
    });
    for (const d of this.dots) {
      const a = motion ? 0.4 + 0.6 * Math.abs(Math.sin(this.t * 1.4 + d.ph)) : 0.85;
      x.fillStyle = `rgba(232,90,63,${a})`;
      x.beginPath(); x.arc(d.x, d.y, d.r, 0, 7); x.fill();
    }
    const mx = 300 + Math.sin(this.t * 0.5) * 44, my = 250 + Math.cos(this.t * 0.4) * 28;
    x.strokeStyle = ORANGE_DEEP; x.lineWidth = 2.5;
    x.beginPath(); x.arc(mx, my, 12 + (motion ? (this.t % 1) * 14 : 5), 0, 7); x.stroke();
    x.fillStyle = ORANGE_DEEP; x.beginPath(); x.arc(mx, my, 5, 0, 7); x.fill();
    // right column — stats + commands
    x.fillStyle = 'rgba(255,253,247,0.8)'; x.font = `600 21px ${TECH}`;
    x.fillText('DISTRICT MONITOR', 630, 116);
    const bars = [['FLOW', 0.72], ['AIR Q', 0.41], ['TRANSIT', 0.58], ['SENSOR NET', 0.86]];
    bars.forEach(([lb, v], i) => {
      const by = 148 + i * 62;
      x.fillStyle = CHARCOAL; x.font = `500 18px ${TECH}`; x.fillText(lb, 630, by);
      x.fillStyle = 'rgba(37,34,30,0.25)'; x.fillRect(630, by + 10, 330, 14);
      x.fillStyle = ORANGE_DEEP; x.fillRect(630, by + 10, 330 * v, 14);
    });
    x.fillStyle = 'rgba(184,62,42,0.85)'; x.font = `500 18px ${TECH}`;
    ['> python spatial_analysis.py', '> qgis --render district_07', '> arduino sensor_net --sync'].forEach((l, i) => x.fillText(l, 630, 424 + i * 27));
    this.texture.needsUpdate = true;
  }
}

/* --- side panel: AI diagnostics + real timeline --- */
class HoloSideScreen {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 512; this.canvas.height = 352;
    this.ctx = this.canvas.getContext('2d');
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.t = 0;
  }
  update(dt, motion) {
    this.t += dt;
    const x = this.ctx, W = 512, H = 352;
    x.clearRect(0, 0, W, H);
    x.fillStyle = 'rgba(255,253,247,0.55)';
    x.beginPath(); x.roundRect(4, 4, W - 8, H - 8, 14); x.fill();
    x.strokeStyle = 'rgba(232,90,63,0.95)'; x.lineWidth = 2.5;
    x.beginPath(); x.roundRect(4, 4, W - 8, H - 8, 14); x.stroke();
    x.fillStyle = ORANGE_DEEP; x.font = `700 24px ${TECH}`;
    x.fillText('AI DIAGNOSTICS', 24, 44);
    x.fillStyle = 'rgba(255,253,247,0.85)'; x.font = `500 17px ${TECH}`;
    ['> sensors: 42 online', '> model: digital_twin_v3', '> latency: 12 ms', '> status: NOMINAL'].forEach((l, i) => {
      x.fillStyle = i === 3 ? ORANGE : 'rgba(37,34,30,0.75)';
      x.fillText(l, 24, 84 + i * 28);
    });
    // timeline (real milestones from the portfolio)
    x.fillStyle = ORANGE_DEEP; x.font = `700 20px ${TECH}`;
    x.fillText('JOURNEY', 24, 218);
    const marks = [['2022', 'leadership'], ['2023', 'caltex robotics'], ['2024', 'GBA awards'], ['2025', 'polyU · CUHK']];
    marks.forEach(([yr, lb], i) => {
      const my = 244 + i * 26;
      x.fillStyle = ORANGE_DEEP; x.beginPath(); x.arc(34, my - 6, 4, 0, 7); x.fill();
      x.fillStyle = CHARCOAL; x.font = `600 17px ${TECH}`; x.fillText(yr, 48, my);
      x.fillStyle = 'rgba(37,34,30,0.85)'; x.font = `600 16px ${TECH}`; x.fillText(lb, 110, my);
      if (i < marks.length - 1) {
        x.strokeStyle = 'rgba(232,90,63,0.4)'; x.lineWidth = 1.5;
        x.beginPath(); x.moveTo(34, my); x.lineTo(34, my + 20); x.stroke();
      }
    });
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
    x.clearRect(0, 0, W, H);
    x.fillStyle = 'rgba(255,253,247,0.55)'; x.fillRect(0, 0, W, H);
    x.strokeStyle = 'rgba(232,90,63,0.95)'; x.lineWidth = 2; x.strokeRect(1, 1, W - 2, H - 2);
    x.fillStyle = ORANGE_DEEP; x.font = `700 17px ${TECH}`;
    x.fillText('PRINTING', 14, 30);
    x.fillStyle = 'rgba(37,34,30,0.92)'; x.font = `600 13px ${TECH}`;
    x.fillText('smart_city_model.gcode', 14, 54);
    x.fillStyle = ORANGE_DEEP; x.font = `600 20px ${TECH}`;
    x.fillText(Math.floor(progress * 100) + '%', 200, 54);
    x.fillStyle = 'rgba(37,34,30,0.3)'; x.fillRect(14, 78, 228, 12);
    x.fillStyle = ORANGE; x.fillRect(14, 78, 228 * progress, 12);
    x.fillStyle = 'rgba(184,62,42,0.9)'; x.font = `500 12px ${TECH}`;
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
    x.clearRect(0, 0, W, H);
    x.fillStyle = 'rgba(255,253,247,0.6)'; x.fillRect(0, 0, W, H);
    x.strokeStyle = 'rgba(232,90,63,0.25)'; x.lineWidth = 1;
    for (let gx = 0; gx <= W; gx += 32) { x.beginPath(); x.moveTo(gx, 0); x.lineTo(gx, H); x.stroke(); }
    for (let gy = 0; gy <= H; gy += 32) { x.beginPath(); x.moveTo(0, gy); x.lineTo(W, gy); x.stroke(); }
    x.strokeStyle = 'rgba(37,34,30,0.7)'; x.lineWidth = 4;
    x.beginPath(); x.moveTo(0, 110); x.lineTo(W, 80); x.stroke();
    x.beginPath(); x.moveTo(0, 230); x.lineTo(W, 260); x.stroke();
    x.beginPath(); x.moveTo(170, 0); x.lineTo(240, H); x.stroke();
    const px = 60 + ((this.t * 22) % (W - 80)), py = 100 + Math.sin(this.t * 0.8) * 18;
    x.fillStyle = ORANGE_DEEP; x.beginPath(); x.arc(px, py, 6, 0, 7); x.fill();
    x.strokeStyle = 'rgba(184,62,42,0.5)';
    x.beginPath(); x.arc(px, py, 14, 0, 7); x.stroke();
    x.fillStyle = ORANGE_DEEP; x.font = `700 18px ${TECH}`;
    x.fillText('LIVE · SPATIAL FEED', 16, 36);
    this.texture.needsUpdate = true;
  }
}

/* ============================================================
   STATIC TEXTURES
   ============================================================ */

function lightWoodTex() {
  return makeTex(512, 256, (x, w, h) => {
    x.fillStyle = '#d9c6a2'; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 55; i++) {
      x.strokeStyle = `rgba(${Math.random() > 0.5 ? '150,120,80' : '245,238,220'},${0.12 + Math.random() * 0.14})`;
      x.lineWidth = 1 + Math.random() * 2.2;
      const y0 = Math.random() * h;
      x.beginPath(); x.moveTo(0, y0);
      for (let px = 0; px <= w; px += 32) x.lineTo(px, y0 + Math.sin(px * 0.02 + i) * 4);
      x.stroke();
    }
  });
}

function noteTex(label, lines) {
  return makeTex(220, 170, (x, w, h) => {
    x.fillStyle = '#FFFDF7'; x.fillRect(0, 0, w, h);
    x.strokeStyle = 'rgba(37,34,30,0.15)'; x.lineWidth = 2; x.strokeRect(1, 1, w - 2, h - 2);
    x.fillStyle = CHARCOAL;
    x.font = `16px "Press Start 2P", monospace`;
    x.textAlign = 'center';
    x.fillText(label, w / 2, 48);
    x.strokeStyle = 'rgba(232,90,63,0.55)'; x.lineWidth = 2; x.lineCap = 'round';
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
    x.fillStyle = CHARCOAL; x.fillRect(0, 0, w, h);
    x.strokeStyle = ORANGE; x.lineWidth = 8; x.strokeRect(8, 8, w - 16, h - 16);
    const m = ['01100110', '11111111', '11111111', '11111111', '01111110', '00111100', '00011000'];
    const s = 26, ox = (w - 8 * s) / 2, oy = (h - 7 * s) / 2;
    m.forEach((row, ry) => [...row].forEach((v, rx) => {
      if (v === '1') {
        x.fillStyle = (rx + ry) % 2 ? '#e85a3f' : '#ff8a70';
        x.fillRect(ox + rx * s, oy + ry * s, s - 2, s - 2);
      }
    }));
  });
}

function helloTex() {
  return makeTex(560, 460, (x, w, h) => {
    x.fillStyle = '#FFFDF7'; x.fillRect(0, 0, w, h);
    x.strokeStyle = CHARCOAL; x.lineWidth = 10; x.strokeRect(5, 5, w - 10, h - 10);
    x.fillStyle = CHARCOAL;
    x.font = `40px "Press Start 2P", monospace`;
    x.textAlign = 'center';
    x.fillText('HELLO,', w / 2, 165);
    x.fillText('WORLD!', w / 2, 235);
    x.fillStyle = ORANGE; x.font = `13px "Press Start 2P", monospace`;
    x.fillText('404: SLEEP NOT FOUND', w / 2, 330);
  });
}

function blueprintTex() {
  return makeTex(512, 680, (x, w, h) => {
    x.fillStyle = '#FBF8EF'; x.fillRect(0, 0, w, h);
    const ink = CHARCOAL;
    x.strokeStyle = 'rgba(37,34,30,0.35)'; x.lineWidth = 1;
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
    // orange-red accents
    x.strokeStyle = ORANGE; x.lineWidth = 3;
    x.strokeRect(330, 90, 120, 180);
    x.beginPath(); x.moveTo(60, 180); x.lineTo(460, 180); x.stroke();
    x.fillStyle = ORANGE; x.font = `600 20px ${TECH}`; x.textAlign = 'left';
    x.fillText('SMART CITY · DISTRICT 07', 40, h - 64);
    x.fillStyle = 'rgba(37,34,30,0.75)'; x.font = `500 15px ${TECH}`;
    x.fillText('spatial plan — M.Y.  ·  scale 1:500', 40, h - 40);
    x.fillStyle = ORANGE;
    x.beginPath(); x.moveTo(w - 70, 52); x.lineTo(w - 78, 68); x.lineTo(w - 62, 68); x.closePath(); x.fill();
  });
}

function keyboardTex() {
  return makeTex(1024, 320, (x, w, h) => {
    x.fillStyle = '#E8E1D3'; x.fillRect(0, 0, w, h);
    const kw = 52, kh = 44, gap = 10;
    const legends = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G'];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 15; c++) {
        const kx = 60 + c * (kw + gap), ky = 34 + r * (kh + gap);
        x.fillStyle = CHARCOAL;
        x.fillRect(kx, ky, kw, kh);
        x.strokeStyle = 'rgba(232,90,63,0.55)'; x.lineWidth = 1.5;
        x.strokeRect(kx + 3, ky + 3, kw - 6, kh - 6);
        x.fillStyle = ORANGE;
        x.font = `600 15px ${TECH}`;
        x.textAlign = 'center';
        x.fillText(legends[c] || '·', kx + kw / 2, ky + kh / 2 + 5);
      }
    }
    x.fillStyle = CHARCOAL; x.fillRect(300, 234, 420, 52);
    x.strokeStyle = 'rgba(232,90,63,0.55)'; x.strokeRect(303, 237, 414, 46);
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
    x.fillStyle = '#F3F0DF'; x.font = `600 22px ${TECH}`;
    x.fillText('MYY-01 · SENSOR NODE', 150, 292);
  });
}

function notepadTex() {
  return makeTex(560, 400, (x, w, h) => {
    x.fillStyle = '#FFFDF7'; x.fillRect(0, 0, w, h);
    x.strokeStyle = 'rgba(125,170,195,0.5)'; x.lineWidth = 1.4;
    for (let y = 118; y < h - 14; y += 42) { x.beginPath(); x.moveTo(28, y); x.lineTo(w - 22, y); x.stroke(); }
    x.strokeStyle = 'rgba(232,90,63,0.85)'; x.lineWidth = 2;
    x.beginPath(); x.moveTo(64, 0); x.lineTo(64, h); x.stroke();
    x.fillStyle = '#8b8b8f';
    for (let i = 0; i < 9; i++) { x.beginPath(); x.ellipse(52 + i * 54, 26, 9, 15, 0.35, 0, 7); x.fill(); }
    x.fillStyle = '#c04c3c'; x.font = '700 44px "Caveat", cursive';
    x.fillText('技能清單 SKILL LIST', 84, 92);
    x.fillStyle = '#3c3628'; x.font = '600 27px "Caveat", cursive';
    ['HTML · CSS · JavaScript', 'Python · C++ · MySQL', 'QGIS · Arduino'].forEach((r, i) => x.fillText(r, 92, 158 + i * 62));
    x.fillStyle = ORANGE;
    ['HTML · CSS · JavaScript', 'Python · C++ · MySQL', 'QGIS · Arduino'].forEach((_, i) => x.fillText('✓', 66, 158 + i * 62));
  });
}

function clipboardPaperTex() {
  return makeTex(256, 340, (x, w, h) => {
    x.fillStyle = '#FFFDF7'; x.fillRect(0, 0, w, h);
    x.strokeStyle = 'rgba(125,170,195,0.45)'; x.lineWidth = 1.2;
    for (let y = 60; y < h - 16; y += 34) { x.beginPath(); x.moveTo(20, y); x.lineTo(w - 20, y); x.stroke(); }
    x.strokeStyle = 'rgba(60,54,40,0.65)'; x.lineWidth = 2; x.lineCap = 'round';
    for (let y = 52; y < h - 22; y += 34) {
      const len = 90 + Math.random() * 100;
      x.beginPath(); x.moveTo(26, y - 8); x.lineTo(26 + len, y - 8); x.stroke();
    }
    x.fillStyle = ORANGE; x.font = '700 26px "Caveat", cursive';
    x.fillText(' My Awards & Photos', 28, 34);
  });
}

function cardTex() {
  return makeTex(512, 300, (x, w, h) => {
    x.fillStyle = CHARCOAL; x.fillRect(0, 0, w, h);
    x.strokeStyle = ORANGE; x.lineWidth = 4; x.strokeRect(14, 14, w - 28, h - 28);
    x.fillStyle = IVORY;
    x.font = '800 74px "Noto Sans TC", sans-serif';
    x.fillText('馬英源', 44, 128);
    x.fillStyle = ORANGE; x.font = `600 20px ${TECH}`;
    x.fillText('MA YING YUEN', 46, 190);
    x.fillStyle = '#c9c4b4'; x.font = `500 13px ${TECH}`;
    x.fillText('STEM STUDENT · HK', 46, 236);
  });
}

function saveBoxTex() {
  return makeTex(256, 340, (x, w, h) => {
    x.fillStyle = CHARCOAL; x.fillRect(0, 0, w, h);
    x.fillStyle = '#FFFDF7'; x.fillRect(44, 36, w - 88, 64);
    x.fillStyle = ORANGE; x.font = `26px "Press Start 2P", monospace`;
    x.textAlign = 'center'; x.fillText('SAVE', w / 2, 80);
    x.fillStyle = '#FFFDF7'; x.fillRect(w / 2 - 40, 150, 80, 80);
    x.fillStyle = CHARCOAL; x.fillRect(w / 2 - 24, 150, 30, 34); x.fillRect(w / 2 - 28, 196, 56, 34);
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
  renderer.toneMappingExposure = 1.0;
  container.appendChild(renderer.domElement);
  renderer.domElement.style.touchAction = 'none';

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xF3EFE4);

  const camera = new THREE.PerspectiveCamera(44, window.innerWidth / window.innerHeight, 0.1, 40);

  /* ----- materials ----- */
  const MAT = {
    cream: new THREE.MeshStandardMaterial({ color: 0xE8E1D3, roughness: 0.55 }),
    ivory: new THREE.MeshStandardMaterial({ color: 0xF3EFE4, roughness: 0.85 }),
    charcoal: new THREE.MeshStandardMaterial({ color: 0x25221E, roughness: 0.5, metalness: 0.25 }),
    alu: new THREE.MeshStandardMaterial({ color: 0xb8b2a4, metalness: 0.9, roughness: 0.28 }),
    glass: new THREE.MeshStandardMaterial({ color: 0xfff6e8, metalness: 0, roughness: 0.06, transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false }),
    accent: new THREE.MeshStandardMaterial({ color: 0x25221E, emissive: 0xE85A3F, emissiveIntensity: 1.5, roughness: 0.4 }),
    woodWarm: new THREE.MeshStandardMaterial({ color: 0xc9a876, roughness: 0.75 }),
  };

  /* ----- room ----- */
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xF3EFE4, roughness: 0.95 });
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
    new THREE.MeshStandardMaterial({ color: 0xD6CBBB, roughness: 0.9 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, 1.2);
  floor.receiveShadow = true;
  scene.add(floor);

  /* ----- lights (bright warm room) ----- */
  scene.add(new THREE.HemisphereLight(0xfff6e6, 0xcbbfa8, 1.05));
  const fill = new THREE.DirectionalLight(0xfff2dc, 0.7);
  fill.position.set(2.4, 3.6, 3.2);
  scene.add(fill);

  const lampSpot = new THREE.SpotLight(0xffe2b8, 14, 7, 0.62, 0.55, 1.6);
  lampSpot.castShadow = true;
  lampSpot.shadow.mapSize.set(IS_MOBILE ? 512 : 1024, IS_MOBILE ? 512 : 1024);
  lampSpot.shadow.bias = -0.0004;
  scene.add(lampSpot.target);
  const lampBulb = new THREE.PointLight(0xffdcae, 1.6, 2.6, 2);
  scene.add(lampBulb);

  /* ----- desk ----- */
  const wood = lightWoodTex();
  wood.wrapS = wood.wrapT = THREE.RepeatWrapping;
  const deskMat = new THREE.MeshStandardMaterial({ map: wood, color: 0xffffff, roughness: 0.6 });
  const legMat = MAT.charcoal;
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
   01 · HOLOGRAPHIC WORKSTATION
   ============================================================ */
  const console0 = new THREE.Group(); // physical base
  const holo = new THREE.Group();     // floating holographic layer

  // two-tier cream console
  const baseLower = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.055, 0.36), MAT.cream);
  baseLower.position.set(0, 0.028, 0);
  baseLower.castShadow = baseLower.receiveShadow = true;
  console0.add(baseLower);
  const baseUpper = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.05, 0.28), MAT.charcoal);
  baseUpper.position.set(0, 0.08, -0.02);
  baseUpper.castShadow = true;
  console0.add(baseUpper);
  // brushed aluminum rim
  const rim = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.012, 0.02), MAT.alu);
  rim.position.set(0, 0.056, 0.175);
  console0.add(rim);
  // orange-red ambient light strip on the console front
  const strip = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.006, 0.01), MAT.accent);
  strip.position.set(0, 0.056, 0.178);
  console0.add(strip);
  // central emitter
  const emitter = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.035, 24), MAT.charcoal);
  emitter.position.set(0, 0.12, -0.02);
  console0.add(emitter);
  const emitterLed = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.046, 0.006, 24), MAT.accent);
  emitterLed.position.set(0, 0.14, -0.02);
  console0.add(emitterLed);
  // projection light cone
  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(0.34, 0.42, 28, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xFFFDF7, transparent: true, opacity: 0.07, side: THREE.DoubleSide, depthWrite: false })
  );
  cone.position.set(0, 0.36, -0.02);
  console0.add(cone);
  // gesture rings (visual metaphor only)
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.004, 8, 40), new THREE.MeshBasicMaterial({ color: 0xE85A3F, transparent: true, opacity: 0.7 }));
  ring1.rotation.x = Math.PI / 2.3;
  ring1.position.set(0.3, 0.16, 0.1);
  console0.add(ring1);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.003, 8, 40), new THREE.MeshBasicMaterial({ color: 0xB83E2A, transparent: true, opacity: 0.4 }));
  ring2.rotation.x = Math.PI / 1.9;
  ring2.position.set(0.3, 0.2, 0.1);
  console0.add(ring2);

  console0.position.set(-0.12, DESK_Y, 0.02);
  scene.add(console0);

  /* --- holographic screens --- */
  const holoMain = new HoloMainScreen();
  const holoSide = new HoloSideScreen();

  const ARC_R = 1.35, ARC_L = 0.52, ARC_H = 0.46, arcFrontZ = 0.14;
  function holoStrip(height, radius, material, y) {
    const g = new THREE.CylinderGeometry(radius, radius, height, 40, 1, true, -ARC_L / 2, ARC_L);
    const m = new THREE.Mesh(g, material);
    m.position.set(0, y, arcFrontZ - radius);
    return m;
  }
  // main translucent curved panel
  const mainPanel = holoStrip(ARC_H, ARC_R, new THREE.MeshBasicMaterial({
    map: holoMain.texture, transparent: true, opacity: 0.96, side: THREE.DoubleSide, depthWrite: false,
  }), 0);
  holo.add(mainPanel);
  // thin orange edge frames
  const frameTop = holoStrip(0.006, ARC_R + 0.002, new THREE.MeshBasicMaterial({ color: 0xE85A3F, transparent: true, opacity: 0.8 }), 0.235);
  const frameBottom = frameTop.clone(); frameBottom.position.y = -0.235;
  holo.add(frameTop, frameBottom);

  // secondary panels
  function sidePanel(w, h, tex, x, y, z, ry) {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({
      map: tex, transparent: true, opacity: 0.94, side: THREE.DoubleSide, depthWrite: false,
    }));
    p.position.set(x, y, z);
    p.rotation.y = ry;
    return p;
  }
  const sidePanelL = sidePanel(0.46, 0.32, holoSide.texture, -0.56, 0.05, 0.02, 0.5);
  holo.add(sidePanelL);

  // floating holographic city model (between the panels)
  const holoCity = new THREE.Group();
  const cityBlocks = [[-0.09, 0, 0.09], [-0.03, 0.03, 0.14], [0.04, -0.02, 0.07], [0.1, 0.02, 0.1], [-0.12, -0.03, 0.06], [0.02, 0.06, 0.05]];
  cityBlocks.forEach(([bx, bz, bh], i) => {
    const solid = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, bh, 0.05),
      new THREE.MeshBasicMaterial({ color: 0xFFB895, transparent: true, opacity: 0.55 })
    );
    solid.position.set(bx, bh / 2, bz);
    const wire = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, bh, 0.05),
      new THREE.MeshBasicMaterial({ color: 0xB83E2A, wireframe: true, transparent: true, opacity: 0.95 })
    );
    wire.position.copy(solid.position);
    holoCity.add(solid, wire);
  });
  // ground grid under the model
  const grid = new THREE.Mesh(
    new THREE.PlaneGeometry(0.42, 0.42),
    new THREE.MeshBasicMaterial({ color: 0xB83E2A, wireframe: true, transparent: true, opacity: 0.45 })
  );
  grid.rotation.x = -Math.PI / 2;
  grid.position.y = 0.001;
  holoCity.add(grid);
  holoCity.position.set(0.12, 0.06, 0.06);
  holo.add(holoCity);

  holo.position.set(-0.12, DESK_Y + 0.62, 0.18);
  scene.add(holo);

  // hologram light onto the desk
  const holoGlow = new THREE.PointLight(0xFFC9A8, 0.7, 1.8, 2);
  holoGlow.position.set(-0.12, DESK_Y + 0.5, 0.45);
  scene.add(holoGlow);

  /* ============================================================
   02 · 3D PRINTER — cream housing, orange-red chamber light
   ============================================================ */
  const printer = new THREE.Group();
  const pScreen = new PrinterScreen();

  const pBase = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.06, 0.32), MAT.cream);
  pBase.position.y = 0.03;
  pBase.castShadow = true;
  printer.add(pBase);
  const pillarGeo = new THREE.BoxGeometry(0.022, 0.34, 0.022);
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
    const p = new THREE.Mesh(pillarGeo, MAT.charcoal);
    p.position.set(sx * 0.155, 0.23, sz * 0.125);
    p.castShadow = true;
    printer.add(p);
  });
  const railX = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.02, 0.022), MAT.alu);
  railX.position.set(0, 0.405, -0.125);
  printer.add(railX);
  const railX2 = railX.clone(); railX2.position.z = 0.125;
  printer.add(railX2);
  const railZ = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.02, 0.28), MAT.alu);
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
  const backPanel = new THREE.Mesh(new THREE.PlaneGeometry(0.31, 0.3), MAT.cream);
  backPanel.position.set(0, 0.22, -0.126);
  printer.add(backPanel);
  const gantry = new THREE.Mesh(new THREE.BoxGeometry(0.29, 0.014, 0.014), MAT.alu);
  gantry.position.set(0, 0.33, 0);
  printer.add(gantry);
  const printHead = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 0.045), MAT.charcoal);
  printHead.position.set(0, 0.30, 0);
  printHead.castShadow = true;
  printer.add(printHead);
  const nozzle = new THREE.Mesh(new THREE.ConeGeometry(0.008, 0.02, 10), MAT.accent);
  nozzle.rotation.x = Math.PI;
  nozzle.position.set(0, 0.268, 0);
  printer.add(nozzle);
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.012, 24), MAT.charcoal);
  plate.position.set(0, 0.068, -0.02);
  printer.add(plate);
  const cityPrint = new THREE.Group();
  const buildings = [];
  const bSeed = [[-0.03, -0.04, 0.05], [0.02, -0.03, 0.08], [0.04, 0.02, 0.04], [-0.04, 0.03, 0.06], [0.0, 0.0, 0.1], [-0.02, 0.05, 0.045], [0.05, -0.02, 0.05], [-0.06, -0.01, 0.04]];
  bSeed.forEach(([bx, bz, bh], i) => {
    const b = new THREE.Mesh(
      new THREE.BoxGeometry(0.028, bh, 0.028),
      new THREE.MeshStandardMaterial({ color: 0xFFFDF7, roughness: 0.6 })
    );
    b.position.set(bx, bh / 2, bz - 0.02);
    b.castShadow = true;
    cityPrint.add(b);
    buildings.push({ mesh: b, h: bh, order: i / bSeed.length });
  });
  cityPrint.position.set(0, 0.074, 0);
  printer.add(cityPrint);
  const miniScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.11, 0.055), new THREE.MeshBasicMaterial({ map: pScreen.texture, transparent: true }));
  miniScreen.position.set(0.08, 0.05, 0.161);
  printer.add(miniScreen);
  const pLed = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.006, 0.008), MAT.accent);
  pLed.position.set(0, 0.062, 0.158);
  printer.add(pLed);
  const spoolMount = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.09, 0.03), MAT.charcoal);
  spoolMount.position.set(0.19, 0.28, -0.06);
  printer.add(spoolMount);
  const spool = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.045, 24), MAT.ivory);
  spool.rotation.z = Math.PI / 2;
  spool.position.set(0.225, 0.28, -0.06);
  spool.castShadow = true;
  printer.add(spool);
  const spoolHub = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.05, 16), MAT.charcoal);
  spoolHub.rotation.z = Math.PI / 2;
  spoolHub.position.copy(spool.position);
  printer.add(spoolHub);

  printer.position.set(0.92, DESK_Y, -0.02);
  printer.rotation.y = -0.22;
  scene.add(printer);

  const printerLight = new THREE.PointLight(0xE85A3F, 0.45, 0.6, 2);
  printerLight.position.set(0.92, DESK_Y + 0.28, 0.0);
  scene.add(printerLight);

  /* ============================================================
   03 · DESK PROPS
   ============================================================ */
  const kbGroup = new THREE.Group();
  const kbBase = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.016, 0.21), MAT.cream);
  kbBase.position.y = 0.008;
  kbBase.castShadow = true;
  kbGroup.add(kbBase);
  const kbTex = keyboardTex();
  const kbTop = new THREE.Mesh(
    new THREE.BoxGeometry(0.66, 0.004, 0.19),
    new THREE.MeshStandardMaterial({
      map: kbTex, roughness: 0.55, metalness: 0.1,
      emissive: 0x803018, emissiveMap: kbTex, emissiveIntensity: 0.35,
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
    new THREE.MeshStandardMaterial({ color: 0x25221E, roughness: 0.4, metalness: 0.3 })
  );
  mouseMesh.scale.set(0.052, 0.03, 0.085);
  mouseMesh.position.set(0.62, DESK_Y + 0.024, 0.52);
  mouseMesh.castShadow = true;
  scene.add(mouseMesh);

  const card = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.007, 0.13),
    [
      new THREE.MeshStandardMaterial({ color: 0x25221E }), new THREE.MeshStandardMaterial({ color: 0x25221E }),
      new THREE.MeshStandardMaterial({ map: cardTex(), roughness: 0.5 }),
      new THREE.MeshStandardMaterial({ color: 0x25221E }), new THREE.MeshStandardMaterial({ color: 0x25221E }), new THREE.MeshStandardMaterial({ color: 0x25221E }),
    ]
  );
  card.position.set(0.4, DESK_Y + 0.004, 0.56);
  card.rotation.y = 0.18;
  scene.add(card);

  const notepad = new THREE.Mesh(
    new THREE.BoxGeometry(0.36, 0.01, 0.27),
    [
      new THREE.MeshStandardMaterial({ color: 0xe4ddcb }), new THREE.MeshStandardMaterial({ color: 0xe4ddcb }),
      new THREE.MeshStandardMaterial({ map: notepadTex(), roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: 0xfdfaf2 }), new THREE.MeshStandardMaterial({ color: 0xe4ddcb }), new THREE.MeshStandardMaterial({ color: 0xe4ddcb }),
    ]
  );
  notepad.position.set(-0.62, DESK_Y + 0.006, 0.56);
  notepad.rotation.y = -0.35;
  notepad.castShadow = true;
  scene.add(notepad);
  const pen = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.16, 10), MAT.charcoal);
  pen.rotation.z = Math.PI / 2;
  pen.rotation.y = 0.5;
  pen.position.set(-0.42, DESK_Y + 0.012, 0.62);
  pen.castShadow = true;
  scene.add(pen);

  const clipboard = new THREE.Group();
  const cbBoard = new THREE.Mesh(new THREE.BoxGeometry(0.27, 0.014, 0.36), new THREE.MeshStandardMaterial({ color: 0xc9a876, roughness: 0.8 }));
  clipboard.add(cbBoard);
  const cbPaper = new THREE.Mesh(
    new THREE.BoxGeometry(0.23, 0.006, 0.31),
    [
      new THREE.MeshStandardMaterial({ color: 0xfdfaf2 }), new THREE.MeshStandardMaterial({ color: 0xfdfaf2 }),
      new THREE.MeshStandardMaterial({ map: clipboardPaperTex(), roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: 0xfdfaf2 }), new THREE.MeshStandardMaterial({ color: 0xfdfaf2 }), new THREE.MeshStandardMaterial({ color: 0xfdfaf2 }),
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
    const chip = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.008, 0.024), MAT.charcoal);
    chip.position.set(cx, DESK_Y + 0.012, cz);
    scene.add(chip);
  });

  /* ============================================================
   04 · DESK LAMP (identity + key light)
   ============================================================ */
  const lamp = new THREE.Group();
  const lampMat = new THREE.MeshStandardMaterial({ color: 0x25221E, roughness: 0.42, metalness: 0.5 });
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
  const lampHead = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.17, 20, 1, true), lampMat);
  lampHead.position.set(0.02, 0.88, 0.14);
  lampHead.rotation.z = -0.7; lampHead.rotation.x = 0.5;
  lamp.add(lampHead);
  lamp.position.set(-1.28, DESK_Y, -0.12);
  scene.add(lamp);
  const headWorld = new THREE.Vector3();
  lampHead.getWorldPosition(headWorld);
  lampSpot.position.copy(headWorld);
  lampSpot.target.position.set(-0.75, 1.5, -1.4);
  lampBulb.position.copy(headWorld).add(new THREE.Vector3(0.05, -0.05, 0.1));

  /* ============================================================
   05 · WALL — idea wall (cream + charcoal + orange)
   ============================================================ */
  const corkGroup = new THREE.Group();
  const corkMat = new THREE.MeshStandardMaterial({ color: 0xc98d54, roughness: 0.9 });
  const cork = new THREE.Mesh(new THREE.BoxGeometry(1.04, 0.7, 0.035), corkMat);
  corkGroup.add(cork);
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x8a5e30, roughness: 0.7 });
  const fh = new THREE.BoxGeometry(1.13, 0.05, 0.05);
  const fv = new THREE.BoxGeometry(0.05, 0.75, 0.05);
  [[0, 0.365], [0, -0.365]].forEach(([fx, fy]) => {
    const f = new THREE.Mesh(fh, frameMat); f.position.set(fx, fy, 0.005); corkGroup.add(f);
  });
  [[-0.545, 0], [0.545, 0]].forEach(([fx, fy]) => {
    const f = new THREE.Mesh(fv, frameMat); f.position.set(fx, fy, 0.005); corkGroup.add(f);
  });
  const pinGeo = new THREE.SphereGeometry(0.016, 10, 10);
  const pinMat = new THREE.MeshStandardMaterial({ color: 0xE85A3F, roughness: 0.4 });
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

  const helloBack = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.64, 0.015), MAT.charcoal);
  helloBack.position.set(-0.55, 1.85, -1.675);
  scene.add(helloBack);
  const hello = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.58), new THREE.MeshStandardMaterial({ map: helloTex(), roughness: 0.88 }));
  hello.position.set(-0.55, 1.85, -1.665);
  scene.add(hello);

  const blueprint = new THREE.Mesh(new THREE.PlaneGeometry(0.52, 0.69), new THREE.MeshStandardMaterial({ map: blueprintTex(), roughness: 0.9 }));
  blueprint.position.set(0.28, 2.3, -1.68);
  blueprint.rotation.z = -0.01;
  scene.add(blueprint);

  const wallScreen = new WallScreen();
  const wallDisp = new THREE.Group();
  const wdBezel = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.03), MAT.charcoal);
  wallDisp.add(wdBezel);
  const wdScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.35), new THREE.MeshBasicMaterial({ map: wallScreen.texture, transparent: true }));
  wdScreen.position.z = 0.017;
  wallDisp.add(wdScreen);
  wallDisp.position.set(1.35, 2.25, -1.67);
  scene.add(wallDisp);
  const wallGlow = new THREE.PointLight(0xFFC9A8, 0.3, 1.4, 2);
  wallGlow.position.set(1.35, 2.2, -1.35);
  scene.add(wallGlow);

  const shelf = new THREE.Group();
  const shelfBoard = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.025, 0.18), new THREE.MeshStandardMaterial({ map: wood, color: 0xffffff, roughness: 0.7 }));
  shelfBoard.castShadow = true;
  shelf.add(shelfBoard);
  [-0.32, 0.32].forEach((bx) => {
    const br = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.09, 0.14), MAT.charcoal);
    br.position.set(bx, -0.055, 0.01);
    shelf.add(br);
  });
  const protoCity = new THREE.Group();
  [[-0.1, 0.03, 0.06], [-0.05, -0.02, 0.09], [0.02, 0.02, 0.05], [0.07, -0.01, 0.07]].forEach(([bx, bz, bh]) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.035, bh, 0.035), new THREE.MeshStandardMaterial({ color: 0xFFFDF7, roughness: 0.6 }));
    b.position.set(bx, bh / 2 + 0.0125, bz);
    b.castShadow = true;
    protoCity.add(b);
  });
  protoCity.position.set(-0.22, 0.013, 0);
  shelf.add(protoCity);
  const bridge = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 10, 20, Math.PI), MAT.cream);
  bridge.position.set(0.1, 0.012, 0);
  bridge.castShadow = true;
  shelf.add(bridge);
  const saveBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.17, 0.24, 0.06),
    [
      MAT.charcoal, MAT.charcoal, MAT.charcoal, MAT.charcoal,
      new THREE.MeshStandardMaterial({ map: saveBoxTex(), roughness: 0.6 }),
      MAT.charcoal,
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
    color: 0xE8A070, size: 0.014, transparent: true, opacity: 0.25, sizeAttenuation: true,
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
  registerHotspot(holo, 'monitor');
  registerHotspot(console0, 'monitor');
  registerHotspot(kbGroup, 'keyboard');
  registerHotspot(card, 'card');
  registerHotspot(notepad, 'board');
  registerHotspot(clipboard, 'photos');
  registerHotspot(lamp, 'lamp');

  const anchors = {
    monitor: new THREE.Vector3(-0.12, DESK_Y + 0.98, 0.2),
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
    lampSpot.intensity = on ? 14 : 0;
    lampBulb.intensity = on ? 1.6 : 0;
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
  let printAcc = 26;

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
      holoMain.update(dt, true);
      holoSide.update(dt, true);
      wallScreen.update(dt, true);
      // holographic layer: float + respond to the cursor
      holo.position.y = DESK_Y + 0.62 + Math.sin(t * 0.8) * 0.006;
      holo.rotation.y = S.parX * 0.05;
      holo.rotation.x = S.parY * 0.02;
      holoCity.rotation.y = t * 0.35;
      ring1.rotation.z = t * 0.6;
      ring2.rotation.z = -t * 0.45;
      const pos = dust.geometry.attributes.position;
      for (let i = 0; i < dustCount; i++) {
        let y = pos.getY(i) + dt * 0.03;
        if (y > 2.7) y = 0.8;
        pos.setY(i, y);
        pos.setX(i, pos.getX(i) + Math.sin(t * 0.6 + i) * 0.0004);
      }
      pos.needsUpdate = true;
      if (lampOn) {
        const f = 1 + Math.sin(t * 13.7) * 0.006 + Math.sin(t * 31.3) * 0.005;
        lampSpot.intensity = 14 * f;
      }
    } else {
      holoMain.update(0, false);
      holoSide.update(0, false);
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
