---
description: Standardize typography usage across the application using semantic Tailwind classes.
---

# Typography Standardization Workflow

This workflow ensures consistent typography by enforcing the use of semantic font tokens defined in `tailwind.config.ts`. Avoid arbitrary values like `text-[14px]` or generic Tailwind classes like `text-sm` unless they map strictly to the design system.

## 1. Available Typography Tokens

Refer to `tailwind.config.ts` for the single source of truth.

### Display (Hero / Large Headers)

| Token             | Size | Weight   | Usage                            |
| :---------------- | :--- | :------- | :------------------------------- |
| `text-display-lg` | 45px | Bold     | Landing page main headings       |
| `text-display-md` | 45px | Semibold | Alternative large headings       |
| `text-display-sm` | 36px | Semibold | Section headers on landing pages |

### Headline (Section Headers)

| Token              | Size | Weight | Usage                         |
| :----------------- | :--- | :----- | :---------------------------- |
| `text-headline-lg` | 32px | Bold   | Major page titles             |
| `text-headline-md` | 28px | Bold   | Sub-section titles            |
| `text-headline-sm` | 24px | Bold   | Card titles, smaller sections |

### Title (Component Titles)

| Token           | Size | Weight | Usage                            |
| :-------------- | :--- | :----- | :------------------------------- |
| `text-title-lg` | 22px | Medium | Modal titles, large card headers |
| `text-title-md` | 16px | Medium | Default component titles         |
| `text-title-sm` | 14px | Medium | Small interactive elements       |

### Label (UI Elements, Badges, Buttons)

| Token           | Size | Weight   | Usage                      |
| :-------------- | :--- | :------- | :------------------------- |
| `text-label-lg` | 14px | Semibold | Buttons, Navigation        |
| `text-label-md` | 12px | Semibold | Badges, Chips, Metadata    |
| `text-label-sm` | 11px | Semibold | Tiny indicators, Captions  |
| `text-label-xs` | 10px | Semibold | Extra small tags, metadata |

### Body (Long Form Text)

| Token          | Size | Weight  | Usage                  |
| :------------- | :--- | :------ | :--------------------- |
| `text-body-lg` | 16px | Regular | Lead paragraphs        |
| `text-body-md` | 14px | Regular | Default paragraph text |
| `text-body-sm` | 12px | Regular | Helper text, footers   |

## 2. Usage Rules

1.  **Strict Adherence:** ALWAYS use the tokens above.
    - ✅ `className="text-headline-sm text-primary"`
    - ❌ `className="text-2xl font-bold"`
    - ❌ `className="text-[24px]"`

2.  **Font Family:** Use `font-jakarta` for the primary font.
    - The tokens above do not include the font family, so often you will rely on the global default or explicitly add `font-jakarta` if needed (though it should be the default).

## 3. Handling Missing Sizes

If a design requires a font size or weight not listed above:

1.  **Check for "Closest Match":**
    - Can you use `body-md` (14px) instead of 13px?
    - Can you use `title-md` (16px) instead of 15px?
    - _Preference is always to align with the system rather than fragmenting it._

2.  **Update the System (If necessary):**
    - If the new size is a recurring requirement (e.g., a massive 60px hero title, or a tiny 10px tag), **UPDATE** `tailwind.config.ts`.
    - **Noun-based Naming:** Name it semantically (e.g., `display-xl`, `label-xs`).

    **Example Update in `tailwind.config.ts`:**

    ```typescript
    "label-xs": ["10px", { lineHeight: "12px", fontWeight: "font-semibold" }],
    ```

3.  **One-off Exceptions (Discouraged):**
    - Only use `text-[10px]` if it is truly a unique, one-time anomaly that will never be reused.

## 4. Migration Workflow

When refactoring legacy code:

1.  Identify `text-` classes.
2.  Map them to the nearest Token.
    - `text-sm` (14px) -> `text-body-md` or `text-title-sm` (depending on weight).
    - `text-xs` (12px) -> `text-body-sm` or `text-label-md`.
3.  Replace and verify visual consistency.
