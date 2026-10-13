/**
 * Progress through the recipe itself, not the whole page: driven by a view
 * timeline on one element, so the bar reads full at the last step rather than
 * counting the related recipes, newsletter and comments below it.
 *
 * Pure CSS (`.reading-progress` in globals.css): the browser runs it on the
 * compositor with no scroll listener. Browsers without scroll-driven
 * animations simply don't show the bar.
 */
export function ReadingProgressBar() {
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-1 print:hidden" aria-hidden="true">
      <div className="reading-progress h-full bg-accent" />
    </div>
  );
}
