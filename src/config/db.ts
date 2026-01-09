import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// TEST KONEKSI
pool.query("SELECT NOW()")
  .then(res => console.log("✅ DB connected:", res.rows[0]))
  .catch(err => console.error("❌ DB error:", err));
