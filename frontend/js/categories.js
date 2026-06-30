// categories.js — Artisans237
// Original hand-drawn SVG icons per trade (no stock photos — avoids licensing
// issues and lets the icons match the site's amber/charcoal palette exactly).
// Cards show sub-service tags + a live count of active providers, matching
// the "Voir les pros" card pattern from the original site design.

const CATEGORY_ICONS = {
  plumber: `<svg viewBox="0 0 64 64" fill="none"><path d="M14 40 L24 30 L34 40 L44 30" stroke="#2F6FED" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><rect x="38" y="14" width="12" height="12" rx="2" stroke="#E8703A" stroke-width="3"/><path d="M44 26 V34" stroke="#E8703A" stroke-width="3"/><circle cx="16" cy="44" r="4" fill="#2F6FED"/></svg>`,
  electrician: `<svg viewBox="0 0 64 64" fill="none"><path d="M34 8 L18 34 H30 L26 56 L48 28 H34 L40 8 Z" fill="#2F6FED"/></svg>`,
  mechanic: `<svg viewBox="0 0 64 64" fill="none"><circle cx="22" cy="44" r="8" stroke="#E8703A" stroke-width="3"/><circle cx="46" cy="44" r="8" stroke="#E8703A" stroke-width="3"/><path d="M14 30 H30 L36 20 H50" stroke="#2F6FED" stroke-width="4" stroke-linecap="round"/><path d="M30 20 L36 30" stroke="#2F6FED" stroke-width="4" stroke-linecap="round"/></svg>`,
  carpenter: `<svg viewBox="0 0 64 64" fill="none"><rect x="10" y="46" width="44" height="6" rx="2" fill="#8a5a2b"/><path d="M16 46 L40 14 L46 18 L24 46 Z" fill="#2F6FED"/><circle cx="42" cy="16" r="3" fill="#E8703A"/></svg>`,
  painter: `<svg viewBox="0 0 64 64" fill="none"><rect x="22" y="10" width="20" height="14" rx="2" fill="#E8703A"/><rect x="26" y="24" width="12" height="8" fill="#E8703A"/><path d="M30 32 V50 Q30 56 36 56 Q42 56 42 50 V32" fill="#2F6FED"/></svg>`,
  cleaner: `<svg viewBox="0 0 64 64" fill="none"><rect x="14" y="36" width="20" height="20" rx="3" stroke="#E8703A" stroke-width="3"/><path d="M44 14 L50 38" stroke="#8a5a2b" stroke-width="3" stroke-linecap="round"/><path d="M40 38 L54 38 L50 50 L36 50 Z" fill="#2F6FED"/></svg>`,
  mason: `<svg viewBox="0 0 64 64" fill="none"><rect x="12" y="36" width="14" height="10" fill="#2F6FED"/><rect x="28" y="36" width="14" height="10" fill="#E8703A"/><rect x="44" y="36" width="10" height="10" fill="#2F6FED"/><rect x="12" y="48" width="14" height="10" fill="#E8703A"/><rect x="28" y="48" width="14" height="10" fill="#2F6FED"/><rect x="44" y="48" width="10" height="10" fill="#E8703A"/></svg>`,
  tailor: `<svg viewBox="0 0 64 64" fill="none"><circle cx="22" cy="42" r="8" stroke="#2F6FED" stroke-width="3"/><circle cx="42" cy="42" r="8" stroke="#E8703A" stroke-width="3"/><path d="M16 18 L48 50" stroke="#EDEDEE" stroke-width="2"/></svg>`,
};

const CATEGORY_LABELS = {
  plumber: { en: 'Plumber', fr: 'Plombier' },
  electrician: { en: 'Electrician', fr: 'Électricien' },
  mechanic: { en: 'Mechanic', fr: 'Mécanicien' },
  carpenter: { en: 'Carpenter', fr: 'Menuisier' },
  painter: { en: 'Painter', fr: 'Peintre' },
  cleaner: { en: 'Cleaner', fr: 'Agent de nettoyage' },
  mason: { en: 'Mason', fr: 'Maçon' },
  tailor: { en: 'Tailor', fr: 'Tailleur' },
};

