"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { ACID_LIN, glowTexture, useWorld } from "./context";
import { PROPS, stationPresence, stationReach, worldState } from "./stations";

/**
 * The end of the dive: a doorway of light that frames the brief form.
 * Each frame the form's box on screen is projected onto a plane in the
 * world, so the neon frame hugs the glass panel from behind (its inside is
 * seen through the panel's blur) and stands mirrored in the floor.
 */
const PAD = 26; // px of frame around the panel
const MARGIN = 0.7; // world units of glow drawn outside the frame line

export function Portal() {
  const { tall, reduced } = useWorld();
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const group = useRef<THREE.Group>(null!);
  const plane = useRef<THREE.Mesh>(null!);
  const halo = useRef<THREE.Sprite>(null!);
  const el = useRef<HTMLElement | null>(null);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: 0 },
          uAcid: { value: ACID_LIN.clone() },
          uSize: { value: new THREE.Vector2(4, 5) },
          uPlane: { value: new THREE.Vector2(4 + MARGIN * 2, 5 + MARGIN * 2) },
          uRadius: { value: 0.45 },
        },
        vertexShader: /* glsl */ `
          uniform vec2 uPlane;
          varying vec2 vP;
          void main() {
            vP = (uv - 0.5) * uPlane;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          uniform float uOpacity;
          uniform vec3 uAcid;
          uniform vec2 uSize;
          uniform float uRadius;
          varying vec2 vP;
          float box(vec2 p, vec2 b, float r) {
            vec2 q = abs(p) - b + r;
            return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
          }
          float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
          }
          void main() {
            float d = box(vP, uSize * 0.5, uRadius);
            float ad = abs(d);
            float px = fwidth(d);
            // neon tube: bright core, soft falloff both sides
            float core = 1.0 - smoothstep(0.0, 0.028 + px, ad);
            float glow = exp(-ad * 5.5) * 0.55 + exp(-ad * 1.6) * 0.18;
            // a spark travelling along the frame
            float ang = atan(vP.y / uSize.y, vP.x / uSize.x);
            float spark = pow(0.5 + 0.5 * cos(ang - uTime * 0.9), 24.0) * (1.0 - smoothstep(0.0, 0.2, ad));
            vec3 col = uAcid * (core * 2.1 + glow + spark * 1.8);
            float a = clamp(core + glow + spark, 0.0, 1.0);
            // liquid glass inside the doorway
            if (d < 0.0) {
              vec2 q = vP * 1.2;
              float n = noise(q + vec2(uTime * 0.12, uTime * 0.08)) + 0.5 * noise(q * 2.2 - vec2(uTime * 0.1, -uTime * 0.16));
              float caustic = pow(1.0 - abs(n - 0.75) * 2.0, 6.0);
              float inner = exp(d * 2.2);
              col += uAcid * (caustic * 0.035 + inner * 0.06);
              a = max(a, 0.82);
            }
            gl_FragColor = vec4(col, a * uOpacity);
            #include <colorspace_fragment>
          }
        `,
        transparent: true,
        depthWrite: false,
      }),
    [],
  );
  const haloMat = useMemo(
    () =>
      new THREE.SpriteMaterial({
        map: glowTexture("rgba(182,255,59,0.45)", "rgba(182,255,59,0.1)"),
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 0,
        fog: false,
      }),
    [],
  );

  const ndc = useMemo(() => new THREE.Vector3(), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const box = useMemo(() => new THREE.Box2(), []);
  const corner = useMemo(() => new THREE.Vector2(), []);
  const P = tall ? PROPS.tall : PROPS.wide;

  /** Screen point → point on the plane z = P.portal[2]. */
  const toWorld = (sx: number, sy: number) => {
    ndc.set((sx / size.width) * 2 - 1, -(sy / size.height) * 2 + 1, 0.5).unproject(camera);
    ndc.sub(camera.position);
    const t = (P.portal[2] - camera.position.z) / ndc.z;
    return hit.copy(camera.position).addScaledVector(ndc, t);
  };

  useFrame((state) => {
    const t = reduced ? 0 : state.clock.elapsedTime;
    const here = Math.max(stationPresence("contact"), stationReach("contact") * 0.999);
    group.current.visible = here > 0.001;
    if (!group.current.visible) return;
    if (!el.current || !el.current.isConnected) el.current = document.querySelector<HTMLElement>("[data-portal]");
    const r = el.current?.getBoundingClientRect();
    if (!r) return;

    box.makeEmpty();
    for (const [sx, sy] of [
      [r.left - PAD, r.top - PAD],
      [r.right + PAD, r.top - PAD],
      [r.left - PAD, r.bottom + PAD],
      [r.right + PAD, r.bottom + PAD],
    ]) {
      const p = toWorld(sx, sy);
      box.expandByPoint(corner.set(p.x, p.y));
    }
    const w = box.max.x - box.min.x;
    const h = box.max.y - box.min.y;
    const cx = (box.min.x + box.max.x) / 2;
    const cy = (box.min.y + box.max.y) / 2;
    group.current.position.set(cx, cy, P.portal[2]);
    worldState.portalCorner.set(box.max.x, box.max.y, P.portal[2]);
    worldState.portalReady = true;
    plane.current.scale.set(w + MARGIN * 2, h + MARGIN * 2, 1);
    material.uniforms.uSize.value.set(w, h);
    material.uniforms.uPlane.value.set(w + MARGIN * 2, h + MARGIN * 2);

    const flicker = reduced ? 1 : 0.95 + Math.sin(t * 2.3) * 0.03 + Math.sin(t * 7.1) * 0.02;
    material.uniforms.uOpacity.value = here * flicker;
    material.uniforms.uTime.value = t;
    haloMat.opacity = (tall ? 0.1 : 0.22) * here * flicker;
    halo.current.scale.set(w * 1.7, h * 1.35, 1);
  });

  return (
    <group ref={group}>
      <sprite ref={halo} material={haloMat} position={[0, 0, -0.3]} />
      <mesh ref={plane} material={material}>
        <planeGeometry args={[1, 1]} />
      </mesh>
    </group>
  );
}
