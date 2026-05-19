CREATE TABLE `laporan_keuangan_document` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`year` integer NOT NULL,
	`description` text,
	`file_url` text NOT NULL,
	`file_name` text NOT NULL,
	`file_size` integer,
	`uploaded_by` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`uploaded_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `lpj_bendahara_document` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`year` integer NOT NULL,
	`description` text,
	`file_url` text NOT NULL,
	`file_name` text NOT NULL,
	`file_size` integer,
	`uploaded_by` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`uploaded_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
