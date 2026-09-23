import * as THREE from "three";

/**
 * Monarch wing (right side, dorsal view) painted on a canvas.
 * The hinge (body axis) runs along the left edge of the texture.
 * Painted in layers: orange cells → black veins → black margins with
 * two rows of white spots → black apex with pale subapical spots.
 */

type P = [number, number];

const S = 1024;

// Forewing and hindwing outlines as cubic Bézier loops (texture px).
const FORE: { start: P; curves: [P, P, P][] } = {
  start: [8, 438],
  curves: [
    [[250, 300], [640, 150], [948, 118]], // costa → apex
    [[990, 240], [900, 430], [742, 548]], // outer margin → tornus
    [[520, 600], [250, 560], [8, 520]], // inner margin → root
  ],
};

const HIND: { start: P; curves: [P, P, P][] } = {
  start: [8, 500],
  curves: [
    [[250, 470], [560, 470], [700, 580]],
    [[800, 700], [700, 930], [470, 968]],
    [[250, 1000], [120, 800], [8, 620]],
  ],
};

function trace(ctx: CanvasRenderingContext2D, shape: typeof FORE) {
  ctx.beginPath();
  ctx.moveTo(...shape.start);
  for (const [c1, c2, p] of shape.curves) ctx.bezierCurveTo(c1[0], c1[1], c2[0], c2[1], p[0], p[1]);
  ctx.closePath();
}

function bezierPoint(a: P, c1: P, c2: P, b: P, t: number): P {
  const u = 1 - t;
  return [
    u * u * u * a[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * b[0],
    u * u * u * a[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * b[1],
  ];
}

/** Points along the outer margin (used for veins ends and spot rows). */
function marginPoints(shape: typeof FORE, curveIndex: number, n: number, t0 = 0, t1 = 1): P[] {
  const prev = curveIndex === 0 ? shape.start : shape.curves[curveIndex - 1][2];
  const [c1, c2, b] = shape.curves[curveIndex];
  const pts: P[] = [];
  for (let i = 0; i < n; i++) pts.push(bezierPoint(prev, c1, c2, b, t0 + ((t1 - t0) * i) / (n - 1)));
  return pts;
}

function inset(p: P, toward: P, d: number): P {
  const dx = toward[0] - p[0];
  const dy = toward[1] - p[1];
  const l = Math.hypot(dx, dy) || 1;
  return [p[0] + (dx / l) * d, p[1] + (dy / l) * d];
}

function paint(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, S, S);

  const drawWing = (shape: typeof FORE, veinEnds: P[], root: P, marginCurves: number[], center: P) => {
    ctx.save();
    trace(ctx, shape);
    ctx.clip();

    // base orange with a warm glow near the body
    const g = ctx.createRadialGradient(root[0] + 120, root[1], 40, root[0] + 200, root[1], 900);
    g.addColorStop(0, "#ffb347");
    g.addColorStop(0.35, "#ff8a1f");
    g.addColorStop(0.8, "#f2650f");
    g.addColorStop(1, "#d9500a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);

    // veins
    ctx.strokeStyle = "#0b0605";
    ctx.lineCap = "round";
    for (const end of veinEnds) {
      ctx.lineWidth = 11;
      ctx.beginPath();
      ctx.moveTo(root[0], root[1]);
      const mid: P = [(root[0] + end[0]) / 2, (root[1] + end[1]) / 2 + (end[1] < root[1] ? -40 : 30)];
      ctx.quadraticCurveTo(mid[0], mid[1], end[0], end[1]);
      ctx.stroke();
    }
    // discal cell cross vein
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(center[0] - 60, center[1] - 70);
    ctx.quadraticCurveTo(center[0] + 20, center[1], center[0] - 40, center[1] + 80);
    ctx.stroke();

    // black margin band
    ctx.lineWidth = 92;
    ctx.strokeStyle = "#0b0605";
    trace(ctx, shape);
    ctx.stroke();

    // two rows of white spots inside the band
    ctx.fillStyle = "#f4efe6";
    for (const ci of marginCurves) {
      const outer = marginPoints(shape, ci, 14, 0.04, 0.96);
      outer.forEach((p, i) => {
        const a = inset(p, center, 16);
        const b = inset(p, center, 36);
        ctx.beginPath();
        ctx.arc(a[0], a[1], 6.5, 0, Math.PI * 2);
        ctx.fill();
        if (i % 2 === 0) {
          ctx.beginPath();
          ctx.arc(b[0], b[1], 5, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }
    ctx.restore();
  };

  // hindwing first (sits under the forewing)
  drawWing(
    HIND,
    [
      [700, 600],
      [720, 720],
      [660, 850],
      [540, 940],
      [390, 960],
      [240, 900],
    ],
    [30, 540],
    [1, 2],
    [360, 700],
  );

  drawWing(
    FORE,
    [
      [948, 140],
      [900, 300],
      [860, 420],
      [760, 520],
      [600, 560],
      [700, 170],
      [480, 210],
    ],
    [20, 470],
    [1],
    [520, 390],
  );

  // forewing apex: black patch with pale spots
  ctx.save();
  trace(ctx, FORE);
  ctx.clip();
  ctx.fillStyle = "#0b0605";
  ctx.beginPath();
  ctx.moveTo(700, 120);
  ctx.bezierCurveTo(840, 110, 1000, 110, 1000, 220);
  ctx.bezierCurveTo(1000, 320, 920, 360, 860, 330);
  ctx.bezierCurveTo(800, 290, 740, 220, 700, 120);
  ctx.fill();
  const spots: [number, number, number, string][] = [
    [800, 190, 13, "#ffcf8a"],
    [838, 222, 12, "#ffcf8a"],
    [872, 250, 10, "#ffcf8a"],
    [900, 195, 9, "#f4efe6"],
    [926, 230, 8, "#f4efe6"],
    [940, 268, 7, "#f4efe6"],
  ];
  for (const [x, y, r, c] of spots) {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // thin dark outline to separate the wings
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#0b0605";
  trace(ctx, FORE);
  ctx.stroke();
}

let cached: THREE.CanvasTexture | null = null;

export function monarchTexture(): THREE.CanvasTexture {
  if (cached) return cached;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;
  paint(ctx);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  cached = tex;
  return tex;
}
