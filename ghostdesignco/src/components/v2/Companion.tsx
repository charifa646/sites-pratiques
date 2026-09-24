"use client";

import { Environment, Lightformer, MeshTransmissionMaterial } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Component, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { guideState } from "@/lib/guide";
import { scrollState } from "@/lib/scroll";
import { ghostGeometry, patchGhost, type GhostUniforms } from "@/components/three/ghostShape";
import { heroGhost } from "./handoff";
import { HERO_READY, hasWebGL2, pickTier } from "./quality";
import { HEADER_H } from "./ui";

/**
 * The V2 companion: the glass ghost of the 3D site, alone in a small
 * transparent canvas that travels down the page with the visitor.
 *
 * Sections mark where it goes with data attributes on an element:
 * - data-ghost="tr|tl|br|bl|t|b|l|r|c": which point of the element's box
 * - data-ghost-x / data-ghost-y: offset from that point, in ghost heights
 * - data-ghost="edge" (or edge-t / edge-b): half hidden at the right edge of
 *   the screen, level with the element's middle (or top / bottom)
 * - data-ghost-m, data-ghost-mx, data-ghost-my, data-ghost-mclip: the same below 640px
 * - data-ghost-clip="top": hide what falls below the element's top edge,
 *   so the ghost peeks from behind it
 * - data-ghost-dark on a dark section: the glass then refracts dark
 * - data-ghost="none" (or data-ghost-m="none"): no spot on that layout
 * A spot where the ghost would hide words or controls is skipped. Of the
 * others, the one nearest the middle of the screen wins; a damped spring
 * flies the ghost from one to the next and lets it lag a little when you
 * scroll. With no spot free it waits at the right edge, at a free height.
 */

type Tier = "hi" | "lo";

const PAPER = new THREE.Color("#F4F3EE");
const INK = new THREE.Color("#0B0B0C");

/** Ghost height on screen, in px. */
const sizeFor = (w: number) => (w >= 1024 ? 160 : w >= 640 ? 130 : 96);

type Travel = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  clip: number;
  dark: number;
  look: number;
  anchor: Element | null;
  glide: boolean;
  started: boolean;
};

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function num(v: string | undefined, fallback = 0) {
  const n = v === undefined ? NaN : parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
}

// what the ghost must never stand on: words and controls
const WORDY = new Set(["P", "H1", "H2", "H3", "H4", "H5", "H6", "LI", "LABEL", "INPUT", "TEXTAREA", "SELECT", "BUTTON", "A", "FIGCAPTION", "BLOCKQUOTE", "DT", "DD"]);

function wordy(el: Element | null) {
  for (let e = el, i = 0; e && i < 5; e = e.parentElement, i++) {
    if (WORDY.has(e.tagName)) return true;
    if (e.tagName === "SECTION" || e.tagName === "MAIN" || e === document.body) return false;
    for (const n of Array.from(e.childNodes)) if (n.nodeType === Node.TEXT_NODE && n.textContent?.trim()) return true;
  }
  return false;
}

/**
 * Would the ghost's body, standing at (x, y), hide words or controls? The
 * body fills about 66 % of the box's width and 80 % of its height; what falls
 * below `clip` is hidden anyway. Sampled on a 5 × 6 grid, edges included.
 */
function covers(x: number, y: number, W: number, H: number, clip: number, xs = [-0.3, -0.15, 0, 0.15, 0.3]) {
  const top = y - H * 0.42;
  const bottom = Math.min(y + H * 0.38, clip);
  if (bottom - top < 8) return false;
  for (const f of xs) {
    const px = x + W * f;
    if (px < 1 || px > window.innerWidth - 1) continue;
    for (let j = 0; j < 6; j++) {
      if (wordy(document.elementFromPoint(px, top + ((bottom - top) * j) / 5))) return true;
    }
  }
  return false;
}

