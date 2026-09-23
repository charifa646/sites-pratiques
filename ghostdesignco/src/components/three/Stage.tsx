"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { ACID_LIN, useWorld } from "./context";
import { FLOOR_Y, POSES, stationPresence } from "./stations";

/**
 * Témoignages: a stage light. A soft volumetric cone falls on the guide and
 * pools on the mirror floor, while the clients' videos play in the page.
 */
export function Stage() {
  const { tall, reduced } = useWorld();
  const group = useRef<THREE.Group>(null!);
  // on phones the guide floats high above the floor: the stage floats with it
  const HEIGHT = tall ? 3.2 : 7.5;

  const cone = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uOpacity: { value: 0 }, uTime: { value: 0 }, uAcid: { value: ACID_LIN.clone() } },
        vertexShader: /* glsl */ `
          varying float vH;
          varying vec3 vN;
          varying vec3 vView;
          void main() {
            vH = uv.y;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vN = normalize(normalMatrix * normal);
            vView = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uOpacity;
          uniform float uTime;
          uniform vec3 uAcid;
          varying float vH;
          varying vec3 vN;
          varying vec3 vView;
          void main() {
            // bright near the lamp, fading toward the floor; soft at the silhouette
            float edge = pow(abs(dot(vN, vView)), 1.6);
            float fall = pow(vH, 1.4) * 0.8 + 0.2 * smoothstep(0.0, 0.2, vH);
            float shimmer = 0.9 + 0.1 * sin(uTime * 1.3 + vH * 9.0);
            vec3 col = mix(vec3(0.85, 0.9, 0.8), uAcid, 0.55) * edge * fall * shimmer;
            gl_FragColor = vec4(col * 0.42 * uOpacity, 1.0);
            #include <colorspace_fragment>
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
    [],
  );
  const pool = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uOpacity: { value: 0 }, uAcid: { value: ACID_LIN.clone() } },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uOpacity;
          uniform vec3 uAcid;
          varying vec2 vUv;
          void main() {
            float d = length(vUv - 0.5) * 2.0;
            float a = smoothstep(1.0, 0.0, d);
            float rim = smoothstep(0.12, 0.0, abs(d - 0.92));
            vec3 col = mix(vec3(0.8, 0.85, 0.75), uAcid, 0.6) * (a * a * 0.5 + rim * 0.35);
            gl_FragColor = vec4(col * uOpacity, 1.0);
            #include <colorspace_fragment>
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  useFrame((state) => {
    const here = stationPresence("voices");
    group.current.visible = here > 0.001;
    if (!group.current.visible) return;
    const pose = (tall ? POSES.tall : POSES.wide).voices;
    const g = pose.ghost;
    group.current.position.set(g[0], tall ? g[1] - 1.4 * pose.gs : FLOOR_Y, g[2]);
    const flick = reduced ? 1 : 0.94 + Math.sin(state.clock.elapsedTime * 3.1) * 0.03;
    cone.uniforms.uOpacity.value = here * flick;
    cone.uniforms.uTime.value = reduced ? 0 : state.clock.elapsedTime;
    pool.uniforms.uOpacity.value = here;
  });

  return (
    <group ref={group}>
      <mesh position={[0, HEIGHT / 2, 0]} material={cone}>
        <cylinderGeometry args={[0.18, tall ? 1.2 : 2.1, HEIGHT, 48, 1, true]} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]} material={pool}>
        <planeGeometry args={tall ? [3, 3] : [5, 5]} />
      </mesh>
    </group>
  );
}
