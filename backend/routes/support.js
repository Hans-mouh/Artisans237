// routes/support.js — Artisans237
// A simple support channel: customers/providers leave a message for the
// admin from their dashboard; the admin sees all of them (with sender
// context) in the admin dashboard and can reply or mark resolved.

const express = require('express');
const { all, get, run } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Customer or provider submits a message.
router.post('/', requireAuth, requireRole('customer', 'provider'), async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Please write a message before sending.' });
    }

    await run(
      'INSERT INTO support_messages (user_id, message, status, created_at) VALUES (?, ?, \'open\', ?)',
      [req.user.id, message.trim(), Date.now()]
    );

    res.status(201).json({ message: 'Your message has been sent to the admin.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not send your message. Please try again.' });
  }
});

// Customer or provider sees their own message history, including any reply.
router.get('/mine', requireAuth, requireRole('customer', 'provider'), async (req, res) => {
  try {
    const rows = await all(
      'SELECT * FROM support_messages WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load your messages.' });
  }
});

// --- Admin side ---

router.get('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const rows = await all(`
      SELECT sm.*, u.full_name, u.email, u.phone, u.role AS sender_role
      FROM support_messages sm
      JOIN users u ON u.id = sm.user_id
      ORDER BY sm.status ASC, sm.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load support messages.' });
  }
});

router.post('/:id/reply', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { reply } = req.body;
    if (!reply || !reply.trim()) {
      return res.status(400).json({ error: 'Please write a reply before sending.' });
    }

    const result = await run(
      "UPDATE support_messages SET admin_reply = ?, status = 'resolved', replied_at = ? WHERE id = ?",
      [reply.trim(), Date.now(), req.params.id]
    );
    if (result.changes === 0) return res.status(404).json({ error: 'Message not found.' });

    res.json({ message: 'Reply sent.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not send reply.' });
  }
});

router.post('/:id/reopen', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const result = await run("UPDATE support_messages SET status = 'open' WHERE id = ?", [req.params.id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Message not found.' });
    res.json({ message: 'Marked as open again.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update message.' });
  }
});

module.exports = router;
