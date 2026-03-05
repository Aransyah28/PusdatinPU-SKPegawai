/**
 * Seed Script — Admin Pertama
 * Jalankan sekali saja: bun run db:seed
 *
 * Membutuhkan env vars:
 *   INITIAL_ADMIN_EMAIL
 *   INITIAL_ADMIN_PASSWORD
 *   INITIAL_ADMIN_NAME (opsional)
 */
import "dotenv/config";
import { db } from "../src/lib/db/client";
import { users } from "../src/lib/db/schema";
import { eq } from "drizzle-orm";

const email = process.env.INITIAL_ADMIN_EMAIL;
const password = process.env.INITIAL_ADMIN_PASSWORD;
const name = process.env.INITIAL_ADMIN_NAME ?? "Administrator";

if (!email || !password) {
  console.error(
    "❌ Set INITIAL_ADMIN_EMAIL dan INITIAL_ADMIN_PASSWORD di .env terlebih dahulu.",
  );
  process.exit(1);
}

async function seed() {
  console.log(`🌱 Membuat admin: ${email}`);

  // Cek apakah admin sudah ada
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email!))
    .limit(1);

  if (existing.length > 0) {
    console.log("⏭️  Admin sudah ada, skip. Tidak ada yang diubah.");
    return;
  }

  // Hash password menggunakan crypto (bun built-in)
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const hashBuffer = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    256,
  );
  const hashHex = Buffer.from(hashBuffer).toString("hex");
  const saltHex = Buffer.from(salt).toString("hex");
  const hashedPassword = `${saltHex}:${hashHex}`;

  // Insert admin ke DB
  const adminId = crypto.randomUUID();
  await db.insert(users).values({
    id: adminId,
    name,
    email: email!,
    emailVerified: true,
    role: "admin",
  });

  // better-auth menyimpan password di tabel account
  // Jalankan sign-up via better-auth API untuk hash yang benar
  console.log(`✅ Admin berhasil dibuat!`);
  console.log(`   Email: ${email}`);
  console.log(`   Nama : ${name}`);
  console.log(`   Role : admin`);
  console.log(`\n📌 Catatan: Gunakan fitur login di aplikasi.`);
  console.log(
    `   Karena better-auth mengelola password hash, jalankan registrasi melalui API:`,
  );
  console.log(`   POST /api/auth/sign-up/email lalu update role via DB.`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed gagal:", err);
    process.exit(1);
  });
