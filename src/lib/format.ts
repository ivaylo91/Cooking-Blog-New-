/** "1 рецепта", "2 рецепти": Bulgarian takes the singular only for one. */
export function recipeCount(n: number): string {
  return n === 1 ? "1 рецепта" : `${n} рецепти`;
}
