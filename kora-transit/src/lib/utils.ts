/**
 * Lightweight className combiner (no extra deps).
 * Filters out falsy values and joins the rest with a space.
 */
export function cn(
  ...inputs: Array<string | number | false | null | undefined>
): string {
  return inputs.filter(Boolean).join(" ");
}

/** Format a number with French-style non-breaking thousands separators. */
export function formatFr(value: number): string {
  return value.toLocaleString("fr-FR").replace(/ /g, " ");
}
