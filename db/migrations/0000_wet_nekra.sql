CREATE TABLE `codes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`vendor_name` text NOT NULL,
	`vendor_url` text NOT NULL,
	`gifted_to` text,
	`gifted_at` integer DEFAULT CURRENT_TIMESTAMP,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP
);
