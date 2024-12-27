import { eq } from "drizzle-orm";
import { db, tasks } from "./db.js";
import { app } from "./middleware.js";

app.get("/tasks", async (c) => {
  const allTasks = db.select().from(tasks).all();
  return c.json(allTasks);
});
