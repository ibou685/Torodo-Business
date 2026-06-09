// ─── lib/products.js ─────────────────────────────────────────────────────────
// Toutes les valeurs utilisées dans le JSX sont des strings simples.
// Les objets ne sont utilisés QUE dans les JSON-LD (jamais rendus directement).

// ─── Produits ────────────────────────────────────────────────────────────────
export const PRODUCTS = [
  {
    id: "serum-eclat-vitamine-c",
    name: "Sérum Éclat Vitamine C",
    price: 24500,
    oldPrice: 32000,
    cat: "Soins",
    badge: "Best-seller",
    icon: "✨",
    stars: 5,
    desc: "Sérum concentré en vitamine C pure pour un teint lumineux et unifié. Formule légère, absorption rapide. Flacon 30ml.",
    longDesc: "Notre sérum à la vitamine C pure agit sur les taches et illumine le teint. Enrichi en acide hyaluronique et extrait de rose, il unifie et repulpe la peau dès les premières applications. Convient à tous types de peau.",
    ingredients: ["Vitamine C 15%", "Acide hyaluronique", "Extrait de rose", "Niacinamide"],
  },
  {
    id: "parfum-rose-oud",
    name: "Parfum Rose Oud",
    price: 68000,
    oldPrice: null,
    cat: "Parfumerie",
    badge: "Nouveau",
    icon: "🌸",
    stars: 5,
    desc: "Fragrance envoûtante alliant la rose de Damas et l'oud précieux. Longue tenue 12h. Flacon 50ml.",
    longDesc: "Une fragrance d'exception qui marie la délicatesse de la rose de Damas à l'oud précieux. Notes de tête : bergamote. Notes de cœur : rose absolue. Notes de fond : oud, ambre et musc blanc.",
    ingredients: ["Rose de Damas", "Oud", "Bergamote", "Jasmin", "Ambre"],
  },
  {
    id: "creme-karite-rose",
    name: "Crème Karité & Rose",
    price: 15500,
    oldPrice: null,
    cat: "Soins",
    badge: null,
    icon: "🌿",
    stars: 4,
    desc: "Crème riche au beurre de karité et à l'extrait de rose. Nourrit et protège la peau. Pot 50ml.",
    longDesc: "Cette crème généreuse allie la richesse du beurre de karité pur à la douceur de l'eau de rose. Elle nourrit les peaux sèches et renforce la barrière cutanée toute la journée.",
    ingredients: ["Beurre de karité", "Eau de rose", "Glycérine", "Vitamine E"],
  },
  {
    id: "palette-smoky-rose",
    name: "Palette Smoky Rose",
    price: 28000,
    oldPrice: 35000,
    cat: "Beauté",
    badge: "Promo",
    icon: "👁",
    stars: 4,
    desc: "16 teintes nude et smoky, finitions mat, satin et scintillant. Longue durée, haute pigmentation.",
    longDesc: "16 teintes soigneusement sélectionnées : des nudes naturels pour le quotidien aux teintes intenses pour les soirées. Formule longue durée 12h, texture ultra-douce, pigmentation professionnelle.",
    ingredients: ["Pigments haute qualité", "Vitamine E", "Sans paraben"],
  },
  {
    id: "huile-argan-jasmin",
    name: "Huile Argan & Jasmin",
    price: 18000,
    oldPrice: null,
    cat: "Soins",
    badge: "Bio",
    icon: "💧",
    stars: 5,
    desc: "Huile sèche multi-usage visage, corps et cheveux. Argan bio certifié. Flacon 100ml.",
    longDesc: "L'alliance de l'huile d'argan marocaine certifiée bio et de l'absolu de jasmin. Pénètre instantanément, nourrit peau et cheveux tout en parfumant délicatement.",
    ingredients: ["Huile d'argan bio", "Absolu de jasmin", "Vitamine E", "Squalane végétal"],
  },
  {
    id: "rouge-levres-mat",
    name: "Rouge à Lèvres Mat Velours",
    price: 9500,
    oldPrice: null,
    cat: "Beauté",
    badge: null,
    icon: "💄",
    stars: 4,
    desc: "Rouge à lèvres mat longue tenue 8h. Enrichi en vitamine E. Collection 12 teintes.",
    longDesc: "Un mat velouté qui ne dessèche pas les lèvres. Enrichi en vitamine E et beurre de karité. Couvrance intense en un seul passage, tenue jusqu'à 8h. 12 teintes disponibles.",
    ingredients: ["Vitamine E", "Beurre de karité", "Cire de candelilla"],
  },
  {
    id: "eau-parfum-oud-noir",
    name: "Eau de Parfum Oud Noir",
    price: 85000,
    oldPrice: null,
    cat: "Parfumerie",
    badge: "Premium",
    icon: "🖤",
    stars: 5,
    desc: "Fragrance orientale intense aux notes de bois précieux, oud et ambre. Flacon 100ml.",
    longDesc: "Oud Noir est une fragrance majestueuse. L'oud noir de qualité supérieure se marie à l'ambre gris, au patchouli et au musc pour créer un sillage inoubliable jusqu'à 24h.",
    ingredients: ["Oud noir", "Ambre gris", "Patchouli", "Musc blanc", "Vétiver"],
  },
  {
    id: "coffret-beaute-ritual",
    name: "Coffret Beauté Ritual",
    price: 55000,
    oldPrice: null,
    cat: "Nouveautés",
    badge: "Exclusif",
    icon: "🎁",
    stars: 5,
    desc: "Coffret complet : sérum, crème de jour, huile précieuse et eau florale. Idéal comme cadeau.",
    longDesc: "Le coffret Ritual réunit nos 4 bestsellers en un écrin élégant. Contient : Sérum Éclat 15ml, Crème Karité 30ml, Huile Argan 30ml et Eau Florale Rose 50ml.",
    ingredients: ["Voir produits individuels"],
  },
];

