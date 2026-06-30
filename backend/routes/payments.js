// routes/payments.js — Artisans237
// MANUAL MTN Mobile Money flow (point #1 + the earlier agreed approach):
// no MTN merchant API needed yet. The provider sends money to your own MTN
// MoMo number, then submits the MTN SMS confirmation reference here. An
// admin checks their own phone for the matching SMS and confirms or rejects.

const express = require('express');
const { all, get, run } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

const SUBSCRIPTION_FCFA = parseInt(process.env.SUBSCRIPTION_PRICE_FCFA || '2000', 10);
const SUBSCRIPTION_DAYS = parseInt(process.env.SUBSCRIPTION_DAYS || '30', 10);
const TRIAL_DAYS = parseInt(process.env.PROVIDER_TRIAL_DAYS || '14', 10);
const MOMO_NUMBER = process.env.MTN_MOMO_RECEIVING_NUMBER || 'Not set yet — add MTN_MOMO_RECEIVING_NUMBER in .env';

// Public — used by pricing.html so it doesn't need login to show terms.
router.get('/plan', (req, res) => {
  res.json({
    trialDays: TRIAL_DAYS,
    subscriptionFcfa: SUBSCRIPTION_FCFA,
    subscriptionDays: SUBSCRIPTION_DAYS,
    momoNumber: MOMO_NUMBER,
  });
});

// Provider submits proof of a manual MTN MoMo payment.
router.post('/submit', requireAuth, requireRole('provider'), async (req, res) => {
  try {
    const { momoReference, momoPayerNumber, amountFcfa } = req.body;
    if (!momoReference || !momoPayerNumber || !amountFcfa) {
      return res.status(400).json({ error: 'MTN reference, payer number, and amount are required.' });
    }

    await run(`
      INSERT INTO manual_payments (provider_id, momo_reference, momo_payer_number, amount_fcfa, status, submitted_at)
      VALUES (?, ?, ?, ?, 'pending', ?)
    `, [req.user.id, momoReference, momoPayerNumber, amountFcfa, Date.now()]);

    res.status(201).json({
      message: `Payment submitted for review. Once confirmed by an admin, your account stays active for ${SUBSCRIPTION_DAYS} more days.`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not submit payment. Please try again.' });
  }
});

// Provider checks their own payment history.
router.get('/mine', requireAuth, requireRole('provider'), async (req, res) => {
  try {
    const rows = await all('SELECT * FROM manual_payments WHERE provider_id = ? ORDER BY submitted_at DESC', [req.user.id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load payment history.' });
  }
});

// --- Admin side ---

router.get('/pending', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const rows = await all(`
      SELECT mp.*, u.full_name, u.phone
      FROM manual_payments mp
      JOIN users u ON u.id = mp.provider_id
      WHERE mp.status = 'pending'
      ORDER BY mp.submitted_at ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load pending payments.' });
  }
});

router.post('/:id/confirm', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const payment = await get("SELECT * FROM manual_payments WHERE id = ? AND status = 'pending'", [req.params.id]);
    if (!payment) return res.status(404).json({ error: 'Payment not found or already reviewed.' });

    const now = Date.now();
    const expires = now + SUBSCRIPTION_DAYS * 24 * 60 * 60 * 1000;

    await run("UPDATE manual_payments SET status = 'confirmed', reviewed_at = ? WHERE id = ?", [now, payment.id]);
    await run('UPDATE provider_profiles SET subscription_active = 1, subscription_expires = ? WHERE user_id = ?',
      [expires, payment.provider_id]);

    res.json({ message: 'Payment confirmed. Provider account activated.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not confirm payment.' });
  }
});

router.post('/:id/reject', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { note } = req.body;
    const result = await run("UPDATE manual_payments SET status = 'rejected', reviewed_at = ?, admin_note = ? WHERE id = ? AND status = 'pending'",
      [Date.now(), note || null, req.params.id]);

    if (result.changes === 0) return res.status(404).json({ error: 'Payment not found or already reviewed.' });
    res.json({ message: 'Payment marked as rejected.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not reject payment.' });
  }
});

module.exports = router;
