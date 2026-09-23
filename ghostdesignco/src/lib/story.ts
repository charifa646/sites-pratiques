/**
 * Scroll thresholds shared by the DOM and the WebGL world, so the words and
 * the 3D objects change state at exactly the same scroll position.
 * Values are fractions of a sticky section's progress (0 → 1).
 */
export const PROBLEM_STEPS = [0.2, 0.46, 0.72] as const; // comprendre, confiance, envie
export const PROBLEM_KICKER = 0.84;

export const METHOD_STEPS = [0.12, 0.42, 0.72] as const; // échange, création, mise en ligne

/** Which project of the gallery is in focus for a given progress (last slot = "le prochain"). */
export const workIndex = (progress: number, count: number) => Math.min(count, Math.floor(progress * (count + 1)));