export function getProductById(id) {
  return PRODUCTS.find(p => p.id === id) || null;
}

// ─── Catégories ───────────────────────────────────────────────────────────────
export const PCATS = ["Soins", "Beauté", "Parfumerie", "Nouveautés"];

// ─── Configuration du site ────────────────────────────────────────────────────
// ⚠️  TOUTES les valeurs sont des strings simples — pas d'objets imbriqués ici
// Les seuls objets (geo, hours) ne sont JAMAIS rendus dans le JSX
export const SITE = {
  name:     "Torodo Business",
  tagline:  "Soins · Beauté · Parfumerie",
  url:      "https://www.torodobusiness.com",  // ← Remplacez par votre domaine
  whatsapp: "221784449891",                  // ← Remplacez (ex: 221771234567)
  email:    "contact@torodobusiness.com",      // ← Votre email
  phone:    "+221 78 444 98 91",             // ← Votre téléphone
  address:  "Dakar, Sénégal",               // ← string simple — affiché dans le footer

  // Description — utilisée dans les meta tags
  desc: "Torodo Business - Boutique beauté en ligne à Dakar. Soins visage, parfums orientaux et maquillage premium. Livraison rapide au Sénégal.",

  // Mots-clés SEO — string simple (pas de tableau)
  keywords: "boutique beauté Dakar, beauté Sénégal, cosmétiques Dakar, soins visage Dakar, sérum vitamine C Sénégal, crème hydratante Dakar, parfum oud Dakar, parfum oriental Sénégal, maquillage Dakar, livraison beauté Dakar, achat beauté en ligne Sénégal",

  // Réseaux sociaux — strings simples
  instagram: "https://instagram.com/tororodobusiness",
  facebook:  "https://facebook.com/tororodobusiness",
  tiktok:    "https://tiktok.com/@tororodobusiness",

  // Horaires — strings simples pour l'affichage
  hoursWeek: "Lun – Sam : 9h00 – 20h00",
  hoursWeekend: "Dimanche : 10h00 – 17h00",

  // Géo — utilisé UNIQUEMENT dans les JSON-LD, jamais rendu en JSX
  geoLat: "14.6928",
  geoLng: "-17.4467",
  geoRegion: "SN-DK",
};

// ─── FAQ — AEO ────────────────────────────────────────────────────────────────
// Utilisé dans le composant SEO (JSON-LD) et la page /faq
export const FAQ_DATA = [
  {
    q: "Où se trouve Torodo Business ?",
    a: "Torodo Business est une boutique beauté en ligne basée à Dakar, Sénégal. Nous livrons dans tout Dakar et ses environs. Vous pouvez passer commande directement via WhatsApp.",
  },
  {
    q: "Comment commander chez Torodo Business ?",
    a: "Cliquez sur 'Ajouter au panier', puis sur 'Commander via WhatsApp'. Un message pré-rempli avec vos articles sera envoyé à notre équipe qui confirme votre commande rapidement.",
  },
  {
    q: "Torodo Business livre-t-il à domicile à Dakar ?",
    a: "Oui, Torodo Business propose la livraison à domicile à Dakar. Le paiement s'effectue à la livraison en espèces ou via Mobile Money (Wave, Orange Money).",
  },
  {
    q: "Quels types de produits vend Torodo Business ?",
    a: "Torodo Business vend des soins visage (sérums, crèmes, huiles), des parfums orientaux (Oud, Rose), du maquillage (palettes, rouges à lèvres) et des coffrets cadeaux. Tous les produits sont 100% authentiques.",
  },
  {
    q: "Les produits Torodo Business sont-ils authentiques ?",
    a: "Oui, tous les produits sont 100% authentiques et de qualité premium. Nous garantissons leur authenticité et acceptons les retours sous 7 jours en cas de problème.",
  },
  {
    q: "Quels sont les horaires de Torodo Business ?",
    a: "Torodo Business est disponible du lundi au samedi de 9h à 20h, et le dimanche de 10h à 17h.",
  },
  {
    q: "Torodo Business accepte-t-il les retours ?",
    a: "Oui, les retours sont acceptés sous 7 jours après réception si le produit est défectueux. Contactez-nous via WhatsApp pour initier un retour.",
  },
];
