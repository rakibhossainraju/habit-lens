# Design System Specification: Habit Lens

> **Implementation Philosophy:** *"HOW brand philosophy transforms into accessible, high-performance UI, clear component architecture, and maintainable code."*

This document governs visual tokens, layout principles, component architecture, motion guidelines, accessibility rules, and system evolution policies for **Habit Lens**.

---

## 1. Traceability: Brand Philosophy → UI Architecture

The design system translates the brand philosophy (*"Understand yourself better, don't optimize yourself harder"*) into UI decisions via three core principles:

### Principle 1: Calm Precision
- **Brand Rationale:** Habit Lens helps users observe patterns without feeling judged, rushed, or anxious.
- **UI Implications:**
  - Restrained color usage with muted background backdrops.
  - **Neutral Status Communication:** Low energy or short sleep are states to observe, NOT errors or failures. Never use red/green judgmental color coding.
  - Typography-driven visual hierarchy over heavy decorative accents.
  - Restrained micro-interactions with zero forced celebration/confetti.

### Principle 2: Reflective Clarity
- **Brand Rationale:** Render historical trends honestly without arbitrary score formulas, streak counters, or misleading chart scales.
- **UI Implications:**
  - Selective use of monospace typography for quantitative numbers and tabular metric values.
  - Transparent confidence indicators on rule-based insights (e.g., `"High confidence — 14 logs analyzed"`).
  - Clean chart axes with explicit units of measurement and non-manipulated zero-baselines.

### Principle 3: Spatial Breathing Room
- **Brand Rationale:** Avoid high-density visual clutter and icon-stuffed bento boxes so users feel grounded.
- **UI Implications:**
  - Generous internal padding and spatial gaps between sections.
  - Flat card surfaces with crisp single-pixel borders rather than heavy floating drop shadows.
  - Single-level card hierarchy (strictly forbid nested cards within cards).

---

## 2. Technology & Stack Architecture

| Aspect | Technology Stack | Implementation Standard |
| :--- | :--- | :--- |
| **Framework** | Next.js App Router (v16.2), React 19, TypeScript | RSC by default; `'use client'` strictly for interactive primitives |
| **Styling** | Tailwind CSS v4 (`@import "tailwindcss"`) | `@theme inline` mapping to semantic CSS variables in `globals.css` |
| **Primitives** | shadcn/ui (Base Luma style), Radix / `@base-ui/react` | Reusable primitives in `@/components/ui`; composition over duplication |
| **Icons** | Lucide React (`lucide-react`) | Standardized `strokeWidth={1.75}`, sizes 16px (`size-4`) to 20px (`size-5`) |
| **Typography** | `next/font/google` (`Geist`, `Inter`, `Geist_Mono`) | Geist/Inter for primary sans, Geist Mono for quantitative metrics |
| **Motion** | `tw-animate-css` & native CSS transitions | Subtle 150ms–250ms ease-out transitions for interactive state feedback |

---

## 3. Semantic Color System & Tokens

Tokens are defined using OKLCH color space for perceptually balanced lightness and chroma across themes.

### Semantic Color Definitions

| Token | Semantic Role & Behavior |
| :--- | :--- |
| `--background` | Default application canvas. Must remain visually quieter than cards and interactive surfaces. |
| `--foreground` | Primary text color. High legibility contrast against `--background`. |
| `--card` | Elevated surface for grouped content (metrics, log tables, forms). |
| `--card-foreground` | Primary text and label color inside card containers. |
| `--primary` | Primary action surfaces (main buttons, active navigation indicators, key accents). |
| `--primary-foreground` | Text/icons rendered on top of `--primary` surfaces. |
| `--secondary` | Subtle secondary actions and muted surface highlights. |
| `--secondary-foreground` | Text/icons rendered on top of `--secondary` surfaces. |
| `--muted` | Subdued backgrounds for chip tags, table headers, and disabled states. |
| `--muted-foreground` | De-emphasized secondary text, captions, helper hints, and table metadata. |
| `--accent` | Subtle highlight color for active tab states and gentle hover feedback. |
| `--accent-foreground` | Text/icons rendered on top of `--accent` surfaces. |
| `--border` | Single-pixel boundary line defining surface edges without heavy shadows. |
| `--ring` | Focus ring indicator for keyboard navigation accessibility. |

