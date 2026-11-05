# Typography and colour contrast

Research and audit notes, 4 November 2026.

## Summary

- **Fonts are a good fit and lightly loaded.** Onest and Lora both ship full Cyrillic subsets. Next 16 self-hosts them, preloads only the Cyrillic and Latin files, and swaps with metric-adjusted fallbacks. Four preloaded files total 108,680 bytes. Loading Lora at weight 700 only would remove 26,612 bytes, because every Lora heading on the site is bold.
- **Every text pair passes WCAG AA in all three theme paths**, including about 30 pairs the contrast script does not check today (link on tomato wash, text on blended dark tints, the selected chip, the About button). The lowest text ratio is 4.81:1, the tomato-link "liked" label on the dark butter panel.
- **Four non-text failures.** The empty rating stars are 2.90:1 on butter in light mode, which fails 1.4.11 at AA. The recipe tab bar's "active" indicator is 1.14:1 against its track. The field focus state changes contrast by only 1.03:1, which fails 2.4.13 (AAA). The active nav pill is 1.24:1 against the header.
- **The reading type is sound.** It uses a 17px body at 1.6 line height, 14px minimum meta text, weights of 400 to 700 only, tabular figures where numbers line up, precomposed fractions, balanced headings, and short-word binding for Bulgarian.
- **Gaps are small.** Several text pills use fixed heights, which can overlap their text under a text-spacing override (1.4.12). Recipe descriptions still run past 65ch, as LAYOUT-RESEARCH #11 noted. The vw part of the heading clamps means headings reach only 1.5–1.7× at 200% desktop zoom.
- **APCA is a draft, not a standard.** As a secondary check, it shows that the evening kitchen's muted text and dark-mode links are perceptually weaker than their WCAG 2 ratios suggest.

## Brief

The brief was to research typography (fonts, type scale, readability) and colour contrast for a Bulgarian recipe blog that home cooks read on phones at arm's length, often at night, then audit the site against that research. The audit respects the owner's decisions in [DESIGN.md](DESIGN.md): the seven-size type scale (Type Hierarchy Rule), the warm palette, Lora + Onest, and turning off Lora's Bulgarian `locl` forms. It does not repeat [DESIGN-RESEARCH.md](DESIGN-RESEARCH.md) or [LAYOUT-RESEARCH.md](LAYOUT-RESEARCH.md). From LAYOUT-RESEARCH, the resume-banner shift, the focus `scroll-padding` and the short-screen unpinning have since been fixed (commits `9f159f3`, `aae8bd0`). Ratios were computed with the WCAG 2 relative-luminance formula, which is the same code as `scripts/check-design-contrast.mjs`. Translucent tokens were alpha-blended over the surface they actually sit on.

## 1. Fonts

### Suitability for Bulgarian

