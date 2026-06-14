## Why

Habit Lens requires a robust and consistent UI foundation to provide a calm, reflective, and analytical user experience. Establishing this early ensures visual coherence across all future features and speeds up development by providing a library of reusable components and layouts.

## What Changes

- **App Architecture**: Implementation of an `AppShell` with a responsive `AppSidebar` and `AppHeader`.
- **Typography System**: Introduction of semantic typography wrappers (`PageTitle`, `SectionTitle`, `PageDescription`).
- **Foundational Components**: Creation of reusable `SectionCard`, `StatCard`, `EmptyState`, and `LoadingState` components built on shadcn/ui.
- **Visual Theme**: Application of the Habit Lens theme (Deep Emerald, Soft Mint, Sage Neutrals) across all components.
- **Verification Page**: A dedicated demo page to showcase and verify the design system components.

## Capabilities

### New Capabilities
- `ui-foundation`: Core layout structures and base components that form the architectural backbone of the application.
- `design-system-demo`: A playground page for visual verification and documentation of the foundational components.

### Modified Capabilities
- (None)

## Impact

- **UI Architecture**: Centralizes layout logic in `AppShell`, affecting how all pages are rendered.
- **Development Workflow**: Provides a set of pre-built components, reducing the need for custom styling in feature-specific work.
- **Dependencies**: Leverages and reinforces the use of `shadcn/ui` primitives.
