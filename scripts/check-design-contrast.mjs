import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Palette checks, not a substitute for a rendered accessibility audit.
const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
function tokens(selector) {
  const start = css.indexOf(`${selector} {`);
  assert.ok(start >= 0, `Missing theme: ${selector}`);
  const block = css.slice(start, css.indexOf("}", start));
  return Object.fromEntries([...block.matchAll(/--([\w-]+):\s*(#[\da-f]{6})\s*;/gi)].map((m) => [m[1], m[2]]));
}
function luminance(hex) {
  assert.match(hex ?? "", /^#[\da-f]{6}$/i, "Expected an opaque palette colour");
  const rgb = [1, 3, 5].map((offset) => {
    const channel = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

const base = tokens(":root");
const themes = {
  light: base,
  "system dark": { ...base, ...tokens(':root:not([data-theme="light"])') },
  "selected dark": { ...base, ...tokens(':root[data-theme="dark"]') },
};
const surfaces = ["background", "surface", "surface-muted", "peach", "sage", "butter", "rose", "wheat", "olive", "sky"];
const textPairs = [
  ...surfaces.flatMap((bg) => ["foreground", "muted-foreground", "link"].map((fg) => [fg, bg])),
  ["accent-foreground", "accent"],
  ["accent-foreground", "accent-strong"],
  ["on-garden", "garden"],
  ["on-garden-muted", "garden"],
  ["on-ember", "ember"],
  ["on-ember-muted", "ember"],
  ["foreground", "field"],
  ["placeholder", "field"],
  ["secondary", "butter"],
  ["destructive-strong", "butter"],
];
const controlPairs = [
  ["field-border", "field"],
  ...surfaces.map((bg) => ["accent", bg]),
  ["on-garden", "garden"],
  ["on-ember", "ember"],
];
let failures = 0;
for (const [name, palette] of Object.entries(themes)) {
  let lowestText = Infinity;
  for (const [pairs, minimum] of [[textPairs, 4.5], [controlPairs, 3]]) {
    for (const [foreground, background] of pairs) {
      const ratio = contrast(palette[foreground], palette[background]);
      if (minimum === 4.5) lowestText = Math.min(lowestText, ratio);
      if (ratio < minimum) {
        failures++;
        console.error(`${name}: ${foreground} on ${background}: ${ratio.toFixed(2)}:1, needs ${minimum}:1`);
      }
    }
  }
  console.log(`${name}: ${textPairs.length} text pairs, ${controlPairs.length} control/focus pairs; lowest text contrast ${lowestText.toFixed(2)}:1`);
}
assert.equal(failures, 0, `${failures} contrast checks failed`);
