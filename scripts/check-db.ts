import { db } from "../src/lib/db/client";
import { sql } from "drizzle-orm";

async function checkSchema() {
  try {
    console.log("Checking session table...");
    const res = await db.run(sql`PRAGMA table_info(session)`);
    console.log("Columns in 'session':", res.rows.map(r => r.name).join(", "));
  } catch (error) {
    console.error("Error checking schema:", error);
  } finally {
    process.exit(0);
  }
}

checkSchema();
