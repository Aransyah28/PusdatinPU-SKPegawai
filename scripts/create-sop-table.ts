import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function main() {
  try {
    console.log("Creating sop_document table...");
    await client.execute(`
      CREATE TABLE IF NOT EXISTS \`sop_document\` (
        \`id\` text PRIMARY KEY NOT NULL,
        \`title\` text NOT NULL,
        \`year\` integer NOT NULL,
        \`bidang\` text NOT NULL,
        \`description\` text,
        \`file_url\` text NOT NULL,
        \`file_name\` text NOT NULL,
        \`file_size\` integer,
        \`uploaded_by\` text,
        \`created_at\` integer DEFAULT (unixepoch()) NOT NULL,
        FOREIGN KEY (\`uploaded_by\`) REFERENCES \`user\`(\`id\`) ON UPDATE no action ON DELETE set null
      );
    `);
    console.log("Table sop_document created successfully.");
  } catch (error) {
    console.error("Failed to create table:", error);
  } finally {
    client.close();
  }
}

main();
