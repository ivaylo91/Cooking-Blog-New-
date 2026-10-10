/** Units you count out whole: half an onion is real, a third of one is not. */
const COUNTABLE = new Set([
  "бр",
  "скилидка",
  "скилидки",
  "глава",
  "глави",
  "пакетче",
  "пакетчета",
  "кутия",
  "кутии",
]);
const SPOONS = new Set(["с.л.", "ч.л."]);
const MASS = new Set(["г", "мл"]);

const FRACTIONS: Record<number, string> = { 0.25: "¼", 0.5: "½", 0.75: "¾" };

const decimal = (value: number) =>
  value.toFixed(1).replace(/\.0$/, "").replace(".", ",");

/**
 * Halves and quarters print as true fractions, the way a recipe is written by
 * hand: "1½" reads in one glance from the stove, "1,5" takes a second look.
 */
function fraction(value: number): string {
  const whole = Math.floor(value);
  const rest = Math.round((value - whole) * 4) / 4;
  const glyph = FRACTIONS[rest];
  if (!glyph) return String(whole + rest);
  return whole === 0 ? glyph : `${whole}${glyph}`;
}

const toHalves = (value: number, min: number) =>
  fraction(Math.max(min, Math.round(value * 2) / 2));

/**
 * Scaled quantities have to stay cookable. Plain rounding turns 6→8 portions
 * into "1,33 бр лук" and "1333,33 г картофи", which no recipe has ever said,
 * so each family of units rounds the way a cook would write it.
 */
export function formatAmount(amount: number, unit: string): { amount: string; unit: string } {
  if (COUNTABLE.has(unit)) {
    return { amount: toHalves(amount, 1), unit };
  }

  if (SPOONS.has(unit)) {
    return { amount: toHalves(amount, 0.5), unit };
  }

  if (MASS.has(unit)) {
    // Past a kilo or a litre, switch unit rather than print four digits.
    if (amount >= 1000) {
      return { amount: decimal(amount / 1000), unit: unit === "г" ? "кг" : "л" };
    }
    const step = amount < 100 ? 5 : 10;
    return { amount: String(Math.max(step, Math.round(amount / step) * step)), unit };
  }

  // Unknown unit: keep it coarse rather than inventing precision.
  return { amount: toHalves(amount, 0.5), unit };
}

/** "1½ бр", "700 г", or just the unit when the recipe gives no amount. */
export function formatQuantity(amount: number | null, unit: string, multiplier = 1): string {
  if (amount == null) return unit;
  const scaled = formatAmount(amount * multiplier, unit);
  return `${scaled.amount} ${scaled.unit}`.trim();
}
