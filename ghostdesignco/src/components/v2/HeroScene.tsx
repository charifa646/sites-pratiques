"use client";

import { Environment, Lightformer, MeshTransmissionMaterial, PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Component, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import * as THREE from "three";
import { guideState } from "@/lib/guide";
import { scrollState } from "@/lib/scroll";
import { ghostGeometry, patchGhost, type GhostUniforms } from "@/components/three/ghostShape";
import { heroGhost } from "./handoff";

/**
 * The V2 hero stage, "le fantôme derrière la vitre": the glass ghost in a pale
 * studio, in the middle of the screen, rising out of the mirror floor of the
 * 3D site (its grid, its pool of light and its rings, in daylight) under a
 * soft acid light. The page lays its glass cards and its words over this
 * scene. It follows the pointer; on scroll it rises and hands over to the
 * page companion. As on the 3D site, computers get the full glass and a real
 * reflection; phones and tablets a light version that looks the same.
 */

export type Tier = "hi" | "lo";

const PAPER = "#F4F3EE";
const easeOut = (t: number) => 1 - Math.pow(1 - THREE.MathUtils.clamp(t, 0, 1), 3);
const smooth = (a: number, b: number, v: number) => THREE.MathUtils.smoothstep(v, a, b);

// silhouette bounds in the ghost's own space (arms and hem tails included)
const BOUNDS = { x: 1.2, bottom: -1.3, top: 1.62 };
// how high the hem floats over the mirror
const HOVER = 0.3;

/** Centred, the hem just above the mirror; kept inside the width on tall screens. */
function layoutFor(width: number, height: number, visibleW: number) {
  const s = width / height >= 1 ? 1.1 : Math.min(0.89, visibleW / 3);
  return { x: 0, y: HOVER - BOUNDS.bottom * s, s };
}

/**
 * For the light version's reflection: fades what is drawn below the floor
 * as it goes deeper (uDeep, world units), like a satin mirror.
 */
function fadeBelow(m: THREE.Material, uniforms: { uDeep: { value: number } }, key: string) {
  const prev = m.onBeforeCompile;
  m.onBeforeCompile = (shader, renderer) => {
    prev?.call(m, shader, renderer);
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying float vMirY;")
      .replace("#include <project_vertex>", "#include <project_vertex>\nvMirY = (modelMatrix * vec4(transformed, 1.0)).y;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform float uDeep;\nvarying float vMirY;")
      .replace("#include <opaque_fragment>", "#include <opaque_fragment>\ngl_FragColor.a *= smoothstep(-uDeep, 0.0, vMirY);");
  };
  m.customProgramCacheKey = () => key;
  m.needsUpdate = true;
}

/** A soft acid light behind the ghost, on the paper and in the mirror. */
function Halo({ ghost }: { ghost: RefObject<THREE.Group> }) {
  const sprite = useRef<THREE.Sprite>(null!);
  const mat = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    const r = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    r.addColorStop(0, "rgba(200,255,96,0.9)");
    r.addColorStop(0.3, "rgba(186,255,64,0.5)");
    r.addColorStop(0.62, "rgba(182,255,59,0.16)");
    r.addColorStop(1, "rgba(182,255,59,0)");
    g.fillStyle = r;
    g.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, opacity: 0, fog: false });
  }, []);
  useFrame((_, delta) => {
    const g = ghost.current;
    if (!g) return;
    const s = g.scale.x;
    sprite.current.position.set(g.position.x, g.position.y + 0.1 * s, g.position.z - 2.6);
    sprite.current.scale.setScalar(9.5 * s);
    mat.opacity = THREE.MathUtils.damp(mat.opacity, g.visible ? 0.9 : 0, 3, Math.min(delta, 0.05));
  });
  return <sprite ref={sprite} material={mat} />;
}

/**
 * The mirror floor of the 3D site, in daylight: paper that meets the sky at
 * the horizon, the blueprint grid, a pool of acid light under the ghost with
 * slow rings (strong while it comes through), and its reflection. Computers
 * (hi) render the scene a second time from a camera mirrored under the floor,
 * at half size, and the shader softens it with a ring of taps and ripples it.
 * Phones and tablets (lo) skip that render: the ghost is drawn upside down
 * under the floor instead (see Ghost).
 */
const FLOOR_W = 60;
const FLOOR_L = 60;
const FLOOR_Z = -20;

