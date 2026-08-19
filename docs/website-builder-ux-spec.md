# Website Builder — UX Foundation Spec
### Combining Framer's design freedom with Squarespace's intuitive, direct-editing flow

---

## 1. Vision & Positioning

**Problem we're solving:** Framer gives professional-grade creative freedom, but its interaction model (panels, constraints, variants, breakpoint logic) is built for people who already think like designers. That excludes a huge share of the market — small business owners, freelancers, creators — who want a distinctive, flexible site without learning design software.

Squarespace solves the accessibility problem but trades away flexibility: you're editing *inside* a template's assumptions, not truly free-form.

**Our positioning:** A builder where anyone can start editing immediately by clicking directly on the page — no mode-switching, no jargon — but where the underlying canvas has real structural freedom, revealed progressively as users want more control.

**Design principle, in one line:** *Freedom should be a door you walk through, not a wall you start against.*

---

## 2. Core Design Principles

| Principle | What it means in practice |
|---|---|
| Direct manipulation first | Every edit happens by interacting with the live page — click text to edit it, drag to move/resize. The direct controller (floating mini-toolbar) carries only the small, universal set of quick actions — it does not grow to hold everything. |
| Guided, not gridless | A smart grid and alignment guides run under every layout so free placement still snaps into order — freedom with a safety net, not a blank void. |
| Progressive disclosure | Basic tools sit on the direct controller. Everything else lives in one well-structured panel, not a series of ad hoc popups — see §3.4 for how and when it appears. |
| Plain language | UI copy describes outcomes ("stick to the top"), never design mechanisms ("pin," "constrain," "auto layout"). |
| Structure by default | Users start from sections/blocks, not a blank canvas — but every block can be freely repositioned, resized, and restyled. |
| Explicit responsive editing | Desktop and mobile are separate, visual editing passes — not abstract breakpoint rules. |

---

## 3. User Flows

### 3.1 Onboarding → First Page
1. User picks a starting point: blank canvas, template, or "build from a prompt" (AI-assisted layout).
2. Lands directly in the live editor — not a dashboard or settings screen first.
3. First-run coach marks highlight: click any text to edit, drag any block to move it. No modal tutorial wall.

### 3.2 Adding Content
1. Hovering over any empty area or section boundary reveals an "Add block" affordance.
2. Block picker shows visual thumbnails grouped by purpose (Text, Image, Gallery, Form, Button, Embed) — not by technical type.
3. New block drops in at a sensible default size/position, already snapped to the grid; user can immediately drag/resize.

### 3.3 Editing an Element (Layer 1 — Direct Controller)
1. Click text → inline edit, cursor appears, floating mini-toolbar (font, size, color, weight) appears adjacent — a fixed, small set of the most common actions, never a full properties panel.
2. Click image → contextual toolbar for replace/crop/alt text.
3. Drag any block → moves freely; grid + alignment guides snap it into place; siblings reflow only if the user is in a "stacked" section, otherwise free position is preserved.
4. Resize via corner/edge handles, same as manipulating an image in Google Slides — familiar gesture, no learning curve.
5. Anything beyond this fixed set (fine spacing, positioning, effects, per-block extras) does not get bolted onto the direct controller — it lives in the Layer 2 panel instead (§3.4). This is a deliberate constraint: the direct controller was starting to accumulate too many one-off controls, which undermined the "quick, obvious edits" purpose it's meant to serve.

### 3.4 The Advanced Panel (Layer 2) and Developer Mode (Layer 3)

**Decided 2026-08-17:** the old pattern — a "..." affordance popping open an ad hoc expando — is replaced with one well-structured panel docked to the right of the canvas, grouped into clear, labeled sections (e.g. Style, Position & size, Spacing, Effects, plus any block-specific extras like button variant or animation). Consolidating into a single organized surface, rather than letting the direct controller or a small popup keep absorbing new options, is the fix for the "getting too complicated" problem.

