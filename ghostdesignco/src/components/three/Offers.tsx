"use client";

import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { glowTexture, screenMaterial, useWorld } from "./context";
import { landingPage, salesPage, vitrinePage } from "./textures";
import { PROPS, smooth, stationPresence, stationProgress } from "./stations";

/** Yaw that turns a prop standing at x toward the path (camera at x = 0). */
const faceIn = (x: number) => -Math.atan2(x, 9) * 0.75;

/** 01: three pages of a showcase site, fanning open as the camera arrives. */
function Vitrine() {
  const { tall, reduced } = useWorld();
  const group = useRef<THREE.Group>(null!);
  const cards = useRef<(THREE.Mesh | null)[]>([]);
  const maps = useMemo(() => [vitrinePage(3), vitrinePage(4), vitrinePage(5)], []);
  useEffect(() => () => maps.forEach((m) => m.dispose()), [maps]);
  const mats = useMemo(() => maps.map((m) => screenMaterial(m, { opacity: 0 })), [maps]);
  const geo = useMemo(() => new THREE.PlaneGeometry(1.95, 2.6), []);
  const P = tall ? PROPS.tall : PROPS.wide;
  const at = P.mockups[0];
  const scale = P.mockupScale[0];

  useFrame((state) => {
    const t = reduced ? 0 : state.clock.elapsedTime;
    const here = stationPresence("offer-1");
    group.current.visible = here > 0.001;
    if (!group.current.visible) return;
    const open = reduced ? 1 : smooth(0.15, 1, here) * (0.85 + 0.15 * stationProgress("offer-1"));
    const order = [1, 0, 2]; // middle page on top
    order.forEach((k) => {
      const c = cards.current[k];
      if (!c) return;
      const o = k - 1;
      c.position.set(o * 1.62 * open, Math.sin(t * 0.7 + k * 1.7) * 0.05, -Math.abs(o) * 0.7 * open + (k === 1 ? 0.02 : 0));
      c.rotation.set(0, -o * 0.44 * open, -o * 0.045 * open);
      mats[k].uniforms.uOpacity.value = here;
    });
    group.current.position.set(at[0], at[1], at[2]);
    group.current.rotation.y = tall ? 0 : faceIn(at[0]);
    group.current.scale.setScalar(scale * (0.9 + 0.1 * here));
  });

  return (
    <group ref={group}>
      {mats.map((m, i) => (
        <mesh
          key={i}
          ref={(el) => {
            cards.current[i] = el;
          }}
          geometry={geo}
          material={m}
          renderOrder={i === 1 ? 3 : 1}
        />
      ))}
    </group>
  );
}

/** 02: a phone showing a landing page that scrolls down to its single action. */
function Landing() {
  const { tall, reduced } = useWorld();
  const group = useRef<THREE.Group>(null!);
  const ring = useRef<THREE.Mesh>(null!);
  const map = useMemo(() => {
    const t = landingPage();
    t.wrapT = THREE.ClampToEdgeWrapping;
    return t;
  }, []);
  useEffect(() => () => map.dispose(), [map]);
  const SW = 1.58;
  const SH = 3.36;
  // share of the page height the screen shows at once (page is 560 × 1600)
  const rep = ((560 * SH) / SW) / 1600;
  const screen = useMemo(() => screenMaterial(map, { opacity: 0 }), [map]);
  const halo = useMemo(
    () => new THREE.SpriteMaterial({ map: glowTexture(), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 }),
    [],
  );
  const ringMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#b6ff3b").multiplyScalar(1.8),
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );
  const P = tall ? PROPS.tall : PROPS.wide;
  const at = P.mockups[1];
  const scale = P.mockupScale[1];

  useFrame((state) => {
    const t = reduced ? 0 : state.clock.elapsedTime;
    const here = stationPresence("offer-2");
    group.current.visible = here > 0.001;
    if (!group.current.visible) return;
    const scroll = reduced ? 1 : smooth(0.1, 0.95, here * 0.55 + stationProgress("offer-2") * 0.6);
    // uv window: the page is taller than the screen, slide it up
    screen.uniforms.uUvScale.value.set(1, rep, 0, (1 - rep) * (1 - scroll));
    screen.uniforms.uOpacity.value = here;
    screen.uniforms.uGain.value = 1 + smooth(0.9, 1, scroll) * 0.35;
    halo.opacity = 0.3 * here;
    // tap ripple on the call to action once the page reached it
    const tap = smooth(0.92, 1, scroll);
    const cycle = reduced ? 0.5 : (t * 0.6) % 1;
    ring.current.scale.setScalar(0.2 + cycle * 0.9);
    ringMat.opacity = tap * (1 - cycle) * 0.9 * here;
    group.current.position.set(at[0], at[1] + (reduced ? 0 : Math.sin(t * 0.8) * 0.06), at[2]);
    group.current.rotation.set(
      reduced ? 0 : Math.sin(t * 0.5) * 0.03,
      (tall ? 0 : faceIn(at[0])) + (reduced ? 0 : Math.sin(t * 0.37) * 0.06),
      tall ? 0 : -0.05,
    );
    group.current.scale.setScalar(scale * (0.9 + 0.1 * here));
  });

  // CTA sits near the bottom of the page: 1470 / 1600 of its height
  const ctaY = -SH / 2 + ((1 - 1470 / 1600) / rep) * SH;

  return (
    <group ref={group}>
      <sprite material={halo} scale={[6, 6, 1]} position={[0, 0, -0.6]} />
      <RoundedBox args={[1.74, 3.52, 0.12]} radius={0.2} smoothness={5}>
        <meshPhysicalMaterial color="#0b0b0b" roughness={0.28} metalness={0.7} clearcoat={1} clearcoatRoughness={0.1} envMapIntensity={1.5} />
      </RoundedBox>
      <mesh position={[0, 0, 0.065]} material={screen}>
        <planeGeometry args={[SW, SH]} />
      </mesh>
      <mesh ref={ring} position={[0, ctaY, 0.08]} material={ringMat}>
        <ringGeometry args={[0.3, 0.34, 48]} />
      </mesh>
    </group>
  );
}

