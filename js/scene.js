/* ==========================================================================
   scene.js — Procedural Three.js reconstruction of the template's 3D
   retro workstation: desk, CRT monitor, tower, keyboard, mouse, lamp,
   cork board, posters, papers, business card, cables, dust.
   Every texture is generated on a <canvas> — no external assets needed.
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

const PIXEL = '"Press Start 2P", monospace';

/* ---------- wall art textures ---------- */
function noteTex(label, lines) {
  return makeTex(220, 170, (x, w, h) => {
    x.fillStyle = '#f4efe0'; x.fillRect(0, 0, w, h);
    x.strokeStyle = 'rgba(0,0,0,0.08)'; x.strokeRect(1, 1, w - 2, h - 2);
    x.fillStyle = '#3c3628';
    x.font = `19px ${PIXEL}`;
    x.textAlign = 'center';
    x.fillText(label, w / 2, 48);
    x.strokeStyle = 'rgba(60,54,40,0.5)'; x.lineWidth = 2; x.lineCap = 'round';
    let y = 78;
    for (let i = 0; i < lines; i++) {
      const len = 60 + Math.random() * 90;
      x.beginPath();
      x.moveTo((w - len) / 2, y);
      x.lineTo((w + len) / 2, y);
      x.stroke();
      y += 22;
    }
  });
}

function heartTex() {
  return makeTex(256, 256, (x, w, h) => {
    x.fillStyle = '#0c0e0c'; x.fillRect(0, 0, w, h);
    x.strokeStyle = '#57d877'; x.lineWidth = 8; x.strokeRect(8, 8, w - 16, h - 16);
    // pixel heart map
    const m = [
      '01100110',
      '11111111',
      '11111111',
      '11111111',
      '01111110',
      '00111100',
      '00011000',
    ];
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
    x.fillStyle = '#f4efe2'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#191713';
    x.font = `40px ${PIXEL}`;
    x.textAlign = 'center';
    x.fillText('HELLO,', w / 2, 165);
    x.fillText('WORLD!', w / 2, 235);
    x.fillStyle = '#a09a8c';
    x.font = `13px ${PIXEL}`;
    x.fillText('404: SLEEP NOT FOUND', w / 2, 330);
  });
}

function termPosterTex() {
  return makeTex(512, 400, (x, w, h) => {
    x.fillStyle = '#0a0d0a'; x.fillRect(0, 0, w, h);
    x.strokeStyle = '#202820'; x.lineWidth = 6; x.strokeRect(3, 3, w - 6, h - 6);
    const rows = [
      ['#58e06e', '> portfolio.build()'],
      ['#e8d44d', '// sleep: null'],
      ['#58e06e', 'const me = {'],
      ['#4fcf6f', '  name: "MA YY",'],
      ['#4fcf6f', '  mode: "STEM",'],
      ['#e8d44d', '  coffee: Infinity'],
      ['#58e06e', '};'],
    ];
    x.font = `15px ${PIXEL}`;
    rows.forEach(([c, t], i) => {
      x.fillStyle = c;
      x.globalAlpha = 1 - i * 0.06;
      x.fillText(t, 34, 62 + i * 44);
    });
    x.globalAlpha = 1;
  });
}

function invader(x, ox, oy, s, color) {
  const m = [
    '..X.....X..',
    '...X...X...',
    '..XXXXXXX..',
    '.XX.XXX.XX.',
    'XXXXXXXXXXX',
    'X.XXXXXXX.X',
    'X.X.....X.X',
    '...XX.XX...',
  ];
  x.fillStyle = color;
  m.forEach((row, ry) => [...row].forEach((v, rx) => {
    if (v === 'X') x.fillRect(ox + rx * s, oy + ry * s, s - 1, s - 1);
  }));
}

function gameoverTex() {
  return makeTex(420, 600, (x, w, h) => {
    x.fillStyle = '#0b0d0b'; x.fillRect(0, 0, w, h);
    x.strokeStyle = '#3aa54e'; x.lineWidth = 10; x.strokeRect(12, 12, w - 24, h - 24);
    invader(x, w / 2 - 36, 64, 6.4, '#57d877');
    invader(x, w / 2 - 36, 158, 6.4, '#57d877');
    invader(x, w / 2 - 36, 252, 6.4, '#e8d44d');
    x.textAlign = 'center';
    x.fillStyle = '#b8e05a';
    x.font = `34px ${PIXEL}`;
    x.fillText('GAME', w / 2, 408);
    x.fillStyle = '#57d877';
    x.fillText('OVER?', w / 2, 462);
    x.fillStyle = '#3f8f4f';
    x.font = `13px ${PIXEL}`;
    x.fillText('INSERT COIN', w / 2, 522);
    x.fillText('PUSH START', w / 2, 552);
  });
}