1. Selecting a block shows that block's full set of advanced properties in the panel: opacity, rotation, precise x/y/width/height, layering (bring to front/send to back), plus any block-specific controls.
2. **Default behavior:** the panel opens automatically whenever an element is selected. When nothing is selected, the panel does not go blank — it falls back to **Page Settings**: page title & SEO (meta title, description, social share image), URL slug, page background, and visibility/password protection, plus a page-level custom code section if Developer Mode is on. Selecting a block swaps the panel to that block's properties; clicking empty canvas (or otherwise deselecting) swaps it back to Page Settings. This gives the panel a real default job rather than an empty state, using the same "one place to decide" pattern already applied to colors and button styles. *(Resolved 2026-08-17, was open question §7.)*
3. **Account Settings (outside the builder) — "Advanced panel" preference:** a per-user account setting, not tied to any single site, with two states:
   - **Always** (default) — panel auto-opens on selection, as above.
   - **Only when I open it** — panel stays closed by default (showing Page Settings only if explicitly opened); a small expand affordance on the direct controller ("…" or "Advanced") opens it on demand, and it closes again once the user deselects. This preserves the original invoke-only behavior for people who'd rather keep the canvas uncluttered.
   Because this lives at the account level, it follows the person across every site they edit, rather than being reset per site or per device.
4. **This is a separate setting from Developer Mode**, which remains its own toggle (off by default, sticky once enabled) and unlocks Layer 3 capabilities: custom CSS/code blocks, true absolute positioning outside the grid, custom breakpoints. Developer Mode governs *what's available*; the Advanced panel preference governs *when the panel shows up*. Turning one on does not affect the other.
5. **Responsive presentation:** the docked-vs-overlay presentation is driven purely by available width in the builder's own window, independent of the Always/Only-when-invoked preference above. On a wide editor window, the panel stays docked as a permanent column. On a narrow editor window, it collapses to an overlay that slides in over the canvas on selection and closes again on deselect — even under "Always," since a window too narrow can't sustain a permanently reserved column without crowding the canvas. *(Resolved 2026-08-17, was open question §7.)*
6. Nothing in Layer 2 or Layer 3 is required to ship a complete, polished page — both remain additive, never gating.

### 3.5 Responsive Editing
1. Explicit Desktop/Mobile toggle at the top of the canvas (not a resizable browser-style viewport slider, which implies continuous breakpoints).
2. Content and structure carry over automatically; mobile view starts from an auto-generated stacked layout.
3. Any manual repositioning in mobile view overrides the auto-layout for that breakpoint only — desktop is never affected by mobile edits, and vice versa.
4. **Fallback when auto-layout breaks (resolved 2026-08-18, was open question §7 item 4):** if the desktop layout can't be confidently reflowed for mobile, the builder still applies its best-effort layout automatically — nothing here ever blocks publishing. Alongside that, it shows a small, non-blocking indicator (e.g. "3 elements may need a look on mobile") so the user knows something may need a manual check, without forcing them to stop and fix it before continuing. This keeps the same bias the rest of the product already has against blocking modals (no tutorial wall in onboarding, a lightweight non-blocking publish preview) while still surfacing the issue rather than letting it fail silently.

### 3.6 Publish
1. Persistent "Publish" affordance, always visible, with a lightweight preview-before-publish step.
2. Post-publish: clear, non-technical confirmation (live URL, share options) — no deployment jargon.

---

## 4. Key Screens

