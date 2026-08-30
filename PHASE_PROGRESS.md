# MoleculeOS — Development Handoff

## 1. Where things stand

**Phase 1 (landing page + app shell): COMPLETE, verified, shipped.**

**Localization (Traditional Chinese, zh-TW): COMPLETE.** Every remaining hardcoded English string identified in the previous handoff has been swapped for dictionary reads, using the exact existing single-dictionary architecture (no rewrite, no `[locale]` routing introduced).

**Mobile-width QA (375 / 390 / 428px): COMPLETE.** Closed via static code review (live viewport-resize tooling was unavailable in this environment — see §4b). One real overflow bug was found and fixed (fixed-width testimonial cards); everything else checked out safe by construction.

**Phase 2 — Bond Explorer (`/bond-explorer`): COMPLETE, verified.** The first Phase 2 feature — a fully interactive 3D chemistry workspace, not a placeholder. See §8 below for the full write-up.

**Phase 2 — Molecule Library (`/molecule-library`): COMPLETE, verified.** The second Phase 2 feature — search + multi-filter + card grid + rich detail overlay across 20 molecules, reusing (not duplicating) Bond Explorer's 3D viewer. See §10 below for the full write-up.

**Phase 2 — Organic Chemistry Explorer (`/organic-chemistry`): COMPLETE, verified.** The third Phase 2 feature — an interactive knowledge map connecting functional groups → molecules → properties → reactions, plus a comparison tool. See §12 below for the full write-up.

**Visual redesign (MoleculeOS "deep black to ice blue" system): COMPLETE, verified.** A site-wide color system replacement — see §14 below for the full write-up.

**Phase 2 — everything else (Reaction Atlas, Periodic Table, AI Tutor, Quiz Center, Settings): NOT STARTED.** Per explicit instruction, do not begin without further direction.

## 2. Files changed this session

### Component literal → `dict.*` swaps
- `src/components/landing/interactive-demo-section.tsx` — eyebrow, heading, paragraph, `BOND_TYPES` now derived from `dict.interactiveDemo.bondTypes`, "Example:" label.
- `src/components/landing/categories-section.tsx` — eyebrow, heading.
- `src/components/landing/testimonials-section.tsx` — eyebrow, heading.
- `src/components/landing/stats-section.tsx` — heading.
- `src/components/landing/final-cta-section.tsx` — heading, paragraph, CTA.
- `src/lib/mock-data.ts` — `DEMO_TESTIMONIALS`, `DEMO_STATS`, `DEMO_CATEGORIES` now source copy from `dict.testimonials.items` / `dict.stats.items` / `dict.categories.items`; only non-translatable fields (id, accent, count, value/suffix) remain hardcoded in this file.
- `src/components/ui/demo-data-badge.tsx` — badge text from `dict.common.demoData`.
- `src/components/ui/card-stack.tsx` — both aria-labels (`dict.common.ariaGoTo` + item title, `dict.common.ariaOpenLink`), and a new `dict.common.noImage` empty-state key.
- `src/components/coming-soon.tsx` — eyebrow (`dict.common.comingSoon`), back link (`dict.common.backToHome`).
- All 8 `src/app/{route}/page.tsx` files (`bond-explorer`, `organic-chemistry`, `molecule-library`, `reaction-atlas`, `periodic-table`, `ai-tutor`, `quiz`, `settings`) — `metadata.title` and `<ComingSoon>` props now read from `dict.pages.*`.

### Dictionary additions
- `src/locales/zh-TW.json` and `src/locales/en.json` — added `common.noImage` ("無圖片" / "No image") for the `CardStack` component's image-missing fallback (not reachable with current data, but part of the shared component's text surface).

### CJK typography
- `src/app/globals.css` — `--font-sans` is now `var(--font-geist-sans), "PingFang TC", "Heiti TC", "Microsoft JhengHei", "Noto Sans TC", sans-serif` (system CJK stack, no webfont).
- Removed `uppercase`/`tracking-widest` from all remaining CJK eyebrow labels: `interactive-demo-section.tsx`, `categories-section.tsx`, `testimonials-section.tsx`, `coming-soon.tsx`, `demo-data-badge.tsx` (also bumped badge text from `text-[10px]` to `text-[11px]` since uppercase compensated for small size on Latin text; unnecessary and slightly cramped for CJK).
- Full `uppercase`/`tracking-widest` grep across `src/components` returns no matches — sweep is complete.
- `tracking-wide` (mild, no `uppercase`) intentionally left on footer column headings and the mobile-nav menu label — pre-existing, subtle, and not the "wide-tracking-on-square-glyphs" problem the sweep targeted.

### Tooling
- `package.json` — added `"typecheck": "tsc --noEmit"` script (was missing).

