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
