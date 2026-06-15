# DeveloperOS — Architecture & Phased Implementation Plan

> A browser-based **Software Engineer Operating System**. Not a traditional portfolio — a desktop OS that lets recruiters and engineers *explore* the work: windows, taskbar, start menu, terminal, AI assistant, live metrics, code-review simulator, and more.

---

## 1. Overview & Goals

**Product framing:** DeveloperOS presents a software engineer's portfolio, projects, engineering thinking, architecture, decision-making, AI assistant, code reviews, system design, and developer analytics as a real, explorable desktop operating system in the browser.

**Applications (the 13 `.exe` apps):**
`About.exe`, `Projects.exe`, `Experience.exe`, `Resume.pdf`, `Contact.exe`, `Terminal.exe`, `MissionControl.exe`, `LiveMetrics.exe`, `ArchitectureExplorer.exe`, `DecisionEngine.exe`, `MindMap.exe`, `CodeReviewSimulator.exe`, `AIAssistant.exe`.

**Non-goals for v1:**
- No real multi-user authentication.
- No database.
- No vector database / RAG (a clean upgrade path is designed in, but not built).

---

## 2. Tech Stack (locked)

**Frontend (`developer-os/frontend`)** — Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind v4
- **Zustand** — state management (window manager, desktop, terminal, AI, metrics).
- **Framer Motion** — window drag, open/close/minimize animations.
- **lucide-react** — icons.
- `clsx` + `tailwind-merge` — class composition.
- `react-markdown` + `remark-gfm` — render markdown content windows.
- Charts/graphs: `recharts` (or `visx`) for LiveMetrics / MissionControl.
- Window move/resize: custom drag (Framer Motion) or `react-rnd`.

**Backend (`developer-os/backend`)** — Next.js 16 route handlers as a standalone API service
- **@google/generative-ai** — Gemini SDK.
- **gray-matter** — markdown frontmatter parsing for the knowledge base.
- Server-side `fetch` to GitHub / LeetCode / Wakatime / Vercel.

**Deploy:** two Vercel projects (frontend + backend); frontend talks to backend via `NEXT_PUBLIC_API_BASE_URL`.

---

## 3. High-Level Architecture (two services)

```
┌────────────────────────┐        HTTPS / JSON       ┌─────────────────────────┐
│  frontend (Next.js UI) │ ────────────────────────▶ │  backend (Next.js API)  │
│  Desktop OS shell      │                           │  /api/ai/chat           │
│  Windows + Zustand     │ ◀──────────────────────── │  /api/github /leetcode  │
│  Content rendering     │                           │  /wakatime /vercel      │
└────────────────────────┘                           │  Gemini + content KB    │
        │                                             └─────────────────────────┘
        │ presentational content                                  │
        ▼                                                          ▼
  rendered windows                              Gemini API + external dev APIs
```

**Decision — single source of truth for content:** the `content/` knowledge base lives with the **backend**, so the AI assistant reads it server-side for context injection. The frontend renders presentational content via API responses (or a build-time copy) — we do **not** maintain two divergent copies of the same markdown.

---

## 4. Frontend Folder Structure (`frontend/src/`)

Enterprise-scalable layout, mapping the spec:

```
src/
├── app/
│   ├── api/              # light client-only routes (most data comes from backend)
│   ├── desktop/
│   ├── page.tsx          # renders <Desktop />
│   └── layout.tsx
│
├── desktop/
│   ├── Desktop.tsx
│   ├── Taskbar.tsx
│   ├── StartMenu.tsx
│   ├── DesktopIcon.tsx
│   └── WindowManager.tsx
│
├── windows/              # one folder per .exe app
│   ├── About/  Projects/  Experience/  Resume/  Contact/
│   ├── Terminal/  MissionControl/  LiveMetrics/
│   ├── ArchitectureExplorer/  DecisionEngine/  MindMap/
│   ├── CodeReviewSimulator/  AIAssistant/
│
├── features/             # window-manager, terminal, mission-control, github,
│                         # leetcode, wakatime, architecture, decisions,
│                         # mind-map, code-review, ai-assistant, knowledge-base
│
├── components/
│   ├── ui/  window/  cards/  charts/  graphs/  common/
│
├── store/                # Zustand
│   ├── windowStore.ts  desktopStore.ts  terminalStore.ts
│   ├── aiStore.ts  metricsStore.ts
│
├── hooks/
├── lib/                  # gemini/ github/ leetcode/ wakatime/ search/ utils/
├── types/
├── constants/
├── data/
├── content/
└── styles/
```