| Fact | Evidence |
| --- | --- |
| Onest: designers Dmitri Voloshin and Andrey Kudryavtsev; subsets include `cyrillic` and `cyrillic-ext`; one `wght` axis from 100 to 900; **no italic**. | [google/fonts Onest METADATA.pb](https://raw.githubusercontent.com/google/fonts/main/ofl/onest/METADATA.pb) |
| Lora: by Cyreal; subsets include `cyrillic`; `wght` from 400 to 700; italic exists but is not loaded here. Its changelog says "Expansion to GF Cyrillic Plus, Pro, and locl has been completed." | [google/fonts Lora METADATA.pb](https://raw.githubusercontent.com/google/fonts/main/ofl/lora/METADATA.pb), [cyrealtype/Lora-Cyrillic](https://github.com/cyrealtype/Lora-Cyrillic) |
| Measured in the built files (fontTools on `.next/static/media`): Lora's Cyrillic file has `locl` under `cyrl:BGR` and `SRB`. Onest's Cyrillic file has no GSUB features and no BGR language system. | Local inspection, 4 Nov 2026 |
| Both fonts have `tnum`, and both carry precomposed ¼ ½ ¾ in the Latin file. Onest x-height is 0.527 em and Lora's is 0.500 em. | Local inspection |

This confirms the owner's reasoning in `globals.css:231-234`. Only Lora would switch to Bulgarian shapes, so `"locl" 0` keeps headings and body text consistent. The quantities code prints only ¼, ½ and ¾ (`src/lib/quantities.ts:16`). Those glyphs sit in the preloaded Latin file, so ingredient rows never trigger the separate symbols subset. Nothing on the public site is set in italic, which matters because Onest has no italic and the browser would synthesise one.

### Loading in Next 16 (16.4.3)

From `node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md`:
- `display` defaults to `'swap'`, `preload` defaults to `true`, and `adjustFontFallback` defaults to `true` for Google fonts "to reduce Cumulative Layout Shift".
- `subsets` lists the files that are preloaded.
- Variable fonts need no `weight` option, and the docs recommend them "for the best performance and flexibility".
- A font called from the root layout "is preloaded on all routes".

`01-getting-started/13-fonts.md` adds that files are self-hosted, so "no requests are sent to Google".

`src/app/layout.tsx:11` and `:18` call `Onest` and `Lora` with `subsets: ["latin", "cyrillic"]` and nothing else. The build output in `.next/static/chunks/*.css` shows:

| Face | Preloaded files | Bytes | Not preloaded (loaded only when a character in their `unicode-range` appears) |
| --- | --- | --- | --- |
| Onest 100–900 | cyrillic, latin | 15,828 + 33,808 | cyrillic-ext, latin-ext, vietnamese, math, symbols |
| Lora 400–700 | cyrillic, latin | 21,252 + 37,792 | same five |
| **Total preloaded** | | **108,680** | |

Both subsets are needed even for all-Cyrillic text. The space, digits and punctuation („ “ – ·) live in the Latin file, and the Cyrillic file covers only U+0400–045F plus a few extras.

**Weights.** Onest is used at 400, 500, 600 and 700, so one variable file is the right choice. web.dev says variable fonts pay off for sites that "use (and need to use) a variety of font styles and weights", and are otherwise larger than a single static style ([web.dev](https://web.dev/articles/font-best-practices)). Lora is used only at 700: every `text-display/feature/section/heading/card` heading carries `font-bold`, as do the four `.font-heading` paragraphs. The Google Fonts CSS API serves Lora 700 at 11,388 bytes (Cyrillic) plus 21,044 bytes (Latin), against 59,044 bytes for the variable range. That is the only font saving worth making.

**Fallback metrics.** Next generates `Onest Fallback` from `local(Arial)` (size-adjust 105.2%) and `Lora Fallback` from `local(Times New Roman)` (115.2%). Chrome's font-fallback guidance notes that "neither of these fonts is available on Android (Roboto is the only system font on Android)". It recommends a second fallback face with `local("Roboto")` and its own overrides ([Chrome for Developers](https://developer.chrome.com/blog/font-fallbacks)). On Android, the device most readers use, the adjusted fallback therefore does nothing. If a font arrives after first paint, text reflows from unadjusted Roboto or Noto Serif. With 108 KB preloaded the swap usually lands before first paint, but this is the one CLS risk in the font setup. `display: 'optional'` would remove it at the cost of "the web font won't be used if it arrives late" ([web.dev](https://web.dev/articles/font-best-practices)). That trade is worse for a brand serif, so measure before changing anything.

### Hyphenation and short words

`keepShortWords()` (`src/lib/typography.ts`) ties the seven one-letter Bulgarian words to the next word. MDN says `hyphens: auto` works only when `lang` is set and "the appropriate hyphenation dictionary is available" ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/hyphens)). `lang="bg"` is set (`layout.tsx:55`), but I could not confirm from a primary source which browsers ship a Bulgarian dictionary. Leave hyphenation off. The column widths do not need it.

## 2. Type scale and readability

| Topic | Site | Guidance | Verdict |
| --- | --- | --- | --- |
| Body size | 17px (`globals.css:120`, `:215`) | Apple iOS default 17pt, minimum 11pt; "avoid Ultralight, Thin, and Light" ([Apple HIG typography](https://developer.apple.com/design/human-interface-guidelines/typography)) | Meets |
| Smallest text | 14px `small`, 400–600 weight | Apple minimum 11pt | Meets |
| Line height | Body 1.6, steps 1.625, small 1.45 | 1.4.8 (AAA): "at least space-and-a-half within paragraphs" ([W3C](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html)) | Meets for reading text. Small (1.45) is meta only. |
| Measure | Steps `max-w-[65ch]` (`RecipeSteps.tsx:76`); recipe description `max-w-2xl` (`recepti/[slug]/page.tsx:275`) | 1.4.8: "no more than 80 characters"; long lines are "a significant barrier" for some readers | Steps meet. The description is still LAYOUT-RESEARCH #11. |
| Headings | `text-wrap: balance` on h1–h3 (`globals.css:219-224`) | MDN: balance for "headings, captions"; Chromium limits it to six lines or fewer, with "negligible" cost; `pretty` "is intended for body copy" but is slower ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap)) | Meets. `pretty` is optional for steps. |
| Figures | `tabular-nums` on quantities, meta, counts, pagination | Fonts have `tnum` | Meets |
| Case | Sentence case only (DESIGN.md Sentence Case Rule) | | Meets |
| Text spacing | Pills use fixed `h-11` / `h-14` / `h-16` with `whitespace-nowrap` in places | 1.4.12 (AA): line height 1.5, paragraph spacing 2×, letter spacing 0.12em, word spacing 0.16em; failures are clipped or overlapping text, and an ellipsis is fine only "if the full text can still be accessed" ([W3C](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)) | Risk, needs a browser check |
| Resize | All sizes are rem. Headings use `clamp(rem, rem + vw, rem)`. | 1.4.4 (AA): resizable to 200%. F94 fails text that uses viewport units "as the primary method" ([W3C](https://www.w3.org/WAI/WCAG22/Techniques/failures/F94)). No `maximumScale` or `userScalable` is set. | Body meets. Headings are a grey area (see below). |

**Headings under zoom.** Calculated for a 1280px window: the display size is 60px at 100%. At 200% zoom the CSS viewport is 640px, so the clamp gives 47px, which is 94 device px or 1.57× the original. Feature reaches 1.47× and section 1.73×. Headings pass 2× only at about 300% zoom. F94 does not address mixed rem + vw clamps, and the rem floor and ceiling make this much better than pure vw. I have not counted it as a failure, but it is not clearly a pass either. Changing it means changing DESIGN.md's clamp values.

## 3. Contrast

WCAG thresholds: 4.5:1 for normal text, and 3:1 for large text (at least 24px, or about 18.5px bold) and for UI and focus graphics. Ratios must not be rounded up ("4.499:1 would not meet") ([1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)). Placeholder text counts as text. Disabled components are exempt ([1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)).

System dark and toggle-selected dark are identical: a diff of the two blocks in `globals.css:128-209` found no differing tokens. "Dark" below covers both. Note that `garden`, `on-garden*` and `on-ember*` have no evening value, so the author band keeps its light-mode green in dark mode.

### Text (4.5:1)

| Pair (fg on bg) | Where | Light | Dark | Script? |
| --- | --- | --- | --- | --- |
| ink on paper / surface / counter-tint / butter | body, cards, chips | 15.83 / 16.80 / 13.91 / 13.69 | 16.12 / 14.98 / 13.80 / 11.33 | yes |
| muted on paper / surface / counter-tint | meta, kbd hint, comment dates, inactive tab | 8.59 / 9.12 / 7.55 | 10.02 / 9.31 / 8.58 | yes |
| muted on peach / sage / butter / rose / wheat / olive / sky | card meta, descriptions on tints | 6.89 / 7.22 / 7.43 / 6.93 / **6.63** / 7.31 / 7.41 | 7.79 / 7.30 / **7.04** / 7.96 / 7.59 / 7.09 / 7.43 | yes |
| link on paper / surface / butter / sage / peach / sky | links on bands | 7.54 / 8.00 / 6.52 / 6.34 / 6.05 / 6.51 | 8.88 / 8.25 / 6.24 / 6.46 / 6.90 / 6.58 | yes |
| link on tomato wash, header (over surface) | `Header.tsx:33` | 6.47 | 6.33 | **no** |
| link on tomato wash, resume pill (over paper) | `RecipeSteps.tsx:71` | 6.47 | 6.92 | **no** |
| link on tomato wash, liked (over butter) | `LikeButton.tsx:71` | 6.47 | **4.81** | **no** |
| ink on tomato wash, running timer | `StepTimer.tsx:96` | 13.58 | 12.57 | **no** |
| ink / muted on wash at 70%, Cook Mode row | `CookMode.tsx:369,392` | 14.22 / 7.72 | 13.71 / 8.52 | **no** |
| on-tomato on tomato / deep tomato | buttons, badge, selection | 5.76 / 8.19 | 7.25 / 9.01 | yes |
| paper on ink: selected chip, current page | `RecipeFilters.tsx:31`, `Pagination.tsx:26` | 15.83 | 16.12 | **no** |
| on-garden / on-garden-muted on garden | author band | 8.72 / 7.44 | same | yes |
| garden on on-garden: About button | `page.tsx:153` | 8.72 | 8.72 | **no** |
| on-ember / on-ember-muted on ember | footer | 9.08 / 7.58 | 14.76 / 12.33 | yes |
| placeholder on field | all inputs | 5.50 | 6.09 | yes |
| herb green on butter / paper / herb wash | success messages, finished timer | 5.81 / 6.71 / 6.33 | 7.02 / 9.98 / 7.68 | butter only |
| deep error on butter / paper / surface | form errors, counter | 6.66 / 7.69 / 8.16 | 6.83 / 9.72 / 9.04 | butter only |
| *tomato used as text* on paper / butter | forbidden by the Link Tone Rule | 5.34 / 4.62 | 7.14 / 5.02 | no |
| white on tomato at 60% (pending button) | `styles.ts:13` | 2.77 | – | exempt (disabled) |

### Non-text (3:1)

| Pair | Where | Light | Dark | Result |
| --- | --- | --- | --- | --- |
| field border on field / sage / butter | `.field`, ingredient checkbox, newsletter | 5.58 / 4.35 / 4.47 | 4.16 / 3.26 / **3.14** | pass (dark butter has thin margin) |
| invalid border on field | `globals.css:305` | 6.47 | 6.20 | pass |
| focus ring (tomato) on paper / surface / tints | `globals.css:260-267` | 5.34 / 5.66 / 4.12–4.69 | 5.02–7.14 | pass |
| cream ring on garden / ember | `globals.css:515-523` | 8.72 / 9.08 | 8.72 / 14.76 | pass (tomato on garden would be 1.61) |
| checked box on sage; tick on tomato | `RecipeIngredients.tsx:100` | 4.48; 5.76 | 5.20; 7.25 | pass |
| filled star (tomato) on butter | `RatingStars.tsx:98` | 4.62 | 5.02 | pass |
| **empty star**, muted at 60% on butter | `RatingStars.tsx:98` | **2.90 FAIL** | 3.56 | **AA fail in light** |
| **tab indicator** paper on counter-tint | `RecipeTabs.tsx:79` | **1.14 FAIL** | **1.17 FAIL** | state indicator fails |
| **active nav pill**, wash on surface | `Header.tsx:33` | **1.24** | **1.30** | weak state cue |
| unselected vs selected chip | `RecipeFilters.tsx:31-32` | 13.91 | 13.80 | pass |
| done vs resting step circle; done vs to-do progress | `RecipeSteps.tsx:62`, `CookMode.tsx:278` | 4.69 | 6.11 | pass |
| to-do progress segment on paper | `CookMode.tsx:278` | 1.14 | 1.17 | the text "Стъпка N от M" carries the same information |
| **2.4.13 field focus:** tomato border vs resting border | `globals.css:298-302` | **1.03** | **1.60** | AAA fail |
| **2.4.13 field focus:** wash halo vs paper / butter | same | **1.17 / 1.01** | **1.28 / 1.30** | AAA fail |
| link vs ink | inline links | 2.10 | 1.82 | fine, because inline links are underlined (`CommentForm.tsx:127`, `poveritelnost`) |

### The field focus problem

1.4.11 (AA) asks the focus indicator to contrast with what is next to it. The tomato border does that, at 5.76:1 on white. 2.4.13 (AAA) also asks for "a contrast ratio of at least 3:1 between the same pixels in the focused and unfocused states", over an area at least a 2px perimeter ([W3C](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)). Brown `#82614b` and tomato `#b9381b` have almost the same luminance (1.03:1). The 4px halo barely differs from the band behind it. So on focus, a field changes hue and nothing else. Someone with red-green colour blindness sees almost no change. The fix keeps the look: add a 2px solid tomato ring flush outside the border, under the existing halo. Its pixels then change from the band colour to tomato, at 4.1–5.3:1.

### APCA (secondary, not a standard)

The WCAG 3 Working Draft of 10 September 2026 says "It is inappropriate to cite this document as other than a work in progress" and "The contrast algorithm used in WCAG 3 is yet to be determined" ([W3C](https://www.w3.org/TR/wcag-3.0/)). APCA describes itself as "the candidate contrast method for the future WCAG 3", with Lc 75 as "the minimum level for columns of body text", Lc 60 for other content text and Lc 30 for placeholders ([APCA in a Nutshell](https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell.html)). It is not a legal or WCAG requirement. Calculated with the APCA-W3 0.1.9 constants:

| Pair | WCAG 2 | APCA Lc |
| --- | --- | --- |
| Light: ink on paper / muted on paper / muted on wheat / link on peach | 15.83 / 8.59 / 6.63 / 6.05 | 98.6 / 86.0 / 69.7 / 67.8 |
| Dark: ink on ground / muted on ground / muted on butter / link on butter | 16.12 / 10.02 / 7.04 / 6.24 | 97.0 / 67.2 / 62.5 / 56.5 |
| Dark: `#121212` on tomato button | 7.25 | 53.3 |

The light theme's muted text reads as strongly as its ratio suggests. The evening kitchen's muted descriptions (Lc 62–67) and links (Lc 56–58) fall below APCA's body-text level, although they pass WCAG 2 with room to spare. Apple's dark-mode guidance points the same way: "no lower than 4.5:1… strive for a contrast ratio of 7:1, especially in small text" ([Apple HIG dark mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode)). Every dark text pair meets 4.5:1. Dark link on tints (6.24–6.90) and light muted text on peach, rose and wheat (6.63–6.93) fall short of 7:1, which is also the AAA threshold in 1.4.6 ([W3C](https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html)).

## 4. Audit

### Already meets best practice

| Finding | Where | Rule or source |
| --- | --- | --- |
| Self-hosted variable Onest, Cyrillic and Latin preloaded, `swap`, metric fallbacks | `layout.tsx:11-21`, build CSS | Next font docs; web.dev font best practices |
| Standard Lora shapes, verified as the only Bulgarian `locl` source | `globals.css:227-235` | DESIGN.md Typography (owner decision) |
| 17px body, 1.6 line height, 14px floor, no light weights | `globals.css:120-123`, `:211-217` | Apple HIG typography; WCAG 1.4.8 |
| Seven named sizes only, in rem, no uppercase | `globals.css:110-123` | DESIGN.md Type Hierarchy and Sentence Case rules |
| Steps capped at 65ch | `RecipeSteps.tsx:76` | WCAG 1.4.8 |
| Balanced headings | `globals.css:219-224` | MDN text-wrap |
| Tabular, cookable quantities; precomposed fractions in the preloaded file | `RecipeIngredients.tsx:105-109`, `quantities.ts:16` | DESIGN.md Ingredient list |
| One-letter words bound with NBSP | `typography.ts` | DESIGN.md Bulgarian typesetting |
| All text pairs at 4.5:1 or more in three theme paths; placeholders 5.5:1 | `globals.css` tokens | WCAG 1.4.3 |
| Field borders 3:1 or more everywhere; checkbox state 4.48:1 or more | `globals.css:36-40`, `:274-307` | WCAG 1.4.11 |
| 2px offset focus ring at 4.1:1 or more on every band, swapped to cream on garden and ember | `globals.css:260-267`, `:515-523` | WCAG 2.4.7, 1.4.11; DESIGN.md Buttons |
| Inline links underlined; Link Tone Rule followed, with no text-coloured `text-accent` on the public site | `CommentForm.tsx:127`, `SubscribeForm.tsx:112` | WCAG 1.4.1; DESIGN.md Link Tone Rule |
| Doodles only behind opaque panels | `Band.tsx`, `page.tsx:59` | DESIGN.md Doodle band |
| Dark mode designed with brighter foregrounds, not inverted | `globals.css:128-209` | Apple HIG dark mode ("aren't necessarily inversions") |

### Prioritised recommendations

**High**

1. **Empty rating stars fail 1.4.11 in light mode (2.90:1).** The outline star is the only visual of each rating button, so it is "visual information required to identify user interface components" ([W3C 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)). In `src/components/RatingStars.tsx:98`, change `text-muted-foreground/60` to `text-muted-foreground`. That gives 7.43:1 light and 7.04:1 dark, with the same hue. No conflict.

**Medium**

2. **Give field focus a real contrast change.** In `src/app/globals.css:298-302`, set `box-shadow: 0 0 0 2px var(--accent), 0 0 0 6px var(--accent-soft);`. Do the same for `:user-invalid` with `var(--destructive)` and `var(--destructive-soft)`. The ring pixels then change by 4.1–5.3:1 light and 5.0–7.1:1 dark, which passes 2.4.13 ([W3C](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)), and the tomato look stays. **Flag:** DESIGN.md "Inputs / Fields: Focus" describes "tomato border plus a 4px tomato-wash halo". Update that line.
3. **Make the recipe tab bar's active half visible.** The indicator is 1.14:1 against its track, and the active text differs from inactive by only 1.84:1. 1.4.11 covers "any visual information necessary to indicate state, such as whether a component is selected". In `src/components/RecipeTabs.tsx:79`, change the indicator to `bg-foreground`. At `:88-91`, give the active label `text-background` (13.91:1 light, 13.80:1 dark). This matches DESIGN.md's selected-chip inversion, so there is no conflict. The Segmented control motion stays the same.
4. **Let text pills grow instead of overlapping.** 1.4.12 fails on overlapping or clipped text ([W3C](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)). Swap fixed heights for minimums on controls that hold text: `primaryPill` `h-14` to `min-h-14 py-2` (`src/components/styles.ts:7`), the chip `h-11` to `min-h-11` (`RecipeFilters.tsx:30`), and the same for `StepTimer.tsx:81`, `ShareButtons.tsx:93`, `CookMode.tsx:237,433` and the header nav links (`Header.tsx:32`). Then test at 320px with a text-spacing bookmarklet. Target sizes stay at 44/56/64px minimum, so there is no conflict.
5. **Load Lora at weight 700 only.** In `src/app/layout.tsx:18`, add `weight: "700"`. That saves 26,612 of the 108,680 preloaded bytes on every route. The Next docs allow a single weight string for Google fonts (`node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md`, "weight"). No conflict, because Lora is already bold-only, but any future non-bold Lora heading would need the variable font back.
6. **Check font-swap CLS on Android before tuning.** The generated fallbacks use Arial and Times New Roman, which Android lacks ([Chrome](https://developer.chrome.com/blog/font-fallbacks)). If field CLS on Android is above 0.1 ([web.dev Vitals](https://web.dev/articles/vitals)), add hand-written `@font-face` faces with `local("Roboto")` and `local("Noto Serif")` and their own `size-adjust`, listed after the next/font variables in `globals.css:106-107`. The override values would need measuring. No conflict.

**Low**

7. **Show the current nav page by more than a 1.24:1 wash.** In `Header.tsx:33`, add `underline decoration-2 underline-offset-[0.35em]` to the active state, so the state is shown by shape as well as colour (WCAG 1.4.1, 1.4.11). No conflict with DESIGN.md Navigation, which keeps the wash.
8. **Widen the dark field-border margin on butter (3.14:1).** Set `--field-border` to `#9a8a7e` in both dark blocks (`globals.css:150`, `:193`). That gives 5.16:1 on field, 3.90:1 on butter and 4.04:1 on sage. Update the DESIGN.md frontmatter `field-border-evening` to match.
9. **Optional AAA and APCA headroom.** If the owner wants 7:1 everywhere (Apple's "strive for 7:1", WCAG 1.4.6), use light `--muted-foreground: #523b2e` (lowest 7.41:1, on wheat), dark `--muted-foreground: #d8c9bc` (lowest 8.03:1, Lc 70) and dark `--link: #ffb08c` (lowest 7.31:1). **Flag:** these shrink the gap between muted and ink text (1.84:1 down to 1.65:1 light, 1.61:1 down to 1.41:1 dark), which weakens the hierarchy that DESIGN.md's Slate Grey role relies on. This is the owner's choice.
10. **Cap the recipe description at 65ch** (`recepti/[slug]/page.tsx:275`), as LAYOUT-RESEARCH #11 already recommends. It is still open.
11. **`text-wrap: pretty` on method steps** (`RecipeSteps.tsx:76`) as progressive enhancement. MDN says it is intended for body copy and has a performance cost, so apply it to steps only.
12. **Fix stale comments and docs.** `globals.css:21` says muted text is "6.9:1 or better on every tinted section", but it is 6.63:1 on wheat. `globals.css:23` and DESIGN.md:240 say tomato is "5.2:1 with white", but it is 5.76:1. DESIGN.md:266 says field border is "3:1 against white", but it is 5.58:1.
13. **Heading clamps under zoom.** If a 200% zoom audit ever flags headings, lower the vw term, for example display `clamp(2.5rem, 2.2rem + 1.6vw, 3.75rem)`. **Flag:** this edits the owner's seven-size scale values in DESIGN.md frontmatter.

### Additions to `scripts/check-design-contrast.mjs`

- **Read translucent tokens.** Line 10 only matches `#rrggbb`, so `accent-soft`, `secondary-soft`, `destructive-soft` and `border-subtle` are silently skipped in dark mode. Parse `rgba()` and add a `blend(fg, under)` step.
- **Add text pairs:** `link` on `accent-soft` over `surface`, `background` and `butter`; `foreground` on `accent-soft` over `background`; `secondary` on `secondary-soft` over `background`; `secondary`, `destructive-strong` on `background` and `surface`; `background` on `foreground`; `garden` on `on-garden`.
- **Add non-text pairs (3:1):** `field-border` on `sage` and `butter`; `destructive` on `field`; `accent` on `field`; `muted-foreground` (as the empty star) on `butter`; tab indicator against `surface-muted`; `accent-foreground` on `accent` (tick).
- **Add a 2.4.13 check (3:1):** focused ring colour against each band the fields sit on.
- **Add guards:** assert the two dark blocks are identical, and fail if `text-accent` appears as text colour in `src/components` or `src/app` outside `admin` (Link Tone Rule).

## Not verified

- **Bulgarian hyphenation dictionaries per browser.** MDN's compatibility table was not readable, and no vendor source was found.
- **Material Design dark-theme and type pages** (m2/m3.material.io) render client-side and could not be read. The Material Components Android doc confirms only "dark grey instead of black" and its stated reasons. The `#121212` and desaturation advice are not used.
- **Halation (light text glowing on dark grounds):** no primary source found, so it is not used.
- **EN 301 549 / European Accessibility Act:** not checked at the official source, and not applied. Whether a personal blog is in scope was not assessed.
- **Rendered behaviour is calculated, not observed.** Text-spacing overlap, heading sizes under zoom, characters per line in `ch`, and Android swap CLS were not tested in a browser.
- **APCA values** come from my implementation of the published APCA-W3 0.1.9 constants. I did not cross-check them against the official calculator.
- **Google Fonts sizes for Lora 700** were fetched from the CSS API with a desktop Chrome user agent on 4 November 2026. They may differ by browser.

## Sources

- W3C WCAG 2.2 Understanding: [1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [1.4.6](https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html), [1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html), [1.4.4](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html), [1.4.8](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html), [1.4.12](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html), [2.4.7](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html), [2.4.13](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html), [F94](https://www.w3.org/WAI/WCAG22/Techniques/failures/F94)
- W3C: [WCAG 3.0 Working Draft](https://www.w3.org/TR/wcag-3.0/)
- APCA: [APCA in a Nutshell](https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell.html)
- Google Fonts: [Onest METADATA.pb](https://raw.githubusercontent.com/google/fonts/main/ofl/onest/METADATA.pb), [Lora METADATA.pb](https://raw.githubusercontent.com/google/fonts/main/ofl/lora/METADATA.pb); Cyreal: [Lora-Cyrillic](https://github.com/cyrealtype/Lora-Cyrillic)
- Next.js 16.4.3 local docs: `node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md`, `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md`
- Google: [web.dev font best practices](https://web.dev/articles/font-best-practices), [web.dev Web Vitals](https://web.dev/articles/vitals), [Chrome: improved font fallbacks](https://developer.chrome.com/blog/font-fallbacks), [Material Components Android: Dark theme](https://github.com/material-components/material-components-android/blob/master/docs/theming/Dark.md)
- MDN: [hyphens](https://developer.mozilla.org/en-US/docs/Web/CSS/hyphens), [text-wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap)
- Apple HIG: [Typography](https://developer.apple.com/design/human-interface-guidelines/typography), [Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode)