/* ---------- desk-object textures ---------- */
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

function towerFrontTex() {
  return makeTex(256, 512, (x, w, h) => {
    x.fillStyle = '#d6d2c0'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#c2beac';
    x.fillRect(28, 46, w - 56, 14); x.fillRect(28, 78, w - 56, 14);
    x.fillStyle = '#8f8b7a'; x.fillRect(150, 118, 26, 10);
    x.beginPath(); x.arc(66, 124, 9, 0, 7); x.fillStyle = '#57d877'; x.fill();
    x.fillStyle = '#b5b1a0';
    for (let i = 0; i < 9; i++) x.fillRect(34, 170 + i * 10, w - 68, 5);
    x.fillStyle = '#57d877';
    x.beginPath(); x.arc(w - 44, h - 40, 6, 0, 7); x.fill();
    x.strokeStyle = 'rgba(0,0,0,0.12)'; x.strokeRect(1, 1, w - 2, h - 2);
  });
}

function notepadTex() {
  return makeTex(560, 400, (x, w, h) => {
    x.fillStyle = '#f7f3e6'; x.fillRect(0, 0, w, h);
    // ruled lines
    x.strokeStyle = 'rgba(125,170,195,0.5)'; x.lineWidth = 1.4;
    for (let y = 118; y < h - 14; y += 42) { x.beginPath(); x.moveTo(28, y); x.lineTo(w - 22, y); x.stroke(); }
    // margin
    x.strokeStyle = 'rgba(214,110,110,0.55)'; x.lineWidth = 2;
    x.beginPath(); x.moveTo(64, 0); x.lineTo(64, h); x.stroke();
    // spiral rings
    x.fillStyle = '#8b8b8f';
    for (let i = 0; i < 9; i++) {
      x.beginPath(); x.ellipse(52 + i * 54, 26, 9, 15, 0.35, 0, 7); x.fill();
    }
    // title
    x.fillStyle = '#c04c3c';
    x.font = '700 44px "Caveat", cursive';
    x.fillText('技能清單 SKILL LIST', 84, 92);
    // skills
    x.fillStyle = '#3c3628';
    x.font = '600 27px "Caveat", cursive';
    const rows = ['HTML · CSS · JavaScript', 'Python · C++ · MySQL', 'QGIS · Arduino'];
    rows.forEach((r, i) => x.fillText(r, 92, 158 + i * 62));
    // check bullets
    x.fillStyle = '#4f9e5f';
    rows.forEach((_, i) => x.fillText('✓', 66, 158 + i * 62));
  });
}

function clipboardPaperTex() {
  return makeTex(256, 340, (x, w, h) => {
    x.fillStyle = '#f9f6ea'; x.fillRect(0, 0, w, h);
    x.strokeStyle = 'rgba(125,170,195,0.45)'; x.lineWidth = 1.2;
    for (let y = 60; y < h - 16; y += 34) { x.beginPath(); x.moveTo(20, y); x.lineTo(w - 20, y); x.stroke(); }
    x.strokeStyle = 'rgba(60,54,40,0.65)'; x.lineWidth = 2; x.lineCap = 'round';
    for (let y = 52; y < h - 22; y += 34) {
      const len = 90 + Math.random() * 100;
      x.beginPath(); x.moveTo(26, y - 8); x.lineTo(26 + len, y - 8); x.stroke();
    }
    x.fillStyle = '#c04c3c';
    x.font = '700 26px "Caveat", cursive';
    x.fillText(' My Awards & Photos', 28, 34);
  });
}

function cardTex() {
  return makeTex(512, 300, (x, w, h) => {
    x.fillStyle = '#0b120c'; x.fillRect(0, 0, w, h);
    x.strokeStyle = '#3fdf5f'; x.lineWidth = 4; x.strokeRect(14, 14, w - 28, h - 28);
    x.fillStyle = '#4fe36a';
    x.font = '800 74px "Noto Sans TC", sans-serif';
    x.fillText('馬英源', 44, 128);
    x.fillStyle = '#e8b33a';
    x.font = `17px ${PIXEL}`;
    x.fillText('MA YING YUEN', 46, 190);
    x.fillStyle = '#6fae77';
    x.font = `11px ${PIXEL}`;
    x.fillText('STEM STUDENT · HK', 46, 236);
  });
}

