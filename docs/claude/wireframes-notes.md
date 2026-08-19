# Wireframes — Notes (cumulative, v0.1 → v1 consolidated prototype)

**Consolidated 2026-08-18** into a single clickable prototype, saved to the project at `claude/wireframes-prototype-v1.html` (also delivered to the user directly). This merges the two previously-separate files below into one seven-tab HTML file, in a single consistent visual language (the v0.3 grayscale wireframe style — chosen because five of the seven screens already used it):

1. Dashboard, 2. New Site, 3. Page Builder, 4. Design System, 5. Publish, 6. Plugins & Themes — unchanged in content from v0.3, restyled only where needed to fit the merge.
7. **Account Settings** — new tab, carried over from the v0.4 supplement, restyled to match the rest of the file instead of its original blue-accent look.

Inside the Page Builder tab, the old Layer 2 "…" popover (state 6 in v0.3) is **replaced** by five new states (6–10) implementing the 2026-08-17 Advanced Panel redesign from the v0.4 supplement: nothing-selected → Page Settings fallback, block selected → auto-open, "only when I open it" closed/expanded, and the narrow-window overlay behavior. The Developer mode state (now state 12) was also updated to show the Advanced panel's new "Developer (Layer 3)" section alongside the original bottom raw-CSS panel, since v0.4 established those are two independent things. Cross-tab links were added (Dashboard → New Site → lands in Page Builder; Dashboard sidebar Settings → Account Settings tab) so the whole thing can be clicked through end to end without hunting for the right tab.

The two source files below are kept as-is for reference/history; the consolidated prototype is now the file to open for reviewing or demoing the product end to end.

---

v0.3 (six-screen interactive HTML file, tabbed, low-fidelity/grayscale) is still current for Dashboard, New Site, Design System, Publish & Domain, and Plugins & Themes — see that section below. **v0.4 is a scoped supplement**, not a full re-delivery: it covers only the Page Builder states affected by the 2026-08-17 Advanced Panel redesign, plus the new Account Settings screen that decision introduced.

