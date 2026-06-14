## Context

Habit Lens is in its early stages. We have the basic Next.js App Router setup but need a unified visual identity and architectural foundation for the UI. The project is committed to using shadcn/ui, Tailwind CSS, and TypeScript.

## Goals / Non-Goals

**Goals:**
- Establish a consistent layout system using `AppShell`, `AppSidebar`, `AppHeader`, and `PageContainer`.
- Create a library of foundational, reusable components (Cards, Typography, Feedback).
- Strictly adhere to the "Calm, Reflective, Analytical" design philosophy.
- Support both Light and Dark modes using semantic color tokens (Deep Emerald, Soft Mint, Sage Neutrals).
- Provide a demo page for visual verification of the design system.

**Non-Goals:**
- Implementing business logic or state management.
- Creating feature-specific components (e.g., actual health tracking widgets).
- Integrating with external APIs or databases.
- Building complex data visualizations or charts.

## Decisions

### 1. shadcn/ui for Base Components
We will use shadcn/ui primitives for all foundational elements (Buttons, Cards, Sidebars, Skeletons). 
**Rationale**: It provides high-quality, accessible, and customizable components that align with our "UI Foundation" goal without reinventing the wheel.

### 2. Layout Architecture: Next.js App Router
The `AppShell` will be implemented as a wrapper in the root `layout.tsx` (or a dedicated layout for authenticated routes).
**Rationale**: This ensures that the Sidebar and Header are persistent across navigation and simplifies the structure of individual pages.

### 3. Component Organization
Components will be organized by category:
- `components/layout/`: `AppShell`, `AppSidebar`, `AppHeader`, `PageContainer`
- `components/typography/`: `PageTitle`, `SectionTitle`, `PageDescription`
- `components/cards/`: `SectionCard`, `StatCard`
- `components/feedback/`: `EmptyState`, `LoadingState`
- `components/common/`: Shared utilities or small reusable bits.

### 4. Semantic Theming
We will use Tailwind CSS with semantic tokens defined in `globals.css` (or `tailwind.config.ts`).
**Rationale**: This allows us to switch between Light and Dark modes easily while maintaining the specific "Deep Emerald/Soft Mint" palette.

## Risks / Trade-offs

- **[Risk] Foundation Rigidity** → **Mitigation**: Prioritize component composition (using `children`) so that future features can extend these components without needing to modify the core logic.
- **[Risk] Visual Drift** → **Mitigation**: The Demo Page will serve as a living documentation and verification tool to ensure all new components match the design philosophy.
