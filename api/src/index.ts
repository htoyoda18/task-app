import { eq } from "drizzle-orm";
import { db, tasks } from "./db.js";
import { app } from "./middleware.js";

app.get("/tasks", async (c) => {
  const allTasks = db.select().from(tasks).all();
  return c.json(allTasks);
});

app.post("/tasks", async (c) => {
  const { title } = await c.req.json<{ title?: string }>();
  if (!title || title.trim() === "") {
    return c.json({ error: "Invalid input" }, 400);
  }

  const result = db.insert(tasks).values({ title }).run();
  const newTask = db
    .select()
    .from(tasks)
    .where(eq(tasks.id, result.lastInsertRowid as number))
    .get();
  return c.json(newTask, 201);
});

app.put("/tasks/:id", async (c) => {
  const { id } = c.req.param();

  const taskId = Number(id);
  if (Number.isNaN(taskId)) {
    return c.json({ error: "Invalid ID" }, 400);
  }

  const { title } = await c.req.json<{ title?: string }>();
  if (!title || title.trim() === "") {
    return c.json({ error: "Invalid input" }, 400);
  }

  const result = db
    .update(tasks)
    .set({ title })
    .where(eq(tasks.id, taskId))
    .run();
  if (result.changes === 0) {
    return c.json({ error: "Task not found" }, 404);
  }

  const updatedTask = db.select().from(tasks).where(eq(tasks.id, taskId)).get();
  return c.json(updatedTask);
});

app.delete("/tasks/:id", async (c) => {
  const { id } = c.req.param();
  const taskId = Number(id);
  if (Number.isNaN(taskId)) {
    return c.json({ error: "Invalid ID" }, 400);
  }

  const result = db.delete(tasks).where(eq(tasks.id, taskId)).run();
  if (result.changes === 0) {
    return c.json({ error: "Task not found" }, 404);
  }

  return c.json(204);
});
