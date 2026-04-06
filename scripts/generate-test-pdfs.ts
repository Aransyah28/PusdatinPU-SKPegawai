import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const OUTPUT_DIR = path.resolve(process.cwd(), "test-data", "pdfs");
const TOTAL_FILES = 100;
const CURRENT_YEAR = new Date().getFullYear();

function escapePdfText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildSimplePdf(singleChar: string): Buffer {
  const text = escapePdfText(singleChar);
  const contentStream = `BT\n/F1 72 Tf\n280 420 Td\n(${text}) Tj\nET\n`;

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(contentStream, "utf8")} >>\nstream\n${contentStream}endstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];

  for (let i = 0; i < objects.length; i += 1) {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefStart = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let i = 1; i < offsets.length; i += 1) {
    const padded = offsets[i].toString().padStart(10, "0");
    pdf += `${padded} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefStart}\n%%EOF\n`;

  return Buffer.from(pdf, "utf8");
}

async function generate() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  for (let i = 1; i <= TOTAL_FILES; i += 1) {
    const docNumber = i.toString().padStart(3, "0");
    const charCode = 65 + ((i - 1) % 26);
    const char = String.fromCharCode(charCode);
    const fileName = `sk-uji-${docNumber}-${CURRENT_YEAR}.pdf`;
    const filePath = path.join(OUTPUT_DIR, fileName);
    const pdfBuffer = buildSimplePdf(char);

    await writeFile(filePath, pdfBuffer);
  }

  console.log(`✅ Berhasil membuat ${TOTAL_FILES} file PDF dummy.`);
  console.log(`📁 Lokasi: ${OUTPUT_DIR}`);
}

generate().catch((error) => {
  console.error("❌ Gagal membuat PDF dummy:", error);
  process.exit(1);
});