function GhostBody({ tier, box, size }: { tier: Tier; box: React.RefObject<HTMLDivElement>; size: number }) {
  const body = useRef<THREE.Group>(null!);
  const eyesRef = useRef<THREE.Group>(null!);
  const mtm = useRef<THREE.Material>(null);
  const geo = useMemo(ghostGeometry, []);
  const uniforms = useMemo<GhostUniforms>(
    () => ({ uTime: { value: 0 }, uFlow: { value: 0 }, uRim: { value: new THREE.Color("#b6ff3b").multiplyScalar(1.1) } }),
    [],
  );
  const background = useMemo(() => PAPER.clone(), []);

  const loMat = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#e3efd9"),
      roughness: 0.22,
      transparent: true,
      opacity: 0.86,
      clearcoat: 1,
      clearcoatRoughness: 0.14,
      emissive: new THREE.Color("#132a05"),
      envMapIntensity: 1.3,
      side: THREE.DoubleSide,
    });
    patchGhost(m, uniforms);
    return m;
  }, [uniforms]);
  useLayoutEffect(() => {
    if (tier === "hi" && mtm.current) patchGhost(mtm.current, uniforms);
  }, [tier, uniforms]);

  const eyeGeo = useMemo(() => new THREE.SphereGeometry(0.1, 24, 16), []);
  const eyeMat = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: "#030303", roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 2 }),
    [],
  );
  const eyes = useMemo(() => {
    const r = 0.885;
    return [-0.3, 0.3].map((x) => {
      const z = Math.sqrt(r * r - x * x);
      const p = new THREE.Vector3(x, 0.96, z).multiplyScalar(1.012);
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(x, 0.12, z).normalize());
      return { p, q };
    });
  }, []);
  const core = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, "rgba(226,255,170,1)");
    r.addColorStop(0.4, "rgba(182,255,59,0.35)");
    r.addColorStop(1, "rgba(182,255,59,0)");
    g.fillStyle = r;
    g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return new THREE.SpriteMaterial({ map: t, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.75 });
  }, []);

  const travel = useRef<Travel>({ x: 0, y: 0, vx: 0, vy: 0, clip: 1e5, dark: 0, look: 0, anchor: null, glide: false, started: false });
  const pointer = useRef({ x: 0, y: 0, active: false });
  const blink = useRef({ next: 2.5, t: 0 });
  // is a spot free of words? asked a few times a second, not every frame
  const verdicts = useRef(new WeakMap<Element, { x: number; y: number; t: number; hit: boolean }>());
  // where it waits at the edge when no spot is free (off screen if nowhere)
  const rest = useRef({ y: 0, t: -1e4, away: false });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.current = { x: e.clientX, y: e.clientY, active: true };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // The glass refracts what the scene holds behind it, eyes included: seen
  // through the dome they made a dark smudge. They step out of that pass
  // (this runs first) and come back for the main render (below).
  useFrame(() => {
    if (tier === "hi") eyesRef.current.visible = false;
  }, -1);

  useFrame((state, delta) => {
    eyesRef.current.visible = true;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const el = box.current;
    if (!el) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const S = size;
    const W = S;
    const H = S * 1.25;
    const m = travel.current;

    // waking up (it sleeps while the hero holds the ghost): take over from
    // where the hero let it go
    if (heroGhost.wake && !heroGhost.active) {
      heroGhost.wake = false;
      m.x = heroGhost.x;
      m.y = heroGhost.y;
      m.vx = 0;
      m.vy = -260;
      m.clip = window.innerHeight * 3;
      m.anchor = null;
      m.glide = false;
      m.started = true;
    }
    // the hero scene holds the ghost: stay hidden, ready to take over from its spot
    if (heroGhost.active) {
      el.style.visibility = "hidden";
      m.x = heroGhost.x;
      m.y = heroGhost.y;
      m.vx = 0;
      m.vy = -260;
      m.clip = window.innerHeight * 3;
      m.anchor = null;
      m.glide = false;
      m.started = true;
      return;
    }
    el.style.visibility = "visible";

    // 1. candidate spots: only those where the whole ghost fits on screen and
    //    hides no words or controls ("none" leaves a layout out)
    const small = vw < 640;
    const line = vh * 0.45;
    const minY = HEADER_H + H * 0.34;
    const maxY = vh - H * 0.4;
    const now = performance.now();
    type Spot = { el: HTMLElement; tx: number; ty: number; clip: number; dark: number; look: number };
    const spots: Spot[] = [];
    for (const a of Array.from(document.querySelectorAll<HTMLElement>("[data-ghost]"))) {
      const r = a.getBoundingClientRect();
      if (r.height === 0 || r.bottom < 0 || r.top > vh) continue;
      const spec = (small && a.dataset.ghostM) || a.dataset.ghost || "tr";
      if (spec === "none") continue;
      const dx = small && a.dataset.ghostMx !== undefined ? num(a.dataset.ghostMx) : num(a.dataset.ghostX);
      const dy = small && a.dataset.ghostMy !== undefined ? num(a.dataset.ghostMy) : num(a.dataset.ghostY);
      const edge = spec.startsWith("edge");
      let x = edge ? vw + W * 0.06 : spec.includes("r") ? r.right : spec.includes("l") ? r.left : (r.left + r.right) / 2;
      let y = spec.includes("t") ? r.top : spec.includes("b") ? r.bottom : (r.top + r.bottom) / 2;
      if (!edge) x = clamp(x + dx * S, W * 0.45, vw - W * 0.45);
      y += dy * S;
      if (y < minY || y > maxY) continue;
      const clip = ((small && a.dataset.ghostMclip) || a.dataset.ghostClip) === "top" ? r.top : vh + H;
      const seen = verdicts.current.get(a);
      let hit = seen?.hit ?? false;
      if (!seen || Math.abs(seen.x - x) > 12 || Math.abs(seen.y - y) > 12 || now - seen.t > 400) {
        hit = covers(x, y, W, H, clip);
        verdicts.current.set(a, { x, y, t: now, hit });
      }
      if (hit) continue;
      spots.push({
        el: a,
        tx: x,
        ty: y,
        clip,
        dark: a.closest("[data-ghost-dark]") ? 1 : 0,
        look: edge ? -1 : clamp(((r.left + r.right) / 2 - x) / (vw * 0.4), -1, 1),
      });
    }
    // keep the current spot while it lasts, unless another is clearly nearer the reading line
    let spot = spots.find((sp) => sp.el === m.anchor) ?? null;
    for (const sp of spots) {
      if (!spot || Math.abs(sp.ty - line) + 140 < Math.abs(spot.ty - line)) spot = sp;
    }
    const best = spot?.el ?? null;
    // nowhere to stand: wait half hidden at the right edge, looking into the
    // page, at a height where it hides nothing; slip out of view if there is none
    const edgeX = vw + W * 0.08;
    const wait = rest.current;
    if (!spot && now - wait.t > 300) {
      wait.t = now;
      // the part left on screen: from 0.33 of the box width left of its centre
      const sliver = [-0.33, -0.26, -0.18, -0.1];
      const free = (yy: number) => yy >= minY && yy <= maxY && !covers(edgeX, yy, W, H, vh + H, sliver);
      if (wait.away || !free(wait.y)) {
        const found = [0.52, 0.42, 0.62, 0.32, 0.72, 0.24, 0.82].map((f) => vh * f).find(free);
        wait.away = found === undefined;
        if (found !== undefined) wait.y = found;
      }
    }
    const tx = spot ? spot.tx : wait.away ? vw + W * 0.9 : edgeX;
    let ty = spot ? spot.ty : wait.y || vh * 0.52;
    const clipTo = spot ? spot.clip : vh + H;
    const dark = spot ? spot.dark : m.dark;
    let look = spot ? spot.look : -1;
    if (!spot) {
      const under = document.elementFromPoint(Math.max(0, vw - 4), ty);
      if (under) m.dark = THREE.MathUtils.damp(m.dark, under.closest("[data-ghost-dark]") ? 1 : 0, 4, dt);
    }
    ty = clamp(ty, minY, maxY);

    // 2. first frame: start hidden below the anchor edge, then rise out of it
    if (!m.started) {
      m.x = tx;
      m.y = ty + S * 0.7;
      m.clip = clipTo;
      m.anchor = best;
      m.started = true;
    }

    // 3. damped spring toward the target
    const k = 30;
    const c = 2 * Math.sqrt(k) * 0.88;
    m.vx += ((tx - m.x) * k - m.vx * c) * dt;
    m.vy += ((ty - m.y) * k - m.vy * c) * dt;
    m.x += m.vx * dt;
    m.y += m.vy * dt;

    // the peek edge sticks to its element; when the anchor changes it glides there
    if (best !== m.anchor) {
      m.anchor = best;
      m.glide = true;
    }
    if (m.glide) {
      m.clip = THREE.MathUtils.damp(m.clip, clipTo, 6, dt);
      if (Math.abs(clipTo - m.clip) < 2) m.glide = false;
    } else m.clip = clipTo;
    if (spot) m.dark = THREE.MathUtils.damp(m.dark, dark, 4, dt);

    const left = m.x - W / 2;
    const top = m.y - H / 2;
    // head position for the guided tour's speech bubble
    guideState.x = m.x;
    guideState.y = top + H * 0.1;
    guideState.visible = !!spot && m.x > W * 0.3 && m.x < vw - W * 0.3 && top + H * 0.1 < m.clip;
    el.style.transform = `translate3d(${left.toFixed(1)}px, ${top.toFixed(1)}px, 0)`;
    const cut = Math.max(0, top + H - m.clip);
    el.style.clipPath = cut > 0 ? `inset(0 0 ${Math.min(H, cut).toFixed(1)}px 0)` : "none";

    // 4. pose: looks at its section (and at the pointer), leans into the motion
    const p = pointer.current;
    if (p.active) {
      const px = clamp((p.x - m.x) / (vw * 0.5), -1, 1);
      look = look * 0.4 + px * 0.6;
      m.look = THREE.MathUtils.damp(m.look, clamp((p.y - m.y) / (vh * 0.5), -1, 1), 3, dt);
    }
    const b = body.current;
    b.rotation.y = THREE.MathUtils.damp(b.rotation.y, look * 0.55, 4, dt);
    b.rotation.x = THREE.MathUtils.damp(b.rotation.x, clamp(m.vy * 0.0005, -0.3, 0.3) + (p.active ? m.look * 0.12 : 0), 5, dt);
    b.rotation.z = THREE.MathUtils.damp(b.rotation.z, clamp(-m.vx * 0.0008, -0.35, 0.35) + Math.sin(t * 0.8) * 0.04, 5, dt);
    b.position.y = Math.sin(t * 1.1) * 0.07 + Math.sin(t * 0.47) * 0.04;

    uniforms.uTime.value = t;
    const speed = Math.hypot(m.vx, m.vy) / 900 + Math.abs(scrollState.velocity) * 1.6;
    uniforms.uFlow.value = THREE.MathUtils.damp(uniforms.uFlow.value, Math.min(3, speed), 4, dt);
    background.copy(PAPER).lerp(INK, m.dark);

    // 5. blink every few seconds
    const bl = blink.current;
    bl.next -= dt;
    if (bl.next <= 0) {
      bl.t = 0.16;
      bl.next = 2.5 + Math.random() * 4;
    }
    bl.t = Math.max(0, bl.t - dt);
    const lid = bl.t > 0 ? Math.abs(Math.cos((bl.t / 0.16) * Math.PI)) : 1;
    eyesRef.current.scale.y = 0.12 + 0.88 * lid;
  });

  return (
    <group position={[0, -0.06, 0]}>
      <pointLight color="#b6ff3b" intensity={6} distance={7} decay={2} position={[0, 0.3, 0.2]} />
      <group ref={body}>
        <sprite material={core} scale={[1.45, 1.45, 1]} position={[0, 0.3, 0]} />
        {tier === "hi" ? (
          <mesh geometry={geo}>
            <MeshTransmissionMaterial
              ref={mtm as never}
              background={background}
              resolution={256}
              samples={6}
              backside={false}
              thickness={1.1}
              roughness={0.3}
              anisotropicBlur={0.15}
              chromaticAberration={0.06}
              distortion={0.2}
              distortionScale={0.35}
              temporalDistortion={0.05}
              ior={1.2}
              color="#ffffff"
              attenuationColor="#e4ffb8"
              attenuationDistance={4.5}
              clearcoat={1}
              clearcoatRoughness={0.18}
              envMapIntensity={1.4}
              emissive="#030701"
              side={THREE.DoubleSide}
            />
          </mesh>
        ) : (
          <mesh geometry={geo} material={loMat} />
        )}
        <group ref={eyesRef} position={[0, 0.96, 0]}>
          {eyes.map((e, i) => (
            <mesh
              key={i}
              geometry={eyeGeo}
              material={eyeMat}
              position={[e.p.x, e.p.y - 0.96, e.p.z]}
              quaternion={e.q}
              scale={[0.85, 1.35, 0.32]}
            />
          ))}
        </group>
      </group>
    </group>
  );
}

