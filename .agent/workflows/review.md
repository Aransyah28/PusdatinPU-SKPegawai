---
description: Review staged changes like a senior developer in a GitHub PR (Automated & Manual)
---

# Code Review Workflow

Comprehensive review incorporating Golden Rules, architecture patterns, and premium UI criteria. This workflow mimics a strict CI/CD pipeline + Senior Code Review with zero tolerance for pattern violations.

---

## Step 1: Automated Quality Gates (Turbo)

// turbo

```bash
bun check && bun fl
```

**If these fail:**

- Report errors immediately.
- The review **CANNOT** pass until linting and type/build errors are resolved.
- **Strict Rule:** NEVER bypass lint rules using `// eslint-disable` (Rule 12).

---

## Step 2: Extract Staged Changes

// turbo

```bash
git diff --cached
```

---

## Step 3: Architecture & "Golden Rules" Audit

Read `AGENTS.md` and `SSoT.md` to ensure alignment with the latest project standards.

### 3.1 Core Philosophical Checklist

| Rule                | Check                                                                                    | Severity    |
| :------------------ | :--------------------------------------------------------------------------------------- | :---------- |
| **SDK & Fetching**  | NO direct `fetch` or SDK calls in components. Must use service hooks (`src/hooks/api/`). | 🔴 Critical |
| **Type Integrity**  | NO manual interfaces for backend data. Must use generated SDK types.                     | 🔴 Critical |
| **Service Layer**   | Service hooks MUST throw if an error is returned from the SDK (Rule 4).                  | 🔴 High     |
| **Lint Rules**      | NO `// eslint-disable` or `@ts-ignore`. Resolve the root cause.                          | 🔴 Critical |
| **Backward Comp.**  | NO re-exports for backward compatibility. Update all imports.                            | 🔴 Critical |
| **Immutable Infra** | NO modification to `src/components/ui/` or `src/hooks/shared/ui/`.                       | 🔴 Critical |
| **Constants**       | Shared unions/options MUST be in `src/lib/constants` (UPPER_SNAKE_CASE).                 | 🔴 High     |
| **File Naming**     | PascalCase for Feature Components, kebab-case for everything else (Folder, Hooks, UI).   | 🔴 High     |
| **Query Keys**      | NO magic strings. MUST use centralized `queryKeys` factory.                              | 🔴 High     |

### 3.2 Strict Separation of Concerns (SoC)

UI components (`src/components/`) must be **purely presentational**. Flag and request extraction for:

- **Logic Leaks**: API calls, `useEffect`, complex `useState`, `form.watch()`, direct Zustand selectors.
- **Date Logic**: NO `new Date()` or formatting in render body. Use `useClientDate` or logic hooks (Rule 13.3).
- **Form/Validation**: `useForm` and Zod schemas (Schemas MUST be in `src/schemas/[domain]/`).
- **Library Config**: `useReactTable()`, chart/editor configs.
- **Routing**: `router.push`, `router.back` (must move to handlers in hooks).

---

## Step 4: UI/UX Consistency Audit (Premium Design)

Standardize against the "Premium Design" guidelines in `AGENTS.md`.

### 4.1 I18n & Content

- **Binary Sync**: ALL new keys MUST be added to BOTH `id.json` and `en.json`.
- **Placeholders**: MUST use "Masukkan X" or "Enter X".
- **Counters**: Badge format MUST be `"{count} {Unit}"` (e.g. "3 Siswa"). NO "Total:".
- **Title Case**: Table headers and page metadata MUST use Title Case (e.g. "Nama Lengkap").

### 4.2 Table Standards

- **Width Tokens**: MUST use standardized Tailwind tokens (`min-w-50`, `min-w-200`, etc.).
- **Header Logic**: Header functions return ONLY raw strings. Styling belongs in `meta.headerClassName`.
- **Binary Selection**: Header checkboxes must ONLY be Empty or Checked. **Indeterminate state is FORBIDDEN**.
- **Aksi Column**: MUST implement Preview (eye), Edit (pen), and Delete (trash) actions.
- **Skeletons**: MUST define precise skeleton geometry in column `meta` to prevent CLS.

### 4.3 Dialogs & Buttons

- **Width**: Standard dialogs MUST use `max-w-lg`.
- **Form Titles**: MUST be context-aware (e.g. "Tambah" vs "Ubah") based on `editId`.
- **Button Text**: MUST be concise single verbs ("Simpan", "Hapus", "Batal"). NO entity names.
- **Delete Dialogs**:
  - Exclusive use of `FeedbackDialog` (variant warning).
  - Title in Title Case (e.g., "Hapus Siswa?").
  - MUST include `InformationNote` for data permanence.

---

## Step 5: Generate Review Report

Format the output as a structured GitHub PR review.

### 5.1 Summary

- **Status**: ✅ LGTM | ⚠️ Requires Changes | ❌ Blocked (Build Broken)
- **Primary Violations**: Highlight "Golden Rule" or "SoC" breaches.

### 5.2 Critical Issues (Blocking)

- `> [!CAUTION]` for Build/Lint/Type errors.
- `> [!WARNING]` for Architectural violations (Logic leaks, SDK misuse).

### 5.3 Suggestions & Design Polish

- `> [!TIP]` for UI/UX improvements (Table widths, Dialog wording).
- `diff` blocks for clean refactorings.

---

## Step 6: User Approval & Action

> "I have identified issues/improvements based on the strict project rules. Would you like me to apply the fixes according to the project's Golden Rules?"
