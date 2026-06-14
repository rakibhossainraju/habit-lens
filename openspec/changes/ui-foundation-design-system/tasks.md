## 1. Setup & Infrastructure

- [ ] 1.1 Install required shadcn/ui components (sidebar, card, skeleton, button, separator, dropdown-menu, avatar)
- [ ] 1.2 Define semantic color tokens in `src/app/globals.css` (Deep Emerald, Soft Mint, Sage Neutrals)
- [ ] 1.3 Configure Tailwind CSS to use the new semantic tokens

## 2. Typography Components

- [ ] 2.1 Create `PageTitle` component in `src/components/typography/page-title.tsx`
- [ ] 2.2 Create `SectionTitle` component in `src/components/typography/section-title.tsx`
- [ ] 2.3 Create `PageDescription` component in `src/components/typography/page-description.tsx`

## 3. Layout Components

- [ ] 3.1 Create `AppHeader` component with page title area and theme toggle placeholder
- [ ] 3.2 Create `AppSidebar` using shadcn primitives with navigation links (Dashboard, Logs, Insights, Analytics, Settings)
- [ ] 3.3 Create `PageContainer` component for consistent spacing and width
- [ ] 3.4 Create `AppShell` component to orchestrate Sidebar, Header, and Main Content
- [ ] 3.5 Update the root `src/app/layout.tsx` to wrap children in the `AppShell`

## 4. Foundational Card Components

- [ ] 4.1 Create `SectionCard` component (wrapper around shadcn Card with title/description props)
- [ ] 4.2 Create `StatCard` component for displaying metrics (label, value, optional trend/icon)

## 5. Feedback Components

- [ ] 5.1 Create `EmptyState` component with title, description, and action props
- [ ] 5.2 Create `LoadingState` component using shadcn Skeleton primitives

## 6. Design System Demo Page

- [ ] 6.1 Create `src/app/design-system/page.tsx` that displays all foundation components
- [ ] 6.2 Implement theme-switching verification on the demo page

## 7. Final Verification

- [ ] 7.1 Verify responsive behavior of all layout and foundational components
- [ ] 7.2 Run `npm run lint` and `npm run build` to ensure no regressions