function saveBoxTex() {
  return makeTex(256, 340, (x, w, h) => {
    x.fillStyle = '#1f2024'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#f2f0e8'; x.fillRect(44, 36, w - 88, 64);
    x.fillStyle = '#17181c';
    x.font = `26px ${PIXEL}`;
    x.textAlign = 'center';
    x.fillText('SAVE', w / 2, 80);
    // floppy glyph
    x.fillStyle = '#f2f0e8';
    x.fillRect(w / 2 - 40, 150, 80, 80);
    x.fillStyle = '#1f2024';
    x.fillRect(w / 2 - 24, 150, 30, 34);
    x.fillRect(w / 2 - 28, 196, 56, 34);
    x.fillStyle = '#f2f0e8';
    x.font = `10px ${PIXEL}`;
    x.fillText('DISK', w / 2, 288);
  });
}

/* ---------- monitor live screen (typing terminal) ---------- */
class CRTScreen {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 512; this.canvas.height = 384;
    this.ctx = this.canvas.getContext('2d');
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.lines = [
      '> MA-YING-YUEN:~$ whoami',
      '  Ma Ying Yuen - STEM Student',
      '> ./portfolio.exe --start',
      '  loading awards[60+] .... ok',
      '  loading projects[4] .... ok',
      '> status: READY',
    ];
    this.li = 0; this.ci = 0; this.acc = 0; this.hold = 0;
    this.done = false;
    this.drawStatic();
  }
  drawStatic() {
    const x = this.ctx;
    x.fillStyle = '#040704'; x.fillRect(0, 0, 512, 384);
    x.fillStyle = 'rgba(90,220,110,0.04)';
    for (let y = 0; y < 384; y += 4) x.fillRect(0, y, 512, 1);
  }
  update(dt, motion = true) {
    if (!motion) {
      // reduced motion: render the full terminal statically, no blinking
      this.drawStatic();
      const x = this.ctx;
      x.font = 'bold 14px "Courier New", monospace';
      x.fillStyle = '#4fd96b';
      x.shadowColor = 'rgba(99,224,110,0.9)'; x.shadowBlur = 8;
      this.lines.forEach((line, i) => x.fillText(line, 24, 40 + i * 27));
      x.shadowBlur = 0;
      this.texture.needsUpdate = true;
      return;
    }
    if (this.done) {
      this.hold += dt;
      if (this.hold > 2.6) { this.li = 0; this.ci = 0; this.hold = 0; this.done = false; this.drawStatic(); }
      return;
    }
    this.acc += dt;
    while (this.acc > 0.045) {
      this.acc -= 0.045;
      this.ci++;
      const line = this.lines[this.li];
      if (this.ci >= line.length) { this.li++; this.ci = 0; }
      if (this.li >= this.lines.length) { this.done = true; }
    }
    const x = this.ctx;
    this.drawStatic();
    x.font = 'bold 14px "Courier New", monospace';
    x.fillStyle = '#4fd96b';
    x.shadowColor = 'rgba(99,224,110,0.9)'; x.shadowBlur = 8;
    for (let i = 0; i <= Math.min(this.li, this.lines.length - 1); i++) {
      const text = i < this.li ? this.lines[i] : this.lines[i].slice(0, this.ci);
      x.fillText(text, 24, 40 + i * 27);
    }
    if (Math.floor(performance.now() / 400) % 2 === 0) {
      const curY = 40 + Math.min(this.li, this.lines.length - 1) * 27;
      const base = this.done
        ? this.lines[this.lines.length - 1]
        : this.lines[Math.min(this.li, this.lines.length - 1)].slice(0, this.ci);
      x.fillRect(26 + x.measureText(base).width, curY - 12, 10, 15);
    }
    x.shadowBlur = 0;
    this.texture.needsUpdate = true;
  }
}

/* ==========================================================================
   buildScene — creates everything, returns controller
   ========================================================================== */