---

## 5. Backend Folder Structure (`backend/src/`)

```
src/
├── app/api/
│   ├── ai/chat/route.ts     # Gemini chat with content context injection
│   ├── github/route.ts      # proxy + cache + normalize (hides keys)
│   ├── leetcode/route.ts
│   ├── wakatime/route.ts
│   └── vercel/route.ts
│
├── lib/
│   ├── gemini/              # Gemini client + prompt builder
│   ├── knowledge-base/      # markdown retrieval (stable interface → RAG-swappable)
│   ├── github/ leetcode/ wakatime/ vercel/
│
├── content/                 # SINGLE source of truth (see §3)
│   ├── resume/ projects/ blogs/ architecture/
│   ├── decisions/ experience/ skills/ code-reviews/
│
├── types/
└── constants/
```

---

## 6. Window Manager & State Strategy (Zustand)

| Store | Responsibility |
|-------|----------------|
| `windowStore` | open windows array, z-index ordering, focus, position/size, minimize / maximize / close, per-app singleton vs multi-instance rules |
| `desktopStore` | desktop icons, start-menu open state, active wallpaper / theme |
| `terminalStore` | command history, output buffer, registered commands |
| `aiStore` | chat messages, loading state, selected context scope |
| `metricsStore` | cached GitHub / LeetCode / Wakatime / Vercel data + last-fetched timestamps |

**Data flow:**

```
user action → component event → store action → state update → WindowManager re-render
```

The `WindowManager` subscribes to `windowStore` and renders the ordered window stack; each window's chrome (drag, focus, min/max/close) dispatches store actions only.

---

## 7. API Strategy

- All external / secret-bearing calls go through **backend** route handlers — API keys stay server-side only.
- Frontend `lib/*` clients call the backend base URL via `NEXT_PUBLIC_API_BASE_URL`.
- Each proxy **normalizes** the upstream response into a stable shape, with a simple in-memory / edge cache and per-source revalidation windows.
- Uniform error/loading contract: a typed `ApiResult<T>` (`{ ok: true, data } | { ok: false, error }`).

---

## 8. Gemini Integration Strategy (v1: Markdown Retrieval + Context Injection)

On `POST /api/ai/chat`:
1. `lib/knowledge-base` selects relevant markdown from `content/` by keyword / section retrieval.
2. Build a system prompt: engineer persona + injected context.
3. Call Gemini; return (or stream) the answer.

**Scope of answers:** projects, resume, experience, blogs, architecture, skills, engineering decisions, challenges, code reviews, future goals.

**Guardrails:** max context-token budget; graceful fallback when no content matches; instruct the model not to invent facts beyond the knowledge base.

**Initial implementation:** Markdown Retrieval + Gemini Context Injection. **No vector DB. No RAG initially.**

---

## 9. Future RAG Upgrade Path (designed, not built)

When the knowledge base outgrows keyword retrieval:
```
markdown → chunk → embeddings → vector store (pgvector / Pinecone / Chroma) → top-k retrieve → inject
```
Keep the `lib/knowledge-base` interface **stable** so the retrieval implementation can be swapped without touching `/api/ai/chat`.

---

## 10. Code Review Simulator (flagship feature)

**Purpose:** demonstrate engineering thinking. Content-driven — each case is a markdown file in `content/code-reviews/` with these sections:

> Problem · Context · Constraints · Investigation · Root Cause · Alternative Solutions · Final Decision · Tradeoffs · Outcome · Lessons Learned

**Seed cases:** `authentication-bug.md`, `database-performance.md`, `testing-failure.md`, `deployment-issue.md`, `appointment-conflict.md`.

