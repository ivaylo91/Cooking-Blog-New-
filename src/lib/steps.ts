/**
 * The fragment id of a method step ("stapka-3"), shared by the step list and
 * the recipe's JSON-LD so each HowToStep url lands on its step. Kept out of
 * the "use client" step list, so the server page can call it.
 */
export function stepAnchor(index: number): string {
  return `stapka-${index + 1}`;
}
