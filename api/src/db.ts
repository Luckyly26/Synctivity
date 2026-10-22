import pg from "pg";

const connectionString = process.env.DATABASE_URL;
if(!connectionString) {
    throw new Error("No DATABASE_URL provided");
}

export const pool = new pg.Pool({connectionString});