// server.js — Artisans237 backend entrypoint
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('node:path');

const { initDb } = require('./db');
const authRoutes = require('./routes/auth');
const providerRoutes = require('./routes/providers');
const requestRoutes = require('./routes/requests');
const paymentRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');
const supportRoutes = require('./routes/support');
const reviewRoutes = require('./routes/reviews');

const app = express();
const PORT = process.env.PORT || 8080;

// Security headers. CSP is relaxed for inline <script>/<style> since the
// frontend uses plain inline scripts throughout rather than a bundler —
// tightening this later means moving to external script files + nonces.
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'script-src': ["'self'", "'unsafe-inline'"],
      'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
      'img-src': ["'self'", 'data:'],
    },
  },
}));
app.use(cors());
app.use(express.json());

// Brute-force protection on login/register specifically — these are the
// endpoints most worth rate-limiting on a real, publicly-reachable site.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Too many attempts. Please wait a few minutes and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// API
app.use('/api/auth', authRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Serve the frontend (so the whole site — front + back — can live on one
// free host instead of needing separate accounts on different platforms).
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
app.use(express.static(FRONTEND_DIR));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'), (err) => err && next(err));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on our side. Please try again.' });
});

async function start() {
  await initDb(); // creates tables + seeds admin on first run; awaited before accepting traffic
  app.listen(PORT, () => {
    console.log(`Artisans237 running on port ${PORT}`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
