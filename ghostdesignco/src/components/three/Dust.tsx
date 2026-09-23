"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { scrollState } from "@/lib/scroll";
import { rng } from "./textures";
import { ACID_LIN, useWorld } from "./context";

/**
 * Two particle systems:
 * - dust: soft motes floating along the whole path, a few of them acid;
 * - streaks: light trails that appear only when the visitor dives fast.
 */
export function Dust() {
  const { hi, reduced } = useWorld();
  const dpr = useThree((s) => s.viewport.dpr);
  const count = hi ? 2600 : 1100;

  const geo = useMemo(() => {
    const r = rng(11);
    const pos = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const phase = new Float32Array(count);
    const acid = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (r() * 2 - 1) * 15;
      pos[i * 3 + 1] = -1.45 + Math.pow(r(), 1.4) * 10;
      pos[i * 3 + 2] = 14 - r() * 304;
      size[i] = 0.6 + Math.pow(r(), 3) * 2.6;
      phase[i] = r();
      acid[i] = r() < 0.12 ? 1 : 0;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
    g.setAttribute("aAcid", new THREE.BufferAttribute(acid, 1));
    return g;
  }, [count]);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uPixel: { value: 1 },
          uAcid: { value: ACID_LIN.clone() },
          uFogNear: { value: 12 },
          uFogFar: { value: 46 },
        },
        vertexShader: /* glsl */ `
          attribute float aSize;
          attribute float aPhase;
          attribute float aAcid;
          uniform float uTime;
          uniform float uPixel;
          uniform float uFogNear;
          uniform float uFogFar;
          varying float vAlpha;
          varying float vAcid;
          void main() {
            vec3 p = position;
            p.y += sin(uTime * 0.23 + aPhase * 6.2831) * 0.35;
            p.x += cos(uTime * 0.17 + aPhase * 12.0) * 0.25;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            float depth = -mv.z;
            gl_PointSize = aSize * uPixel * (9.0 / max(depth, 0.5));
            gl_Position = projectionMatrix * mv;
            float tw = 0.55 + 0.45 * sin(uTime * (0.8 + aPhase * 1.6) + aPhase * 40.0);
            vAlpha = tw * (1.0 - smoothstep(uFogNear, uFogFar, depth)) * smoothstep(0.6, 2.4, depth);
            vAcid = aAcid;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uAcid;
          varying float vAlpha;
          varying float vAcid;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.0, d);
            a *= a;
            vec3 col = mix(vec3(0.82, 0.84, 0.8), uAcid * 1.6, vAcid);
            gl_FragColor = vec4(col, a * vAlpha * 0.75);
            #include <colorspace_fragment>
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  const scene = useThree((s) => s.scene);
  useFrame((state) => {
    mat.uniforms.uTime.value = reduced ? 0 : state.clock.elapsedTime;
    mat.uniforms.uPixel.value = dpr;
    const fog = scene.fog as THREE.Fog | null;
    if (fog) {
      mat.uniforms.uFogNear.value = fog.near;
      mat.uniforms.uFogFar.value = fog.far;
    }
  });

  return (
    <>
      <points geometry={geo} material={mat} frustumCulled={false} />
      {!reduced && <Streaks count={hi ? 260 : 140} />}
    </>
  );
}

const SPAN = 64;

function Streaks({ count }: { count: number }) {
  const ref = useRef<THREE.LineSegments>(null!);
  const camera = useThree((s) => s.camera);

  const geo = useMemo(() => {
    const r = rng(5);
    const pos = new Float32Array(count * 6);
    const end = new Float32Array(count * 2);
    const tint = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      const a = r() * Math.PI * 2;
      const rad = 2.4 + Math.pow(r(), 0.7) * 9;
      const x = Math.cos(a) * rad;
      const y = 0.4 + Math.sin(a) * rad * 0.55;
      const z = r() * SPAN;
      pos.set([x, Math.max(y, -1.4), z, x, Math.max(y, -1.4), z], i * 6);
      end.set([0, 1], i * 2);
      const c = r() < 0.35 ? 1 : 0;
      tint.set([c, c], i * 2);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aEnd", new THREE.BufferAttribute(end, 1));
    g.setAttribute("aTint", new THREE.BufferAttribute(tint, 1));
    return g;
  }, [count]);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uCamZ: { value: 0 },
          uVel: { value: 0 },
          uAcid: { value: ACID_LIN.clone() },
        },
        vertexShader: /* glsl */ `
          attribute float aEnd;
          attribute float aTint;
          uniform float uCamZ;
          uniform float uVel;
          varying float vAlpha;
          varying float vTint;
          void main() {
            vec3 p = position;
            float base = uCamZ - ${SPAN.toFixed(1)} + 6.0;
            p.z = base + mod(p.z - base, ${SPAN.toFixed(1)});
            float speed = abs(uVel);
            // the tail recedes toward the vanishing point
            p.z -= aEnd * sign(uVel) * min(9.0, speed * 2.4);
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            float depth = -mv.z;
            vAlpha = smoothstep(0.25, 1.6, speed) * (1.0 - aEnd) * smoothstep(1.0, 6.0, depth) * (1.0 - smoothstep(30.0, 52.0, depth));
            vTint = aTint;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uAcid;
          varying float vAlpha;
          varying float vTint;
          void main() {
            vec3 col = mix(vec3(0.9, 0.92, 0.88), uAcid * 1.8, vTint);
            gl_FragColor = vec4(col, vAlpha * 0.8);
            #include <colorspace_fragment>
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  // main camera only: keep the trails out of the floor reflection
  useLayoutEffect(() => {
    ref.current.layers.set(1);
  }, []);

  useFrame(() => {
    mat.uniforms.uCamZ.value = camera.position.z;
    mat.uniforms.uVel.value = THREE.MathUtils.lerp(mat.uniforms.uVel.value, scrollState.velocity, 0.15);
  });

  return <lineSegments ref={ref} geometry={geo} material={mat} frustumCulled={false} />;
}
