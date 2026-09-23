"use client";

import { forwardRef, useMemo } from "react";
import * as THREE from "three";
import { chrome, crystal, lacquer } from "./materials";

/** Apple silhouette (radius, height), top dimple → bottom. Radius ≈ 1. */
const APPLE: [number, number][] = [
  [0.0, 0.6],
  [0.13, 0.7],
  [0.32, 0.84],
  [0.56, 0.88],
  [0.78, 0.8],
  [0.93, 0.6],
  [1.0, 0.32],
  [0.98, 0.02],
  [0.9, -0.3],
  [0.75, -0.57],
  [0.55, -0.77],
  [0.32, -0.86],
  [0.14, -0.84],
  [0.0, -0.78],
];

function leafGeometry() {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(0.22, 0.12, 0.34, 0.42, 0.02, 0.86);
  s.bezierCurveTo(-0.3, 0.44, -0.2, 0.12, 0, 0);
  const g = new THREE.ShapeGeometry(s, 5).toNonIndexed();
  const pos = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    // fold along the midrib and arch the blade
    pos.setZ(i, Math.abs(x) * 0.45 - 0.22 * y * y);
  }
  g.computeVertexNormals();
  return g;
}

/** Faceted amber crystal apple with a green crystal leaf and a steel stem. */
export const CrystalApple = forwardRef<THREE.Group, JSX.IntrinsicElements["group"]>(function CrystalApple(props, ref) {
  const { body, core, bodyMat, leaf, leafMat, stem, stemMat } = useMemo(() => {
    const body = new THREE.LatheGeometry(
      APPLE.map(([r, y]) => new THREE.Vector2(r, y)),
      16,
    ).toNonIndexed();
    body.computeVertexNormals();
    const bodyMat = crystal("#ff8a1e", {
      emissive: new THREE.Color("#ff5a00"),
      emissiveIntensity: 0.14,
      attenuationColor: new THREE.Color("#ff9a3a"),
      attenuationDistance: 0.9,
      thickness: 1.6,
      transmission: 0.6,
      envMapIntensity: 3,
    });
    const core = new THREE.MeshBasicMaterial({
      color: "#ffae42",
      transparent: true,
      opacity: 0.24,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    const leaf = leafGeometry();
    const leafMat = new THREE.MeshPhysicalMaterial({
      color: "#22aa39",
      emissive: new THREE.Color("#0f5a1c"),
      emissiveIntensity: 0.4,
      roughness: 0.18,
      clearcoat: 1,
      flatShading: true,
      envMapIntensity: 2,
      side: THREE.DoubleSide,
    });
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0.62, 0),
      new THREE.Vector3(0.02, 0.9, 0),
      new THREE.Vector3(0.12, 1.08, 0.02),
    );
    const stem = new THREE.TubeGeometry(curve, 10, 0.035, 8, false);
    const stemMat = chrome({ color: "#b8b8b8", roughness: 0.28 });
    return { body, core, bodyMat, leaf, leafMat, stem, stemMat };
  }, []);

  return (
    <group ref={ref} {...props}>
      <mesh geometry={body} material={bodyMat} />
      <mesh geometry={body} material={core} scale={0.74} />
      <mesh geometry={stem} material={stemMat} />
      <mesh geometry={leaf} material={leafMat} position={[0.0, 0.9, 0.02]} rotation={[0.3, 0.25, 1.05]} scale={0.98} />
    </group>
  );
});

/** Steel arrow pointing to −X: barbed broadhead, shaft, three vanes. */
export const Arrow = forwardRef<THREE.Group, JSX.IntrinsicElements["group"] & { length?: number }>(function Arrow(
  { length = 5.2, ...props },
  ref,
) {
  const { head, vane, mat, matSoft } = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.34, 0);
    s.lineTo(0.02, 0.13);
    s.lineTo(-0.04, 0.04);
    s.lineTo(0.06, 0.02);
    s.lineTo(0.06, -0.02);
    s.lineTo(-0.04, -0.04);
    s.lineTo(0.02, -0.13);
    s.closePath();
    const head = new THREE.ExtrudeGeometry(s, { depth: 0.02, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.008, bevelSegments: 1 });
    head.translate(0, 0, -0.01);
    const v = new THREE.Shape();
    v.moveTo(0, 0.02);
    v.lineTo(0.18, 0.2);
    v.lineTo(0.62, 0.2);
    v.lineTo(0.5, 0.02);
    v.closePath();
    const vane = new THREE.ExtrudeGeometry(v, { depth: 0.008, bevelEnabled: false });
    vane.translate(0, 0, -0.004);
    return {
      head,
      vane,
      mat: chrome({ envMapIntensity: 2.2 }),
      matSoft: chrome({ roughness: 0.22, color: "#e6e6e6", envMapIntensity: 2.4 }),
    };
  }, []);
  const half = length / 2;
  return (
    <group ref={ref} {...props}>
      <mesh material={mat} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.022, 0.022, length, 12]} />
      </mesh>
      <mesh geometry={head} material={mat} position={[-half, 0, 0]} />
      {[0, Math.PI / 2, Math.PI].map((a) => (
        <group key={a} rotation={[a, 0, 0]}>
          <mesh geometry={vane} material={matSoft} position={[half - 0.72, 0, 0]} />
        </group>
      ))}
      <mesh material={mat} position={[half + 0.02, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.026, 0.1, 10]} />
      </mesh>
    </group>
  );
});

/** Lacquered black plinth. */
export function Pedestal(props: JSX.IntrinsicElements["group"] & { radius?: number; height?: number }) {
  const { radius = 1.36, height = 6, ...rest } = props;
  // side / top cap / bottom cap: the top stays a dim mirror so the apple reads on it
  const mats = useMemo(
    () => [
      lacquer({ roughness: 0.16, metalness: 0.35, envMapIntensity: 2.2 }),
      lacquer({ color: "#2a2a2a", roughness: 0.42, metalness: 0.55, clearcoat: 0, envMapIntensity: 0.55 }),
      lacquer(),
    ],
    [],
  );
  return (
    <group {...rest}>
      <mesh material={mats} position={[0, -height / 2, 0]}>
        <cylinderGeometry args={[radius, radius, height, 72, 1]} />
      </mesh>
      {/* bright bevel on the rim */}
      <mesh position={[0, -0.002, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, radius * 0.012, 8, 96]} />
        <meshBasicMaterial color="#cfcfcf" toneMapped={false} />
      </mesh>
    </group>
  );
}
