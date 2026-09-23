import * as THREE from "three";

/**
 * The guide's shape, shared by the 3D site and the V2 companion: a lathed
 * bell with side "arms" and a scalloped hem. The shader patch ripples the hem
 * (harder when the scroll is fast) and adds an acid fresnel rim.
 */

export function ghostGeometry() {
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

export type GhostUniforms = { uTime: { value: number }; uFlow: { value: number }; uRim: { value: THREE.Color } };

/** Hem waves + fresnel rim, chained after any existing shader patch. */
export function patchGhost(m: THREE.Material, uniforms: GhostUniforms) {
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