### Color Token Implementation (`src/app/globals.css`)

```css
:root {
  --background: oklch(0.99 0.005 145);
  --foreground: oklch(0.22 0.02 155);

  --card: oklch(1 0 0);
  --card-foreground: oklch(0.22 0.02 155);

  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.22 0.02 155);

  --primary: oklch(0.45 0.12 160);
  --primary-foreground: oklch(0.98 0.01 155);

  --secondary: oklch(0.96 0.015 155);
  --secondary-foreground: oklch(0.28 0.03 155);

  --muted: oklch(0.97 0.01 150);
  --muted-foreground: oklch(0.50 0.03 155);

  --accent: oklch(0.93 0.04 165);
  --accent-foreground: oklch(0.25 0.03 160);

  --destructive: oklch(0.60 0.22 25);
  --border: oklch(0.92 0.01 150);
  --input: oklch(0.92 0.01 150);
  --ring: oklch(0.58 0.08 160);

  --radius: 0.75rem;
}

.dark {
  --background: oklch(0.17 0.015 155);
  --foreground: oklch(0.96 0.01 150);

  --card: oklch(0.22 0.02 155);
  --card-foreground: oklch(0.96 0.01 150);

  --primary: oklch(0.60 0.12 162);
  --primary-foreground: oklch(0.16 0.015 155);

  --secondary: oklch(0.28 0.02 155);
  --secondary-foreground: oklch(0.96 0.01 150);

  --muted: oklch(0.26 0.015 155);
  --muted-foreground: oklch(0.72 0.03 155);

  --accent: oklch(0.34 0.05 165);
  --accent-foreground: oklch(0.97 0.01 150);

  --border: oklch(1 0 0 / 8%);
  --input: oklch(1 0 0 / 12%);
  --ring: oklch(0.62 0.10 162);
}
```

### Theme Application

The theme is DOM state, never React state — the server cannot read `localStorage`
or the OS colour scheme, so any component that renders from a theme value
disagrees with the server's HTML. A blocking script in `<head>` (see
`src/lib/theme.ts`) writes two things to `<html>` before the first paint:

| Attribute | Meaning | Used by |
| :--- | :--- | :--- |
| `.dark` | The **resolved** appearance | `dark:` variant, dark token block |
| `data-theme="light \| dark \| system"` | The **stored** preference | `theme-selected:` variant |

Style preference-dependent UI with these variants rather than a React value:

- `dark:` — anything that differs between light and dark appearance.
- `theme-selected:` — the option in a theme picker matching the stored
  preference. Mark each option with `data-theme-option="light \| dark \| system"`.

`setTheme()` / `toggleTheme()` from `src/lib/theme.ts` are plain event
handlers; they write the preference and update `<html>`, and CSS does the rest.

---

## 4. Foundational Chart System

Chart colors are foundation tokens defined by **perceptual distinction, accessible contrast, and non-reliance on color alone**.

### Chart Tokens
- `--chart-1`: `oklch(0.82 0.07 165)`
- `--chart-2`: `oklch(0.72 0.10 162)`
- `--chart-3`: `oklch(0.62 0.12 160)`
- `--chart-4`: `oklch(0.52 0.13 158)`
- `--chart-5`: `oklch(0.42 0.11 155)`

