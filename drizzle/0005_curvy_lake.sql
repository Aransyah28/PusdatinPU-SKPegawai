-- Migrasi aman untuk SQLite: menambah kolom `slug` NOT NULL UNIQUE ke tabel yang sudah ada.
-- SQLite tidak mendukung ALTER TABLE ADD COLUMN NOT NULL tanpa DEFAULT pada tabel berisi data.
-- Strategi: buat tabel baru dengan skema lengkap → salin data (slug di-generate dari name)
-- → hapus tabel lama → ganti nama tabel baru.

PRAGMA foreign_keys = OFF;
--> statement-breakpoint

-- Langkah 1: Buat tabel baru dengan skema target (termasuk slug NOT NULL UNIQUE)
CREATE TABLE `renstra_folder_new` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint

-- Langkah 2: Salin data lama, hasilkan slug dari name menggunakan fungsi SQLite bawaan.
-- Logika slug: lowercase → spasi & underscore → tanda hubung → trim tanda hubung di tepi.
-- Ini mencerminkan fungsi slugify() di src/lib/utils/formatters.ts.
INSERT INTO `renstra_folder_new` (`id`, `name`, `slug`, `created_at`)
SELECT
  `id`,
  `name`,
  trim(
    replace(
      replace(
        lower(`name`),
        ' ', '-'
      ),
      '_', '-'
    ),
    '-'
  ) AS `slug`,
  `created_at`
FROM `renstra_folder`;
--> statement-breakpoint

-- Langkah 3: Hapus tabel lama beserta index-nya
DROP TABLE `renstra_folder`;
--> statement-breakpoint

-- Langkah 4: Ganti nama tabel baru menjadi nama tabel asli
ALTER TABLE `renstra_folder_new` RENAME TO `renstra_folder`;
--> statement-breakpoint

-- Langkah 5: Buat kembali semua index unik
CREATE UNIQUE INDEX `renstra_folder_name_unique` ON `renstra_folder` (`name`);
--> statement-breakpoint
CREATE UNIQUE INDEX `renstra_folder_slug_unique` ON `renstra_folder` (`slug`);
--> statement-breakpoint

PRAGMA foreign_keys = ON;