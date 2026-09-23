"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { Hand, type HandHandle } from "./Hand";
import type { HandPose } from "./handRig";
import { Scene3D, sinceEnter, useStage } from "./Scene3D";
import { BlackStrawberry, CrystalStrawberry } from "./Strawberry";
import { Studio } from "./Studio";

/** "C" grip: thumb and index frame the berry, the other fingers stay relaxed. */
const GRIP: HandPose = {
  thumb: [
    [-0.35, 0.25, 0.5],
    [-0.1, 0, 0],
    [-0.1, 0, 0],
  ],
  index: [
    [0, -0.05, 0],
    [-0.6, -0.05, 0],
    [-0.75, 0, 0],
    [-0.4, 0, 0],
  ],
  middle: [
    [0, 0, 0],
    [-0.95, 0.02, 0],
    [-1.0, 0, 0],
    [-0.5, 0, 0],
  ],
  ring: [
    [0, 0.05, 0],
    [-1.1, 0.08, 0],
    [-1.0, 0, 0],
    [-0.5, 0, 0],
  ],
  pinky: [
    [0, 0.1, 0],
    [-1.2, 0.14, 0],
    [-1.0, 0, 0],
    [-0.5, 0, 0],
  ],
};

const HAND_LENGTH = 0.18;
const BERRY = 0.062; // model metres
const easeOut = (t: number) => 1 - Math.pow(1 - THREE.MathUtils.clamp(t, 0, 1), 3);

const corners = Array.from({ length: 8 }, () => new THREE.Vector3());
const BOX = new THREE.Box3(new THREE.Vector3(-0.8, -0.95, -0.8), new THREE.Vector3(0.8, 0.86, 0.8));

