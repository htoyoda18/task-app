import { Hono } from "hono";
import { serve } from "@hono/node-server";

export const app = new Hono();

app.use("*", async (c, next) => {
  c.res.headers.append("Access-Control-Allow-Origin", "*");
  c.res.headers.append(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  c.res.headers.append(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (c.req.method === "OPTIONS") {
    return c.text("", 204);
  }

  await next();
});

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: err.message || "Internal Server Error" }, 500);
});

serve(app);
