---
description: Migrate local state (useState) to Zustand global stores for improved maintainability and reduced prop drilling.
---

# Zustand Migration Workflow (Strict SoC)

Refactor local state into centralized Zustand stores to maintain thin, logic-free UI components and enable cross-component state synchronization.

---

## Phase 1: Identification

1. **Audit Components**: Identify state that is either:
   - Shared across multiple components.
   - Better managed globally to keep the UI component purely presentational.
   - Part of a complex UI flow (e.g., nested dialogs, multi-step feedback).

2. **Check Strict SoC Compliance**: Does keeping this state in the component force it to contain "logic"? If yes, migrate to Zustand.

---

## Phase 2: Store Design

3. **Domain Separation**: Split stores by domain (e.g., `settings-ui-store.ts`, `auth-store.ts`).
4. **Dialog Management**: Use `Set<DialogName>` for multiple/nested dialogs.
5. **Feedback State**: Centralize feedback messages (type, title, description) to standardise UI notifications.

---

## Phase 3: Implementation

6. **Create Store**: Use `src/lib/store/`.
7. **Selectors**: ALWAYS use granular selectors to prevent unnecessary re-renders.
8. **Actions**: Decouple state updates from components via store actions.

---

## Phase 4: Refactoring Components

9. **Remove State**: Delete `useState` and associated logic from the UI component.
10. **Subscribe**: Use the created selectors/actions in the component's custom hook.
11. **Presentational UI**: Ensure the component only receives props or simple values from the hook.

---

## Anti-Patterns (Zero-Tolerance)

- ❌ Putting server/API data in Zustand (Use TanStack Query).
- ❌ Complex mutations inside the component's store subscription.
- ❌ Direct state mutation from the component (Use actions).
- ❌ Mixing UI state and business logic in the same store property.
