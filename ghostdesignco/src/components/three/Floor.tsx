"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ACID_LIN, useWorld } from "./context";
import { FLOOR_Y, worldState } from "./stations";

/**
 * Black mirror floor. On capable screens the scene is rendered a second time
 * from a camera mirrored under the floor (once per frame, at reduced size);
 * the shader blurs it lightly, ripples it under the ghost and draws the grid.
 * Elsewhere the same shader runs without the reflection.
 */
const LENGTH = 340;
const WIDTH = 70;
const CENTER_Z = -140;

export function Floor() {
  const { hi, reduced } = useWorld();
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const mesh = useRef<THREE.Mesh>(null!);

  const target = useMemo(
    () =>
      new THREE.WebGLRenderTarget(4, 4, {
        type: THREE.HalfFloatType,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        depthBuffer: true,
      }),
    [],
  );
  useEffect(() => () => target.dispose(), [target]);

  useEffect(() => {
    const w = Math.min(1024, Math.round(size.width * 0.5));
    const h = Math.round((w * size.height) / size.width);
    target.setSize(w, h);
  }, [size, target]);

  const virtualCam = useMemo(() => new THREE.PerspectiveCamera(), []);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          tRefl: { value: target.texture },
          uHasRefl: { value: 0 },
          uTexel: { value: new THREE.Vector2(1 / 512, 1 / 512) },
          textureMatrix: { value: new THREE.Matrix4() },
          uTime: { value: 0 },
          uGhost: { value: new THREE.Vector3() },
          uGhostScale: { value: 1 },
          uCam: { value: new THREE.Vector3() },
          uAcid: { value: ACID_LIN.clone() },
          uFogColor: { value: new THREE.Color("#050505") },
          uFogNear: { value: 12 },
          uFogFar: { value: 46 },
        },
        vertexShader: /* glsl */ `
          uniform mat4 textureMatrix;
          varying vec4 vRefl;
          varying vec3 vWorld;
          varying float vDepth;
          void main() {
            vec4 wp = modelMatrix * vec4(position, 1.0);
            vWorld = wp.xyz;
            vRefl = textureMatrix * vec4(position, 1.0);
            vec4 mv = viewMatrix * wp;
            vDepth = -mv.z;
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform sampler2D tRefl;
          uniform float uHasRefl;
          uniform vec2 uTexel;
          uniform float uTime;
          uniform vec3 uGhost;
          uniform float uGhostScale;
          uniform vec3 uCam;
          uniform vec3 uAcid;
          uniform vec3 uFogColor;
          uniform float uFogNear;
          uniform float uFogFar;
          varying vec4 vRefl;
          varying vec3 vWorld;
          varying float vDepth;

          float grid(vec2 p, float cell, float width) {
            vec2 g = p / cell;
            vec2 w = fwidth(g) * width;
            vec2 a = abs(fract(g - 0.5) - 0.5) / max(w, vec2(1e-4));
            return 1.0 - min(min(a.x, a.y), 1.0);
          }

          void main() {
            vec2 xz = vWorld.xz;
            float d = distance(xz, uGhost.xz) / max(uGhostScale, 0.3);
            float near = exp(-d * 0.45);
            float rip = sin(d * 5.5 - uTime * 2.3) * near;

            vec3 col = vec3(0.006, 0.0062, 0.0068);
            vec3 V = normalize(uCam - vWorld);
            float F = 0.05 + 0.95 * pow(1.0 - clamp(V.y, 0.0, 1.0), 5.0);

            if (uHasRefl > 0.5) {
              vec4 uv = vRefl;
              uv.xy += rip * 0.012 * uv.w;
              vec2 st = uv.xy / uv.w;
              // two rings of taps: soft, no ghosting of small bright points
              vec3 r = texture2D(tRefl, st).rgb * 0.2;
              for (int k = 0; k < 8; k++) {
                float a = float(k) * 0.7853982;
                vec2 o1 = vec2(cos(a), sin(a) * 1.6) * uTexel * 1.3;
                vec2 o2 = vec2(cos(a + 0.3927), sin(a + 0.3927) * 1.6) * uTexel * 2.8;
                r += texture2D(tRefl, st + o1).rgb * 0.06;
                r += texture2D(tRefl, st + o2).rgb * 0.04;
              }
              col += r * mix(0.32, 0.8, F);
            }

            // pool of light under the guide, with slow rings
            float pool = exp(-d * d * 0.3);
            float rings = smoothstep(0.1, 0.0, abs(fract(d * 0.42 - uTime * 0.22) - 0.5)) * near;
            col += uAcid * (pool * 0.07 + rings * 0.035);

            // blueprint grid: minor every 2 units, major every 10
            float side = 1.0 - smoothstep(10.0, 20.0, abs(xz.x));
            float g = grid(xz, 2.0, 1.0) * 0.055 + grid(xz, 10.0, 1.3) * 0.1;
            col += uAcid * g * side * (0.6 + 0.4 * F);

            float fog = smoothstep(uFogNear, uFogFar, vDepth);
            gl_FragColor = vec4(mix(col, uFogColor, fog), 1.0);
            #include <colorspace_fragment>
          }
        `,
      }),
    [target],
  );

  const bias = useMemo(() => new THREE.Matrix4().set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const u = material.uniforms;
    u.uTime.value = reduced ? 0 : state.clock.elapsedTime;
    u.uGhost.value.copy(worldState.ghost);
    u.uGhostScale.value = worldState.ghostScale;
    u.uCam.value.copy(camera.position);
    const fog = scene.fog as THREE.Fog | null;
    if (fog) {
      u.uFogNear.value = fog.near;
      u.uFogFar.value = fog.far;
    }
    u.uHasRefl.value = hi ? 1 : 0;
    if (!hi) return;

    // camera mirrored across the floor plane
    const cam = camera as THREE.PerspectiveCamera;
    virtualCam.position.set(cam.position.x, 2 * FLOOR_Y - cam.position.y, cam.position.z);
    dir.set(0, 0, -1).applyQuaternion(cam.quaternion);
    dir.y *= -1;
    up.set(0, 1, 0).applyQuaternion(cam.quaternion);
    up.y *= -1;
    virtualCam.up.copy(up);
    virtualCam.lookAt(look.copy(virtualCam.position).add(dir));
    virtualCam.near = cam.near;
    virtualCam.far = cam.far;
    virtualCam.updateMatrixWorld();
    virtualCam.projectionMatrix.copy(cam.projectionMatrix);
    virtualCam.projectionMatrixInverse.copy(cam.projectionMatrixInverse);

    mesh.current.updateMatrixWorld();
    u.textureMatrix.value.copy(bias).multiply(virtualCam.projectionMatrix).multiply(virtualCam.matrixWorldInverse).multiply(mesh.current.matrixWorld);
    u.uTexel.value.set(1 / target.width, 1 / target.height);

    mesh.current.visible = false;
    const prev = gl.getRenderTarget();
    gl.setRenderTarget(target);
    gl.clear();
    gl.render(scene, virtualCam);
    gl.setRenderTarget(prev);
    mesh.current.visible = true;
  });

  return (
    <mesh ref={mesh} material={material} rotation-x={-Math.PI / 2} position={[0, FLOOR_Y, CENTER_Z]}>
      <planeGeometry args={[WIDTH, LENGTH]} />
    </mesh>
  );
}
