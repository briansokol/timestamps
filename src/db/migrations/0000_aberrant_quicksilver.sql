CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`started_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`ended_at` text
);
--> statement-breakpoint
CREATE TABLE `timestamp` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` integer NOT NULL,
	`title` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
