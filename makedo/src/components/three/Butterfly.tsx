"use client";

import { useFrame } from "@react-three/fiber";
import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import * as THREE from "three";
import { monarchTexture } from "./monarchTexture";

export type ButterflyHandle = {
  group: THREE.Group;
  /** 0 = resting (slow breathing wings), 1 = flying (fast flaps). */
  energy: { value: number };
};

type Props = JSX.IntrinsicElements["group"] & {
  /** Rest opening angle of the wings (radians from flat). */
  rest?: number;
};

function glowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, "rgba(255,150,60,0.9)");
  r.addColorStop(0.35, "rgba(242,87,34,0.35)");
  r.addColorStop(1, "rgba(242,87,34,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Procedural monarch butterfly: painted wings hinged on a lacquered body. */
export const Butterfly = forwardRef<ButterflyHandle, Props>(function Butterfly({ rest = 0.55, ...group }, ref) {
  const root = useRef<THREE.Group>(null!);
  const right = useRef<THREE.Group>(null!);
  const left = useRef<THREE.Group>(null!);
  const energy = useRef({ value: 0 }).current;
  const phase = useRef(0);

  const { wing, wingMat, bodyMat, glow, antenna } = useMemo(() => {
    const wing = new THREE.PlaneGeometry(1, 1, 10, 10);
    wing.translate(0.5, 0, 0);
    // slight camber so the wing catches light like a real membrane
    const pos = wing.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, 0.06 * Math.sin(Math.PI * x) * (1 - Math.abs(y)));
    }
    wing.computeVertexNormals();
    const wingMat = new THREE.MeshBasicMaterial({
      map: monarchTexture(),
      transparent: true,
      alphaTest: 0.4,
      side: THREE.DoubleSide,
      toneMapped: false,
    });
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: "#0a0706",
      roughness: 0.35,
      clearcoat: 0.6,
      envMapIntensity: 1.2,
    });
    const glow = new THREE.SpriteMaterial({
      map: glowTexture(),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      toneMapped: false,
    });
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.05, 0.16, 0.02),
      new THREE.Vector3(0.14, 0.32, 0.05),
    ]);
    const antenna = new THREE.TubeGeometry(curve, 12, 0.006, 5, false);
    return { wing, wingMat, bodyMat, glow, antenna };
  }, []);

  useImperativeHandle(ref, () => ({ group: root.current, energy }), [energy]);

  useFrame((_, dt) => {
    const e = energy.value;
    // resting: slow open/close; flying: ~9 Hz beats
    const freq = THREE.MathUtils.lerp(1.3, 26, e);
    phase.current += dt * freq;
    const amp = THREE.MathUtils.lerp(0.28, 0.95, e);
    const flutter = e < 0.05 ? 0.08 * Math.max(0, Math.sin(phase.current * 0.21)) ** 12 : 0;
    const a = rest + amp * (0.5 + 0.5 * Math.sin(phase.current)) + flutter;
    right.current.rotation.y = a;
    left.current.rotation.y = -a;
  });

  return (
    <group ref={root} {...group}>
      <sprite material={glow} scale={[2.6, 2.6, 1]} position={[0, 0.05, -0.2]} />
      <group ref={right}>
        <mesh geometry={wing} material={wingMat} />
      </group>
      <group ref={left} scale={[-1, 1, 1]}>
        <mesh geometry={wing} material={wingMat} />
      </group>
      {/* body: thorax + abdomen + head */}
      <mesh material={bodyMat} position={[0, 0.02, 0.01]}>
        <capsuleGeometry args={[0.034, 0.3, 6, 12]} />
      </mesh>
      <mesh material={bodyMat} position={[0, 0.235, 0.015]}>
        <sphereGeometry args={[0.04, 16, 12]} />
      </mesh>
      <mesh geometry={antenna} material={bodyMat} position={[0.01, 0.26, 0.02]} />
      <mesh geometry={antenna} material={bodyMat} position={[-0.01, 0.26, 0.02]} scale={[-1, 1, 1]} />
    </group>
  );
});
