ALTER TABLE `renstra_folder` ADD `slug` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `renstra_folder_slug_unique` ON `renstra_folder` (`slug`);