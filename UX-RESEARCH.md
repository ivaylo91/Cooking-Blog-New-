# How the blog should behave while someone cooks

Research and audit notes, 4 November 2026.

## Summary

- The blog already follows most interaction guidance. Filters, search and pages all live in the URL. Every widget uses a native element or the matching ARIA pattern. Statuses are announced. Forms keep what the reader typed, and every target is 44px or more.
- The biggest gaps are in the step timer, which is the one tool a cook trusts with the oven. It counts by ticks, which browsers throttle in background tabs. It disappears when Cook Mode moves to another step. It announces every second to screen readers. Its chime may not sound on iPhone.
- Search can fail on words that are on the page. It matches whole words in the title and description only, with no prefixes, stems or typo tolerance. The no-results advice ("try a shorter word") therefore makes things worse.
- Two components read `localStorage` without a guard. For a visitor who blocks site data, the theme toggle in the header can throw on every page.
- Cook Mode is a hand-built dialog. When the ingredients sheet closes, focus drops behind the modal, and screen-reader users hear "Стъпка 3 от 8" but not the step itself.
- Smaller gaps: printing a scaled recipe still shows the base servings, the floating resume banner can hide keyboard focus at the foot of the page, likes fail silently, and a few labels change along with `aria-pressed`.

## Brief

The task: find what primary research and standards say about interaction, feedback, forms, navigation and accessibility for a recipe site, then audit this blog's UI code against it. Readers are Bulgarian home cooks, mostly on phones from Google, often with wet hands, at night, one-handed ([PRODUCT.md](PRODUCT.md)). Recommendations respect [DESIGN.md](DESIGN.md) and do not repeat [LAYOUT-RESEARCH.md](LAYOUT-RESEARCH.md), [SEO-RESEARCH.md](SEO-RESEARCH.md) or [COOKIES-PRIVACY-RESEARCH.md](COOKIES-PRIVACY-RESEARCH.md). Their implemented items are checked in the code, not re-proposed: the floating resume banner, `scroll-padding-top`, the `short:` unpinning, real 404s, step anchors and the privacy page. Typography and colour contrast are out of scope, because they are being researched in parallel.

## 1. Cooking from the page

