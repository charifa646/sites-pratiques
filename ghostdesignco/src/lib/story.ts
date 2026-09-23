/**
 * Scroll thresholds shared by the DOM and the WebGL world, so the words and
 * the 3D objects change state at exactly the same scroll position.
 * Values are fractions of a sticky section's progress (0 → 1).
 */
export const PROBLEM_STEPS = [0.2, 0.46, 0.72] as const; // comprendre, confiance, envie
export const PROBLEM_KICKER = 0.84;
