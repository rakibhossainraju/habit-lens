## ADDED Requirements

### Requirement: AppShell Layout
The system SHALL provide a core `AppShell` component that serves as the primary layout wrapper, managing the placement of the sidebar, header, and main content area.

#### Scenario: Responsive layout rendering
- **WHEN** the application is loaded
- **THEN** the `AppShell` renders the `AppSidebar` on the left (desktop) and the `AppHeader` at the top, with the main content area filling the remaining space.

### Requirement: AppSidebar Navigation
The system SHALL provide an `AppSidebar` component using shadcn Sidebar primitives, containing navigation links for Dashboard, Daily Logs, Insights, Analytics, and Settings.

#### Scenario: Navigation links presence
- **WHEN** the sidebar is rendered
- **THEN** it displays links for "Dashboard", "Daily Logs", "Insights", "Analytics", and "Settings" with appropriate icons.

### Requirement: Semantic Typography
The system SHALL provide `PageTitle`, `SectionTitle`, and `PageDescription` components to ensure consistent typography across the application.

#### Scenario: Typography rendering
- **WHEN** a `PageTitle` is used
- **THEN** it renders as a semantically correct large heading with established design tokens.

### Requirement: Foundational Cards
The system SHALL provide `SectionCard` and `StatCard` components for consistent content containment and metric display.

#### Scenario: StatCard display
- **WHEN** a `StatCard` is provided with a label "Average Sleep" and value "7.2 hours"
- **THEN** it renders both values clearly within a card structure.

### Requirement: Feedback States
The system SHALL provide `EmptyState` and `LoadingState` components to handle missing data and asynchronous loading processes.

#### Scenario: LoadingState rendering
- **WHEN** a `LoadingState` is rendered
- **THEN** it displays shadcn-based skeleton primitives.
