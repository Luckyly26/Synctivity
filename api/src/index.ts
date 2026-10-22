import {serve} from "@hono/node-server";
import {Hono} from "hono";
import {pool} from "./db.js"
import {shapeRoutes} from "./routes/shapes.js";

const app = new Hono();

app.get("/health", (c) => c.json({ status: "ok" }));

const port = 8787;
serve({ fetch: app.fetch, port });
console.log(`API läuft auf http://localhost:${port}`);

app.get("/db-test", async (c) => {
    const result = await pool.query('select * from users');
    return c.json(result.rows);
});

app.route("/api/shape", shapeRoutes)