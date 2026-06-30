// app.js — Artisans237 shared frontend logic

// Global error catcher — surfaces silent JS errors in the console during testing
// so you can see exactly why something (like the translation toggle) stopped working.
window.addEventListener('error', function(e) {
  console.error('[Artisans237 JS Error]', e.message, 'in', e.filename, 'line', e.lineno);
});
window.addEventListener('unhandledrejection', function(e) {
  console.error('[Artisans237 Unhandled Promise]', e.reason);
});

// If frontend and backend are deployed together on one host (the default,
// recommended setup — see DEPLOY.md), this relative path just works.
// If you deploy the frontend separately (e.g. Netlify) from the backend
// (e.g. Render), set window.ARTISANS237_API_BASE = 'https://your-backend.onrender.com/api'
// in a small <script> tag before app.js loads — no other code needs to change.
const API_BASE = window.ARTISANS237_API_BASE || '/api';

function getToken() { return localStorage.getItem('artisans237_token'); }
function getUser() { try { return JSON.parse(localStorage.getItem('artisans237_user')); } catch { return null; } }
function setSession(token, user) {
  localStorage.setItem('artisans237_token', token);
  localStorage.setItem('artisans237_user', JSON.stringify(user));
}
function clearSession() {
  localStorage.removeItem('artisans237_token');
  localStorage.removeItem('artisans237_user');
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch {
    // This is a network-level failure, not an API error — almost always means
    // the backend isn't running, or this page was opened through a different
    // server (e.g. Live Server) than the one serving /api.
    throw new Error('Could not reach the server. Make sure the backend (node server.js) is running, and that you opened this site through it — not through a separate Live Server port.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong.');
  return data;
}

// Populates a town <select>, and wires it to a quarter <select> + an
// "Other (type your area)" free-text fallback (point #4).
function wireLocationDropdowns(townSelectEl, quarterSelectEl, otherInputEl) {
  Object.keys(window.TOWNS_DATA).sort().forEach(town => {
    const opt = document.createElement('option');
    opt.value = town; opt.textContent = town;
    townSelectEl.appendChild(opt);
  });

  function refreshQuarters() {
    quarterSelectEl.innerHTML = '<option value="">Select neighborhood / Quartier</option>';
    const quarters = window.TOWNS_DATA[townSelectEl.value] || [];
    quarters.sort().forEach(q => {
      const opt = document.createElement('option');
      opt.value = q; opt.textContent = q;
      quarterSelectEl.appendChild(opt);
    });
    const otherOpt = document.createElement('option');
    otherOpt.value = '__other__';
    otherOpt.textContent = "Other (type your area) / Autre (saisir)";
    quarterSelectEl.appendChild(otherOpt);
  }

  townSelectEl.addEventListener('change', refreshQuarters);

  quarterSelectEl.addEventListener('change', () => {
    if (otherInputEl) {
      otherInputEl.style.display = quarterSelectEl.value === '__other__' ? 'block' : 'none';
    }
  });

  if (townSelectEl.value) refreshQuarters();
}

function requireLoginOrRedirect(role) {
  const user = getUser();
  if (!user || !getToken()) {
    window.location.href = 'login.html';
    return null;
  }
  if (role && user.role !== role) {
    alert('This page is only available to ' + role + ' accounts.');
    window.location.href = 'index.html';
    return null;
  }
  return user;
}
