"use client";

import { useGLTF } from "@react-three/drei";
import { forwardRef, useImperativeHandle, useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { clone as cloneSkinned } from "three/examples/jsm/utils/SkeletonUtils.js";
import { HandRig, type HandPose } from "./handRig";
import { lacquer } from "./materials";

export type HandHandle = { rig: HandRig; root: THREE.Object3D; mesh: THREE.SkinnedMesh };

const MODEL = "/models/hand-left.glb";

type Props = JSX.IntrinsicElements["group"] & {
  pose: HandPose;
  material?: THREE.Material;
  /** Length (model metres) of a tapered forearm attached to the wrist; 0 = none. */
  forearm?: number;
};

/**
 * Glossy black sculpture hand. Model: WebXR Input Profiles "generic-hand"
 * (MIT licence, see /public/models/LICENSE-hand.md), re-posed with FK.
 */
export const Hand = forwardRef<HandHandle, Props>(function Hand(
  { pose, material, forearm = 0, ...group },
  ref,
) {
  const { scene } = useGLTF(MODEL);

  const handle = useMemo<HandHandle>(() => {
    const root = cloneSkinned(scene);
    let mesh: THREE.SkinnedMesh | null = null;
    root.traverse((o) => {
      if ((o as THREE.SkinnedMesh).isSkinnedMesh) mesh = o as THREE.SkinnedMesh;
    });
    if (!mesh) throw new Error("hand model: skinned mesh missing");
    const m = mesh as THREE.SkinnedMesh;
    const mat = material ?? lacquer();
    m.material = mat;
    // Skinned bounds are computed in bind pose; posed fingers can leave them.
    m.frustumCulled = false;
    const rig = new HandRig(root);

    if (forearm > 0) {
      // Elliptical tapered tube along the wrist's +Z (away from the fingers).
      const g = new THREE.CylinderGeometry(0.8, 1, 1, 40, 1, false);
      g.rotateX(Math.PI / 2);
      g.translate(0, 0, 0.5);
      const arm = new THREE.Mesh(g, mat);
      arm.scale.set(0.0265, 0.0185, forearm);
      arm.position.set(0.001, -0.002, -0.012);
      arm.frustumCulled = false;
      rig.bones.get("wrist")?.add(arm);
    }
    return { root, rig, mesh: m };
  }, [scene, material, forearm]);

  useImperativeHandle(ref, () => handle, [handle]);

  useLayoutEffect(() => {
    handle.rig.apply(pose);
  }, [handle, pose]);

  return (
    <group {...group}>
      <primitive object={handle.root} />
    </group>
  );
});

useGLTF.preload(MODEL);
