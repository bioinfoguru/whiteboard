# Open Existing Whiteboards via URL

## Context
- **Stack**: React + Vite + Excalidraw, deployed to GitHub Pages via GitHub Actions (`deploy-pages` v4)
- **Limitation**: GitHub Pages is static-only — no server-side routing, no path fallback to `index.html`, no directory listings
- **Chosen URL scheme**: Hash routing (`/#/board/:filename`) so GitHub Pages serves the SPA correctly
- **Source files**: `.excalidraw` board files live in `my_boards/` in the repo (e.g., `my_boards/ML_intro.excalidraw`)
- **Current state**: `App.jsx` renders a blank Excalidraw with no routing and no `initialData`

## Decision: Hash Routing
Use `HashRouter` from `react-router-dom`. URLs become:
- `https://wb.bioinfo.guru/#/` — blank Excalidraw canvas (home)
- `https://wb.bioinfo.guru/#/board/ML_intro` — opens board
- `https://wb.bioinfo.guru/#/boards` — board picker list

This avoids the GitHub Pages SPA 404 problem entirely.

## Task 1: Board file storage & manifest
**Option A (simpler, recommended)**: Commit board files to `public/boards/`.
- Move existing `my_boards/*.excalidraw` into `public/boards/` once.
- Future boards are added directly to `public/boards/`.
- No build step or plugin required. Files are served automatically by Vite.
- `fetch('/boards/ML_intro.excalidraw')` works both in dev and production.

**Option B (keep my_boards/ as source of truth)**: Copy at build time with `vite-plugin-static-copy` (or a prebuild script). Files end up in `dist/my_boards/` and are fetched from `/my_boards/`. Use this only if you need to keep `my_boards/` as the canonical location.

**Board listing — manifest file**: GitHub Pages does not provide directory listings, so the board picker cannot discover files dynamically. Generate a manifest at build time:
- Add a small Vite plugin or script that reads `public/boards/*.excalidraw` and writes `public/boards.json`:
  ```json
  { "boards": ["ML_intro", "statistics"] }
  ```
- The picker fetches `/boards.json` to get the list.

## Task 2: Add react-router-dom
**File**: `package.json`
- Add `react-router-dom` to `dependencies` (v6 or v7)

## Task 3: Create routes
**File**: `src/App.jsx` — add routing and three views:

**Route `/` — Home (blank canvas)**
- Renders `<Excalidraw />` with no `initialData`
- Include a small link/button in the UI to go to `#/boards` to browse existing boards

**Route `/boards` — Board picker**
- `fetch('/boards.json').then(r => r.json())`
- Display a list of board names as clickable links to `#/board/<name>`
- Include a "New Board" link/button that goes to `#/` (blank Excalidraw)

**Route `/board/:name` — Open a board**
- Validate `:name` with `/^[A-Za-z0-9_-]+$/`
- `fetch(`/boards/${name}.excalidraw`)`
- Show loading state while fetching
- If found: parse JSON and render with `key={name}`:
  ```jsx
  <Excalidraw key={name} initialData={scene} />
  ```
  The `key` forces a fresh mount on every board change, avoiding Excalidraw's partial-update issues.
- If not found (404): show a "Board not found" message with links to:
  - Go Home (`#/`)
  - Browse Boards (`#/boards`)

## Task 4: Error / loading state
- `<Spinner />` while board JSON is fetched
- On fetch failure: render a 404 state with "Board \"{name}\" not found." plus navigation links back to home or board list

## Security Note
Files are served as static assets. `.excalidraw` files contain only drawing data — no executable content. Filename validation prevents path traversal.

## Edge Cases
- Invalid filenames: reject with regex before constructing URL
- React Router reusing component between board navigations: handled by `key={name}`
- Large files: loading spinner
- Concurrent edits: not addressed (Excalidraw handles local only; no backend sync)

## Files Changed
1. `my_boards/*.excalidraw` → move to `public/boards/*.excalidraw` (one-time)
2. `package.json` — add `react-router-dom`; optionally `vite-plugin-static-copy` if using Option B
3. `vite.config.js` — optionally add `viteStaticCopy` plugin if using Option B; optionally add manifest generator
4. `src/App.jsx` — add HashRouter, Board picker, Board viewer routes with loading/error states

## Validation
1. `npm run build` — confirm `dist/boards/ML_intro.excalidraw` exists
2. Start dev server, visit `/#/` — blank Excalidraw canvas
3. Visit `/#/boards` — see board list with ML_intro
4. Click ML_intro — board opens
5. Visit `/#/board/invalid!!` — shows "Not found" with error message and links
6. Navigate `#/board/ML_intro` → `#/board/Statistics` — board remounts cleanly
7. `npm run lint` — passes
