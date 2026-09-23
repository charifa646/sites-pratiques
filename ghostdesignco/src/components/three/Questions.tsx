"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFontsReady, useWorld } from "./context";
import { questionMark } from "./textures";
import { stationPresence, worldState } from "./stations";

/** Questions fréquentes: a few glowing question marks orbit the guide. */
export function Questions() {
  const ready = useFontsReady();
  return ready ? <Orbit /> : null;
}

function Orbit() {
  const { reduced } = useWorld();
  const group = useRef<THREE.Group>(null!);
  const marks = useRef<(THREE.Sprite | null)[]>([]);
  const tex = useMemo(questionMark, []);
  useEffect(() => () => tex.dispose(), [tex]);
  const mats = useMemo(
    () =>
      [0, 1, 2, 3].map(
        () => new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0, blending: THREE.AdditiveBlending }),
      ),
    [tex],
  );

  useFrame((state) => {
    const here = stationPresence("faq");
    group.current.visible = here > 0.001;
    if (!group.current.visible) return;
    const t = reduced ? 0 : state.clock.elapsedTime;
    const s = worldState.ghostScale;
    group.current.position.copy(worldState.ghost);
    marks.current.forEach((m, i) => {
      if (!m) return;
      const a = t * 0.5 + (i * Math.PI) / 2;
      const r = (1.9 + (i % 2) * 0.5) * s;
      m.position.set(Math.cos(a) * r, (1.2 + Math.sin(t * 0.9 + i * 1.7) * 0.35 + (i % 2) * 0.5) * s, Math.sin(a) * r * 0.6);
      const size = (0.55 + (i % 2) * 0.2) * s;
      m.scale.set(size, size, 1);
      mats[i].opacity = here * (0.55 + 0.45 * Math.sin(t * 1.4 + i));
    });
  });

  return (
    <group ref={group}>
      {mats.map((m, i) => (
        <sprite
          key={i}
          ref={(el) => {
            marks.current[i] = el;
          }}
          material={m}
        />
      ))}
    </group>
  );
}
