---
description: Extract business logic from UI components into custom hooks for clean separation of concerns.
---

# Logic Extraction Workflow (Strict SoC)

This workflow audits components for logic-UI coupling and extracts logic into custom hooks. **Strict adherence to the Zero-Tolerance SoC Policy is mandatory.**

---

## STEP 1: SCAN & AUDIT (Zero-Tolerance)

### 1.1 Logic Leakage Indicators

Flag the component if **any** business logic is present. In this project, "Business Logic" is defined as anything that is NOT purely about UI rendering or simple visibility toggles.

| Indicator            | Description                                                                 | Severity    | Action                          |
| :------------------- | :-------------------------------------------------------------------------- | :---------- | :------------------------------ |
| **Any API Link**     | Any mention of API hooks, mutations, or query keys.                         | 🔴 Critical | Extract immediately.            |
| **Effect Usage**     | Any `useEffect` used for anything other than pure UI visual side effects.   | 🔴 Critical | Extract immediately.            |
| **Complex State**    | `useState` logic involving calculations, conditional updates, or data sync. | 🔴 High     | Extract to hook.                |
| **Form Management**  | `useForm`, validation, or submission handlers > 0 lines of logic.           | 🔴 High     | Extract to `use[Feature]Form`.  |
| **Form Watching**    | `form.watch()` calls to derive reactive values from form state.             | 🔴 High     | Extract to hook.                |
| **Derived Data**     | Complex computations or data transformations inside the component body.     | 🟡 Medium   | Move to hook or utility.        |
| **Options Arrays**   | Arrays built with `.map()` from constants/translations for select fields.   | 🟡 Medium   | Move to hook with `useMemo`.    |
| **Navigation**       | Any navigation calls (`router.push`, `router.back`, `navigate()`).          | 🔴 High     | Extract to handler in hook.     |
| **Store Selectors**  | Direct Zustand `useStore((s) => s.x)` calls inside components.              | 🔴 High     | Move to hook.                   |
| **Library Config**   | Configuration objects for complex UI libs (Charts, Tables, Editors).        | 🔴 High     | Encapsulate in a hook.          |
| **File Handling**    | `FileReader`, base64 conversion, or binary processing.                      | 🔴 Critical | Extract to hook.                |
| **Inline Callbacks** | Any `useCallback` or handler function that does more than forward a prop.   | 🟡 Medium   | Extract to hook.                |
| **Constants**        | Hardcoded data arrays/objects that should be module-level or in hooks.      | 🟡 Medium   | Move to constants file or hook. |

### 1.2 Safe UI State (The ONLY exceptions)

Only these are allowed to stay in a UI component:

- `const [isOpen, setIsOpen] = useState(false);` (Pure visibility toggle)
- `const [activeTab, setActiveTab] = useState("default");` (Pure navigation state)
- `useRef<HTMLElement>(null)` for DOM measurement or virtualization containers.
- **Trivial Event Forwarding**: `useCallback` that only calls `e.stopPropagation()` + a single prop callback.
- **Trivial Prop Derivation**: Single-line, no-conditional visual display logic (e.g., `const initial = name.charAt(0).toUpperCase();`).

**Everything else MUST be extracted.**

### 1.3 Stop Condition

**STOP and report** if:

- Component is purely functional: `props -> JSX`.
- No hooks are used except for the basic UI toggles mentioned above.

---

## STEP 2: EXTRACTION STRATEGY

### 2.1 Hook Placement

Hooks must be placed in `src/hooks/features/[domain]/[feature]/use-[name].ts`.

### 2.2 Input/Output Design

Hooks should return a clean object containing:

1. **Render Data**: Pre-calculated values ready for display.
2. **Event Handlers**: Functions the UI calls (e.g., `onDelete`, `onSubmit`).
3. **State**: Only UI-essential state.

---

## STEP 3: EXECUTION

### Part A: The Logic Hook

- Move all business logic, data fetching, and state mutations here.
- Handle all API interactions within the hook.
- Ensure the hook is portable and UI-agnostic.

### Part B: The UI Component

- Import the hook.
- Destructure only what is needed for rendering.
- Ensure the JSX is declarative and logic-free.

---

## CHECKLIST BEFORE COMPLETION

- [ ] **Zero Business Logic**: No API refs, no complex `useState`, no `useEffect` syncing.
- [ ] **Declarative JSX**: Component reads like a template, not a script.
- [ ] **Strict Typing**: All hook interfaces are fully typed (No `any`).
- [ ] **Naming**: Hook file uses kebab-case and is correctly located.