The `CodeReviewSimulator.exe` window parses and renders these sections with in-window navigation.

---

## 11. Live API Hub

`LiveMetrics.exe` and `MissionControl.exe` read from `metricsStore`, which is populated from the backend proxies. Displays:
- Repositories, commits, stars (GitHub)
- Coding hours (Wakatime)
- Problems solved (LeetCode)
- Deployment status (Vercel)

Rendered via `components/charts` and `components/graphs`.

---

## 12. Implementation Phases

| Phase | Scope |
|-------|-------|
| **1 — OS Shell Foundation** | **Detailed below — the only buildable phase now.** |
| 2 | Static content windows (About, Projects, Experience, Resume, Contact) + markdown rendering |
| 3 | `Terminal.exe` — command registry + history |
| 4 | Backend API service + Live API Hub (GitHub / LeetCode / Wakatime / Vercel) + LiveMetrics / MissionControl |
| 5 | Gemini AI Assistant (markdown retrieval + context injection) |
| 6 | Code Review Simulator + Decision Engine + Architecture Explorer + Mind Map |
| 7 | Polish, theming, animations, accessibility, deploy (2 Vercel projects) |
| 8 (future) | RAG upgrade |

---

## 13. Phase 1 — Detailed Scope (build now)

**Goal:** a working desktop OS shell, no feature content yet.

**Steps:**
1. Install frontend deps: `zustand`, `framer-motion`, `lucide-react`, `clsx`, `tailwind-merge`.
2. Create `frontend/src/store/windowStore.ts` + `desktopStore.ts` (Zustand) with the window lifecycle actions from §6.
3. Create `frontend/src/desktop/`: `Desktop.tsx`, `Taskbar.tsx`, `StartMenu.tsx`, `DesktopIcon.tsx`, `WindowManager.tsx`.
4. Create `frontend/src/components/window/Window.tsx` (draggable, focusable; min / max / close chrome) + base `components/ui` primitives.
5. Create `frontend/src/types/window.ts` and `frontend/src/constants/apps.ts` — registry of the 13 `.exe` apps → `{ icon, title, component, defaultSize }`.
6. Wire `frontend/src/app/page.tsx` to render `<Desktop />`; global styles in `styles/`.
7. Each of the 13 apps is registered but opens a placeholder window body ("Coming in Phase N").

**Acceptance criteria:**
- Boots to a desktop; icons visible.
- Double-click an icon → opens a draggable window.
- Taskbar shows open windows.
- Start menu lists all apps.
- Focus / z-index / minimize / maximize / close all work correctly.

---

## 14. Note on Existing Scaffolds

Both `frontend/` and `backend/` are vanilla `create-next-app` (Next 16.2.9, React 19, Tailwind v4, TypeScript). **Phase 1 builds inside `frontend/` only;** `backend/` stays untouched until Phase 4.

---

## Verification

- **This document:** confirm all 14 sections render and Phase 1 is the only fully-detailed phase.
- **Phase 1 (when approved):** `cd developer-os/frontend && npm install && npm run dev`, then walk the Phase 1 acceptance checklist in §13 in the browser.

---

## 15. 3D Strategy (Senior UI/UX Architect + 3D Web Engineer review)

> **Guiding principle:** 3D is a *tool for comprehension and delight*, not decoration. Use it only where a third dimension makes information clearer (spatial relationships, depth, scale) or where a hero moment justifies the cost. Everything a recruiter reads — text, code, metrics tables — stays crisp, fast, accessible 2D DOM. **A janky 3D scene reads as "amateur"; a restrained one reads as "senior."** Performance and professionalism are the constraints, not the 3D itself.

