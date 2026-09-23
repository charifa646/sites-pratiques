"use client";

import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from "@react-three/postprocessing";
import type { ChromaticAberrationEffect } from "postprocessing";
import { Component, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import * as THREE from "three";
import { scrollState } from "@/lib/scroll";
import { cx } from "@/components/ui/motion";
import { Browser } from "./Browser";
import { Constellation } from "./Constellation";
import { WorldCtx, glowTexture, useWorld, type WorldFlags } from "./context";
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

/** Camera on the dive path, with pointer parallax, idle drift and a speed kick. */
function Rig() {
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
    camera.position.set(
      cam.current.x + (p.x * 0.4 + Math.sin(t * 0.21) * 0.1) * m,
      cam.current.y + (-p.y * 0.22 + Math.sin(t * 0.17) * 0.07) * m,
      cam.current.z,
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

/** Faint acid haze at the vanishing point: there is always light ahead. */
function Horizon() {
  const ref = useRef<THREE.Sprite>(null!);
  const camera = useThree((s) => s.camera);
  const mat = useMemo(
    () =>
      new THREE.SpriteMaterial({
        map: glowTexture("rgba(182,255,59,0.3)", "rgba(182,255,59,0.05)"),
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
        transparent: true,
        opacity: 0.32,
        fog: false,
      }),
    [],
  );
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
      <Bloom mipmapBlur intensity={0.95} luminanceThreshold={1} luminanceSmoothing={0.3} radius={0.72} />
      <ChromaticAberration ref={ca as never} offset={offset} radialModulation modulationOffset={0.35} />
      <Vignette offset={0.28} darkness={0.72} />
    </EffectComposer>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[0, 7, -2]} rotation-x={Math.PI / 2} scale={[16, 5, 1]} />
        <Lightformer form="rect" intensity={1.6} position={[-7, 1.5, 1]} rotation-y={Math.PI / 2} scale={[12, 1.6, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[7, 1.5, 1]} rotation-y={-Math.PI / 2} scale={[12, 1.2, 1]} />
        <Lightformer form="ring" color="#b6ff3b" intensity={3.5} position={[0, 1.2, -9]} scale={5} />
        <Lightformer form="rect" color="#b6ff3b" intensity={1.2} position={[0, -4, 2]} rotation-x={-Math.PI / 2} scale={[12, 4, 1]} />
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

function Scene({ flags, selectionRef, onReady }: { flags: Omit<WorldFlags, "tall">; selectionRef: RefObject<HTMLDivElement>; onReady: () => void }) {
  const width = useThree((s) => s.size.width);
  const value = useMemo(() => ({ ...flags, tall: width < 1024 }), [flags, width]);
  return (
    <WorldCtx.Provider value={value}>
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 12, 46]} />
      <Rig />
      <Lights />
      <Horizon />
      <Floor />
      <Gates />
      <Dust />
      <Constellation />
      <Browser />
      <Offers />
      <Gallery />
      <Stage />
      <Method3D />
      <Quote />
      <Questions />
      <Portal />
      <Ghost selectionRef={selectionRef} />
      {flags.hi && <Effects />}
      <Ready onReady={onReady} />
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

export default function World({ selectionRef }: { selectionRef: RefObject<HTMLDivElement> }) {
  const [tier, setTier] = useState<"hi" | "lo" | null>(null);
  const [dpr, setDpr] = useState(1);
  const [maxDpr, setMaxDpr] = useState(1.5);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
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
    setDpr(cap);
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(rm.matches);
    const on = () => setReduced(rm.matches);
    rm.addEventListener("change", on);
    return () => rm.removeEventListener("change", on);
  }, []);

  const flags = useMemo(() => ({ hi: tier === "hi", reduced }), [tier, reduced]);

  if (!tier) return null;
  return (
    <div
      aria-hidden
      className={cx(
        "pointer-events-none fixed inset-0 z-0 transition-opacity duration-[1400ms] ease-out",
        ready ? "opacity-100" : "opacity-0",
      )}
    >
      <Guard>
        <Canvas
          flat
          dpr={dpr}
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
          <Scene flags={flags} selectionRef={selectionRef} onReady={() => setReady(true)} />
        </Canvas>
      </Guard>
    </div>
  );
}
