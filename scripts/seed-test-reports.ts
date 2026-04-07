import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { eq, like, or } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { documents, users } from "@/lib/db/schema";

const OUTPUT_DIR = path.resolve(process.cwd(), "test-data", "pdfs");

// Report types and their configurations
const REPORT_TYPES = [
  {
    name: "laporanbulanan",
    label: "Laporan Bulanan",
    years: [2022, 2023, 2024, 2025, 2026],
    filesPerYear: 20,
  },
  {
    name: "laporankinerja",
    label: "Laporan Kinerja",
    years: [2022, 2023, 2024, 2025, 2026],
    filesPerYear: 20,
  },
  {
    name: "laporanmingguan",
    label: "Laporan Mingguan",
    years: [2022, 2023, 2024, 2025, 2026],
    filesPerYear: 20,
  },
  {
    name: "laporantriwulan",
    label: "Laporan Triwulan",
    years: [2022, 2023, 2024, 2025, 2026],
    filesPerYear: 20,
  },
];

function escapePdfText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildSimplePdf(text: string): Buffer {
  const escapedText = escapePdfText(text);
  const contentStream = `BT\n/F1 14 Tf\n50 750 Td\n(${escapedText}) Tj\nET\n`;

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(contentStream, "utf8")} >>\nstream\n${contentStream}endstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];

  for (let i = 0; i < objects.length; i += 1) {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefStart = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let i = 0; i < offsets.length; i += 1) {
    const padded = offsets[i].toString().padStart(10, "0");
    pdf += `${padded} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefStart}\n%%EOF\n`;

  return Buffer.from(pdf, "utf8");
}

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

async function resolveUploadedBy(): Promise<string | null> {
  const adminEmail = process.env.BATCH_UPLOAD_ADMIN_EMAIL;
  if (!adminEmail) return null;

  const admin = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, adminEmail))
    .limit(1);

  return admin[0]?.id ?? null;
}

async function cleanupOldSeed() {
  await db
    .delete(documents)
    .where(
      or(
        like(documents.description, "Data uji laporanbulanan %"),
        like(documents.description, "Data uji laporankinerja %"),
        like(documents.description, "Data uji laporanmingguan %"),
        like(documents.description, "Data uji laporantriwulan %"),
      ),
    );
}

async function generateAndSeed() {
  await loadEnvFiles();

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("❌ BLOB_READ_WRITE_TOKEN belum diatur di environment.");
    process.exit(1);
  }

  await mkdir(OUTPUT_DIR, { recursive: true });
  await cleanupOldSeed();

  const uploadedBy = await resolveUploadedBy();

  let totalFiles = 0;

  for (const reportType of REPORT_TYPES) {
    const reportDir = path.join(OUTPUT_DIR, reportType.name.toUpperCase());
    await mkdir(reportDir, { recursive: true });

    for (const year of reportType.years) {
      const yearDir = path.join(reportDir, year.toString());
      await mkdir(yearDir, { recursive: true });

      for (let fileNum = 1; fileNum <= reportType.filesPerYear; fileNum += 1) {
        const fileName = `${reportType.label}_${year}_${String(fileNum).padStart(2, "0")}.pdf`;
        const filePath = path.join(yearDir, fileName);

        // Generate PDF
        const pdfContent = buildSimplePdf(
          `${reportType.label} - ${year} - File ${fileNum}`
        );
        await writeFile(filePath, pdfContent);

        // Insert to database
        try {
          const blobPath = `${reportType.name}/${year}/${fileName}`;
          const blob = await put(blobPath, pdfContent, {
            access: "public",
            contentType: "application/pdf",
          });

          await db.insert(documents).values({
            title: fileName,
            year: year,
            description: `Data uji ${reportType.name} tahun ${year}`,
            fileUrl: blob.url,
            fileName: fileName,
            fileSize: pdfContent.byteLength,
            uploadedBy,
          });

          totalFiles++;
          console.log(
            `✓ Imported: /${reportType.name}/${year}/${fileName} (${totalFiles})`
          );
        } catch (error) {
          console.error(
            `✗ Failed to insert ${fileName}:`,
            error instanceof Error ? error.message : error
          );
        }
      }
    }
  }

  console.log(
    `\n✅ Done! Generated dan import ${totalFiles} file ke Turso.`
  );
  console.log(`📁 Location: ${OUTPUT_DIR}`);
  console.log("🗂️ Prefix Blob: /laporan.../year");
}

generateAndSeed().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