### 15.1 Stack additions (lazy-loaded, never in the base bundle)
- **React Three Fiber (R3F)** — the React renderer for Three.js. Use it for everything declarative: scene graphs as components, hooks (`useFrame`, `useThree`), and integration with React state/Zustand.
- **Three.js** — the underlying engine. Use directly only for low-level needs R3F doesn't wrap cleanly (custom `ShaderMaterial`, `BufferGeometry` for large instanced point clouds, post-processing passes).
- **@react-three/drei** — helpers (`OrbitControls`, `Html`, `Bounds`, `Environment`, `Line`, `Billboard`, `AdaptiveDpr`, `PerformanceMonitor`). Saves hundreds of lines.
- **@react-three/postprocessing** — bloom / vignette / SSAO, used sparingly for the hero scenes only.
- **Rule:** every 3D surface is a `next/dynamic` import with `{ ssr: false }` and a 2D skeleton fallback. The Three.js bundle (~150 KB gzipped) must never load for users who only open About/Resume/Contact.

### 15.2 Per-module verdict

| # | Module | 3D? | One-line reason |
|---|--------|-----|-----------------|
| 1 | Desktop | **Subtle only** | Ambient depth wallpaper — never interactive 3D over working windows |
| 2 | Taskbar | **No** | Pure utility chrome; 3D would hurt speed & clarity |
| 3 | Start Menu | **No** | Fast launcher; 2D + Framer Motion is correct |
| 4 | Mission Control | **Yes (hero)** | Spatial overview of windows/projects benefits from depth |
| 5 | Project Explorer | **Optional** | A 3D "gallery" view is a nice toggle, but list/grid stays default |
| 6 | Architecture Explorer | **Yes (flagship)** | System diagrams are inherently spatial — 3D layered graph shines |
| 7 | Decision Engine | **No (2D graph)** | Decision trees read best as clean 2D React Flow |
| 8 | Mind Map | **Yes** | Force-directed knowledge graph is the canonical 3D-graph use case |
| 9 | Code Review Simulator | **No** | It's reading + diffs; 3D would harm legibility |
| 10 | AI Assistant | **Subtle only** | Optional small 3D "presence" orb; chat itself stays 2D |
| 11 | Live Metrics | **Mostly 2D** | Standard charts win; one optional 3D contribution-globe accent |
| 12 | Terminal | **No** | Monospace text; never 3D |

### 15.3 Module-by-module detail

**1. Desktop — Subtle only**
- *Why:* A faint parallax/depth backdrop sells the "OS" feel and frames the brand. Full interactive 3D behind live windows kills GPU budget and distracts from content.
- *Implementation:* One low-poly/shader animated background (slow gradient mesh, drifting particles, or parallax layers reacting to pointer). R3F `<Canvas>` fixed at `z-index: 0`, windows render above in normal DOM. Cap DPR at 1.5, pause `useFrame` when any window is maximized or the tab is hidden.
- *Performance:* Low if shader-based and frame-throttled (~30 fps is fine for a backdrop). Risk only if particle count is high — keep < 2–3k instanced points.
- *UX:* High polish-to-cost ratio; immediate "this is a real OS" impression. Must respect `prefers-reduced-motion` (freeze to a static image).

**2. Taskbar — No**
- *Why:* It's the most-used control surface; latency and crispness matter more than flair.
- *Implementation:* 2D + Framer Motion micro-interactions (hover lift, active underline) — already built in Phase 1.
- *Performance:* N/A. *UX:* 3D here would feel gimmicky and slow.

**3. Start Menu — No**
- *Why:* Launch speed is the whole job. A 3D open animation adds jank risk for zero comprehension gain.
- *Implementation:* Framer Motion slide/scale (current Phase 1 approach). *Performance:* N/A. *UX:* Fast = professional.

**4. Mission Control — Yes (signature hero)**
- *Why:* macOS Mission Control / Exposé is spatial by nature. Arranging open windows + featured projects on a gently tilted 3D plane communicates "overview" instantly and is a memorable hero moment for recruiters.
- *Implementation:* R3F scene; each window/project is a textured `<Billboard>` or rounded plane laid out on a curved grid. `<Html transform>` (drei) to render real DOM previews onto 3D cards so content stays accessible. Smooth camera dolly via `<Bounds>`/`react-spring`. Click a card → animate camera in → hand off to the normal 2D window.
- *Performance:* Medium. Bounded — you only ever show N open windows + a handful of featured cards (< ~30 planes). Use instancing/texture atlases; suspend the loop when not in view.
- *UX:* High. The "wow" view that makes the portfolio memorable, while still being functional navigation.

