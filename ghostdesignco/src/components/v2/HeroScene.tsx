"use client";

import { Environment, Lightformer, MeshReflectorMaterial, MeshTransmissionMaterial, PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Component, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import * as THREE from "three";
import { guideState } from "@/lib/guide";
import { scrollState } from "@/lib/scroll";
import { ghostGeometry, patchGhost, type GhostUniforms } from "@/components/three/ghostShape";
import { heroGhost } from "./handoff";

/**
 * The V2 hero stage, "le fantôme derrière la vitre": the glass ghost in a pale
 * studio, in the middle of the screen, rising out of a mirror floor (the floor
 * of the 3D site, in daylight) under a soft acid light. The page lays its
 * glass cards and its words over this scene. Rings run on the floor where it
 * comes through and it follows the pointer; on scroll it rises and hands over
 * to the page companion.
 */

export type Tier = "hi" | "lo";

const PAPER = "#F4F3EE";
const easeOut = (t: number) => 1 - Math.pow(1 - THREE.MathUtils.clamp(t, 0, 1), 3);
const smooth = (a: number, b: number, v: number) => THREE.MathUtils.smoothstep(v, a, b);

// silhouette bounds in the ghost's own space (arms and hem tails included)
const BOUNDS = { x: 1.2, bottom: -1.3, top: 1.62 };
// how high the hem floats over the mirror
const HOVER = 0.3;

/** Centred, the hem just above the mirror; kept inside the width on tall screens. */
function layoutFor(width: number, height: number, visibleW: number) {
  const s = width / height >= 1 ? 1.1 : Math.min(0.89, visibleW / 3);
  return { x: 0, y: HOVER - BOUNDS.bottom * s, s };
}

/** A soft acid light behind the ghost, on the paper and in the mirror. */
function Halo({ ghost }: { ghost: RefObject<THREE.Group> }) {
  const sprite = useRef<THREE.Sprite>(null!);
  const mat = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    const r = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    r.addColorStop(0, "rgba(200,255,96,0.9)");
    r.addColorStop(0.3, "rgba(186,255,64,0.5)");
    r.addColorStop(0.62, "rgba(182,255,59,0.16)");
    r.addColorStop(1, "rgba(182,255,59,0)");
    g.fillStyle = r;
    g.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, opacity: 0, fog: false });
  }, []);
  useFrame((_, delta) => {
    const g = ghost.current;
    if (!g) return;
    const s = g.scale.x;
    sprite.current.position.set(g.position.x, g.position.y + 0.1 * s, g.position.z - 2.6);
    sprite.current.scale.setScalar(9.5 * s);
    mat.opacity = THREE.MathUtils.damp(mat.opacity, g.visible ? 0.9 : 0, 3, Math.min(delta, 0.05));
  });
  return <sprite ref={sprite} material={mat} />;
}

function Rings({ ghost }: { ghost: RefObject<THREE.Group> }) {
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const mats = useMemo(
    () => [0, 1, 2].map(() => new THREE.MeshBasicMaterial({ color: new THREE.Color("#9fdc3a"), transparent: true, opacity: 0, depthWrite: false })),
    [],
  );
  const geo = useMemo(() => new THREE.RingGeometry(0.96, 1, 128), []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const g = ghost.current;
    if (!g) return;
    rings.current.forEach((r, i) => {
      if (!r) return;
      const k = (t * 0.32 + i / 3) % 1;
      r.position.set(g.position.x, 0.004, g.position.z);
      r.scale.setScalar(0.4 + k * 3.4);
      // strong while the ghost comes through the floor, a whisper afterwards
      const near = 1 - smooth(0.6, 2.2, g.position.y);
      mats[i].opacity = (1 - k) * (0.08 + near * 0.4) * (g.visible ? 1 : 0);
    });
  });
  return (
    <>
      {mats.map((m, i) => (
        <mesh
          key={i}
          ref={(el) => {
            rings.current[i] = el;
          }}
          geometry={geo}
          material={m}
          rotation-x={-Math.PI / 2}
        />
      ))}
    </>
  );
}

