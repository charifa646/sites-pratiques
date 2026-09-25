"use client";

import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from "@react-three/postprocessing";
import type { ChromaticAberrationEffect } from "postprocessing";
import { Component, useCallback, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import * as THREE from "three";
import { scrollState } from "@/lib/scroll";
import { cx } from "@/components/ui/motion";
import { Browser } from "./Browser";
import { Constellation } from "./Constellation";
import { WorldCtx, glowTexture, useWorld, type WorldFlags } from "./context";
import { PALETTES, type PaletteName } from "./palette";
import { Dust } from "./Dust";
import { Floor } from "./Floor";
import { Gates } from "./Gates";
import { Ghost } from "./Ghost";
import { Gallery } from "./Gallery";
import { Method3D } from "./Method3D";
import { Offers } from "./Offers";
import { Portal } from "./Portal";
import { Questions } from "./Questions";
import { Quote } from "./Quote";
import { Stage } from "./Stage";
import { FLOOR_Y, baseFov as fovFor, createSample, sampleDive, worldState } from "./stations";
import { heroGhost } from "@/components/v2/handoff";
import { HERO_READY } from "@/components/v2/quality";

/**
 * Camera on the dive path, with pointer parallax, idle drift and a speed kick.
 * /pose: no dive; as the hero scrolls away the camera slowly steps back.
 */
function Rig({ pose = false }: { pose?: boolean }) {
  const { tall, reduced } = useWorld();
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const sample = useMemo(createSample, []);
  const cam = useRef<THREE.Vector3 | null>(null);
  const look = useRef(new THREE.Vector3());
  const target = useRef({ x: 0, y: 0 });
  const baseFov = useRef(35);
  const bank = useRef(0);

  useEffect(() => {
    camera.layers.enable(1);
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [camera]);

  useEffect(() => {
    // wide: keep the horizontal framing stable; tall: keep props inside the width
    baseFov.current = THREE.MathUtils.radToDeg(fovFor(tall, size.width / size.height));
  }, [size, tall]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const t = state.clock.elapsedTime;
    sampleDive(sample, tall, reduced);
    if (!cam.current) {
      cam.current = sample.cam.clone();
      look.current.copy(sample.look);
    }
    const k = reduced ? 1 : 1 - Math.exp(-dt * 7);
    cam.current.lerp(sample.cam, k);
    look.current.lerp(sample.look, k);

    const p = worldState.pointer;
    const pk = 1 - Math.exp(-dt * 2.5);
    p.x += (target.current.x - p.x) * pk;
    p.y += (target.current.y - p.y) * pk;

    const m = reduced ? 0 : 1;
    const back = pose && !reduced ? THREE.MathUtils.smoothstep(scrollState.y / Math.max(1, scrollState.vh), 0, 1) : 0;
    camera.position.set(
      cam.current.x + (p.x * 0.4 + Math.sin(t * 0.21) * 0.1) * m,
      cam.current.y + (-p.y * 0.22 + Math.sin(t * 0.17) * 0.07) * m + back * 0.5,
      cam.current.z + back * 3,
    );
    camera.lookAt(look.current);
    const v = scrollState.velocity;
    bank.current = THREE.MathUtils.damp(bank.current, THREE.MathUtils.clamp(v * 0.012, -0.03, 0.03) * m, 3, dt);
    camera.rotateZ(bank.current + Math.sin(t * 0.13) * 0.004 * m);
    const kick = Math.min(7, Math.abs(v) * 2.4) * m;
    const fov = baseFov.current + kick;
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = THREE.MathUtils.damp(camera.fov, fov, 5, dt);
      camera.updateProjectionMatrix();
    }
  });
  return null;
}

/** Faint haze at the vanishing point (acid, or ember in the warm night): there is always light ahead. */
function Horizon() {
  const ref = useRef<THREE.Sprite>(null!);
  const camera = useThree((s) => s.camera);
  const { palette } = useWorld();
  const mat = useMemo(() => {
    const [inner, mid, outer, opacity] = palette.horizon;
    return new THREE.SpriteMaterial({
      map: glowTexture(inner, mid, outer),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      transparent: true,
      opacity,
      fog: false,
    });
  }, [palette]);
  useFrame(() => {
    ref.current.position.set(camera.position.x * 0.5, FLOOR_Y + 0.6, camera.position.z - 50);
  });
  return <sprite ref={ref} material={mat} scale={[90, 18, 1]} renderOrder={-1} />;
}

