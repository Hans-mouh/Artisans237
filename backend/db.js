// db.js — Artisans237
//
// Uses libSQL (the engine behind Turso) instead of node:sqlite. Same SQL,
// same mental model as SQLite — but this client can point at either:
//   - a local file (zero setup, for development): url = "file:./artisans237.db"
//   - a real hosted Turso database (for production): url = "libsql://...",
//     authToken = "..."
//
// This solves the free-hosting persistence problem: Render's free tier wipes
// its local disk on every restart, but a Turso database is not on that disk
// at all — it's a separate, genuinely persistent, free-tier-friendly service.
// Locally, with no TURSO_* env vars set, this still "just works" against a
// local file, so day-to-day development needs no Turso account at all.
//
// IMPORTANT: every call here is async now (libSQL has no synchronous API).
// Every route file awaits these calls and is wrapped in try/catch.

const { createClient } = require('@libsql/client');
const bcrypt = require('bcryptjs');

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:./artisans237.db',
  authToken: process.env.TURSO_AUTH_TOKEN, // undefined is fine for local file mode
});

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT NOT NULL CHECK(role IN ('customer','provider','admin')),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    town TEXT,
    quarter TEXT,
    custom_location TEXT,
    is_email_verified INTEGER NOT NULL DEFAULT 0,
    email_verify_token TEXT,
    email_verify_expires INTEGER,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS provider_profiles (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    category TEXT NOT NULL,
    bio TEXT,
    is_verified INTEGER NOT NULL DEFAULT 0,
    trial_start INTEGER NOT NULL,
    trial_days INTEGER NOT NULL DEFAULT 14,
    subscription_active INTEGER NOT NULL DEFAULT 0,
    subscription_expires INTEGER
  );

  CREATE TABLE IF NOT EXISTS manual_payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    provider_id INTEGER NOT NULL REFERENCES users(id),
    momo_reference TEXT NOT NULL,
    momo_payer_number TEXT NOT NULL,
    amount_fcfa INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','confirmed','rejected')),
    submitted_at INTEGER NOT NULL,
    reviewed_at INTEGER,
    admin_note TEXT
  );

  CREATE TABLE IF NOT EXISTS service_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL REFERENCES users(id),
    provider_id INTEGER REFERENCES users(id),
    category TEXT NOT NULL,
    town TEXT NOT NULL,
    quarter TEXT NOT NULL,
    description TEXT,
    contact_phone TEXT NOT NULL,
    contact_whatsapp TEXT,
    status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','accepted','completed','cancelled')),
    created_at INTEGER NOT NULL,
    accepted_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS support_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','resolved')),
    admin_reply TEXT,
    created_at INTEGER NOT NULL,
    replied_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id INTEGER NOT NULL REFERENCES service_requests(id),
    reviewer_id INTEGER NOT NULL REFERENCES users(id),
    reviewee_id INTEGER NOT NULL REFERENCES users(id),
    reviewer_role TEXT NOT NULL CHECK(reviewer_role IN ('customer','provider')),
    rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
    comment TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
    created_at INTEGER NOT NULL,
    UNIQUE(request_id, reviewer_id)
  );

  CREATE INDEX IF NOT EXISTS idx_provider_category ON provider_profiles(category);
  CREATE INDEX IF NOT EXISTS idx_requests_status ON service_requests(status);
  CREATE INDEX IF NOT EXISTS idx_support_status ON support_messages(status);
  CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON reviews(reviewee_id, status);
  CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
`;

// --- Small helpers so route files read almost like the old synchronous code ---

// SELECT ... -> array of row objects
async function all(sql, args = []) {
  const res = await db.execute({ sql, args });
  return res.rows;
}

// SELECT ... -> first row object, or undefined
async function get(sql, args = []) {
  const res = await db.execute({ sql, args });
  return res.rows[0];
}

// INSERT/UPDATE/DELETE -> { lastInsertRowid, changes }
async function run(sql, args = []) {
  const res = await db.execute({ sql, args });
  return {
    lastInsertRowid: res.lastInsertRowid !== undefined ? Number(res.lastInsertRowid) : undefined,
    changes: res.rowsAffected,
  };
}

async function seedAdmin() {
  const existing = await get('SELECT id FROM users WHERE role = ?', ['admin']);
  if (existing) return;

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@artisans237.local';
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe237!';
  const hash = bcrypt.hashSync(adminPassword, 10);

  await run(`
    INSERT INTO users (role, full_name, phone, email, password_hash, is_email_verified, created_at)
    VALUES ('admin', 'Artisans237 Admin', '000000000', ?, ?, 1, ?)
  `, [adminEmail, hash, Date.now()]);

  console.log(`[seed] Admin account created: ${adminEmail} — change the password after first login.`);
}

// Call this once at startup, before the server starts accepting requests.
async function initDb() {
  await db.executeMultiple(SCHEMA);
  await seedAdmin();
}

module.exports = { db, all, get, run, initDb };
