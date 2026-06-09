# Makmodestyle — Site e-commerce Next.js

Site e-commerce professionnel avec SEO avancé pour Makmodestyle.

---

## 🚀 Mise en ligne en 10 minutes (Vercel)

### Étape 1 — Préparer le projet
```bash
# Installez Node.js sur https://nodejs.org (version 18+)
cd makmodestyle-next
npm install
npm run dev   # Tester en local sur http://localhost:3000
```

### Étape 2 — Déployer sur Vercel (GRATUIT)
1. Créez un compte sur https://vercel.com
2. Installez Vercel CLI : `npm install -g vercel`
3. Dans le dossier du projet : `vercel`
4. Suivez les instructions → votre site est en ligne en 2 minutes !
5. URL obtenue : `https://makmodestyle.vercel.app`

### Étape 3 — Domaine personnalisé (optionnel, ~10€/an)
1. Achetez `makmodestyle.com` sur https://namecheap.com ou https://gandi.net
2. Dans Vercel > Settings > Domains → ajoutez votre domaine
3. Mettez à jour les DNS chez votre registrar
4. ✅ HTTPS automatique inclus !

---

## ⚙️ Configuration obligatoire

Ouvrez `lib/products.js` et modifiez :

```javascript
export const SITE = {
  url: "https://www.makmodestyle.com",  // ← Votre vrai domaine
  whatsapp: "221XXXXXXXXX",             // ← Vrai numéro (ex: 221771234567)
  email: "contact@makmodestyle.com",    // ← Vrai email
  phone: "+221 77 XXX XX XX",           // ← Vrai téléphone
};
```

---

## 🔍 SEO — Ce que ce site fait automatiquement

### Optimisations incluses :
- ✅ **Balises meta** : title, description, keywords sur chaque page
- ✅ **Open Graph** : preview sur WhatsApp, Facebook, etc.
- ✅ **Structured Data** (JSON-LD) : Google comprend vos produits et votre boutique
- ✅ **Page produit individuelle** : chaque produit a sa propre URL indexable
- ✅ **Fil d'Ariane** : aide Google à comprendre la structure
- ✅ **Sitemap.xml** automatique : `/sitemap.xml`
- ✅ **robots.txt** : `/robots.txt`
- ✅ **SSG** (Static Site Generation) : pages générées au build, ultra-rapides
- ✅ **Balises sémantiques** : h1, h2, nav, main, footer, aria-label
- ✅ **Images optimisées** avec Next.js Image
- ✅ **HTTPS** automatique via Vercel
- ✅ **Core Web Vitals** optimisés (vitesse = facteur de ranking Google)

---

## 📈 Checklist SEO après mise en ligne

### Semaine 1 — Gratuit et prioritaire
- [ ] **Google Search Console** → https://search.google.com/search-console
  - Ajoutez votre site
  - Soumettez le sitemap : `https://votresite.com/sitemap.xml`
  - Demandez l'indexation des pages importantes
- [ ] **Google Business Profile** → https://business.google.com
  - Créez votre fiche (apparaît sur Google Maps + recherches locales "beauté Dakar")
  - Ajoutez photos, horaires, description, lien vers le site
- [ ] **Bing Webmaster Tools** → https://www.bing.com/webmasters
  - Même principe que Google Search Console

### Semaine 2 — Contenu et réseaux
- [ ] Créez un compte **Instagram** @makmodestyle avec lien vers le site
- [ ] Publiez des **Reels/TikToks** sur vos produits (fort trafic vers le site)
- [ ] Demandez à vos clientes de laisser des **avis Google**
- [ ] Partagez le lien du site sur votre **statut WhatsApp**

### Mois 1-3 — Pour être premier sur "beauté Dakar"
- [ ] Ajoutez des vraies **photos produits** (remplacez les emojis)
- [ ] Écrivez des **descriptions longues** pour chaque produit
- [ ] Créez une page **Blog** : "Meilleur sérum pour peau africaine", "Parfums oud tendance Dakar"
- [ ] Obtenez des **backlinks** : mentions sur des blogs beauté sénégalais

---

## 🛠 Ajouter / modifier des produits

Modifiez le tableau dans `lib/products.js` :

```javascript
{
  id: "mon-nouveau-produit",        // URL : /produits/mon-nouveau-produit
  name: "Nom du produit",
  price: 25000,
  oldPrice: 32000,                  // null si pas de promo
  cat: "Soins",                     // Soins | Beauté | Parfumerie | Nouveautés
  badge: "Nouveau",                 // null ou Best-seller | Promo | Bio | Premium | Exclusif
  icon: "✨",                       // Emoji affiché si pas de photo
  stars: 5,
  desc: "Description courte (pour les cartes et Google).",
  longDesc: "Description longue détaillée (page produit).",
  ingredients: ["Ingrédient 1", "Ingrédient 2"],
},
```

---

## 📸 Ajouter de vraies photos produits

1. Mettez vos images dans le dossier `public/` (ex: `public/images/serum.jpg`)
2. Dans la page produit `pages/produits/[id].js`, remplacez l'emoji par :
```jsx
import Image from 'next/image';
<Image src="/images/serum.jpg" alt="Sérum Éclat Vitamine C" width={500} height={500} />
```

---

## 💰 Coûts

| Service | Prix |
|---------|------|
| Hébergement Vercel | **Gratuit** |
| Nom de domaine .com | ~10-15€/an |
| HTTPS (SSL) | **Inclus** |
| Google Search Console | **Gratuit** |
| Google Business | **Gratuit** |

**Total minimum : ~10€/an** pour un site professionnel complet !