**5. Project Explorer — Optional (2D default, 3D toggle)**
- *Why:* Browsing/reading project details is a 2D task. But an optional "Gallery" mode (3D carousel/wall of project cards) adds personality without forcing 3D on everyone.
- *Implementation:* Default = 2D grid/list. Toggle → R3F curved card wall or coverflow with `OrbitControls` (damped, constrained). Selecting a card opens the standard 2D detail window.
- *Performance:* Medium, only when the toggle is on; lazy-load the scene. *UX:* Fun, opt-in; never blocks the fast path to content.

**6. Architecture Explorer — Yes (flagship 3D)**
- *Why:* This is *the* feature where 3D earns its place. Real system architecture is layered (client → edge → services → data). A 3D layered node graph lets you show those layers as stacked planes with connections crossing depth — something a flat diagram can't convey as intuitively. Directly demonstrates senior system-design thinking.
- *Implementation:* R3F. Nodes = instanced rounded boxes/cards on discrete Z-layers; edges = drei `<Line>`/`<QuadraticBezierLine>` (or `meshline` for glow). Labels via `<Html>` billboards. Damped `OrbitControls` with locked vertical range, "focus node → fly camera" interaction, layer toggle. **Decision:** for purely hierarchical/flow diagrams keep React Flow (2D); reserve 3D for the multi-layer system view so each tool is used where it's strongest.
- *Performance:* Medium–High; the main one to budget carefully. Use instancing, frustum culling, `AdaptiveDpr`, and a hard node cap (lazy-expand large graphs). Static camera when idle.
- *UX:* High for engineers; potentially overwhelming for non-technical viewers — provide a "2D flat" fallback toggle and sensible default camera framing.

**7. Decision Engine — No (intentionally 2D)**
- *Why:* Decision trees / weighted criteria are about *reading logic and tradeoffs*. 2D React Flow with clear labels, edges, and side-panel reasoning is more legible than any 3D arrangement.
- *Implementation:* React Flow + animated panels (Framer Motion). *Performance:* Low. *UX:* Clarity beats spectacle here; 3D would add cognitive load.

