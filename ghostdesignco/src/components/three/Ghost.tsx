"use client";

import { MeshTransmissionMaterial } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { guideState } from "@/lib/guide";
import { scrollState } from "@/lib/scroll";
import { glowTexture, useWorld } from "./context";
import { createSample, sampleDive, stationPresence, stationReach, worldState } from "./stations";

/**
 * The guide: a frosted-glass sheet ghost that travels with the visitor.
 * Geometry is a lathed bell with side "arms" and a scalloped hem; the hem
 * ripples in the vertex shader and flows harder when the scroll is fast.
 * A fresnel rim adds the acid glow on the silhouette, an acid core glows
 * through the frosted body.
 */

function ghostGeometry() {
  const pts: [number, number][] = [
    [0.001, 1.6],
    [0.28, 1.56],
    [0.52, 1.46],
    [0.72, 1.29],
    [0.85, 1.06],
    [0.92, 0.79],
    [0.95, 0.46],
    [0.96, 0.1],
    [0.98, -0.25],
    [1.02, -0.6],
    [1.07, -0.9],
    [1.1, -1.05],
  ];
  const curve = new THREE.SplineCurve(pts.map(([r, y]) => new THREE.Vector2(r, y)));
  const g = new THREE.LatheGeometry(curve.getPoints(72), 120);
  const pos = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const a = Math.atan2(x, z);
    // arms: soft bulges on both sides, a little above the middle
    const side = Math.exp(-Math.pow((Math.abs(a) - Math.PI / 2) / 0.42, 2));
    const band = Math.exp(-Math.pow((y - 0.05) / 0.3, 2));
    const k = 1 + 0.17 * side * band;
    // scalloped hem: six tails
    const hem = THREE.MathUtils.smoothstep(-y, 0.72, 1.05);
    const scallop = 0.16 * (0.5 + 0.5 * Math.cos(a * 6)) * hem;
    pos.setXYZ(i, x * k, y - scallop, z * k);
  }
  g.computeVertexNormals();
  return g;
}

type GhostUniforms = { uTime: { value: number }; uFlow: { value: number }; uRim: { value: THREE.Color } };

/** Hem waves + fresnel rim, chained after any existing shader patch. */
function patchGhost(m: THREE.Material, uniforms: GhostUniforms) {
  const prev = m.onBeforeCompile;
  m.onBeforeCompile = (shader, renderer) => {
    prev?.call(m, shader, renderer);
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nuniform float uTime;\nuniform float uFlow;")
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        float hem = smoothstep(-0.15, -1.15, position.y);
        float ang = atan(position.x, position.z);
        float flow = 1.0 + uFlow;
        transformed.y += (sin(ang * 6.0 + uTime * 2.4) * 0.07 + sin(ang * 3.0 - uTime * 1.5) * 0.05) * hem * flow;
        transformed.x += sin(uTime * 1.3 + position.y * 2.2) * 0.05 * hem * flow;
        transformed.z += cos(uTime * 1.1 + position.y * 1.9) * 0.04 * hem * flow;`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform vec3 uRim;")
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
        float fres = pow(1.0 - clamp(abs(dot(normalize(normal), normalize(vViewPosition))), 0.0, 1.0), 2.4);
        totalEmissiveRadiance += uRim * fres;`,
      );
  };
  m.customProgramCacheKey = () => `ghost-${m.type}`;
  m.needsUpdate = true;
}

// silhouette bounds in the body's own plane (arms and hem tails included)
const BOUNDS = { x: 1.2, bottom: -1.3, top: 1.62 };
const corners = Array.from({ length: 4 }, () => new THREE.Vector3());
const tmp = new THREE.Vector3();
const peek = new THREE.Vector3();
const head = new THREE.Vector3();

