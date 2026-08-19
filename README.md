# Buildable — Website Builder MVP

A visual, direct-manipulation website builder inspired by Framer's design freedom and Squarespace's editing simplicity — built from the product docs in this repo (`The idea.txt`, `website-builder-ux-spec.md`, `user-flows-v1.md`, `open-decisions.md`, `post-mvp-backlog.md`, wireframes).

## What's implemented

- **Dashboard** — first-time and returning states, site cards.
- **New site flow** — blank canvas or template starting point, name/slug, lands directly in the editor.
- **Editor canvas (Layer 1 — direct manipulation)** — click text to edit inline, drag blocks with grid snapping, resize via corner handle, floating mini-toolbar (font size, bold, align, color) on selection.
- **Add block** — hover a section to reveal "+ Add block", picker grouped by purpose (Text, Media, Layout).
- **Advanced panel (Layer 2)** — Style / Position & size / Spacing / Effects / layering, auto-opens on selection by default. Falls back to Page Settings when nothing is selected.
- **Design system panel** — color tokens, button style, typography — edits live-update every block using that token.
- **Responsive editing** — explicit Desktop/Mobile toggle; mobile auto-stacks content from the desktop layout, with manual per-block overrides that apply to mobile only, plus a non-blocking "N elements may need a look on mobile" indicator.
- **Publish flow** — preview (desktop/mobile) before publishing, then a live URL (`#/live/:siteId/:pageId`) rendering the published page read-only.
- **Account settings** — "Advanced panel" preference (Always / Only when I open it) and a Developer Mode toggle (adds a custom-CSS field to blocks and custom code to pages), independent of each other.
- **Responsive editor chrome** — the Advanced Panel docks as a column on wide windows and collapses to a slide-in overlay under 1024px; under 640px it drops into a content-only mode that hides block-level style/position controls (per `open-decisions.md` #2 and #13).

## What's intentionally out of scope for this pass

Per `post-mvp-backlog.md` / `open-decisions.md`: AI features ("Build from a prompt", Smart Suggestions), plugins/marketplace, e-commerce, team collaboration and per-site roles, version history, a full accessibility pass (a baseline — keyboard block selection, panel-based editing, ARIA labels — is in place), and a real backend/auth. Site data persists to `localStorage` in the browser instead.

## Running it

```bash
npm install
npm run dev
```

## Stack

React + TypeScript + Vite, Tailwind CSS v4, Zustand (with localStorage persistence), React Router.
