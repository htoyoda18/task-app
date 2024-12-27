import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { sqliteTable, int, text } from "drizzle-orm/sqlite-core";

const sqlite = new Database("./tasks.db");
export const db = drizzle(sqlite);

db.run(
  `
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL
  );
  `
);

export const tasks = sqliteTable(
  "tasks",
  {
    id: int().primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
  },
  () => []
);