/**
 * A clean mirror: it gives back what it sees at full strength (fading it with
 * depth would grey the paper sky), the studio light times the mix coming to
 * about 1, so the floor meets the page and the ghost's reflection stays true.
 */
/**
 * A clean mirror: it gives back what it sees at full strength (fading it with
 * depth would grey the paper sky), the studio light times the mix coming to
 * about 1, so the floor meets the page and the ghost's reflection stays true.
 */
function Floor({ tier }: { tier: Tier }) {
  return (
    <mesh rotation-x={-Math.PI / 2}>
      <planeGeometry args={[80, 80]} />
      <MeshReflectorMaterial
        mirror={1}
        blur={[180, 60]}
        resolution={tier === "hi" ? 512 : 256}
        mixBlur={0.45}
        mixStrength={1.06}
        mixContrast={1}
        depthScale={0}
        roughness={1}
        metalness={0}
        color="#ffffff"
      />
    </mesh>
  );
}

function Ghost({
  tier,
  reduced,
  progress,
  holder,
}: {
  tier: Tier;
  reduced: boolean;
  progress: RefObject<number>;
  holder: RefObject<THREE.Group>;
}) {
  const { camera, size, gl, viewport } = useThree();
  const group = useRef<THREE.Group>(null!);
  const body = useRef<THREE.Group>(null!);
  const eyes = useRef<THREE.Group>(null!);
  const mtm = useRef<THREE.Material>(null);
  const geo = useMemo(ghostGeometry, []);
  const uniforms = useMemo<GhostUniforms>(
    () => ({ uTime: { value: 0 }, uFlow: { value: 0 }, uRim: { value: new THREE.Color("#b6ff3b").multiplyScalar(1.1) } }),
    [],
  );
  const background = useMemo(() => new THREE.Color(PAPER), []);
  // cut at the floor while it rises through it
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const planes = useMemo(() => [plane], [plane]);
  useEffect(() => {
    gl.localClippingEnabled = true;
  }, [gl]);

  const loMat = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#e3efd9"),
      roughness: 0.2,
      transparent: true,
      opacity: 0.88,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      emissive: new THREE.Color("#132a05"),
      envMapIntensity: 1.3,
      side: THREE.DoubleSide,
      clippingPlanes: planes,
    });
    patchGhost(m, uniforms);
    return m;
  }, [uniforms, planes]);
  useLayoutEffect(() => {
    if (tier === "hi" && mtm.current) patchGhost(mtm.current, uniforms);
  }, [tier, uniforms]);

  const eyeGeo = useMemo(() => new THREE.SphereGeometry(0.1, 24, 16), []);
  const eyeMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({ color: "#030303", roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 2, clippingPlanes: planes }),
    [planes],
  );
  const eyeSpots = useMemo(() => {
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
    return new THREE.SpriteMaterial({ map: t, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.7, clippingPlanes: planes });
  }, [planes]);

  const pointer = useRef({ x: 0, y: 0 });
  const born = useRef<number | null>(null);
  const blink = useRef({ next: 3, t: 0 });
  const corners = useMemo(() => Array.from({ length: 4 }, () => new THREE.Vector3()), []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useLayoutEffect(() => {
    (holder as { current: THREE.Group | null }).current = group.current;
  }, [holder]);

  // the glass sees what lies behind it; the eyes stay out of that pass
  useFrame(() => {
    if (tier === "hi") eyes.current.visible = false;
  }, -1);

  useFrame((state, delta) => {
    eyes.current.visible = true;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    if (born.current === null) born.current = t;
    const age = t - born.current;
    const L = layoutFor(size.width, size.height, viewport.width);

    // rise out of the floor while the cards settle, then float
    const rise = reduced ? 1 : easeOut((age - 0.25) / 1.7);
    const p = progress.current ?? 0;
    const leave = reduced ? 0 : smooth(0.02, 0.22, p);
    const bob = reduced ? 0 : Math.sin(t * 1.1) * 0.06 + Math.sin(t * 0.47) * 0.04;
    const below = -(BOUNDS.top + 0.2) * L.s;
    group.current.position.set(L.x, THREE.MathUtils.lerp(below, L.y, rise) + bob * rise + leave * 2.6, leave * 1.4);
    group.current.scale.setScalar(L.s * (1 - leave * 0.2));
    // the floor cuts it only while it comes through (a plane far below keeps everything)
    plane.constant = rise < 0.999 ? 0 : 50;

    // looks at the pointer
    const px = pointer.current.x;
    const py = pointer.current.y;
    // (a small turn: its eyes stay inside the clear pane in front of them)
    body.current.rotation.y = THREE.MathUtils.damp(body.current.rotation.y, px * 0.25, 3.5, dt);
    body.current.rotation.x = THREE.MathUtils.damp(body.current.rotation.x, py * 0.16 + (1 - rise) * 0.2, 4, dt);
    body.current.rotation.z = THREE.MathUtils.damp(body.current.rotation.z, Math.sin(t * 0.8) * 0.04 - leave * 0.2, 4, dt);

    uniforms.uTime.value = reduced ? 1.35 : t;
    uniforms.uFlow.value = THREE.MathUtils.damp(uniforms.uFlow.value, Math.min(3, (1 - rise) * 2 + Math.abs(scrollState.velocity) * 2), 4, dt);

    // blink
    const bl = blink.current;
    bl.next -= dt;
    if (bl.next <= 0) {
      bl.t = 0.16;
      bl.next = 2.5 + Math.random() * 4;
    }
    bl.t = Math.max(0, bl.t - dt);
    eyes.current.scale.y = 0.12 + 0.88 * (bl.t > 0 ? Math.abs(Math.cos((bl.t / 0.16) * Math.PI)) : 1);

    // screen box of the ghost: the tour bubble and the hand-over
    group.current.updateWorldMatrix(true, true);
    const m = body.current.matrixWorld;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (let i = 0; i < 4; i++) {
      const c = corners[i].set(i & 1 ? BOUNDS.x : -BOUNDS.x, i & 2 ? BOUNDS.top : BOUNDS.bottom, 0);
      c.applyMatrix4(m).project(camera);
      const x = (c.x * 0.5 + 0.5) * size.width;
      const y = (0.5 - c.y * 0.5) * size.height;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
    const box = gl.domElement.getBoundingClientRect();
    const inView = box.bottom > 80 && box.top < window.innerHeight;
    const held = inView && (reduced || p < 0.22);
    heroGhost.active = held;
    heroGhost.x = box.left + (minX + maxX) / 2;
    heroGhost.y = box.top + (minY + maxY) / 2;
    heroGhost.size = maxY - minY;
    group.current.visible = held;
    if (held) {
      guideState.x = heroGhost.x;
      guideState.y = box.top + minY + (maxY - minY) * 0.08;
      guideState.visible = rise > 0.9;
    }
  });

  return (
    <group ref={group}>
      <pointLight color="#b6ff3b" intensity={6} distance={7} decay={2} position={[0, 0.3, 0.3]} />
      <group ref={body}>
        <sprite material={core} scale={[1.45, 1.45, 1]} position={[0, 0.3, 0]} />
        {tier === "hi" ? (
          <mesh geometry={geo}>
            <MeshTransmissionMaterial
              ref={mtm as never}
              background={background}
              clippingPlanes={planes}
              resolution={512}
              samples={8}
              backside={false}
              thickness={0.9}
              roughness={0.18}
              anisotropicBlur={0.06}
              chromaticAberration={0.035}
              distortion={0.12}
              distortionScale={0.3}
              temporalDistortion={reduced ? 0 : 0.02}
              ior={1.2}
              color="#ffffff"
              attenuationColor="#e4ffb8"
              attenuationDistance={4.5}
              clearcoat={1}
              clearcoatRoughness={0.16}
              envMapIntensity={1.4}
              emissive="#030701"
              side={THREE.DoubleSide}
            />
          </mesh>
        ) : (
          <mesh geometry={geo} material={loMat} />
        )}
        <group ref={eyes} position={[0, 0.96, 0]}>
          {eyeSpots.map((e, i) => (
            <mesh key={i} geometry={eyeGeo} material={eyeMat} position={[e.p.x, e.p.y - 0.96, e.p.z]} quaternion={e.q} scale={[0.85, 1.35, 0.32]} />
          ))}
        </group>
      </group>
    </group>
  );
}

/** Frames only while the hero is on screen. */
function Frameloop({ host }: { host: RefObject<HTMLElement> }) {
  const set = useThree((s) => s.setFrameloop);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => set(e.isIntersecting ? "always" : "never"), { rootMargin: "80px" });
    io.observe(el);
    return () => io.disconnect();
  }, [host, set]);
  return null;
}