- **Editor Canvas (primary screen):** Full-bleed live preview of the page. The direct controller (floating, contextual mini-toolbar) appears only on selection/hover — chrome stays minimal so the page itself is always the focus.
- **Block Picker:** Visual, thumbnail-driven grid, searchable, grouped by purpose not category jargon.
- **Advanced Panel (Layer 2):** Structured panel, organized into clear labeled sections (Style, Position & size, Spacing, Effects, block-specific extras). Shows Page Settings when nothing is selected, swaps to block properties on selection. Opens automatically by default; can be set to invoke-only via the account-level "Advanced panel" preference (§3.4). Docked to the right of the canvas on wide editor windows; collapses to a slide-in overlay on narrow ones.
- **Page/Site Navigator:** Simple list of pages with drag-to-reorder; thumbnails so users recognize pages visually rather than by name alone.
- **Responsive Toggle Bar:** Desktop/Mobile switch pinned to the top of the canvas.
- **Account Settings — Advanced Panel Display:** Outside the builder. Per-user preference: Always (auto-open, default) vs. Only when I open it. Independent of Developer Mode below.
- **Account Settings — Developer Mode Toggle:** Outside the builder (or tucked into editor settings), off by default, persists once enabled. Unlocks Layer 3 (custom code, absolute positioning, custom breakpoints) — distinct from the Advanced Panel Display preference above.

---

## 5. Comparison Table — Where We Sit Between Framer and Squarespace

| Dimension | Framer | Squarespace | Our Approach |
|---|---|---|---|
| Starting point | Blank canvas | Templates/sections | Sections by default, blank canvas optional |
| Positioning model | Free-form, constraint-based | Grid-based (Fluid Engine), snapped | Free-form, snapped to smart grid |
| Editing surface | Panels + canvas, mode-heavy | Direct on-canvas editing | Direct-controller basics on canvas + one structured side panel for the rest (auto-opens by default, can be set to on-demand only) |
| Vocabulary | Design/dev terms (constraints, variants, auto layout) | Mostly plain language | Strictly plain language, jargon hidden behind "Advanced" |
| Responsive control | Breakpoint & variant system | Separate desktop/mobile editing passes | Separate desktop/mobile passes, same as Squarespace |
| Power ceiling | Very high (near design-tool grade) | Moderate | High, but reached progressively, not upfront |
| Learning curve | Steep | Shallow | Shallow entry, steep ceiling only if sought out |

---

## 6. Terminology Guide (avoid vs. use)

| Avoid | Use instead |
|---|---|
| Auto layout | Stack / arrange automatically |
| Constraints | Stick to / stay in place |
| Variants | Versions (mobile version, desktop version) |
| Z-index | Bring to front / send to back |
| Breakpoint | Screen size / mobile view |
| Canvas | The page (avoid implying "design tool") |

---

## 7. Open Questions

**Consolidation note (2026-08-18):** open items that don't have a decision yet are now tracked centrally in `claude/open-decisions.md`, rather than duplicated across this spec, the flow doc, and the wireframe notes. That doc is the canonical, up-to-date list — check there for current status rather than this section, which is kept only as a historical record of what was open as of the last spec revision.

For reference, the items open as of 2026-08-17 were:
1. Should the block picker support AI-generated custom sections (beyond a fixed library), and if so, at what layer of disclosure? *(Still open — tracked as `open-decisions.md` #4.)*
2. How much should account for collaboration (multi-user editing) in v1, vs. single-owner editing? *(Still open — tracked as `open-decisions.md` #10.)*
3. Where does e-commerce (product blocks, cart, checkout) sit in this model — Layer 1 default block, or a separate mode entirely? *(Still open — tracked as `open-decisions.md` #11.)*
4. What's the fallback UX when a user's free-form layout breaks badly on mobile auto-generation — manual fix prompt, or silent best-effort reflow? **Resolved 2026-08-18 — see §3.5.4:** silent best-effort reflow, plus a non-blocking indicator.
5. The narrow-window overlay breakpoint (§3.4.5) needs an actual width value once the builder's canvas layout is built. *(Still open — tracked as `open-decisions.md` #2.)*

---

*This spec establishes the interaction model and flow foundation. Next steps could include: low-fidelity wireframes per key screen (the Layer 2 panel wireframes should be revisited given the 2026-08-17 changes above), a clickable prototype of the Layer 1→2→3 disclosure model, or usability testing script for non-designer participants.*
