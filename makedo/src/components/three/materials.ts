import * as THREE from "three";

/** Lacquered black: the sculpture material of the mockup (hand, black strawberry, pedestal). */
export function lacquer(opts: Partial<THREE.MeshPhysicalMaterialParameters> = {}) {
  return new THREE.MeshPhysicalMaterial({
    color: "#070707",
    metalness: 0.2,
    roughness: 0.24,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    envMapIntensity: 1.5,
    ...opts,
  });
}

/** Faceted amber crystal (apple, orange strawberry). */
export function crystal(color: string, opts: Partial<THREE.MeshPhysicalMaterialParameters> = {}) {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0,
    roughness: 0.04,
    transmission: 0.82,
    thickness: 1.4,
    ior: 1.9,
    attenuationColor: new THREE.Color(color),
    attenuationDistance: 0.6,
    specularIntensity: 1,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    envMapIntensity: 2.2,
    flatShading: true,
    ...opts,
  });
}

export function chrome(opts: Partial<THREE.MeshPhysicalMaterialParameters> = {}) {
  return new THREE.MeshPhysicalMaterial({
    color: "#d9d9d9",
    metalness: 1,
    roughness: 0.18,
    envMapIntensity: 1.6,
    ...opts,
  });
}
