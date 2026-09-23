import * as THREE from "three";

/**
 * Website "screens" painted on canvases at runtime: abstract but believable
 * layouts (nav, hero, images, text lines, buttons) in the site's palette.
 * No external images, nothing to download.
 */

const ACID = "#b6ff3b";
const ACID_DIM = "rgba(182,255,59,0.55)";

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Ctx = CanvasRenderingContext2D;

function rr(c: Ctx, x: number, y: number, w: number, h: number, r: number) {
  const k = Math.min(r, w / 2, h / 2);
  c.beginPath();
  c.moveTo(x + k, y);
  c.arcTo(x + w, y, x + w, y + h, k);
  c.arcTo(x + w, y + h, x, y + h, k);
  c.arcTo(x, y + h, x, y, k);
  c.arcTo(x, y, x + w, y, k);
  c.closePath();
}

function fillRR(c: Ctx, x: number, y: number, w: number, h: number, r: number, style: string | CanvasGradient) {
  rr(c, x, y, w, h, r);
  c.fillStyle = style;
  c.fill();
}

function strokeRR(c: Ctx, x: number, y: number, w: number, h: number, r: number, style: string, lw = 2) {
  rr(c, x, y, w, h, r);
  c.strokeStyle = style;
  c.lineWidth = lw;
  c.stroke();
}

/** Text placeholder: a row of rounded bars of varying length. */
function textLines(c: Ctx, x: number, y: number, w: number, lines: number, lh: number, color: string, r: () => number, bar = 0.42) {
  for (let i = 0; i < lines; i++) {
    const last = i === lines - 1;
    const len = w * (last ? 0.35 + r() * 0.3 : 0.75 + r() * 0.25);
    fillRR(c, x, y + i * lh, len, lh * bar, (lh * bar) / 2, color);
  }
}

function image(c: Ctx, x: number, y: number, w: number, h: number, r: number, rnd: () => number, accent = true) {
  const g = c.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, "#1f1f1f");
  g.addColorStop(1, accent && rnd() > 0.45 ? "rgba(182,255,59,0.28)" : "#2a2a2a");
  fillRR(c, x, y, w, h, r, g);
  // abstract subject: a soft orb
  const cx = x + w * (0.3 + rnd() * 0.4);
  const cy = y + h * (0.35 + rnd() * 0.3);
  const rad = Math.min(w, h) * (0.18 + rnd() * 0.15);
  const o = c.createRadialGradient(cx, cy, 0, cx, cy, rad);
  o.addColorStop(0, "rgba(255,255,255,0.22)");
  o.addColorStop(1, "rgba(255,255,255,0)");
  c.fillStyle = o;
  c.fillRect(x, y, w, h);
}

function canvas(w: number, h: number) {
  const el = document.createElement("canvas");
  el.width = w;
  el.height = h;
  return { el, c: el.getContext("2d")! };
}

