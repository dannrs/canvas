import { Hono } from "hono";
import { logger } from "hono/logger";
import { canvasRoute } from "./routes/canvas";
import { cors } from "hono/cors";

const app = new Hono();

app.use("*", logger());
app.use("/api/*", cors());

const apiRoutes = app.basePath("/api").route("/canvas", canvasRoute);

export default app;
export type ApiRoutes = typeof apiRoutes;
