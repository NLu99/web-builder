# Project Review — 2026-08-18

A pass across all project docs (`The idea`, `website-builder-ux-spec.md`, `user-flows-v1.md`, both wireframe files, wireframe notes, `post-mvp-backlog.md`) flagging gaps to address early and opportunities worth considering.

## Gaps worth addressing early

1. **Wireframe documentation is out of sync with the actual files.** `wireframes-v0.1-notes.md` states the v0.3 six-screen file "was never saved into the project... isn't available to read or edit directly here." But `claude/wireframes.html` is in the project and demonstrably contains the v0.3 features described (✨ animate popover, button styles section, "Patterns & Parts"). Its internal title still says "v0.2," though. Recommend reconciling the notes and re-titling the file so future sessions don't waste time trying to "recover" something that already exists.

2. **`post-mvp-backlog.md` isn't catching everything that's been deferred.** Missing: mobile auto-layout fallback UX, Patterns' Global-vs-Local-copy behavior, design-token scoping (per-site vs. team-shared), the publish conflict/lock question, and the plugin-marketplace roadmap decision. These currently live scattered across the spec/flow docs instead of the single "running list" doc meant to hold them.

3. **Mobile responsive fallback is unresolved and foundational.** Open since the original spec (§7.4): does a broken free-form-to-mobile reflow get a manual-fix prompt, or silent best-effort reflow? This determines how much auto-layout engineering is needed and is likely the most common failure mode users will hit.

4. **Design System (Flow 7) is the least-resolved flow despite being a founding pillar.** No numbered UX-spec section; still carries unconfirmed assumptions — does editing a color token live-update every instance, or require a publish step? Are Patterns linked or copied on insert? Worth resolving before more wireframe/engineering investment, since it's more expensive to retrofit than other flows.

5. **No version history / rollback concept in any doc.** Autosave is shown ("Saved 2s ago") but there's no revision history or recovery-from-bad-edit story — table stakes in WordPress, Webflow, and Squarespace. Affects the data model (deltas vs. snapshots vs. current-state-only), so worth deciding early.

6. **Editor accessibility (keyboard/screen-reader) isn't addressed.** Alt text is covered for published-site images, but the core drag-to-move/resize/insert interaction model has no stated non-mouse path. Worth an explicit in-scope/deferred decision rather than silence, especially given the "easier than WordPress" positioning.

7. **Dashboard implies team/account presence ("Team members: 3", Team nav item) while collaboration is stated as deferred.** Not a hard contradiction (flows doc scopes MVP as "single-user/small-team"), but "small-team" isn't defined — worth stating explicitly what's in vs. out (invites/shared billing vs. simultaneous editing vs. roles).

8. **No pricing/business model beyond two feature flags (animations, Smart Suggestions).** Given "expensive competitors" is the founding complaint in `The idea`, pricing strategy deserves directional shape now since it affects storage/metering architecture.

## Opportunities

- **Contrast/accessibility checker in the Design panel** — flag low-contrast color-token pairs as they're picked. Cheap to add given the existing centralized token system; turns "accessible" into a real feature.
- **Site performance as an explicit design principle** — WordPress bloat is a named pain point in `The idea`; a stated performance commitment could become a headline differentiator.
- **Figma import bridge** — leverages the founder's own stated Figma fluency and the target designer audience; not mentioned anywhere in current docs.
- **Usability testing with non-designers now** — the spec's own "next steps" section called for this; the core direct-manipulation + progressive-disclosure bet is still unvalidated with real target users.
- **Unified "Pro" badge/lock pattern**, elevated from its current backlog note — cheaper to establish now than to retrofit after a second or third paid feature ships with its own one-off treatment.
- **Consistency check on AI cost gating** — "Build from a prompt" (new-site onboarding) and "Smart suggestions" (in-editor) are both live-model-call features, but only Smart Suggestions has a stated off-by-default/cost-gating decision. Worth applying the same thinking to the onboarding AI path.

## Process note

Several of the "still open" questions logged across the spec, flows, and wireframe notes (narrow-window breakpoint px value, Templates as nav item vs. New-Site-only, e-commerce placement in the model) are real decisions with no owner or target date. Recommend triaging these into `post-mvp-backlog.md` (if deferred) or assigning an owner (if blocking) rather than letting them accumulate as footnotes.