### Foundational Chart Rules
1. **Never rely solely on color:** Always complement colored chart lines/bars with direct text labels, tooltips, or distinct stroke patterns (e.g. solid vs. dashed lines).
2. **No Judgmental Semantics:** Do not use red for low energy/short sleep or green for high energy. Chart colors represent categories, time periods, or metrics neutral to judgement.
3. **Honest Scaling:** Always start quantitative bar/line charts at zero baselines to avoid exaggerating minor fluctuations.

### Feature Domain Mapping (Habit Lens)
- `Sleep Duration` → `--chart-4`
- `Morning Energy` → `--chart-1`
- `Afternoon Energy` → `--chart-2`
- `Evening Energy` → `--chart-3`
- `Sleep Consistency` → `--chart-5`

---

## 5. Typography System

### Nuanced Monospace Rule
Use `font-mono` **selectively** for prominent metrics, tabular numerical values, timestamps, measurements, and data displays where vertical alignment or quantitative character is desirable. **Do not force monospace onto ordinary prose, form labels, or incidental text.**

### Typography Scale & Roles

| Role | Class | Weight | Size / Line Height | Application |
| :--- | :--- | :--- | :--- | :--- |
| **Page Header** | `text-2xl font-semibold` | 600 | 24px / 32px | Primary page title in top section |
| **Section Title** | `text-lg font-semibold` | 600 | 18px / 28px | Section headings on Dashboard/Analytics |
| **Card Title** | `text-base font-medium` | 500 | 16px / 24px | Card headers and modal titles |
| **Body Standard** | `text-sm font-normal` | 400 | 14px / 22px | Standard paragraph prose and form options |
| **Metric Display** | `font-mono text-2xl font-semibold` | 600 | 24px / 32px | Summary card values (e.g., `7.5 hrs`, `8/10`) |
| **Table Data** | `font-mono text-sm font-normal` | 400 | 14px / 20px | Log entry dates, durations, and numbers |
| **Caption / Hint** | `text-xs text-muted-foreground` | 400 | 12px / 16px | Subtitles, field hints, timestamp metadata |

---

## 6. Layout & Spatial Grammar

Layout rules state **intent and relationships**, leaving implementation details to fit content requirements:

- **Constrained Reading Width:** Primary content areas maintain a comfortable reading and interaction width appropriate for reading logs and filling forms.
- **Data-Dense Expansion:** Dashboard, Analytics, and Data Table views may expand wider where multi-column metric density requires it.
- **Content-Driven Responsiveness:** Multi-column layouts and sidebars collapse based on content pressure and available screen real estate rather than rigid breakpoint conventions alone.

---

## 7. Component Principles & Product Patterns

### Foundational UI Primitives (`@/components/ui/`)
- **Button:** 
  - Variants: `default`, `secondary`, `outline`, `ghost`, `destructive`.
  - Icon behavior: Left-aligned Lucide icon (`size-4`) with `gap-2` internal spacing.
- **Input & Select:** Explicit `<label>` above control, helper text below. Visual focus state using `ring-2 ring-ring`.
- **Card:** Flat container (`bg-card border border-border rounded-xl p-6`). Omit heavy shadows.
- **Badge:** Small tag (`text-xs px-2.5 py-0.5 rounded-md bg-muted text-muted-foreground font-medium`).
- **Table:** Clean horizontal borders, generous row padding, `font-mono` for numeric column alignment.

### Product-Specific Patterns (`@/components/`)
- **MetricCard:** Displays a key quantitative stat (e.g. Average Sleep) with neutral subtitle metadata.
- **InsightCard:** Displays a rule-based observation with title, description, confidence badge, and related metric tag.
- **SleepCard / EnergyCard:** Form section wrappers specialized for logging sleep windows and diurnal energy ratings.

---

## 8. Composition & Engineering Rules

1. **Spacing Ownership:**
   - Components own their internal padding (`p-4`, `p-6`).
   - Parent containers and layouts own positioning, grid gaps (`gap-4`, `gap-6`), and margins.
   - Reusable components MUST NOT expose external layout margins (`mb-6`, `mt-4`).

