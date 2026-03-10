# AGENTS.md — PusdatinPU-SKPegawai

> **INSTRUKSI SISTEM:** Semua AI agent yang bekerja di repo ini WAJIB membaca dan mengikuti panduan berikut. Kegagalan mematuhi aturan ini akan berakibat pada penolakan kode (Immediate Rejection).

## 1. Gambaran Proyek

**Proyek:** Portal SK Kepegawaian Pusdatin PU
**Deskripsi:** Modul fullstack (Next.js 16 App Router) untuk menampilkan dan mengelola Surat Keterangan Kepegawaian dalam format tabel PDF. Satu halaman dengan dua tampilan berdasarkan role.

## 2. Tech Stack (Strict)

- **Framework:** Next.js 16 (App Router)
- **Bahasa:** TypeScript (Strict)
- **Styling:** Tailwind CSS v4 (tanpa dark mode)
- **UI:** shadcn/ui (Radix UI primitives)
- **Auth:** `better-auth` (email/password + admin plugin)
- **Database:** Turso (LibSQL/SQLite) + Drizzle ORM
- **Storage:** Vercel Blob (file PDF)
- **Data Fetching:** TanStack Query (client-side)
- **Forms:** React Hook Form + Zod
- **Linting:** Oxlint + Oxfmt
- **Package Manager:** Bun

## 3. Aturan Inti & "Golden Rules"

### 1. Aturan Tipe (Type Integrity)
**JANGAN PERNAH** mendefinisikan interface secara manual untuk data dari database. Gunakan schema dari Drizzle.
- ✅ `import type { Document } from "@/lib/db/schema"`
- ❌ `interface Document { id: string; title: string; }`

### 2. Aturan Struktur File (Standardized Structure)
Ikuti hirarki yang sudah ditetapkan di `src/`. Jangan membuat folder top-level baru tanpa izin.

### 3. Aturan Pemisahan Tanggung Jawab (Strict Separation of Concerns)
**ZERO-TOLERANCE POLICY**: Komponen UI di `src/components/` harus murni presentasional. Pindahkan semua logika pengambilan data, side-effects (`useEffect`), dan pengelolaan form ke custom hooks di `src/hooks/`.

### 4. Aturan Naming (Casing & Filename)
- **PascalCase**: Hanya untuk React Components (bukan primitive UI).
- **kebab-case**: Untuk folder, hooks (`use-*.ts`), utilitas, config, dan file database.

### 5. Aturan Bahasa Indonesia (UI Content)
Semua teks yang muncul di layar (UI) **WAJIB** menggunakan Bahasa Indonesia yang baku dan sopan. Kode (variabel, fungsi, komentar teknis) tetap menggunakan Bahasa Inggris.

### 6. Aturan Server-First
Secara default, komponen adalah Server Component. Gunakan `"use client"` hanya jika benar-benar membutuhkan interaktivitas (hooks/events).

### 7. Aturan Ukuran Komponen
Targetkan komponen **≤ 150 baris**. Jika membengkak, pecah menjadi sub-komponen atau ekstrak logikanya ke hook.

### 8. Aturan Error Handling
Setiap pemanggilan API **WAJIB** menangani state loading dan error secara eksplisit. Jangan biarkan aplikasi "freeze" tanpa feedback.

## 4. Struktur Direktori (The Map)

```
src/
├── app/
│   ├── api/auth/[...all]/    # better-auth handler
│   ├── api/documents/        # GET list, POST upload
│   ├── api/documents/[id]/   # DELETE
│   ├── api/admin/users/[id]/role/ # PATCH role
│   ├── auth/login/           # Halaman login
│   ├── auth/register/        # Halaman register
│   ├── admin/users/          # Halaman kelola user (admin only)
│   └── page.tsx              # Halaman utama (dual view)
├── components/
│   ├── ui/                   # shadcn primitives (JANGAN EDIT)
│   ├── documents/            # DocumentsSection, UploadDialog
│   ├── admin/                # AdminUsersTable
│   ├── layout/               # Navbar
│   └── providers/            # Providers (QueryProvider)
├── lib/
│   ├── auth/auth.ts          # better-auth server config
│   ├── auth/auth-client.ts   # better-auth client config
│   ├── db/schema.ts          # Drizzle schema
│   ├── db/client.ts          # Turso DB client
│   └── utils/               # cn(), formatters
└── scripts/seed.ts           # Seed admin pertama
```

## 5. Checklist AI Reviewer (Critical)

| Kategori | Syarat Wajib | Rejeksi Instan |
| :--- | :--- | :--- |
| **Logic** | Logika di custom hooks | API calls langsung di UI component |
| **Data** | Tipe dari schema database | Interface manual untuk data backend |
| **Naming** | kebab-case untuk hooks | CamelCase untuk nama file hook |
| **UI** | Bahasa Indonesia | Hardcoded strings Bahasa Inggris |
| **Security**| Role check di server | Pengecekan role hanya di client |

## 6. Commands Penting

```bash
bun dev          # Dev server
bun build        # Production build
bun db:generate  # Generate migrasi Drizzle
bun db:migrate   # Jalankan migrasi ke Turso
bun db:seed      # Buat admin pertama (sekali saja)
bun fl           # Lint + format check (Oxlint + Oxfmt)
```