function MirrorFloor({ tier, reduced, ghost }: { tier: Tier; reduced: boolean; ghost: RefObject<THREE.Group> }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const mesh = useRef<THREE.Mesh>(null!);
  const hi = tier === "hi";

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
    target.setSize(w, Math.round((w * size.height) / size.width));
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
          uRise: { value: 1 },
          uShow: { value: 0 },
          uPaper: { value: new THREE.Color(PAPER) },
          uInk: { value: new THREE.Color("#0c0c0d") },
          uAcid: { value: new THREE.Color("#b6ff3b") },
          uAcidDeep: { value: new THREE.Color("#7ed321") },
          uFogNear: { value: 9 },
          uFogFar: { value: 24 },
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
          uniform float uRise;
          uniform float uShow;
          uniform vec3 uPaper;
          uniform vec3 uInk;
          uniform vec3 uAcid;
          uniform vec3 uAcidDeep;
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
            vec3 V = normalize(uCam - vWorld);
            float F = 0.05 + 0.95 * pow(1.0 - clamp(V.y, 0.0, 1.0), 5.0);

            // paper, a shade deeper towards the viewer: it reads as a floor
            vec3 col = uPaper * (0.975 + 0.025 * F);

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
              // a satin mirror, clearest under the ghost and fading away from it.
              // Pale glass on paper barely shows: what differs from the paper is
              // drawn out a little, and the floor dips a shade where it reflects.
              r = clamp(uPaper + (r - uPaper) * 1.7, 0.0, 1.0);
              float k = mix(0.5, 0.8, F) * (0.4 + 0.6 * exp(-max(d - 0.8, 0.0) * 0.22));
              col = mix(col * (1.0 - 0.05 * near), r, k);
            }

            // pool of light under the guide, with slow rings (strong while it comes through)
            float pool = exp(-d * d * 0.3);
            float rings = smoothstep(0.1, 0.0, abs(fract(d * 0.42 - uTime * 0.22) - 0.5)) * near;
            col = mix(col, uAcid, clamp(pool * 0.2 + rings * (0.09 + uRise * 0.4), 0.0, 1.0) * uShow);

            // blueprint grid: minor every unit, major every five
            float side = 1.0 - smoothstep(9.0, 18.0, abs(xz.x));
            float g = grid(xz, 1.0, 1.0) * 0.055 + grid(xz, 5.0, 1.3) * 0.1;
            col = mix(col, mix(uInk, uAcidDeep, near * uShow * 0.85), g * side * (0.6 + 0.4 * F));

            float fog = smoothstep(uFogNear, uFogFar, vDepth);
            gl_FragColor = vec4(mix(col, uPaper, fog), 1.0);
            #include <colorspace_fragment>
          }
        `,
      }),
    [target],
  );
  useEffect(() => () => material.dispose(), [material]);

  const bias = useMemo(() => new THREE.Matrix4().set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const u = material.uniforms;
    const g = ghost.current;
    const dt = Math.min(delta, 0.05);
    u.uTime.value = reduced ? 0 : state.clock.elapsedTime;
    if (g) {
      u.uGhost.value.copy(g.position);
      u.uGhostScale.value = g.scale.x;
      // the rings run hard while the hem is still near the floor
      u.uRise.value = 1 - smooth(0.4, 2.0, g.position.y - HOVER * g.scale.x);
      u.uShow.value = THREE.MathUtils.damp(u.uShow.value, g.visible ? 1 : 0, 3, dt);
    }
    u.uCam.value.copy(camera.position);
    const fog = scene.fog as THREE.Fog | null;
    if (fog) {
      u.uFogNear.value = fog.near;
      u.uFogFar.value = fog.far;
    }
    u.uHasRefl.value = hi ? 1 : 0;
    if (!hi) return;

    // camera mirrored across the floor plane (y = 0)
    const cam = camera as THREE.PerspectiveCamera;
    virtualCam.position.set(cam.position.x, -cam.position.y, cam.position.z);
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
    <mesh ref={mesh} material={material} rotation-x={-Math.PI / 2} position={[0, 0, FLOOR_Z]}>
      <planeGeometry args={[FLOOR_W, FLOOR_L]} />
    </mesh>
  );
}

function Ghost({
  tier,
  reduced,
  progress,
  holder,
}: {
  tier: Tier;
  reduced: boolean;
  progress: RefObject<number>;
  holder: RefObject<THREE.Group>;
}) {
  const { camera, size, gl, viewport } = useThree();
  const group = useRef<THREE.Group>(null!);
  const body = useRef<THREE.Group>(null!);
  const eyes = useRef<THREE.Group>(null!);
  const mtm = useRef<THREE.Material>(null);
  const geo = useMemo(ghostGeometry, []);
  const uniforms = useMemo<GhostUniforms>(
    () => ({ uTime: { value: 0 }, uFlow: { value: 0 }, uRim: { value: new THREE.Color("#b6ff3b").multiplyScalar(1.1) } }),
    [],
  );
  const background = useMemo(() => new THREE.Color(PAPER), []);
  // cut at the floor while it rises through it
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const planes = useMemo(() => [plane], [plane]);
  useEffect(() => {
    gl.localClippingEnabled = true;
  }, [gl]);

  // light version: milky lime glass lit from within (on paper, a plain
  // translucent shell reads grey; its inner faces are left out for the same reason)
  const loMat = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#f4fbe8"),
      roughness: 0.18,
      transparent: true,
      opacity: 0.84,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      emissive: new THREE.Color("#b6ff3b"),
      emissiveIntensity: 0.42,
      envMapIntensity: 1.2,
      clippingPlanes: planes,
    });
    patchGhost(m, uniforms);
    return m;
  }, [uniforms, planes]);
  useLayoutEffect(() => {
    if (tier === "hi" && mtm.current) patchGhost(mtm.current, uniforms);
  }, [tier, uniforms]);

  const eyeGeo = useMemo(() => new THREE.SphereGeometry(0.1, 24, 16), []);
  const eyeMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({ color: "#030303", roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 2, clippingPlanes: planes }),
    [planes],
  );
  const eyeSpots = useMemo(() => {
    const r = 0.885;
    return [-0.3, 0.3].map((x) => {
      const z = Math.sqrt(r * r - x * x);
      const p = new THREE.Vector3(x, 0.96, z).multiplyScalar(1.012);
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(x, 0.12, z).normalize());
      return { p, q };
    });
  }, []);
  const core = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, "rgba(226,255,170,1)");
    r.addColorStop(0.4, "rgba(182,255,59,0.35)");
    r.addColorStop(1, "rgba(182,255,59,0)");
    g.fillStyle = r;
    g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return new THREE.SpriteMaterial({ map: t, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.7, clippingPlanes: planes });
  }, [planes]);

  // light version (phones, tablets): the reflection is the ghost itself, drawn
  // upside down under the floor and over it (no second render of the scene)
  const mGroup = useRef<THREE.Group>(null);
  const mBody = useRef<THREE.Group>(null);
  const mEyes = useRef<THREE.Group>(null);
  const below = useMemo(() => [new THREE.Plane(new THREE.Vector3(0, -1, 0), 0)], []);
  const deep = useMemo(() => ({ uDeep: { value: 3 } }), []);
  const mirrorMat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#f4fbe8"),
      roughness: 0.3,
      transparent: true,
      opacity: 0.5,
      emissive: new THREE.Color("#b6ff3b"),
      emissiveIntensity: 0.3,
      envMapIntensity: 1.1,
      depthTest: false,
      depthWrite: false,
      clippingPlanes: below,
    });
    patchGhost(m, uniforms);
    fadeBelow(m, deep, "ghost-mirror");
    return m;
  }, [uniforms, below, deep]);
  const mirrorEyeMat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      color: "#030303",
      roughness: 0.2,
      transparent: true,
      opacity: 0.42,
      depthTest: false,
      depthWrite: false,
      clippingPlanes: below,
    });
    fadeBelow(m, deep, "ghost-mirror-eye");
    return m;
  }, [below, deep]);

  const pointer = useRef({ x: 0, y: 0 });
  const born = useRef<number | null>(null);
  const blink = useRef({ next: 3, t: 0 });
  const corners = useMemo(() => Array.from({ length: 4 }, () => new THREE.Vector3()), []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useLayoutEffect(() => {
    (holder as { current: THREE.Group | null }).current = group.current;
  }, [holder]);

  // the glass sees what lies behind it; the eyes stay out of that pass
  useFrame(() => {
    if (tier === "hi") eyes.current.visible = false;
  }, -1);

  useFrame((state, delta) => {
    eyes.current.visible = true;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    if (born.current === null) born.current = t;
    const age = t - born.current;
    const L = layoutFor(size.width, size.height, viewport.width);

    // rise out of the floor while the cards settle, then float
    const rise = reduced ? 1 : easeOut((age - 0.25) / 1.7);
    const p = progress.current ?? 0;
    const leave = reduced ? 0 : smooth(0.02, 0.22, p);
    const bob = reduced ? 0 : Math.sin(t * 1.1) * 0.06 + Math.sin(t * 0.47) * 0.04;
    const below = -(BOUNDS.top + 0.2) * L.s;
    group.current.position.set(L.x, THREE.MathUtils.lerp(below, L.y, rise) + bob * rise + leave * 2.6, leave * 1.4);
    group.current.scale.setScalar(L.s * (1 - leave * 0.2));
    // the floor cuts it only while it comes through (a plane far below keeps everything)
    plane.constant = rise < 0.999 ? 0 : 50;

    // looks at the pointer
    const px = pointer.current.x;
    const py = pointer.current.y;
    // (a small turn: its eyes stay inside the clear pane in front of them)
    body.current.rotation.y = THREE.MathUtils.damp(body.current.rotation.y, px * 0.25, 3.5, dt);
    body.current.rotation.x = THREE.MathUtils.damp(body.current.rotation.x, py * 0.16 + (1 - rise) * 0.2, 4, dt);
    body.current.rotation.z = THREE.MathUtils.damp(body.current.rotation.z, Math.sin(t * 0.8) * 0.04 - leave * 0.2, 4, dt);

    uniforms.uTime.value = reduced ? 1.35 : t;
    uniforms.uFlow.value = THREE.MathUtils.damp(uniforms.uFlow.value, Math.min(3, (1 - rise) * 2 + Math.abs(scrollState.velocity) * 2), 4, dt);

    // blink
    const bl = blink.current;
    bl.next -= dt;
    if (bl.next <= 0) {
      bl.t = 0.16;
      bl.next = 2.5 + Math.random() * 4;
    }
    bl.t = Math.max(0, bl.t - dt);
    eyes.current.scale.y = 0.12 + 0.88 * (bl.t > 0 ? Math.abs(Math.cos((bl.t / 0.16) * Math.PI)) : 1);

    // the upside-down copy follows (light version)
    if (mGroup.current && mBody.current && mEyes.current) {
      mGroup.current.position.copy(group.current.position);
      mGroup.current.scale.copy(group.current.scale);
      mBody.current.rotation.copy(body.current.rotation);
      mEyes.current.scale.copy(eyes.current.scale);
      deep.uDeep.value = 2.2 * group.current.scale.x;
    }

    // screen box of the ghost: the tour bubble and the hand-over
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
    const box = gl.domElement.getBoundingClientRect();
    const inView = box.bottom > 80 && box.top < window.innerHeight;
    const held = inView && (reduced || p < 0.22);
    heroGhost.active = held;
    heroGhost.x = box.left + (minX + maxX) / 2;
    heroGhost.y = box.top + (minY + maxY) / 2;
    heroGhost.size = maxY - minY;
    group.current.visible = held;
    if (mGroup.current) mGroup.current.visible = held;
    if (held) {
      guideState.x = heroGhost.x;
      guideState.y = box.top + minY + (maxY - minY) * 0.08;
      guideState.visible = rise > 0.9;
    }
  });

  return (
    <>
      <group ref={group}>
        {/* the light inside (the light version glows by itself: this light would leave a glint on its face) */}
        {tier === "hi" && <pointLight color="#b6ff3b" intensity={6} distance={7} decay={2} position={[0, 0.3, 0.3]} />}
        <group ref={body}>
          {/* the glow inside: refracted by the full glass; the light version's glass glows on its own */}
          {tier === "hi" && <sprite material={core} scale={[1.45, 1.45, 1]} position={[0, 0.3, 0]} />}
          {tier === "hi" ? (
            <mesh geometry={geo}>
              <MeshTransmissionMaterial
                ref={mtm as never}
                background={background}
                clippingPlanes={planes}
                resolution={512}
                samples={8}
                backside={false}
                thickness={0.9}
                roughness={0.18}
                anisotropicBlur={0.06}
                chromaticAberration={0.035}
                distortion={0.12}
                distortionScale={0.3}
                temporalDistortion={reduced ? 0 : 0.02}
                ior={1.2}
                color="#ffffff"
                attenuationColor="#e4ffb8"
                attenuationDistance={4.5}
                clearcoat={1}
                clearcoatRoughness={0.16}
                envMapIntensity={1.4}
                emissive="#030701"
                side={THREE.DoubleSide}
              />
            </mesh>
          ) : (
            <mesh geometry={geo} material={loMat} />
          )}
          <group ref={eyes} position={[0, 0.96, 0]}>
            {eyeSpots.map((e, i) => (
              <mesh key={i} geometry={eyeGeo} material={eyeMat} position={[e.p.x, e.p.y - 0.96, e.p.z]} quaternion={e.q} scale={[0.85, 1.35, 0.32]} />
            ))}
          </group>
        </group>
      </group>
      {tier === "lo" && (
        <group scale={[1, -1, 1]}>
          <group ref={mGroup}>
            <group ref={mBody}>
              <mesh geometry={geo} material={mirrorMat} renderOrder={-2} />
              <group ref={mEyes} position={[0, 0.96, 0]}>
                {eyeSpots.map((e, i) => (
                  <mesh
                    key={i}
                    geometry={eyeGeo}
                    material={mirrorEyeMat}
                    position={[e.p.x, e.p.y - 0.96, e.p.z]}
                    quaternion={e.q}
                    scale={[0.85, 1.35, 0.32]}
                    renderOrder={-1}
                  />
                ))}
              </group>
            </group>
          </group>
        </group>
      )}
    </>
  );
}

/** Frames only while the hero is on screen. */
function Frameloop({ host }: { host: RefObject<HTMLElement> }) {
  const set = useThree((s) => s.setFrameloop);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => set(e.isIntersecting ? "always" : "never"), { rootMargin: "80px" });
    io.observe(el);
    return () => io.disconnect();
  }, [host, set]);
  return null;
}

/**
 * A low studio view, nearly level with the floor so the mirror shows. Wide
 * screens: the ghost fills the middle, from 13 % to 70 % of the height, its
 * reflection from 81 %. Tall screens: a little wider lens, looking a touch
 * down: the ghost from 13 % to 50 %, its reflection from 58 %.
 */
function Rig() {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const wide = size.width / size.height >= 1;
    cam.fov = wide ? 30 : 34;
    cam.position.set(0, wide ? 1.2 : 1.1, wide ? 10.5 : 11.5);
    cam.lookAt(0, wide ? 1.43 : 0.3, 0);
    cam.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

function Ready({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  useFrame(() => {
    frames.current += 1;
    if (frames.current === 3) onReady();
  });
  return null;
}

class Guard extends Component<{ children: ReactNode; onFail: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("[v2] hero scene disabled:", error);
    heroGhost.active = false;
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

// pixel density: capped, then lowered on the fly when frames drop (as on the 3D site)
const MAX_DPR: Record<Tier, number> = { hi: 1.5, lo: 1.5 };
const densityFor = (tier: Tier) => Math.min(window.devicePixelRatio || 1, MAX_DPR[tier]);

export default function HeroScene({
  host,
  progress,
  reduced,
  tier,
  onReady,
  onFail,
  onLow,
}: {
  host: RefObject<HTMLElement>;
  progress: RefObject<number>;
  reduced: boolean;
  tier: Tier;
  onReady: () => void;
  onFail: () => void;
  /** the device can't keep up: switch to the light materials */
  onLow: () => void;
}) {
  const ghost = useRef<THREE.Group>(null);
  const [dpr, setDpr] = useState(() => densityFor(tier));
  useEffect(
    () => () => {
      heroGhost.active = false;
    },
    [],
  );
  return (
    <Guard onFail={onFail}>
      <Canvas
        flat
        dpr={dpr}
        gl={{ alpha: false, antialias: true, powerPreference: "high-performance", stencil: false }}
        camera={{ fov: 30, position: [0, 1.2, 10.5] }}
        style={{ position: "absolute", inset: 0 }}
      >
        <PerformanceMonitor
          flipflops={3}
          onIncline={() => setDpr(densityFor(tier))}
          onDecline={() => setDpr((d) => Math.max(1, d - 0.25))}
          onFallback={() => {
            setDpr(1);
            onLow();
          }}
        />
        {/* a paper sky: the mirror reflects light, not a void */}
        <color attach="background" args={[PAPER]} />
        <Rig />
        <Frameloop host={host} />
        <fog attach="fog" args={[PAPER, 9, 24]} />
        <ambientLight intensity={0.4} />
        {/* a pale sky over the studio floor */}
        <hemisphereLight args={["#ffffff", "#e9e6de", 1.1]} />
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={3} position={[0, 5, 1]} rotation-x={Math.PI / 2} scale={[7, 1.4, 1]} />
          <Lightformer form="rect" intensity={2.4} position={[-5, 0.5, 2]} rotation-y={Math.PI / 2} scale={[0.9, 8, 1]} />
          <Lightformer form="rect" intensity={1.7} position={[5, 0.5, 2.5]} rotation-y={-Math.PI / 2} scale={[0.6, 8, 1]} />
          <Lightformer form="rect" intensity={1.8} position={[0, 1.5, -6]} scale={[5, 2.5, 1]} />
          <Lightformer form="ring" color="#b6ff3b" intensity={3} position={[3, 3, -3]} scale={2.2} />
        </Environment>
        {/* the ghost first: the floor's reflection pass then sees it as drawn this frame */}
        <Ghost tier={tier} reduced={reduced} progress={progress} holder={ghost} />
        <Halo ghost={ghost} />
        <MirrorFloor tier={tier} reduced={reduced} ghost={ghost} />
        <Ready onReady={onReady} />
      </Canvas>
    </Guard>
  );
}