function Composition({ selectionRef }: { selectionRef: RefObject<HTMLDivElement> }) {
  const stage = useStage();
  const { size, viewport, camera } = useThree();
  const portrait = size.width / size.height < 0.8;

  // Anchors (fractions of the canvas box), desktop values measured on the mockup.
  const L = portrait
    ? { berry: [0.42, 0.26], length: 0.46, crystal: [0.2, 0.84], crystalSize: 0.16 }
    : { berry: [0.467, 0.232], length: 0.48, crystal: [0.198, 0.79], crystalSize: 0.22 };

  const pivot = useRef<THREE.Group>(null!);
  const motion = useRef<THREE.Group>(null!);
  const handOffset = useRef<THREE.Group>(null!);
  const berryHolder = useRef<THREE.Group>(null!);
  const berry = useRef<THREE.Group>(null!);
  const hand = useRef<HandHandle>(null!);
  const crystalRef = useRef<THREE.Group>(null!);
  const crystalSpin = useRef<THREE.Group>(null!);

  const scale = (L.length * viewport.height) / HAND_LENGTH;
  const rot = useMemo(() => new THREE.Euler(-0.2, Math.PI / 2 - 1.0, Math.PI + 0.1, "XYZ"), []);

  useLayoutEffect(() => {
    const h = hand.current;
    if (!h) return;
    pivot.current.position.set(0, 0, 0);
    motion.current.position.set(0, 0, 0);
    motion.current.rotation.set(0, 0, 0);
    handOffset.current.position.set(0, 0, 0);
    pivot.current.updateMatrixWorld(true);
    const a = h.rig.bones.get("thumb-tip")!.getWorldPosition(new THREE.Vector3());
    const b = h.rig.bones.get("index-finger-tip")!.getWorldPosition(new THREE.Vector3());
    const wrist = h.rig.bones.get("wrist")!.getWorldPosition(new THREE.Vector3());
    const grip = a.add(b).multiplyScalar(0.5);
    const berryPos = grip.clone().add(new THREE.Vector3(0, -BERRY * 0.6 * scale, 0.006 * scale));
    const target = new THREE.Vector3((L.berry[0] - 0.5) * viewport.width, (0.5 - L.berry[1]) * viewport.height, 0);
    // pivot at the wrist, whole rig shifted so the berry lands on its anchor
    handOffset.current.position.copy(wrist).negate();
    pivot.current.position.copy(target).sub(berryPos).add(wrist);
    berryHolder.current.position.copy(berryPos).sub(wrist);
  }, [viewport.width, viewport.height, scale, L.berry]);

  const crystalBase = useRef(
    new THREE.Vector3((L.crystal[0] - 0.5) * viewport.width, (0.5 - L.crystal[1]) * viewport.height, 0.6),
  );
  crystalBase.current.set((L.crystal[0] - 0.5) * viewport.width, (0.5 - L.crystal[1]) * viewport.height, 0.6);
  const crystalScale = (L.crystalSize * viewport.height) / 1.5;

  const p = useMemo(() => new THREE.Vector2(), []);
  const lastState = useRef("off");

  useFrame((state, dt) => {
    const t = sinceEnter(stage);
    const time = state.clock.elapsedTime;
    const rise = stage.reduced ? 1 : easeOut((t - 0.1) / 1.8);
    const idle = stage.reduced ? 0 : 1;
    motion.current.position.y = (1 - rise) * -0.45 * viewport.height + idle * Math.sin(time * 0.7) * 0.01 * viewport.height;
    p.lerp(stage.pointer.current, 1 - Math.exp(-dt * 2.5));
    motion.current.rotation.y = p.x * 0.14;
    motion.current.rotation.x = -p.y * 0.05;
    motion.current.rotation.z = idle * Math.sin(time * 0.5) * 0.012;
    // the berry swings a hair between the fingertips
    berry.current.rotation.z = idle * Math.sin(time * 1.1) * 0.035;
    berry.current.rotation.y = 0.35 + idle * Math.sin(time * 0.6) * 0.12;

    // crystal: settles in, then slowly turns its facets to the light
    const settle = stage.reduced ? 1 : easeOut((t - 0.4) / 1.6);
    crystalRef.current.position.y = crystalBase.current.y + (1 - settle) * 0.25 * viewport.height;
    crystalSpin.current.rotation.y = idle * time * 0.18;

    // Figma frame: project the berry's bounds into the overlay box
    const el = selectionRef.current;
    if (el) {
      berry.current.updateWorldMatrix(true, false);
      const m = berry.current.matrixWorld;
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (let i = 0; i < 8; i++) {
        const c = corners[i].set(i & 1 ? BOX.max.x : BOX.min.x, i & 2 ? BOX.max.y : BOX.min.y, i & 4 ? BOX.max.z : BOX.min.z);
        c.applyMatrix4(m).project(camera);
        const x = (c.x * 0.5 + 0.5) * size.width;
        const y = (0.5 - c.y * 0.5) * size.height;
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
      // the projected box of a rotating cube is loose; tighten towards the silhouette
      const shrinkX = (maxX - minX) * 0.08;
      const shrinkY = (maxY - minY) * 0.04;
      el.style.transform = `translate3d(${(minX + shrinkX).toFixed(1)}px, ${(minY + shrinkY).toFixed(1)}px, 0)`;
      el.style.width = `${(maxX - minX - 2 * shrinkX).toFixed(1)}px`;
      el.style.height = `${(maxY - minY - 2 * shrinkY).toFixed(1)}px`;
      const next = rise > 0.92 && stage.visible.current ? "on" : "off";
      if (next !== lastState.current) {
        el.dataset.state = next;
        lastState.current = next;
      }
    }
  });

  return (
    <>
      <Studio accent="#f25722" accentIntensity={3.5} accentPosition={[5, 0, 1]} />
      <directionalLight position={[-4, 6, 5]} intensity={1.2} />
      <directionalLight position={[3, 2, -4]} intensity={1.6} color="#ffb48a" />
      <group ref={pivot}>
        <group ref={motion}>
          <group ref={handOffset}>
            <Hand ref={hand} pose={GRIP} scale={scale} rotation={rot} forearm={0.34} />
          </group>
          <group ref={berryHolder}>
            <BlackStrawberry ref={berry} scale={(BERRY * scale) / 1.5} rotation={[0.25, 0.35, 0]} />
          </group>
        </group>
      </group>
      <group ref={crystalRef} position={crystalBase.current}>
        {/* lying on its side: calyx up-left, tip down-right; spins about its own axis */}
        <group rotation={[0.35, 0, 0.72]}>
          <group ref={crystalSpin}>
            <CrystalStrawberry scale={crystalScale} />
          </group>
        </group>
        <pointLight color="#ff6a1a" intensity={6} distance={0.35 * viewport.height} decay={1.6} position={[0.3, -0.2, 0.8]} />
      </group>
    </>
  );
}

export default function ProblemsScene({ selectionRef }: { selectionRef: RefObject<HTMLDivElement> }) {
  return (
    <Scene3D fov={30} distance={12}>
      <Composition selectionRef={selectionRef} />
    </Scene3D>
  );
}
