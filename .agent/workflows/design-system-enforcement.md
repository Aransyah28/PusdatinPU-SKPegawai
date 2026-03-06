---
description: Audit and enforce visual standards (card rounding, form inputs, button shapes)
---

# Design System Enforcement Workflow

This workflow audits code against visual standards and fixes style violations.

---

## STEP 1: SCAN & AUDIT

### 1.1 Card Containers (Pusdatin Brand)

| Rule          | Standard               | Brand Identity Constraint                            |
| ------------- | ---------------------- | ---------------------------------------------------- |
| Border Radius | `rounded-2xl`          | Mandatory for all major UI containers                |
| Borders       | `border border-border` | Subtle separation using semantic tokens              |
| Identity      | `text-heading`         | Use Pusdatin Navy for titles                         |

**Search Patterns:**

```bash
# Find card violations
grep -rn "rounded-md\|rounded-lg\|rounded-xl" --include="*.tsx" src/components/
```

### 1.2 Form Inputs

| Rule        | Standard                            | Violation                                      |
| ----------- | ----------------------------------- | ---------------------------------------------- |
| Text Fields | `<FormTextField />` component       | Raw `<input>`, `<textarea>`, or generic inputs |
| Import Path | `@/components/shared/FormTextField` | —                                              |

**Search Patterns:**

```bash
# Find raw input violations
grep -rn "<input\|<textarea" --include="*.tsx" src/components/
```

### 1.3 Buttons (Pusdatin Brand)

| Rule  | Standard                     | Requirement                             |
| ----- | ---------------------------- | --------------------------------------- |
| Shape | `rounded-full` (pill-shaped) | **Exclusively** pill-shaped buttons     |
| Color | `bg-primary`                 | Use `#142B6F` (Navy) via `--primary`    |

**Search Patterns:**

```bash
# Find button violations
grep -rn "Button.*rounded-md\|Button.*rounded-lg" --include="*.tsx" src/
```

---

## STEP 2: REFACTORING

### 2.1 Card Container Fixes

```tsx
// BEFORE (violation)
<Card className="rounded-lg p-4">

// AFTER (compliant)
<Card className="rounded-2xl p-4">
```

### 2.2 Form Input Replacement

```tsx
// BEFORE (violation)
<input
  type="text"
  value={name}
  onChange={(e) => setName(e.target.value)}
  placeholder="Enter name"
  className="rounded-md border p-2"
/>;

// AFTER (compliant)
import { FormTextField } from "@/components/shared/FormTextField";

<FormTextField
  value={name}
  onChange={(e) => setName(e.target.value)}
  placeholder="Enter name"
/>;
```

**Prop Mapping:**
| Raw Input Prop | FormTextField Prop |
|----------------|-------------------|
| `value` | `value` |
| `onChange` | `onChange` |
| `placeholder` | `placeholder` |
| `disabled` | `disabled` |
| `type` | `type` |
| `name` | `name` |
| `id` | `id` |
| (label via adjacent `<label>`) | `label` prop |

### 2.3 Button Fixes

```tsx
// BEFORE (violation)
<Button className="rounded-lg">Submit</Button>

// AFTER (compliant)
<Button className="rounded-full">Submit</Button>
```

### 2.4 Critical Rules

- **DO NOT** alter business logic, state management, or event handlers
- **ONLY** modify UI styling classes and component types
- **ADD** import statements when using `<FormTextField />`

---

## STEP 3: QUALITY CHECK

Run these verification steps:

### 3.1 No Violating Rounded Classes on Cards

```bash
# Should return 0 results for major containers
grep -rn "Card.*rounded-md\|Card.*rounded-lg" --include="*.tsx" src/components/
```

### 3.2 All Buttons are Pill-Shaped

```bash
# Verify buttons use rounded-full
grep -rn "<Button" --include="*.tsx" src/components/ | grep -v "rounded-full"
```

### 3.3 No Raw Text Inputs

```bash
# Should return 0 results (excluding shadcn primitives in ui/)
grep -rn "<input type=\"text\"\|<textarea" --include="*.tsx" src/components/features/
```

---

## CHECKLIST BEFORE COMPLETION

- [ ] All `Card` containers use `rounded-2xl`
- [ ] All interactive buttons use `rounded-full`
- [ ] All text inputs replaced with `<FormTextField />`
- [ ] Import statements added for `FormTextField`
- [ ] Business logic preserved (no functional changes)
- [ ] No `rounded-md` or `rounded-lg` on major UI blocks