**8. Mind Map — Yes**
- *Why:* A knowledge/skills graph with many interlinked nodes is the textbook case for 3D force-directed layout: depth relieves the edge-crossing clutter that cripples large 2D graphs, and orbiting reveals structure.
- *Implementation:* `react-force-graph-3d` (wraps Three.js) for speed of delivery, **or** custom R3F + a force simulation (`d3-force-3d`) for full visual control and theme consistency. Nodes instanced; labels as billboards/`<Html>` shown on hover/zoom. Click → focus + open related content.
- *Performance:* Medium; scales to a few hundred nodes with instancing. Freeze the simulation once settled (don't run physics every frame forever). *UX:* High and genuinely useful for exploration — also a strong visual signature.

**9. Code Review Simulator — No**
- *Why:* It's reading code, diffs, and written reasoning. Legibility is everything; 3D actively harms it.
- *Implementation:* 2D — syntax-highlighted code, diff view, structured sections, Framer Motion step transitions. *Performance:* Low. *UX:* Keep it a focused reading surface.

**10. AI Assistant — Subtle only**
- *Why:* The conversation must stay fast, scrollable, copy-pasteable 2D. A small animated 3D "presence" (orb/avatar) that reacts to typing/thinking adds character cheaply.
- *Implementation:* Small dedicated R3F `<Canvas>` (e.g. 96–160px) in the header — a shader blob/icosahedron that pulses on `isLoading`. Independent of the chat DOM. *Performance:* Low (tiny canvas, low DPR). *UX:* Adds life/personality; strictly optional and easy to disable.

**11. Live Metrics — Mostly 2D, one optional 3D accent**
- *Why:* GitHub/LeetCode/Wakatime numbers are read fastest as standard charts (bars, lines, heatmaps). One tasteful 3D accent — a rotating contribution **globe** or extruded contribution surface — can be a hero stat without sacrificing the readable dashboard.
- *Implementation:* `recharts`/`visx` for the real charts (2D). Optional R3F globe (`three-globe` or custom instanced points) as a single accent card. *Performance:* Low for charts; Medium for the globe (keep it one bounded scene, pause when offscreen). *UX:* Best of both — credible analytics + one memorable visual.

**12. Terminal — No**
- *Why:* Monospaced text I/O. 3D is pure downside. *Implementation:* 2D. *Performance:* Low. *UX:* Authentic terminals are flat.

### 15.4 What stays strictly 2D (DOM, no Canvas)
Taskbar, Start Menu, Decision Engine, Code Review Simulator, Terminal, About, Projects/Experience/Resume/Contact reading content, all chart numerics, and **all primary text/code anywhere**. Recruiters read these — they must be instant, selectable, and accessible.

### 15.5 Best professional-looking 3D effects (taste guide)
- **Restraint + depth-of-field:** subtle DOF, soft shadows (`<ContactShadows>`), gentle fog — reads premium; harsh neon/spinning logos read amateur.
- **Damped, constrained controls:** always `enableDamping`, clamp polar/zoom range. Free-for-all orbit feels broken.
- **Glassmorphism + emissive accents:** frosted node cards, thin emissive edges, a touch of **bloom** (postprocessing) on connections only.
- **Instanced geometry + texture atlases** for repeated nodes/cards — the single biggest perf win.
- **Camera choreography over user fiddling:** "click → fly to" beats expecting users to navigate manually.
- **Consistent lighting/material language** across all 3D scenes so the OS feels like one product.
- **Cohesive palette** matching the 2D theme (the dark slate/sky accents already in Phase 1).

### 15.6 Mandatory performance guardrails (apply to every 3D surface)
- `next/dynamic` + `{ ssr: false }`; 2D skeleton while the chunk loads.
- drei `<AdaptiveDpr>` + `<PerformanceMonitor>` to auto-drop quality on weak GPUs; cap DPR (≤1.5, ≤2 on retina hero only).
- **Pause `useFrame` when offscreen, when the window is minimized, or `document.hidden`** — never burn GPU on a backdrop nobody sees.
- Respect `prefers-reduced-motion` → static fallback image/snapshot.
- Hard node/particle caps + instancing + frustum culling; lazy-expand large graphs.
- Dispose geometries/materials/textures on unmount (avoid leaks across window open/close).
- Mobile / low-power / WebGL-unavailable → automatically serve the 2D fallback; treat 3D as progressive enhancement.

### 15.7 Phasing (3D layered onto the existing roadmap, never blocking content)
- **Phase 1 (done): NO 3D.** Ship the fast, accessible 2D OS shell first. (Already complete.)
- **3D Phase A — Foundation & first hero** (after roadmap Phase 4): add R3F/Three/drei infra, the global perf guardrails (§15.6), the **Desktop ambient backdrop**, and **Mission Control** as the first hero scene.
- **3D Phase B — Flagship graphs** (with roadmap Phase 6): **Architecture Explorer** 3D layered graph and **Mind Map** force-directed graph, each with a 2D fallback toggle.
- **3D Phase C — Accents & polish:** AI Assistant presence orb, Live Metrics globe, optional Project Explorer gallery toggle, postprocessing pass, full reduced-motion/mobile fallbacks.
- **Never:** Taskbar, Start Menu, Decision Engine, Code Review Simulator, Terminal.

> **Note on stack version:** Phase 1 was built on Next 16 / React 19 in `frontend/`; if the target is Next 15, R3F + drei + postprocessing are fully compatible there too — no plan changes needed. `react-draggable` and `react-flow` slot into the 2D modules (Decision Engine, flat Architecture/Project views) exactly as listed above.

---

> **Next step:** Per the spec — *generate Phase 1 only, then wait for approval before moving to the next phase.* (3D work begins no earlier than **3D Phase A**, after the core 2D modules are functional.)
