RENAME TABLE `short_link` TO `shortlink`;--> statement-breakpoint
ALTER TABLE `shortlink` DROP INDEX `short_link_short_code_unique`;--> statement-breakpoint
ALTER TABLE `shortlink` DROP FOREIGN KEY `short_link_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `shortlink` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `shortlink` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `shortlink` ADD CONSTRAINT `shortlink_short_code_unique` UNIQUE(`short_code`);--> statement-breakpoint
ALTER TABLE `shortlink` ADD CONSTRAINT `shortlink_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;