import { createContext, useContext, useEffect, useState } from "react";
import * as THREE from "three";
import { PALETTES, type WorldPalette } from "./palette";

/** Rendering tier, layout and colours of the world, shared by every piece of it. */
export type WorldFlags = { hi: boolean; tall: boolean; reduced: boolean; palette: WorldPalette };
export const WorldCtx = createContext<WorldFlags>({ hi: false, tall: false, reduced: false, palette: PALETTES.night });
export const useWorld = () => useContext(WorldCtx);

/** Acid green in linear space, for shaders. */
export const ACID_LIN = new THREE.Color("#b6ff3b");

/** Soft radial sprite, drawn once. */
export function glowTexture(inner = "rgba(182,255,59,0.55)", mid = "rgba(182,255,59,0.16)", outer = "rgba(182,255,59,0)") {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, inner);
  r.addColorStop(0.4, mid);
  r.addColorStop(1, outer);
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/**
 * Unlit "screen" material for painted website textures: fog aware, with a
 * top-to-bottom reveal wipe (an acid scanline rides the edge) and a gain that
 * pushes bright parts past the bloom threshold when a screen "lights up".
 */
export function screenMaterial(map: THREE.Texture, opts: { reveal?: number; gain?: number; opacity?: number } = {}) {
  const m = new THREE.ShaderMaterial({
    uniforms: {
      ...THREE.UniformsUtils.clone(THREE.UniformsLib.fog),
      map: { value: map },
      uReveal: { value: opts.reveal ?? 1 },
      uGain: { value: opts.gain ?? 1 },
      uOpacity: { value: opts.opacity ?? 1 },
      uAcid: { value: ACID_LIN.clone() },
      uUvScale: { value: new THREE.Vector4(1, 1, 0, 0) },
    },
    vertexShader: /* glsl */ `
      #include <fog_pars_vertex>
      uniform vec4 uUvScale;
      varying vec2 vUv;
      varying vec2 vLocal;
      void main() {
        vLocal = uv;
        vUv = uv * uUvScale.xy + uUvScale.zw;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }
    `,
    fragmentShader: /* glsl */ `
      #include <fog_pars_fragment>
      uniform sampler2D map;
      uniform float uReveal;
      uniform float uGain;
      uniform float uOpacity;
      uniform vec3 uAcid;
      varying vec2 vUv;
      varying vec2 vLocal;
      void main() {
        vec4 t = texture2D(map, vUv);
        float edge = 1.0 - uReveal * 1.06;
        float vis = smoothstep(edge - 0.003, edge + 0.003, vLocal.y);
        float live = step(0.002, uReveal) * step(uReveal, 0.998);
        float scan = exp(-abs(vLocal.y - edge) * 120.0) * live;
        vec3 col = t.rgb * uGain + uAcid * scan * 1.8;
        float a = max(t.a * vis, scan * 0.85) * uOpacity;
        if (a < 0.002) discard;
        gl_FragColor = vec4(col, a);
        #include <fog_fragment>
        #include <colorspace_fragment>
      }
    `,
    transparent: true,
    depthWrite: false,
    fog: true,
  });
  return m;
}

/** True once the page fonts are loaded, so text painted on canvases uses them. */
export function useFontsReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    const done = () => alive && setReady(true);
    if (!document.fonts) done();
    else document.fonts.ready.then(done, done);
    return () => {
      alive = false;
    };
  }, []);
  return ready;
}