### Mobile overflow fix (this session)
- `src/hooks/use-media-query.ts` — **new**. Generic `useMediaQuery(query)` hook, following the same `useSyncExternalStore` pattern as `use-reduced-motion.ts`/`use-has-mounted.ts` (SSR-safe, defaults to `false` on the server).
- `src/components/landing/testimonials-section.tsx` — `CardStack` was receiving a **fixed** `cardWidth={420}`/`cardHeight={260}`, wider than the available content width at every mobile breakpoint (327–380px after the section's `px-6` padding). The active/centered card was guaranteed to be clipped by the section's `overflow-hidden`, cutting off quote text and the name/avatar row. Fixed by sizing the card responsively: `useMediaQuery("(max-width: 639px)")` → `cardWidth: 290, cardHeight: 236` below the `sm` breakpoint (matches the codebase's existing `sm` convention), `420×260` unchanged at `sm` and up. `CardStack` itself was not modified — it already accepted these as props; only the caller's values changed.

## 3. Verification results

- `npm run lint` — **pass**, no warnings or errors.
- `npm run typecheck` — **pass**. The `en satisfies Dictionary` check in `src/lib/i18n/dictionaries.ts` confirms `zh-TW.json` and `en.json` remain key-shape identical after all edits.
- `npm run build` — **pass**. All 10 routes (`/`, `/ai-tutor`, `/bond-explorer`, `/molecule-library`, `/organic-chemistry`, `/periodic-table`, `/quiz`, `/reaction-atlas`, `/settings`, `/_not-found`) compile and prerender as static content.
- Full-repo grep sweep for hardcoded English UI text (aria-labels, alt text, placeholders, JSX text nodes) — clean; nothing left outside the dictionaries themselves and non-translatable code/technical strings (component names, CSS classes, hex colors, chemical formulas like `Na⁺ Cl⁻`, `H₂O`).
- Re-ran lint/typecheck/build after the mobile fix (§2) — all **pass** clean, same 10 routes.

## 4. Browser QA results

Verified in Chrome at desktop width (1440px) in both dark and light themes:
- Homepage: hero, features, interactive demo, categories, testimonials (card stack with the 5 Taiwanese personas), stats, final CTA — all render correctly localized, CJK font renders cleanly (no tofu/fallback-serif), numbers/formulas stay LTR and legible against CJK text (`1,240+`, `92K+`, `Na⁺ Cl⁻`).
- Desktop navigation (8 items) fits without wrapping or overflow at 1440px.
- Theme toggle: light/dark switch works, all text remains correctly localized and legible in both themes.
- `/bond-explorer` (Coming Soon route): tab title, eyebrow, heading, description, and back-link all correctly localized.
- Console: no hydration errors, no React errors/warnings. Only expected dev-mode noise (HMR connected, React DevTools suggestion, a `THREE.Clock` deprecation warning from `three` unrelated to this work).
- One transient visual note: scrolling to certain mid-section positions can show heading text passing behind the fixed navbar's non-pill margin area. This is pre-existing fixed-header scroll behavior present since Phase 1 (same would occur with English copy) — not a regression from localization work.

## 4b. Mobile-width QA (375 / 390 / 428px) — closed via static code review

Live viewport testing was attempted again this session and remains blocked: the Chrome extension's `resize_window` reports success but never changes `window.innerWidth` (stayed at ~1439px across 3 tabs and multiple requested sizes), and an OS-level `user32.dll` `MoveWindow`/`ShowWindow` resize (via PowerShell, targeting the actual Chrome window handle) also reported success with no effect on the viewport the extension reads — strongly suggesting the automation extension is driving a Chrome instance/window not visible to the OS session running these tools. Per user direction, this was closed via a thorough static review of every component's responsive classes and pixel-based sizing instead of live screenshots.

**Method:** for each section, computed available content width at 375/390/428px (viewport minus the section's own padding, e.g. `px-6` = 24px/side below `sm`), then checked every fixed-pixel dimension, breakpoint class, and flex/grid behavior against that budget.

**Result — one real bug found and fixed** (see §2, "Mobile overflow fix"): `TestimonialsSection`'s `CardStack` used a fixed 420px card width, wider than the 327–380px available at every tested breakpoint, clipping the active card's text against the section's `overflow-hidden`. Fixed with a responsive `useMediaQuery`-driven size (290×236 below `sm`).

**Everything else checked out safe by construction:**
- **Navigation:** desktop nav (`hidden ... xl:flex`), the CTA button and theme toggle (`hidden sm:block` / `hidden sm:inline-flex`) are all hidden below their breakpoints, leaving only the logo + hamburger at mobile widths — no overflow possible. `mobile-nav.tsx`'s per-item description text is `hidden ... sm:block`, so the narrow-viewport menu only ever shows icon + label (max ~165px content in a ~340px+ available row) — verified by reading the source, not just the classes.
- **Hero + 3D molecule:** headline (`text-4xl` below `sm`) fits its column width with 30–40px of slack at all three test widths; CTA buttons stack via `flex-col` below `sm`; the R3F `<Canvas>` sizes to its parent (`aspect-square w-full max-w-xl`) via its own internal ResizeObserver, no fixed pixel dimensions anywhere in `hero-molecule-scene.tsx`. The scroll-hint indicator is `hidden ... sm:flex` (not shown on mobile at all, so nothing to overflow).
- **Feature cards:** `grid-cols-1` below `md`, all SVG visuals use `viewBox` + `w-full`/`h-full` or percentage/grid-based sizing — no fixed pixel widths that don't scale.
- **Interactive demo:** `grid-cols-1` below `lg` (bond list stacks above the visual panel); the "Example: …" pill has an estimated 23–27px of slack at 375px in the worst case (longest example string) — tight but fits on one line by calculation; flagged as a low-risk watch item, not changed (no visual confirmation possible, and the pill is not fixed-width — if it ever does wrap, it just grows taller, no page-level overflow).
- **Categories / Stats / Final CTA:** all headings wrap normally within their column (no fixed widths); header rows use `flex flex-wrap`, so the `DemoDataBadge` drops to its own line rather than overflowing if space is tight.
- **Footer:** all links/columns are in a `grid-cols-2` (2-up) layout at mobile widths, no fixed pixel widths.
- **Decorative elements:** `HeroBackground`'s aurora blobs use large fixed `rem` sizes but live inside an `overflow-hidden` `absolute inset-0` parent — cannot cause page-level horizontal scroll regardless of viewport width. Same for `CardStack`'s own glow divs (`w-[70%]`/`w-[76%]`, percentage-based).
- Full-codebase grep for `width:`/`min-w-[`/`w-[` fixed-pixel patterns confirmed the testimonial card was the only non-percentage, non-viewBox fixed dimension capable of exceeding a mobile viewport.

**Not verified (inherent limit of static review, not a known defect):** actual rendered CJK glyph metrics may differ slightly from the ~1em-per-character estimate used in these calculations; touch-drag interaction on the card stack's swipe gesture and real device performance/rendering of the 3D scene were reasoned about from code but not physically touch-tested. Recommend a real-device pass at some point, but no further specific risk is expected based on this review.

## 5. Known bugs / issues

None introduced by this session's work. The only open item is the unverified mobile viewport (see above) — a tooling gap, not a known defect.

Carried-over gotchas from earlier phases, still valid:
- **lucide-react in this project has dropped all brand/logo icons** (no `Github`, `Twitter`, `Youtube`, etc.) — footer uses generic `Globe`/`MessageCircle`/`Rss` instead.
- This repo's ESLint config enforces `react-hooks/set-state-in-effect` and `react-hooks/refs`. Fix patterns already in the codebase: `useSyncExternalStore` (`use-reduced-motion.ts`, `use-has-mounted.ts`), and the "adjust state during render" pattern (`card-stack.tsx`, `mobile-nav.tsx`).

## 6. Architecture decisions preserved (do not change without explicit instruction)

- **No `[locale]` URL routing.** Single resolved `dict` singleton, `defaultLocale = "zh-TW"`.
- **`dict` is imported directly into both Client and Server Components** — safe, no secrets in the JSON.
- **`en.json` is a faithful mirror of the original English copy**, kept in sync only for type-shape parity (`en satisfies Dictionary`), not actively served.
- **Testimonial personas are localized as people**, not literal name translations — 5 Taiwanese personas in `zh-TW.json`, distinct from the 5 Western personas in `en.json`.
- **System CJK font stack, not a webfont** — avoids multi-MB Noto Sans TC payloads.

## 7. Recommended next step (superseded — see §8/§9)

Localization and mobile-width QA (375/390/428px) are both complete — lint/typecheck/build all pass. Bond Explorer (§8) has since been built as the first Phase 2 feature.

## 8. Phase 2 — Bond Explorer (`/bond-explorer`)

**Status: COMPLETE, verified.** Full interactive 3D chemistry workspace — not a "Coming Soon" placeholder, not a static article. Replaces the old `<ComingSoon>` render entirely.

### Architecture

- **Data layer** (`src/lib/chemistry/`) — structural/technical data only, no display text:
  - `bond-types.ts` — the 5 bond category ids (`ionic`, `covalent`, `polarCovalent`, `metallic`, `hydrogen`), their accent color, associated molecule ids, default molecule, and a `classifyElectronegativityDifference()` helper using the standard textbook ΔEN thresholds (nonpolar <0.4, polar 0.4–1.7, ionic ≥1.7).
  - `molecules.ts` — 10 molecule specs (NaCl, H₂, Cl₂, CH₄, CO₂, HCl, H₂O, NH₃, an Fe lattice, and an H₂O···H₂O hydrogen-bond dimer) with simplified 3D atom coordinates, real Pauling-scale electronegativity values (`ELECTRONEGATIVITY` map — not invented numbers), and bond lists.
  - `quiz-data.ts` — which question ids exist per bond type and which option index is correct. The actual question/option/explanation text lives in the dictionary, not here.
- **All user-facing text** lives in `dict.bondExplorer.*` (both `zh-TW.json` and `en.json`, kept in type parity via the existing `en satisfies Dictionary` check) — section labels, the 8 required info fields × 5 bond types, mode toggle, control hints, polarity panel labels, molecule names/descriptions, and 10 quiz questions (2 per bond type) with explanations.
- **Components** (`src/components/chemistry/`): `BondSelector`, `AtomVisualization` (2D SVG electron-behavior schematic), `BondVisualization` (dynamically-imported R3F 3D scene, `ssr:false`, pulsing-gradient loading fallback matching the existing `hero-molecule.tsx` pattern), `BondInfoPanel`, `BondPolarityPanel`, `MoleculeExample`, `BondQuiz`, `LearningModeToggle`, plus the page composition root `BondExplorerWorkspace`. `ElectronAnimation` is the shared low-level animated-electron-dot primitive used by the 2D diagrams.
- **3D scene mechanics**: atoms are spheres with `Html` (drei) element/charge labels; covalent bonds render a cylinder + an orbiting shared-electron-pair group (biased toward the more electronegative atom for polar bonds); ionic bonds render a single electron particle that flies from donor to acceptor on a timed loop (or parks statically at the destination under reduced motion) plus a pulsing attraction-glow cylinder; hydrogen bonds render a thin pulsing dashed-style cylinder; the metallic lattice renders a 3×3 ion grid plus 18 freely-drifting "electron sea" particles. `OrbitControls` (drei) provides drag-rotate/scroll-zoom/damping/auto-rotate (disabled under reduced motion). Bond-type and molecule switches remount an inner `<group key=...>` (triggering a scale-in "pop" via `useFrame`) instead of using imperative refs — "reset view" and "replay electron flow" are plain incrementing-number props (`viewResetToken`, `replayToken`), not refs, keeping the dynamic-import boundary simple.
- **Page layout**: CSS Grid, `grid-cols-1` below `lg` (stacks: nav tabs → 3D viz + controls → info panel → examples → quiz), `lg:grid-cols-[220px_1fr_360px]` + explicit `col-start`/`row-start`/`row-span` above `lg` (nav and info panel both span two rows framing the center column's viz-on-top/examples-below arrangement). `BondSelector` itself switches from a horizontal scrollable tab row to a vertical list at the same `lg` breakpoint.
- **Learning modes**: `explore` (visualization-focused, info panel collapsed to tagline only, examples/quiz/polarity panel hidden) vs `learn` (full info panel, 2D electron schematic + polarity panel, molecule examples, and quiz all shown). Toggle is a segmented pill (`LearningModeToggle`), matching the site's existing pill/toggle visual language.
- **Quiz**: 2 questions per bond type, single-select with an explicit "confirm answer" step (immediate correct/incorrect visual feedback + explanation), score tracked per session, resets via `key={bondTypeId}` on the parent.

### Verification results

- `npm run lint` — pass, no warnings.
- `npm run typecheck` — pass.
- `npm run build` — pass, all 10 routes (including `/bond-explorer`) compile and prerender.
- Ran twice: once after initial implementation, once after a small post-QA fix (see below) — both clean.

### Browser QA results

**Desktop (1440px-class window, live-tested in Chrome):**
- All 5 bond types verified individually: ionic (NaCl, electron-transfer particle + charge labels), covalent (H₂/CO₂, shared-electron orbit, double-bond thicker cylinder), polar covalent (HCl, skewed electron orbit + δ+/δ− labels), metallic (Fe lattice + drifting electron sea), hydrogen (H₂O dimer, dashed weak bond) — all render correctly with no clipping.
- Info panel content, molecule-example switching (e.g. CO₂ within the covalent category), quiz flow (select → confirm → feedback → next, score increments correctly, second question loads with fresh state), explore/learn mode toggle, drag-to-rotate, scroll-to-zoom, and the reset-view button were all interactively tested and work correctly.
- Console: no hydration errors, no React warnings, no errors. Only expected dev-noise (HMR, React DevTools suggestion, `THREE.Clock` deprecation warning — pre-existing, unrelated to this feature).
- One bug found and fixed during QA: `MoleculeExample`'s formula text used `font-mono`, which rendered "HCl" ambiguously as "HC1" (lowercase L reads as a numeral 1 in that font at small size) — a real readability defect in a chemistry tool. Fixed by dropping `font-mono` on that one label (the rest of Bond Explorer already renders formulas without it); the pre-existing landing page's own use of `font-mono` for formulas elsewhere was left untouched (out of scope, not part of this feature).
- Two apparent "bugs" during manual QA turned out to be `AnimatePresence`-transition screenshots taken mid-fade (0.25–0.3s), not real defects — confirmed by re-checking after the transition settled. Noted here so a future session doesn't rediscover the same false alarm.

**Tablet (768px) and Mobile (375/390/428px): verified via static code review**, not live screenshots — the Chrome extension's `resize_window` tool still does not change the actual viewport in this environment (confirmed broken in the localization QA session and reconfirmed not worth re-litigating here). Reviewed every responsive class actually used:
- `BondSelector` and the main grid both collapse at the same single breakpoint (`lg`, 1024px): below it, nav becomes a horizontal `overflow-x-auto` tab row and the 3-column grid becomes `grid-cols-1`, stacking in DOM order nav → visualization+controls → (learn-mode extras) → info panel → examples → quiz — satisfying "info panel moves below the visualization" exactly as specified.
- 3D canvas container has explicit responsive heights (`h-[340px] sm:h-[400px] lg:h-[440px]`) and fills its parent width — R3F's Canvas resizes via its own ResizeObserver, no hardcoded desktop-only pixel assumptions; camera framing (fov 42, distance 6.5) was checked against the widest molecule (the H₂O dimer, ~4 units wide) against the visible frustum width at a near-square mobile aspect ratio (~5 units) — comfortable margin, no clipping expected.
- `AtomVisualization`/`BondPolarityPanel` pair stacks to one column below `sm` (640px) — never squeezed side-by-side on any tested mobile width.
- `MoleculeExample` chips and `BondSelector` buttons both live inside their own scoped `overflow-x-auto` row, so neither can cause page-level horizontal overflow regardless of viewport width.
- Touch targets: quiz options and molecule-example chips are ≥36px tall; the two visualization control buttons are `h-9` (36px). Considered adequate.
- Not verified: actual rendered touch-drag behavior of `OrbitControls` on a real touchscreen, and real device GPU performance of the 3D scene. Reasoned as low-risk (drei's `OrbitControls` handles touch out of the box) but flagging as the one gap in this pass, consistent with how the previous mobile QA session flagged its equivalent gap.

### Known limitations

- Tablet/mobile QA is code-review-based, not visually confirmed (tooling gap, see above).
- The bond-selector's single `lg` breakpoint means tablet (768px) gets the same stacked, horizontal-tab layout as phone widths rather than a dedicated tablet layout — a deliberate scope decision (spec required a working mobile layout, not a distinct tablet-specific one), not an oversight.
- Real-device touch/performance testing of the 3D scene has not been done.
- Only 2 quiz questions per bond type (10 total) — a deliberate scope decision to keep the feature shippable in one session; more can be added to `quiz-data.ts` + the dictionary later without any architecture change.

## 9. Recommended next step (superseded — see §10/§11)

Bond Explorer is complete and verified (mobile/tablet via static review — see §8's known limitations). Molecule Library (§10) has since been built as the second Phase 2 feature, reusing Bond Explorer's 3D infrastructure rather than duplicating it.

## 10. Phase 2 — Molecule Library (`/molecule-library`)

**Status: COMPLETE, verified.** A full search/filter/browse/detail experience across 20 molecules — not a plain searchable table. Replaces the old `<ComingSoon>` render entirely.

### Architecture

- **Data layer** (`src/lib/chemistry/`), extending rather than duplicating Bond Explorer's:
  - `molecules.ts` — extended with 13 new molecule entries (O₂, N₂, methanol, ethanol, acetic acid, acetone, benzene, acetaldehyde, methyl acetate, ethylene, acetylene, methylamine, acetamide) alongside the 10 Bond-Explorer-only entries already there. Added a `covalent-triple` bond kind (for N₂'s triple bond and acetylene's C≡C) to the existing `BondSpec` union — additive, no existing entries touched.
  - `functional-groups.ts` — **new**. 9 functional groups (hydroxyl, carbonyl, carboxyl, ester, amino, amide, alkene, alkyne, aromatic) as structural metadata (id + universal-notation formula fragment); explicitly designed to be reusable by the future Organic Chemistry page per the spec.
  - `molecule-library-data.ts` — **new**. Per-molecule library metadata (category, real molecular weight in g/mol, functional group ids, geometry, polarity classification, related-molecule ids) keyed by the same ids as `molecules.ts`, kept in a separate file so Bond Explorer's `MoleculeSpec` shape isn't constrained by Library-only concerns. All 12 spec'd categories (無機/有機化合物, 醇/醛/酮/羧酸/酯/胺/烷/烯/炔/芳香族) have at least one real molecule; `isOrganic` is a derived boolean so the "有機/無機化合物" umbrella filters work as unions over the more specific categories rather than requiring their own dedicated molecules. *(Updated in §12: two more categories — `ether` and `amide` — were added when Organic Chemistry needed them; see §12.)*
- **All user-facing text** lives in `dict.moleculeLibrary.*` (both locale files) — page copy, search/filter/detail/viewer-control labels, 12 category names, 9 functional-group name+description pairs, 7 geometry labels, and per-molecule name/common-uses/safety-notes/fun-fact content for all 20 molecules. Molecular weights and chemistry facts are real (Wikipedia/general-chemistry-level common knowledge); 3D coordinates are explicitly labeled a teaching illustration via `dict.moleculeLibrary.demoNotice` and a per-viewer `teachingNote` caption, kept visually and structurally separate from the factual property fields (MW, geometry, polarity, uses) — satisfying the "clearly distinguish teaching illustration from actual data" requirement.
- **Reused, not duplicated, 3D viewer**: `BondVisualization`/`BondVisualizationScene` (Bond Explorer's) gained optional, backward-compatible props — `showLabels`, `showBonds`, `renderMode` (`"ballAndStick"` default / `"spaceFilling"`), `enablePan`, `autoRotate` — all defaulting to Bond Explorer's exact original behavior, so Bond Explorer's own call site needed zero changes. `CovalentBondMesh` was generalized from a `double: boolean` prop to a `bondOrder: 1|2|3` prop to render the new triple bonds (thicker cylinder), again with existing single/double behavior unchanged.
- **Components** (`src/components/chemistry/`): `MoleculeCard` (grid card with a CSS 3D mouse-tilt hover effect and a 2D `AtomVisualization` preview — see performance note below), `MoleculeSearch` (text input + live suggestions dropdown), `MoleculeFilters` (category/functional-group/polarity chip toggles + weight/atom-count numeric range inputs, all composable), `MoleculeDetail` (full-screen overlay: 3D viewer + viewer controls + info/properties + related molecules), `RelatedMolecules`, `FunctionalGroupBadge`, `PolarityIndicator`, plus the page composition root `MoleculeLibraryWorkspace`.
- **Performance**: cards use the lightweight 2D `AtomVisualization` SVG preview (already built for Bond Explorer, reused as-is) instead of a live 3D canvas per card — rendering 20 concurrent WebGL contexts (each with its own lighting + bloom post-processing) would be a real performance problem, and the spec explicitly warned against loading all 3D molecules simultaneously. The one full interactive 3D `BondVisualization` canvas only mounts when a molecule's detail overlay is opened (already dynamically imported with `ssr:false` from Bond Explorer's original work), and unmounts when closed.
- **Search**: matches Chinese name, English name, formula, category name, and functional-group names via a single precomputed lowercase "haystack" string per molecule (built once at module scope, not on every keystroke). Supports live suggestions (top 6 matches), a clear button, and a result count.
- **Filters compose with AND logic and with search**: category (with organic/inorganic as derived union filters over the specific subtypes), functional group (multi-select, "any match"), polarity (single-select: all/polar/nonpolar/ionic), molecular-weight range, and atom-count range all narrow the same result set together with the search query.
- **Detail view controls**: auto-rotate on/off, atom-label toggle, bond visibility toggle, ball-and-stick ↔ space-filling toggle, reset view (remounts the Canvas via a `viewResetToken` key, consistent with Bond Explorer's existing reset pattern) — all backed by the extended shared viewer, not new 3D code.
- **Bond Explorer integration**: the detail view's "探索這個分子中的化學鍵" button links to `/bond-explorer?bondType=<molecule's dominant bond type>`. Bond Explorer's page was given a small `BondExplorerWithSearchParams` wrapper (`useSearchParams()`, under a `Suspense` boundary) that reads this param and preselects the matching bond category on load — `BondExplorerWorkspace` itself just gained an optional `initialBondTypeId` prop; default behavior (no param) is unchanged. Confirmed via build output that `/bond-explorer` remains statically prerendered despite this.
- **Related molecules**: driven entirely by the `relatedMoleculeIds` structured data in `molecule-library-data.ts` (e.g. ethanol → methanol, acetic acid, acetaldehyde — matching the exact example relationship given in the spec), not hardcoded UI links.
- **Responsive layout**: main content grid is `grid-cols-1` below `lg` (1024px) and `lg:grid-cols-[280px_1fr]` at/above it — filters sit beside the card grid on desktop/wide-tablet, stack above it on narrower screens. The detail overlay is `grid-cols-1 lg:grid-cols-[1fr_420px]` — 3D viewer left / info right on desktop, and on mobile stacks in the order 3D viewer → properties/info (name, formula, MW, geometry, polarity, bond types, functional groups, common uses, safety, fun fact) → "explore bonds" link → related molecules, satisfying the spec's required mobile order.

### Verification results

- `npm run lint` — pass, no warnings.
- `npm run typecheck` — pass (confirms `en satisfies Dictionary` still holds after the `moleculeLibrary` dictionary additions).
- `npm run build` — pass, all 10 routes compile and prerender, including confirming `/bond-explorer` is unaffected by its new `Suspense`/`useSearchParams` wrapper.

### Browser QA results (live Chrome testing)

- Full card grid renders correctly: all 20 molecules with correct 2D previews, names, formulas, molecular weight, atom count, polarity indicator, category label, and functional-group badges.
- Search verified working for both English (`benzene`) and Traditional Chinese (`乙醇`) queries, with correct live suggestions and instant result narrowing.
- Empty state verified: nonsense query correctly shows the flask icon + "找不到符合的分子" + hint text.
- Filters verified individually and **in combination**: polarity="極性" + functional group="氫氧基（羥基）" together correctly narrowed 20 molecules down to exactly methanol + ethanol — confirms AND-composition across filter dimensions works.
- Detail overlay verified for ethanol: 3D structure renders correctly (C–C–O–H chain, 9 atoms, correct δ+/δ− labels, shared-electron-pair dots on every bond), all info/property fields populated correctly, space-filling mode toggle verified (atoms enlarge, bonds hide, as expected), close button works.
- Bond Explorer integration verified end-to-end: clicking "explore this molecule's bonds" from ethanol's detail view navigated to `/bond-explorer?bondType=polarCovalent` and correctly preselected 極性共價鍵 (Polar Covalent Bond) as the active category.
- Light theme verified: full page (search, filters, cards) readable and correctly styled with no contrast issues.
- Console: no hydration errors, no React warnings/errors across the whole session (only expected dev-mode noise: HMR, React DevTools suggestion, `THREE.Clock` deprecation warning from `three`, pre-existing and unrelated).
- Desktop/tablet/mobile (1024/768/428/390/375px): verified via static code review, consistent with the established method from earlier QA passes in this project (live `resize_window` tooling remains non-functional in this environment). Reviewed every responsive class used in the workspace, filters panel, card grid, and detail overlay — confirmed the layout collapses cleanly to a single stacked column below `lg` with no fixed-pixel elements that could cause page-level horizontal overflow (all horizontal-scroll elements — search suggestions, related-molecule chips — are scoped to their own row).

### Known limitations

- Tablet/mobile QA is code-review-based, not visually confirmed (same tooling gap as Bond Explorer's QA pass).
- The molecular-weight and atom-count range filters use plain paired number inputs rather than a dual-handle slider — a deliberate scope/complexity trade-off; functionally correct and touch-usable, if less visually "premium" than a custom slider would be.
- Real-device touch/performance testing of the 3D scene (in space-filling mode, and with the new triple-bond rendering) has not been done.
- Only 20 molecules are included (versus the 15 minimum requested) — chosen to give every one of the 12 filter categories at least one real example; more can be added to `molecules.ts` + `molecule-library-data.ts` + the dictionary later without any architecture change.
- `MoleculeDetail`'s mobile layout combines "Information" and "Properties" into one continuous flow rather than two hard-separated labeled sections — the content order still matches the spec's required sequence (3D → properties/info → related), just without an explicit visual section break between the two.

## 11. Recommended next step (superseded — see §12/§13)

Bond Explorer and Molecule Library were both complete and verified. Organic Chemistry Explorer (§12) has since been built as the third Phase 2 feature.

## 12. Phase 2 — Organic Chemistry Explorer (`/organic-chemistry`)

**Status: COMPLETE, verified.** An interactive knowledge map connecting Functional Groups → Molecules → Properties → Reactions → (the seed of) Reaction Mechanisms — not a textbook page. Replaces the old `<ComingSoon>` render entirely.

### Architecture

- **Data layer additions** (`src/lib/chemistry/`), extending rather than duplicating existing files:
  - `molecule-library-data.ts` — added `"ether"` and `"amide"` to the `MoleculeCategory` union (14 categories total now). Reassigned `acetamide`'s category from the generic `"organic"` fallback (a known gap noted in §10) to the new proper `"amide"` category. Added one new molecule, `dimethylEther` (chosen deliberately: it's a real structural isomer of ethanol, C₂H₆O, which made for a genuine "fun fact" rather than an arbitrary filler molecule).
  - `molecules.ts` — added dimethyl ether's 3D structure (9 atoms), no other entries touched.
  - `organic-chemistry.ts` — **new**. Maps each of 12 `OrganicCategoryId`s to an optional `functionalGroupId` (reusing `functional-groups.ts` — alkane and ether have none, matching real chemistry: neither has a single-atom-group signature the way alcohols have -OH) and a list of representative molecule ids (reusing `molecule-library-data.ts`/`molecules.ts`). Holds no display text and no duplicated functional-group data.
  - `organic-reactions.ts` — **new**. A 10-edge reaction graph (`alkyne→alkene→alkane` hydrogenation chain, `alkene→alcohol` addition, `alcohol→aldehyde/ketone` oxidation, `aldehyde→carboxylicAcid` oxidation, `alcohol→ether` condensation, `carboxylicAcid⇌ester` esterification/hydrolysis, `carboxylicAcid→amide` amidation) — structural data only, explicitly the seed for the future Reaction Atlas per the spec.
- **All user-facing text** lives in `dict.organicChemistry.*` (both locale files) — page copy, section/action/learning-step labels, 7 reaction-type names, bilingual category name pairs, and full generalStructure/characteristicAtoms/bondPattern/keyProperties/commonReactions prose for all 12 categories, in natural Traditional Chinese chemistry terminology.
- **Components** (`src/components/chemistry/`): `OrganicCategorySelector` (horizontal chip strip, reuses `dict.moleculeLibrary.categories` for labels rather than duplicating category names), `OrganicKnowledgeMap` (hand-laid-out SVG node/edge graph — deliberately not a physics-simulated force-directed graph, to keep node positions predictable and responsive-safe), `FunctionalGroupDetailPanel` (LEFT), `OrganicPropertiesPanel` (RIGHT, reuses `RelatedMolecules` from Molecule Library for the representative-molecule chips rather than building a new chip component), `FunctionalGroupComparison`, plus the page root `OrganicChemistryWorkspace`. **No new 3D component** — the "CENTER: 3D representative molecule" requirement is served entirely by the existing `BondVisualization`.
- **Interactive Structure View** (spec §4): a `grid-cols-1 lg:grid-cols-[340px_1fr_320px]` layout — LEFT info panel, CENTER 3D viewer (with the same rotate/zoom/replay/reset controls as Bond Explorer and Molecule Library), RIGHT properties panel. Switching categories or representative molecules reuses the established `replayToken`/`viewResetToken` remount pattern — no new animation system.
- **Knowledge map** (spec §5): 12 nodes at fixed SVG coordinates (not force-simulated), edges drawn with `framer-motion` path-draw-in animation, reaction-type labels at each edge midpoint; reciprocal edges between the same two categories (esterification/hydrolysis between carboxylic acid and ester) are merged into one bidirectional-looking connector with both labels rather than drawing two overlapping arrows. Clicking any node updates the selected category, same as the selector strip above it.
- **Learning mode** (spec §8): `探索模式` shows everything at once, focused on the map + 3D. `學習模式` adds a 5-step guided reveal (辨識官能基 → 認識結構 → 了解性質 → 代表分子 → 典型反應) with Back/Next controls — each step progressively reveals more of the LEFT/RIGHT panel content rather than showing it all immediately. Reuses the exact same `LearningModeToggle` component and `dict.bondExplorer.modeToggle` copy as Bond Explorer (legitimate reuse — same UI concept, same text, zero duplication).
- **Comparison tool** (spec §9): `FunctionalGroupComparison` shows two categories side by side (2D structure preview, functional-group badge, general structure, bond pattern, polarity, common reactions) — the structural difference is highlighted by direct visual juxtaposition of the two `AtomVisualization` previews rather than a separately-authored "diff" paragraph.
- **Cross-feature integration**: "在分子資料庫中查看" links to `/molecule-library?molecule=<id>`; "探索這個化學鍵" links to `/bond-explorer?bondType=<id>`. The Bond Explorer link reused the existing mechanism unchanged. The Molecule Library link required a new symmetric integration point: `MoleculeLibraryWorkspace` gained an optional `initialSelectedId` prop, and a new `MoleculeLibraryWithSearchParams` wrapper (`useSearchParams()` under `Suspense`, mirroring `BondExplorerWithSearchParams` exactly) reads `?molecule=` and auto-opens that molecule's detail overlay on load. Molecule Library's own default behavior (no param) is unchanged.

### Verification results

- `npm run lint` — one real error caught and fixed (`React.useMemo(buildDisplayEdges, [])` — ESLint's `react-hooks/use-memo` rule requires an inline function expression, not a named function reference; fixed to `React.useMemo(() => buildDisplayEdges(), [])`). Clean after the fix.
- `npm run typecheck` — pass (confirms `en satisfies Dictionary` holds after the `organicChemistry` and category-name additions).
- `npm run build` — pass, all 10 routes compile and prerender, including confirming `/molecule-library`'s new `Suspense`/`useSearchParams` wrapper doesn't break its static prerendering.

### Browser QA results (live Chrome testing)

- Category selector (12 chips with icons) and knowledge map both render correctly; map shows all 12 nodes with correct positions, all 10 reaction edges with correct labels (including the merged bidirectional 酯化/水解 connector between carboxylic acid and ester), and the active node (醇類/Alcohols) highlighted with a gradient fill.
- Interactive Structure View verified for the alcohol category: LEFT panel shows name pair, hydroxyl functional-group badge, structure text, polarity; CENTER renders ethanol's 3D structure correctly (same rendering quality as Bond Explorer/Molecule Library); RIGHT panel populated correctly.
- Learn mode's 5-step progressive reveal verified end-to-end: stepped from 1/5 through 4/5, confirming characteristic-atoms/bond-pattern (LEFT) and key-properties/representative-molecules/library-link (RIGHT) each appear exactly at their intended step, not before.
- Molecule Library deep link verified: clicking "在分子資料庫中查看" from ethanol navigated to `/molecule-library?molecule=ethanol` and correctly auto-opened ethanol's detail overlay.
- Comparison tool verified: opened the comparison panel, selected "烷類" (Alkanes) as the second category via the native `<select>` (interacted via keyboard since native select popups don't render in automation screenshots), and confirmed both columns populate correctly with visibly different structure/polarity/reactions content (醇類 polar vs 烷類 nonpolar).
- Console: no hydration errors, no React errors, across the entire session (only expected dev-mode noise, consistent with every prior QA pass in this project).
- Desktop/tablet/mobile (1024/768/428/390/375px): verified via static code review, consistent with the established method. The category selector and knowledge map both use their own `overflow-x-auto` containers (the map's SVG is intentionally fixed-width per the spec's explicit "use horizontal scrolling... do not simply shrink the desktop graph" guidance); the 3-column structure view collapses to a single stacked column (info → 3D → properties) below `lg`; the comparison grid stacks below `sm`. No fixed-width element identified that could cause page-level horizontal overflow.

### Known limitations

- Tablet/mobile QA is code-review-based, not visually confirmed (same tooling gap as every prior QA pass in this project).
- The knowledge map's node layout is hand-positioned, not force-simulated — correct and stable, but adding many more categories later (e.g. for Reaction Atlas) will need new manual coordinates rather than an automatic layout algorithm.
- Two categories (`aromatic`, `amine`) have no edges in the current reaction graph — they're fully explorable individually (selector, 3D, properties all work), just visually isolated on the map. This is chemically defensible for this scope (not every category needs a drawn reaction edge) rather than an oversight.
- The comparison tool's second-category picker is a native `<select>` rather than a styled custom dropdown — a deliberate scope/complexity trade-off, consistent with Molecule Library's own filter-input trade-offs noted in §10.
- Real-device touch/performance testing of the 3D scene and the knowledge map's horizontal scroll has not been done.

## 13. Recommended next step (superseded — see §14/§15)

Bond Explorer, Molecule Library, and Organic Chemistry Explorer were all complete and verified. A full visual redesign (§14) was then requested and completed in the same session.

## 14. Visual redesign — the MoleculeOS "deep black to ice blue" system

**Status: COMPLETE, verified.** Replaced the entire blue/cyan/purple accent system with a navy/blue/ice palette, app-wide, while explicitly preserving scientific CPK atom coloring. This was a color-system change only — no chemistry logic, no i18n architecture, no 3D engine, and no existing functionality was touched or rebuilt.

### The palette

| Token | Hex | Role |
|---|---|---|
| `--molecule-black` | `#010101` | Primary background |
| `--molecule-navy` | `#243b67` | Card/surface color |
| `--molecule-navy-dark` | `#2f4678` | Secondary accent / dimmer stop |
| `--molecule-blue` | `#0571cc` | Primary highlight (buttons, primary accent) |
| `--molecule-ice` | `#91c9ed` | Secondary highlight, "electron flow" overlay color |
| `--molecule-light` | `#b9ddf4` | Lightest accent, selection highlight |
| `--molecule-soft` | `#7fb6e5` | Soft/dim variant |

### Architecture — how the whole app repainted without touching most components

- The named `--molecule-*` tokens are new, defined once in `src/app/globals.css`. **The existing `--color-brand-blue`/`-cyan`/`-purple` (+ `-dim`) tokens were kept as aliases onto them** (`--color-brand-blue: var(--molecule-blue)`, etc.) — this is the single highest-leverage decision in this redesign: because Tailwind v4's `@theme inline` generates utility classes (`text-brand-cyan`, `border-brand-blue/40`, `from-brand-blue via-brand-cyan to-brand-purple`, the `text-gradient-brand`/`glass`/`glass-subtle` utilities) that reference these CSS custom properties by name rather than by value, **every existing component using those class names repainted to the new palette automatically**, without a single component file edit. This was verified live: the homepage, Bond Explorer, Molecule Library, and Organic Chemistry Explorer all inherited the new palette purely from the token change.
- There is **no purple in the new palette** — `brand-purple` now resolves to deep navy (the darkest of the three accent stops in what were previously 3-stop `blue→cyan→purple` gradients). This was a deliberate, necessary adaptation since the reference palette has no purple hue.
- Semantic shadcn tokens (`--primary`, `--accent`, `--ring`, `--sidebar-primary`, `--chart-1..5`) were also re-pointed to `--molecule-*`, so `Button`'s default variant, focus rings, and future chart-based components inherit the palette too.
- `--background`/`--card`/`--border` at the `:root`/`.dark` level now resolve to `#010101`/`--molecule-navy`/a low-opacity ice-blue border respectively, matching the spec's explicit "Background: deep black, Card: navy with transparency, Border: ice-blue at low opacity" hierarchy. The existing `glass`/`glass-subtle` utilities' own `color-mix(...  transparent)` treatment automatically produces "navy with transparency" once `--card` itself became navy — the utility definitions didn't need to change.
- `.light` theme deliberately **keeps its own light background/foreground/card values** — only its accent-bearing tokens (primary/accent/ring/chart/border) were repointed to the new palette. The redesign's dark palette is the primary experience per the brief ("dark-mode-first"); light mode stays light for its own purpose.

### The one part that required real per-file work: separating UI colors from CPK colors

- **`ATOM_COLORS` in `molecules.ts` was corrected to proper CPK convention**: carbon was a medium gray-blue (`#94a3b8`) → now dark gray (`#4a4a4a`); nitrogen was violet-purple (`#8f6ffb`, chosen to fit the old purple brand accent) → now real blue (`#3050f8`); iron was rust/brown (`#b45309`) → now metallic gray (`#a5a5aa`); hydrogen, sodium, chlorine were already reasonably close to CPK and were only lightly adjusted (hydrogen to a truer white `#f2f2f2`). This one shared file change corrected atom colors across **all three chemistry features simultaneously** (Bond Explorer, Molecule Library, Organic Chemistry), since they all read from the same `MOLECULES`/`ATOM_COLORS` source.
- **`BondVisualizationScene`'s bond cylinders were recolored from a blue tint (`#c7d2fe`/`#5b8def`) to neutral metallic gray (`#9aa0a8`/`#5a6472`)** — bonds are structural, not brand-colored. Meanwhile its *educational overlays* (shared-electron-pair particles, the ionic transfer particle, the ionic attraction glow, the hydrogen-bond line, the metallic electron sea, the two rim point-lights) were intentionally recolored **to** the new ice-blue/medium-blue palette, since these explicitly represent explanatory highlights, not physical atoms — matching the spec's own example ("Electron flow: ice blue, Polarity direction: medium blue"). The same treatment was applied to `hero-molecule-scene.tsx`'s decorative (non-real-chemistry) bond cylinder for visual consistency.
- **`atom-visualization.tsx` and `electron-animation.tsx`** (the shared 2D SVG schematic used across all three features) had their electron-dot/dashed-line overlay colors updated to ice-blue to match; the lattice fallback circle color was corrected from a leftover rust hex (`#b45309`) to match the corrected Fe CPK color (`#a5a5aa`).
- **A real bug found and fixed during QA**: `interactive-demo-section.tsx`'s small landing-page Na⁺/Cl⁻/H "demo" preview was initially recolored to the new UI palette on the assumption it was pure decoration — but it explicitly labels atoms with element symbols, meaning it's depicting real chemistry and needed CPK colors like the actual chemistry engine (otherwise a user who tries the homepage demo then opens Bond Explorer would see the same "H₂" rendered in two contradictory color schemes). Reverted its atom fills to real CPK (`#f5c542` Na, `#4ec95e` Cl, `#f2f2f2`×2 for H₂) while keeping its electron-dot overlays on the new ice-blue — and along the way discovered a **second real bug**: `CovalentVisual`'s second hydrogen atom had accidentally been left ice-blue instead of matching the first, so H₂ showed one white and one blue hydrogen; fixed to both `#f2f2f2`.
- **A related contrast bug surfaced by the CPK correction**: several atom-label `<text>` elements (in `atom-visualization.tsx` and `interactive-demo-section.tsx`) used plain `fill="white"` with no outline. This was marginal-to-broken before (old atom colors were saturated blue/cyan/purple, giving white text borderline-adequate contrast) but became a real legibility problem once hydrogen became near-white and sodium became yellow — white-on-white and white-on-yellow are both poor contrast. Fixed by adding `stroke="black" strokeWidth="3" strokeOpacity="0.55" paintOrder="stroke"` to every affected label, which keeps the label legible regardless of the underlying atom's specific CPK color. The 3D scene's `Html`-based atom labels already had an equivalent CSS `text-shadow` and didn't need this fix.
- Purely decorative, non-chemistry visuals (the hero's ring/tail 3D "molecule" in `hero-molecule-scene.tsx`/`molecule-data.ts`, the reduced-motion `StaticMoleculeGlyph`, `feature-visuals.tsx`'s abstract icons, the hero's testimonial-avatar dots, `particle-field.tsx`'s ambient particle RGB triples) were recolored to the new UI palette without concern for CPK accuracy, since none of them carry an element identity a chemistry-literate viewer would recognize.

### Verification results

- `npm run lint` / `npm run typecheck` / `npm run build` — all pass clean, run twice (once after the token/CPK changes, once after the contrast-bug fixes found during QA).
- Live browser QA across the homepage (hero, features, interactive demo, categories), Bond Explorer, Molecule Library, and Organic Chemistry Explorer: background is true black, gradient CTA and gradient headline text render blue→ice-blue, feature/testimonial/stat cards show navy surfaces with ice-blue highlights, Bond Explorer's NaCl scene shows correct yellow/green CPK atoms with a medium-blue ionic bond glow, Molecule Library's card grid shows all 21 molecules with correct CPK colors (confirmed N₂ now renders blue nitrogen, not the old violet), Organic Chemistry's knowledge map nodes show navy surfaces with a blue→navy active-node gradient. Confirmed the "H" atom-label contrast fix is legible via a zoomed screenshot.
- Console: no errors across the whole QA pass. One `ChunkLoadError` was observed once in Molecule Library's console log; it did not reproduce on a subsequent reload (cleared console + fresh navigation showed nothing), had a fixed single timestamp consistent with a one-time stale Turbopack HMR chunk reference (this dev server had been running through an extremely large number of file changes across the whole session), and `npm run build` succeeded cleanly both before and after — treated as a transient dev-server artifact, not a real defect.

### Known limitations

- Tablet/mobile visual QA of the redesign specifically was not re-run at 375–1440px (the underlying layouts were already verified responsive in earlier phases and this redesign changed colors only, not layout/spacing) — a color-only regression at specific breakpoints is considered low risk but hasn't been explicitly screenshotted.
- Real-device color rendering (OLED black levels, wide-gamut displays) has not been checked.
- The `.light` theme's accent tokens were updated but the light theme as a whole was only spot-checked, not exhaustively QA'd page-by-page in this pass.

## 15. Recommended next step (superseded — see §16/§17/§18)

Bond Explorer, Molecule Library, Organic Chemistry Explorer, and the visual redesign are all complete and verified. Do not start Reaction Atlas, Periodic Table, AI Tutor, Quiz Center, or Settings without explicit user instruction. If/when given the go-ahead, `organic-reactions.ts` is the explicit intended seed for Reaction Atlas's data model, and any new UI should use the existing `--molecule-*`/`brand-*` token system rather than introducing new colors.

## 16. Phase 2 — Reaction Atlas (`/reaction-atlas`)

**Status: COMPLETE.** Built and committed (`1b237c0 feat: build interactive reaction atlas`) in a session that was not written up in this handoff at the time — recorded here retroactively during the Phase 2 checkpoint pass.

- **Data**: `src/lib/chemistry/reactions.ts` — 11 real, mass-balanced reactions (combustion, hydrogenation, addition, oxidation, condensation, esterification, hydrolysis, amidation, substitution). `molecules.ts` was extended with ethane/chloromethane rather than forked.
- **Components**: `reaction-atlas-workspace.tsx`, `reaction-search.tsx`, `reaction-filters.tsx`, `reaction-card.tsx`, `reaction-equation.tsx`, `reaction-detail.tsx`, `reaction-transformation-view.tsx`, `reaction-atlas-search-params.tsx`.
- **Reuses, doesn't fork**: the bond-highlight transformation view reuses `BondVisualization`/`BondVisualizationScene` via a new optional `highlightBonds` prop (`bond-visualization-scene.tsx`/`bond-visualization.tsx` were extended, following the same backward-compatible-optional-props pattern used for Molecule Library).
- **Cross-links**: deep-links both ways with Organic Chemistry (`?category=`) and Molecule Library (`?molecule=`/`?reaction=`), via the same `useSearchParams()`-wrapper-under-`Suspense` pattern used elsewhere.
- **Learn mode**: 5-step guided walkthrough matching Organic Chemistry's existing pattern.
- **Verification**: `npm run lint` / `npm run typecheck` / `npm run build` all passed at the time of the original commit; re-verified clean again during this Phase 2 checkpoint pass (see §19).

## 17. Phase 2 — Periodic Table (`/periodic-table`)

**Status: COMPLETE.** Built in an untracked working-tree state (never committed, never written up) and discovered in this state during a Phase 2 handoff review. Verified against the actual code (not just file names), confirmed lint/typecheck/build clean, and committed as its own checkpoint: `e35b742 feat: complete interactive periodic table`.

- **Data**: `src/lib/chemistry/periodic-table.ts` — all 118 elements with real IUPAC/CRC atomic mass (mass-number convention for unstable elements, flagged via `massIsMassNumber`), electron configuration (including standard Aufbau exceptions), category, period/group, Pauling electronegativity where established, and common oxidation states. `CATEGORY_COLORS` is a separate scientific color system (10 element categories), following the same "never mix with UI brand palette" rule as `ATOM_COLORS`.
- **Components**: `periodic-table-workspace.tsx` (search/filter state + layout), `periodic-table-grid.tsx` (real 18-column × 7-period layout with a conventional lanthanide/actinide row, filtered elements dim in place rather than being removed so the grid shape never collapses), `element-cell.tsx`, `element-detail.tsx` (modal with full element data + up to 8 related molecules), `periodic-table-search.tsx`, `periodic-table-filters.tsx` (category + state-of-matter), `periodic-table-legend.tsx`, `periodic-table-search-params.tsx` (`?element=` deep link, same `Suspense`-wrapper pattern as other features).
- **Cross-links**: `element-detail.tsx` links out to Molecule Library or Bond Explorer for any molecule containing that element, via a new `getMoleculesContainingElement()` helper added to `molecules.ts` (structural-data addition only, no forked copy).
- **i18n**: `dict.periodicTable.*` added to both `zh-TW.json` and `en.json` in full parity — all 118 element Traditional Chinese names, categories, states, filters, search, and detail-panel copy.
- **Verification (this session)**: `npm run lint`, `npx tsc --noEmit`, and `npm run build` all pass clean with all 10 routes prerendering statically. No console/runtime testing was performed this session (see gap noted in §18/CLAUDE.md).

## 18. Phase 2 roadmap — candidate features (not yet prioritized)

No direction has been chosen yet; this is analysis only, to inform a future decision.

### 1. AI Tutor (`/ai-tutor`)
- **User value**: potentially the highest — a conversational tutor is a strong differentiator for an education product.
- **Dev complexity**: high. Needs an LLM integration (API key/provider decision, cost/rate-limit handling, prompt design grounded in the existing chemistry data so answers stay consistent with what the app already teaches), plus a chat UI (streaming, history, error states).
- **Technical dependencies**: a server-side API route or edge function (new architecture — everything today is static-prerendered with no backend calls); a provider choice; likely new UI primitives (chat bubbles, streaming text) not present anywhere in the codebase yet.
- **UX impact**: net-new interaction model for the app; needs to fit the existing glass/navy/ice visual language and reduced-motion rules for any new animation.
- **Architecture impact**: **yes, meaningfully** — first feature that isn't purely static/client-side; introduces server calls, secrets/env config, and probably a new "conversation" data shape.
- **Priority read**: highest ceiling, highest cost and risk — the one candidate that needs a real product/scope conversation (which provider, how grounded, what it's allowed to answer) before any code is written.

### 2. Quiz Center (`/quiz`)
- **User value**: medium-high — consolidates the mini-quizzes already scattered inside Bond Explorer (and reused elsewhere) into a dedicated practice/review surface; a natural "capstone" feature over existing content.
- **Dev complexity**: low-medium. The quiz *pattern* already exists and works (`bond-quiz.tsx`, `quiz-data.ts`) — this would mostly be aggregating/generalizing it across all four completed content features (Bond Explorer, Molecule Library, Organic Chemistry, Periodic Table) rather than inventing new interaction design.
- **Technical dependencies**: none new — reuses existing data files by reference; would need a scoring/progress model, which is new but small.
- **UX impact**: additive, low risk — fits the existing card/quiz visual language directly.
- **Architecture impact**: low. Stays static/client-side, no backend needed.
- **Priority read**: best effort-to-value ratio of the three unstarted pages — buildable with the current architecture and content, no new infra.

### 3. Settings (`/settings`)
- **User value**: low on its own; value is entirely derived from what it would control (see #4 below — language switching is the obvious first candidate for a Settings page to expose).
- **Dev complexity**: low, *if* scope is just theme (already has a working `ThemeToggle`/`next-themes` system to surface) — but currently there is almost nothing else in the app that's actually user-configurable.
- **Technical dependencies**: depends entirely on scope decision; trivial if it's just theme, grows if it should host language switching.
- **UX impact**: low risk, standard settings-page patterns.
- **Architecture impact**: none by itself.
- **Priority read**: not worth building in isolation — natural to bundle with whatever comes out of the language-switching decision (#4), rather than shipping an empty settings shell first.

### 4. English / zh-TW language switching
- **User value**: medium — currently the whole app is permanently zh-TW; an English audience (or a bilingual classroom) can't use it at all in English despite `en.json` already existing in full parity.
- **Dev complexity**: medium. The dictionary data is *already done* (`en satisfies Dictionary` guarantees shape parity across all 20 top-level keys, including all 118 periodic-table element names). The work is: a locale-selection mechanism (cookie/localStorage + a switcher UI), and deciding whether to keep the current no-`[locale]`-routing architecture (simpler, but SEO/shareable-URL tradeoffs) or introduce `[locale]` segments (bigger, touches every route).
- **Technical dependencies**: this is the one candidate that **directly intersects a documented "do not change without explicit instruction" architecture decision** (`CLAUDE.md`'s i18n section) — any implementation choice here needs an explicit go-ahead since it revises a standing architectural rule, not just adds a feature.
- **UX impact**: needs a visible, discoverable switcher (navbar? settings page?) without cluttering the current clean nav.
- **Architecture impact**: **yes** — this is the biggest architectural fork-in-the-road among all six candidates.
- **Priority read**: high leverage for low *new content* cost (translation already exists), but should not be started casually — it changes a documented architectural invariant and deserves its own explicit decision.

### 5. Browser / mobile QA (real devices/viewports)
- **User value**: indirect but real — every mobile user is currently running on "reasoned to be safe by code review," not verified layouts.
- **Dev complexity**: low-to-medium *engineering* effort, but requires tooling that has been unreliable in this environment specifically (Chrome extension `resize_window` has not worked in any session to date) — may need a different verification method (real device, BrowserStack-style service, or a working local dev-server + manual resize).
- **Technical dependencies**: none code-side; blocked on tooling/environment, not on the codebase.
- **UX impact**: none directly (a QA pass, not a feature) — but any bugs it finds could touch any existing page.
- **Architecture impact**: none, unless real bugs are found that require layout changes.
- **Priority read**: cheap insurance with a real (if probably small) chance of catching an actual defect — good candidate to slot in whenever a working resize/device-testing method is available, independent of which new feature ships next.

### 2. Quiz Center (`/quiz`) — STARTED, see §19

Completed as the first Phase 2 roadmap item selected after this analysis. See §19 for the full write-up.

### 6. Automated testing
- **User value**: indirect — protects against regressions in the ~6,100 lines of chemistry feature code that currently has zero test coverage, all of it hand-verified.
- **Dev complexity**: medium to set up from zero (no test runner installed at all — no Jest/Vitest/Playwright in `package.json`), then ongoing cost per feature to write meaningful tests.
- **Technical dependencies**: a new dev dependency (test runner) and CI consideration; none of the app's runtime code needs to change.
- **UX impact**: none directly.
- **Architecture impact**: additive only (new devDependency + test files) — does not touch existing app code unless tests reveal real bugs.
- **Priority read**: the more Phase 2 content gets built (AI Tutor especially, given it'd add server-side logic), the more this stops being optional — best introduced *before* the next architecturally-risky feature (AI Tutor or language switching) rather than after.

## 19. Phase 2 — Quiz Center (`/quiz`)

**Status: COMPLETE.** Replaces the `ComingSoon` placeholder with a full practice system — not a quiz per se but a *center*: browse by category/difficulty, take a quiz with immediate feedback, see a results summary. Selected as the first roadmap item from §18 for its low architectural risk and direct reuse of the existing chemistry data layer.

### Architecture

- **Data** (`src/lib/chemistry/quiz-center-data.ts`): `QuizCategoryId` (8 values: elements, atomicStructure, chemicalBonds, molecularStructure, functionalGroups, organicChemistry, chemicalReactions, mixed) × `QuizDifficulty` (beginner/intermediate/advanced). 14 `QuizSetSpec` entries, each holding only `{ categoryId, difficulty, questions: { id, correctIndex }[] }` — the same "id + correctIndex only" pattern as Bond Explorer's `quiz-data.ts`. `estimateMinutes()` derives the card's time estimate from question count and difficulty rather than a hand-picked number.
- **Content is not invented**: all 70 questions (5 per set) are written directly from facts already established in `periodic-table.ts` (symbols, atomic numbers, electron configuration, categories, oxidation states), `molecules.ts`/`bond-types.ts` (bond types, real Pauling electronegativity values feeding `classifyElectronegativityDifference`), `molecule-library-data.ts` (molecular geometry, polarity), `functional-groups.ts`, and `reactions.ts`/`organic-reactions.ts` (real catalysts, oxidants, reaction conditions, and the category-to-category reaction graph). No AI-generated questions in this phase, per instruction — the data shape (question text lives in the dictionary, referenced by id) is deliberately set up so a future generation step could add new question ids without restructuring anything.
- **All display text** — set titles/descriptions, category/difficulty labels, question/option/explanation copy, hero/filter/session/results UI strings — lives in `dict.quizCenter.*` in both `zh-TW.json` and `en.json` (full parity, verified by `en satisfies Dictionary`). `dict.pages.quiz.description` was also corrected — the old copy promised drag-and-drop, flash cards, memory match, and a leaderboard, none of which exist; it now describes what's actually built.
- **Components** (`src/components/chemistry/quiz-center-*.tsx`): `QuizCenterWorkspace` (root, a 3-state view machine: `browse` → `active` → `results`, no routing involved), `QuizCenterHero`, `QuizCenterSearch`, `QuizCenterFilters` (category multi-select + difficulty single-select, same interaction pattern as Periodic Table's filters), `QuizCenterCard`, `QuizCenterSession` (question flow: progress bar, options, check/reveal/next, keyboard support), `QuizCenterResults` (score, percentage, correct/incorrect counts, a performance-tier message, retry/back), `QuizCenterSearchParamsWithSuspense`-equivalent `QuizCenterWithSearchParams` (`?quiz=<setId>` deep link, same `Suspense`-wrapper pattern as every other feature).
- **Session state is ephemeral by design**: score/progress live only in the session component's React state and are discarded on exit or retry. No `localStorage`, no persistence — that's explicitly out of scope for this phase (reserved for the future Learning Progress feature per §18's roadmap analysis).
- **Accessibility**: every interactive control has a `focus-visible` ring; answer options use `role="radiogroup"`/`role="radio"` with `aria-checked`; the exit-confirmation panel uses `role="alertdialog"`/`aria-modal`; keyboard support inside a session — digit keys `1`–`4` select an option, `Enter` checks the answer or advances, `Escape` opens/closes the exit-confirm panel — instead of requiring mouse-only interaction.
- **Reduced motion**: `QuizCenterSession` reads `usePrefersReducedMotion()` and drops the question slide-transition and the progress-bar width transition when set, following the same rule as every other animated component in the app.
- **Responsive**: single-column stacking below `lg` (filters move above the card grid, same breakpoint convention as Molecule Library/Periodic Table); card grid is `grid-cols-1 sm:grid-cols-2 xl:grid-cols-3`; the active-session and results views are constrained to a `max-w-2xl` column so question text and options stay readable at every width without a separate mobile layout.

### Verification results (this session)

- `npm run lint` — pass, no warnings.
- `npx tsc --noEmit` — pass (includes the `en satisfies Dictionary` parity check across all 70 new questions × options × explanations, in both locales).
- `npm run build` — pass, all 10 routes compile and prerender as static content, including `/quiz`.
- Live-checked against the running dev server (not just the static build): `/quiz` returns `200` and server-renders both the hero heading and the first quiz card's title; all other 8 existing routes (`/`, `/bond-explorer`, `/molecule-library`, `/organic-chemistry`, `/reaction-atlas`, `/periodic-table`, `/ai-tutor`, `/settings`) re-checked and still return `200` — confirms this phase did not regress any previously completed feature.
- Not verified this session: interactive click-through of a full quiz session in a real browser, and mobile/tablet viewport testing (same tooling limitation noted throughout this document — see the "Known gaps" note in `CLAUDE.md`).

### Known limitations

- Content coverage is intentionally an initial set, not exhaustive: 14 quizzes across 8 categories, with Beginner represented in 6, Intermediate in 5, and Advanced in 3 — not a full 8×3 matrix. The architecture (`QUIZ_SETS` is a flat array) supports adding more sets/questions later without any restructuring.
- No score/progress persistence (by design — see "Session state is ephemeral" above).
- No AI-generated or adaptive questions (explicitly out of scope for this phase per instruction).
- Not yet linked *to* from other features (e.g. Periodic Table's element detail or Bond Explorer could eventually deep-link into a relevant quiz via `?quiz=`) — the `?quiz=` param exists and works, but no other page links into it yet. Left out to keep this phase's diff scoped to Quiz Center only.
