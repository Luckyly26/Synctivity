import {Hono} from "hono";
import {ELECTRIC_PROTOCOL_QUERY_PARAMS} from "@electric-sql/client";

const ALLOWED_TABLES = ["exercises", "workouts", "workout-sets"];
const ELECTRIC_URL = process.env.ELECTRIC_URL ?? "http://localhost:3000";
const ELECTRIC_SECRET = process.env.ELECTRIC_SECRET;

if(!ELECTRIC_SECRET){
    throw new Error("ELECTRIC_SECRET is required");
}

export const shapeRoutes = new Hono();
shapeRoutes.get("/", async (c)=> {
    const table = c.req.query("table");
    if (!table || !ALLOWED_TABLES.includes(table)) {
        return c.json({error: "Unknown table"}, 400);
    }

    const upstream = new URL(`${ELECTRIC_URL}/v1/shape`);
    const incoming = new URL(c.req.url);

incoming.searchParams.forEach((value, key) => {
    if(ELECTRIC_PROTOCOL_QUERY_PARAMS.includes(key)) {
        upstream.searchParams.set(key, value);
    }
});

upstream.searchParams.set("table", table);
upstream.searchParams.set("secret", ELECTRIC_SECRET);

const res = await fetch(upstream);
const headers = new Headers(res.headers);
headers.delete("content-encoding");
headers.delete("content-length");

return new Response (res.body, {status: res.status, headers});
});

