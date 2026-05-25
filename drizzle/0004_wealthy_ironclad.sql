CREATE TABLE `renstra_document` (
	`id` text PRIMARY KEY NOT NULL,
	`folder_id` text NOT NULL,
	`title` text NOT NULL,
	`year` integer NOT NULL,
	`description` text,
	`file_url` text NOT NULL,
	`file_name` text NOT NULL,
	`file_size` integer,
	`uploaded_by` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`folder_id`) REFERENCES `renstra_folder`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`uploaded_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `renstra_folder` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `renstra_folder_name_unique` ON `renstra_folder` (`name`);