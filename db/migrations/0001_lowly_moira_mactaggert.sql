PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_codes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`vendor_name` text NOT NULL,
	`vendor_url` text NOT NULL,
	`gifted_to` text,
	`gifted_at` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
INSERT INTO `__new_codes`("id", "code", "vendor_name", "vendor_url", "gifted_to", "gifted_at", "created_at") SELECT "id", "code", "vendor_name", "vendor_url", "gifted_to", "gifted_at", "created_at" FROM `codes`;--> statement-breakpoint
DROP TABLE `codes`;--> statement-breakpoint
ALTER TABLE `__new_codes` RENAME TO `codes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;