/**
 * Script: seed-rkakl-documents.ts
 * Tujuan: Mengisi database dengan data uji 3 dokumen RKAKL per tahun
 *         selama 5 tahun (2021–2025).
 *
 * Total record: 5 tahun × 3 dokumen = 15 record
 *
 * Jalankan dengan:
 *   bun tsx scripts/seed-rkakl-documents.ts
 */

import path from "node:path";
import { readFile } from "node:fs/promises";
import { put } from "@vercel/blob";

const YEARS = [2021, 2022, 2023, 2024, 2025] as const;
const DOCS_PER_YEAR = 3;

const DOC_LABELS = [
  "Rencana Kerja",
  "Anggaran Kegiatan",
  "Laporan Realisasi",
] as const;

const MINIMAL_PDF = Buffer.from(
  "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj " +
    "2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj " +
    "3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R>>endobj " +
    "xref\n0 4\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n0\n%%EOF",
);

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

async function seedRkaklDocuments() {
  await loadEnvFiles();

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL belum diatur di environment.");
    process.exit(1);
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("❌ BLOB_READ_WRITE_TOKEN belum diatur di environment.");
    process.exit(1);
  }

  const [{ db }, { rkaklDocuments }] = await Promise.all([
    import("../src/lib/db/client"),
    import("../src/lib/db/schema"),
  ]);

  const total = YEARS.length * DOCS_PER_YEAR;
  let success = 0;
  let fail = 0;

  console.log(`🚀 Mulai seeding ${total} dokumen RKAKL uji...\n`);

  for (const year of YEARS) {
    for (let i = 0; i < DOCS_PER_YEAR; i++) {
      const label = DOC_LABELS[i];
      const fileName = `RKAKL-${year}-${String(i + 1).padStart(2, "0")}.pdf`;
      const title = `RKAKL ${year} — ${label}`;
      const blobPath = `RKAKL/${year}/${crypto.randomUUID()}-${fileName}`;

      try {
        const blob = await put(blobPath, MINIMAL_PDF, {
          access: "public",
          contentType: "application/pdf",
        });

        await db.insert(rkaklDocuments).values({
          title,
          year,
          description: `Data uji seeding — RKAKL ${year}, ${label}.`,
          fileUrl: blob.url,
          fileName,
          fileSize: MINIMAL_PDF.byteLength,
          uploadedBy: null,
        });

        success += 1;
        console.log(`  ✅ [${success}/${total}] ${year} — ${label}`);
      } catch (err) {
        fail += 1;
        console.error(`  ❌ Gagal: ${year} — ${label}`, err);
      }
    }
  }

  console.log("\n📊 Ringkasan Seeding RKAKL:");
  console.log(`   Berhasil : ${success}`);
  console.log(`   Gagal    : ${fail}`);
  console.log(`   Total    : ${total}`);
}

seedRkaklDocuments().catch((err) => {
  console.error("❌ Seeding gagal:", err);
  process.exit(1);
});
