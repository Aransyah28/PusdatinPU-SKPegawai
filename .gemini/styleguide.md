# Frontend Code Quality & Style Guide (AI Reviewer Reference)

This document serves as the authoritative guide for maintaining architectural integrity, stylistic consistency, and high-leverage refactoring in the Pusdatin PU - SK Pegawai Frontend project. It is derived from [AGENTS.md](./AGENTS.md) and [SSoT.md](./SSoT.md).

---

## 1. Core Architectural Principles

### 1.1. Data Integrity & Type Safety

- **Standard:** The frontend MUST use types derived from the database schema or Zod validation definitions.
- **Reviewer Action:** Reject any PR that manually defines data interfaces for backend entities.
- **Path:** `src/lib/db/schema.ts` and `src/lib/auth/auth.ts`.

### 1.2. The Service Layer Rule (Hooks)

- **Standard:** All data fetching and business logic must reside in `src/hooks/`.
- **Reasoning:** Decouples UI from API implementation. Enables consistent error handling and cache management via TanStack Query.
- **Reviewer Action:** Reject direct API calls or complex `useEffect` data fetching within components.

### 1.3. Server-First Default

- **Standard:** Every component is a Server Component by default. Use `"use client"` only for interactivity or when TanStack Query is required.
- **Reviewer Action:** Flag unnecessary `"use client"` directives.

---

## 2. JavaScript & React Efficiency

### 2.1. Waterfall Elimination (Critical)

- **Parallelize:** Use `Promise.all()` for independent fetches.
- **Defer Await:** Move `await` inside conditional branches to avoid blocking unused paths.

### 2.2. Rendering & State Optimization

- **Stable Callbacks:** Use functional `setState(curr => ...)` to keep `useCallback` references stable.
- **Lazy Initialization:** Use `useState(() => expensive())` for initial values derived from I/O or heavy compute.
- **Memoization:** Hoist static JSX and use `memo()` for components with expensive render paths.

### 2.3. JavaScript Efficiency

- **O(1) Lookups:** Prefer `Map`/`Set` over array `.find()`/.`includes()` in hot paths.
- **Batching:** Group DOM/CSS changes via classes to minimize reflows.

---

## 3. UI & Interaction Guidelines

### 3.1. Accessibility & Interactions

- **Keyboard:** MUST follow WAI-ARIA patterns. Visible focus rings required.
- **Targets:** MUST be ≥24px (mobile ≥44px).
- **Navigation:** MUST use `<a>` or `<Link>`. NEVER use `<div onClick>` for navigation.

### 3.2. Forms & Inputs

- **Validation:** Surface errors inline; focus first error on submit.
- **UI Components:** Use shadcn/ui components consistently.

### 3.3. Animation & Layout

- **Resilience:** Design for empty/error states.
- **Truncation:** Containers MUST handle long text (`truncate`, `line-clamp`).

---

## 4. Performance Benchmarks

- **Lists:** Virtualize lists with >50 items.
- **Assets:** Preload above-fold images; explicit dimensions to prevent CLS.

---

## 5. Design & Theming

- **Theming:** Strictly follow Tailwind v4 patterns. No dark mode.
- **Contrast:** Meet WCAG standards.

---

## 6. Component Structure

- **Size:** Target ≤ 150 lines. Extract logic to hooks or sub-components.
- **Language:** Hardcoded strings in UI MUST be in Bahasa Indonesia.

---

## 7. Summary Checklist for AI Reviewer

| Category  | Must Have                | Immediate Rejection              |
| :-------- | :----------------------- | :------------------------------- |
| **Logic** | Hooks in `src/hooks/`    | API calls in components          |
| **UI**    | Bahasa Indonesia         | Hardcoded English strings        |
| **Size**  | ≤ 150 lines per component| Mega-components                  |
| **Perf**  | Parallel fetches         | Sequential waterfalls            |
| **A11y**  | WAI-ARIA compliance      | `outline: none` (no replacement) |

---

**End of Guide**
