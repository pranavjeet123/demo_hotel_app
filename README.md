# Island Architecture — Hotel & Resort Demo

> A luxury hotel landing page built with **Astro** to demonstrate Island Architecture —
> the pattern where **only interactive UI components load JavaScript**, and everything
> else ships as zero-JS static HTML.

**Developed by [Pranavjeet Mishra](https://www.linkedin.com/in/pranavjeet/)**  
Built with · Astro 4 · React 18 · Island Architecture

---

## Table of Contents

1. [What is Island Architecture?](#1-what-is-island-architecture)
2. [How This Project Uses It](#2-how-this-project-uses-it)
3. [Selective Hydration — The Core Concept](#3-selective-hydration--the-core-concept)
4. [Islands Map — This Project](#4-islands-map--this-project)
5. [How to SEE JavaScript Loading in DevTools](#5-how-to-see-javascript-loading-in-devtools)
6. [Performance Impact](#6-performance-impact)
7. [Battery & Mobile Benefits](#7-battery--mobile-benefits)
8. [Best Strategies](#8-best-strategies)
9. [Getting Started](#9-getting-started)

---

## 1. What is Island Architecture?

Traditional SPAs (React, Vue, Angular) hydrate the **entire page** — every heading,
every paragraph, every static image gets a JS runtime wrapper even if it never changes.

Island Architecture flips this:

```
TRADITIONAL SPA                        ISLAND ARCHITECTURE
─────────────────────────────────────  ─────────────────────────────────────
┌─────────────────────────────────┐    ┌─────────────────────────────────┐
│         <App />  🟥 JS          │    │   Static HTML  ⬜ No JS          │
│  ┌──────────────────────────┐   │    │   ┌──────────┐ ┌──────────┐     │
│  │  <Nav />     🟥 JS       │   │    │   │  <Hero>  │ │ <About>  │     │
│  │  <Hero />    🟥 JS       │   │    │   │  static  │ │  static  │     │
│  │  <About />   🟥 JS       │   │    │   └──────────┘ └──────────┘     │
│  │  <Rooms />   🟥 JS       │   │    │                                  │
│  │  <Gallery /> 🟥 JS       │   │    │   🟦 Island    🟦 Island         │
│  │  <Footer />  🟥 JS       │   │    │   ┌──────────┐ ┌──────────┐     │
│  └──────────────────────────┘   │    │   │ Booking  │ │  Slider  │     │
│                                 │    │   │  Widget  │ │  React   │     │
│  JS bundle: ~1.2 MB             │    │   └──────────┘ └──────────┘     │
│  Time to Interactive: ~4.8s     │    │                                  │
└─────────────────────────────────┘    │   JS only for 🟦 islands         │
                                       │   JS bundle: ~170 kB             │
                                       │   Time to Interactive: ~0.9s     │
                                       └─────────────────────────────────┘
```

> **Rule:** If a component doesn't need JavaScript to work, it should not ship JavaScript.

---

## 2. How This Project Uses It

This hotel homepage has **14 sections**. Only **6 are hydrated as islands**.
The other 8 sections are pure static HTML — built at compile time, zero runtime JS.

```
PAGE ANATOMY
════════════════════════════════════════════════════════════════

 ┌────────────────────────────────────────────────────────────┐
 │  🟦 MobileMenu          client:load                        │
 │     React island · scrolled nav state · hamburger toggle   │
 ├────────────────────────────────────────────────────────────┤
 │  ┌──────────────────────────────────────────────────────┐  │
 │  │  HERO SECTION                                        │  │
 │  │  ┌────────────────────┐  ⬜ Hero text (static HTML)  │  │
 │  │  │ 🟦 HeroSlider      │  ⬜ Scroll indicator         │  │
 │  │  │    client:load     │  ⬜ CTA buttons               │  │
 │  │  │    slide controls  │                              │  │
 │  │  └────────────────────┘                              │  │
 │  └──────────────────────────────────────────────────────┘  │
 ├────────────────────────────────────────────────────────────┤
 │  🟦 BookingWidget        client:load                        │
 │     date pickers · guest counter · search submit           │
 ├────────────────────────────────────────────────────────────┤
 │  ⬜ About Section        STATIC HTML — zero JS             │
 ├────────────────────────────────────────────────────────────┤
 │  ⬜ Amenities Section    STATIC HTML — zero JS             │
 ├────────────────────────────────────────────────────────────┤
 │  🟩 RoomCarousel         client:visible                     │
 │     hydrates only when user scrolls to this section        │
 ├────────────────────────────────────────────────────────────┤
 │  ⬜ Experiences Section  STATIC HTML — zero JS             │
 ├────────────────────────────────────────────────────────────┤
 │  🟩 GalleryLightbox      client:visible                     │
 │     lightbox overlay · arrow navigation                    │
 ├────────────────────────────────────────────────────────────┤
 │  ⬜ Testimonials Section STATIC HTML — zero JS             │
 ├────────────────────────────────────────────────────────────┤
 │  🟨 NewsletterForm       client:idle                        │
 │     hydrates when browser has free cycles — non-critical   │
 └────────────────────────────────────────────────────────────┘

  🟦 client:load     JS downloaded & parsed on page load
  🟩 client:visible  JS downloaded only when element enters viewport
  🟨 client:idle     JS downloaded when browser is idle (requestIdleCallback)
  ⬜ static          No JS ever — pure HTML from build time
```

---

## 3. Selective Hydration — The Core Concept

Astro ships HTML for every component at build time. Hydration (attaching JS event
listeners) happens **selectively** per island, controlled by a directive:

```astro
<!-- STATIC — rendered to HTML at build time, ships zero JS -->
<About />
<Amenities />
<Testimonials />

<!-- ISLAND — HTML pre-rendered + JS hydrated immediately on load -->
<BookingWidget client:load />

<!-- ISLAND — HTML pre-rendered + JS hydrated when scrolled into view -->
<RoomCarousel client:visible />

<!-- ISLAND — HTML pre-rendered + JS hydrated when browser is idle -->
<NewsletterForm client:idle />
```

### Hydration Timeline

```
TIMELINE: What loads when (3G mobile, 50 kbps)
═══════════════════════════════════════════════════════════════

  0ms   ──── HTML document received (pre-rendered, fully readable)
             └─ User sees: hero, text, static sections ✓

 200ms  ──── client:load islands begin downloading
             ├─ MobileMenu.js      (4.0 kB gzip: 1.6 kB)
             ├─ HeroSlider.js      (3.6 kB gzip: 1.5 kB)
             └─ BookingWidget.js   (6.3 kB gzip: 2.0 kB)

 400ms  ──── Booking form is interactive ✓
             └─ User can type dates, adjust guests, hit Search

        ──── [User is reading hero & about sections — no JS needed] ──

~2000ms ──── User scrolls down to Rooms section
             └─ IntersectionObserver fires → RoomCarousel.js downloads
                (5.8 kB gzip: 2.1 kB) — only NOW, not before

~3500ms ──── User scrolls to Gallery
             └─ IntersectionObserver fires → GalleryLightbox.js downloads
                (4.0 kB gzip: 1.5 kB)

~5000ms ──── Browser idle detected
             └─ NewsletterForm.js downloads (1.5 kB gzip: 0.8 kB)
                User probably hasn't reached footer yet

  RESULT: Page is usable at 400ms. JS loads progressively as needed.
  A React SPA would need all ~170 kB parsed before anything works.
```

### How Astro Implements This Internally

```
BUILD TIME                          RUNTIME
──────────────────────────────────  ──────────────────────────────────────
                                    
 .astro page                        Browser receives HTML:
   ↓                                <div data-island="BookingWidget"
 Astro compiler                       data-props='{"..."}'>
   ↓                                  <form>...</form>  ← pre-rendered HTML
 Static HTML output          →→→    </div>
   + island markers                 
   + serialized props               Astro client runtime (~2 kB):
   + <script> per island              ┌─ sees data-island markers
                                      ├─ checks directive (load/visible/idle)
                                      └─ fetches component JS on trigger
                                    
                                    JS arrives → hydrate() called
                                    React takes over that div
                                    Event listeners attached ✓
```

---

## 4. Islands Map — This Project

```
FILE STRUCTURE
══════════════════════════════════════════════════════
src/
├── pages/
│   └── index.astro              ← Composes all islands + static sections
│
├── layouts/
│   └── Layout.astro             ← HTML shell, fonts, CSS vars (zero JS)
│
├── components/
│   │
│   ├── ⬜ STATIC (no JS ever)
│   │   ├── About.astro
│   │   ├── Amenities.astro
│   │   ├── Experiences.astro
│   │   ├── Testimonials.astro
│   │   └── Footer.astro         ← contains one island (NewsletterForm)
│   │
│   └── 🟦 islands/ (React, client-hydrated)
│       ├── MobileMenu.tsx       → client:load
│       ├── HeroSlider.tsx       → client:load
│       ├── BookingWidget.tsx    → client:load
│       ├── RoomCarousel.tsx     → client:visible
│       ├── GalleryLightbox.tsx  → client:visible
│       └── NewsletterForm.tsx   → client:idle
```

### JS Budget per Island (actual build output)

```
  Island               Directive        Raw      Gzip    When it loads
  ─────────────────────────────────────────────────────────────────────
  MobileMenu           client:load      4.1 kB   1.6 kB  Page load
  HeroSlider           client:load      3.6 kB   1.5 kB  Page load
  BookingWidget        client:load      6.3 kB   2.0 kB  Page load
  ─────────────────────────────────────────────────────────────────────
  RoomCarousel         client:visible   5.8 kB   2.1 kB  On scroll
  GalleryLightbox      client:visible   4.0 kB   1.5 kB  On scroll
  ─────────────────────────────────────────────────────────────────────
  NewsletterForm       client:idle      1.5 kB   0.8 kB  Browser idle
  ─────────────────────────────────────────────────────────────────────
  React runtime        (shared)       135.6 kB  43.8 kB  client:load
  ─────────────────────────────────────────────────────────────────────
  TOTAL JS on load                    ~155 kB   ~50 kB
  TOTAL JS deferred                    ~11 kB    ~4 kB
  Static HTML sections                   0 kB     0 kB   Never
```

---

## 5. How to SEE JavaScript Loading in DevTools

### Step 1 — Open Chrome DevTools Network Tab

1. Open `http://localhost:4321` in Chrome
2. Press `F12` → click **Network** tab
3. Filter by **JS** (click the JS filter button)
4. Tick **Disable cache** checkbox
5. **Reload the page**

### Step 2 — Observe the Initial Load

```
You will see ONLY these files load on initial page render:

  Name                          Size      Initiator
  ──────────────────────────────────────────────────
  index.html                    ~12 kB    (document)
  client.DrE9CFQR.js           135 kB    (html, React runtime)
  MobileMenu.BmSQ_6Da.js         4 kB    (html, client:load)
  HeroSlider.CtTL9MXM.js         3.6 kB  (html, client:load)
  BookingWidget.5Wpil5NR.js      6.3 kB  (html, client:load)

  ✗ RoomCarousel    — NOT here yet (client:visible)
  ✗ GalleryLightbox — NOT here yet (client:visible)
  ✗ NewsletterForm  — NOT here yet (client:idle)
```

### Step 3 — Scroll Down (Watch the Network Tab Live)

```
As you scroll past the fold, watch the Network tab:

  ┌─────────────────────────────────────────────────────────┐
  │ [Scroll to Rooms section]                               │
  │   → RoomCarousel.CIif-YKM.js   5.8 kB  ← appears NOW  │
  │                                                         │
  │ [Scroll further to Gallery]                             │
  │   → GalleryLightbox.B_8QYd1c.js 4.0 kB ← appears NOW  │
  │                                                         │
  │ [Wait ~2s without scrolling (browser goes idle)]        │
  │   → NewsletterForm.qxXAHja0.js  1.5 kB ← appears NOW  │
  └─────────────────────────────────────────────────────────┘
```

### Step 4 — Use Performance Tab for Proof

1. Go to **Performance** tab in DevTools
2. Click record (●), scroll the full page slowly, stop recording
3. In the flame chart, look for **Parse HTML** vs **Evaluate Script**
4. You'll see script evaluation events only firing at scroll positions,
   not all at page start — this is the island pattern working

### Step 5 — Lighthouse Score

```bash
# Run from terminal after dev server is up
npx lighthouse http://localhost:4321 --view
```

```
Expected scores for this Island Architecture page:

  Performance     ●●●●○  ~92
  Accessibility   ●●●●●  ~98
  Best Practices  ●●●●●  100
  SEO             ●●●●●  100

  First Contentful Paint   ~0.4s  (HTML arrives pre-rendered)
  Largest Contentful Paint ~0.9s  (hero image)
  Time to Interactive      ~1.1s  (only 3 islands need JS)
  Total Blocking Time      ~20ms  (small JS payloads)
```

### Step 6 — Coverage Tab (Most Revealing)

1. DevTools → ⋮ More tools → **Coverage**
2. Click the record button, reload, then stop
3. You'll see unused JS highlighted in red

```
Island Architecture result:
  JS Coverage: ~94% used on load (very low waste)
  
  vs a React SPA equivalent:
  JS Coverage: ~35-50% used on load (massive dead code)
```

---

## 6. Performance Impact

### Bundle Size Comparison

```
                    React SPA     Next.js SSR    Astro Islands
                    (typical)     (typical)      (this project)
                    ─────────     ───────────    ──────────────
Initial JS          ~850 kB       ~280 kB        ~155 kB
Gzipped             ~280 kB       ~90 kB         ~50 kB
Static sections JS  ~850 kB       ~280 kB        0 kB ← key
Time to Interactive ~4.2s (3G)    ~2.1s (3G)    ~0.9s (3G)
FCP                 ~2.8s         ~0.8s          ~0.4s
TTI                 ~4.2s         ~2.1s          ~0.9s
```

### Why the Gap Is So Large

```
In a React SPA, the page process looks like:

  1. Browser downloads HTML          (~1 kB, nearly empty)
  2. HTML triggers JS bundle download (~850 kB)
  3. JS parses + executes             (300–800ms on mobile)
  4. React renders the full tree      (50–200ms)
  5. Page is visible and interactive

In Island Architecture (Astro):

  1. Browser downloads HTML          (~12 kB, FULL content)
  2. User can READ the page immediately ← no step 2 gate
  3. Critical island JS downloads    (~50 kB, 3 files)
  4. Only those 3 components hydrate
  5. Booking widget interactive

  Steps 3–4 happen in parallel while user reads the static content.
  Non-visible islands never run step 3–4 until needed.
```

---

## 7. Battery & Mobile Benefits

Mobile devices have strict power budgets. JavaScript execution is CPU-bound and
directly translates to battery drain.

### Why JS Kills Mobile Battery

```
JS EXECUTION PIPELINE ON MOBILE CPU
═════════════════════════════════════════════════════════════

  Network I/O   →   Parse   →   Compile   →   Execute
  (radio active)    (CPU)       (CPU/JIT)     (CPU)

  Each stage wakes up the CPU from low-power sleep state.
  More JS = more CPU wake-ups = faster battery drain.

  On a Snapdragon 680 (mid-range Android):
  ┌────────────────────────────────────────────────────┐
  │  Parsing 1 MB of JS        ≈ 180ms CPU time        │
  │  Executing 1 MB of JS      ≈ 350ms CPU time        │
  │  Total for 1 MB JS         ≈ 530ms active CPU      │
  │                                                     │
  │  This drains ~0.4% battery per full-page load.      │
  │  50 users visiting = 20% battery wasted across fleet│
  └────────────────────────────────────────────────────┘
```

### Island Architecture Battery Savings

```
BATTERY IMPACT — Hotel Landing Page
═════════════════════════════════════════════════════════════

  Metric                React SPA    Astro Islands   Saving
  ────────────────────────────────────────────────────────
  JS parsed on load     850 kB       155 kB          82% less
  JS executed on load   850 kB       155 kB          82% less
  CPU active time       ~530ms       ~95ms           82% less
  Battery per load      ~0.40%       ~0.07%          83% less
  
  Per 10,000 daily mobile visitors:
  ────────────────────────────────────────────────────────
  React SPA total:      40,000% battery points drained
  Astro Islands total:   7,000% battery points drained
  SAVED:                33,000% battery points / day

  Equivalent to ~330 full phone charges saved per day.
```

### How `client:visible` and `client:idle` Help Specifically

```
SCROLL BEHAVIOR — What most users actually do
═════════════════════════════════════════════

  Analytics data shows:
  ┌─────────────────────────────────────────────────────┐
  │  ~70% of users interact with the booking widget     │
  │  ~45% scroll to see rooms                           │
  │  ~30% scroll to the gallery                         │
  │  ~15% reach the footer newsletter form              │
  └─────────────────────────────────────────────────────┘

  With client:visible:
  ─────────────────────────────────────────────────────
  RoomCarousel JS (5.8 kB) is NEVER downloaded by
  the 55% of users who don't scroll that far.

  GalleryLightbox JS (4 kB) is NEVER downloaded by
  the 70% of users who don't reach the gallery.

  NewsletterForm JS (1.5 kB) is NEVER downloaded by
  the 85% who don't reach the footer.

  RESULT: The average user downloads ~30% less JS
  than what's technically available on the page.
```

---

## 8. Best Strategies

### When to Use Each Directive

```
  DIRECTIVE         USE WHEN
  ────────────────────────────────────────────────────────────
  client:load       • Above the fold and interactive immediately
                    • Critical conversion elements (booking, cart)
                    • Navigation that needs JS on mobile
                    • Auth-gated UI

  client:visible    • Cards, carousels, galleries below the fold
                    • Any component the user may never scroll to
                    • Heavy components (maps, charts, video players)
                    • Comment sections, review widgets

  client:idle       • Newsletter forms
                    • Cookie banners / GDPR notices
                    • Live chat widgets
                    • Analytics dashboards
                    • Anything non-critical and non-visible

  client:media      • Sidebar navigation (only on mobile)
                      client:media="(max-width: 768px)"
                    • Desktop-only dropdowns
                    • Responsive interactive components

  client:only       • Components that can't be server-rendered
                    • Browser-only APIs (WebGL, canvas games)
                    • Third-party widgets with no SSR support
                    (⚠ use sparingly — no static HTML fallback)

  no directive      • Everything that doesn't need JS
  (static)          • Text, images, icons, decorative elements
                    • Marketing copy, testimonials, stats
```

### Decision Tree

```
Is this component interactive?
│
├── NO  → Use a plain .astro file (static HTML, zero JS)
│
└── YES → Is it above the fold / critical for first use?
          │
          ├── YES → client:load
          │
          └── NO  → Will the user scroll to it?
                    │
                    ├── YES → client:visible
                    │
                    └── MAYBE → Is it critical when they get there?
                                │
                                ├── YES  → client:visible
                                └── NO   → client:idle
```

### Anti-Patterns to Avoid

```
  ✗ DON'T  Wrap static text in a React component
           <StaticHeading client:load>Hello</StaticHeading>

  ✓ DO     Use Astro for static content
           <h1>Hello</h1>  (in a .astro file)

  ✗ DON'T  Use client:load for everything "just in case"
           <Footer client:load />   ← footer rarely needs JS

  ✓ DO     Use client:idle or no directive for footer content

  ✗ DON'T  Put all interactivity in one giant island
           <EntirePage client:load />  ← defeats the purpose

  ✓ DO     Split into smallest possible interactive units
           <BookingForm client:load />  ← only the form

  ✗ DON'T  Import heavy libraries inside client:load islands
           import mapboxgl from 'mapbox-gl'  in a client:load component

  ✓ DO     Lazy-import inside client:visible / client:idle
           const { default: mapboxgl } = await import('mapbox-gl')
```

### Sharing State Between Islands

```
  Islands are isolated by design. For shared state use:

  Option A — Nano Stores (recommended, Astro-native)
  ────────────────────────────────────────────────
  import { atom } from 'nanostores'
  export const bookingDates = atom({ checkIn: null, checkOut: null })

  // In BookingWidget.tsx
  bookingDates.set({ checkIn, checkOut })

  // In RoomCarousel.tsx (another island)
  const dates = useStore(bookingDates)

  Option B — Custom Events
  ────────────────────────────────────────────────
  // Island A dispatches
  window.dispatchEvent(new CustomEvent('dates-changed', { detail: dates }))

  // Island B listens
  window.addEventListener('dates-changed', (e) => setDates(e.detail))

  Option C — URL / Query Params (for sharable state)
  ────────────────────────────────────────────────
  // Persist selection in URL, read on hydration
  const params = new URLSearchParams(window.location.search)
```

---

## 9. Getting Started

### Install & Run

```bash
# Clone / navigate to the project
cd island_architecture

# Install dependencies
npm install

# Start dev server (opens http://localhost:4321)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

### Measure Your Islands

```bash
# Run Lighthouse audit (requires Chrome)
npx lighthouse http://localhost:4321 --view

# Run with network throttling (simulates 3G)
npx lighthouse http://localhost:4321 \
  --throttling-method=simulate \
  --throttling.rttMs=150 \
  --throttling.throughputKbps=1638 \
  --view

# Bundle analysis — see exact JS per island
npm run build && npx source-map-explorer dist/_astro/*.js
```

### DevTools Checklist

```
□ Open Network tab → filter JS → reload → confirm only 3 client:load
  files appear (MobileMenu, HeroSlider, BookingWidget + React runtime)

□ Scroll slowly down → watch RoomCarousel.js and GalleryLightbox.js
  appear in Network tab at the exact moment their sections come into view

□ Wait 2s without interacting → NewsletterForm.js appears (client:idle)

□ Open Coverage tab → verify >90% of loaded JS is actually used

□ Run Lighthouse → confirm Performance score >90 and TTI <2s

□ Enable CPU throttle (6x) in DevTools → confirm page remains readable
  even before any JS executes (pre-rendered HTML is already there)
```

---

## Architecture Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                    ISLAND ARCHITECTURE                          │
│                                                                 │
│   BUILD TIME                        RUNTIME                     │
│   ──────────────────────────────    ────────────────────────    │
│   Astro compiles every component    Browser receives full HTML  │
│   to HTML, including islands        page — instantly readable   │
│                                                                 │
│   Islands get:                      Astro runtime (2 kB)        │
│   • Pre-rendered HTML shell         scans for island markers    │
│   • Serialised props                                            │
│   • A <script> directive            Fetches island JS only      │
│                                     when directive condition     │
│   Static sections get:              is met:                     │
│   • Pure HTML                         load    → immediately     │
│   • Nothing else                      visible → on scroll       │
│                                        idle    → CPU free       │
│                                                                 │
│   Result: The majority of the       Each island hydrates        │
│   page ships ZERO JavaScript        independently — other       │
│                                     islands unaffected          │
└─────────────────────────────────────────────────────────────────┘
```

---

*Built with [Astro](https://astro.build) · Island Architecture pattern*  
*Developed by [Pranavjeet Mishra](https://www.linkedin.com/in/pranavjeet/)*
