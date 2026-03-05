---
description: Refactor component colors using semantic tokens and bi-directional dark mode strategy
---

# Semantic & Bi-Directional Color Workflow

This workflow ensures colors use semantic tokens with proper dark mode elevation and accessibility compliance.

---

## STEP 1: PALETTE AUDIT & MAPPING

### 1.1 Project Color Tokens (Reference)

| Semantic Token          | Light Mode Value         | Dark Mode Value                    |
| ----------------------- | ------------------------ | ---------------------------------- |
| `bg-background`         | `hsl(0 0% 100%)` (white) | `hsl(222.2 84% 4.9%)` (near-black) |
| `bg-card`               | `hsl(0 0% 100%)` (white) | `hsl(222.2 84% 4.9%)`              |
| `bg-muted`              | `hsl(210 40% 96.1%)`     | `hsl(217.2 32.6% 17.5%)`           |
| `bg-accent`             | `hsl(210 40% 96.1%)`     | `hsl(217.2 32.6% 17.5%)`           |
| `bg-primary`            | `hsl(0 72% 51%)` (red)   | `hsl(0 72% 44%)`                   |
| `text-foreground`       | `hsl(222.2 84% 4.9%)`    | `hsl(210 40% 98%)`                 |
| `text-muted-foreground` | `hsl(215.4 16.3% 46.9%)` | `hsl(215 20.2% 65.1%)`             |
| `border-border`         | `hsl(214.3 31.8% 91.4%)` | `hsl(217.2 32.6% 17.5%)`           |

### 1.2 Forbidden Patterns

```tsx
// ❌ FORBIDDEN: Arbitrary values
className = "bg-[#1e1e1e] text-[#f5f5f5]";

// ❌ FORBIDDEN: Raw primitives when semantic tokens exist
className = "bg-gray-50 text-gray-900";

// ✅ REQUIRED: Semantic tokens
className = "bg-card text-card-foreground";
className = "bg-muted text-muted-foreground";
```

### 1.3 Element → Token Mapping

| Element Type   | Background Token | Text Token                    | Border Token            |
| -------------- | ---------------- | ----------------------------- | ----------------------- |
| Page/Layout    | `bg-background`  | `text-foreground`             | —                       |
| Card/Panel     | `bg-card`        | `text-card-foreground`        | `border-border`         |
| Sidebar        | `bg-sidebar`     | `text-sidebar-foreground`     | `border-sidebar-border` |
| Muted Section  | `bg-muted`       | `text-muted-foreground`       | —                       |
| Input Field    | `bg-background`  | `text-foreground`             | `border-input`          |
| Primary Button | `bg-primary`     | `text-primary-foreground`     | —                       |
| Destructive    | `bg-destructive` | `text-destructive-foreground` | —                       |

---

## STEP 2: DARK MODE STRATEGY (Elevation vs. Inversion)

### 2.1 The Elevation Rule

**DO NOT simply invert colors.** Apply elevation-based differentiation:

| Light Mode                  | Dark Mode Equivalent                                     |
| --------------------------- | -------------------------------------------------------- |
| White (`bg-white`) + shadow | Dark gray (`bg-card`) + lighter border (`border-border`) |
| Gray-50 base                | Elevated surface (`bg-muted` or `bg-secondary`)          |

### 2.2 Visual Hierarchy

| Content Level     | Light Mode                          | Dark Mode                              |
| ----------------- | ----------------------------------- | -------------------------------------- |
| Primary Content   | `text-foreground` (dark text)       | `text-foreground` (light text)         |
| Secondary Content | `text-muted-foreground` (gray text) | `text-muted-foreground` (lighter gray) |
| Disabled/Tertiary | `text-muted-foreground/50`          | `text-muted-foreground/50`             |

### 2.3 Elevation Stack Example

```tsx
// Page Background (Level 0)
<div className="bg-background">

  // Card Surface (Level 1) - elevated via border in dark mode
  <div className="bg-card border border-border shadow-sm dark:shadow-none">

    // Nested Section (Level 2) - uses muted for depth
    <div className="bg-muted">
```

---

## STEP 3: ACCESSIBILITY & CONTRAST CHECK

### 3.1 Contrast Requirements (WCAG 2.1)

| Content Type                       | Minimum Ratio |
| ---------------------------------- | ------------- |
| Normal Text (< 18px)               | 4.5:1         |
| Large Text (≥ 18px bold or ≥ 24px) | 3:1           |
| UI Components & Graphics           | 3:1           |

### 3.2 Brand Color Adjustments

If a brand color fails contrast on dark backgrounds, use a lighter variant:

```tsx
// Primary Red on dark background
// Light mode: bg-primary (hsl 0 72% 51%)
// Dark mode:  bg-primary (hsl 0 72% 44%) - automatically adjusted via CSS var

// If using brand directly on surfaces:
className = "text-primary dark:text-primary-foreground"; // WRONG
className = "text-primary-foreground"; // CORRECT (always paired)
```

### 3.3 Verified Safe Pairs

| Background       | Text                          | Mode | Status  |
| ---------------- | ----------------------------- | ---- | ------- |
| `bg-background`  | `text-foreground`             | Both | ✅ Safe |
| `bg-card`        | `text-card-foreground`        | Both | ✅ Safe |
| `bg-muted`       | `text-muted-foreground`       | Both | ✅ Safe |
| `bg-primary`     | `text-primary-foreground`     | Both | ✅ Safe |
| `bg-destructive` | `text-destructive-foreground` | Both | ✅ Safe |

---

## STEP 4: IMPLEMENTATION

### 4.1 Refactoring Pattern

```tsx
// BEFORE (raw primitives)
<div className="bg-white text-slate-900 border-slate-200">
  <p className="text-gray-600">Secondary text</p>
</div>

// AFTER (semantic tokens)
<div className="bg-card text-card-foreground border-border">
  <p className="text-muted-foreground">Secondary text</p>
</div>
```

### 4.2 Using dark: Modifier (When Tokens Aren't Enough)

For edge cases where CSS variables don't cover the specific need:

```tsx
// Explicit light/dark override
className = "bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-50";

// Opacity adjustments
className = "bg-primary/10 dark:bg-primary/20";
```

### 4.3 Accent Colors (Bi-Directional)

Accent colors already have dark variants defined. Use the token directly:

```tsx
// Correct usage - tokens auto-switch in dark mode
className = "bg-accentBlue text-accentBlue-foreground";
className = "bg-accentGreen text-accentGreen-foreground";
```

---

## CHECKLIST BEFORE COMPLETION

- [ ] No arbitrary hex values (`bg-[#...]`) in UI surfaces
- [ ] No raw Tailwind primitives (`bg-gray-*`) when semantic tokens exist
- [ ] All text uses paired foreground tokens (e.g., `bg-card` + `text-card-foreground`)
- [ ] Dark mode uses elevation (borders/surface) not just inversion
- [ ] Contrast verified for both light and dark modes
- [ ] Brand colors use lighter variants on dark backgrounds if needed
