// towns-data.js — Artisans237
// Real towns and quarters across Cameroon's regions, for location dropdowns.
// Expand this list anytime — it's just data, nothing else depends on its exact size.

const TOWNS_DATA = {
  // CENTRE REGION
  "Yaoundé": [
    "Bastos", "Centre Commercial", "Elig-Essono", "Etoa-Meki", "Nlongkak",
    "Elig-Edzoa", "Mvog-Mbi", "Mvog-Ada", "Mvog-Betsi", "Mvolyé",
    "Ngoa-Ekelle", "Nkol-Eton", "Nkoldongo", "Nkolbisson", "Nkomkana",
    "Tsinga", "Messa", "Mokolo", "Madagascar", "Essos",
    "Omnisport", "Biyem-Assi", "Obili", "Obobogo", "Nsam",
    "Nkol-Ndongo", "Etoudi", "Olembe", "Nkolondom", "Emana",
    "Mendong", "Odza", "Ekounou", "Etam-Bafia", "Ngousso",
    "Cité Verte", "Briqueterie", "Tongolo", "Mballa", "Kondengui"
  ],
  "Mbalmayo": ["Centre Ville", "Nkolfoulou", "Mengueme", "Abang", "Adjap", "Nkolyem"],
  "Bafia": ["Centre Administratif", "Kon", "Mbargue", "Bafia Marché", "Tonga"],
  "Obala": ["Centre Ville", "Elig-Nkouma", "Nkoteng Road", "Obala Marché"],

  // LITTORAL REGION
  "Douala": [
    "Akwa", "Bonanjo", "Bonapriso", "Bonadibong", "Bonamoussadi",
    "Bali", "Deido", "Bonaberi", "New-Bell", "Bepanda",
    "Makepe", "Kotto", "Logbaba", "Logpom", "Ndogbong",
    "Ndogpassi", "Ndokoti", "Nyalla", "Bonassama", "Yassa",
    "Cité SIC", "Village", "Bonendale", "Japoma", "Kassalafam",
    "Youpwe", "Bessengue", "PK8", "PK10", "PK12", "PK14"
  ],
  "Nkongsamba": ["Centre Ville", "Bonaberi-Nkongsamba", "Mbo", "Nlonako", "Quartier Allemand"],
  "Edéa": ["Centre Ville", "Bilalang", "Ndobo", "Pongo", "Sandjo", "Souza Road"],

  // SOUTH-WEST REGION
  "Buea": [
    "Molyko", "Buea Town", "Great Soppo", "Small Soppo", "Bonduma",
    "Mile 16 (Bolifamba)", "Mile 17", "Mile 18", "Muea", "Bomaka",
    "Federal Quarters", "Clerks Quarters", "Government Residential Area (GRA)",
    "Bokwaongo", "Sandpit", "Wonyamavio", "Bokwai", "Tole"
  ],
  "Limbe": [
    "Down Beach", "Mile 4", "Bota", "GRA Limbe", "New Town",
    "Middle Farms", "Church Street", "Bundu Town", "Mboko", "Saker Junction"
  ],
  "Kumba": [
    "Fiango", "Kumba Town", "Mbonge Road", "Buea Road", "Three Corners",
    "Kumba II", "Mbeke", "Mukonje", "Mosongo", "Mbalangi"
  ],
  "Tiko": ["Tiko Town", "Mutengene", "Likomba", "Bonjongo Road", "Tiko Wharf"],

  // NORTH-WEST REGION
  "Bamenda": [
    "Mankon", "Nkwen", "Up Station", "Old Town", "Ntarikon",
    "Cité-Sic", "Mile 4", "Mile 2 Nkwen", "Bamendankwe", "Bambili",
    "Bambui", "Mendankwe", "Atuakom", "Tatum", "Mulang",
    "Foncha Street", "Hospital Roundabout", "Below Foncha", "Sonac Street"
  ],
  "Kumbo": ["Tobin", "Mbveh", "Romeo", "Nkar Road", "Banso Town", "Mbiame"],
  "Wum": ["Wum Central", "Esimbi Road", "Bu", "Fungom"],

  // WEST REGION
  "Bafoussam": [
    "Banengo", "Djeleng", "Famla (Akwa)", "Kamkop", "Quartier Evêché",
    "Quartier Haoussa", "Tamdja", "Djemoun", "Ndiangdam", "Bamendzi",
    "Toungang", "Kouekong", "Tougang", "Tyo", "Ndiengso"
  ],
  "Dschang": ["Foto", "Vallée", "Tsinkop", "Centre Ville", "Manfe", "Fonakeukeu"],
  "Foumban": ["Njimong", "Palais Royal", "Nkounja", "Kotem", "Njicaribou"],
  "Mbouda": ["Gare Routière", "Madagascar I", "Madagascar II", "Baldo", "Bamendjinga"],

  // SOUTH REGION
  "Ebolowa": [
    "Nko'ovos I", "Nko'ovos II", "New-Bell", "Angalé", "Mekalat-Yevol",
    "Ebolowa-Si I", "Ebolowa-Si II", "Abang", "Ngalan", "Angounou",
    "Olem", "Elat", "Foulassi", "Mvila", "Mendong"
  ],
  "Kribi": [
    "Afan-Mabé", "Dombé", "Eboundja", "Mpolongwe I", "Mpolongwe II",
    "Ngoyè Administratif", "Bipaga 1", "Bipaga 2", "Bella", "New Town 2"
  ],
  "Sangmélima": ["Centre Ville", "Nko'ovos Sangmelima", "Mimboman Sangmelima", "Adjap"],

  // EAST REGION
  "Bertoua": ["Madagascar", "Mokolo Bertoua", "Nkolbikon", "Centre Administratif", "Tigaza"],
  "Abong-Mbang": ["Centre Ville", "Mindourou Road", "Doumaintang"],

  // ADAMAWA REGION
  "Ngaoundéré": ["Plateau", "Baladji I", "Baladji II", "Dang", "Mbideng", "Bamyanga", "Sabongari"],

  // NORTH REGION
  "Garoua": ["Commercial Centre", "Lopere", "Marouare", "Poumpoumre", "Roumde Adjia", "Yelwa", "Plateau Garoua"],

  // FAR NORTH REGION
  "Maroua": ["Domayo", "Doualare", "Djarengol", "Kakatare", "Founangue", "Palar", "Pitoaré"]
};

module.exports = TOWNS_DATA;
