// reset-admin-password.js — Artisans237
// Run this from inside the backend/ folder to set the admin's password,
// whether or not an admin already exists.
//
// Usage:
//   node reset-admin-password.js youremail@example.com YourNewPassword123
//
// If no admin with that email exists yet, one is created. If it exists,
// its password is updated.

const { DatabaseSync } = require('node:sqlite');
const bcrypt = require('bcryptjs');
const path = require('node:path');

const [, , email, password] = process.argv;

if (!email || !password) {
  console.error('Usage: node reset-admin-password.js <email> <new-password>');
  process.exit(1);
}

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'artisans237.db');
const db = new DatabaseSync(DB_PATH);
const hash = bcrypt.hashSync(password, 10);

const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());

if (existing) {
  db.prepare('UPDATE users SET password_hash = ?, role = ?, is_email_verified = 1 WHERE id = ?')
    .run(hash, 'admin', existing.id);
  console.log(`Updated password for existing account: ${email}`);
} else {
  db.prepare(`
    INSERT INTO users (role, full_name, phone, email, password_hash, is_email_verified, created_at)
    VALUES ('admin', 'Artisans237 Admin', '000000000', ?, ?, 1, ?)
  `).run(email.toLowerCase(), hash, Date.now());
  console.log(`Created new admin account: ${email}`);
}

console.log('You can now log in at /login.html with this email and password.');
