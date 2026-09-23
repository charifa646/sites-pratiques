"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { METHOD_STEPS } from "@/lib/story";
import { ACID_LIN, screenMaterial, useFontsReady, useWorld } from "./context";
import { methodLayers } from "./textures";
import { PROPS, smooth, stationPresence, stationProgress } from "./stations";

/**
 * Méthode: one browser, three states. The notes of the first call, then the
 * designed page, then the live site (real address, "en ligne"), wiped in at
 * the same scroll positions as the steps of the text. Three dots under the
 * window track the progress.
 */
export function Method3D() {
  const ready = useFontsReady();
  return ready ? <MethodBrowser /> : null;
}

function MethodBrowser() {
  const { tall, reduced } = useWorld();
  const group = useRef<THREE.Group>(null!);
  const layerRefs = useRef<(THREE.Mesh | null)[]>([]);
  const L = useMemo(methodLayers, []);
  useEffect(() => () => [L.base, L.brief, L.design, L.live].forEach((t) => t.dispose()), [L]);

  const W = 4.4;
  const H = W / L.aspect;
  const geo = useMemo(() => new THREE.PlaneGeometry(W, H), [W, H]);
  const base = useMemo(() => screenMaterial(L.base, { opacity: 0 }), [L]);
  const layers = useMemo(() => [L.brief, L.design, L.live].map((map) => screenMaterial(map, { reveal: 0 })), [L]);
  const dotGeo = useMemo(() => new THREE.SphereGeometry(0.075, 20, 12), []);
  const dots = useMemo(
    () => [0, 1, 2].map(() => new THREE.MeshBasicMaterial({ color: ACID_LIN.clone(), transparent: true, opacity: 0.2 })),
    [],
  );
  const rail = useMemo(() => new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.12 }), []);
  const P = tall ? PROPS.tall : PROPS.wide;

  useFrame((state) => {
    const t = reduced ? 0 : state.clock.elapsedTime;
    const here = stationPresence("method");
    group.current.visible = here > 0.001;
    if (!group.current.visible) return;
    const p = stationProgress("method");
    base.uniforms.uOpacity.value = here;
    METHOD_STEPS.forEach((s, i) => {
      const r = smooth(s - 0.03, s + 0.1, p);
      // the brief notes step aside once the design takes over
      const fade = i === 0 ? 1 - smooth(METHOD_STEPS[1] - 0.02, METHOD_STEPS[1] + 0.12, p) * 0.9 : 1;
      layers[i].uniforms.uReveal.value = r;
      layers[i].uniforms.uOpacity.value = here * fade;
      const mesh = layerRefs.current[i];
      if (mesh) mesh.position.z = 0.02 + i * 0.004 + (1 - r) * 0.35;
      const on = smooth(s - 0.02, s + 0.05, p);
      dots[i].opacity = here * (0.2 + on * 0.8);
      dots[i].color.copy(ACID_LIN).multiplyScalar(1 + on * 0.8);
    });
    layers[2].uniforms.uGain.value = 1 + smooth(METHOD_STEPS[2] + 0.05, METHOD_STEPS[2] + 0.18, p) * 0.35;
    rail.opacity = here * 0.12;

    group.current.scale.setScalar(P.methodScale * (0.92 + 0.08 * here));
    group.current.position.set(P.method[0], P.method[1] + (reduced ? 0 : Math.sin(t * 0.7) * 0.05), P.method[2]);
    group.current.rotation.set(reduced ? 0 : Math.sin(t * 0.5) * 0.02, (tall ? 0 : -0.2) + (reduced ? 0 : Math.sin(t * 0.33) * 0.03), 0);
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
      <group position={[0, -H / 2 - 0.42, 0.1]}>
        <mesh material={rail} position={[0, 0, -0.01]}>
          <planeGeometry args={[2.2, 0.018]} />
        </mesh>
        {dots.map((m, i) => (
          <mesh key={i} geometry={dotGeo} material={m} position={[(i - 1) * 1.1, 0, 0]} />
        ))}
      </group>
    </group>
  );
}