export function Ghost({ selectionRef }: { selectionRef: RefObject<HTMLDivElement> }) {
  const { hi, tall, reduced } = useWorld();
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const group = useRef<THREE.Group>(null!);
  const body = useRef<THREE.Group>(null!);
  const light = useRef<THREE.PointLight>(null!);
  const core = useRef<THREE.Sprite>(null!);
  const mtm = useRef<THREE.Material>(null);

  const geo = useMemo(ghostGeometry, []);
  const uniforms = useMemo<GhostUniforms>(
    () => ({ uTime: { value: 0 }, uFlow: { value: 0 }, uRim: { value: new THREE.Color("#b6ff3b").multiplyScalar(1.25) } }),
    [],
  );
  const loMat = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#dcebd6"),
      roughness: 0.22,
      metalness: 0,
      transparent: true,
      opacity: 0.8,
      clearcoat: 1,
      clearcoatRoughness: 0.14,
      emissive: new THREE.Color("#0f2403"),
      envMapIntensity: 1.4,
      side: THREE.DoubleSide,
    });
    patchGhost(m, uniforms);
    return m;
  }, [uniforms]);

  useLayoutEffect(() => {
    if (hi && mtm.current) patchGhost(mtm.current, uniforms);
  }, [hi, uniforms]);

  const eyeGeo = useMemo(() => new THREE.SphereGeometry(0.1, 24, 16), []);
  const eyeMat = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: "#030303", roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 2 }),
    [],
  );
  const halo = useMemo(
    () =>
      new THREE.SpriteMaterial({ map: glowTexture(), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.22 }),
    [],
  );
  const coreMat = useMemo(
    () =>
      new THREE.SpriteMaterial({
        map: glowTexture("rgba(226,255,170,1)", "rgba(182,255,59,0.35)"),
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
      }),
    [],
  );
  const eyes = useMemo(() => {
    const r = 0.885;
    return [-0.3, 0.3].map((x) => {
      const z = Math.sqrt(r * r - x * x);
      const p = new THREE.Vector3(x, 0.96, z).multiplyScalar(1.012);
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(x, 0.12, z).normalize());
      return { p, q };
    });
  }, []);

  const sample = useMemo(createSample, []);
  const pos = useRef<THREE.Vector3 | null>(null);
  const vel = useRef(new THREE.Vector3());
  const born = useRef<number | null>(null);
  const lastState = useRef("off");

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const t = state.clock.elapsedTime;
    if (born.current === null) born.current = t;
    const age = t - born.current;

    sampleDive(sample, tall, reduced);
    const target = sample.ghost;
    // at the end the guide peeks over the frame of the form, and rides along with it
    const end = stationReach("contact");
    if (end > 0 && worldState.portalReady) {
      const c = worldState.portalCorner;
      target.lerp(peek.set(c.x - (tall ? 0.6 : 0.95), c.y - (tall ? 0.12 : 0.1), c.z - 0.8), end);
    }
    if (!pos.current) pos.current = target.clone();
    if (reduced) {
      pos.current.copy(target);
      vel.current.set(0, 0, 0);
    } else {
      // damped spring: the guide lags a little behind the camera
      const k = 26;
      const c = 2 * Math.sqrt(k) * 0.92;
      tmp.copy(target).sub(pos.current).multiplyScalar(k).addScaledVector(vel.current, -c);
      vel.current.addScaledVector(tmp, dt);
      pos.current.addScaledVector(vel.current, dt);
    }

    // entrance: rises out of the mirror floor
    const intro = reduced ? 1 : THREE.MathUtils.smoothstep(age, 0.2, 2.4);
    const bob = reduced ? 0 : Math.sin(t * 1.1) * 0.08 + Math.sin(t * 0.47) * 0.05;
    const gs = sample.gs;
    group.current.position.set(pos.current.x, pos.current.y + bob * gs - (1 - intro) * 2.6, pos.current.z);
    group.current.scale.setScalar(gs * (0.55 + 0.45 * intro));
    worldState.ghost.copy(group.current.position);
    worldState.ghostScale = gs;

    // face the camera, look at the pointer in the hero
    const p = worldState.pointer;
    const hero = stationPresence("hero");
    let yaw = Math.atan2(camera.position.x - pos.current.x, camera.position.z - pos.current.z) * 0.85;
    let pitch = THREE.MathUtils.clamp(vel.current.z * 0.02, -0.35, 0.35);
    if (!reduced) {
      yaw += Math.sin(t * 0.6) * 0.1 * (1 - hero) + p.x * 0.42 * hero;
      pitch += p.y * 0.16 * hero;
    }
    body.current.rotation.y = THREE.MathUtils.damp(body.current.rotation.y, yaw, 4, dt);
    body.current.rotation.x = THREE.MathUtils.damp(body.current.rotation.x, pitch, 5, dt);
    body.current.rotation.z = THREE.MathUtils.damp(
      body.current.rotation.z,
      THREE.MathUtils.clamp(-vel.current.x * 0.05, -0.3, 0.3) + (reduced ? 0 : Math.sin(t * 0.8) * 0.04),
      5,
      dt,
    );

    uniforms.uTime.value = reduced ? 0 : t;
    uniforms.uFlow.value = THREE.MathUtils.damp(uniforms.uFlow.value, Math.min(3, Math.abs(scrollState.velocity) * 2.2), 4, dt);
    const pulse = reduced ? 1 : 1 + Math.sin(t * 2.1) * 0.12;
    light.current.intensity = 7 * pulse * intro;
    core.current.material.opacity = 0.8 * pulse * intro;

    // where the head is on screen, for the guided tour's speech bubble
    group.current.updateWorldMatrix(true, true);
    head.set(0, BOUNDS.top, 0).applyMatrix4(body.current.matrixWorld).project(camera);
    guideState.x = (head.x * 0.5 + 0.5) * size.width;
    guideState.y = (0.5 - head.y * 0.5) * size.height;
    guideState.visible = intro > 0.9 && head.z < 1 && Math.abs(head.x) < 1.05 && Math.abs(head.y) < 1.05;

    // Figma selection frame, only while the hero holds the stage
    const el = selectionRef.current;
    if (el) {
      const next = age > 2.2 && hero > 0.97 && scrollState.y < scrollState.vh * 0.12 ? "on" : "off";
      if (next !== lastState.current) {
        el.dataset.state = next;
        lastState.current = next;
      }
      if (next === "on" || age < 3) {
        group.current.updateWorldMatrix(true, true);
        const m = body.current.matrixWorld;
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        for (let i = 0; i < 4; i++) {
          const c = corners[i].set(i & 1 ? BOUNDS.x : -BOUNDS.x, i & 2 ? BOUNDS.top : BOUNDS.bottom, 0);
          c.applyMatrix4(m).project(camera);
          const x = (c.x * 0.5 + 0.5) * size.width;
          const y = (0.5 - c.y * 0.5) * size.height;
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
        const w = maxX - minX;
        const h = maxY - minY;
        el.style.transform = `translate3d(${minX.toFixed(1)}px, ${minY.toFixed(1)}px, 0)`;
        el.style.width = `${w.toFixed(1)}px`;
        el.style.height = `${h.toFixed(1)}px`;
        const dims = el.querySelector<HTMLElement>("[data-dims]");
        if (dims) dims.textContent = `${Math.round(w)} × ${Math.round(h)}`;
      }
    }
  });

  return (
    <group ref={group}>
      <sprite material={halo} scale={[4.4, 4.4, 1]} position={[0, 0.2, -0.7]} />
      <pointLight ref={light} color="#b6ff3b" intensity={0} distance={7} decay={2} position={[0, 0.3, 0.2]} />
      <group ref={body}>
        <sprite ref={core} material={coreMat} scale={[1.45, 1.45, 1]} position={[0, 0.3, 0]} />
        {hi ? (
          <mesh geometry={geo}>
            <MeshTransmissionMaterial
              ref={mtm as never}
              resolution={768}
              samples={8}
              backside={false}
              thickness={1.1}
              roughness={0.3}
              anisotropicBlur={0.3}
              chromaticAberration={0.06}
              distortion={0.2}
              distortionScale={0.35}
              temporalDistortion={reduced ? 0 : 0.05}
              ior={1.2}
              color="#ffffff"
              attenuationColor="#e4ffb8"
              attenuationDistance={4.5}
              clearcoat={1}
              clearcoatRoughness={0.18}
              envMapIntensity={1.4}
              emissive="#030701"
              side={THREE.DoubleSide}
            />
          </mesh>
        ) : (
          <mesh geometry={geo} material={loMat} />
        )}
        {eyes.map((e, i) => (
          <mesh key={i} geometry={eyeGeo} material={eyeMat} position={e.p} quaternion={e.q} scale={[0.85, 1.35, 0.32]} />
        ))}
      </group>
    </group>
  );
}
