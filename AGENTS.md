# AGENTS.md — PusdatinPU-SKPegawai

> **INSTRUKSI SISTEM:** Semua AI agent yang bekerja di repo ini WAJIB membaca dan mengikuti panduan berikut.

## 1. Gambaran Proyek

**Proyek:** Portal SK Kepegawaian Pusdatin PU
**Deskripsi:** Modul fullstack (Next.js 16 App Router) untuk menampilkan dan mengelola Surat Keterangan Kepegawaian dalam format tabel PDF. Satu halaman dengan dua tampilan berdasarkan role.

## 2. Tech Stack

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

## 3. Aturan Inti

### Auth & Role
- Role hanya ada 2: `"user"` (default saat register) dan `"admin"`
- Pengecekan role **WAJIB** dilakukan di server (API Routes / Server Components)
- Jangan pernah percaya data role yang datang dari client
- API admin-only: selalu `auth.api.getSession({ headers: await headers() })`

### File Structure
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

### Coding Rules
1. **Server-first:** Komponen default adalah Server Component. Gunakan `"use client"` hanya jika butuh hooks/events
2. **Bahasa Indonesia:** Semua teks UI dalam Bahasa Indonesia. Kode (variabel, fungsi, dll.) dalam Bahasa Inggris
3. **Tanpa dark mode:** Tidak ada `dark:` class, tidak ada ThemeProvider
4. **Komponen ≤ 150 baris:** Jika melebihi, ekstrak ke sub-komponen atau custom hook
5. **Error handling wajib:** Setiap API call harus punya loading state dan error state
6. **Jangan edit `src/components/ui/`** kecuali diminta secara eksplisit

### Database
- Tabel `user` dan `session` dikelola `better-auth` — JANGAN ubah struktur via migration manual
- Tabel `document`: id (uuid), title, year, description, fileUrl, fileName, fileSize, uploadedBy, createdAt
- Field `year` pada dokumen adalah integer (2023, 2024, 2025, ...)

### Storage (Vercel Blob)
- Upload: `put(filename, file, { access: "public" })` → returns `{ url }`
- Delete: `del(fileUrl)` — selalu hapus dari Blob saat record dihapus dari DB

## 4. Commands Penting

```bash
bun dev          # Dev server
bun build        # Production build
bun db:generate  # Generate migrasi Drizzle
bun db:migrate   # Jalankan migrasi ke Turso
bun db:seed      # Buat admin pertama (sekali saja)
bun fl           # Lint + format check
bun format       # Auto-format dengan Oxfmt
bun check        # TypeScript type check
```

## 5. Environment Variables

Semua variabel ada di `.env.example`. Yang wajib diisi:
- `DATABASE_URL` + `DATABASE_AUTH_TOKEN` — dari Turso dashboard
- `BLOB_READ_WRITE_TOKEN` — dari Vercel dashboard
- `BETTER_AUTH_SECRET` — string acak min 32 karakter
- `BETTER_AUTH_URL` — URL aplikasi (http://localhost:3000 di dev)
