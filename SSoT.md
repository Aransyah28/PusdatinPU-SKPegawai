# SSoT — PusdatinPU-SKPegawai Single Source of Truth

- **Proyek:** Portal SK Kepegawaian Pusdatin PU
- **Versi:** 1.0.0
- **Status:** Active Development
- **Pemilik Dokumen:** Pusdatin PU Team

---

## 1. Konteks Produk & Solusi

### 1.1 Masalah
Pengelolaan Surat Keterangan (SK) Kepegawaian seringkali tersebar dan sulit diakses secara cepat oleh pegawai. Admin membutuhkan alat yang efisien untuk mengunggah dan mengelola dokumen dalam satu tempat yang aman.

### 1.2 Solusi
Aplikasi web modern yang membagi fungsionalitas menjadi dua area utama:
1. **Public View:** Daftar SK yang dapat dicari dan diunduh oleh semua pegawai.
2. **Admin Dashboard:** Alat manajemen khusus untuk unggah (`Vercel Blob`), hapus, dan kelola akses pengguna.

---

## 2. Strategi Teknikal & Rasional

### 2.1 Pilihan Framework: Next.js 16
Dipilih karena fitur App Router yang handal, Server Components untuk performa, dan kemudahan deployment di Vercel.

### 2.2 Keamanan: Better-Auth
Menggunakan `better-auth` untuk manajemen session dan role yang tersinkronisasi dengan database Turso. Role `"admin"` memiliki akses eksklusif ke API mutasi data.

### 2.3 Rasional Arsitektur (SOLID & DRY)
- **S (Single Responsibility):** Setiap hook di `src/hooks/` hanya menangani satu tanggung jawab (misal: `use-documents.ts` hanya untuk data dokumen).
- **O (Open/Closed):** Komponen UI diatur agar bisa menerima props variant tanpa mengubah kode internalnya (shadcn patterns).
- **SoC (Separation of Concerns):** UI tidak boleh melakukan fetch data. UI hanya berlangganan ke state yang disediakan oleh hooks.

---

## 3. Aliran Data (Data Flow)

1. **Trigger:** Pengguna melakukan interaksi (misal: klik cari).
2. **Hook:** UI memanggil fungsi dari custom hook (misal: `useDocuments`).
3. **API:** Hook menggunakan TanStack Query untuk memanggil API route `/api/documents`.
4. **Database:** API route melakukan query ke Turso menggunakan Drizzle ORM.
5. **UI Update:** Data mengalir kembali melalui hook ke UI component secara reaktif.

---

## 4. Standar Kode & Etika AI Agent

### 4.1 Type Safety
Dilarang keras menggunakan `any`. Selalu gunakan tipe yang diderivasi dari schema database di `src/lib/db/schema.ts`.

### 4.2 Error Handling
AI Agent harus memastikan setiap fitur baru memiliki skeleton loading dan pesan error yang deskriptif dalam Bahasa Indonesia.

### 4.3 Clean Code
AI Agent tidak boleh menyarankan pola "backup" kode lama di dalam file yang sama. Refactoring harus bersih dan tuntas.
