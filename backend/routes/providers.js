// routes/providers.js — Artisans237
const express = require('express');
const { all, get, run } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

const CATEGORIES = [
  { id: 'plumber', label_en: 'Plumber', label_fr: 'Plombier' },
  { id: 'electrician', label_en: 'Electrician', label_fr: 'Électricien' },
  { id: 'mechanic', label_en: 'Mechanic', label_fr: 'Mécanicien' },
  { id: 'carpenter', label_en: 'Carpenter', label_fr: 'Menuisier' },
  { id: 'painter', label_en: 'Painter', label_fr: 'Peintre' },
  { id: 'cleaner', label_en: 'Cleaner', label_fr: 'Agent de nettoyage' },
  { id: 'mason', label_en: 'Mason', label_fr: 'Maçon' },
  { id: 'tailor', label_en: 'Tailor', label_fr: 'Tailleur' },
];

router.get('/categories', async (req, res) => {
  try {
    const now = Date.now();
    const rows = await all(`
      SELECT p.category, p.trial_start, p.trial_days, p.subscription_active
      FROM provider_profiles p JOIN users u ON u.id = p.user_id
      WHERE u.role = 'provider' AND u.is_email_verified = 1
    `);

    const counts = {};
    rows.forEach(r => {
      const trialEnd = r.trial_start + r.trial_days * 24 * 60 * 60 * 1000;
      const active = now < trialEnd || r.subscription_active;
      if (active) counts[r.category] = (counts[r.category] || 0) + 1;
    });

    const predefinedIds = new Set(CATEGORIES.map(c => c.id));
    const customCategories = Object.keys(counts)
      .filter(cat => !predefinedIds.has(cat))
      .map(cat => ({ id: cat, label_en: cat, label_fr: cat, custom: true }));

    const allCats = [...CATEGORIES, ...customCategories].map(c => ({ ...c, count: counts[c.id] || 0 }));
    res.json(allCats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load categories.' });
  }
});

// Public provider search — filter by category and/or town/quarter.
router.get('/', async (req, res) => {
  try {
    const { category, town, quarter, q } = req.query;

    let sql = `
      SELECT u.id, u.full_name, u.phone, u.town, u.quarter, u.custom_location,
             p.category, p.bio, p.is_verified, p.trial_start, p.trial_days, p.subscription_active
      FROM users u
      JOIN provider_profiles p ON p.user_id = u.id
      WHERE u.role = 'provider' AND u.is_email_verified = 1
    `;
    const params = [];

    if (category) { sql += ' AND p.category = ?'; params.push(category); }
    if (town) { sql += ' AND u.town = ?'; params.push(town); }
    if (quarter) { sql += ' AND u.quarter = ?'; params.push(quarter); }
    if (q) {
      // Free-text search across trade, provider name, and bio — this is what
      // actually makes the hero "search bar" search something, rather than
      // just being three dropdowns and a button.
      sql += ' AND (p.category LIKE ? OR u.full_name LIKE ? OR p.bio LIKE ?)';
      const like = `%${q}%`;
      params.push(like, like, like);
    }

    sql += ' ORDER BY p.is_verified DESC, u.full_name ASC';

    const rows = await all(sql, params);
    const ids = rows.map(r => r.id);

    // Pull approved-review aggregates for all returned providers in one query
    // instead of one query per provider.
    let ratingsById = {};
    if (ids.length) {
      const placeholders = ids.map(() => '?').join(',');
      const ratingRows = await all(`
        SELECT reviewee_id, AVG(rating) AS avg_rating, COUNT(*) AS review_count
        FROM reviews
        WHERE status = 'approved' AND reviewee_id IN (${placeholders})
        GROUP BY reviewee_id
      `, ids);
      ratingRows.forEach(r => { ratingsById[r.reviewee_id] = r; });
    }

    const now = Date.now();
    const providers = rows.map(r => {
      const trialEnd = r.trial_start + r.trial_days * 24 * 60 * 60 * 1000;
      const onTrial = now < trialEnd;
      const ratingInfo = ratingsById[r.id];
      return {
        id: r.id,
        name: r.full_name,
        phone: r.phone,
        town: r.town,
        quarter: r.quarter,
        customLocation: r.custom_location,
        category: r.category,
        bio: r.bio,
        verified: !!r.is_verified,
        activeStatus: onTrial ? 'trial' : (r.subscription_active ? 'subscribed' : 'expired'),
        trialDaysLeft: onTrial ? Math.ceil((trialEnd - now) / (24 * 60 * 60 * 1000)) : 0,
        avgRating: ratingInfo ? Math.round(ratingInfo.avg_rating * 10) / 10 : null,
        reviewCount: ratingInfo ? ratingInfo.review_count : 0,
      };
    }).filter(p => p.activeStatus !== 'expired'); // hide providers whose trial AND subscription have lapsed

    res.json(providers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load providers.' });
  }
});

// A provider can set/update their own custom location (point #4: not on the list).
router.patch('/me/location', requireAuth, requireRole('provider'), async (req, res) => {
  try {
    const { town, quarter, customLocation } = req.body;
    await run('UPDATE users SET town = ?, quarter = ?, custom_location = ? WHERE id = ?',
      [town || null, quarter || null, customLocation || null, req.user.id]);
    res.json({ message: 'Location updated.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update location.' });
  }
});

// Lets a provider see their own trial/subscription countdown clearly.
router.get('/me/status', requireAuth, requireRole('provider'), async (req, res) => {
  try {
    const p = await get('SELECT * FROM provider_profiles WHERE user_id = ?', [req.user.id]);
    if (!p) return res.status(404).json({ error: 'Provider profile not found.' });

    const now = Date.now();
    const trialEnd = p.trial_start + p.trial_days * 24 * 60 * 60 * 1000;
    const onTrial = now < trialEnd;
    const subActive = !!p.subscription_active && p.subscription_expires && now < p.subscription_expires;

    res.json({
      onTrial,
      trialDaysLeft: onTrial ? Math.ceil((trialEnd - now) / (24 * 60 * 60 * 1000)) : 0,
      subscriptionActive: subActive,
      subscriptionDaysLeft: subActive ? Math.ceil((p.subscription_expires - now) / (24 * 60 * 60 * 1000)) : 0,
      listed: onTrial || subActive,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load status.' });
  }
});

module.exports = router;
