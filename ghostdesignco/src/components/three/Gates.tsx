"use client";

import { Line } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useWorld } from "./context";
import { FLOOR_Y, GATES } from "./stations";

/**
 * Figma frames standing across the path: the camera flies through one before
 * reaching each station. Hairline outline, square handles, frame name on top.
 */
type LineObj = THREE.Object3D & { material: THREE.Material & { opacity: number } };

function labelTexture(text: string) {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 96;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const draw = () => {
    const g = c.getContext("2d")!;
    const family = getComputedStyle(document.body).fontFamily || "sans-serif";
    g.clearRect(0, 0, c.width, c.height);
    g.font = `500 52px ${family}`;
    g.textBaseline = "middle";
    g.fillStyle = "#b6ff3b";
    g.fillText(text, 4, 50);
    tex.needsUpdate = true;
  };
  draw();
  document.fonts?.ready.then(draw).catch(() => {});
  return tex;
}

function Gate({ z, label, w, h }: { z: number; label: string; w: number; h: number }) {
  const camera = useThree((s) => s.camera);
  const { palette } = useWorld();
  const frame = useRef<LineObj>(null);
  const handles = useRef<LineObj>(null);
  const fill = useRef<THREE.MeshBasicMaterial>(null!);
  const tag = useRef<THREE.MeshBasicMaterial>(null!);

  const y0 = FLOOR_Y;
  const y1 = FLOOR_Y + h;
  const loop = useMemo(
    () =>
      [
        [-w / 2, y0, 0],
        [w / 2, y0, 0],
        [w / 2, y1, 0],
        [-w / 2, y1, 0],
        [-w / 2, y0, 0],
      ] as [number, number, number][],
    [w, y0, y1],
  );
  const corners = useMemo(
    () =>
      [
        [-w / 2, y1],
        [w / 2, y1],
        [-w / 2, (y0 + y1) / 2],
        [w / 2, (y0 + y1) / 2],
      ] as [number, number][],
    [w, y0, y1],
  );
  const squares = useMemo(() => {
    const s = 0.09;
    const pts: [number, number, number][] = [];
    for (const [x, y] of corners) {
      const a: [number, number, number] = [x - s, y - s, 0.01];
      const b: [number, number, number] = [x + s, y - s, 0.01];
      const c: [number, number, number] = [x + s, y + s, 0.01];
      const d: [number, number, number] = [x - s, y + s, 0.01];
      pts.push(a, b, b, c, c, d, d, a);
    }
    return pts;
  }, [corners]);
  const fillGeo = useMemo(() => {
    const parts = corners.map(([x, y]) => new THREE.PlaneGeometry(0.18, 0.18).translate(x, y, 0.005));
    const g = mergeQuads(parts);
    parts.forEach((p) => p.dispose());
    return g;
  }, [corners]);
  const tex = useMemo(() => labelTexture(label), [label]);
  useEffect(() => () => tex.dispose(), [tex]);

  useFrame(() => {
    const d = camera.position.z - z;
    // shows up while the camera approaches, gone just before it crosses
    const a = THREE.MathUtils.smoothstep(d, 1.5, 5) * (1 - THREE.MathUtils.smoothstep(d, 10, 15));
    if (frame.current) frame.current.material.opacity = 0.34 * a;
    if (handles.current) handles.current.material.opacity = 0.6 * a;
    fill.current.opacity = a;
    tag.current.opacity = 0.85 * a;
  });

  const tagW = 3.2;
  return (
    <group position={[0, 0, z]}>
      <Line ref={frame as never} points={loop} color="#b6ff3b" lineWidth={1} transparent opacity={0} depthWrite={false} />
      <mesh geometry={fillGeo}>
        <meshBasicMaterial ref={fill} color={palette.bg} transparent opacity={0} depthWrite={false} />
      </mesh>
      <Line ref={handles as never} points={squares} segments color="#b6ff3b" lineWidth={1.2} transparent opacity={0} depthWrite={false} />
      <mesh position={[-w / 2 + tagW / 2, y1 + 0.26, 0]}>
        <planeGeometry args={[tagW, (tagW * 96) / 1024]} />
        <meshBasicMaterial ref={tag} map={tex} transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

/** Tiny merge for a handful of indexed quads (avoids pulling BufferGeometryUtils). */
function mergeQuads(parts: THREE.BufferGeometry[]) {
  const pos: number[] = [];
  const idx: number[] = [];
  let base = 0;
  for (const p of parts) {
    const a = p.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < a.count; i++) pos.push(a.getX(i), a.getY(i), a.getZ(i));
    const ix = p.index!;
    for (let i = 0; i < ix.count; i++) idx.push(ix.getX(i) + base);
    base += a.count;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  return g;
}

export function Gates() {
  const { tall } = useWorld();
  const w = tall ? 9 : 14;
  const h = tall ? 9.5 : 7.4;
  return (
    <>
      {GATES.map((g) => (
        <Gate key={g.z} z={g.z} label={g.label} w={w} h={h} />
      ))}
    </>
  );
}
