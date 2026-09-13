## 1. Setup & Infrastructure

- [x] 1.1 Install required shadcn/ui components (card, button, badge, input, textarea, table)
- [x] 1.2 Define semantic color tokens in `src/app/globals.css` (Deep Emerald / Sage palette, light + dark)
- [x] 1.3 Configure Tailwind CSS to use the new semantic tokens (`@theme` block wired to CSS vars)

## 2. Typography Components

- [ ] 2.1 ~~Create `PageTitle` component~~ — superseded by `PageHeader` (see 3.x), which already owns the
      page title. A separate component was judged unnecessary duplication (AGENTS.md "Component Reuse").
- [ ] 2.2 ~~Create `SectionTitle` component~~ — section headings use a single consistent inline pattern
      (`<h2 className="text-lg font-semibold text-foreground">`), documented on the `/design-system` page.
- [ ] 2.3 ~~Create `PageDescription` component~~ — folded into `PageHeader`'s `description` prop.

## 3. Layout Components

- [x] 3.1 `TopNav` (`src/components/top-nav.tsx`) — search placeholder, theme switcher, user menu, sidebar toggle
- [x] 3.2 `Sidebar` (`src/components/sidebar.tsx`) — nav links for Dashboard, Logs, Insights, Analytics, Settings
- [ ] 3.3 `PageContainer` — not a separate component; `AppShell`'s `<main>` owns consistent width/padding directly
- [x] 3.4 `AppShell` (`src/components/app-shell.tsx`) — orchestrates Sidebar, TopNav, and main content
- [x] 3.5 Root `src/app/layout.tsx` wraps children in `AppShell` (inside `ThemeProvider` + `StorageProvider`)

## 4. Foundational Card Components

- [ ] 4.1 `SectionCard` — not built as a separate wrapper; pages compose shadcn `Card` directly per-section
- [x] 4.2 `MetricCard` (`src/components/metric-card.tsx`) — label/value/unit/icon/trend, equivalent to `StatCard`

## 5. Feedback Components

- [x] 5.1 `EmptyState` (`src/components/empty-state.tsx`)
- [x] 5.2 `LoadingState` (`src/components/loading-state.tsx`) — skeleton-style pulse blocks

## 6. Design System Demo Page

- [x] 6.1 `src/app/design-system/page.tsx` — color tokens, typography scale, buttons, badges, form fields,
      MetricCard/InsightCard, SleepCard/EnergyCard, TrendChartCard, LogTable, EmptyState/LoadingState
- [x] 6.2 No dedicated toggle needed — the page renders inside the global `ThemeProvider`/`TopNav`, so the
      existing theme switcher in the top nav verifies both palettes live

## 7. Final Verification

- [ ] 7.1 Verify responsive behavior of all layout and foundational components (not yet checked at phone width)
- [x] 7.2 `bun run lint` and `bun run build` — both clean (0 errors, 0 warnings)
