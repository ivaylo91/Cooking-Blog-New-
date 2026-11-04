# Cookies, browser storage and privacy

Research and audit notes, 4 November 2026. This is research, not legal advice. The owner should have the final privacy notice checked by a Bulgarian lawyer if in doubt.

## Summary

- **No cookie banner is needed for anything the blog stores in the browser.** Visitors get no cookies at all. Every `localStorage` key is first-party, written only when the visitor uses a feature (theme, ticks, servings, Cook Mode, rating, like), and never sent to a server. That falls under the "strictly necessary for a service explicitly requested by the user" exemption in ePrivacy Art. 5(3) ([WP29 Opinion 04/2012](https://ec.europa.eu/justice/article-29/documentation/opinion-recommendation/files/2012/wp194_en.pdf), [EDPB cookie banner taskforce, para. 30](https://www.edpb.europa.eu/system/files/2023-01/edpb_20230118_report_cookie_banner_taskforce_en.pdf)).
- **Vercel Web Analytics and Speed Insights are the one open question.** They set no cookies, but their scripts tell the browser to send data. EDPB Guidelines 2/2023 treat that as "gaining access" under Art. 5(3) (paras. 33, 54–55). No exemption covers analytics (WP29 04/2012, section 4.3). The comment in `src/app/layout.tsx:99` ("Cookieless, so no consent banner is needed under GDPR") goes too far. The owner should choose one of three options: keep them with notice and an opt-out, put them behind consent, or remove them.
- **What is missing is information, not consent.** The site has no privacy notice, no footer link to one, and nothing next to the newsletter or comment forms that explains what happens to the data.
- **Biggest practical risks:** the admin "copy emails" button can put every subscriber's address into one visible To: line. IP hashes are kept forever, and their salt falls back to a value committed in the repo. The newsletter has no confirmation step and no unsubscribe link.
- **One correction to the brief:** the Bulgarian cookie rule is in the Electronic Commerce Act (Закон за електронната търговия, ЗЕТ) Art. 4a. Art. 4a of the Electronic Communications Act (ЗЕС) is about radio-spectrum policy.

## Brief

Inventory everything the site stores in browsers, sends to third parties or keeps about people. Then measure it against EU and Bulgarian law and regulator guidance, and recommend changes in priority order. Sources are the legal texts and the regulators' own documents. Anything I could not read at its source is listed under "Not verified".

## 1. Inventory

Method: I searched `src/`, `next.config.ts`, `public/` and `supabase/` for cookies, Web Storage, IndexedDB, external URLs, scripts, iframes and personal-data fields. I read the installed `@vercel/analytics` 2.0.1, `@vercel/speed-insights` 2.0.0 and `@supabase/ssr` 0.12.5 packages and the scripts Vercel serves. I also queried the live Supabase schema, structure only, with no row data. There are no iframes, embeds, third-party fonts or `sessionStorage`/IndexedDB use. Fonts come from `next/font/google`, which self-hosts them: "no requests are sent to Google by the browser" (`node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md:96`). The CSP in `next.config.ts` allows only `font-src 'self'`.

### Browser storage and cookies

| Name / key | Set by | Purpose | Party | Lifetime | Strictly necessary? | Personal data? |
| --- | --- | --- | --- | --- | --- | --- |
| `theme` (localStorage) | `ThemeToggle.tsx:28`; read in `layout.tsx:82`, `ThemeToggle.tsx:17` | Remember light or dark choice | 1st | Until cleared | Yes, UI preference set by a click | No |
| `checked:<recipeId>` | `useStoredSet.ts:47` via `RecipeIngredients.tsx:45`, `CookMode.tsx:71` | Ticked ingredients | 1st | Until cleared; removed when empty | Yes, user input | No |
| `done:<recipeId>` | `useStoredSet.ts:47` via `RecipeSteps.tsx:32` | Finished steps | 1st | Until cleared | Yes, user input | No |
| `servings:<recipeId>` | `servings.ts:35,54` | Scaled servings | 1st | Until cleared; removed at base value | Yes, user input | No |
| `cook:<recipeId>` | `CookMode.tsx:68,89,186` | Cook Mode step | 1st | Until cleared | Yes, user input | No |
| `last-cooked` | `lastCooked.ts:5,20` | Offer "resume" on home page: slug, title, step, time | 1st | Ignored after 7 days (`lastCooked.ts:45`) but not deleted | Yes, user input | Device-local cooking history; never sent |
| `rated:<recipeId>` | `RatingStars.tsx:10,61` | Show the visitor's own star | 1st | Until cleared | Yes, follows a click | No |
| `liked:<recipeId>` | `LikeButton.tsx:24,38` | Show "liked" and block a repeat like (client-side only, `schema.sql:296-297`) | 1st | Until cleared | Yes, follows a click | No |
| `__va_attribution` | Vercel Analytics script | Holds `userId`/`groupId`, written only if `identify()` is called; the site never calls it, so it is only read | 1st origin, Vercel code | n/a | n/a | No (empty) |
| `sb-<project-ref>-auth-token` (cookie, may be split into `.0`, `.1`) | Supabase SSR on admin login, `admin/actions.ts:28`; refreshed in `lib/supabase/middleware.ts:15-21` for `/admin/*` only (`proxy.ts` matcher) | Owner's admin session: access JWT and refresh token | 1st | `Max-Age` 400 days, `SameSite=Lax`, not HttpOnly (`@supabase/ssr` `utils/constants.js`) | Yes, authentication | Yes, the owner's |

Public visitors never receive a cookie. `publicClient` turns off session storage (`lib/supabase/public.ts`). The browser Supabase client used by the like button writes nothing when there is no session. I checked `_recoverAndRefresh` in `@supabase/auth-js`: it removes a session only if one exists.

### Requests that leave the browser

| Request | Code | What is sent | Recipient | Necessary? |
| --- | --- | --- | --- | --- |
| Web Analytics page views to a first-party path (`/_vercel/insights` or `/<unique-path>/`) | `layout.tsx:100` | URL, route, referrer, filtered query, geolocation, OS, browser, device type. Visitor "identified by a hash created from the incoming request", "discarded after 24 hours" | Vercel Inc. (US), processor | No |
| Speed Insights | `layout.tsx:101` | Route, URL, network speed, browser, device, OS, country, Web Vital and the element it is attributed to | Vercel Inc. | No |
| Like RPC `increment_recipe_likes` | `LikeButton.tsx:32-35` | Recipe ID; the visitor's IP and user agent reach Supabase | Supabase, project in `eu-central-1` (Frankfurt) | Yes, user action |
| Comment, rating and subscribe server actions | `recepti/actions.ts` | Form data; the server hashes the IP | Vercel, then Supabase | Yes, user action |
| Share links (Facebook, WhatsApp, Viber) | `ShareButtons.tsx:117-128` | Nothing until clicked; plain links with `noopener noreferrer` | Meta or Viber, only on click | Yes, user action |
| Images | `next/image` | Served through Vercel's `/_next/image`; the browser never contacts Supabase Storage directly | Vercel | Yes |

### Personal data held in the database (Supabase, eu-central-1)

| Table | Fields | Who can read | Retention | Source |
| --- | --- | --- | --- | --- |
| `comments` | `author_name` (public), `text` (public), `created_at`, `ip_hash` | Anyone can read name, text and date. `ip_hash` is hidden from both API roles and readable only through SQL or the service role (`security-step-2.sql:24,29`) | Forever | `schema.sql:261-269`. The live table has `ip_hash`, but `schema.sql` does not, and the live `count_recent_comments` function is not in any SQL file |
| `ratings` | `value`, `ip_hash`, timestamps; unique per (recipe, hash) | Admin only (`schema.sql:383`) | Forever | `schema.sql:338-347` |
| `subscribers` | `email`, `ip_hash`, `created_at` | Admin only (`schema.sql:431`); the admin page copies every address joined with ", " (`CopyEmailsButton.tsx`) | Forever; deleted by hand | `schema.sql:416-423`, `actions.ts:111-131` |
| `auth.users` | Owner's email and login metadata | Supabase | While the account exists | Supabase-managed |

The IP hash is `sha256(ip + ":" + salt)`, cut to 32 hex characters (`actions.ts:21-25`). The salt comes from `IP_HASH_SALT`, with a fallback committed in the repo (`actions.ts:11`). The code comment itself warns that the fallback leaves hashes reversible. My estimate: there are about 4.3 billion IPv4 addresses, so anyone who knows the salt can hash them all and recover any address.

## 2. Legal and best-practice findings

### The storage rule: ePrivacy Art. 5(3) and ЗЕТ Art. 4a

- **Scope.** Art. 5(3) covers "to store information or to gain access to information stored in the terminal equipment" of a user. It covers any information, not only personal data ([EDPB Guidelines 2/2023 v2, adopted 7 October 2024](https://www.edpb.europa.eu/system/files/documents/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf), paras. 4, 6, 12). Storage happens whenever software is instructed to save information, "regardless of who created or installed the protocols" (para. 36), so `localStorage` writes are in scope.
- **Reading inside the device is not "access".** When browsers "process information stored… inside the device (such as cookies, local storage…)", this is not gaining access "as long as the information does not leave the device" (para. 44). Every key in the table above stays on the device.
- **Scripts that make the browser send data are "access".** JavaScript "where the accessing entity instructs the browser of the user to send asynchronous requests with the targeted information" is in scope (para. 33). Collecting only the IP address to track navigation can also be in scope (paras. 54–55). This is the basis for the analytics question.
- **Exemptions.** Consent is not needed for storage "strictly necessary in order for the provider of an information society service explicitly requested by the subscriber or user to provide the service" (quoted in EDPB 2/2023, footnote 4). The EDPB leaves exemptions to case-by-case national assessment (para. 4).
- **WP29 Opinion 04/2012** ([WP194](https://ec.europa.eu/justice/article-29/documentation/opinion-recommendation/files/2012/wp194_en.pdf)):
  - User-input and authentication cookies are exempt (sections 3.1 and 3.2).
  - "Persistent login cookies which store an authentication token across browser sessions are not exempted" (3.2).
  - UI-customisation storage is exempt only for a session or a short time, unless "additional information in a prominent location" is shown (3.6).
  - Analytics "are not strictly necessary" and are not exempt. WP29 adds that first-party aggregated analytics are "not likely to create a privacy risk" when there is clear information, "a user friendly mechanism to opt-out" and anonymisation of IPs (4.3).
- **Taskforce 2023.** "Cookies allowing website owners to retain the preferences expressed by users, regarding a service, should be deemed essential" (para. 30). Owners must keep the list of cookies and be able to show that each one is essential (para. 28).
- **Bulgaria.** ЗЕТ Art. 4a(1) allows storage or access if the user has "ясна и изчерпателна информация по чл. 13 от Регламент (ЕС) 2016/679" and "възможност да откаже". Art. 4a(4) exempts storage needed for transmission or for "услуга на информационното общество, изрично поискана от получателя". Art. 4a(2) requires that the user can find out at any time what is stored ([consolidated text, kik-info.com](https://kik-info.com/normativna-baza/zakoni/0X2135530547/), unofficial). Read literally, the Bulgarian text asks only for information and a way to refuse. The Directive as amended in 2009 requires "informed consent before information is stored or accessed" (WP194, introduction). Plan to the stricter EU standard.

### Consent and banner design (if a banner is ever used)

[EDPB Guidelines 05/2020 on consent](https://www.edpb.europa.eu/system/files/documents/files/file1/edpb_guidelines_202005_consent_en.pdf):

- "The use of pre-ticked opt-in boxes is invalid", and "merely proceeding with a service" is not consent (para. 79).
- Cookie walls do not give freely given consent (paras. 39–40).
- Withdrawing must be as easy as giving consent (paras. 113–114).
- The controller must be able to prove consent (paras. 104–107).

[Cookie banner taskforce report, 17 January 2023](https://www.edpb.europa.eu/system/files/2023-01/edpb_20230118_report_cookie_banner_taskforce_en.pdf):

- Most authorities consider a missing reject option on the layer that has "accept" an infringement (para. 8).
- Pre-ticked boxes are invalid (para. 10).
- A reject option shown as an unreadable or low-contrast button can be "manifestly misleading" (para. 18).
- Consent needs an easily reached way to withdraw, such as an icon or a link "placed on a visible and standardized place" (para. 32).

### Personal data, IP hashes and pseudonymisation

- [EDPB Guidelines 01/2025 on pseudonymisation](https://www.edpb.europa.eu/system/files/2025-01/edpb_guidelines_202501_pseudonymisation_en.pdf) (consultation version, adopted 16 January 2025):
  - Pseudonymised data that could be attributed using additional information "is therefore personal" (para. 22).
  - The guidelines quote the GDPR Art. 4(5) definition (para. 16).
  - They prefer keyed one-way functions such as MACs. Plain hash functions should be specialised password-hashing functions (para. 89). A plain SHA-256 of a known input is easy to match (footnote 23).
- The salted IP hash is therefore pseudonymous personal data, not anonymous. Email addresses and commenters' names are plainly personal data.
- On raw IP addresses: in *Breyer* (C-582/14), the CJEU held that a dynamic IP address is personal data for a website operator that "has the legal means" to identify the visitor through the ISP. I saw this only through search results (see Not verified).

### Transparency (GDPR Art. 12–14)

[WP29 transparency guidelines (WP260 rev.01)](https://ec.europa.eu/newsroom/article29/items/622227), endorsed by the EDPB:

- "A direct link to this privacy statement/ notice should be clearly visible on each page" under a common term such as "Privacy Policy".
- Links that are hard to see "are not considered easily accessible".
- The annex lists what Art. 13 requires:
  - controller identity and contact (13.1(a));
  - purposes and lawful basis (13.1(c)), and the legitimate interests relied on (13.1(d));
  - recipients (13.1(e)) and transfers to third countries (13.1(f));
  - retention period or the criteria for it (13.2(a));
  - rights (13.2(b)) and the right to withdraw consent (13.2(c));
  - the right to complain to a supervisory authority (13.2(d)).

### Processors

- **Vercel** is "a data processor on behalf of our Customers". It relies on the EU-U.S. Data Privacy Framework and standard contractual clauses. Entity: Vercel Inc., Covina, CA, USA ([Vercel privacy notice](https://vercel.com/legal/privacy-policy)).
- **Supabase** acts "primarily as a processor". Transfers go to "the United States and Singapore" under SCCs, with a DPA at `/legal/customer-resources/data-processing-addendum` ([Supabase privacy policy](https://supabase.com/privacy)). This project's database is in `eu-central-1` (from the Supabase project listing).
- **Vercel's analytics pages.** Web Analytics works "without using any third-party cookies". Data points are "anonymous", and the reporting window is 1 month on Hobby and 12 months on Pro, though Vercel "may store your data for longer" ([Web Analytics privacy](https://vercel.com/docs/analytics/privacy-policy), [pricing](https://vercel.com/docs/analytics/limits-and-pricing)). Speed Insights data is "not… tied to, or associated with, any individual visitor or IP address" ([Speed Insights privacy](https://vercel.com/docs/speed-insights/privacy-policy)). The Speed Insights script uses no storage API. The analytics script only touches `__va_attribution`.
- **Supabase auth cookies** hold an access and a refresh token. HttpOnly "is not necessary", and `SameSite=Lax` is "a good default" ([Supabase SSR advanced guide](https://supabase.com/docs/guides/auth/server-side/advanced-guide)).

### Newsletter

- ЗЕТ Art. 6(4): "Забранява се изпращането на непоискани търговски съобщения на потребители без предварителното им съгласие." Whether a non-commercial recipe newsletter counts as "търговски" is unclear. The GDPR lawful basis for the list is consent either way.
- **Double opt-in.** The German supervisory authorities (DSK, [Orientierungshilfe Direktwerbung, February 2022](https://www.datenschutzkonferenz-online.de/media/oh/OH-Werbung_Februar%202022_final.pdf), section 3.3) say electronic consent calls for "das Double-Opt-In-Verfahren". They add that "das bloße Abspeichern einer IP-Adresse" does not prove consent, and that the exact wording of the consent must be stored. This is the clearest regulator source I found. I found no Bulgarian equivalent.

### Search

Google exempts "mandatory interstitials" from its intrusive-interstitial guidance. It still advises against obscuring the whole page or redirecting "to a separate page for their consent", and favours banners that take "only a small fraction of the screen" ([Search Central](https://developers.google.com/search/docs/appearance/avoid-intrusive-interstitials)). A small, non-blocking banner, or none, is the SEO-safe choice.

## 3. Audit and prioritised recommendations

### Does the site need a banner?

- **Storage keys:** no. Each one is set by an explicit action, is first-party, and is used only on the device. That is the WP29 3.1/3.6 and taskforce para. 30 pattern, and EDPB 2/2023 para. 44 confirms the reads are not "access". The only weakness is that the keys never expire, while WP29 ties the UI exemption to short lifetimes. Recommendation 7 fixes that.
- **Admin cookie:** no. Only the owner gets it, on `/admin`.
- **Vercel Analytics and Speed Insights:** a judgment call. On the strict EU reading (EDPB 2/2023 para. 33, WP29 4.3) they need consent. On the literal Bulgarian text (ЗЕТ Art. 4a(1)), information plus a way to refuse is enough. Vercel's design (no cookies, a hash discarded after 24 hours, aggregate data) matches WP29's "not likely to create a privacy risk" profile, but that is not an exemption.

What is required whatever the analytics decision: a privacy and cookie notice linked from every page, and short notices at the two forms.

### High

1. **Add a privacy notice page and link it in the footer.** Create `src/app/poveritelnost/page.tsx` titled "Политика за поверителност", and add `{ href: "/poveritelnost", label: "Поверителност" }` to `links` in `src/components/Footer.tsx`. Include a sitemap entry in `src/app/sitemap.ts`. It should contain:
   - **Controller:** Ivo's legal name and a contact email.
   - **Each processing activity** with its data, purpose and lawful basis:
     - comments: published name and text, plus IP hash for spam limits; Art. 6(1)(f);
     - ratings: IP hash so each visitor votes once; 6(1)(f);
     - newsletter: email; consent, 6(1)(a), withdrawable at any time;
     - hosting logs: 6(1)(f);
     - analytics: 6(1)(f), plus whatever ePrivacy route is chosen.
   - **Recipients:** Vercel (US, DPF and SCCs) and Supabase (EU database, with possible US and Singapore access under SCCs). Also the email sending service, once chosen.
   - **Retention** for each table (see recommendation 4).
   - **Rights:** access, rectification, erasure (Art. 17), objection (Art. 21) and withdrawal of consent.
   - **Complaints:** the right to complain to the Комисия за защита на личните данни (cpdp.bg).
   - **"Бисквитки и локално съхранение":** the storage table from section 1, saying that visitors get no cookies.
   - **Optional:** a "Изчисти запазеното на това устройство" button, which meets ЗЕТ Art. 4a(2).

2. **Add short notices at both forms.**
   - **`src/components/SubscribeForm.tsx`:** under the button, add "Ще използвам имейла ви само за известия за нови рецепти. Можете да се отпишете от всяко писмо. [Поверителност]".
   - **`src/components/CommentForm.tsx`:**
     - Extend `comment-name-hint`: "Името и коментарът ще се виждат публично. Може и само малко име или псевдоним."
     - Add near the submit button: "За защита от спам пазим неразпознаваем отпечатък на IP адреса. [Поверителност]".
   - Keep both notices short and use no checkbox. For comments, consent is not the lawful basis. For the newsletter, submitting the form is the clear affirmative act, and double opt-in confirms it.

3. **Stop the newsletter from disclosing subscribers.** `CopyEmailsButton` joins every address with ", ". Pasted into To or Cc, it shows every subscriber to every other one. That breaks the Art. 32 security duty and would be a reportable breach. Short term: label the button "копирай за поле Bcc" and paste only into Bcc. Proper fix: a sending service under a DPA, an unsubscribe link in every email, and a token-based `src/app/otpisvane/route.ts` that deletes the row. Files: `src/components/admin/CopyEmailsButton.tsx`, `src/app/admin/(protected)/subscribers/page.tsx`, `src/app/recepti/actions.ts`.

4. **Harden the IP hashes and limit how long they are kept** (`src/app/recepti/actions.ts:11,21-25`):
   - Fail closed: throw if `IP_HASH_SALT` is missing, instead of using the committed fallback.
   - Switch to `createHmac("sha256", key)`, the keyed one-way function EDPB 01/2025 para. 89 prefers.
   - Comments need the hash only for the 120-second rate limit (`actions.ts:12-14`). Null `comments.ip_hash` after 24 hours with a daily job. `pg_cron` is available but not installed, or use a Vercel Cron route.
   - Drop `subscribers.ip_hash`. Nothing reads it, and the DSK says an IP address is not proof of consent.
   - Ratings need the hash to keep one vote per visitor. The owner picks a period, for example 12 months, after which old rows are anonymised.
   - Add the live `comments.ip_hash` column and `count_recent_comments` to `supabase/schema.sql`, so the repo matches the database.

### Medium

5. **Add double opt-in for the newsletter.**
   - `subscribe` stores a pending row with a random token and sends a confirmation email.
   - The address becomes active only when the visitor clicks the link, for example at `src/app/abonament/potvardi/route.ts`.
   - Store `confirmed_at` and the version of the consent wording (DSK 3.3, EDPB 05/2020 para. 107).
   - Delete unconfirmed rows after a few days.
   - Files: `actions.ts`, `supabase/schema.sql`. This needs the sending service from recommendation 3.

6. **Decide on analytics and fix the code comment.** Replace `layout.tsx:99` with an accurate note. Options:
   - **(a) Keep both, with notice and an opt-out (my suggestion for a personal blog).**
     - Add a "Не броете посещенията ми" switch on the privacy page that sets a `localStorage` flag.
     - The flag makes `beforeSend` return `null`, which drops the event. Analytics documents `beforeSend` ([redacting data](https://vercel.com/docs/analytics/redacting-sensitive-data)), and the Speed Insights script exposes the same hook.
     - This meets the Bulgarian wording and WP29 4.3's safeguards, but not a strict consent reading.
   - **(b) Consent.**
     - Render `<Analytics />` and `<SpeedInsights />` only after "Приемам".
     - Give "Приемам" and "Отказвам" equal weight in one small bottom bar, with no pre-ticked boxes.
     - Store the choice with a date and wording version, and let a footer link "Настройки за бисквитки" reopen it.
     - Load nothing before consent, and allow no cookie wall.
     - SEO: keep it a fixed overlay so it shifts no layout (CLS) and covers little of the page, per Google.
   - **(c) Remove both packages.** This carries no ePrivacy risk.

7. **Give stored progress a lifetime.**
   - Store a timestamp with each `checked:`, `done:`, `servings:` and `cook:` value, and drop values older than about 30 days.
   - Delete `last-cooked` after 7 days instead of only ignoring it.
   - This brings the keys in line with WP29's short-lived exemption.
   - Files: `src/lib/useStoredSet.ts`, `src/lib/servings.ts`, `src/components/CookMode.tsx`, `src/lib/lastCooked.ts`.

8. **Write down how requests are handled.**
   - Comment and subscriber deletion already exist in the admin area (`schema.sql:292,433`).
   - Say in the notice that a rating cannot be traced to a person without their IP address.
   - Answer requests within one month.

### Low

9. **Admin cookie.** It lasts 400 days. WP29 3.2 does not exempt persistent login cookies, but only the owner receives this one. If the Supabase plan allows it, set a session time limit.
10. **Like button.** It calls Supabase straight from the browser, so visitors' IP addresses reach Supabase. A server action, like the one ratings use, would keep the call server-side. Supabase is a processor either way.
11. **Security headers.** `next.config.ts` already sets CSP, HSTS, `nosniff`, `frame-ancestors 'none'`, `Referrer-Policy` and a tight `Permissions-Policy` (including `browsing-topics=()`). No change is needed. If option 6(b) is chosen, the CSP already allows the first-party analytics paths.
12. **Data minimisation.** Comments ask only for a name and text, and newsletter sign-up only for an email. Keep it that way.

## 4. Facts only the owner can supply

- Legal name for the notice: does a first name meet "identity", or is a full name needed? And a contact email; a dedicated address is recommended.
- A postal address, or a decision that email alone is enough.
- How the newsletter is sent (a service, or personal email with Bcc), how often, and whether it ever carries advertising or affiliate links.
- Retention choices: comments (forever, or until requested), rating hashes (for example 12 months), subscribers after they unsubscribe (delete at once), and unconfirmed sign-ups.
- Whether `IP_HASH_SALT` is set in Vercel production, and whether the GitHub repo is public. I could not read the Vercel environment.
- The Vercel plan (sets the analytics reporting window) and the Supabase plan (log retention), and whether both DPAs are accepted.
- The analytics decision: 6(a), (b) or (c).
- Whether comments are, or will be, moderated before publication.

## Not verified

- **EUR-Lex** (ePrivacy Directive, GDPR) returned empty pages, and a direct download was blocked. Art. 5(3) wording comes from EDPB 2/2023 and WP194. The GDPR wording for Art. 4(5), 7(3), recital 32 and Art. 13 comes from the EDPB, taskforce and WP260 documents that quote them. GDPR Art. 5, 6, 17, 21, 25 and 32, recitals 26 and 49, the Art. 12(3) one-month deadline and ePrivacy Art. 13 are cited from general knowledge. Check them at [EUR-Lex GDPR](https://eur-lex.europa.eu/eli/reg/2016/679/oj) and [EUR-Lex ePrivacy](https://eur-lex.europa.eu/eli/dir/2002/58/oj).
- **CJEU Breyer (C-582/14) and Planet49 (C-673/17):** the curia.europa.eu pages did not load. The Breyer holding comes from search results that quote the Court's press release.
- **cpdp.bg** failed TLS verification, so I found no КЗЛД cookie guidance or official contact details. Copy them from cpdp.bg into the notice.
- **ЗЕТ text** is from an unofficial consolidation (kik-info.com, current to ДВ бр. 55/2026). The official source is Държавен вестник.
- **Vercel script behaviour:** I read the CDN copies at `va.vercel-scripts.com`. The first-party copy the site serves may differ, so check the browser's Application tab in production.
- **Lawful-basis choices** (6(1)(f) for comments, ratings and logs) are my recommendation, not a regulator's ruling.
- **Possible extra cookies:** Supabase may set a `-code-verifier` cookie during OAuth or password-reset flows, and Vercel may set `_vercel_jwt` on protected preview URLs. Neither appears on the production public site.

## Sources

- EDPB: [Guidelines 2/2023 on Art. 5(3), v2](https://www.edpb.europa.eu/system/files/documents/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf), [Guidelines 05/2020 on consent](https://www.edpb.europa.eu/system/files/documents/files/file1/edpb_guidelines_202005_consent_en.pdf), [Cookie banner taskforce report](https://www.edpb.europa.eu/system/files/2023-01/edpb_20230118_report_cookie_banner_taskforce_en.pdf), [Guidelines 01/2025 on pseudonymisation](https://www.edpb.europa.eu/system/files/2025-01/edpb_guidelines_202501_pseudonymisation_en.pdf)
- Article 29 WP: [Opinion 04/2012 (WP194)](https://ec.europa.eu/justice/article-29/documentation/opinion-recommendation/files/2012/wp194_en.pdf), [Transparency guidelines WP260 rev.01](https://ec.europa.eu/newsroom/article29/items/622227)
- Bulgaria: [Закон за електронната търговия (unofficial consolidation)](https://kik-info.com/normativna-baza/zakoni/0X2135530547/), [Закон за електронните съобщения (unofficial consolidation)](https://kik-info.com/normativna-baza/zakoni/0X2135553187/), [КЗЛД](https://www.cpdp.bg/) (unreachable)
- DSK (Germany): [Orientierungshilfe Direktwerbung, February 2022](https://www.datenschutzkonferenz-online.de/media/oh/OH-Werbung_Februar%202022_final.pdf)
- Vercel: [Web Analytics privacy](https://vercel.com/docs/analytics/privacy-policy), [Speed Insights privacy](https://vercel.com/docs/speed-insights/privacy-policy), [Web Analytics pricing and retention](https://vercel.com/docs/analytics/limits-and-pricing), [Troubleshooting (visitor hash)](https://vercel.com/docs/analytics/troubleshooting), [Privacy notice](https://vercel.com/legal/privacy-policy)
- Supabase: [SSR advanced guide](https://supabase.com/docs/guides/auth/server-side/advanced-guide), [Privacy policy](https://supabase.com/privacy)
- Google: [Avoid intrusive interstitials](https://developers.google.com/search/docs/appearance/avoid-intrusive-interstitials)
- Next.js: `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md` (self-hosted Google fonts)
