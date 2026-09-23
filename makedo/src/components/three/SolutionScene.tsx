"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Arrow, CrystalApple, Pedestal } from "./Apple";
import { Scene3D, sinceEnter, useStage } from "./Scene3D";
import { Studio } from "./Studio";

/**
 * Crystal apple on a plinth, pierced by an arrow that is shot every time the
 * slide enters the viewport ("точный расчёт": the hit is exact).
 * The camera uses a shift lens (off-axis frustum): it sits above the plinth
 * so its top reads as an ellipse, while verticals stay vertical and the
 * framing matches the mockup's flat layout.
 */

const DESIGN = { w: 886, h: 900 }; // canvas box in mockup pixels
const FOV = 30;
const DIST = 12;

const clamp01 = (t: number) => THREE.MathUtils.clamp(t, 0, 1);

function Composition() {
  const stage = useStage();
  const { size, camera } = useThree();
  const cam = camera as THREE.PerspectiveCamera;

  const H = 2 * DIST * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
  const W = H * (size.width / size.height);
  // world units per mockup pixel, fitted to the box
  const u = Math.min(W / DESIGN.w, H / DESIGN.h);
  const at = (px: number, py: number, z = 0) => new THREE.Vector3((px - DESIGN.w / 2) * u, (DESIGN.h / 2 - py) * u, z);

  const APPLE_R = 140 * u; // horizontal radius in world units
  const apple = at(485, 246);
  const arrowAt = at(480, 250, 0);
  const plinthTop = at(486, 388);

  // shift lens: camera raised above the plinth top, frustum shifted back down
  useLayoutEffect(() => {
    const yc = plinthTop.y + DIST * Math.tan(THREE.MathUtils.degToRad(4.2));
    cam.position.set(0, yc, DIST);
    cam.rotation.set(0, 0, 0);
    cam.setViewOffset(size.width, size.height, 0, (yc / H) * size.height, size.width, size.height);
    cam.updateProjectionMatrix();
    return () => {
      cam.clearViewOffset();
    };
  }, [cam, size.width, size.height, H, plinthTop.y]);

  const rig = useRef<THREE.Group>(null!);
  const appleRef = useRef<THREE.Group>(null!);
  const arrowRef = useRef<THREE.Group>(null!);
  const flash = useRef<THREE.Sprite>(null!);
  const flashMat = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, "rgba(255,255,255,1)");
    r.addColorStop(0.25, "rgba(255,190,120,0.7)");
    r.addColorStop(1, "rgba(242,87,34,0)");
    g.fillStyle = r;
    g.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return new THREE.SpriteMaterial({ map: tex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, toneMapped: false });
  }, []);
  const p = useMemo(() => new THREE.Vector2(), []);

  useFrame((state, dt) => {
    const t = stage.reduced ? 10 : sinceEnter(stage);
    const time = state.clock.elapsedTime;

    // flight: head first from beyond the right edge, fast ease-out, then quiver
    const T0 = 0.6;
    const T1 = 1.05;
    const k = clamp01((t - T0) / (T1 - T0));
    const e = 1 - Math.pow(1 - k, 4);
    const a = arrowRef.current;
    a.visible = t > T0;
    a.position.x = (1 - e) * W * 1.25;
    const since = t - T1;
    const quiver = since > 0 ? Math.exp(-since * 5.5) * Math.sin(since * 42) : 0;
    a.rotation.z = quiver * 0.03;
    a.rotation.y = quiver * 0.018;

    // the apple takes the hit
    const recoil = since > 0 ? Math.exp(-since * 3.2) * Math.sin(since * 13) : 0;
    appleRef.current.rotation.z = recoil * 0.05;
    appleRef.current.position.x = -recoil * 0.05 * APPLE_R;

    const f = since > 0 ? Math.exp(-since * 7) : 0;
    flash.current.material.opacity = f;
    flash.current.scale.setScalar(APPLE_R * (1.2 + 1.6 * (1 - f)));

    // slow showcase sway + pointer parallax (plinth stays put)
    p.lerp(stage.pointer.current, 1 - Math.exp(-dt * 2.5));
    rig.current.rotation.y = (stage.reduced ? 0 : Math.sin(time * 0.35) * 0.16) + p.x * 0.22;
    rig.current.rotation.x = -p.y * 0.04;
  });

  return (
    <>
      <Studio accent="#22aa39" accentIntensity={2.4} accentPosition={[5, 5, -2]} />
      <directionalLight position={[-5, 4, 6]} intensity={1.4} />
      <directionalLight position={[4, 3, -4]} intensity={1.8} color="#ffd1a8" />
      <pointLight position={[apple.x - APPLE_R * 1.5, apple.y, 1.2]} color="#ff7a2a" intensity={5} distance={APPLE_R * 6} decay={1.5} />

      <group position={[apple.x, 0, 0]}>
        <group ref={rig}>
          <group ref={appleRef} position={[0, apple.y, 0]}>
            <CrystalApple scale={[APPLE_R, APPLE_R * 1.2, APPLE_R]} />
          </group>
          <group position={[arrowAt.x - apple.x, arrowAt.y, 0.02]}>
            <Arrow ref={arrowRef} length={4.85} scale={APPLE_R} />
          </group>
        </group>
      </group>

      <sprite ref={flash} material={flashMat} position={[apple.x + APPLE_R * 0.95, arrowAt.y, 0.6]} />
      <Pedestal position={[plinthTop.x, plinthTop.y, 0]} radius={191 * u} height={900 * u} />
    </>
  );
}

export default function SolutionScene() {
  return (
    <Scene3D fov={FOV} distance={DIST}>
      <Composition />
    </Scene3D>
  );
}
