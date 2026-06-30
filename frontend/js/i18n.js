// i18n.js — Artisans237
// Simple data-i18n attribute system. Add data-i18n="some_key" to any element
// and its text will switch with the language toggle. French is the default
// since that's the primary language for most of the target market; English
// is one click away.

const I18N = {
  fr: {
    nav_home: 'Accueil',
    nav_find: 'Trouver un service',
    nav_pricing: 'Tarifs pro',
    nav_become: 'Devenir prestataire',
    nav_login: 'Connexion',
    nav_logout: 'Déconnexion',
    nav_dashboard: 'Tableau de bord',
    footer_terms: "Conditions d'utilisation",
    footer_privacy: 'Politique de confidentialité',
    footer_made: 'Conçu pour le Cameroun.',

    hero_badge: '🇨🇲 Actif au Cameroun',
    hero_title_1: 'Trouvez des artisans de confiance',
    hero_title_2: 'partout au Cameroun.',
    hero_sub: 'Trouvez plombiers, électriciens, mécaniciens et plus — inscrits, localisés, et prêts à discuter de votre besoin directement.',
    hero_cat_all: 'Toutes catégories',
    hero_town_any: 'Toute ville',
    hero_quarter_any: 'Tout quartier',
    hero_search_btn: 'Rechercher',
    hero_query_ph: 'Rechercher un métier, un nom...',

    trust_1: 'Prestataires vérifiés par un administrateur',
    trust_2: 'Contact direct — aucun intermédiaire, aucune commission sur le prix de votre service',
    trust_3: 'MTN Mobile Money — confirmation manuelle, aucune carte bancaire requise',

    section_browse_title: 'Parcourir par métier',
    section_browse_sub: 'Touchez une carte pour voir qui est inscrit près de vous.',

    section_work_title: 'De vrais travaux, de vrais prestataires',
    section_work_sub: 'Un aperçu du type de travaux gérés sur Artisans237.',
    work_1_title: 'Réparations à domicile',
    work_1_desc: "Des fuites d'eau aux pannes électriques — pris en charge rapidement.",
    work_2_title: 'Entretien',
    work_2_desc: 'Gardez votre maison ou votre commerce en bon état.',
    work_3_title: 'Installation',
    work_3_desc: 'Nouveaux équipements et installations, posés correctement.',

    section_how_title: 'Comment ça marche',
    section_how_sub: 'Trois étapes simples pour obtenir de l\'aide.',
    step1_title: 'Choisissez un service',
    step1_desc: 'Plomberie, électricité, mécanique et plus — trouvez la catégorie qui correspond à votre besoin.',
    step2_title: 'Comparez les prestataires proches',
    step2_desc: 'Voyez qui est inscrit dans votre ville et quartier, avec son métier et une courte description.',
    step3_title: 'Demandez en toute confiance',
    step3_desc: 'Envoyez votre demande avec vos coordonnées. Le prestataire accepte, et vous échangez directement.',

    section_towns_title: 'Disponible partout au Cameroun',
    section_towns_sub: 'Choisissez une ville pour voir ses quartiers — les prestataires peuvent s\'inscrire dans n\'importe lequel.',

    section_reviews_title: 'Ce que disent nos utilisateurs',
    testimonial_empty: "Soyez parmi les premiers à partager votre expérience sur Artisans237 — de vrais avis de clients et de prestataires apparaîtront ici.",

    cta_new_here: 'Nouveau ici ? <a href="register.html">Créez un compte</a> en tant que client, ou <a href="register.html?role=provider">inscrivez votre métier</a> — les prestataires bénéficient d\'un essai gratuit avant tout abonnement.',

    // Register page
    reg_title: 'Créez votre compte',
    reg_sub: 'Les clients trouvent de l\'aide. Les prestataires sont listés — avec un essai gratuit de <span id="trialDaysLabel">14</span> jours avant tout abonnement.',
    reg_role_label: 'Je suis...',
    reg_role_customer: 'Client (à la recherche d\'un service)',
    reg_role_provider: 'Prestataire (j\'offre un métier)',
    reg_fullname: 'Nom complet',
    reg_phone: 'Numéro de téléphone',
    reg_email: 'Adresse email',
    reg_password: 'Mot de passe',
    reg_trade: 'Votre métier / catégorie',
    cat_other: 'Autre (tapez votre métier)',
    reg_trade_placeholder: 'Tapez votre métier (ex. Soudeur, Coiffeur)',
    reg_bio: 'Courte description (optionnel)',
    reg_bio_placeholder: 'ex. 8 ans d\'expérience, disponible le soir',
    reg_town: 'Ville',
    reg_quarter: 'Quartier',
    reg_quarter_placeholder: 'Tapez votre zone',
    reg_submit: 'Créer le compte',
    reg_have_account: 'Vous avez déjà un compte ?',

    // Login page
    login_title: 'Connexion',
    login_email: 'Email',
    login_password: 'Mot de passe',
    login_submit: 'Se connecter',
    login_no_account: 'Pas de compte ?',
    login_create_one: 'Créez-en un',

    // Providers / find-service page
    prov_title: 'Prestataires',
    prov_filter_btn: 'Filtrer',
    prov_request_btn: 'Demander ce service',
    prov_modal_title: 'Demander ce service',
    prov_modal_desc: 'Votre description (optionnel)',
    prov_modal_desc_ph: 'ex. Fuite dans la cuisine, besoin d\'une visite le jour même',
    prov_modal_phone: 'Votre téléphone (pour que le prestataire puisse vous contacter)',
    prov_modal_whatsapp: 'Numéro WhatsApp (optionnel)',
    prov_modal_town: 'Ville',
    prov_modal_quarter: 'Quartier',
    prov_modal_quarter_ph: 'Tapez votre zone',
    prov_modal_submit: 'Publier la demande',
    prov_modal_cancel: 'Annuler',
    prov_loading: 'Chargement des prestataires…',
    prov_none_found: 'Aucun prestataire trouvé pour ce filtre.',
    prov_showing_all: 'Affichage de tous les prestataires inscrits.',
    prov_showing_filtered: 'Affichage des prestataires',
    prov_in: 'à',
    badge_verified: 'Vérifié',
    badge_trial: 'Essai gratuit',
    prov_request_posted: 'Demande publiée ! Un prestataire vous contactera une fois qu\'il l\'aura acceptée.',

    // Pricing page
    pricing_title: 'Tarification simple et juste',
    pricing_sub: 'Aucuns frais cachés. Payez seulement quand votre essai gratuit se termine, et uniquement via MTN Mobile Money.',
    pricing_trial_h: 'Essai gratuit',
    pricing_after_h: 'Après votre essai',
    pricing_note: 'Envoyez votre paiement, puis soumettez la référence de confirmation MTN depuis votre tableau de bord prestataire. Un administrateur vérifie et confirme — généralement le même jour.',
    pricing_cta: 'Commencez votre essai gratuit',
    pricing_register_btn: 'S\'inscrire comme prestataire',

    // Dashboards (shared/static labels)
    dash_cust_title: 'Mes demandes de service',
    dash_cust_sub: 'Une fois qu\'un prestataire accepte, ses coordonnées apparaissent ici pour discuter directement du travail.',
    dash_cust_none: 'Aucune demande pour le moment.',
    status_open: 'En attente d\'acceptation par un prestataire',
    status_accepted: 'Acceptée — contact ci-dessous',
    status_completed: 'Terminée',
    status_cancelled: 'Annulée',
    no_description: 'Aucune description fournie',
    find_provider_link: 'Trouver un prestataire',
    provider_label: 'Prestataire',

    dash_prov_open_title: 'Demandes ouvertes dans votre métier',
    dash_prov_open_sub: 'Acceptez une demande pour débloquer les coordonnées du client — et partager les vôtres.',
    dash_prov_status_title: 'État de votre compte',
    dash_prov_pay_title: 'Payez votre abonnement via MTN Mobile Money',
    dash_prov_loc_title: 'Mettez à jour votre localisation',
    dash_prov_save_loc: 'Enregistrer la localisation',

    dash_prov_no_open: 'Aucune demande ouverte dans votre catégorie pour le moment.',
    dash_prov_accept_btn: 'Accepter',
    dash_prov_accepted: 'Acceptée ✓',
    dash_prov_customer_label: 'Client',
    dash_prov_whatsapp_label: 'WhatsApp',
    dash_prov_checking: 'Vérification…',
    dash_prov_sub_active: 'Abonnement actif',
    dash_prov_days_left: 'jour(s) restant(s).',
    dash_prov_free_trial: 'Essai gratuit',
    dash_prov_submit_soon: 'Soumettez un paiement bientôt pour rester listé !',
    dash_prov_fully_visible: 'Vous êtes pleinement visible par les clients.',
    dash_prov_not_listed: "Vous n'êtes pas actuellement listé.",
    dash_prov_not_listed_desc: "Votre essai est terminé et aucun abonnement actif n'a été trouvé — soumettez un paiement ci-dessous pour réapparaître.",
    dash_prov_pending_note: "Un paiement est en attente de confirmation par un administrateur.",
    dash_prov_loading_terms: 'Chargement des conditions de paiement…',
    dash_prov_plan_text: 'Abonnement : {amount} FCFA pour {days} jours. Soumettez votre confirmation MoMo ci-dessous — un administrateur la vérifie (généralement le même jour).',
    dash_prov_send_to: 'Envoyez le paiement au : {number}',
    dash_prov_momo_ref: 'Référence MTN MoMo / code SMS',
    dash_prov_paid_from: 'Numéro depuis lequel vous avez payé',
    dash_prov_amount_sent: 'Montant envoyé (FCFA)',
    dash_prov_submit_payment: 'Soumettre le paiement pour vérification',
    dash_prov_quarter_other_ph: 'Tapez votre zone (non listée)',
    dash_prov_location_saved: 'Localisation enregistrée.',

    dash_admin_title: 'Tableau de bord administrateur',
    dash_admin_sub: 'Vue d\'ensemble de l\'activité sur la plateforme.',
    dash_admin_total: 'Demandes totales',
    dash_admin_pending: 'En attente',
    dash_admin_accepted: 'Acceptées',
    dash_admin_volume: 'Volume traité',
    dash_admin_pending_payments: 'Paiements MTN MoMo en attente',
    dash_admin_recent_requests: 'Demandes récentes',
    dash_admin_registered_providers: 'Prestataires inscrits',
    pricing_trial_text: 'Chaque nouveau prestataire bénéficie de {days} jours gratuits, entièrement listé et visible par les clients, suivi automatiquement depuis votre inscription.',
    pricing_sub_text: '{amount} FCFA maintiennent votre fiche active pendant {days} jours.',
    pricing_momo_line: 'Envoyez le paiement au : {number}',
    pricing_load_error: 'Impossible de charger les tarifs pour le moment — veuillez réessayer dans un instant.',

    dash_admin_change_pw: 'Changer votre mot de passe administrateur',

    support_title: 'Contacter l\'administrateur',
    support_sub: 'Un problème ou une question ? Écrivez-nous, nous répondrons ici.',
    support_placeholder: 'Décrivez votre problème ou votre question...',
    support_send: 'Envoyer le message',
    support_sent: 'Message envoyé à l\'administrateur.',
    support_history_title: 'Vos messages précédents',
    support_no_messages: 'Vous n\'avez envoyé aucun message pour le moment.',
    support_status_open: 'En attente de réponse',
    support_status_resolved: 'Résolu',
    support_admin_reply: 'Réponse de l\'administrateur',

    dash_admin_support_title: 'Messages d\'assistance',
    dash_admin_support_none: 'Aucun message pour le moment.',
    dash_admin_support_from: 'De',
    dash_admin_reply_placeholder: 'Écrivez votre réponse...',
    dash_admin_reply_send: 'Envoyer la réponse',

    mark_completed_btn: 'Marquer comme terminé',
    leave_review_btn: 'Laisser un avis',
    review_already_sent: 'Avis déjà envoyé',
    review_modal_title: 'Laisser un avis',
    review_rating_label: 'Note',
    review_comment_label: 'Votre commentaire',
    review_comment_ph: 'Comment cela s\'est-il passé ?',
    review_submit: 'Envoyer l\'avis',
    review_rating_required: 'Veuillez choisir une note.',
    reviews_count_label: 'avis',
    badge_provider_label: 'prestataire',
    dash_prov_accepted_title: 'Vos travaux acceptés',
    dash_prov_accepted_sub: 'Marquez un travail comme terminé une fois fait — cela permet à vous deux de laisser un avis.',
    dash_prov_no_accepted: 'Aucun travail accepté pour le moment.',
    dash_admin_reviews_title: 'Avis en attente',
    dash_admin_reviews_none: 'Aucun avis en attente.',
    dash_admin_reopen: 'Rouvrir',
    th_customer: 'Client',
    th_provider: 'Prestataire',
    th_service: 'Service',
    th_date: 'Date',
    th_status: 'Statut',
    th_name: 'Nom',
    th_trade: 'Métier',
    th_quarter: 'Quartier',
    th_phone: 'Téléphone',
    th_verified: 'Vérifié',
    nothing_pending: 'Rien en attente.',
    no_requests_yet: 'Aucune demande pour le moment.',
    could_not_load: 'Impossible de charger.',
    no_providers_yet: 'Aucun prestataire inscrit pour le moment.',
    btn_confirm: 'Confirmer',
    btn_reject: 'Rejeter',
    btn_verify: 'Vérifier',
    btn_unverify: 'Retirer la vérification',
    pw_current: 'Mot de passe actuel',
    pw_new: 'Nouveau mot de passe',
    pw_update_btn: 'Mettre à jour le mot de passe',
    ref_label: 'Réf',
    from_label: 'De',
  },
  en: {
    nav_home: 'Home',
    nav_find: 'Find a service',
    nav_pricing: 'Pro pricing',
    nav_become: 'Become a provider',
    nav_login: 'Log in',
    nav_logout: 'Log out',
    nav_dashboard: 'Dashboard',
    footer_terms: 'Terms of Service',
    footer_privacy: 'Privacy Policy',
    footer_made: 'Made for Cameroon.',

    hero_badge: '🇨🇲 Now active in Cameroon',
    hero_title_1: 'Find trusted artisans',
    hero_title_2: 'everywhere in Cameroon.',
    hero_sub: 'Find plumbers, electricians, mechanics and more — registered, located, and ready to discuss your job directly.',
    hero_cat_all: 'All categories',
    hero_town_any: 'Any town',
    hero_quarter_any: 'Any neighborhood',
    hero_search_btn: 'Search',
    hero_query_ph: 'Search for a trade, name...',

    trust_1: 'Verified providers, checked by an admin',
    trust_2: 'Direct contact — no middlemen, no commission on your job price',
    trust_3: 'MTN Mobile Money — confirmed manually, no card details needed',

    section_browse_title: 'Browse by trade',
    section_browse_sub: 'Tap a card to see everyone registered nearby.',

    section_work_title: 'Real work, real providers',
    section_work_sub: 'A look at the kind of jobs handled on Artisans237.',
    work_1_title: 'Home repairs',
    work_1_desc: 'From leaky pipes to faulty wiring — handled fast.',
    work_2_title: 'Maintenance',
    work_2_desc: 'Keep your home or business running smoothly.',
    work_3_title: 'Installation',
    work_3_desc: 'New fittings, fixtures, and equipment, set up right.',

    section_how_title: 'How it works',
    section_how_sub: 'Three simple steps to get help.',
    step1_title: 'Choose a service',
    step1_desc: 'Plumbing, electrical, mechanics and more — find the category that matches what you need.',
    step2_title: 'Compare nearby providers',
    step2_desc: "See who's registered in your town and neighborhood, with their trade and a short bio.",
    step3_title: 'Request with confidence',
    step3_desc: 'Send your request with your contact info. The provider accepts, and you connect directly.',

    section_towns_title: 'Available across Cameroon',
    section_towns_sub: "Pick a town to see its neighborhoods — providers are welcome to register in any of them.",

    section_reviews_title: 'What our users say',
    testimonial_empty: 'Be among the first to share your experience on Artisans237 — real reviews from customers and providers will appear here.',

    cta_new_here: 'New here? <a href="register.html">Create an account</a> as a customer, or <a href="register.html?role=provider">register your trade</a> — providers get a free trial before any subscription is due.',

    // Register page
    reg_title: 'Create your account',
    reg_sub: 'Customers find help. Providers get listed — with a free <span id="trialDaysLabel">14</span>-day trial before any subscription is due.',
    reg_role_label: 'I am a...',
    reg_role_customer: 'Customer (looking for a service)',
    reg_role_provider: 'Service Provider (offering a trade)',
    reg_fullname: 'Full name',
    reg_phone: 'Phone number',
    reg_email: 'Email address',
    reg_password: 'Password',
    reg_trade: 'Your trade / category',
    cat_other: 'Other (type your trade)',
    reg_trade_placeholder: 'Type your trade (e.g. Welder, Hairdresser)',
    reg_bio: 'Short bio (optional)',
    reg_bio_placeholder: 'e.g. 8 years experience, available evenings',
    reg_town: 'Town',
    reg_quarter: 'Neighborhood',
    reg_quarter_placeholder: 'Type your area',
    reg_submit: 'Create account',
    reg_have_account: 'Already have an account?',

    // Login page
    login_title: 'Log in',
    login_email: 'Email',
    login_password: 'Password',
    login_submit: 'Log in',
    login_no_account: 'No account?',
    login_create_one: 'Create one',

    // Providers / find-service page
    prov_title: 'Providers',
    prov_filter_btn: 'Filter',
    prov_request_btn: 'Request service',
    prov_modal_title: 'Request this service',
    prov_modal_desc: 'Your description (optional)',
    prov_modal_desc_ph: 'e.g. Leaking kitchen pipe, need same-day visit',
    prov_modal_phone: 'Your phone (so the provider can reach you)',
    prov_modal_whatsapp: 'WhatsApp number (optional)',
    prov_modal_town: 'Town',
    prov_modal_quarter: 'Neighborhood',
    prov_modal_quarter_ph: 'Type your area',
    prov_modal_submit: 'Post request',
    prov_modal_cancel: 'Cancel',
    prov_loading: 'Loading providers…',
    prov_none_found: 'No providers found for this filter yet.',
    prov_showing_all: 'Showing all registered providers.',
    prov_showing_filtered: 'Showing providers',
    prov_in: 'in',
    badge_verified: 'Verified',
    badge_trial: 'Free trial',
    prov_request_posted: 'Request posted! A provider will reach out once they accept.',

    // Pricing page
    pricing_title: 'Simple, fair pricing',
    pricing_sub: 'No surprise fees. Pay only once your free trial ends, and only via MTN Mobile Money.',
    pricing_trial_h: 'Free trial',
    pricing_after_h: 'After your trial',
    pricing_note: 'Send your payment, then submit the MTN confirmation reference from your provider dashboard. An admin reviews and confirms it — usually the same day.',
    pricing_cta: 'Start your free trial',
    pricing_register_btn: 'Register as a provider',

    // Dashboards (shared/static labels)
    dash_cust_title: 'My service requests',
    dash_cust_sub: "Once a provider accepts, their contact details appear here so you can discuss the job directly.",
    dash_cust_none: 'No requests yet.',
    status_open: 'Waiting for a provider to accept',
    status_accepted: 'Accepted — contact below',
    status_completed: 'Completed',
    status_cancelled: 'Cancelled',
    no_description: 'No description provided',
    find_provider_link: 'Find a provider',
    provider_label: 'Provider',

    dash_prov_open_title: 'Open requests in your trade',
    dash_prov_open_sub: "Accept a request to unlock the customer's contact details — and share yours with them.",
    dash_prov_status_title: 'Your account status',
    dash_prov_pay_title: 'Pay your subscription via MTN Mobile Money',
    dash_prov_loc_title: 'Update your location',
    dash_prov_save_loc: 'Save location',

    dash_prov_no_open: 'No open requests in your category right now.',
    dash_prov_accept_btn: 'Accept',
    dash_prov_accepted: 'Accepted ✓',
    dash_prov_customer_label: 'Customer',
    dash_prov_whatsapp_label: 'WhatsApp',
    dash_prov_checking: 'Checking…',
    dash_prov_sub_active: 'Subscription active',
    dash_prov_days_left: 'day(s) left.',
    dash_prov_free_trial: 'Free trial',
    dash_prov_submit_soon: 'Submit payment soon to stay listed!',
    dash_prov_fully_visible: "You're fully visible to customers.",
    dash_prov_not_listed: 'Not currently listed.',
    dash_prov_not_listed_desc: 'Your trial ended and no active subscription was found — submit a payment below to go live again.',
    dash_prov_pending_note: 'A payment is awaiting admin confirmation.',
    dash_prov_loading_terms: 'Loading payment terms…',
    dash_prov_plan_text: 'Subscription: {amount} FCFA for {days} days. Submit your MoMo confirmation below — an admin reviews it (usually same-day).',
    dash_prov_send_to: 'Send payment to: {number}',
    dash_prov_momo_ref: 'MTN MoMo reference / SMS code',
    dash_prov_paid_from: 'Number you paid from',
    dash_prov_amount_sent: 'Amount sent (FCFA)',
    dash_prov_submit_payment: 'Submit payment for review',
    dash_prov_quarter_other_ph: 'Type your area (not on the list)',
    dash_prov_location_saved: 'Location saved.',

    dash_admin_title: 'Admin dashboard',
    dash_admin_sub: 'Overview of activity on the platform.',
    dash_admin_total: 'Total requests',
    dash_admin_pending: 'Pending',
    dash_admin_accepted: 'Accepted',
    dash_admin_volume: 'Volume processed',
    dash_admin_pending_payments: 'Pending MTN MoMo payments',
    dash_admin_recent_requests: 'Recent requests',
    dash_admin_registered_providers: 'Registered providers',
    pricing_trial_text: 'Every new provider gets {days} days free, fully listed and visible to customers, automatically tracked from your registration date.',
    pricing_sub_text: '{amount} FCFA keeps your listing active for {days} days.',
    pricing_momo_line: 'Send payment to: {number}',
    pricing_load_error: 'Could not load pricing right now — please try again shortly.',

    dash_admin_change_pw: 'Change your admin password',

    support_title: 'Contact the admin',
    support_sub: 'Got a problem or a question? Write to us and we\'ll reply here.',
    support_placeholder: 'Describe your problem or question...',
    support_send: 'Send message',
    support_sent: 'Message sent to the admin.',
    support_history_title: 'Your previous messages',
    support_no_messages: 'You haven\'t sent any messages yet.',
    support_status_open: 'Awaiting reply',
    support_status_resolved: 'Resolved',
    support_admin_reply: 'Admin reply',

    dash_admin_support_title: 'Support messages',
    dash_admin_support_none: 'No messages yet.',
    dash_admin_support_from: 'From',
    dash_admin_reply_placeholder: 'Write your reply...',
    dash_admin_reply_send: 'Send reply',

    mark_completed_btn: 'Mark as completed',
    leave_review_btn: 'Leave a review',
    review_already_sent: 'Review already sent',
    review_modal_title: 'Leave a review',
    review_rating_label: 'Rating',
    review_comment_label: 'Your comment',
    review_comment_ph: 'How did it go?',
    review_submit: 'Submit review',
    review_rating_required: 'Please select a rating.',
    reviews_count_label: 'reviews',
    badge_provider_label: 'provider',
    dash_prov_accepted_title: 'Your accepted jobs',
    dash_prov_accepted_sub: "Mark a job completed once it's done — this is what lets both of you leave a review.",
    dash_prov_no_accepted: 'No accepted jobs right now.',
    dash_admin_reviews_title: 'Pending reviews',
    dash_admin_reviews_none: 'No pending reviews.',
    dash_admin_reopen: 'Reopen',
    th_customer: 'Customer',
    th_provider: 'Provider',
    th_service: 'Service',
    th_date: 'Date',
    th_status: 'Status',
    th_name: 'Name',
    th_trade: 'Trade',
    th_quarter: 'Quarter',
    th_phone: 'Phone',
    th_verified: 'Verified',
    nothing_pending: 'Nothing pending.',
    no_requests_yet: 'No requests yet.',
    could_not_load: 'Could not load.',
    no_providers_yet: 'No providers registered yet.',
    btn_confirm: 'Confirm',
    btn_reject: 'Reject',
    btn_verify: 'Verify',
    btn_unverify: 'Unverify',
    pw_current: 'Current password',
    pw_new: 'New password',
    pw_update_btn: 'Update password',
    ref_label: 'Ref',
    from_label: 'From',
  },
};