export function buildScene(container, opts = {}) {
  let motionOn = !opts.reduceMotion;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, IS_MOBILE ? 1.75 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.38;
  container.appendChild(renderer.domElement);
  renderer.domElement.id = 'scene-canvas';
  renderer.domElement.style.touchAction = 'none';

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xded6c4);

  const camera = new THREE.PerspectiveCamera(44, window.innerWidth / window.innerHeight, 0.1, 40);

  /* ----- room ----- */
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xe2dac6, roughness: 0.96 });
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
    new THREE.MeshStandardMaterial({ color: 0xcfc3ae, roughness: 0.95 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, 1.2);
  floor.receiveShadow = true;
  scene.add(floor);

  /* ----- lights ----- */
  scene.add(new THREE.HemisphereLight(0xfff4e0, 0x8a7a5e, 0.9));
  const fill = new THREE.DirectionalLight(0xfff1dc, 0.72);
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

  const DESK_Y = 0.865; // top surface for objects

  /* ----- CRT monitor ----- */
  const monitor = new THREE.Group();
  const beige = new THREE.MeshStandardMaterial({ color: 0xd9d5c4, roughness: 0.62 });
  const beigeDark = new THREE.MeshStandardMaterial({ color: 0xc9c5b2, roughness: 0.66 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.54, 0.5), beige);
  body.position.y = 0.33;
  body.castShadow = true;
  monitor.add(body);
  const bezel = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.56, 0.05), beigeDark);
  bezel.position.set(0, 0.33, 0.245);
  bezel.castShadow = true;
  monitor.add(bezel);
  const crt = new CRTScreen();
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.56, 0.42),
    new THREE.MeshBasicMaterial({ map: crt.texture })
  );
  screen.position.set(0, 0.345, 0.272);
  monitor.add(screen);
  const led = new THREE.Mesh(
    new THREE.SphereGeometry(0.011, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0x63e06e })
  );
  led.position.set(0.29, 0.085, 0.272);
  monitor.add(led);
  const neck = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.09, 0.24), beigeDark);
  neck.position.y = 0.045;
  monitor.add(neck);
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.045, 0.34), beige);
  base.position.y = 0.0;
  base.castShadow = true;
  monitor.add(base);
  monitor.position.set(-0.12, DESK_Y, -0.02);
  scene.add(monitor);

  const screenGlow = new THREE.PointLight(0x63e06e, 0.3, 1.4, 2);
  screenGlow.position.set(-0.12, DESK_Y + 0.42, 0.5);
  scene.add(screenGlow);

  /* ----- tower ----- */
  const towerMats = [
    beige, beige, beige, beige,
    new THREE.MeshStandardMaterial({ map: towerFrontTex(), roughness: 0.6 }),
    beigeDark,
  ];
  const tower = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.92, 0.54), towerMats);
  tower.position.set(1.0, DESK_Y + 0.46, -0.08);
  tower.castShadow = true;
  scene.add(tower);

  /* ----- keyboard ----- */
  const kbGroup = new THREE.Group();
  const kbBase = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.035, 0.25), beige);
  kbBase.position.y = 0.017;
  kbBase.castShadow = true;
  kbGroup.add(kbBase);
  const keyGeo = new THREE.BoxGeometry(0.034, 0.016, 0.034);
  const keyMat = new THREE.MeshStandardMaterial({ color: 0xe8e4d2, roughness: 0.55 });
  const rows = 5, cols = 15, numpadCols = 4;
  const keyCount = rows * cols + rows * numpadCols;
  const keys = new THREE.InstancedMesh(keyGeo, keyMat, keyCount);
  const dummy = new THREE.Object3D();
  let ki = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dummy.position.set(-0.335 + c * 0.0478, 0.042, -0.088 + r * 0.044);
      dummy.updateMatrix();
      keys.setMatrixAt(ki++, dummy.matrix);
    }
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < numpadCols; c++) {
      dummy.position.set(0.408 + c * 0.037, 0.042, -0.082 + r * 0.044);
      dummy.updateMatrix();
      keys.setMatrixAt(ki++, dummy.matrix);
    }
  }
  kbGroup.add(keys);
  kbGroup.position.set(0.06, DESK_Y, 0.5);
  kbGroup.rotation.y = 0.03;
  scene.add(kbGroup);

  /* ----- mouse + cable ----- */
  const mouseMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, 20, 16),
    new THREE.MeshStandardMaterial({ color: 0xefeade, roughness: 0.45 })
  );
  mouseMesh.scale.set(0.055, 0.032, 0.088);
  mouseMesh.position.set(0.78, DESK_Y + 0.026, 0.52);
  mouseMesh.castShadow = true;
  scene.add(mouseMesh);
  const cableCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.8, DESK_Y + 0.02, 0.44),
    new THREE.Vector3(0.84, DESK_Y + 0.01, 0.3),
    new THREE.Vector3(0.95, DESK_Y + 0.02, 0.18),
    new THREE.Vector3(1.02, DESK_Y + 0.1, 0.1),
  ]);
  const cable = new THREE.Mesh(
    new THREE.TubeGeometry(cableCurve, 28, 0.006, 6),
    new THREE.MeshStandardMaterial({ color: 0x2c2c28, roughness: 0.6 })
  );
  scene.add(cable);
  const kbdCable = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.4, DESK_Y + 0.01, 0.56),
      new THREE.Vector3(0.55, DESK_Y + 0.005, 0.62),
      new THREE.Vector3(0.72, DESK_Y + 0.01, 0.6),
    ]), 20, 0.005, 6),
    cable.material
  );
  scene.add(kbdCable);
  const monCable = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.16, DESK_Y + 0.02, -0.28),
      new THREE.Vector3(0.5, DESK_Y - 0.1, -0.42),
      new THREE.Vector3(0.85, DESK_Y + 0.05, -0.3),
      new THREE.Vector3(0.98, DESK_Y + 0.2, -0.2),
    ]), 32, 0.008, 6),
    cable.material
  );
  scene.add(monCable);

  /* ----- lamp ----- */
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
  lamp.position.set(-1.02, DESK_Y, -0.12);
  scene.add(lamp);

  const headWorld = new THREE.Vector3();
  head.getWorldPosition(headWorld);
  lampSpot.position.copy(headWorld);
  lampSpot.target.position.set(-0.7, 1.5, -1.4);
  lampBulb.position.copy(headWorld).add(new THREE.Vector3(0.05, -0.05, 0.1));

  /* ----- SAVE box ----- */
  const saveBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.17, 0.24, 0.06),
    [
      lampMat, lampMat, lampMat, lampMat,
      new THREE.MeshStandardMaterial({ map: saveBoxTex(), roughness: 0.7 }),
      lampMat,
    ]
  );
  saveBox.position.set(-1.24, DESK_Y + 0.115, 0.3);
  saveBox.rotation.y = -0.25;
  saveBox.castShadow = true;
  scene.add(saveBox);

  /* ----- cork board with notes ----- */
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
    const n = new THREE.Mesh(
      new THREE.PlaneGeometry(0.21, 0.165),
      new THREE.MeshStandardMaterial({ map: noteTex(d.t, 2), roughness: 0.85 })
    );
    n.position.set(d.x, d.y, 0.024);
    n.rotation.z = d.r;
    corkGroup.add(n);
    const p = new THREE.Mesh(pinGeo, pinMat);
    p.position.set(d.x + 0.075, d.y + 0.072, 0.036);
    corkGroup.add(p);
  });
  corkGroup.position.set(-1.08, 1.98, -1.67);
  scene.add(corkGroup);

  /* ----- wall posters ----- */
  const heart = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3), new THREE.MeshStandardMaterial({ map: heartTex(), roughness: 0.8 }));
  heart.position.set(-0.46, 2.32, -1.68);
  heart.rotation.z = 0.05;
  scene.add(heart);

  const termPoster = new THREE.Mesh(new THREE.PlaneGeometry(0.56, 0.44), new THREE.MeshStandardMaterial({ map: termPosterTex(), roughness: 0.85 }));
  termPoster.position.set(0.08, 2.68, -1.68);
  scene.add(termPoster);

  const hello = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.58), new THREE.MeshStandardMaterial({ map: helloTex(), roughness: 0.88 }));
  hello.position.set(0.08, 2.12, -1.68);
  scene.add(hello);

  const gameover = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.9), new THREE.MeshStandardMaterial({ map: gameoverTex(), roughness: 0.85 }));
  gameover.position.set(1.14, 2.2, -1.67);
  gameover.rotation.z = 0.015;
  scene.add(gameover);

  /* ----- papers on desk ----- */
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
  clipboard.position.set(-0.66, DESK_Y + 0.01, 0.3);
  clipboard.rotation.y = 0.55;
  scene.add(clipboard);

  const notepad = new THREE.Mesh(
    new THREE.BoxGeometry(0.36, 0.01, 0.27),
    [
      new THREE.MeshStandardMaterial({ color: 0xdcd6c2 }), new THREE.MeshStandardMaterial({ color: 0xdcd6c2 }),
      new THREE.MeshStandardMaterial({ map: notepadTex(), roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: 0xf2eddc }), new THREE.MeshStandardMaterial({ color: 0xdcd6c2 }), new THREE.MeshStandardMaterial({ color: 0xdcd6c2 }),
    ]
  );
  notepad.position.set(-0.24, DESK_Y + 0.006, 0.56);
  notepad.rotation.y = -0.35;
  notepad.castShadow = true;
  scene.add(notepad);

  const card = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.007, 0.13),
    [
      new THREE.MeshStandardMaterial({ color: 0x101810 }), new THREE.MeshStandardMaterial({ color: 0x101810 }),
      new THREE.MeshStandardMaterial({ map: cardTex(), roughness: 0.5 }),
      new THREE.MeshStandardMaterial({ color: 0x101810 }), new THREE.MeshStandardMaterial({ color: 0x101810 }), new THREE.MeshStandardMaterial({ color: 0x101810 }),
    ]
  );
  card.position.set(0.56, DESK_Y + 0.004, 0.55);
  card.rotation.y = 0.18;
  scene.add(card);

  /* ----- dust motes ----- */
  const dustCount = 60;
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 2.6;
    dustPos[i * 3 + 1] = 0.8 + Math.random() * 1.8;
    dustPos[i * 3 + 2] = -0.5 + Math.random() * 1.6;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
    color: 0xfff4d8, size: 0.014, transparent: true, opacity: 0.4, sizeAttenuation: true,
  }));
  scene.add(dust);

  /* ---------- camera control ---------- */
  const target = new THREE.Vector3(0.05, 1.22, 0.05);
  const S = {
    radius: IS_MOBILE ? 4.9 : 3.55,
    theta: 0, phi: 1.34,
    tRadius: IS_MOBILE ? 4.9 : 3.55,
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
  const hotspots = []; // {mesh, id}
  let hovered = null;
  const onHover = opts.onHover || (() => {});
  const onSelect = opts.onSelect || (() => {});

  function registerHotspot(obj, id) {
    obj.traverse((o) => { if (o.isMesh) hotspots.push({ mesh: o, id }); });
  }
  registerHotspot(monitor, 'monitor');
  registerHotspot(kbGroup, 'keyboard');
  registerHotspot(card, 'card');
  registerHotspot(notepad, 'board');
  registerHotspot(clipboard, 'photos');
  registerHotspot(lamp, 'lamp');
  saveBox.userData.rootLamp = true;
  registerHotspot(saveBox, 'lamp');

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

  function tick() {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(clock.getDelta(), 0.1);
    const t = clock.elapsedTime;

    // damping
    const k = 1 - Math.exp(-7 * dt);
    S.theta += (S.tTheta - S.theta) * k;
    S.phi += (S.tPhi - S.phi) * k;
    S.radius += (S.tRadius - S.radius) * k;
    if (!S.dragging) {
      S.tTheta *= Math.exp(-0.5 * dt); // gentle recentre after orbiting
    }
    if (S.introT >= 0) {
      S.introT += dt;
      const p = Math.min(S.introT / 1.7, 1);
      const e = 1 - Math.pow(1 - p, 3);
      S.radius = S.tRadius = THREE.MathUtils.lerp(S.introFrom, S.tRadius, e);
      S.phi = S.tPhi = THREE.MathUtils.lerp(1.48, 1.34, e);
      if (p >= 1) S.introT = -1;
    }

    crt.update(motionOn ? dt : 0, motionOn);
    applyCamera();

    if (motionOn) {
      // dust drift
      const pos = dust.geometry.attributes.position;
      for (let i = 0; i < dustCount; i++) {
        let y = pos.getY(i) + dt * 0.035;
        if (y > 2.7) y = 0.8;
        pos.setY(i, y);
        pos.setX(i, pos.getX(i) + Math.sin(t * 0.6 + i) * 0.0004);
      }
      pos.needsUpdate = true;
      // lamp flicker
      if (lampOn) {
        const f = 1 + Math.sin(t * 13.7) * 0.008 + Math.sin(t * 31.3) * 0.006;
        lampSpot.intensity = 26 * f;
      }
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
    crt,
    lamp: { toggle: () => { setLamp(!lampOn); return lampOn; } },
    pause() { running = false; cancelAnimationFrame(raf); },
    resume() { if (!running) { running = true; clock.getDelta(); tick(); } },
    setReduceMotion(v) { motionOn = !v; },
  };
}
