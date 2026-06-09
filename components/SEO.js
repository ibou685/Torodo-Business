import Head from 'next/head';
import { PRODUCTS, SITE, FAQ_DATA } from '../lib/products';

export default function SEO({ title, description, canonical, image, type='website', product=null, faqItems=null, noindex=false }) {
  const fullTitle    = title ? `${title} | ${SITE.name} — Dakar` : `${SITE.name} — Soins, Beauté & Parfumerie à Dakar, Sénégal`;
  const metaDesc     = description || SITE.desc;
  const canonicalUrl = canonical ? `${SITE.url}${canonical}` : SITE.url;
  const ogImage      = image || `${SITE.url}/og-image.jpg`;

  // ── 1. Organisation / LocalBusiness ─ GEO ──────────────────────────────────
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": ["BeautyBusiness", "LocalBusiness"],
    "@id": `${SITE.url}/#organisation`,
    "name": SITE.name,
    "alternateName": ["Makmodestyle Dakar", "Mak Mode Style"],
    "description": SITE.desc,
    "url": SITE.url,
    "telephone": SITE.phone,
    "email": SITE.email,
    "foundingDate": "2023",
    "currenciesAccepted": "XOF, FCFA",
    "paymentAccepted": "Espèces, Mobile Money, Wave, Orange Money, Paiement à la livraison",
    "priceRange": "$$",
    "areaServed": [
      { "@type": "City", "name": "Dakar" },
      { "@type": "Country", "name": "Sénégal" }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Dakar",
      "addressRegion": "Dakar",
      "addressCountry": "SN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": SITE.geoLat,
      "longitude": SITE.geoLng
    },
    "openingHoursSpecification": [
      { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], "opens": "09:00", "closes": "20:00" },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Sunday", "opens": "10:00", "closes": "17:00" }
    ],
    "sameAs": [SITE.instagram, SITE.facebook, SITE.tiktok],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "telephone": SITE.phone,
      "availableLanguage": ["French", "Wolof"]
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `Collection ${SITE.name}`,
      "itemListElement": PRODUCTS.map((p, i) => ({
        "@type": "Offer",
        "position": i + 1,
        "name": p.name,
        "description": p.desc,
        "price": p.price,
        "priceCurrency": "XOF",
        "availability": "https://schema.org/InStock",
        "category": p.cat,
      }))
    }
  };

  // ── 2. WebSite + SearchAction ─ GEO ────────────────────────────────────────
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    "name": SITE.name,
    "url": SITE.url,
    "description": SITE.desc,
    "inLanguage": "fr-SN",
    "publisher": { "@id": `${SITE.url}/#organisation` },
    "potentialAction": {
      "@type": "SearchAction",
      "target": { "@type": "EntryPoint", "urlTemplate": `${SITE.url}/?q={search_term_string}` },
      "query-input": "required name=search_term_string"
    }
  };

  // ── 3. Produit individuel ─ SEO + GEO ──────────────────────────────────────
  const productSchema = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE.url}/produits/${product.id}`,
    "name": product.name,
    "description": product.longDesc || product.desc,
    "category": product.cat,
    "brand": { "@type": "Brand", "name": SITE.name, "url": SITE.url },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "XOF",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": { "@type": "Organization", "name": SITE.name },
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.stars,
      "bestRating": 5,
      "worstRating": 1,
      "ratingCount": 47
    }
  } : null;

  // ── 4. Breadcrumb ───────────────────────────────────────────────────────────
  const breadcrumbSchema = product ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Accueil", "item": SITE.url },
      { "@type": "ListItem", "position": 2, "name": product.cat, "item": `${SITE.url}/#catalogue` },
      { "@type": "ListItem", "position": 3, "name": product.name, "item": canonicalUrl }
    ]
  } : null;

  // ── 5. FAQ ─ AEO + GEO ─────────────────────────────────────────────────────
  const activeFaq = faqItems || FAQ_DATA;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": activeFaq.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": { "@type": "Answer", "text": item.a }
    }))
  };

  // ── 6. Speakable ─ AEO voix ────────────────────────────────────────────────
  const speakableSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": fullTitle,
    "url": canonicalUrl,
    "speakable": { "@type": "SpeakableSpecification", "cssSelector": ["h1","h2",".speakable"] }
  };

  // ── 7. ItemList catalogue ─ GEO ────────────────────────────────────────────
  const itemListSchema = !product ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Catalogue ${SITE.name}`,
    "description": `Produits beauté ${SITE.name} — Dakar, Sénégal`,
    "numberOfItems": PRODUCTS.length,
    "itemListElement": PRODUCTS.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `${SITE.url}/produits/${p.id}`,
      "name": p.name,
    }))
  } : null;

  return (
    <Head>
      {/* Essentiels */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <meta name="keywords" content={SITE.keywords} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:type" content={product ? 'product' : type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:locale" content="fr_SN" />
      {product && <meta property="product:price:amount" content={String(product.price)} />}
      {product && <meta property="product:price:currency" content="XOF" />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={ogImage} />

      {/* GEO — signaux localisation */}
      <meta name="geo.region" content={SITE.geoRegion} />
      <meta name="geo.placename" content="Dakar, Sénégal" />
      <meta name="geo.position" content={`${SITE.geoLat};${SITE.geoLng}`} />
      <meta name="ICBM" content={`${SITE.geoLat}, ${SITE.geoLng}`} />

      {/* AEO — voix */}
      <meta name="speakable" content="true" />

      {/* Général */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#C47A7A" />
      <meta name="author" content={SITE.name} />
      <meta name="language" content="French" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

      {/* Structured Data JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {productSchema   && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />}
      {breadcrumbSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />}
      {itemListSchema  && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />}
    </Head>
  );
}
