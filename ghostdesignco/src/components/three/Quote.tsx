"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { screenMaterial, useFontsReady, useWorld } from "./context";
import { quoteSheet } from "./textures";
import { PROPS, smooth, stationPresence, stationProgress } from "./stations";

/** Tarifs: a quote writes itself, then the "sur mesure" stamp lands on it. */
export function Quote() {
  const ready = useFontsReady();
  return ready ? <QuoteSheet /> : null;
}

function QuoteSheet() {
  const { tall, reduced } = useWorld();
  const group = useRef<THREE.Group>(null!);
  const stampRef = useRef<THREE.Mesh>(null!);
  const Q = useMemo(quoteSheet, []);
  useEffect(() => () => [Q.sheet, Q.lines, Q.stamp].forEach((t) => t.dispose()), [Q]);
  const W = 2.5;
  const H = W / Q.aspect;
  const geo = useMemo(() => new THREE.PlaneGeometry(W, H), [W, H]);
  const sheet = useMemo(() => screenMaterial(Q.sheet, { opacity: 0 }), [Q]);
  const lines = useMemo(() => screenMaterial(Q.lines, { reveal: 0 }), [Q]);
  const stamp = useMemo(() => screenMaterial(Q.stamp, { opacity: 0, gain: 1.5 }), [Q]);
  const P = tall ? PROPS.tall : PROPS.wide;

  useFrame((state) => {
    const t = reduced ? 0 : state.clock.elapsedTime;
    const here = stationPresence("pricing");
    group.current.visible = here > 0.001;
    if (!group.current.visible) return;
    const p = Math.max(stationProgress("pricing"), smooth(0.5, 1, here) * 0.35);
    const write = reduced ? 1 : smooth(0.05, 0.55, p);
    const land = reduced ? 1 : smooth(0.55, 0.75, p);
    sheet.uniforms.uOpacity.value = here;
    lines.uniforms.uReveal.value = write;
    lines.uniforms.uOpacity.value = here;
    stamp.uniforms.uOpacity.value = here * land;
    // the stamp drops from above the sheet and settles with a small overshoot
    const k = land < 1 ? land : 1;
    const bounce = 1 + Math.sin(k * Math.PI) * 0.18;
    stampRef.current.scale.setScalar((1.6 - 0.6 * k) * (k < 1 ? bounce : 1));
    stampRef.current.position.z = 0.03 + (1 - k) * 0.6;

    group.current.scale.setScalar(P.quoteScale * (0.92 + 0.08 * here));
    group.current.position.set(P.quote[0], P.quote[1] + (reduced ? 0 : Math.sin(t * 0.8) * 0.06), P.quote[2]);
    group.current.rotation.set(
      reduced ? 0 : Math.sin(t * 0.45) * 0.03,
      (tall ? 0 : -0.24) + (reduced ? 0 : Math.sin(t * 0.3) * 0.05),
      tall ? 0 : 0.04,
    );
  });

  return (
    <group ref={group}>
      <mesh geometry={geo} material={sheet} />
      <mesh geometry={geo} material={lines} position-z={0.01} renderOrder={2} />
      <mesh ref={stampRef} geometry={geo} material={stamp} renderOrder={3} />
    </group>
  );
}
