
import { createClient } from "@libsql/client";

const url = Bun.env.DATABASE_URL;
const authToken = Bun.env.DATABASE_AUTH_TOKEN;

console.log(`Attempting to connect to: ${url}`);

if (!url) {
  console.error("DATABASE_URL is not defined in environment variables.");
  process.exit(1);
}

const client = createClient({
  url: url,
  authToken: authToken,
});

async function testConnection() {
  try {
    const start = Date.now();
    const result = await client.execute("SELECT 1");
    const end = Date.now();
    console.log("Connection successful!");
    console.log("Result:", result.rows);
    console.log(`Response time: ${end - start}ms`);
  } catch (error) {
    console.error("Connection failed:");
    console.error(error);
  }
}

testConnection();
