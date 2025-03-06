import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from 'nanoid';

// Format the current date as "March 5, 2025 10:31pm"
const formatDateForTitle = () => {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const timestamp = sqliteTable("timestamp", {
  id: text().$default(() => nanoid()).primaryKey(),
  sessionId: integer("session_id").notNull(),
  title: text("title"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const session = sqliteTable("session", {
  id: text().$default(() => nanoid()).primaryKey(),
  title: text("title").$default(() => formatDateForTitle()).notNull(),
  startedAt: text("started_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  endedAt: text("ended_at"), // This is a datetime field that will be null initially
});
