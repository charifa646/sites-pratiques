"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { projects } from "@/lib/projects";
import { screenMaterial, useWorld } from "./context";
import { roundedRect } from "./Browser";
import { nextSlot, projectShot } from "./textures";
import { PROPS, smooth, stationPresence, stationProgress } from "./stations";

/**
 * Réalisations: the projects as screens on a curved wall. Scrolling brings
 * each one to the front (the DOM card follows the same index); the last slot
 * is an empty frame, the place of the next project.
 */
const W = 3.6;
const H = W / 1.6;

export function Gallery() {
  const { tall, reduced } = useWorld();
  const group = useRef<THREE.Group>(null!);
  const items = useRef<(THREE.Group | null)[]>([]);
  const count = projects.length + 1;

  const mats = useMemo(() => {
    const list = projects.map((p, i) => {
      const m = screenMaterial(projectShot(61 + i * 13, p.type), { opacity: 0 });
      if (p.image) {
        new THREE.TextureLoader().load(p.image, (t) => {
          t.colorSpace = THREE.SRGBColorSpace;
          t.anisotropy = 8;
          m.uniforms.map.value.dispose();
          m.uniforms.map.value = t;
        });
      }
      return m;
    });
    list.push(screenMaterial(nextSlot(), { opacity: 0 }));
    return list;
  }, []);
  useEffect(() => () => mats.forEach((m) => (m.uniforms.map.value as THREE.Texture).dispose()), [mats]);

  const geo = useMemo(() => new THREE.PlaneGeometry(W, H), []);
  const outline = useMemo(() => {
    const pts = roundedRect(W + 0.1, H + 0.1, 0.16)
      .getPoints(20)
      .map((p) => new THREE.Vector3(p.x, p.y, 0.01));
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);
  const outlineMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: new THREE.Color("#b6ff3b").multiplyScalar(1.7), transparent: true, opacity: 0 }),
    [],
  );
  const P = tall ? PROPS.tall : PROPS.wide;

  useFrame((state) => {
    const t = reduced ? 0 : state.clock.elapsedTime;
    const here = stationPresence("work");
    group.current.visible = here > 0.001;
    if (!group.current.visible) return;
    // continuous focus, snapped a little so each project rests in front
    const raw = stationProgress("work") * count - 0.5;
    const base = Math.floor(raw);
    const focus = reduced ? Math.round(raw) : base + smooth(0.25, 0.75, raw - base);

    items.current.forEach((g, i) => {
      if (!g) return;
      const o = i - focus;
      const a = Math.abs(o);
      g.position.set(o * (tall ? 2.9 : 3.3), Math.sin(t * 0.6 + i) * 0.05, -Math.min(a, 3) * 1.7);
      g.rotation.set(0, -Math.sign(o) * Math.min(a, 1.5) * 0.42, 0);
      g.scale.setScalar(1 - Math.min(a, 2) * 0.1);
      const m = mats[i];
      m.uniforms.uOpacity.value = here * (1 - Math.min(a, 2.2) * 0.36);
      m.uniforms.uGain.value = 1 + Math.max(0, 1 - a) * 0.12;
    });
    const front = Math.round(Math.max(0, Math.min(count - 1, focus)));
    const lead = items.current[front];
    if (lead) {
      outlineMat.opacity = here * (1 - Math.min(1, Math.abs(front - focus) * 2)) * (0.75 + (reduced ? 0 : Math.sin(t * 2.4) * 0.2));
    }
    group.current.position.set(P.gallery[0], P.gallery[1], P.gallery[2]);
    group.current.scale.setScalar(P.galleryScale * (0.9 + 0.1 * here));
    group.current.rotation.y = tall ? 0 : -0.12;
    // the outline rides with the front screen
    const ring = group.current.children[group.current.children.length - 1];
    if (lead) {
      ring.position.copy(lead.position);
      ring.rotation.copy(lead.rotation);
      ring.scale.copy(lead.scale);
    }
  });

  return (
    <group ref={group}>
      {mats.map((m, i) => (
        <group
          key={i}
          ref={(el) => {
            items.current[i] = el;
          }}
        >
          <mesh geometry={geo} material={m} />
        </group>
      ))}
      <lineLoop geometry={outline} material={outlineMat} />
    </group>
  );
}
