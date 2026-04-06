import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { eq } from "drizzle-orm";

const inputDir = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.resolve(process.cwd(), "test-data", "pdfs");

const blobDirectory = (process.argv[3] ?? "SKPegawai")
  .replace(/^\/+|\/+$/g, "")
  .trim();

async function loadEnvFiles() {
  const envFiles = [".env.local", ".env"];

  for (const fileName of envFiles) {
    const envPath = path.resolve(process.cwd(), fileName);

    try {
      const content = await readFile(envPath, "utf8");
      const lines = content.split(/\r?\n/);

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
          continue;
        }

        const idx = trimmed.indexOf("=");
        const key = trimmed.slice(0, idx).trim();
        const rawValue = trimmed.slice(idx + 1).trim();
        const value = rawValue.replace(/^['"]|['"]$/g, "");

        if (key && process.env[key] === undefined) {
          process.env[key] = value;
        }
      }
    } catch {
      // Abaikan jika file env tidak ada.
    }
  }
}

function toTitleFromFilename(fileName: string): string {
  return fileName
    .replace(/\.pdf$/i, "")
    .replace(/[_\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function toYearFromFilename(fileName: string): number {
  const match = fileName.match(/\b(20\d{2})\b/);
  if (match) return Number.parseInt(match[1], 10);
  return new Date().getFullYear();
}

async function resolveUploadedBy(db: any, users: any): Promise<string | null> {
  const adminEmail = process.env.BATCH_UPLOAD_ADMIN_EMAIL;
  if (!adminEmail) return null;

  const admin = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, adminEmail))
    .limit(1);

  if (admin.length === 0) {
    console.warn(
      `⚠️ Admin dengan email ${adminEmail} tidak ditemukan. uploadedBy akan null.`,
    );
    return null;
  }

  return admin[0].id;
}

async function runBatchImport() {
  await loadEnvFiles();

  const [{ db }, { documents, users }] = await Promise.all([
    import("../src/lib/db/client"),
    import("../src/lib/db/schema"),
  ]);

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL belum diatur di environment.");
    process.exit(1);
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("❌ BLOB_READ_WRITE_TOKEN belum diatur di environment.");
    process.exit(1);
  }

  const entries = await readdir(inputDir, { withFileTypes: true });
  const pdfFiles = entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".pdf"))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  if (pdfFiles.length === 0) {
    console.error(`❌ Tidak ada file PDF di folder: ${inputDir}`);
    process.exit(1);
  }

  const uploadedBy = await resolveUploadedBy(db, users);
  let successCount = 0;
  let failCount = 0;

  console.log(`🚀 Mulai import ${pdfFiles.length} file PDF...`);

  for (const fileName of pdfFiles) {
    const filePath = path.join(inputDir, fileName);

    try {
      const buffer = await readFile(filePath);
      const blobPath = `${blobDirectory}/${Date.now()}-${fileName}`;

      const blob = await put(blobPath, buffer, {
        access: "public",
        contentType: "application/pdf",
      });

      await db.insert(documents).values({
        title: toTitleFromFilename(fileName),
        year: toYearFromFilename(fileName),
        description: "Dokumen uji batch import.",
        fileUrl: blob.url,
        fileName,
        fileSize: buffer.byteLength,
        uploadedBy,
      });

      successCount += 1;
      console.log(`✅ [${successCount}/${pdfFiles.length}] ${fileName}`);
    } catch (error) {
      failCount += 1;
      console.error(`❌ Gagal import ${fileName}:`, error);
    }
  }

  console.log("\n📊 Ringkasan import batch:");
  console.log(`   Berhasil: ${successCount}`);
  console.log(`   Gagal   : ${failCount}`);
  console.log(`   Folder  : ${inputDir}`);
  console.log(`   Prefix  : ${blobDirectory}/`);
}

runBatchImport().catch((error) => {
  console.error("❌ Import batch gagal:", error);
  process.exit(1);
});
