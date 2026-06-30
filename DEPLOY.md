# Hosting Artisans237 — free, permanent, and secured

Verified against current provider terms as of June 2026. Free tiers change
often — if something here looks different on the actual provider site,
trust the provider's site over this document and let Claude know so it can
be updated.

## The plan: one host for compute, one for data

**Backend (compute): Render — free web service.**
Genuinely free, automatic HTTPS, deploys straight from GitHub. The one
real trade-off: it sleeps after 15 minutes with no traffic, and the next
visitor waits ~30–60 seconds for it to wake up. Acceptable for an
early-stage real launch; worth upgrading to a paid instance (~$7/mo) later
specifically to remove that wait once you have steady traffic.

**Database (data): Turso — free tier.**
A hosted, SQLite-compatible database. Unlike Render's own free database
(which expires after 30 days), Turso's free tier is genuinely persistent —
5GB storage, 100 databases, no credit card, no expiry timer. This is what
makes "permanent" actually true: your real customer and provider data
survives every Render restart, redeploy, and cold start, because it isn't
sitting on Render's disk at all.

The backend code (`db.js`) already supports both modes:
- No `TURSO_*` env vars set → uses a local file automatically (zero setup
  for development on your own machine).
- `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` set → talks to your real Turso
  database. This is what you set on Render for production.

## Step-by-step

### 1. Create your free Turso database
1. Go to turso.tech, sign up free (no card required).
2. Create a database (via their dashboard, or the `turso` CLI if you're
   comfortable with a terminal: `turso db create artisans237`).
3. Get its connection URL and an auth token (dashboard has both, or
   `turso db show artisans237 --url` and `turso db tokens create artisans237`).
4. Keep both somewhere safe — you'll paste them into Render in step 3.

### 2. Push the project to GitHub
Standard GitHub Desktop flow you've already used before — commit the whole
`artisans237/` folder (both `backend/` and `frontend/`), push to a new repo.

### 3. Deploy on Render
1. render.com → New → Web Service → connect your GitHub repo.
2. Root directory: `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables (Render dashboard → Environment), using
   `backend/.env.example` as your checklist:
   - `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` — from step 1
   - `JWT_SECRET` — a long random string (e.g. generate one at
     random.org or run `openssl rand -hex 32` if you have it)
   - `GMAIL_USER`, `GMAIL_APP_PASSWORD` — for email verification
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD` — your real admin login
   - `APP_URL` — set this to your actual Render URL once you have it
     (e.g. `https://artisans237.onrender.com`)
   - `MTN_MOMO_RECEIVING_NUMBER` — your real MoMo number
6. Deploy. First boot creates your tables in Turso and seeds your admin
   account automatically — same as it did locally.

Your whole site — frontend and backend together — is now live at one free
URL, with data that survives restarts.

## If you'd rather split frontend (Netlify) and backend (Render) anyway

The single-app setup above is simpler and already tested end-to-end. But if
you have a reason to keep the frontend on Netlify specifically, it's still
possible — add one line near the top of each HTML page's `<head>`, before
`app.js` loads:

```html
<script>window.ARTISANS237_API_BASE = 'https://your-backend.onrender.com/api';</script>
```

Without this line, a Netlify-hosted frontend will silently fail every API
call (registration, login, the provider list — everything) because it'll
try to reach `/api` on Netlify's own domain, where no backend exists.

## What "secured" means here, concretely

Already built into the code:
- Passwords hashed with bcrypt, never stored in plain text
- JWT-based sessions, not raw passwords sent on every request
- HTTP security headers via `helmet` (HSTS, no-sniff, frame protection, etc.)
- Rate limiting on `/api/auth/login` and `/api/auth/register` — 30 attempts
  per 15 minutes per IP, to blunt brute-force and spam-registration attempts
- HTTPS automatically, for free, via Render — no certificate to manage

Worth doing yourself before real money moves through this:
- **Change `ADMIN_PASSWORD` immediately** after your first real login
- Use a genuinely random `JWT_SECRET` (not the placeholder text)
- Don't commit your real `.env` file to GitHub (it's already gitignored
  by convention — double check before your first push)

## What "free" does *not* cover

To be fully upfront: a **custom domain** (e.g. `artisans237.com` instead of
`artisans237.onrender.com`) is not free — domains cost roughly $10–15/year
from any registrar, separate from hosting. Everything else in this plan —
compute, database, HTTPS, security headers — is free indefinitely under
current terms, not a trial.
