---
description: Generate or refactor skeleton loaders with zero Cumulative Layout Shift (CLS)
---

# Skeleton Loader Workflow

This workflow ensures skeleton loaders precisely match the loaded state to prevent layout shift (CLS).

## STEP 1: SCANNING & AUDIT

1. **Scan for existing skeletons**
   - Search for `Skeleton`, `skeleton`, or loading state implementations in the target file.
   - Identify any `isLoading` conditionals that render placeholder content.

2. **Identify the Loaded State component**
   - Locate the component/element that renders when data is available.
   - Note the parent container's structure (flex, grid, etc.).

3. **Compare and note discrepancies**
   - If a skeleton exists, visually compare its DOM structure to the loaded state.
   - Flag any missing elements, incorrect spacing, or dimension mismatches.

---

## STEP 2: PRECISE DIMENSION ANALYSIS (CRUCIAL)

1. **Analyze the Loaded State's CSS/Tailwind classes**
   Extract exact values for:
   - **Container:** `h-*`, `min-h-*`, `max-h-*`, `w-*`, `aspect-*`
   - **Spacing:** `p-*`, `px-*`, `py-*`, `m-*`, `mx-*`, `my-*`, `gap-*`
   - **Layout:** `flex`, `grid`, `items-*`, `justify-*`

2. **Calculate text element heights**
   Use this formula:

   ```
   Text Height = line-height (leading-*) × number of lines
   ```

   Common Tailwind text heights:
   | Class Combo | Approx. Height |
   |-------------|----------------|
   | `text-sm leading-5` | 20px (1.25rem) |
   | `text-base leading-6` | 24px (1.5rem) |
   | `text-lg leading-7` | 28px (1.75rem) |
   | `text-xl leading-7` | 28px (1.75rem) |
   | `text-2xl leading-8` | 32px (2rem) |

3. **Extract image/container dimensions**
   - Fixed heights: `h-32` = 8rem = 128px, `h-48` = 12rem = 192px, `h-64` = 16rem = 256px
   - Aspect ratios: `aspect-video` = 16:9, `aspect-square` = 1:1

4. **Document the total calculated height**
   Sum up: Container padding + child heights + gaps between children.

---

## STEP 3: SKELETON GENERATION

1. **Mirror the DOM structure exactly**
   - If the loaded state has 3 child divs, the skeleton must have 3 child divs.
   - Maintain the same nesting depth.

2. **Apply EXACT structural classes**
   - Copy container classes: `flex`, `flex-col`, `gap-4`, `p-4`, `rounded-lg`, `border`.
   - Apply the SAME height/width classes to skeleton placeholders.

3. **Use appropriate skeleton element for content type**
   | Content Type | Skeleton Element |
   |--------------|------------------|
   | Single line text | `<Skeleton className="h-5 w-3/4" />` (match text height) |
   | Multi-line text | Multiple `<Skeleton />` with matching heights |
   | Avatar/Image | `<Skeleton className="h-12 w-12 rounded-full" />` |
   | Card image | `<Skeleton className="h-48 w-full rounded-t-lg" />` |
   | Button | `<Skeleton className="h-10 w-24 rounded-md" />` |

4. **Verify height parity**
   - The skeleton's computed height MUST equal the loaded state's height.
   - Use browser DevTools to measure if uncertain.

---

## CHECKLIST BEFORE COMPLETION

- [ ] Skeleton DOM structure mirrors loaded state
- [ ] All container classes (flex, grid, padding, gaps) are identical
- [ ] Child element heights match exactly (not approximate)
- [ ] Border radius and overflow classes are preserved
- [ ] Animation class `animate-pulse` is applied to skeleton elements

---

## EXAMPLE: Card Skeleton

**Loaded State:**

```tsx
<Card className="space-y-4 p-4">
  <div className="flex items-center gap-3">
    <Avatar className="h-12 w-12" />
    <div>
      <p className="text-lg font-semibold leading-7">John Doe</p>
      <p className="text-sm leading-5 text-muted">Role</p>
    </div>
  </div>
  <p className="text-base leading-6">Description text here...</p>
</Card>
```

**Correct Skeleton:**

```tsx
<Card className="space-y-4 p-4">
  <div className="flex items-center gap-3">
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="space-y-1">
      <Skeleton className="h-7 w-32" /> {/* matches text-lg leading-7 */}
      <Skeleton className="h-5 w-20" /> {/* matches text-sm leading-5 */}
    </div>
  </div>
  <Skeleton className="h-6 w-full" /> {/* matches text-base leading-6 */}
</Card>
```
