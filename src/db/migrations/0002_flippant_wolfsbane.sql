PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_session` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`started_at` text NOT NULL,
	`ended_at` text
);
--> statement-breakpoint
INSERT INTO `__new_session`("id", "title", "started_at", "ended_at") SELECT "id", "title", "started_at", "ended_at" FROM `session`;--> statement-breakpoint
DROP TABLE `session`;--> statement-breakpoint
ALTER TABLE `__new_session` RENAME TO `session`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_timestamp` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` integer NOT NULL,
	`title` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_timestamp`("id", "session_id", "title", "created_at") SELECT "id", "session_id", "title", "created_at" FROM `timestamp`;--> statement-breakpoint
DROP TABLE `timestamp`;--> statement-breakpoint
ALTER TABLE `__new_timestamp` RENAME TO `timestamp`;