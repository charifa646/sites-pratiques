import * as THREE from "three";

/**
 * Forward-kinematics rig for the WebXR "generic-hand" model (MIT, Amazon).
 * The glTF joints are all siblings under the armature (WebXR poses every
 * joint independently), so the finger hierarchy is rebuilt here: each joint
 * keeps its rest transform relative to the previous joint of its chain and a
 * local rotation is applied on top. Joint space follows the WebXR spec:
 * -Z points along the bone towards the tip, +Y is the back of the hand.
 */

export type FingerName = "thumb" | "index" | "middle" | "ring" | "pinky";

/** [flex, spread, twist] per joint, radians. Negative flex curls towards the palm. */
export type JointRot = [number, number, number];

export type HandPose = {
  wrist?: JointRot;
} & Record<FingerName, JointRot[]>;

export const CHAINS: Record<FingerName, string[]> = {
  thumb: ["thumb-metacarpal", "thumb-phalanx-proximal", "thumb-phalanx-distal", "thumb-tip"],
  index: [
    "index-finger-metacarpal",
    "index-finger-phalanx-proximal",
    "index-finger-phalanx-intermediate",
    "index-finger-phalanx-distal",
    "index-finger-tip",
  ],
  middle: [
    "middle-finger-metacarpal",
    "middle-finger-phalanx-proximal",
    "middle-finger-phalanx-intermediate",
    "middle-finger-phalanx-distal",
    "middle-finger-tip",
  ],
  ring: [
    "ring-finger-metacarpal",
    "ring-finger-phalanx-proximal",
    "ring-finger-phalanx-intermediate",
    "ring-finger-phalanx-distal",
    "ring-finger-tip",
  ],
  pinky: [
    "pinky-finger-metacarpal",
    "pinky-finger-phalanx-proximal",
    "pinky-finger-phalanx-intermediate",
    "pinky-finger-phalanx-distal",
    "pinky-finger-tip",
  ],
};

const FINGERS = Object.keys(CHAINS) as FingerName[];

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const _s = new THREE.Vector3();

function rotation(r: JointRot | undefined, out: THREE.Matrix4) {
  if (!r) return out.identity();
  _e.set(r[0], r[1], r[2], "XYZ");
  return out.makeRotationFromQuaternion(_q.setFromEuler(_e));
}

export class HandRig {
  readonly bones = new Map<string, THREE.Bone>();
  private rest = new Map<string, THREE.Matrix4>();
  private rel = new Map<string, THREE.Matrix4>();
  private world = new Map<string, THREE.Matrix4>();

  constructor(root: THREE.Object3D) {
    root.traverse((o) => {
      if ((o as THREE.Bone).isBone) this.bones.set(o.name, o as THREE.Bone);
    });
    const wrist = this.bones.get("wrist");
    if (!wrist) throw new Error("hand rig: wrist joint missing");
    for (const [name, b] of this.bones) {
      this.rest.set(name, new THREE.Matrix4().compose(b.position, b.quaternion, new THREE.Vector3(1, 1, 1)));
      this.world.set(name, new THREE.Matrix4());
    }
    const restWrist = this.rest.get("wrist")!;
    for (const f of FINGERS) {
      let parent = restWrist;
      for (const name of CHAINS[f]) {
        const r = this.rest.get(name)!;
        this.rel.set(name, new THREE.Matrix4().copy(parent).invert().multiply(r));
        parent = r;
      }
    }
  }

  /** Rest-space position of a joint after the last `apply` (armature space). */
  joint(name: string, target = new THREE.Vector3()) {
    const b = this.bones.get(name);
    return b ? target.copy(b.position) : target.set(0, 0, 0);
  }

  apply(pose: HandPose) {
    const W = this.world.get("wrist")!;
    W.copy(this.rest.get("wrist")!).multiply(rotation(pose.wrist, _m));
    this.set("wrist", W);
    for (const f of FINGERS) {
      const chain = CHAINS[f];
      let parent = W;
      for (let k = 0; k < chain.length; k++) {
        const name = chain[k];
        const M = this.world.get(name)!;
        M.copy(parent).multiply(this.rel.get(name)!);
        if (k < chain.length - 1) M.multiply(rotation(pose[f][k], _m));
        this.set(name, M);
        parent = M;
      }
    }
  }

  private set(name: string, M: THREE.Matrix4) {
    const b = this.bones.get(name);
    if (b) M.decompose(b.position, b.quaternion, _s);
  }
}

/** Linear blend of two poses (angles are small, Euler lerp is fine). */
export function mixPose(a: HandPose, b: HandPose, t: number, out: HandPose): HandPose {
  const lerp3 = (x: JointRot | undefined, y: JointRot | undefined, o: JointRot | undefined): JointRot => {
    const xa = x ?? [0, 0, 0];
    const ya = y ?? [0, 0, 0];
    const r: JointRot = o ?? [0, 0, 0];
    r[0] = xa[0] + (ya[0] - xa[0]) * t;
    r[1] = xa[1] + (ya[1] - xa[1]) * t;
    r[2] = xa[2] + (ya[2] - xa[2]) * t;
    return r;
  };
  out.wrist = lerp3(a.wrist, b.wrist, out.wrist);
  for (const f of FINGERS) {
    const n = Math.max(a[f].length, b[f].length);
    if (!out[f]) out[f] = [];
    for (let k = 0; k < n; k++) out[f][k] = lerp3(a[f][k], b[f][k], out[f][k]);
  }
  return out;
}

export const clonePose = (p: HandPose): HandPose => JSON.parse(JSON.stringify(p));
