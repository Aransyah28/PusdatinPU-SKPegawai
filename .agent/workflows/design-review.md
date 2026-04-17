---
description: Comprehensive UI audit for design system compliance
---

# Design Review Workflow

Integrated audit combining design system enforcement, semantic colors, responsive layouts, and typography standardization.

---

## Phase 1: Automated Scanning

// turbo

### 1.1 Card Border Radius Violations

```bash
grep -rn "rounded-md\|rounded-lg\|rounded-xl" --include="*.tsx" src/components/features/ src/app/
```

// turbo

### 1.2 Non-Semantic Color Usage

```bash
grep -rn "bg-\[#\|text-\[#\|bg-gray-\|bg-slate-\|text-gray-\|text-slate-" --include="*.tsx" src/components/ src/app/
```

// turbo

### 1.3 Raw Input Elements

```bash
grep -rn "<input type=\"text\"\|<textarea" --include="*.tsx" src/components/features/
```

// turbo

### 1.4 Non-Semantic Typography

```bash
grep -rn "text-xs\|text-sm\|text-base\|text-lg\|text-xl\|text-2xl\|text-3xl\|text-\[" --include="*.tsx" src/components/ src/app/ | grep -v "node_modules" | head -50
```

// turbo

### 1.5 Mobile Padding Violations

```bash
grep -rn "px-2\|px-3\|px-5\|px-6\|px-8" --include="*.tsx" src/components/sections/ src/app/
```

---

## Phase 2: Generate Design Debt Report

Create a structured report with:

| Category      | File | Line | Issue                | Fix                                 |
| ------------- | ---- | ---- | -------------------- | ----------------------------------- |
| Border Radius | ...  | ...  | `rounded-lg` on Card | → `rounded-2xl`                     |
| Color Token   | ...  | ...  | `bg-gray-50`         | → `bg-muted`                        |
| Typography    | ...  | ...  | `text-sm`            | → `text-body-md`                    |
| Layout        | ...  | ...  | `px-6` on section    | → `px-4 md:px-[64px] xl:px-[140px]` |

---

## Phase 3: Compliance Rules

### 3.1 Design System Enforcement (Pusdatin Identity)

| Element         | Required Standard                      | Brand Constraint          |
| --------------- | -------------------------------------- | ------------------------- |
| Primary Identity| `#142B6F`                              | Use `--primary` token     |
| Card containers | `rounded-2xl border border-border`     | Large rounded corners     |
| Buttons         | `rounded-full`                         | Pill-shaped exclusively   |
| Form inputs     | `<FormTextField />` component          | Consistent accessibility  |
| Typography      | Inter / Custom Semantic Tokens         | Use `text-headline-lg` etc|

### 3.2 Semantic Colors

| Surface | Background      | Text                      | Border          |
| ------- | --------------- | ------------------------- | --------------- |
| Page    | `bg-background` | `text-foreground`         | —               |
| Card    | `bg-card`       | `text-card-foreground`    | `border-border` |
| Muted   | `bg-muted`      | `text-muted-foreground`   | —               |
| Primary | `bg-primary`    | `text-primary-foreground` | —               |

### 3.3 Typography Tokens

| Usage           | Token              |
| --------------- | ------------------ |
| Page titles     | `text-headline-lg` |
| Section headers | `text-headline-sm` |
| Card titles     | `text-title-lg`    |
| Body text       | `text-body-md`     |
| Labels/badges   | `text-label-md`    |
| Helper text     | `text-body-sm`     |

### 3.4 Responsive Layout

| Breakpoint   | Horizontal Padding |
| ------------ | ------------------ |
| Mobile       | `px-4`             |
| Tablet (md)  | `md:px-[64px]`     |
| Desktop (xl) | `xl:px-[140px]`    |

---

## Phase 4: Fix Implementation

For each violation found:

1. **Border Radius**: Replace `rounded-md/lg/xl` → `rounded-2xl` on cards
2. **Colors**: Replace raw values with semantic tokens
3. **Typography**: Replace `text-sm/xs/lg` with semantic tokens
4. **Layout**: Apply section padding standard

---

## Phase 5: Verification

// turbo

### 5.1 Type Check

```bash
bun check
```

// turbo

### 5.2 Lint Check

```bash
bun fl
```

### 5.3 Visual Verification

- [ ] Cards have consistent rounded corners
- [ ] Dark mode works correctly (elevation-based)
- [ ] Typography is consistent across components
- [ ] Mobile margins are 16px (px-4)

---

## Quick Reference: Common Fixes

```tsx
// Border Radius
- className="rounded-lg"
+ className="rounded-2xl"

// Colors
- className="bg-gray-50 text-gray-900"
+ className="bg-muted text-foreground"

// Typography
- className="text-sm font-medium"
+ className="text-title-sm"

// Layout
- className="px-6"
+ className="px-4 md:px-[64px] xl:px-[140px]"
```