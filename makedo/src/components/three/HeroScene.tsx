"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Butterfly, type ButterflyHandle } from "./Butterfly";
import { Hand, type HandHandle } from "./Hand";
import type { HandPose } from "./handRig";
import { Scene3D, scrollOut, sinceEnter, useStage } from "./Scene3D";
import { Studio } from "./Studio";

/** Open, relaxed hand offering its fingertips as a perch. */
const PERCH: HandPose = {
  wrist: [0, 0, 0],
  thumb: [
    [-0.08, 0.42, 0.2],
    [0.02, 0, 0],
    [-0.1, 0, 0],
  ],
  index: [
    [0, 0.06, 0],
    [-0.12, 0.14, 0],
    [-0.2, 0, 0],
    [-0.12, 0, 0],
  ],
  middle: [
    [0, 0, 0],
    [-0.16, 0.02, 0],
    [-0.24, 0, 0],
    [-0.12, 0, 0],
  ],
  ring: [
    [0, -0.05, 0],
    [-0.26, -0.1, 0],
    [-0.32, 0, 0],
    [-0.16, 0, 0],
  ],
  pinky: [
    [0, -0.1, 0],
    [-0.36, -0.2, 0],
    [-0.38, 0, 0],
    [-0.2, 0, 0],
  ],
};

const HAND_LENGTH = 0.18; // wrist → middle fingertip in model metres
const easeOut = (t: number) => 1 - Math.pow(1 - THREE.MathUtils.clamp(t, 0, 1), 3);
const smooth = (t: number) => {
  const x = THREE.MathUtils.clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};

function Composition() {
  const stage = useStage();
  const { size, viewport } = useThree();
  const portrait = size.width / size.height < 0.9;

  // Layout anchors, as fractions of the canvas box (desktop values from the mockup).
  const L = portrait
    ? { tip: [0.52, 0.52], length: 0.5, span: 0.36 }
    : { tip: [0.52, 0.47], length: 0.8, span: 0.62 };

  const pivot = useRef<THREE.Group>(null!);
  const motion = useRef<THREE.Group>(null!);
  const handOffset = useRef<THREE.Group>(null!);
  const perch = useRef<THREE.Group>(null!);
  const hand = useRef<HandHandle>(null!);
  const fly = useRef<ButterflyHandle>(null!);
  const glowLight = useRef<THREE.PointLight>(null!);

  const scale = (L.length * viewport.height) / HAND_LENGTH;
  const bScale = (L.span * viewport.height) / 2;
  const baseRot = useMemo(() => new THREE.Euler(-0.12, Math.PI / 2 + 0.1, Math.PI - 0.05, "XYZ"), []);

  // Place the hand so its middle fingertip lands on the anchor; pivot at the wrist.
  useLayoutEffect(() => {
    const h = hand.current;
    if (!h) return;
    handOffset.current.position.set(0, 0, 0);
    pivot.current.position.set(0, 0, 0);
    motion.current.position.set(0, 0, 0);
    motion.current.rotation.set(0, 0, 0);
    pivot.current.updateMatrixWorld(true);
    const tip = h.rig.bones.get("middle-finger-tip")!.getWorldPosition(new THREE.Vector3());
    const idx = h.rig.bones.get("index-finger-tip")!.getWorldPosition(new THREE.Vector3());
    const wrist = h.rig.bones.get("wrist")!.getWorldPosition(new THREE.Vector3());
    const target = new THREE.Vector3((L.tip[0] - 0.5) * viewport.width, (0.5 - L.tip[1]) * viewport.height, 0);
    handOffset.current.position.copy(wrist).negate();
    pivot.current.position.copy(target).sub(tip).add(wrist);
    // butterfly perches between the index and middle fingertips
    const perchLocal = tip.clone().add(idx).multiplyScalar(0.5).sub(wrist);
    perch.current.position.copy(perchLocal);
  }, [viewport.width, viewport.height, L.tip, scale]);

  const tmp = useMemo(() => ({ v: new THREE.Vector3(), p: new THREE.Vector2() }), []);

  useFrame((state, dt) => {
    const t = sinceEnter(stage);
    const reduced = stage.reduced;
    const time = state.clock.elapsedTime;

    // rise in, then breathe
    const rise = reduced ? 1 : easeOut(t / 2.2);
    const idle = reduced ? 0 : 1;
    motion.current.position.y = (1 - rise) * -0.55 * viewport.height + idle * Math.sin(time * 0.6) * 0.012 * viewport.height;

    // pointer parallax (damped)
    tmp.p.lerp(stage.pointer.current, 1 - Math.exp(-dt * 2.5));
    motion.current.rotation.y = tmp.p.x * 0.16;
    motion.current.rotation.x = -tmp.p.y * 0.06;
    motion.current.rotation.z = idle * Math.sin(time * 0.45) * 0.015;

    // butterfly: lands after the hand, takes off when the hero scrolls away
    const land = reduced ? 1 : smooth((t - 0.9) / 2.4);
    const away = smooth((scrollOut(stage) - 0.12) / 0.5);
    const off = 1 - land + away;
    const b = fly.current;
    if (b) {
      b.group.position.set(
        off * 0.38 * viewport.width + Math.sin(time * 2.1) * 0.03 * off * viewport.height,
        off * 0.42 * viewport.height + Math.sin(time * 3.3) * 0.02 * off * viewport.height,
        off * 1.2,
      );
      b.group.rotation.z = -0.35 + off * 0.5 + Math.sin(time * 0.8) * 0.04;
      b.energy.value = THREE.MathUtils.damp(b.energy.value, off > 0.02 ? 1 : 0, 3, dt);
      glowLight.current.intensity = THREE.MathUtils.lerp(9, 3, Math.min(1, off));
    }
  });

  return (
    <>
      <Studio accent="#f25722" accentIntensity={3} accentPosition={[3, 4, -2]} />
      <directionalLight position={[-3, 5, 4]} intensity={1.1} />
      <directionalLight position={[2, 1, -5]} intensity={2.2} color="#ffd2b8" />
      <group ref={pivot}>
        <group ref={motion}>
          <group ref={handOffset}>
            <Hand ref={hand} pose={PERCH} scale={scale} rotation={baseRot} />
          </group>
          <group ref={perch}>
            <pointLight ref={glowLight} color="#ff7a2a" intensity={9} distance={0.9 * viewport.height} decay={1.5} />
            <group position={[0.02 * bScale, 0.3 * bScale, 0.12 * bScale]}>
              <Butterfly ref={fly} rest={0.18} scale={bScale} rotation={[0.2, 0.34, -0.12]} />
            </group>
          </group>
        </group>
      </group>
    </>
  );
}

export default function HeroScene() {
  return (
    <Scene3D fov={28} distance={12}>
      <Composition />
    </Scene3D>
  );
}
