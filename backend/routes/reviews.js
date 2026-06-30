// routes/reviews.js — Artisans237
// Reviews are only possible between a customer and provider who actually
// completed a job together (tied to a service_requests row with status
// 'completed'). Either side can review the other. New reviews start
// 'pending' and only count toward public ratings once an admin approves
// them — same trust pattern as provider verification.

const express = require('express');
const { all, get, run } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Submit a review for a completed job. Works for both directions:
// a customer reviewing their provider, or a provider reviewing their customer.
router.post('/', requireAuth, requireRole('customer', 'provider'), async (req, res) => {
  try {
    const { requestId, rating, comment } = req.body;
    const ratingNum = parseInt(rating, 10);
    if (!requestId || !ratingNum || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: 'A request and a rating from 1 to 5 are required.' });
    }

    const reqRow = await get('SELECT * FROM service_requests WHERE id = ?', [requestId]);
    if (!reqRow) return res.status(404).json({ error: 'Request not found.' });
    if (reqRow.status !== 'completed') {
      return res.status(400).json({ error: 'You can only review a job once it has been marked completed.' });
    }

    let revieweeId;
    if (req.user.role === 'customer' && reqRow.customer_id === req.user.id) {
      revieweeId = reqRow.provider_id;
    } else if (req.user.role === 'provider' && reqRow.provider_id === req.user.id) {
      revieweeId = reqRow.customer_id;
    } else {
      return res.status(403).json({ error: 'You were not part of this job.' });
    }

    const existing = await get('SELECT id FROM reviews WHERE request_id = ? AND reviewer_id = ?', [requestId, req.user.id]);
    if (existing) return res.status(409).json({ error: 'You already reviewed this job.' });

    await run(`
      INSERT INTO reviews (request_id, reviewer_id, reviewee_id, reviewer_role, rating, comment, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)
    `, [requestId, req.user.id, revieweeId, req.user.role, ratingNum, (comment || '').trim() || null, Date.now()]);

    res.status(201).json({ message: 'Thanks! Your review will appear once an admin approves it.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not submit your review. Please try again.' });
  }
});

// Reviews I've already written — used by dashboards to hide the review
// button on jobs already reviewed instead of letting someone submit twice.
router.get('/mine', requireAuth, requireRole('customer', 'provider'), async (req, res) => {
  try {
    const rows = await all('SELECT request_id, status FROM reviews WHERE reviewer_id = ?', [req.user.id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load your reviews.' });
  }
});

// Public — approved reviews for one provider, plus their average rating.
router.get('/provider/:id', async (req, res) => {
  try {
    const rows = await all(`
      SELECT r.rating, r.comment, r.created_at, u.full_name AS reviewer_name
      FROM reviews r JOIN users u ON u.id = r.reviewer_id
      WHERE r.reviewee_id = ? AND r.status = 'approved'
      ORDER BY r.created_at DESC
    `, [req.params.id]);

    const count = rows.length;
    const average = count ? Math.round((rows.reduce((sum, r) => sum + r.rating, 0) / count) * 10) / 10 : null;

    res.json({ average, count, reviews: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load reviews.' });
  }
});

// Public — a handful of recent approved reviews platform-wide, for the
// homepage testimonials section (replaces the old empty placeholder).
router.get('/recent', async (req, res) => {
  try {
    const rows = await all(`
      SELECT r.rating, r.comment, r.reviewer_role, u.full_name AS reviewer_name, ru.full_name AS reviewee_name
      FROM reviews r
      JOIN users u ON u.id = r.reviewer_id
      JOIN users ru ON ru.id = r.reviewee_id
      WHERE r.status = 'approved' AND r.comment IS NOT NULL AND r.comment != ''
      ORDER BY r.created_at DESC
      LIMIT 6
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load reviews.' });
  }
});

// --- Admin moderation ---

router.get('/pending', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const rows = await all(`
      SELECT r.*, ru1.full_name AS reviewer_name, ru2.full_name AS reviewee_name
      FROM reviews r
      JOIN users ru1 ON ru1.id = r.reviewer_id
      JOIN users ru2 ON ru2.id = r.reviewee_id
      WHERE r.status = 'pending'
      ORDER BY r.created_at ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load pending reviews.' });
  }
});

router.post('/:id/approve', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const result = await run("UPDATE reviews SET status = 'approved' WHERE id = ? AND status = 'pending'", [req.params.id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Review not found or already reviewed.' });
    res.json({ message: 'Review approved and now public.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not approve review.' });
  }
});

router.post('/:id/reject', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const result = await run("UPDATE reviews SET status = 'rejected' WHERE id = ? AND status = 'pending'", [req.params.id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Review not found or already reviewed.' });
    res.json({ message: 'Review rejected.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not reject review.' });
  }
});

module.exports = router;
