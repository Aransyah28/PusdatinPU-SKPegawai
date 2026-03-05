# PusdatinPU-SKPegawai

Portal Surat Keterangan Kepegawaian — Pusat Data dan Informasi, Kementerian Pekerjaan Umum.

## Fitur

- 📄 Daftar SK Kepegawaian dalam format tabel (publik)
- ⬇️ Download PDF langsung dari tabel
- 🔐 Login & registrasi akun
- 👤 Admin: upload, hapus dokumen, kelola role pengguna

## Tech Stack

Next.js 16 • TypeScript • Tailwind CSS • better-auth • Turso • Drizzle ORM • Vercel Blob • TanStack Query

## Setup

```bash
# 1. Clone & install
git clone https://github.com/Aransyah28/PusdatinPU-SKPegawai.git
cd PusdatinPU-SKPegawai
bun install

# 2. Konfigurasi environment
cp .env.example .env.local
# Isi DATABASE_URL, DATABASE_AUTH_TOKEN, BLOB_READ_WRITE_TOKEN, BETTER_AUTH_SECRET

# 3. Migrasi database
bun db:generate
bun db:migrate

# 4. Buat admin pertama (sekali saja)
# Isi INITIAL_ADMIN_EMAIL dan INITIAL_ADMIN_PASSWORD di .env.local dulu
bun db:seed

# 5. Jalankan dev server
bun dev
```

## Deploy

Deploy ke Vercel: tambahkan semua env vars di dashboard Vercel, lalu `git push`.