function Effects() {
  const { reduced } = useWorld();
  const ca = useRef<ChromaticAberrationEffect>(null);
  const offset = useMemo(() => new THREE.Vector2(0.0004, 0.0004), []);
  useFrame(() => {
    if (!ca.current) return;
    const s = reduced ? 0.0003 : 0.0004 + Math.min(0.0045, Math.abs(scrollState.velocity) * 0.0022);
    ca.current.offset.set(s, s * 0.6);
  });
  return (
    <EffectComposer multisampling={4} enableNormalPass={false}>
      <Bloom mipmapBlur intensity={0.8} luminanceThreshold={1} luminanceSmoothing={0.3} radius={0.7} />
      <ChromaticAberration ref={ca as never} offset={offset} radialModulation modulationOffset={0.35} />
      <Vignette offset={0.28} darkness={0.72} />
    </EffectComposer>
  );
}

function Lights() {
  const { palette } = useWorld();
  return (
    <>
      <ambientLight intensity={0.2} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" color={palette.key} intensity={2.2} position={[0, 7, -2]} rotation-x={Math.PI / 2} scale={[16, 5, 1]} />
        <Lightformer form="rect" color={palette.key} intensity={1.6} position={[-7, 1.5, 1]} rotation-y={Math.PI / 2} scale={[12, 1.6, 1]} />
        <Lightformer form="rect" color={palette.key} intensity={1.2} position={[7, 1.5, 1]} rotation-y={-Math.PI / 2} scale={[12, 1.2, 1]} />
        <Lightformer form="ring" color="#b6ff3b" intensity={3.5} position={[0, 1.2, -9]} scale={5} />
        <Lightformer form="rect" color={palette.under} intensity={1.2} position={[0, -4, 2]} rotation-x={-Math.PI / 2} scale={[12, 4, 1]} />
      </Environment>
    </>
  );
}

/** Fades the canvas in once real frames are on screen (never a loader). */
function Ready({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    frames.current += 1;
    if (frames.current > 3) {
      done.current = true;
      onReady();
    }
  });
  return null;
}

/**
 * Compiles every shader of the world before its first frame, off the main
 * thread where the browser allows it (KHR_parallel_shader_compile): on a PC
 * the page stays fluid instead of freezing while the GPU driver compiles.
 */
function Warmup({ onWarm }: { onWarm: () => void }) {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    let alive = true;
    const done = () => {
      if (!alive) return;
      alive = false;
      onWarm();
    };
    // one frame so every station has mounted its meshes, and a ceiling so the world always shows up
    const raf = requestAnimationFrame(() => gl.compileAsync(scene, camera).then(done, done));
    const ceiling = window.setTimeout(done, 9000);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.clearTimeout(ceiling);
    };
  }, [gl, scene, camera, onWarm]);
  return null;
}

function Scene({
  flags,
  selectionRef,
  onReady,
  pose,
}: {
  flags: Omit<WorldFlags, "tall">;
  selectionRef: RefObject<HTMLDivElement>;
  onReady: () => void;
  pose: boolean;
}) {
  const width = useThree((s) => s.size.width);
  const value = useMemo(() => ({ ...flags, tall: width < 1024 }), [flags, width]);
  // The ghost and what surrounds it come first. The stations further down the dive
  // (hidden in the fog at the start anyway) are compiled out of sight once it is on
  // screen, then shown; the full-screen effects, which compile their own shaders, last.
  const [rest, setRest] = useState<"off" | "hidden" | "shown">("off");
  const [fx, setFx] = useState(false);
  const ready = useCallback(() => {
    onReady();
    // /pose keeps only the hero: no dive, so no stations further down
    if (pose) window.setTimeout(() => setFx(true), 400);
    else window.setTimeout(() => setRest("hidden"), 250);
  }, [onReady, pose]);
  const restReady = useCallback(() => {
    setRest("shown");
    window.setTimeout(() => setFx(true), 400);
  }, []);
  return (
    <WorldCtx.Provider value={value}>
      <color attach="background" args={[flags.palette.bg]} />
      <fog attach="fog" args={[flags.palette.bg, 12, 46]} />
      <Rig pose={pose} />
      <Lights />
      <Horizon />
      <Floor />
      <Gates />
      <Dust />
      <Constellation />
      <Ghost selectionRef={selectionRef} handoff={pose} />
      {rest !== "off" && (
        <group visible={rest === "shown"}>
          <Browser />
          <Offers />
          <Gallery />
          <Stage />
          <Method3D />
          <Quote />
          <Questions />
          <Portal />
        </group>
      )}
      {rest === "hidden" && <Warmup onWarm={restReady} />}
      {flags.hi && fx && <Effects />}
      <Ready onReady={ready} />
    </WorldCtx.Provider>
  );
}

