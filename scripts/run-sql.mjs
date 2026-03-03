import postgres from "postgres";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const connectionString =
  process.env.POSTGRES_URL_NON_POOLING ||
  "postgres://postgres.qivmjeeyolhloujhwihi:Vl36BWwv4KuPJ8qg@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require";

const sql = postgres(connectionString, { ssl: "require" });

async function run() {
  const fileName = process.argv[2] || "setup-auth-schema.sql";
  const sqlFile = readFileSync(
    join(__dirname, fileName),
    "utf-8"
  );

  // Split by section comments and execute each block separately
  // This handles the fact that some statements depend on previous ones
  const blocks = sqlFile
    .split(/-- ={10,}/)
    .map((b) => b.trim())
    .filter((b) => {
      // Remove comment-only blocks
      const lines = b
        .split("\n")
        .filter((l) => l.trim() && !l.trim().startsWith("--"));
      return lines.length > 0;
    });

  console.log(`Found ${blocks.length} SQL blocks to execute\n`);

  for (let i = 0; i < blocks.length; i++) {
    // Extract the first comment line as description
    const descLine = blocks[i]
      .split("\n")
      .find((l) => l.trim().startsWith("--"));
    const desc = descLine ? descLine.replace(/^--\s*/, "").trim() : `Block ${i + 1}`;

    // Remove comment lines to get pure SQL
    const pureSql = blocks[i]
      .split("\n")
      .filter((l) => !l.trim().startsWith("--"))
      .join("\n")
      .trim();

    if (!pureSql) continue;

    console.log(`[${i + 1}/${blocks.length}] ${desc}`);
    try {
      await sql.unsafe(pureSql);
      console.log(`    ✓ Success\n`);
    } catch (err) {
      // Some errors are expected (e.g., "already exists")
      if (
        err.message.includes("already exists") ||
        err.message.includes("duplicate")
      ) {
        console.log(`    ⚠ Already exists (skipping)\n`);
      } else {
        console.error(`    ✗ Error: ${err.message}\n`);
      }
    }
  }

  // Verify tables exist
  console.log("--- Verification ---");
  const tables = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `;
  console.log(
    "Public tables:",
    tables.map((t) => t.table_name)
  );

  await sql.end();
  console.log("\nDone!");
}

run().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