| Topic | Guidance | Source | This blog |
| --- | --- | --- | --- |
| Keeping the screen on | "Following a recipe" is a named use case. Locks are "automatically released when document becomes inactive", so "re-acquire… (listen for visibilitychange event)". | [MDN: Screen Wake Lock](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API) | Done in Cook Mode, including re-acquiring (`CookMode.tsx:115-139`). `Permissions-Policy` allows it (`next.config.ts:32`). Not requested while a timer runs outside Cook Mode. |
| Timers in hidden tabs | Chrome checks timers in hidden pages "once per second". After 5 minutes hidden (and 30 seconds silent) it checks them "once per minute". Chrome's own example computes delays from timestamps, not tick counts. | [Chrome for Developers](https://developer.chrome.com/blog/timer-throttling-in-chrome-88) | `StepTimer` subtracts 1 per `setInterval` tick (`StepTimer.tsx:22-42`). A hidden or locked phone makes it run slow, and the alarm comes late. |
| Timer sound | Starting Web Audio "outside the context of handling a user input event is subject to autoplay rules". | [MDN: Autoplay guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay) | A new `AudioContext` is created when the countdown ends, not in the Start tap (`timer.ts:102`). |
| Vibration | "Sticky user activation is required", and the API is "not Baseline". | [MDN: vibrate()](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate) | Used as a bonus (`timer.ts:92`). It cannot be the only signal. |
| Timer announcements | `timer` has "an implicit `aria-live` value of `off`". MDN's example switches to `alert` once, at a threshold. | [MDN: timer role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/timer_role) | `role="timer" aria-live="polite"` on the whole pill (`StepTimer.tsx:91-92`). A screen reader may read every second. |
| Is the timer a time limit? | 2.2.1 covers "time limits that are set by the content itself". A countdown the cook starts is not one, so 2.2.1 does not apply. | [WCAG 2.2.1](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html) | Pause, restart and close already exist. |
| Swipe between steps | Path gestures need a single-pointer alternative, such as "forward and backward buttons". | [WCAG 2.5.1](https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html) | Met: swipe plus 64px Назад and Напред (`CookMode.tsx:153-175, 416-446`). |
| Modal dialog | Tab and Shift+Tab wrap inside. Escape closes. "Windows under a modal dialog are inert." Focus returns to the invoker. `showModal()` makes "the rest of the page inert" and handles Escape. | [APG: dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), [MDN: dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) | A hand-built `div role="dialog"` with a keydown trap (`CookMode.tsx:212-226`). The page behind is not inert. See High 3. |
| Toggle buttons | "It is critical the label on a toggle does not change when its state changes." | [APG: button](https://www.w3.org/WAI/ARIA/apg/patterns/button/) | Step numbers (`RecipeSteps.tsx:58-59`) and the like button (`LikeButton.tsx:52`) change their label and set `aria-pressed`. |
| Sharing | Share needs "transient activation" (a click). Web Share let one team replace several buttons with one, and sharing rose about 20%. | [MDN: share()](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share), [web.dev](https://web.dev/articles/web-share) | Native share sits inside the menu, one tap deeper than needed on phones (`ShareButtons.tsx:111-115`). |

**Servings and units.** The stepper scales every quantity through `formatQuantity`, keeps cookable fractions and syncs with Cook Mode (`RecipeIngredients.tsx:59-81`, `servings.ts`). The cap at double the recipe is an owner decision. One gap: printing hides the stepper (`RecipeIngredients.tsx:59`), but the facts still print the base servings (`[slug]/page.tsx:221`). A printed recipe scaled to 8 says "Порции 4" above amounts for 8. Step text is not scaled. I could not check whether any steps contain amounts.

**Saving.** Likes are a count, not a list. The blog has no "my recipes" shelf, and the resume banner remembers only one dish. I found no primary research on favourites for recipe sites, so this is listed as optional.

## 2. Finding recipes

- **Search matching.** Search runs `textSearch(..., { type: "websearch", config: "simple" })` on a vector built from title and description only (`recipes.ts:114-118`, `schema.sql:71-72`). PostgreSQL says `websearch_to_tsquery` "will not recognize… prefix-match labels". With the `simple` dictionary there is no stemming either (from PostgreSQL docs; the `simple` behaviour comes from general knowledge, see Not verified) ([PostgreSQL](https://www.postgresql.org/docs/current/textsearch-controls.html)). In Bulgarian, "мусак" does not find "мусака", and "кюфте" does not find "кюфтета". Ingredients and tags are not searched at all. Baymard finds "56% of sites fail to adequately support users' search needs" and calls handling of misspellings "crucial" ([Baymard](https://baymard.com/blog/ecommerce-search-query-types)).
- **No results.** NN/g recommends keeping the query in the box, spelling corrections, and "Advice about how to modify queries, using different words or fewer words". It warns that these pages "frequently become a dead end" ([NN/g](https://www.nngroup.com/articles/search-no-results-serp/)). The page keeps the query and offers category chips (`tarsene/page.tsx:224-232`), which is good. But its advice "Опитайте с по-кратка дума" (line 80) is wrong for whole-word matching.
- **Count announced.** "5 results returned" is a status message under 4.1.3 ([WCAG 4.1.3](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)). Both counts sit in `aria-live` (`tarsene/page.tsx:71`, `RecipeFilters.tsx:161`).
- **Filters.** NN/g recommends batch filtering on mobile, because reloading "every single time they make a selection" is tiresome ([NN/g](https://www.nngroup.com/articles/applying-filters/)). Here each chip is a link that changes one option, and there are only three groups with few choices. Results arrive by client navigation, so interactive filtering is reasonable, and I do not recommend changing it. Every state is in the URL, and "Изчисти" clears it.
- **Pagination.** NN/g: "There is no solution that is overall superior". Pagination returns users "to a single page of content" and avoids losing your place on Back ([NN/g](https://www.nngroup.com/articles/infinite-scrolling-tips/)). Twelve per page with `rel`, `aria-current="page"` and 44px circles (`Pagination.tsx:44-65`) fits that. Next.js `<Link>` keeps scroll position on Back and scrolls to the new page otherwise ([local docs](node_modules/next/dist/docs/01-app/03-api-reference/02-components/link.md)).
- **Search form.** The search form is a plain `<form action="/tarsene">` (`SearchField.tsx:50`), so each search is a full page load. `next/form` adds "client-side navigation on submission" and prefetches the loading UI ([local docs](node_modules/next/dist/docs/01-app/03-api-reference/02-components/form.md)).

## 3. Feedback and states

NN/g's first heuristic is to keep users informed "through appropriate feedback within a reasonable amount of time" ([NN/g](https://www.nngroup.com/articles/ten-usability-heuristics/)). After 1 second, "indicate to the user that the computer is working" ([NN/g](https://www.nngroup.com/articles/response-times-3-important-limits/)). Skeletons suit full-page loads "under 10 seconds", and animated ones "can distract" ([NN/g](https://www.nngroup.com/articles/skeleton-screens/)).

- **Loading.** Each route has a skeleton matching its layout, and the pulse is `motion-safe` only (`Skeleton.tsx:2`). Screen readers get nothing. WCAG 4.1.3 gives "application busy" as a status message example.
- **Likes.** The button waits for the RPC. On failure it only logs to the console (`LikeButton.tsx:41`), so the reader sees nothing happen. NN/g heuristic 9 asks errors to "constructively suggest a solution".
- **Ratings.** The vote is written to `localStorage` on click, before the server answers (`RatingStars.tsx:61, 84`). After a failure, the reader's own star still shows on reload. "Оценката не беше записана." does not say what to do next.
- **Copy link.** A clipboard failure is silent (`ShareButtons.tsx:75-77`).
- **Errors and 404.** Both have plain Bulgarian headings, a retry or way out, and the error digest (`error.tsx:31-38`, `not-found.tsx`). The error page cannot tell "offline" from "server down".
- **Offline.** Ticks, servings and Cook Mode keep working once the page has loaded, because they are client-side. A reload in a kitchen with no signal fails. There is no service worker. This is optional.

## 4. Forms

GOV.UK's research-based rules apply directly. Put the message "next to the field". Use "an instruction for empty fields like 'Enter your name'". Avoid "please", which "implies a choice", and "valid"/"invalid", which "do not add anything" ([GOV.UK: error message](https://design-system.service.gov.uk/components/error-message/)). "Do not validate when the user moves away from a field". "Add 'novalidate' to your form tags". Redisplay "the form fields as the user filled them in" ([GOV.UK: validation](https://design-system.service.gov.uk/patterns/validation/)). The character count does not restrict input, so users can paste and edit down ([GOV.UK: character count](https://design-system.service.gov.uk/components/character-count/)). NN/g adds: "Presenting errors too early is a hostile pattern" ([NN/g](https://www.nngroup.com/articles/error-message-guidelines/)).

**Comment form** (`CommentForm.tsx`). It meets most of these: visible labels (60-65, 85-90), a hint (80), `autocomplete="name"` (73), input kept on failure (47, `forms.ts`), a pending label, and a `role="status"` result (132). Gaps:
- Native `required` (70, 94) brings the browser's bubble rather than the site's message.
- The server's "invalid" message sits under the button and flags both fields at once.
- `maxLength={1000}` (95) silently cuts pasted text.
- `.field:user-invalid` (`globals.css:303-306`) turns a field red after editing with no message, close to the on-blur validation GOV.UK advises against.

**Newsletter** (`SubscribeForm.tsx`). The input is right: `type="email"`, `autocomplete="email"`, `autoCapitalize="none"`, `spellCheck={false}`, `enterKeyHint="send"` (69-83). The status is `role="status"` (101). The copy breaks GOV.UK's word rules: "Моля, въведете валиден имейл адрес." and "Нещо се обърка. Опитайте отново." (12-18).

**Honeypots.** Both are hidden from people and assistive technology: off-screen with `aria-hidden` and `tabIndex={-1}` (`CommentForm.tsx:51-58`), or `display:none` (`SubscribeForm.tsx:57-64`). There is no CAPTCHA, so 3.3.8 Accessible Authentication raises nothing. Neither 3.3.7 Redundant Entry nor 3.2.6 Consistent Help applies: there are no multi-step processes and no help channel.

## 5. Accessibility of interactions

| Widget | Pattern expected | Implementation | Verdict |
| --- | --- | --- | --- |
| Skip link, landmarks | Skip to main | `layout.tsx:68-75`: skip link to `main#main-content` with `tabIndex={-1}`. Header, labelled navs, main, footer. | Meets |
| Recipe "tabs" | APG tabs "display one panel of content at a time" ([APG](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)). Here both parts stay on the page. | `RecipeTabs.tsx:70-88`: a `nav` of in-page links with `aria-current="location"` | Correct choice: not a tablist |
| Share, phone menu, filters | Disclosure: a button with `aria-expanded` ([APG](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)) | `ShareButtons.tsx:87-92`, `Header.tsx`, `<details>` in `RecipeFilters.tsx:111` | Meets. The phone menu's Escape (`Header.tsx:54-58`) unmounts the panel without returning focus to its button. |
| Ingredient rows | Native checkbox with label | `RecipeIngredients.tsx:94-101`, a whole-row `<label>` | Meets |
| Stars | Group of buttons | `RatingStars.tsx:70-89`: `role="group"`, labels such as "3 от 5" | Meets |
| Cook Mode | Modal dialog | See section 1 | Partial |
| Top-rated shelf | Carousel only if it rotates | A scrolling `ul` with no auto-advance (`page.tsx:132-134`) | Fine |
| Focus | Visible, not hidden | 2px tomato outline (`globals.css:260-267`). `scroll-padding-top` (502-510). The bottom resume banner (`ResumeCooking.tsx:17`) has no matching bottom padding, see [WCAG 2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html), [C43](https://www.w3.org/WAI/WCAG22/Techniques/css/C43). | Gap at the bottom |
| Motion | 2.3.3 (AAA) covers interaction-triggered motion, not "changes of color… or opacity" ([WCAG 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)) | Reduced motion zeroes the rise, slide and pop distances (`globals.css:472-492`). It leaves the `hover:scale-105/110` and `active:scale-*` presses and the tab indicator slide, and DESIGN.md claims scale "holds at 1". | Minor |
| Targets | 2.5.8: 24px ([WCAG](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)) | 44px everywhere checked | Meets |
| Headings | One h1, logical h2/h3 | Recipe: h1 name, h2 Съставки, Приготвяне, Как се получи?, comments, related, newsletter. h3 for groups and cards. | Meets |

## 6. Audit

### Already meets best practice

| Finding | Where | Source |
| --- | --- | --- |
| Wake lock in Cook Mode, re-acquired on `visibilitychange` and allowed by policy | `CookMode.tsx:115-139`, `next.config.ts:32` | MDN Wake Lock |
| Swipe has button alternatives, 64px | `CookMode.tsx:416-446` | WCAG 2.5.1 |
| Escape closes the ingredients sheet first, then Cook Mode, and returns focus to the trigger | `CookMode.tsx:192-200` | APG dialog |
| Filters, page and query all in the URL. Back, sharing and canonical URLs work. | `RecipeFilters.tsx:19-27`, `recepti/page.tsx:98-106` | NN/g pagination |
| Result counts and form outcomes announced | `RecipeFilters.tsx:161`, `tarsene/page.tsx:71`, `CommentForm.tsx:132`, `SubscribeForm.tsx:101` | WCAG 4.1.3 |
| Failed submits keep the typed text | `forms.ts`, both forms | GOV.UK validation, NN/g errors |
| Visible labels, hints, `autocomplete`, `enterKeyHint`, keyboard types | `CommentForm.tsx:60-90`, `SubscribeForm.tsx:69-83` | GOV.UK |
| No-results page keeps the query and offers categories | `tarsene/page.tsx:208-232` | NN/g no results |
| Ticks, steps and servings survive reloads, with a memory fallback | `useStoredSet.ts`, `servings.ts` | NN/g heuristic 1 |
| In-page nav rather than fake tabs. Share and menu as disclosures. | `RecipeTabs.tsx`, `ShareButtons.tsx` | APG tabs, disclosure |
| Skeletons match layouts, with `motion-safe` pulse | `loading.tsx` files, `Skeleton.tsx:2` | NN/g skeleton screens |

### Prioritised recommendations

**High**

1. **Rebuild the timer on timestamps and keep timers alive.** Store `endsAt = Date.now() + ms`, derive `remaining` from it on each tick and on `visibilitychange`, and fire the alert when `remaining <= 0`. Lift timers into one recipe-level store (context plus `sessionStorage`, keyed by step id), so a timer survives Cook Mode step changes (today `key={index-…}` unmounts it, `CookMode.tsx:292-298`), opening or closing Cook Mode, and running several at once. Show running timers in a small tray in Cook Mode and above the method. While any timer runs, request a screen wake lock. Create or `resume()` the `AudioContext` inside the Start tap, and reuse it when time is up. Also change `document.title` to "Готово: {label}" so a hidden tab shows it. Sources: [Chrome](https://developer.chrome.com/blog/timer-throttling-in-chrome-88), [MDN Autoplay](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay), [MDN Wake Lock](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API). Files: `src/components/StepTimer.tsx`, `src/lib/timer.ts`, `src/components/CookMode.tsx`, `src/components/RecipeSteps.tsx`, a new `src/lib/useTimers.ts`. DESIGN.md's Step timer entry would gain the tray.

2. **Announce the timer once, not every second.** Drop `aria-live="polite"` from the `role="timer"` pill, so the implicit `off` applies. Add one visually hidden `role="status"` region that says "Таймерът за {label} изтече" when it finishes. Sources: [MDN timer role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/timer_role), [WCAG 4.1.3](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html). File: `StepTimer.tsx:90-106`.

3. **Make Cook Mode a native modal and announce the step.** Render a `<dialog>` opened with `showModal()`. This gives an inert page, Escape handling and the top layer, and replaces the manual Tab trap. When the ingredients sheet closes, move focus to the "Съставки" toggle. Today the sheet unmounts with focus inside it, and the next Tab lands in the page behind (`CookMode.tsx:346-353`). Put the step text inside the live region with the "Стъпка N от M" line, or give the region `aria-atomic`, so moving a step reads the step itself. Sources: [APG dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), [MDN dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog). File: `CookMode.tsx`. Keep the slide and rise animations on the inner content.

4. **Make search find partial and inflected words.** Build the query with `to_tsquery('simple', 'word1:* & word2:*')` from sanitised words, which supports prefix matching. Add tags and ingredient items to `search_vector`. For typo tolerance, add `pg_trgm` similarity on titles as a fallback when the full-text search returns nothing. Change the no-results advice to "Проверете правописа или опитайте с друга дума", and offer the closest titles if the trigram match found any. Sources: [PostgreSQL](https://www.postgresql.org/docs/current/textsearch-controls.html), [Baymard](https://baymard.com/blog/ecommerce-search-query-types), [NN/g](https://www.nngroup.com/articles/search-no-results-serp/). Files: `supabase/schema.sql`, `src/lib/recipes.ts:114-118`, `src/app/tarsene/page.tsx:224-232`.

5. **Guard the two unguarded storage reads.** `ThemeToggle.tsx:17,28` and `LikeButton.tsx:24,38` call `localStorage` outside `try`. MDN: it throws `SecurityError` when "the user has configured the browsers to prevent the page from persisting data" ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)). The toggle sits in the root layout, so a throw there can reach `global-error.tsx`. Wrap both, as `useStoredSet.ts` already does. Files: `src/components/ThemeToggle.tsx`, `src/components/LikeButton.tsx`.

**Medium**

6. **Print the servings that were scaled.** Add a `hidden print:block` line "Количества за {servings} порции" in the ingredients header. Alternatively, have the facts read the stored servings. Also drop the strike-through and grey on ticked or finished rows in print (`print:no-underline print:text-foreground`). File: `RecipeIngredients.tsx:59-116`, `RecipeSteps.tsx:75-78`. This is an owner choice with no primary source (see LAYOUT-RESEARCH.md).

7. **Keep focus clear of the floating resume banner.** While it shows, set `html { scroll-padding-bottom: 6rem }`, for example through a class toggled by the component, or `html:has([data-resume-banner])`. Sources: [WCAG 2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html), [C43](https://www.w3.org/WAI/WCAG22/Techniques/css/C43). Files: `ResumeCooking.tsx`, `globals.css`. Also link to the step itself (`#stapka-{step+1}`) rather than `#prigotvyane` (`ResumeCooking.tsx:19`).

8. **Give likes visible feedback.** Update the count optimistically, roll back on error, and show "Не успях да запиша харесването. Опитайте пак." in a `role="status"` line. Keep the label constant ("Харесай", plus the count) and let `aria-pressed` carry the state. Sources: [NN/g heuristics 1 and 9](https://www.nngroup.com/articles/ten-usability-heuristics/), [APG button](https://www.w3.org/WAI/ARIA/apg/patterns/button/). File: `LikeButton.tsx`. COOKIES-PRIVACY-RESEARCH.md item 10 (move it to a server action) fits the same change.

9. **Save the rating only after success.** Write `rated:` to storage when `state.status === "success"`. Clear `picked` on error. Make the error say "Оценката не беше записана. Опитайте отново." File: `RatingStars.tsx:58-65, 110-115`. Source: [NN/g error messages](https://www.nngroup.com/articles/error-message-guidelines/).

**Low**

10. **One tap to share on phones.** When `navigator.share` exists, let "Сподели" call it directly. Keep the menu for desktop and as the fallback on `AbortError`/`NotAllowedError`. Show "Линкът не се копира" if the clipboard fails. Sources: [MDN share()](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share), [web.dev](https://web.dev/articles/web-share). File: `ShareButtons.tsx`.

11. **Keep toggle labels fixed.** Step buttons become "Стъпка {n}" with `aria-pressed`, without the "изпълнена / отбележи…" swap. Source: [APG button](https://www.w3.org/WAI/ARIA/apg/patterns/button/). File: `RecipeSteps.tsx:58-59`.

12. **Form wording and validation, per GOV.UK.** Add `noValidate` and show the site's own messages next to each field ("Въведете име", "Напишете коментар", "Въведете имейл адрес във формат ime@example.com"). Replace "Нещо се обърка" with "Не успях да ви запиша. Опитайте отново след малко.". Drop `maxLength` on the textarea and turn the counter into "Остават N знака", announced after a pause. Limit `:user-invalid` styling to after a submit attempt. Sources: [GOV.UK error message](https://design-system.service.gov.uk/components/error-message/), [validation](https://design-system.service.gov.uk/patterns/validation/), [character count](https://design-system.service.gov.uk/components/character-count/). Files: `CommentForm.tsx`, `SubscribeForm.tsx`, `src/app/recepti/actions.ts` (return which field failed), `globals.css:303-306`. **Conflict flag:** DESIGN.md lists `:user-invalid` and the "N / 1000" counter as specified behaviour.

13. **Return focus when the phone menu or search closes with Escape.** Focus the toggle button that opened it. File: `Header.tsx:54-58`. Source: [APG dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) (return focus) applied by analogy. APG's disclosure page does not specify Escape.

14. **Tell screen readers a page is loading.** In each `loading.tsx`, add `<p role="status" className="sr-only">Зареждане…</p>`. Source: [WCAG 4.1.3](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html). Files: the four `loading.tsx` files.

15. **Empty filter results should offer a way out.** Add links that remove each active filter, plus "Вижте всички рецепти". Source: [NN/g](https://www.nngroup.com/articles/search-no-results-serp/) (no dead ends). File: `recepti/page.tsx:127-133`.

16. **Hold scale under reduced motion.** Add `motion-reduce:hover:scale-100 motion-reduce:active:scale-100` to the stars, the stepper and presses, and `motion-reduce:transition-none` to the tab indicator. Add `motion-safe:` to the timer's `animate-pulse` (`StepTimer.tsx:101`). **Conflict flag:** that looping pulse already breaks DESIGN.md's "no looping motion except the hovered logo steam". Either remove it or record an exception. Source: [WCAG 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) (AAA, beyond the AA target).

17. **Optional.** Use `next/form` for the search form (`SearchField.tsx:50`) for client navigation and an instant skeleton ([local docs](node_modules/next/dist/docs/01-app/03-api-reference/02-components/form.md)). Have Cook Mode mark steps done in the shared `done:` set as you pass them, so the page list matches. Accept Latin input ("musaka") by transliterating to Cyrillic before searching. Add a saved-recipes shelf from `liked:` keys. Add an error-page line for `!navigator.onLine`. None of these has a primary source behind it. Treat them as owner decisions.

## Not verified

- **Live behaviour.** `next start` on the existing build served the prerendered shell, but the recipe body never streamed in, and every search returned "0 рецепти", even for an existing title. Supabase was evidently not reachable from this machine. Heading and landmark findings therefore come from the code. The search problems come from the PostgreSQL docs and the query code, not from observed results.
- **The `simple` dictionary does no stemming.** This comes from general PostgreSQL knowledge. The page I fetched does not describe `simple` (see section 12.6 of the PostgreSQL docs).
- **iOS behaviour.** That Safari lacks `navigator.vibrate`, that iOS blocks an `AudioContext` created outside a tap, and that the phone header's `autoFocus` search field does not raise the iOS keyboard. MDN's compatibility table was not readable. Test on a real iPhone.
- **Hidden phones.** That a locked phone suspends JavaScript entirely, rather than only throttling it, varies by OS and is not stated in the Chrome article.
- **The theme toggle crash.** A throw in `useSyncExternalStore`'s snapshot reaching `global-error.tsx` follows from React's error-boundary rules. It was not reproduced.
- **Latin-script searching.** I found no primary research on how often Bulgarian readers type in Latin letters. I could not fetch the official Transliteration Act (ДВ бр. 19/2009) text from a primary page.
- **Favourites and recipe-site printing.** I found no primary usability research.
- **The 2-second time trap** in `addComment` could silently drop a very fast human. That is unlikely, and it is not measured.

## Sources

- NN/g: [10 usability heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/), [Response times](https://www.nngroup.com/articles/response-times-3-important-limits/), [Skeleton screens](https://www.nngroup.com/articles/skeleton-screens/), [No-results pages](https://www.nngroup.com/articles/search-no-results-serp/), [Error-message guidelines](https://www.nngroup.com/articles/error-message-guidelines/), [Applying filters](https://www.nngroup.com/articles/applying-filters/), [Infinite scrolling](https://www.nngroup.com/articles/infinite-scrolling-tips/)
- GOV.UK Design System: [Error message](https://design-system.service.gov.uk/components/error-message/), [Validation](https://design-system.service.gov.uk/patterns/validation/), [Character count](https://design-system.service.gov.uk/components/character-count/)
- Baymard Institute: [Search query types](https://baymard.com/blog/ecommerce-search-query-types)
- W3C: [WCAG 2.2.1](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html), [2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html), [2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html), [C43](https://www.w3.org/WAI/WCAG22/Techniques/css/C43), [2.5.1](https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html), [2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [4.1.3](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html); APG [Dialog (modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), [Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/), [Disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/), [Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- MDN: [Screen Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API), [Autoplay guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay), [Navigator.vibrate()](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate), [Navigator.share()](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share), [timer role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/timer_role), [&lt;dialog&gt;](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog), [Window.localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- Google: [Chrome timer throttling](https://developer.chrome.com/blog/timer-throttling-in-chrome-88), [web.dev: Web Share](https://web.dev/articles/web-share)
- PostgreSQL: [Controlling text search](https://www.postgresql.org/docs/current/textsearch-controls.html)
- Next.js 16 bundled docs: [Link](node_modules/next/dist/docs/01-app/03-api-reference/02-components/link.md), [Form](node_modules/next/dist/docs/01-app/03-api-reference/02-components/form.md)