function toTexture(el: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(el);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** Window chrome: dark glass body, top bar with three dots and an address pill. */
function chrome(c: Ctx, w: number, h: number, bar = 44) {
  fillRR(c, 0, 0, w, h, 26, "rgba(12,12,12,0.94)");
  strokeRR(c, 1, 1, w - 2, h - 2, 26, "rgba(255,255,255,0.16)", 2);
  c.fillStyle = "rgba(255,255,255,0.06)";
  c.fillRect(2, bar, w - 4, 1.5);
  ["#3a3a3a", "#3a3a3a", "#3a3a3a"].forEach((col, i) => {
    c.beginPath();
    c.arc(26 + i * 20, bar / 2, 5.5, 0, Math.PI * 2);
    c.fillStyle = col;
    c.fill();
  });
  fillRR(c, w / 2 - w * 0.18, bar / 2 - 10, w * 0.36, 20, 10, "rgba(255,255,255,0.06)");
  return bar;
}

/** Small site thumbnail (constellation frames). */
export function siteThumb(seed: number) {
  const r = rng(seed);
  const W = 640;
  const H = 400;
  const { el, c } = canvas(W, H);
  const top = chrome(c, W, H, 34);
  const pad = 30;
  // nav
  fillRR(c, pad, top + 18, 60, 12, 6, "rgba(255,255,255,0.7)");
  for (let i = 0; i < 3; i++) fillRR(c, W - pad - 190 + i * 52, top + 20, 38, 8, 4, "rgba(255,255,255,0.28)");
  fillRR(c, W - pad - 34, top + 14, 34, 18, 9, ACID);
  const layout = Math.floor(r() * 3);
  if (layout === 0) {
    textLines(c, pad, top + 64, 280, 3, 30, "rgba(255,255,255,0.8)", r, 0.55);
    textLines(c, pad, top + 170, 240, 2, 18, "rgba(255,255,255,0.3)", r);
    fillRR(c, pad, top + 222, 110, 30, 15, ACID);
    image(c, 340, top + 60, W - 340 - pad, 220, 18, r);
  } else if (layout === 1) {
    image(c, pad, top + 58, W - pad * 2, 150, 18, r);
    textLines(c, pad, top + 230, 300, 2, 28, "rgba(255,255,255,0.8)", r, 0.5);
    for (let i = 0; i < 3; i++) fillRR(c, pad + i * 196, top + 300, 180, 50, 12, "rgba(255,255,255,0.06)");
  } else {
    textLines(c, W / 2 - 170, top + 66, 340, 2, 34, "rgba(255,255,255,0.85)", r, 0.55);
    fillRR(c, W / 2 - 60, top + 150, 120, 30, 15, ACID);
    for (let i = 0; i < 3; i++) image(c, pad + i * 196, top + 205, 180, 130, 14, r, i === 1);
  }
  return toTexture(el);
}

/**
 * The problem-section browser, in four stackable layers:
 * base (a site that merely exists), then clarity, trust and desire.
 */
export function browserLayers() {
  const W = 1024;
  const H = 700;
  const r = rng(7);

  const base = canvas(W, H);
  {
    const c = base.c;
    const top = chrome(c, W, H);
    const dash = (x: number, y: number, w: number, h: number) => {
      c.setLineDash([8, 8]);
      strokeRR(c, x, y, w, h, 10, "rgba(255,255,255,0.16)", 2);
      c.setLineDash([]);
    };
    dash(48, top + 34, 90, 20);
    for (let i = 0; i < 4; i++) dash(W - 420 + i * 92, top + 36, 70, 16);
    dash(48, top + 110, 460, 190);
    dash(560, top + 110, W - 608, 300);
    dash(48, top + 330, 460, 80);
    for (let i = 0; i < 3; i++) dash(48 + i * 318, top + 450, 290, 170);
  }

  const clarity = canvas(W, H);
  {
    const c = clarity.c;
    fillRR(c, 48, 44 + 34, 90, 20, 10, "rgba(255,255,255,0.85)");
    for (let i = 0; i < 4; i++) fillRR(c, W - 420 + i * 92, 44 + 40, 64, 10, 5, "rgba(255,255,255,0.4)");
    textLines(c, 48, 44 + 118, 450, 3, 56, "rgba(255,255,255,0.92)", r, 0.62);
    textLines(c, 48, 44 + 300, 400, 3, 26, "rgba(255,255,255,0.38)", r, 0.45);
    image(c, 560, 44 + 110, W - 608, 300, 20, r);
  }

  const trust = canvas(W, H);
  {
    const c = trust.c;
    // stars + rating
    for (let i = 0; i < 5; i++) {
      const x = 60 + i * 30;
      const y = 44 + 440;
      c.beginPath();
      for (let k = 0; k < 10; k++) {
        const a = -Math.PI / 2 + (k * Math.PI) / 5;
        const rad = k % 2 === 0 ? 11 : 5;
        c.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
      }
      c.closePath();
      c.fillStyle = ACID;
      c.fill();
    }
    // three testimonial / logo cards
    for (let i = 0; i < 3; i++) {
      const x = 48 + i * 318;
      const y = 44 + 470;
      fillRR(c, x, y, 290, 150, 16, "rgba(255,255,255,0.06)");
      strokeRR(c, x, y, 290, 150, 16, "rgba(255,255,255,0.14)", 2);
      c.beginPath();
      c.arc(x + 34, y + 36, 16, 0, Math.PI * 2);
      c.fillStyle = "rgba(255,255,255,0.35)";
      c.fill();
      textLines(c, x + 64, y + 26, 150, 2, 16, "rgba(255,255,255,0.5)", r);
      textLines(c, x + 22, y + 74, 240, 3, 20, "rgba(255,255,255,0.3)", r);
    }
  }

  const desire = canvas(W, H);
  {
    const c = desire.c;
    const x = 48;
    const y = 44 + 346;
    const g = c.createLinearGradient(x, y, x + 300, y + 64);
    g.addColorStop(0, ACID);
    g.addColorStop(1, "#7ed321");
    fillRR(c, x, y, 300, 64, 32, g);
    fillRR(c, x + 34, y + 25, 170, 14, 7, "rgba(11,20,0,0.85)");
    c.beginPath();
    c.moveTo(x + 246, y + 32);
    c.lineTo(x + 272, y + 32);
    c.moveTo(x + 262, y + 22);
    c.lineTo(x + 272, y + 32);
    c.lineTo(x + 262, y + 42);
    c.strokeStyle = "rgba(11,20,0,0.9)";
    c.lineWidth = 5;
    c.lineCap = "round";
    c.stroke();
    // nav CTA lights up too
    fillRR(c, W - 150, 44 + 28, 102, 32, 16, ACID);
  }

  return {
    base: toTexture(base.el),
    clarity: toTexture(clarity.el),
    trust: toTexture(trust.el),
    desire: toTexture(desire.el),
    aspect: W / H,
  };
}

/** Offer 01: pages of a showcase site (home, services, about). */
export function vitrinePage(seed: number) {
  const r = rng(seed);
  const W = 720;
  const H = 960;
  const { el, c } = canvas(W, H);
  const top = chrome(c, W, H, 40);
  const pad = 36;
  fillRR(c, pad, top + 24, 70, 14, 7, "rgba(255,255,255,0.8)");
  for (let i = 0; i < 4; i++) fillRR(c, W - pad - 300 + i * 70, top + 27, 50, 8, 4, "rgba(255,255,255,0.35)");
  if (seed % 3 === 0) {
    image(c, pad, top + 70, W - pad * 2, 330, 22, r);
    textLines(c, pad + 30, top + 280, 360, 2, 44, "rgba(255,255,255,0.95)", r, 0.6);
    fillRR(c, pad + 30, top + 372, 140, 36, 18, ACID);
    for (let i = 0; i < 3; i++) {
      const x = pad + i * 220;
      fillRR(c, x, top + 440, 200, 190, 16, "rgba(255,255,255,0.05)");
      fillRR(c, x + 20, top + 462, 38, 38, 12, "rgba(182,255,59,0.22)");
      textLines(c, x + 20, top + 522, 150, 3, 22, "rgba(255,255,255,0.35)", r);
    }
    textLines(c, pad, top + 670, W - pad * 2, 4, 26, "rgba(255,255,255,0.25)", r);
  } else if (seed % 3 === 1) {
    textLines(c, pad, top + 80, 480, 2, 50, "rgba(255,255,255,0.95)", r, 0.6);
    for (let i = 0; i < 4; i++) {
      const y = top + 210 + i * 170;
      image(c, pad, y, 240, 145, 16, r, i % 2 === 0);
      textLines(c, pad + 270, y + 12, 340, 4, 28, "rgba(255,255,255,0.32)", r);
    }
  } else {
    image(c, pad, top + 70, 300, 380, 22, r);
    textLines(c, pad + 330, top + 90, 300, 3, 40, "rgba(255,255,255,0.9)", r, 0.58);
    textLines(c, pad + 330, top + 230, 300, 6, 24, "rgba(255,255,255,0.3)", r);
    for (let i = 0; i < 2; i++) image(c, pad + i * 330, top + 490, 310, 200, 18, r, i === 1);
    fillRR(c, W / 2 - 90, top + 740, 180, 40, 20, ACID);
  }
  return toTexture(el);
}

/** Offer 02: one tall landing page, built around a single action. */
export function landingPage() {
  const r = rng(22);
  const W = 560;
  const H = 1600;
  const { el, c } = canvas(W, H);
  const top = chrome(c, W, H, 38);
  const pad = 32;
  fillRR(c, pad, top + 22, 64, 12, 6, "rgba(255,255,255,0.8)");
  fillRR(c, W - pad - 90, top + 16, 90, 26, 13, ACID);
  textLines(c, pad, top + 90, W - pad * 2, 3, 46, "rgba(255,255,255,0.95)", r, 0.6);
  textLines(c, pad, top + 240, W - pad * 2 - 40, 3, 24, "rgba(255,255,255,0.35)", r);
  const g = c.createLinearGradient(pad, 0, W - pad, 0);
  g.addColorStop(0, ACID);
  g.addColorStop(1, "#7ed321");
  fillRR(c, pad, top + 340, W - pad * 2, 64, 32, g);
  fillRR(c, W / 2 - 80, top + 366, 160, 12, 6, "rgba(11,20,0,0.85)");
  image(c, pad, top + 440, W - pad * 2, 320, 22, r);
  for (let i = 0; i < 3; i++) {
    const y = top + 800 + i * 110;
    fillRR(c, pad, y, 44, 44, 14, "rgba(182,255,59,0.22)");
    textLines(c, pad + 64, y + 4, W - pad * 2 - 80, 2, 22, "rgba(255,255,255,0.4)", r);
  }
  fillRR(c, pad, top + 1150, W - pad * 2, 200, 22, "rgba(255,255,255,0.05)");
  textLines(c, pad + 28, top + 1180, W - pad * 2 - 56, 3, 26, "rgba(255,255,255,0.35)", r);
  fillRR(c, pad, top + 1400, W - pad * 2, 64, 32, g);
  fillRR(c, W / 2 - 80, top + 1426, 160, 12, 6, "rgba(11,20,0,0.85)");
  return toTexture(el);
}

/** Offer 03: a sales page (promise, product, proof, price block, checkout). */
export function salesPage() {
  const r = rng(31);
  const W = 760;
  const H = 1000;
  const { el, c } = canvas(W, H);
  const top = chrome(c, W, H, 40);
  const pad = 36;
  fillRR(c, pad, top + 24, 70, 14, 7, "rgba(255,255,255,0.8)");
  textLines(c, W / 2 - 250, top + 80, 500, 2, 48, "rgba(255,255,255,0.95)", r, 0.6);
  image(c, pad, top + 200, 330, 300, 22, r);
  for (let i = 0; i < 4; i++) {
    const y = top + 212 + i * 66;
    c.beginPath();
    c.arc(pad + 372, y + 12, 9, 0, Math.PI * 2);
    c.fillStyle = ACID;
    c.fill();
    textLines(c, pad + 394, y + 2, 290, 1, 26, "rgba(255,255,255,0.45)", r, 0.8);
  }
  // price card
  fillRR(c, pad, top + 540, W - pad * 2, 280, 26, "rgba(182,255,59,0.07)");
  strokeRR(c, pad, top + 540, W - pad * 2, 280, 26, ACID_DIM, 2);
  fillRR(c, pad + 34, top + 574, 120, 14, 7, "rgba(255,255,255,0.45)");
  fillRR(c, pad + 34, top + 610, 220, 60, 12, "rgba(255,255,255,0.9)");
  textLines(c, pad + 34, top + 700, 300, 2, 24, "rgba(255,255,255,0.35)", r);
  const g = c.createLinearGradient(W - pad - 280, 0, W - pad - 34, 0);
  g.addColorStop(0, ACID);
  g.addColorStop(1, "#7ed321");
  fillRR(c, W - pad - 280, top + 700, 246, 64, 32, g);
  fillRR(c, W - pad - 220, top + 726, 126, 12, 6, "rgba(11,20,0,0.85)");
  for (let i = 0; i < 3; i++) {
    const x = pad + i * 236;
    fillRR(c, x, top + 850, 216, 90, 16, "rgba(255,255,255,0.05)");
    textLines(c, x + 18, top + 870, 170, 2, 20, "rgba(255,255,255,0.3)", r);
  }
  return toTexture(el);
}
