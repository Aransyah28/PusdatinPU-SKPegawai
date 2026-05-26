/**
 * Format ukuran file dari bytes ke string yang mudah dibaca.
 * Contoh: 1024 → "1 KB", 1048576 → "1 MB"
 */
export function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Format tanggal dari timestamp ke string Indonesia.
 * Contoh: new Date() → "5 Maret 2025"
 */
export function formatDate(date: Date | null | undefined): string {
  if (!date) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
 * Sanitasi nama file untuk storage dengan mengganti spasi menjadi tanda hubung (-).
 * Contoh: "Dokumen Penting 2024.pdf" → "Dokumen-Penting-2024.pdf"
 */
export function sanitizeFileName(fileName: string): string {
  return fileName.replace(/\s+/g, "-");
}

/**
 * Ubah teks menjadi slug URL-safe.
 * Contoh: "Renstra 2020 - 2024" → "renstra-2020-2024"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // hapus diakritik
    .replace(/[^a-z0-9\s-]/g, "")   // hanya huruf, angka, spasi, dan -
    .trim()
    .replace(/[\s_-]+/g, "-")        // spasi/underscore menjadi -
    .replace(/^-+|-+$/g, "");        // hapus - di awal/akhir
}