/** A WebGL failure must never take the page down: the DOM works on its own. */
class Guard extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("[world] 3D disabled:", error);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * mode "dive" (the site): the camera travels through every station as the page scrolls.
 * mode "pose" (/pose): the world is the hero's only; the ghost then becomes the page's
 * companion, and the world stops drawing once the hero has left the screen.
 */
export default function World({
  selectionRef,
  palette = "night",
  mode = "dive",
}: {
  selectionRef: RefObject<HTMLDivElement>;
  palette?: PaletteName;
  mode?: "dive" | "pose";
}) {
  const pose = mode === "pose";
  const [heroOn, setHeroOn] = useState(true);
  const [tier, setTier] = useState<"hi" | "lo" | null>(null);
  const [dpr, setDpr] = useState(1);
  const [maxDpr, setMaxDpr] = useState(1.5);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);
  const [warm, setWarm] = useState(false);
  const [pinned, setPinned] = useState(false);
  const dim = useRef<HTMLDivElement>(null);
  const onWarm = useCallback(() => setWarm(true), []);
  const onReady = useCallback(() => {
    setReady(true);
    if (pose) {
      // the companion of the page wakes up once the hero's 3D is on screen
      heroGhost.ready = true;
      window.dispatchEvent(new Event(HERO_READY));
    }
  }, [pose]);

  // /pose: the world sinks into the dark as the hero scrolls away
  useEffect(() => {
    if (!pose) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const k = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
      if (dim.current) dim.current.style.opacity = (0.75 * k * k * (3 - 2 * k)).toFixed(3);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pose, tier]);

  useEffect(() => {
    if (!pose) return;
    const hero = document.getElementById("top");
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setHeroOn(e.isIntersecting));
    io.observe(hero);
    return () => io.disconnect();
  }, [pose]);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(rm.matches);
    const start = () => {
      // no WebGL 2: the page stands on its own, no canvas at all
      let gl2: WebGL2RenderingContext | null = null;
      try {
        gl2 = document.createElement("canvas").getContext("webgl2");
      } catch {
        gl2 = null;
      }
      if (!gl2) return;
      gl2.getExtension("WEBGL_lose_context")?.loseContext();
      const fine = window.matchMedia("(pointer: fine)").matches;
      const wide = window.innerWidth >= 1024;
      const cores = navigator.hardwareConcurrency ?? 4;
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
      // ?world=hi|lo pins the tier (QA); otherwise it is picked from the device
      const pinned = new URLSearchParams(window.location.search).get("world");
      const hi = pinned ? pinned === "hi" : fine && wide && cores >= 4 && memory >= 4;
      const cap = Math.min(window.devicePixelRatio || 1, hi ? 1.5 : 1.75);
      setPinned(Boolean(pinned));
      setTier(hi ? "hi" : "lo");
      setMaxDpr(cap);
      // wide screens start a little lower; the monitor raises it back when the machine keeps up
      setDpr(hi ? Math.min(cap, 1.25) : cap);
      setReduced(rm.matches);
    };
    rm.addEventListener("change", on);
    // the page paints and answers first; the world wakes up when the browser is idle
    const hasIdle = "requestIdleCallback" in window;
    const idle = hasIdle ? window.requestIdleCallback(start, { timeout: 400 }) : window.setTimeout(start, 150);
    return () => {
      rm.removeEventListener("change", on);
      if (hasIdle) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, []);

  const flags = useMemo(() => ({ hi: tier === "hi", reduced, palette: PALETTES[palette] }), [tier, reduced, palette]);

  if (!tier) return null;
  return (
    <div
      aria-hidden
      className={cx(
        "pointer-events-none fixed inset-0 z-0 transition-opacity duration-[800ms] ease-out",
        ready ? "opacity-100" : "opacity-0",
      )}
    >
      <Guard>
        <Canvas
          flat
          dpr={dpr}
          frameloop={warm && heroOn ? "always" : "never"}
          gl={{ antialias: tier === "lo", alpha: false, powerPreference: "high-performance", stencil: false }}
          camera={{ fov: 35, near: 0.1, far: 80, position: [0, 0.25, 9] }}
        >
          {!pinned && (
            <PerformanceMonitor
              flipflops={3}
              onIncline={() => setDpr(maxDpr)}
              onDecline={() => setDpr((d) => Math.max(1, d - 0.25))}
              onFallback={() => {
                setDpr(1);
                setTier("lo");
              }}
            />
          )}
          <Scene flags={flags} selectionRef={selectionRef} onReady={onReady} pose={pose} />
          <Warmup onWarm={onWarm} />
        </Canvas>
      </Guard>
      {pose && <div ref={dim} className="absolute inset-0 bg-void opacity-0" />}
    </div>
  );
}
