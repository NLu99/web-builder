# Open Decisions

Created 2026-08-18 during a documentation consolidation pass, to fix a fragmentation problem: several unresolved questions were logged in `website-builder-ux-spec.md` §7, others inline in `user-flows-v1.md`, others in `wireframes-notes.md` — with no single place to check current status, and no consistent owner or target date.

**How this differs from `post-mvp-backlog.md`:** the backlog holds features deliberately deferred past MVP. This doc holds decisions that need an answer for *current* work to proceed cleanly — some block MVP build, others just need an answer before more design/engineering investment compounds around an assumption. A few items here concern post-MVP features (e.g. the plugin marketplace), but the decision itself — whether to plan for it — is needed now, because it affects architecture choices being made today.

Each item lists its source doc(s), what's being asked, and status. Update status in place as items get resolved; when an item resolves, move it down into the Resolved section below (formatting reformatted 2026-08-18 to put open items first and make status scannable at a glance).

---

## At a glance

**All items currently tracked here are resolved.** Table kept for structure — new items get added above this line as they're raised.

| # | Item | Area | Status |
|---|------|------|--------|

🔴 = blocking or explicitly time-sensitive · 🟡 = open, no stated blocker · ✅ = resolved (see Resolved section)

---

## Resolved

**1. Mobile auto-layout fallback UX.**
Status: ✅ **Resolved 2026-08-18.**
*Source: `website-builder-ux-spec.md` §7 (was item 4), `user-flows-v1.md` Flow 6.*
When a free-form desktop layout breaks badly on auto-generated mobile, does the user get a manual-fix prompt, or does it silently apply a best-effort reflow? — Silent best-effort reflow, applied automatically so nothing blocks publishing, plus a small non-blocking indicator (e.g. "3 elements may need a look on mobile") so the issue stays visible rather than silent. See `website-builder-ux-spec.md` §3.5.4 and `user-flows-v1.md` Flow 6 for the full write-up.

**2. Narrow-window overlay breakpoint (exact pixel value).**
Status: ✅ **Resolved 2026-08-19** (provisional — validation plan set 2026-08-19, see caveat below).
*Source: `website-builder-ux-spec.md` §3.4.5 / §7 (was item 5), `wireframes-notes.md`.*
The docked-vs-overlay behavior for the Advanced Panel was resolved in principle earlier (wide = docked, narrow = overlay); this closes out the missing piece — the actual width threshold.

**Approach (decided 2026-08-19):** auto-adapt with progressive disclosure — the panel collapses from docked column to slide-in overlay automatically as the editor window narrows. Chosen over a separate reduced-editor mode (WordPress mobile app's approach) or leaving layout fully manual (VS Code's approach). Backed by Nielsen Norman Group's guidance on managing visual complexity (predictable placement, clear hierarchy, progressive disclosure); our overlay-on-select pattern is a direct instance of progressive disclosure.

**Breakpoint: 1024px.** Reasoning: the v0.4 wireframe's real dimensions are rail 48px + docked panel 260px, leaving a floor of roughly 850–900px total before a workable canvas (~500–550px minimum) gets crowded out. 1024px was chosen over tighter options (900px, 768px) because it matches a widely-tested convention (Tailwind's "lg" breakpoint, common tablet-landscape/small-laptop width) and gives comfortable margin above the computed floor, so docked mode never renders right at the edge of cramped.

