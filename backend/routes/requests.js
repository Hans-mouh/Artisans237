// routes/requests.js — Artisans237
// Point #2: customer leaves their contact info; it's only shown to the
// provider once that provider accepts the request (and the provider's
// phone becomes visible to the customer at the same moment).

const express = require('express');
const { all, get, run } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Customer creates a service request.
router.post('/', requireAuth, requireRole('customer'), async (req, res) => {
  try {
    const { category, town, quarter, description, contactPhone, contactWhatsapp } = req.body;
    if (!category || !town || !quarter || !contactPhone) {
      return res.status(400).json({ error: 'Category, location, and a contact phone are required.' });
    }

    const result = await run(`
      INSERT INTO service_requests (customer_id, category, town, quarter, description, contact_phone, contact_whatsapp, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'open', ?)
    `, [req.user.id, category, town, quarter, description || null, contactPhone, contactWhatsapp || null, Date.now()]);

    res.status(201).json({ message: 'Request posted. Providers in your area can now see and accept it.', requestId: result.lastInsertRowid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not post request. Please try again.' });
  }
});

// Providers browse open requests — contact details are withheld until accepted.
router.get('/open', requireAuth, requireRole('provider'), async (req, res) => {
  try {
    const provider = await get(
      'SELECT category, town, quarter FROM provider_profiles p JOIN users u ON u.id = p.user_id WHERE p.user_id = ?',
      [req.user.id]
    );

    const rows = await all(`
      SELECT id, category, town, quarter, description, created_at
      FROM service_requests
      WHERE status = 'open' AND category = ?
      ORDER BY created_at DESC
    `, [provider ? provider.category : '']);

    res.json(rows); // no contact_phone / contact_whatsapp here on purpose
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load requests.' });
  }
});

// Provider accepts a request — this is the moment contact info unlocks both ways.
router.post('/:id/accept', requireAuth, requireRole('provider'), async (req, res) => {
  try {
    const reqRow = await get("SELECT * FROM service_requests WHERE id = ? AND status = 'open'", [req.params.id]);
    if (!reqRow) return res.status(404).json({ error: 'This request is no longer available.' });

    await run("UPDATE service_requests SET provider_id = ?, status = 'accepted', accepted_at = ? WHERE id = ?",
      [req.user.id, Date.now(), reqRow.id]);

    const customer = await get('SELECT full_name, phone FROM users WHERE id = ?', [reqRow.customer_id]);
    const provider = await get('SELECT full_name, phone FROM users WHERE id = ?', [req.user.id]);

    res.json({
      message: 'Request accepted. Contact details are now shared so you can discuss the job.',
      customerContact: { name: customer.full_name, phone: customer.phone, whatsapp: reqRow.contact_whatsapp },
      providerContact: { name: provider.full_name, phone: provider.phone },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not accept request. Please try again.' });
  }
});

// Customer views their own requests — once accepted, the provider's contact appears too.
router.get('/mine', requireAuth, requireRole('customer'), async (req, res) => {
  try {
    const rows = await all(`
      SELECT sr.*, u.full_name AS provider_name, u.phone AS provider_phone
      FROM service_requests sr
      LEFT JOIN users u ON u.id = sr.provider_id
      WHERE sr.customer_id = ?
      ORDER BY sr.created_at DESC
    `, [req.user.id]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load your requests.' });
  }
});

// Either party on an accepted request can mark it completed — this is what
// unlocks the ability for both sides to leave a review of each other.
router.post('/:id/complete', requireAuth, requireRole('customer', 'provider'), async (req, res) => {
  try {
    const reqRow = await get("SELECT * FROM service_requests WHERE id = ?", [req.params.id]);
    if (!reqRow) return res.status(404).json({ error: 'Request not found.' });
    const isParty = reqRow.customer_id === req.user.id || reqRow.provider_id === req.user.id;
    if (!isParty) return res.status(403).json({ error: 'You are not part of this request.' });
    if (reqRow.status !== 'accepted') {
      return res.status(400).json({ error: 'Only accepted requests can be marked completed.' });
    }

    await run("UPDATE service_requests SET status = 'completed' WHERE id = ?", [reqRow.id]);
    res.json({ message: 'Marked as completed. You can now leave a review.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not mark request as completed.' });
  }
});

// Provider's own accepted/completed requests — needed so they can mark jobs
// done and review the customer afterward (mirrors /requests/mine for customers).
router.get('/accepted-mine', requireAuth, requireRole('provider'), async (req, res) => {
  try {
    const rows = await all(`
      SELECT sr.*, u.full_name AS customer_name, u.phone AS customer_phone
      FROM service_requests sr
      JOIN users u ON u.id = sr.customer_id
      WHERE sr.provider_id = ? AND sr.status IN ('accepted', 'completed')
      ORDER BY sr.accepted_at DESC
    `, [req.user.id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load your accepted requests.' });
  }
});

module.exports = router;
