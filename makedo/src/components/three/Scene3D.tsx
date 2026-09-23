"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Suspense,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import * as THREE from "three";

/**
 * Lazy WebGL stage:
 *  - the <Canvas> mounts only when its box approaches the viewport,
 *  - the render loop runs only while it is on screen,
 *  - it fades in once the scene content has resolved (no loader UI),
 *  - its pixel ratio adapts to the device and drops if frames get slow.
 * Scenes read visibility / timing / pointer from `useStage()`.
 */

type StageState = {
  /** Seconds (clock time) when the box last entered the viewport, or -1. */
  enteredAt: { current: number };
  visible: { current: boolean };
  /** Pointer in [-1, 1] relative to the window centre (damped by scenes). */
  pointer: { current: THREE.Vector2 };
  reduced: boolean;
  /** Box element (for scroll progress reads). */
  box: { current: HTMLDivElement | null };
};

const StageCtx = createContext<StageState | null>(null);

export function useStage() {
  const s = useContext(StageCtx);
  if (!s) throw new Error("useStage outside <Scene3D>");
  return s;
}

function Ready({ onReady }: { onReady: () => void }) {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    // wait one frame so the first image is on screen before fading in
    const id = requestAnimationFrame(() => onReady());
    return () => cancelAnimationFrame(id);
  }, [gl, onReady]);
  return null;
}

/** Seconds since the stage last entered the viewport (performance clock). */
export function sinceEnter(s: StageState) {
  return s.enteredAt.current < 0 ? 0 : performance.now() / 1000 - s.enteredAt.current;
}

/** 0 while the box's top is at/below the viewport top, → 1 once scrolled by one box height. */
export function scrollOut(s: StageState) {
  const el = s.box.current;
  if (!el) return 0;
  const r = el.getBoundingClientRect();
  return THREE.MathUtils.clamp(-r.top / Math.max(1, r.height), 0, 1);
}

export function Scene3D({
  children,
  className,
  fov = 30,
  distance = 12,
}: {
  children: ReactNode;
  className?: string;
  fov?: number;
  distance?: number;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [running, setRunning] = useState(false);
  const [ready, setReady] = useState(false);
  const [dpr, setDpr] = useState(1);
  const maxDpr = useRef(1.75);
  const stateRef = useRef<StageState>({
    enteredAt: { current: -1 },
    visible: { current: false },
    pointer: { current: new THREE.Vector2() },
    reduced: false,
    box,
  });

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    stateRef.current.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // phones: cap the pixel ratio lower, the GPU budget is smaller
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    maxDpr.current = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 1.75);
    setDpr(maxDpr.current);
    const near = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setMounted(true);
      },
      { rootMargin: "60% 0px" },
    );
    const vis = new IntersectionObserver(
      ([e]) => {
        const s = stateRef.current;
        if (e.isIntersecting && !s.visible.current) s.enteredAt.current = performance.now() / 1000;
        s.visible.current = e.isIntersecting;
        setRunning(e.isIntersecting);
      },
      { rootMargin: "0px", threshold: 0.12 },
    );
    near.observe(el);
    vis.observe(el);
    const onMove = (ev: PointerEvent) => {
      stateRef.current.pointer.current.set(
        (ev.clientX / window.innerWidth) * 2 - 1,
        -((ev.clientY / window.innerHeight) * 2 - 1),
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      near.disconnect();
      vis.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div
      ref={box}
      aria-hidden
      className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${ready ? "opacity-100" : "opacity-0"} ${className ?? ""}`}
    >
      {mounted && (
        <StageCtx.Provider value={stateRef.current}>
          <Canvas
            frameloop={running ? "always" : "never"}
            dpr={dpr}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            camera={{ fov, position: [0, 0, distance], near: 0.1, far: 100 }}
            style={{ pointerEvents: "none" }}
          >
            <PerformanceMonitor
              flipflops={3}
              onDecline={() => setDpr((d) => Math.max(1, d - 0.25))}
              onIncline={() => setDpr((d) => Math.min(maxDpr.current, d + 0.25))}
              onFallback={() => setDpr(1)}
            />
            <Suspense fallback={null}>
              {children}
              <Ready onReady={() => setReady(true)} />
            </Suspense>
          </Canvas>
        </StageCtx.Provider>
      )}
    </div>
  );
}