**Caveat / validation plan (updated 2026-08-19):** per Smashing Magazine's guidance (see sources below), breakpoints are best confirmed by testing the real interface at actual window widths rather than by desk calculation alone. This value is a reasoned starting point derived from the wireframe's real panel/rail dimensions, not a live-tested result. **Confirmed plan: validate this threshold during user testing** (see item raised in the same conversation as #13, tracked as a next step rather than a numbered decision here) rather than a solo build-time sanity check — real users resizing/using the editor at this width is the actual test, not just a developer eyeballing a resizable prototype. Build with 1024px as the working value; be ready to adjust based on what testing shows.

Sources: [3 Strategies for Managing Visual Complexity in Applications and Websites (NN/g)](https://www.nngroup.com/videos/managing-visual-complexity/) · [Progressive Disclosure (NN/g)](https://www.nngroup.com/videos/progressive-disclosure/) · [Smart Responsive Design Patterns, Or When Off-Canvas Isn't Good Enough (Smashing Magazine)](https://www.smashingmagazine.com/2016/05/smart-responsive-design-patterns-or-when-off-canvas-isnt-good-enough/) · [Custom Layout (VS Code docs)](https://code.visualstudio.com/docs/configure/custom-layout) · [Edit your site on mobile or tablet (WordPress.com Support)](https://wordpress.com/support/edit-your-site-on-mobile/) · [Breakpoints in responsive web design: 2026 guide (Framer Blog)](https://www.framer.com/blog/responsive-breakpoints/)

**3. Narrow window + nothing selected = fully closed panel (judgment call).**
Status: ✅ **Resolved 2026-08-19.**
*Source: `wireframes-notes.md`, v0.4 section.*
On a narrow editor window with nothing selected, should the panel stay fully closed, or auto-show Page Settings as an overlay to match the wide-window default? — **Confirmed: keep it fully closed**, per the wireframe's original reasoning — an unrequested overlay covering the canvas on load would feel intrusive at narrow widths. Page Settings stays reachable via the rail icon. No change needed to the v0.4 wireframe; this was a confirmation of the existing judgment call, not a new design.

**4. Should Smart Suggestions extend to the New Site starting-point step?**
Status: ✅ **Resolved 2026-08-19.**
*Source: `website-builder-ux-spec.md` §7 (was item 1), `user-flows-v1.md` Flow 2.*
Currently Smart Suggestions (AI-ranked layouts) is scoped only to in-editor "Add block." — **Confirmed: yes, extend it to the New Site starting-template step too**, for a consistent AI-assisted experience across onboarding and editing rather than the flat category browser in one place and AI ranking in another. This expands the AI feature's cost surface (two entry points instead of one), which is why it was resolved alongside #5's cost-gating decision — see that item for the cost-control approach this implies. `post-mvp-backlog.md`'s Page Builder section (Smart Suggestions entries) should be read as covering both entry points now, not just in-editor Add block.

**5. AI cost-gating consistency between onboarding and in-editor AI features.**
Status: ✅ **Resolved 2026-08-19.**
*Source: raised 2026-08-18 during documentation review.*
"Build from a prompt" (new-site onboarding) and "Smart suggestions" (in-editor, and now also the New Site step per #4) are both live-model-call features with real per-use cost; only Smart Suggestions had a stated cost-gating treatment (an opt-in toggle, off by default).

**Decision:** the two features aren't symmetric, so they don't get identical treatment. Smart Suggestions is a nice-to-have inside the editor — a user can build a whole site without touching it — so gating it as an off-by-default toggle costs little in user experience. "Build from a prompt" is likely the core onboarding hook (the "easier than WordPress" first-impression moment per `The idea`), so the same off-by-default toggle would risk hurting conversion. Instead: **"Build from a prompt" gets a free quota per new account** (e.g. a small number of free generations per signup, exact number TBD) rather than being toggled off or left fully ungated. This keeps the feature on and prominent for every new user while putting a hard ceiling on unbounded cost exposure from a single account — including abuse (bots, competitors probing) before a user has ever paid anything. Smart Suggestions keeps its existing off-by-default toggle treatment; the two mechanisms differ because the features' roles in the product differ, not because one was overlooked.

**6. Design-token scoping — per-site vs. team-shared.**
Status: ✅ **Resolved 2026-08-18.**
*Source: `user-flows-v1.md` Flow 7, `wireframes-notes.md`.*
Can a team/agency share one token library across multiple sites, or is every site's token set independent? — Per-site only for MVP, no team-shared token library yet. A shared library for agency use is logged as a deferred feature in `post-mvp-backlog.md` (Design System section), to revisit once the team/permissions model exists. See `user-flows-v1.md` Flow 7.

**7. Token edits — live update vs. publish step.**
Status: ✅ **Resolved 2026-08-18.**
*Source: `user-flows-v1.md` Flow 7 (was documented as "assumption, not yet confirmed").*
When a color token like `primary/600` is edited in the Design panel, does every instance on the canvas update immediately, or does it require a separate "sync/publish tokens" step? — Live update immediately, no separate sync step, matching how every other edit in the product works (direct manipulation, no modes). See `user-flows-v1.md` Flow 7.

**8. Patterns & Parts — Global (linked) vs. Local (detached) copies.**
Status: ✅ **Resolved 2026-08-18.**
*Source: `user-flows-v1.md` Flow 7, `wireframes-notes.md`.*
When a saved Pattern or Part is inserted onto a page, does it stay linked to its source (editing the source updates every placed instance, like a Figma component) or fully detach on insert (like a one-off copy)? — Global/linked by default. Follow-up implementation detail (not blocking, but worth a wireframe pass): a per-instance "detach" (Local copy) affordance should exist for the one-off-exception case, consistent with the pattern already used for button-style overrides. See `user-flows-v1.md` Flow 7.

**9. What "Templates" navigation looks like.**
Status: ✅ **Resolved 2026-08-19.**
*Source: `wireframes-notes.md`.*
Should Templates be its own nav item in the Dashboard sidebar, or live only inside the New Site creation flow? — **Confirmed: own nav item.** Discoverable on its own — users can browse/preview templates without committing to starting a new site first, matching how comparable competitors (Webflow, Squarespace) surface templates. Needs a wireframe pass to add the nav item and decide whether clicking a template routes into the existing New Site flow or opens a dedicated preview first.

**10. What "small-team use" actually includes at MVP.**
Status: ✅ **Resolved 2026-08-19.**
*Source: raised 2026-08-18 during documentation review, prompted by an inconsistency between the Dashboard wireframe (shows a "Team members: 3" stat and a Team nav item) and `user-flows-v1.md`'s flow inventory (states multi-user collaboration and per-site roles are explicitly deferred).*
**Confirmed scope: invite teammates to the account and share billing, no per-site roles yet, no simultaneous editing.** This matches the framing already implicit in `user-flows-v1.md`'s flow inventory — it's now made explicit so the Dashboard build has a written boundary to match rather than an assumption. The existing "Team members: 3" stat and Team nav item in the Dashboard wireframe are consistent with this scope and don't need to change; per-site roles and live co-editing remain tracked as deferred in `post-mvp-backlog.md` (Collaboration & Permissions section).

**11. Where e-commerce sits in the model.**
Status: ✅ **Resolved 2026-08-19.**
*Source: `website-builder-ux-spec.md` §7 (was item 3).*
Is e-commerce (product blocks, cart, checkout) a Layer 1 default block type, or a separate mode entirely? Also unresolved: whether it's in MVP scope at all. — **Confirmed: deferred entirely to post-MVP.** Resolves the scope half of the question immediately (not in MVP), and removes the pressure to answer the Layer-1-block-vs-separate-mode design question now — that gets revisited once e-commerce is actually picked up for design/build. Moved to `post-mvp-backlog.md` as a deferred feature (new Commerce section), which also carries forward the unresolved block-type-vs-mode question for whenever it's picked back up.

**12. Whether a public plugin marketplace is on the roadmap.**
Status: ✅ **Resolved 2026-08-19.**
*Source: `user-flows-v1.md` Flow 9 security-model section, `wireframes-notes.md`.*
A marketplace where users install plugins other users authored is a different trust model than the current single-author-uploads-to-own-site design — it would need manual review, versioning, and code signing, similar to browser extension stores. — **Confirmed: yes, it's a committed part of the roadmap, targeted for post-MVP.** Not a maybe, so the MVP's plugin sandboxing architecture (iframe isolation, permission manifests) should be built with this direction in mind even though the marketplace itself (review flow, versioning, code signing, discovery UI) is designed and built later. Logged as a confirmed post-MVP feature in `post-mvp-backlog.md` (new "Plugins" section), which also lists the concrete follow-up decisions (trust/review model, versioning, code signing, revenue share, discovery UI) to work through once it's picked up.

**13. Content-only editing mode for small screens — what's restricted, and at what breakpoint.**
Status: ✅ **Resolved 2026-08-19** (provisional — validation plan set 2026-08-19, see caveat below).
*Source: raised 2026-08-19 during discussion of decision #2.*
When confirming the auto-adapt/progressive-disclosure direction for #2, it was decided that editing on small screens still needs a further restriction beyond just how the panel displays: below some width, the editor scopes down to a **content-only mode**.

**What's restricted:** only layout composition (multi-column drag/repositioning) and the Advanced Panel's Style / Position & size / Spacing / Effects controls. Developer Mode/Layer 3 is moot here since its fields live inside that same Advanced Panel. Everything else stays available: adding new blocks from the block library, Page Settings, Design tokens (Colors/Typography), and inserting saved Patterns & Parts. Net effect: users can still fully author a page's content and structure from pre-built pieces on a small screen — they just can't hand-tune layout/style at the block level until the window is wider.

**Hidden-control UX:** restricted controls simply don't render below the threshold — no disabled state, no tooltip — consistent with the product's existing non-blocking bias (decision #1).

**Developer Mode interaction:** no new logic needed — its fields are already absent along with the rest of the Advanced Panel in content-only mode, so the Account Settings toggle just has no visible effect below the threshold.

**Breakpoint: 640px.** Reasoning: the Advanced Panel's Style/Position/Spacing/Effects sections pack roughly 12 fields into a 240–260px-wide panel — workable at tablet width, cramped at phone width. 640px (Tailwind's "sm" convention, the common phone-landscape-to-tablet cutover) was chosen over 480px (would keep full style editing on phone-landscape widths where the dense panel gets genuinely tight) and 768px (would restrict even iPad-portrait users, which felt overly aggressive for a device that isn't that small). This is a second, independent threshold below #2's 1024px — full editing via the overlay panel is available for the whole 640–1024px range; content-only mode only applies below 640px.

**Caveat / validation plan (updated 2026-08-19):** same as #2 — this is a reasoned starting point based on the panel's real field density, not a live-tested result. **Confirmed plan: validate during user testing**, ideally including real phone/tablet devices so touch-target usability (not just window width) gets checked — a desktop browser resize alone wouldn't catch that. Build with 640px as the working value; be ready to adjust based on what testing shows.

**14. Editor accessibility (keyboard/screen-reader) — in scope or deferred, and what the interaction model equivalent looks like.**
Status: ✅ **Resolved 2026-08-19.**
*Source: `project-review-2026-08-18.md` gap #6 — flagged that the core drag-to-move/resize/insert interaction model had no stated non-mouse path, despite alt text being covered for published-site images. This was raised in the project review but never turned into a decision or backlog item until now.*

**Research:** WAI-ARIA's Authoring Practices Guide has no official drag-and-drop pattern — the closest analogues are Grid (arrow-key directional navigation) and Window Splitter (keyboard-resizable panes) — confirming this genuinely has no off-the-shelf answer, not just a gap in our own docs. The closest real precedent is WordPress Gutenberg — also a direct-manipulation block editor — which solved it with: keyboard shortcuts for moving blocks (e.g. Ctrl+Option+Arrow on Mac) when mouse-revealed side controls aren't available; a "Navigation mode" that lets keyboard/screen-reader users Tab through blocks like headings in a document instead of needing sequential drag interaction; and, per Automattic's own design team, a stated core principle of designing *parallel workflows* that don't depend on visual/motor interaction, rather than trying to make the drag gesture itself accessible.

That maps well onto what's already designed here: the Advanced Panel (Layer 2) already has explicit numeric fields for Position & size (X/Y, W/H), Style, Spacing, and Effects — this is already most of a parallel, non-drag workflow. The gap isn't a redesign; it's making that panel (and block selection/creation) reachable without a mouse.

**Decision — scope: baseline for MVP, full pass deferred to post-MVP.** Unlike most items resolved in this doc, this touches the core interaction model rather than a single flow, so an explicit in-scope/deferred call was worth making now rather than leaving it silent (the original complaint in the project review).

**MVP baseline (decided 2026-08-19) — all four of the following:**
1. **Keyboard block selection** — Tab through blocks on the canvas in document order, without a mouse. Prerequisite for everything else below.
2. **Panel-based editing as the keyboard equivalent for move/resize/style** — once a block is selected, the existing Advanced Panel (X/Y, W/H, Style, Spacing, Effects fields) is wired into keyboard focus order as the non-drag path. Mostly already designed; this is primarily an implementation/focus-order task, not new UI.
3. **Keyboard-triggerable "Add block"** — the block-picker affordance currently only appears on hover; needs an always-focusable trigger or keyboard shortcut so keyboard users can add content at all, not just edit what's already there.
4. **Basic ARIA labeling on canvas blocks and the panel** — screen readers can announce what block is selected and what the panel fields are, without a full semantic overhaul of the whole canvas.

**Deferred to post-MVP** (logged in `post-mvp-backlog.md`, new Accessibility section): a Gutenberg-style Navigation mode / outline list view of blocks, dedicated keyboard shortcuts for quick reordering (vs. manually editing X/Y numbers), and a full WCAG 2.1 AA screen-reader pass across the whole canvas.
