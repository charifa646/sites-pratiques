"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useWorld } from "./context";
import { siteThumb } from "./textures";
import { POSES, baseFov, smooth, stationLeave, stationReach } from "./stations";

/**
 * "15+ projets réalisés": fifteen site frames.
 * While the numbers hold the screen they form an arch above them (placed in
 * screen space, so they never cover the text) and light up one by one.
 * When the visitor dives on, they swirl into a tunnel around the path and
 * the camera flies right through them.
 */
const COUNT = 15;

type Slot = { nx: number; ny: number; d: number };

function archSlots(tall: boolean): Slot[] {
  return Array.from({ length: COUNT }, (_, i) => {
    const u = i / (COUNT - 1);
    const d = 11 + ((i * 7) % 5) * 3;
    if (tall) {
      // three staggered rows of five in the band under the header
      const row = i % 3;
      const col = Math.floor(i / 3);
      return { nx: -0.78 + col * 0.39 + (row === 1 ? 0.19 : 0) - 0.05, ny: 0.5 + row * 0.12, d: 13 + row * 3 + (col % 2) * 1.5 };
    }
    if (u < 0.8) {
      const k = u / 0.8;
      return { nx: -0.9 + k * 1.8, ny: 0.56 + Math.sin(k * Math.PI) * 0.08, d };
    }
    // the right end bends down, above the guide's head
    const v = (u - 0.8) / 0.2;
    return { nx: 0.9 - v * 0.03, ny: 0.54 - v * 0.26, d };
  });
}

export function Constellation() {
  const { tall, reduced } = useWorld();
  const size = useThree((s) => s.size);
  const items = useRef<(THREE.Mesh | null)[]>([]);

  const textures = useMemo(() => Array.from({ length: COUNT }, (_, i) => siteThumb(101 + i * 7)), []);
  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures]);
  const geo = useMemo(() => new THREE.PlaneGeometry(1, 0.625), []);
  const mats = useMemo(
    () => textures.map((map) => new THREE.MeshBasicMaterial({ map, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide })),
    [textures],
  );

  const slots = useMemo(() => archSlots(tall), [tall]);
  const tunnel = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => {
        const a = i * ((Math.PI * 2) / 5) + 0.6;
        return { a, z: -24 - i * 1.12 };
      }),
    [],
  );
  const hold = useMemo(() => new THREE.Vector3(), []);
  const tube = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const t = reduced ? 0 : state.clock.elapsedTime;
    const pose = (tall ? POSES.tall : POSES.wide).proof;
    const fov = baseFov(tall, size.width / size.height);
    const tanV = Math.tan(fov / 2);
    const tanH = tanV * (size.width / size.height);
    const reach = stationReach("proof");
    const leave = stationLeave("proof");
    const swirl = reduced ? (leave > 0.5 ? 1 : 0) : smooth(0, 0.55, leave);
    const size3 = tall ? 1.2 : 1.7;
    const rx = tall ? 3 : 4.6;
    const ry = tall ? 2.3 : 1.95;

    for (let i = 0; i < COUNT; i++) {
      const m = items.current[i];
      if (!m) continue;
      const on = reduced ? (reach > 0.5 ? 1 : 0) : smooth((i / COUNT) * 0.7, (i / COUNT) * 0.7 + 0.3, reach);
      const S = slots[i];
      hold.set(S.nx * S.d * tanH, pose.cam[1] + S.ny * S.d * tanV, pose.cam[2] - S.d);
      const T = tunnel[i];
      const a = T.a + t * 0.05;
      tube.set(Math.cos(a) * rx, 1.2 + Math.sin(a) * ry, T.z);
      m.position.lerpVectors(hold, tube, swirl);
      m.position.y += Math.sin(t * 0.6 + i * 1.3) * 0.06;
      m.position.z += (1 - on) * -2.5;
      const faceAxis = -Math.atan2(m.position.x, 6) * 0.55 * swirl;
      m.rotation.set(Math.sin(t * 0.4 + i) * 0.03, faceAxis + Math.sin(t * 0.3 + i * 2) * 0.05, Math.sin(t * 0.35 + i) * 0.02);
      const s = size3 * (0.72 + 0.28 * on);
      m.scale.setScalar(s);
      (m.material as THREE.MeshBasicMaterial).opacity = on * 0.94;
      m.visible = on > 0.002;
    }
  });

  return (
    <group>
      {mats.map((mat, i) => (
        <mesh
          key={i}
          ref={(el) => {
            items.current[i] = el;
          }}
          geometry={geo}
          material={mat}
        />
      ))}
    </group>
  );
}
