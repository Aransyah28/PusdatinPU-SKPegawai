---
description: Responsive UI Implementation
---

# Tailwind CSS Responsive Workflow

## Section-Based & Fixed Breakpoints

This document defines a **non-fluid, section-based Tailwind CSS guideline**. It focuses on **explicit breakpoints**, predictable spacing, and consistent layout behavior across the application.

---

## 1. Section Padding Standard (MANDATORY)

All primary sections **MUST** use the following padding pattern:

```tsx
<section className="py-10 px-4 md:px-[64px] xl:px-[140px]">
```

### Padding Breakdown

| Breakpoint           | Horizontal Padding |
| -------------------- | ------------------ |
| Mobile (<768px)      | `px-4` (16px)      |
| Tablet (≥768px)      | `px-[64px]`        |
| Desktop XL (≥1280px) | `px-[140px]`       |

Benefits:

- Consistent layout across pages
- Easy to maintain and refactor
- Clear responsibility per section

---

## 2. Tablet Strategy (768px – 1024px)

**Focus:** Explicit adaptive layouts without fluid logic.

### Grid Layout

```html
<div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"></div>
```

Rules:

- `md` represents tablet and small desktop
- `xl` is reserved for large desktop layouts
- Avoid `auto-fit`, `auto-fill`, and `minmax`

---

## 3. Mobile Strategy (<768px)

**Focus:** Content reflow and touch comfort.

### Layout Stacking

```html
<div class="flex flex-col gap-6"></div>
```

Rules:

- ❌ Avoid using `block` for layout
- ✅ Use `flex-col` with `gap` for controlled spacing
- Ensure tap targets remain accessible

---

## 4. Clean Code Rules (DRY Principle)

- Use `@apply` **only if a style is reused 5+ times**
- Prefer:
  - Component abstraction (React / Vue)
  - Layout wrappers or partials

❌ Do not create utility classes for single-use cases

---

**Status:** Stable Guideline
**Scope:** Frontend – Tailwind CSS