// Sub-service tags shown under each category name (your earlier screenshot's pattern).
const CATEGORY_TAGS = {
  plumber: { en: ['Leak repair', 'Bathroom install', 'Drain unblocking'], fr: ['Réparation de fuites', 'Installation sanitaire', 'Débouchage'] },
  electrician: { en: ['Wiring', 'Electrical panels', 'Outage repair'], fr: ['Câblage', 'Tableaux électriques', 'Dépannage panne'] },
  mechanic: { en: ['Oil change', 'Brakes', 'Diagnostics'], fr: ['Vidange moteur', 'Freins', 'Diagnostic panne'] },
  carpenter: { en: ['Custom furniture', 'Doors & windows', 'Wood repair'], fr: ['Meubles sur mesure', 'Portes & fenêtres', 'Réparation bois'] },
  painter: { en: ['Interior', 'Exterior', 'Decorative finishes'], fr: ['Intérieur', 'Extérieur', 'Finitions décoratives'] },
  cleaner: { en: ['House cleaning', 'Office cleaning', 'Post-construction'], fr: ['Nettoyage maison', 'Nettoyage bureaux', 'Après chantier'] },
  mason: { en: ['Construction', 'Renovation', 'Roof waterproofing'], fr: ['Construction', 'Rénovation', 'Étanchéité toiture'] },
  tailor: { en: ['Custom clothing', 'Alterations', 'Traditional wear'], fr: ['Vêtements sur mesure', 'Retouches', 'Tenues traditionnelles'] },
};

const GENERIC_ICON = `<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="20" stroke="#2F6FED" stroke-width="3"/><path d="M24 32 L40 32 M32 24 L32 40" stroke="#E8703A" stroke-width="3" stroke-linecap="round"/></svg>`;

// Used if the API call fails (e.g. backend briefly unreachable) so the homepage
// always shows the 8 known trades instead of an empty section.
const DEFAULT_CATEGORIES = Object.keys(CATEGORY_LABELS).map(id => ({
  id, label_en: CATEGORY_LABELS[id].en, label_fr: CATEGORY_LABELS[id].fr, count: 0,
}));

function pluralizeCount(n, lang) {
  if (lang === 'fr') return n === 1 ? 'professionnel inscrit' : 'professionnels inscrits';
  return n === 1 ? 'provider registered' : 'providers registered';
}

// categories: array from GET /providers/categories — [{id, label_en, label_fr, count, custom?}]
function renderCategoryGrid(containerEl, lang = 'en', categories = []) {
  containerEl.innerHTML = '';
  categories.forEach((cat, i) => {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.style.animationDelay = `${(i % 3) * 0.3}s`;
    const count = cat.count || 0;
    const icon = CATEGORY_ICONS[cat.id] || GENERIC_ICON;
    const label = cat.custom ? cat.id : (CATEGORY_LABELS[cat.id] ? CATEGORY_LABELS[cat.id][lang] : cat.id);
    const tags = (!cat.custom && CATEGORY_TAGS[cat.id]) ? (CATEGORY_TAGS[cat.id][lang] || CATEGORY_TAGS[cat.id].en) : [];

    card.innerHTML = `
      <div class="glow"></div>
      <div class="cat-head">
        <div class="icon-wrap">${icon}</div>
        <div class="label">${label}</div>
      </div>
      ${tags.length ? `<div class="cat-tags">${tags.map(t => `<span class="cat-tag">${t}</span>`).join('')}</div>` : ''}
      <div class="cat-footer">
        <span class="cat-count">${count} ${pluralizeCount(count, lang)}</span>
        <button class="btn btn-primary cat-cta">${lang === 'fr' ? 'Voir les pros' : 'View pros'}</button>
      </div>
    `;
    card.addEventListener('click', () => {
      window.location.href = `providers.html?category=${encodeURIComponent(cat.id)}`;
    });
    containerEl.appendChild(card);
  });
}

window.renderCategoryGrid = renderCategoryGrid;
window.CATEGORY_LABELS = CATEGORY_LABELS;
window.CATEGORY_TAGS = CATEGORY_TAGS;
window.DEFAULT_CATEGORIES = DEFAULT_CATEGORIES;
