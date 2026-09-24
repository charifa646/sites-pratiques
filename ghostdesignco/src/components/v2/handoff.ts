/**
 * The hero's ghost and the companion are one character in two canvases.
 * While the hero holds it, the hero scene writes where the ghost is on screen
 * (CSS px, centre) and the companion stays hidden; once the hero lets go, the
 * companion appears at that very spot and carries on down the page.
 */
export const heroGhost = { active: false, x: 0, y: 0, size: 0 };
