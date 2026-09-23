"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * Procedural studio environment (no HDR download): long softboxes give the
 * lacquered surfaces the sharp white streaks of the mockup renders; an
 * optional coloured card tints the reflections (orange / green accents).
 */
export function Studio({
  accent = "#f25722",
  accentIntensity = 2.2,
  accentPosition = [5, 2, -3] as [number, number, number],
  intensity = 1,
}: {
  accent?: string;
  accentIntensity?: number;
  accentPosition?: [number, number, number];
  intensity?: number;
}) {
  return (
    <Environment resolution={256} frames={1}>
      {/* key: overhead strip */}
      <Lightformer form="rect" intensity={3.2 * intensity} position={[0, 5, 1]} rotation-x={Math.PI / 2} scale={[7, 1.4, 1]} />
      {/* vertical strips left / right: the streaks along fingers and cylinders */}
      <Lightformer form="rect" intensity={2.6 * intensity} position={[-5, 0.5, 2]} rotation-y={Math.PI / 2} scale={[0.9, 8, 1]} />
      <Lightformer form="rect" intensity={1.8 * intensity} position={[5, 0.5, 2.5]} rotation-y={-Math.PI / 2} scale={[0.6, 8, 1]} />
      {/* rim from behind */}
      <Lightformer form="rect" intensity={2 * intensity} position={[0, 1.5, -6]} scale={[5, 2.5, 1]} />
      {/* weak front fill */}
      <Lightformer form="rect" intensity={0.35 * intensity} position={[0, 0, 7]} scale={[6, 4, 1]} />
      {/* colour accent */}
      <Lightformer form="ring" color={accent} intensity={accentIntensity} position={accentPosition} scale={2.2} />
    </Environment>
  );
}
