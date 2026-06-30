// routes/auth.js — Artisans237
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('node:crypto');
const { get, run } = require('../db');
const { sendVerificationEmail } = require('../mailer');
const { JWT_SECRET, requireAuth } = require('../middleware/auth');

const router = express.Router();
const TRIAL_DAYS = parseInt(process.env.PROVIDER_TRIAL_DAYS || '14', 10);

router.post('/register', async (req, res) => {
  try {
    const { role, fullName, phone, email, password, town, quarter, customLocation, category, customCategory, bio } = req.body;

    if (!role || !fullName || !phone || !email || !password) {
      return res.status(400).json({ error: 'All required fields must be filled.' });
    }
    if (!['customer', 'provider'].includes(role)) {
      return res.status(400).json({ error: 'Invalid account type.' });
    }
    const finalCategory = (category === '__other__' ? (customCategory || '').trim() : category);
    if (role === 'provider' && !finalCategory) {
      return res.status(400).json({ error: 'Providers must select or type a service category.' });
    }

    const existing = await get('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing) return res.status(409).json({ error: 'An account with this email already exists.' });

    const passwordHash = bcrypt.hashSync(password, 10);
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyExpires = Date.now() + 24 * 60 * 60 * 1000;
    const now = Date.now();

    const result = await run(`
      INSERT INTO users (role, full_name, phone, email, password_hash, town, quarter, custom_location,
                          is_email_verified, email_verify_token, email_verify_expires, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)
    `, [role, fullName, phone, email.toLowerCase(), passwordHash, town || null, quarter || null,
        customLocation || null, verifyToken, verifyExpires, now]);

    const userId = result.lastInsertRowid;

    if (role === 'provider') {
      await run(`
        INSERT INTO provider_profiles (user_id, category, bio, trial_start, trial_days)
        VALUES (?, ?, ?, ?, ?)
      `, [userId, finalCategory, bio || null, now, TRIAL_DAYS]);
    }

    // Email sending is best-effort: if Gmail isn't configured yet, don't block signup.
    try {
      await sendVerificationEmail(email, fullName, verifyToken);
    } catch (mailErr) {
      console.error('[mailer] Failed to send verification email:', mailErr.message);
    }

    res.status(201).json({
      message: 'Account created. Check your email to verify your address before logging in.',
      userId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: 'Missing verification token.' });

    const user = await get('SELECT id, email_verify_expires FROM users WHERE email_verify_token = ?', [token]);
    if (!user) return res.status(400).json({ error: 'Invalid or already-used verification link.' });
    if (user.email_verify_expires < Date.now()) {
      return res.status(400).json({ error: 'This verification link has expired. Please request a new one.' });
    }

    await run(`
      UPDATE users SET is_email_verified = 1, email_verify_token = NULL, email_verify_expires = NULL
      WHERE id = ?
    `, [user.id]);

    res.json({ message: 'Email verified! You can now log in.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Verification failed. Please try again.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

    const user = await get('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Incorrect email or password.' });
    }
    if (!user.is_email_verified && !process.env.DEV_SKIP_EMAIL_VERIFY) {
      return res.status(403).json({ error: 'Please verify your email before logging in. Check your inbox.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, fullName: user.full_name, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, role: user.role, fullName: user.full_name, email: user.email, town: user.town, quarter: user.quarter },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

router.post('/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Current password and a new password (6+ characters) are required.' });
    }

    const user = await get('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (!user || !bcrypt.compareSync(currentPassword, user.password_hash)) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }

    const newHash = bcrypt.hashSync(newPassword, 10);
    await run('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, user.id]);
    res.json({ message: 'Password updated.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update password. Please try again.' });
  }
});

module.exports = router;