function getLang() {
  return localStorage.getItem('artisans237_lang') || 'fr';
}

function t(key, vars) {
  const lang = getLang();
  let str = (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
  if (vars) {
    Object.keys(vars).forEach(k => { str = str.replace(`{${k}}`, vars[k]); });
  }
  return str;
}

function applyI18n() {
  const lang = getLang();
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const html = t(el.dataset.i18n);
    el.innerHTML = html;
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });

  document.querySelectorAll('.lang-toggle button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function setLang(lang) {
  localStorage.setItem('artisans237_lang', lang);
  applyI18n();
  // onLangChange re-renders dynamic content (category grid, provider list, etc.)
  // Wrapped in try/catch so a page-specific error never kills the toggle itself.
  if (typeof window.onLangChange === 'function') {
    try { window.onLangChange(lang); } catch(e) { console.error('[i18n] onLangChange error:', e); }
  }
}

window.t = t;
window.getLang = getLang;
window.setLang = setLang;
window.applyI18n = applyI18n;

document.addEventListener('DOMContentLoaded', function() {
  applyI18n();
  // onLangChange might not be defined yet if the page's inline script
  // runs after DOMContentLoaded — use setTimeout to let inline scripts finish first.
  setTimeout(function() {
    if (typeof window.onLangChange === 'function') {
      try { window.onLangChange(getLang()); } catch(e) { console.error('[i18n] onLangChange on load error:', e); }
    }
  }, 0);
});
