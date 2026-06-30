// routes/admin.js — Artisans237
const express = require('express');
const { all, get, run } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth, requireRole('admin'));

// Stat cards for the admin dashboard (matches the original site's overview cards).
router.get('/stats', async (req, res) => {
  try {
    const totals = (await get('SELECT COUNT(*) AS n FROM service_requests')).n;
    const pending = (await get("SELECT COUNT(*) AS n FROM service_requests WHERE status = 'open'")).n;
    const accepted = (await get("SELECT COUNT(*) AS n FROM service_requests WHERE status IN ('accepted','completed')")).n;
    const volume = (await get("SELECT COALESCE(SUM(amount_fcfa), 0) AS total FROM manual_payments WHERE status = 'confirmed'")).total;

    res.json({ totalRequests: totals, pending, accepted, volumeFcfa: volume });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load stats.' });
  }
});

// "Transactions récentes" — recent accepted/completed requests. Note: Artisans237
// doesn't set or store a price for the job itself (that's agreed directly between
// customer and provider per the Terms of Service), so this shows job status rather
// than an invoice amount. Confirmed MoMo subscription payments are the real "volume".
router.get('/transactions', async (req, res) => {
  try {
    const rows = await all(`
      SELECT sr.id, sr.category, sr.status, sr.created_at, sr.accepted_at,
             cu.full_name AS customer_name, pu.full_name AS provider_name
      FROM service_requests sr
      JOIN users cu ON cu.id = sr.customer_id
      LEFT JOIN users pu ON pu.id = sr.provider_id
      ORDER BY sr.created_at DESC
      LIMIT 25
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load transactions.' });
  }
});

router.get('/providers', async (req, res) => {
  try {
    const rows = await all(`
      SELECT u.id, u.full_name, u.phone, u.email, u.town, u.quarter, u.created_at,
             p.category, p.is_verified, p.subscription_active
      FROM users u JOIN provider_profiles p ON p.user_id = u.id
      ORDER BY u.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load providers.' });
  }
});

router.post('/providers/:id/verify', async (req, res) => {
  try {
    await run('UPDATE provider_profiles SET is_verified = 1 WHERE user_id = ?', [req.params.id]);
    res.json({ message: 'Provider marked as verified.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update provider.' });
  }
});

router.post('/providers/:id/unverify', async (req, res) => {
  try {
    await run('UPDATE provider_profiles SET is_verified = 0 WHERE user_id = ?', [req.params.id]);
    res.json({ message: 'Provider verification removed.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update provider.' });
  }
});

module.exports = router;