2. **Primitive Reuse Hierarchy:**
   ```text
   Base Primitive (shadcn / Radix)
           ↓
   Product Pattern (e.g. MetricCard, InsightCard)
           ↓
   Page Layout (e.g. /dashboard, /analytics)
   ```

3. **Token Compliance:** Always use semantic Tailwind color utility classes (`bg-background`, `text-foreground`, `border-border`). Never hardcode hex colors or arbitrary pixel values.

---

## 9. Motion & Interaction Guidelines

- **Duration Baseline:** `150ms` for micro-interactions (hover, active focus), `250ms` for layout drawer transitions.
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (smooth ease-out).
- **Nuanced Motion Policy:** Avoid bouncing cards, spin rewards, confetti popups, and pulsing badges **unless explicitly justified by a user-requested feature requirement**. Make any deviation deliberate and isolated.
- **Accessibility:** Honor `prefers-reduced-motion` with `motion-reduce:transition-none`.

---

## 10. Accessibility Principles

1. **Color Contrast:** Text-to-background contrast MUST meet WCAG AA standards (minimum 4.5:1 for standard body text, 3:1 for large display text).
2. **Non-Color State Indicators:** Never use color as the sole means of communicating state or error conditions. Include text labels or semantic icons.
3. **Accessible Focus:** Focus indicators (`ring-2 ring-ring ring-offset-2`) MUST remain clearly visible against both light and dark backgrounds.
4. **Accessible Names & Labels:** All interactive controls (buttons, inputs, search fields, theme toggles) MUST have explicit accessible names (`aria-label` or visible `<label>`).
5. **Chart Accessibility:** Data visualizations must provide accessible text summaries or data table fallbacks for screen reader accessibility.

---

## 11. Design System Evolution & Authority Policy

When implementing new features or extending UI in future coding sessions:

1. **Reuse First:** Always check if an existing component or pattern fits the requirement.
2. **Compose Primitives:** Compose existing base primitives (`Card`, `Button`, `Badge`) before introducing a new custom component.
3. **Derive from Principles:** If a new visual treatment is required, derive it from established design principles rather than introducing arbitrary styles.
4. **No One-Off Tokens:** Do not introduce a new color token or custom font solely for a single one-off component.
5. **Document System Patterns:** If a new reusable component pattern is created, update this `DESIGN.md` specification.
6. **Require Approval for Major Shifts:** Significant changes to brand personality, typography, core color direction, or interaction philosophy require explicit user confirmation.

---

## 12. Design Decision Record & Provenance

This record defines the source, confidence level, scope, and flexibility of core design decisions to inform future AI sessions what is strict versus negotiable.

| Decision | Value / Specification | Rationale | Source | Confidence | Scope | Flexibility |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **No Gamification Elements** | Omit streaks, XP, flames, badges, confetti | Gamification causes user anxiety and guilt around health tracking | User & Product Spec | Confirmed | Global | **Low (Strict)** |
| **Neutral Status Communication** | Never use red/green judgment for low/high metrics | Low energy or short sleep are states to observe, not errors | Product Philosophy | Confirmed | Global | **Low (Strict)** |
| **Editorial Serene Palette** | Deep Emerald primary, Sage secondary, soft neutral backdrop | Grounding, calm palette suited for daily reflection | User Choice | Confirmed | Global | **Medium** |
| **Selective Monospace Metrics** | `font-mono` for quantitative values only | Enhances tabular data alignment without cluttering prose | Inferred | High | Typography | **Medium** |
| **12px Card Radius** | `var(--radius)` = `0.75rem` | Organic rounded containers matching soft editorial feel | Recommended | High | Surface | **High (Negotiable)** |
| **Flat Surfaces (No Drop Shadows)** | `bg-card border border-border` | Keeps UI clean, uncluttered, and calm | Recommended | High | Surface | **High (Negotiable)** |
