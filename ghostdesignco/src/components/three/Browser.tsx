"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { PROBLEM_KICKER, PROBLEM_STEPS } from "@/lib/story";
import { screenMaterial, useWorld } from "./context";
import { browserLayers } from "./textures";
import { PROPS, smooth, stationPresence, stationProgress } from "./stations";

/**
 * "Votre site ne devrait pas simplement exister": a wireframe site that
 * builds itself while the section is pinned. Clarity, trust and desire are
 * wiped in (acid scanline) at the same scroll positions as the words.
 */
export function Browser() {
  const { tall, reduced } = useWorld();
  const group = useRef<THREE.Group>(null!);
  const layerRefs = useRef<(THREE.Mesh | null)[]>([]);
  const L = useMemo(browserLayers, []);
  useEffect(() => () => [L.base, L.clarity, L.trust, L.desire].forEach((t) => t.dispose()), [L]);

  const W = 4.4;
  const H = W / L.aspect;
  const geo = useMemo(() => new THREE.PlaneGeometry(W, H), [W, H]);
  const base = useMemo(() => screenMaterial(L.base, { opacity: 0 }), [L]);
  const layers = useMemo(() => [L.clarity, L.trust, L.desire].map((map) => screenMaterial(map, { reveal: 0 })), [L]);
  const outline = useMemo(() => {
    const shape = roundedRect(W + 0.08, H + 0.08, 0.2);
    const pts = shape.getPoints(24).map((p) => new THREE.Vector3(p.x, p.y, 0));
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [W, H]);
  const outlineMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: new THREE.Color("#b6ff3b").multiplyScalar(1.6), transparent: true, opacity: 0 }),
    [],
  );

  const P = tall ? PROPS.tall : PROPS.wide;

  useFrame((state) => {
    const t = reduced ? 0 : state.clock.elapsedTime;
    const here = stationPresence("problem");
    const p = stationProgress("problem");
    group.current.visible = here > 0.001;
    if (!group.current.visible) return;

    base.uniforms.uOpacity.value = here;
    PROBLEM_STEPS.forEach((s, i) => {
      const r = smooth(s - 0.03, s + 0.1, p);
      const m = layers[i];
      m.uniforms.uReveal.value = r;
      m.uniforms.uOpacity.value = here;
      const mesh = layerRefs.current[i];
      // each layer drops in from slightly in front of the page
      if (mesh) mesh.position.z = 0.02 + i * 0.004 + (1 - r) * 0.35;
    });
    const k = smooth(PROBLEM_KICKER - 0.02, PROBLEM_KICKER + 0.06, p);
    layers[2].uniforms.uGain.value = 1 + k * 0.7;
    outlineMat.opacity = k * here * (0.75 + (reduced ? 0 : Math.sin(t * 3) * 0.25));

    const s = P.browserScale * (0.92 + 0.08 * here) * (1 + k * 0.025);
    group.current.scale.setScalar(s);
    group.current.position.set(P.browser[0], P.browser[1] + (reduced ? 0 : Math.sin(t * 0.7) * 0.05), P.browser[2]);
    group.current.rotation.set(
      reduced ? 0 : Math.sin(t * 0.5) * 0.02,
      (tall ? 0 : -0.2) + (reduced ? 0 : Math.sin(t * 0.33) * 0.03),
      0,
    );
  });

  return (
    <group ref={group}>
      <mesh geometry={geo} material={base} />
      {layers.map((m, i) => (
        <mesh
          key={i}
          ref={(el) => {
            layerRefs.current[i] = el;
          }}
          geometry={geo}
          material={m}
          renderOrder={2 + i}
        />
      ))}
      <lineLoop geometry={outline} material={outlineMat} position-z={0.03} />
    </group>
  );
}

export function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}