**The actual file is now saved in the project** at `claude/wireframes-v0.4-panel-update.html` (previously it was only sent via SendUserFile and not retained — that's what caused the v0.3 source file to be lost between sessions, so this is the fix for that gap going forward). Open that doc directly to view/download the interactive file.

## v0.4 — Advanced Panel & Account Settings (2026-08-17)

Eight clickable states in one tab, plus a second tab for the new settings screen:

1. Docked, nothing selected → panel shows **Page Settings** (title/SEO, slug, background, visibility) instead of going blank.
2. Docked, text block selected → direct controller keeps its fixed basic set (Font, Size, Color, B, I); panel auto-opens with Style / Position & size / Spacing / Effects.
3. "Only when I open it" account setting, nothing selected → panel fully closed, full-width canvas.
4. Same setting, block selected → panel still closed, but the direct controller gains one extra control: an "Advanced …" expand affordance.
5. Same setting, after clicking "Advanced …" → panel opens with the same content as state 2.
6. Narrow editor window, nothing selected → no panel reserved, full canvas.
7. Narrow editor window, block selected → panel opens as a **slide-in overlay** with a scrim behind it, rather than docking a column — happens even under "Always."
8. Developer Mode on → same panel as state 2, plus a distinct "Developer (Layer 3)" section (custom code, absolute position), showing the two settings are independent.

New **Account Settings → Editor preferences** screen: "Advanced panel" as a two-option radio (Always / Only when I open it, Always selected by default) and a separate "Developer mode" toggle (off by default), with a callout clarifying they don't affect each other.

**One judgment call made while drawing this that wasn't explicit in the spec, flagged for confirmation:** on a narrow window with nothing selected (state 6), the panel stays fully closed rather than auto-showing Page Settings as an overlay — reasoned that an unrequested overlay covering the canvas on load would be intrusive at that width, so Page Settings is reached via the rail icon instead. Tracked as decision #3 in `claude/open-decisions.md`.

This closes out the "needs a v0.4 pass" items logged previously for the Page Builder Layer 2 states and the missing Account Settings screen. What's *not* covered by v0.4: the other five v0.3 screens are unchanged, and the exact narrow-window breakpoint (pixel value) still isn't set — tracked as decision #2 in `claude/open-decisions.md`.

---

# v0.3 — Notes (screens 1–6, six-screen file)

Delivered as an interactive HTML file (single page, tabbed), six screens, low-fidelity/grayscale. Builds on the v0.2 flow-alignment pass with three new capabilities the user asked for directly.

**Correction (2026-08-18, corrected further 2026-08-19):** the paragraph that previously appeared here — claiming this v0.3 file "was never saved into the project... isn't available to read or edit directly here" — was wrong. `claude/wireframes.html` **is** in the project, and its content is in fact the v0.3 file described below (it contains the animate ✨ popover, button styles section, and "Patterns & Parts" renaming listed under "Latest additions" just below).

That said, the 2026-08-18 version of this note also got a detail wrong: it claimed the file's internal `<title>` tag read "v0.2" and that this had already been corrected to "v0.3." In fact, the tag read "**v0.1**" (never updated since the very first pass), and it had **not** actually been fixed at that time — the claim that it had was premature. That title tag has now genuinely been corrected, to "Website Builder — Wireframes v0.3," as of 2026-08-19. The visible on-page meta bar (the text readers actually see, as opposed to the browser-tab title) already correctly read "v0.3" throughout, so this only ever affected the invisible tab title, not the content of the wireframes themselves.

## Latest additions (v0.3 round)

1. **Click-to-apply animation** — new ✨ icon on the builder's floating toolbar (Page Builder, state 7) opens a preset grid: Fade in up, Fade in, Slide in left/right, Zoom in, None. Click a card, done — no keyframe editor or timeline. Two secondary controls (Starts when: page loads / scrolled into view; Speed: slow/normal/fast) cover the realistic range without turning it into a motion-design tool. Positioned conceptually at Layer 2 (additive polish, never required to publish), reachable from the same floating toolbar as Block properties.
2. **Button styles in the Design panel** — new section (Page Builder, state 10, between Color palette and Spacing & shape): Primary/Secondary previews, Fill, Text color, Corner radius, Size. Edited once, applies to every button site-wide — same "one place to decide" pattern already used for colors and type. Per-button one-off overrides still live in that button's own Layer 2 properties, so nothing here blocks a one-time exception.
3. **Patterns → "Patterns & Parts"** — the Design System screen's Patterns section was renamed and extended with Section/Part filtering, plus new example "Part" cards (Info card, Team member card) alongside the existing full-section examples (Hero, Footer). Rather than build a separate system for small reusable pieces like info cards, the same save mechanism now explicitly covers any granularity — select a whole section or a single small piece and save it; everything surfaces in both this screen and the builder's Add-block gallery under "My Patterns."

## Screens (six total, from the v0.2 flow-alignment pass)
1. Dashboard (Flow 1) — first-time vs. returning states
2. New Site (Flow 2) — starting-point choice → template/AI/blank → name → live editor
3. Page Builder (Flows 3–7) — 11 states covering the *old* Layer 1/2/3 progressive disclosure pattern ("...") expando), animation, add-block, design panel, layers panel. **Superseded for the panel-related states by v0.4 above** — the other content in this screen (add-block, design panel, layers panel) is still current.
4. Design System (Flow 7) — Colors, Typography, Spacing, Patterns & Parts
5. Publish & Domain (Flow 8) — publish → preview → confirm → live → optional custom domain
6. Plugins & Themes (Flow 9) — installed list → upload/validate → permission manifest

## Open questions

**Consolidation note (2026-08-18):** the open questions previously listed here in full have moved to `claude/open-decisions.md`, which now serves as the single tracker across the spec, flow doc, and these wireframe notes, so the same list doesn't drift out of sync in three places. The items that originated from this file are: whether Templates should be its own Dashboard nav item (#9), the narrow-window breakpoint pixel value (#2), the narrow+nothing-selected panel judgment call (#3), the whole-marketplace roadmap question for Plugins (#12), and the Patterns/Parts Global-vs-Local-copy question (#8) — see that doc for current status (all now resolved).

Two items that were open here are now resolved or moot as of this pass:
- *"Whether the v0.3 six-screen file should be re-uploaded into the project"* — resolved: it was already in the project the whole time (see correction above); no action needed.
- *For animation presets, whether a fixed list is enough for v1 or users should be able to combine effects* — left as-is per the original reasoning (fixed list matches "simple click to apply"); if this keeps coming up as user feedback post-launch, it belongs in `post-mvp-backlog.md` under Page Builder, not as an open design question.

See `post-mvp-backlog.md` for the running list of deferred-but-good ideas, and `open-decisions.md` for questions that need an answer rather than a "later."

Version history: v0.1 initial 3-screen pass, v0.2 builder → Squarespace-style revision + Layer 2/3 refinements + flow-alignment pass adding New Site/Publish/Plugins screens + exact-padding resolution, v0.3 animation/button-styles/patterns-and-parts (confirmed saved to project at `claude/wireframes.html` — see correction above; the file's internal `<title>` tag, which had been left reading "v0.1," was corrected to "v0.3" to match on 2026-08-19), v0.4 Advanced Panel redesign + Account Settings screen (scoped supplement, 2026-08-17 — saved to project at `claude/wireframes-v0.4-panel-update.html`), **v1 consolidated clickable prototype (2026-08-18 — merges v0.3 + v0.4 into one file, saved to project at `claude/wireframes-prototype-v1.html`)**.
