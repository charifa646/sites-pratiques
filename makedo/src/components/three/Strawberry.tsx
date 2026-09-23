"use client";

import { forwardRef, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { crystal, lacquer } from "./materials";

/** Strawberry profile (radius, height), top centre → tip. Unit-ish size. */
const PROFILE: [number, number][] = [
  [0.0, 0.5],
  [0.2, 0.55],
  [0.44, 0.54],
  [0.62, 0.47],
  [0.73, 0.34],
  [0.77, 0.17],
  [0.75, -0.01],
  [0.68, -0.2],
  [0.57, -0.4],
  [0.42, -0.6],
  [0.26, -0.77],
  [0.11, -0.89],
  [0.0, -0.93],
];

const FACETED: [number, number][] = [
  [0.0, 0.5],
  [0.42, 0.55],
  [0.72, 0.36],
  [0.78, 0.05],
  [0.62, -0.34],
  [0.36, -0.68],
  [0.0, -0.94],
];

function profilePoint(t: number, out: THREE.Vector2, tangent: THREE.Vector2) {
  // arc-length-free linear interpolation over the profile
  const n = PROFILE.length - 1;
  const x = THREE.MathUtils.clamp(t, 0, 1) * n;
  const i = Math.min(n - 1, Math.floor(x));
  const f = x - i;
  const a = PROFILE[i];
  const b = PROFILE[i + 1];
  out.set(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f);
  tangent.set(b[0] - a[0], b[1] - a[1]).normalize();
}

/** Sepal (calyx leaf): pointed blade, bent downwards along its length. */
function sepalGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, -0.05);
  shape.quadraticCurveTo(0.13, 0.14, 0.04, 0.5);
  shape.lineTo(0, 0.6);
  shape.lineTo(-0.04, 0.5);
  shape.quadraticCurveTo(-0.13, 0.14, 0, -0.05);
  const g = new THREE.ShapeGeometry(shape, 6);
  const pos = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const x = pos.getX(i);
    // droop + gutter shape
    pos.setZ(i, -0.28 * y * y + 0.35 * x * x);
  }
  g.computeVertexNormals();
  return g;
}

function Calyx({ material, count = 8, size = 1 }: { material: THREE.Material; count?: number; size?: number }) {
  const sepal = useMemo(() => sepalGeometry(), []);
  return (
    <group position={[0, 0.52 * size, 0]} scale={size}>
      {Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2 + (i % 2) * 0.2;
        return (
          <group key={i} rotation={[0, a, 0]}>
            {/* lay the blade over the shoulder */}
            <mesh geometry={sepal} material={material} rotation={[-1.2 - (i % 3) * 0.12, 0, 0]} scale={0.8 + (i % 3) * 0.12} />
          </group>
        );
      })}
      <mesh material={material} position={[0.02, 0.11, 0]} rotation={[0, 0, -0.25]}>
        <cylinderGeometry args={[0.03, 0.045, 0.24, 10]} />
      </mesh>
    </group>
  );
}

/** Lacquered black strawberry with honeycomb seed pits. */
export const BlackStrawberry = forwardRef<THREE.Group, JSX.IntrinsicElements["group"]>(function BlackStrawberry(props, ref) {
  const mat = useMemo(() => lacquer({ roughness: 0.2, envMapIntensity: 1.8 }), []);
  const rimMat = useMemo(() => lacquer({ roughness: 0.14, envMapIntensity: 2.4, color: "#0d0d0d" }), []);
  const body = useMemo(() => {
    const g = new THREE.LatheGeometry(
      PROFILE.map(([r, y]) => new THREE.Vector2(r, y)),
      56,
    );
    g.computeVertexNormals();
    return g;
  }, []);
  const rings = useRef<THREE.InstancedMesh>(null!);
  const COUNT = 260;
  const ring = useMemo(() => {
    const g = new THREE.TorusGeometry(0.046, 0.012, 5, 12);
    g.scale(1, 1, 0.6);
    return g;
  }, []);

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const p2 = new THREE.Vector2();
    const t2 = new THREE.Vector2();
    const z = new THREE.Vector3(0, 0, 1);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < COUNT; i++) {
      const t = 0.1 + (0.82 * (i + 0.5)) / COUNT;
      const ang = i * golden;
      profilePoint(t, p2, t2);
      const pos = new THREE.Vector3(p2.x * Math.cos(ang), p2.y, -p2.x * Math.sin(ang));
      // outward normal of the lathe surface
      const nr = new THREE.Vector2(t2.y, -t2.x);
      const normal = new THREE.Vector3(nr.x * Math.cos(ang), nr.y, -nr.x * Math.sin(ang)).normalize();
      q.setFromUnitVectors(z, normal);
      const s = 0.75 + 0.5 * Math.sin(t * Math.PI);
      m.compose(pos.addScaledVector(normal, 0.004), q, new THREE.Vector3(s, s * 1.15, s));
      rings.current.setMatrixAt(i, m);
    }
    rings.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <group ref={ref} {...props}>
      <mesh geometry={body} material={mat} />
      <instancedMesh ref={rings} args={[ring, rimMat, COUNT]} />
      <Calyx material={mat} />
    </group>
  );
});

/** Faceted orange crystal strawberry with an inner glow. */
export const CrystalStrawberry = forwardRef<THREE.Group, JSX.IntrinsicElements["group"]>(function CrystalStrawberry(props, ref) {
  const mat = useMemo(
    () =>
      crystal("#ff6a14", {
        emissive: new THREE.Color("#ff4a00"),
        emissiveIntensity: 0.42,
        attenuationColor: new THREE.Color("#ff8a2a"),
        attenuationDistance: 0.55,
        thickness: 1.2,
        transmission: 0.6,
        roughness: 0.02,
        envMapIntensity: 2.8,
      }),
    [],
  );
  const leafMat = useMemo(() => lacquer({ color: "#0b0b0b" }), []);
  const core = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#ffb04a",
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    [],
  );
  const body = useMemo(() => {
    const g = new THREE.LatheGeometry(
      FACETED.map(([r, y]) => new THREE.Vector2(r, y)),
      9,
    ).toNonIndexed();
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <group ref={ref} {...props}>
      <mesh geometry={body} material={mat} />
      {/* inner fire: a smaller additive core glowing through the facets */}
      <mesh geometry={body} material={core} scale={0.72} />
      <Calyx material={leafMat} count={7} size={1.1} />
    </group>
  );
});
