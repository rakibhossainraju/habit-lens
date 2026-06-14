<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Habit Lens v1 Frontend Specification

You are a senior product designer and frontend engineer.

Your task is to build the frontend foundation for a product called **Habit Lens**.

## Product Overview

Habit Lens is a personal health and lifestyle tracking application.

The goal is not medical diagnosis.

The goal is to help users track daily lifestyle habits and discover patterns in their wellbeing over time.

Users should be able to:

* Log daily activities
* Track sleep, energy, and custom metrics
* Review historical entries
* Visualize trends
* Receive rule-based insights

AI features are intentionally out of scope for v1.

This frontend should be designed to support future AI functionality without requiring major redesigns.

---

# Design Principles

The UI should feel:

* Calm
* Analytical
* Reflective
* Trustworthy

Avoid:

* Fitness-app aesthetics
* Gamification
* Neon colors
* Productivity-hustle vibes

Think:

"Understand yourself better"

instead of

"Optimize harder"

---

# Tech Constraints

Use:

* Next.js App Router
* TypeScript
* Tailwind CSS
* shadcn/ui

Build using reusable components.

Prefer composition over page-specific implementations.

---

# Information Architecture

Create the following routes.

## Dashboard

Route:

/dashboard

Purpose:

Main landing page after login.

Contains:

* Today's summary
* Recent entries
* Quick log button
* Key metrics cards
* Latest insights section
* Trend overview charts

---

## Daily Logs

Route:

/logs

Purpose:

Browse and manage entries.

Contains:

* Table view
* Search
* Date filtering
* Edit entry action
* Delete entry action

Columns:

* Date
* Sleep Duration
* Morning Energy
* Afternoon Energy
* Evening Energy
* Created At

---

## New Log

Route:

/logs/new

Purpose:

Create daily entry.

Form sections:

### Sleep

Fields:

* Sleep Time
* Wake Time

### Energy

Fields:

* Morning Energy (0-10)
* Afternoon Energy (0-10)
* Evening Energy (0-10)

### Notes

Fields:

* General Notes

### Custom Fields

Dynamic key-value fields.

User can:

* Add Field
* Remove Field

Examples:

* Breakfast
* Lunch
* Exercise
* Sugar Intake
* Water Intake

---

## Entry Details

Route:

/logs/[id]

Purpose:

View single entry.

Contains:

* Full entry data
* Metadata
* Custom fields
* Edit button

---

## Insights

Route:

/insights

Purpose:

Display rule-based insights.

Examples:

* Better energy on exercise days
* Lower energy after poor sleep
* Weekly averages
* Sleep consistency

Create realistic mock data.

Present insights using cards.

Each insight should include:

* Title
* Description
* Confidence indicator
* Related metric

---

## Analytics

Route:

/analytics

Purpose:

Trend visualization.

Sections:

### Sleep Trends

Charts:

* Sleep duration over time
* Bedtime consistency

### Energy Trends

Charts:

* Morning energy
* Afternoon energy
* Evening energy

### Correlations

Cards showing:

* Sleep vs Energy
* Exercise vs Energy
* Sugar vs Energy

Mock data is acceptable.

---

## Settings

Route:

/settings

Purpose:

Manage preferences.

Sections:

* Profile
* Appearance
* Data Export
* Tracker Configuration

---

# Layout Requirements

Create:

## App Sidebar

Items:

* Dashboard
* Daily Logs
* Insights
* Analytics
* Settings

Persistent on desktop.

Collapsible.

---

## Top Navigation

Contains:

* Search placeholder
* Theme switcher
* User menu

---

# Component Requirements

Create reusable components.

Examples:

* PageHeader
* MetricCard
* InsightCard
* TrendChartCard
* LogTable
* SleepCard
* EnergyCard
* EmptyState
* LoadingState

Avoid duplicating UI.

---

# State

Do not connect to APIs yet.

Use:

* Mock data
* Local component state

Structure code so backend integration can be added later.

---

# UX Expectations

The application should feel complete even without a backend.

Users should be able to:

* Navigate all pages
* View realistic data
* Interact with forms
* Experience a coherent product

The goal is to establish the full product shell and design system before implementing persistence and business logic.

Focus heavily on:

* Information architecture
* Reusable components
* Clean UX
* Consistent visual language

Generate production-quality code organization.