/**
 * No frames at all while the hero holds the ghost (it is hidden then): only
 * one 3D scene draws at a time. Checked ten times a second.
 */
function Sleep() {
  const setFrameloop = useThree((s) => s.setFrameloop);
  useEffect(() => {
    let awake = true;
    const id = window.setInterval(() => {
      const want = !heroGhost.active;
      if (want === awake) return;
      awake = want;
      if (want) heroGhost.wake = true;
      setFrameloop(want ? "always" : "never");
    }, 100);
    return () => window.clearInterval(id);
  }, [setFrameloop]);
  return null;
}

/** Marks the page once real frames are on screen: the still ghost steps aside. */
function Ready() {
  const frames = useRef(0);
  useFrame(() => {
    frames.current += 1;
    if (frames.current === 4) document.documentElement.classList.add("v2-companion");
  });
  return null;
}

class Guard extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("[v2] companion disabled:", error);
    document.documentElement.classList.remove("v2-companion");
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function Companion() {
  const [tier, setTier] = useState<Tier | null>(null);
  const [size, setSize] = useState(160);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ?ghost=hi|lo|off pins the choice (QA); reduced motion keeps the still image
    const q = new URLSearchParams(window.location.search).get("ghost");
    if (q === "off" || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !hasWebGL2()) return;
    const onResize = () => setSize(sizeFor(window.innerWidth));
    onResize();
    window.addEventListener("resize", onResize);

    // one 3D scene starting at a time: the companion waits for the hero's to
    // be on screen, then for a quiet moment (or starts as soon as the page
    // scrolls); with no hero scene at all it does not wait for long
    let started = false;
    let idle = 0;
    let timer = 0;
    const start = () => {
      if (started) return;
      started = true;
      window.removeEventListener("scroll", onScroll);
      setTier(pickTier());
    };
    const whenIdle = () => {
      if (window.requestIdleCallback) idle = window.requestIdleCallback(start, { timeout: 2500 });
      else timer = window.setTimeout(start, 1200);
    };
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.1) start();
    };
    if (heroGhost.ready) whenIdle();
    else window.addEventListener(HERO_READY, whenIdle, { once: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    const fallback = window.setTimeout(whenIdle, 6000);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener(HERO_READY, whenIdle);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(fallback);
      window.clearTimeout(timer);
      if (idle) window.cancelIdleCallback?.(idle);
      document.documentElement.classList.remove("v2-companion");
    };
  }, []);

  if (!tier) return null;
  return (
    <div
      ref={box}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-40"
      style={{ width: size, height: size * 1.25, transform: "translate3d(-999px,-999px,0)" }}
    >
      <span className="absolute inset-[8%] rounded-full bg-[radial-gradient(closest-side,rgba(182,255,59,0.34),rgba(182,255,59,0))]" />
      <Guard>
        <Canvas
          flat
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
          camera={{ fov: 30, position: [0, 0.12, 6.8] }}
          style={{ position: "absolute", inset: 0 }}
        >
          <ambientLight intensity={0.25} />
          <Environment resolution={128} frames={1}>
            <Lightformer form="rect" intensity={2.2} position={[0, 7, -2]} rotation-x={Math.PI / 2} scale={[16, 5, 1]} />
            <Lightformer form="rect" intensity={1.6} position={[-7, 1.5, 1]} rotation-y={Math.PI / 2} scale={[12, 1.6, 1]} />
            <Lightformer form="rect" intensity={1.2} position={[7, 1.5, 1]} rotation-y={-Math.PI / 2} scale={[12, 1.2, 1]} />
            <Lightformer form="ring" color="#b6ff3b" intensity={3.5} position={[0, 1.2, -9]} scale={5} />
            <Lightformer form="rect" color="#b6ff3b" intensity={1.2} position={[0, -4, 2]} rotation-x={-Math.PI / 2} scale={[12, 4, 1]} />
          </Environment>
          <GhostBody tier={tier} box={box} size={size} />
          <Ready />
          <Sleep />
        </Canvas>
      </Guard>
    </div>
  );
}
