PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_timestamp` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`title` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_timestamp`("id", "session_id", "title", "created_at") SELECT "id", "session_id", "title", "created_at" FROM `timestamp`;--> statement-breakpoint
DROP TABLE `timestamp`;--> statement-breakpoint
ALTER TABLE `__new_timestamp` RENAME TO `timestamp`;--> statement-breakpoint
PRAGMA foreign_keys=ON;