/**
 * A low studio view, nearly level with the floor so the mirror shows. Wide
 * screens: the ghost fills the middle, from 13 % to 70 % of the height, its
 * reflection from 81 %. Tall screens: a little wider lens, looking a touch
 * down: the ghost from 13 % to 50 %, its reflection from 58 %.
 */
function Rig() {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const wide = size.width / size.height >= 1;
    cam.fov = wide ? 30 : 34;
    cam.position.set(0, wide ? 1.2 : 1.1, wide ? 10.5 : 11.5);
    cam.lookAt(0, wide ? 1.43 : 0.3, 0);
    cam.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

function Ready({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  useFrame(() => {
    frames.current += 1;
    if (frames.current === 3) onReady();
  });
  return null;
}

class Guard extends Component<{ children: ReactNode; onFail: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("[v2] hero scene disabled:", error);
    heroGhost.active = false;
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

// pixel density: capped, then lowered on the fly when frames drop (as on the 3D site)
const MAX_DPR: Record<Tier, number> = { hi: 1.5, lo: 1.25 };
const densityFor = (tier: Tier) => Math.min(window.devicePixelRatio || 1, MAX_DPR[tier]);

export default function HeroScene({
  host,
  progress,
  reduced,
  tier,
  onReady,
  onFail,
  onLow,
}: {
  host: RefObject<HTMLElement>;
  progress: RefObject<number>;
  reduced: boolean;
  tier: Tier;
  onReady: () => void;
  onFail: () => void;
  /** the device can't keep up: switch to the light materials */
  onLow: () => void;
}) {
  const ghost = useRef<THREE.Group>(null);
  const [dpr, setDpr] = useState(() => densityFor(tier));
  useEffect(
    () => () => {
      heroGhost.active = false;
    },
    [],
  );
  return (
    <Guard onFail={onFail}>
      <Canvas
        flat
        dpr={dpr}
        gl={{ alpha: false, antialias: true, powerPreference: "high-performance", stencil: false }}
        camera={{ fov: 30, position: [0, 1.2, 10.5] }}
        style={{ position: "absolute", inset: 0 }}
      >
        <PerformanceMonitor
          flipflops={3}
          onIncline={() => setDpr(densityFor(tier))}
          onDecline={() => setDpr((d) => Math.max(1, d - 0.25))}
          onFallback={() => {
            setDpr(1);
            onLow();
          }}
        />
        {/* a paper sky: the mirror reflects light, not a void */}
        <color attach="background" args={[PAPER]} />
        <Rig />
        <Frameloop host={host} />
        <fog attach="fog" args={[PAPER, 9, 24]} />
        <ambientLight intensity={0.4} />
        {/* a pale sky over the studio floor */}
        <hemisphereLight args={["#ffffff", "#e9e6de", 1.1]} />
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={3} position={[0, 5, 1]} rotation-x={Math.PI / 2} scale={[7, 1.4, 1]} />
          <Lightformer form="rect" intensity={2.4} position={[-5, 0.5, 2]} rotation-y={Math.PI / 2} scale={[0.9, 8, 1]} />
          <Lightformer form="rect" intensity={1.7} position={[5, 0.5, 2.5]} rotation-y={-Math.PI / 2} scale={[0.6, 8, 1]} />
          <Lightformer form="rect" intensity={1.8} position={[0, 1.5, -6]} scale={[5, 2.5, 1]} />
          <Lightformer form="ring" color="#b6ff3b" intensity={3} position={[3, 3, -3]} scale={2.2} />
        </Environment>
        <Floor tier={tier} />
        <Ghost tier={tier} reduced={reduced} progress={progress} holder={ghost} />
        <Halo ghost={ghost} />
        <Rings ghost={ghost} />
        <Ready onReady={onReady} />
      </Canvas>
    </Guard>
  );
}