/** 03: a sales page whose sections stack into place, the price block last. */
const SLICES: [number, number][] = [
  [0, 190],
  [190, 530],
  [530, 830],
  [830, 1000],
];
function Sales() {
  const { tall, reduced } = useWorld();
  const group = useRef<THREE.Group>(null!);
  const parts = useRef<(THREE.Mesh | null)[]>([]);
  const map = useMemo(salesPage, []);
  useEffect(() => () => map.dispose(), [map]);
  const W = 2.55;
  const H = W / 0.76;
  const slices = useMemo(
    () =>
      SLICES.map(([a, b]) => {
        const h = ((b - a) / 1000) * H;
        const y = H / 2 - ((a + b) / 2 / 1000) * H;
        const m = screenMaterial(map, { opacity: 0 });
        m.uniforms.uUvScale.value.set(1, (b - a) / 1000, 0, 1 - b / 1000);
        return { h, y, m, geo: new THREE.PlaneGeometry(W, h) };
      }),
    [map, H],
  );
  const P = tall ? PROPS.tall : PROPS.wide;
  const at = P.mockups[2];
  const scale = P.mockupScale[2];

  useFrame((state) => {
    const t = reduced ? 0 : state.clock.elapsedTime;
    const here = stationPresence("offer-3");
    group.current.visible = here > 0.001;
    if (!group.current.visible) return;
    const build = reduced ? 1 : here * 0.8 + stationProgress("offer-3") * 0.4;
    slices.forEach((s, k) => {
      const mesh = parts.current[k];
      if (!mesh) return;
      const a = smooth(k * 0.14, k * 0.14 + 0.5, build);
      const dir = k % 2 ? 1 : -1;
      mesh.position.set((1 - a) * dir * 0.9, s.y + (1 - a) * 0.25 * (k - 1.5), (1 - a) * (1.1 + k * 0.35));
      mesh.rotation.set(0, (1 - a) * dir * 0.35, 0);
      s.m.uniforms.uOpacity.value = a * here;
    });
    // the price block takes the spotlight once everything is in place
    const price = slices[2];
    const focus = smooth(0.85, 1.05, build);
    price.m.uniforms.uGain.value = 1 + focus * 0.3;
    const pm = parts.current[2];
    if (pm) pm.position.z += focus * (0.12 + (reduced ? 0 : Math.sin(t * 1.6) * 0.03));
    group.current.position.set(at[0], at[1] + (reduced ? 0 : Math.sin(t * 0.65) * 0.05), at[2]);
    group.current.rotation.set(0, tall ? 0 : faceIn(at[0]), 0);
    group.current.scale.setScalar(scale * (0.9 + 0.1 * here));
  });

  return (
    <group ref={group}>
      {slices.map((s, k) => (
        <mesh
          key={k}
          ref={(el) => {
            parts.current[k] = el;
          }}
          geometry={s.geo}
          material={s.m}
          renderOrder={k === 2 ? 4 : 1}
        />
      ))}
    </group>
  );
}

export function Offers() {
  return (
    <>
      <Vitrine />
      <Landing />
      <Sales />
    </>
  );
}
