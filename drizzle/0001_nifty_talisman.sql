CREATE TABLE `short_url` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`short_code` text NOT NULL,
	`original_url` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `short_url_short_code_unique` ON `short_url` (`short_code`);