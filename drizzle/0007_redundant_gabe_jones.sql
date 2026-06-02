DROP INDEX "lakip_folder_name_unique";--> statement-breakpoint
DROP INDEX "lakip_folder_slug_unique";--> statement-breakpoint
DROP INDEX "renstra_folder_name_unique";--> statement-breakpoint
DROP INDEX "renstra_folder_slug_unique";--> statement-breakpoint
DROP INDEX "session_token_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
ALTER TABLE `account` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (unixepoch() * 1000);--> statement-breakpoint
CREATE UNIQUE INDEX `lakip_folder_name_unique` ON `lakip_folder` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `lakip_folder_slug_unique` ON `lakip_folder` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `renstra_folder_name_unique` ON `renstra_folder` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `renstra_folder_slug_unique` ON `renstra_folder` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `account` ALTER COLUMN "updated_at" TO "updated_at" integer NOT NULL DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `document` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `lakip_document` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `lakip_folder` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `laporan_keuangan_document` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `lpj_bendahara_document` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `renstra_document` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `renstra_folder` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `rkakl_document` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `session` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `session` ALTER COLUMN "updated_at" TO "updated_at" integer NOT NULL DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `sop_document` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `user` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `user` ALTER COLUMN "updated_at" TO "updated_at" integer NOT NULL DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `verification` ALTER COLUMN "created_at" TO "created_at" integer DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `verification` ALTER COLUMN "updated_at" TO "updated_at" integer DEFAULT (unixepoch() * 1000);