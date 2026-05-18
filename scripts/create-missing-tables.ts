/**
 * Script: create-missing-tables.ts
 * Tujuan: Membuat tabel `rkakl_document` dan `sop_document` yang belum ada
 *         di Turso tanpa menyentuh tabel lain yang sudah ada.
 *
 * Jalankan dengan:
 *   bun tsx scripts/create-missing-tables.ts
 */

import path from "node:path";
import { readFile } from "node:fs/promises";

async function loadEnvFiles() {
  const envFiles = [".env.local", ".env"];
  for (const fileName of envFiles) {
    const envPath = path.resolve(process.cwd(), fileName);
    try {
      const content = await readFile(envPath, "utf8");
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
        const idx = trimmed.indexOf("=");
        const key = trimmed.slice(0, idx).trim();
        const value = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, "");
        if (key && process.env[key] === undefined) {
          process.env[key] = value;
        }
      }
    } catch {
      // Abaikan jika file env tidak ditemukan.
    }
  }
}

const CREATE_RKAKL = `
CREATE TABLE IF NOT EXISTS \`rkakl_document\` (
  \`id\` text PRIMARY KEY NOT NULL,
  \`title\` text NOT NULL,
  \`year\` integer NOT NULL,
  \`description\` text,
  \`file_url\` text NOT NULL,
  \`file_name\` text NOT NULL,
  \`file_size\` integer,
  \`uploaded_by\` text,
  \`created_at\` integer DEFAULT (unixepoch()) NOT NULL,
  FOREIGN KEY (\`uploaded_by\`) REFERENCES \`user\`(\`id\`) ON UPDATE no action ON DELETE set null
)
`.trim();

const CREATE_SOP = `
CREATE TABLE IF NOT EXISTS \`sop_document\` (
  \`id\` text PRIMARY KEY NOT NULL,
  \`title\` text NOT NULL,
  \`year\` integer NOT NULL,
  \`bidang\` text NOT NULL,
  \`description\` text,
  \`file_url\` text NOT NULL,
  \`file_name\` text NOT NULL,
  \`file_size\` integer,
  \`uploaded_by\` text,
  \`created_at\` integer DEFAULT (unixepoch()) NOT NULL,
  FOREIGN KEY (\`uploaded_by\`) REFERENCES \`user\`(\`id\`) ON UPDATE no action ON DELETE set null
)
`.trim();

const CREATE_LAPORAN_KEUANGAN = `
CREATE TABLE IF NOT EXISTS \`laporan_keuangan_document\` (
  \`id\` text PRIMARY KEY NOT NULL,
  \`title\` text NOT NULL,
  \`year\` integer NOT NULL,
  \`description\` text,
  \`file_url\` text NOT NULL,
  \`file_name\` text NOT NULL,
  \`file_size\` integer,
  \`uploaded_by\` text,
  \`created_at\` integer DEFAULT (unixepoch()) NOT NULL,
  FOREIGN KEY (\`uploaded_by\`) REFERENCES \`user\`(\`id\`) ON UPDATE no action ON DELETE set null
)
`.trim();

const CREATE_LPJ_BENDAHARA = `
CREATE TABLE IF NOT EXISTS \`lpj_bendahara_document\` (
  \`id\` text PRIMARY KEY NOT NULL,
  \`title\` text NOT NULL,
  \`year\` integer NOT NULL,
  \`description\` text,
  \`file_url\` text NOT NULL,
  \`file_name\` text NOT NULL,
  \`file_size\` integer,
  \`uploaded_by\` text,
  \`created_at\` integer DEFAULT (unixepoch()) NOT NULL,
  FOREIGN KEY (\`uploaded_by\`) REFERENCES \`user\`(\`id\`) ON UPDATE no action ON DELETE set null
)
`.trim();

async function createMissingTables() {
  await loadEnvFiles();

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL belum diatur di environment.");
    process.exit(1);
  }

  const [{ db }, { sql }] = await Promise.all([
    import("../src/lib/db/client"),
    import("drizzle-orm"),
  ]);

  const tables = [
    { name: "rkakl_document", statement: sql.raw(CREATE_RKAKL) },
    { name: "sop_document", statement: sql.raw(CREATE_SOP) },
    { name: "laporan_keuangan_document", statement: sql.raw(CREATE_LAPORAN_KEUANGAN) },
    { name: "lpj_bendahara_document", statement: sql.raw(CREATE_LPJ_BENDAHARA) },
  ];

  for (const { name, statement } of tables) {
    try {
      await db.run(statement);
      console.log(`✅ Tabel \`${name}\` berhasil dibuat (atau sudah ada).`);
    } catch (err) {
      console.error(`❌ Gagal membuat tabel \`${name}\`:`, err);
    }
  }

  console.log("\n✅ Selesai. Coba jalankan aplikasi kembali.");
}

createMissingTables().catch((err) => {
  console.error("❌ Script gagal:", err);
  process.exit(1);
});
