import { useState } from 'react';
import Link from 'next/link';
import SEO from '../components/SEO';
import { FAQ_DATA, SITE } from '../lib/products';

const P = {
  blush:"#FDE8E8",roseDark:"#C47A7A",roseGold:"#C9956A",roseGoldLight:"#E8C4A0",
  black:"#1A1010",muted:"#8C6E6E",border:"#F0D8D8",bg:"#FDF8F6",surface:"#FFFFFF",green:"#25D366"
};

function FaqItem({ item, index }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div style={{ borderBottom:`1px solid ${P.border}`, paddingBottom:0 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width:"100%", textAlign:"left", padding:"20px 0", background:"none", border:"none", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", gap:16 }}
        aria-expanded={open}
      >
        {/* Question en H3 sémantique — lu par les moteurs AEO */}
        <h3 className="speakable" style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"clamp(17px,3vw,21px)", fontWeight:600, color:P.black, lineHeight:1.3 }}>
          {item.q}
        </h3>
        <span style={{ color:P.roseDark, fontSize:22, flexShrink:0, transition:"transform 0.3s", transform:open?"rotate(45deg)":"none", display:"inline-block" }}>+</span>
      </button>
      {open && (
        /* Réponse courte et directe — format idéal AEO */
        <p className="speakable" style={{ fontFamily:"Jost,sans-serif", fontSize:15, color:P.muted, lineHeight:1.8, paddingBottom:20, maxWidth:700 }}>
          {item.a}
        </p>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <>
      <SEO
        title="Questions fréquentes — Livraison, commandes, produits"
        description="Toutes les réponses sur Torodo Business : comment commander, livraison à Dakar, authenticité des produits, retours et horaires."
        canonical="/faq"
        faqItems={FAQ_DATA}
      />

      {/* Header */}
      <header style={{ background:"rgba(253,248,246,0.97)", borderBottom:`1px solid ${P.border}`, padding:"0 24px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50, backdropFilter:"blur(20px)" }}>
        <Link href="/" style={{ fontFamily:"Cormorant Garamond,serif", fontSize:20, fontWeight:700, color:P.black }}>
          Torodo<span style={{ color:P.roseDark, fontStyle:"italic" }}>Business</span>
        </Link>
        <div style={{ display:"flex", gap:10 }}>
          <Link href="/" style={{ padding:"8px 16px", borderRadius:99, border:`1.5px solid ${P.border}`, fontFamily:"Jost,sans-serif", fontSize:12, color:P.muted }}>
            ← Boutique
          </Link>
          <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer"
            style={{ display:"flex", alignItems:"center", gap:6, background:P.green, color:"#fff", borderRadius:10, padding:"8px 14px", fontFamily:"Jost,sans-serif", fontSize:12, fontWeight:600 }}>
            📲 WhatsApp
          </a>
        </div>
      </header>

      <main style={{ maxWidth:820, margin:"0 auto", padding:"56px 24px 80px" }}>
        {/* En-tête de page */}
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <p style={{ fontFamily:"Jost,sans-serif", fontSize:10, letterSpacing:"3px", textTransform:"uppercase", color:P.roseGold, marginBottom:12 }}>✦ Centre d'aide ✦</p>
          <h1 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"clamp(32px,7vw,52px)", fontWeight:700, color:P.black, lineHeight:1.1, marginBottom:16 }}>
            Questions fréquentes
          </h1>
          <p className="speakable" style={{ fontFamily:"Jost,sans-serif", fontSize:15, color:P.muted, maxWidth:520, margin:"0 auto", lineHeight:1.7 }}>
            Toutes les réponses sur nos produits, la livraison à Dakar, les commandes WhatsApp et nos engagements qualité.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div style={{ background:P.surface, borderRadius:20, padding:"8px 32px", border:`1px solid ${P.border}`, marginBottom:40 }}>
          {FAQ_DATA.map((item, i) => <FaqItem key={i} item={item} index={i} />)}
        </div>

        {/* CTA contact */}
        <div style={{ background:`linear-gradient(135deg,${P.blush},#FEF4F0)`, borderRadius:20, padding:"36px 32px", textAlign:"center", border:`1px solid ${P.border}` }}>
          <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:26, fontWeight:600, color:P.black, marginBottom:8 }}>
            Vous n'avez pas trouvé votre réponse ?
          </p>
          <p style={{ fontFamily:"Jost,sans-serif", fontSize:14, color:P.muted, marginBottom:24 }}>
            Notre équipe vous répond en quelques minutes sur WhatsApp
          </p>
          <a href={`https://wa.me/${SITE.whatsapp}?text=Bonjour%20Torodo%20Business%2C%20j%27ai%20une%20question%20%3A%20`}
            target="_blank" rel="noreferrer"
            style={{ display:"inline-flex", alignItems:"center", gap:10, background:P.green, color:"#fff", borderRadius:12, padding:"14px 32px", fontFamily:"Jost,sans-serif", fontSize:14, fontWeight:600 }}>
            <span style={{ fontSize:20 }}>📲</span> Nous écrire sur WhatsApp
          </a>
        </div>
      </main>

      {/* Footer minimal */}
      <footer style={{ background:P.black, padding:"24px 32px", textAlign:"center" }}>
        <p style={{ fontFamily:"Jost,sans-serif", fontSize:11, color:"rgba(255,255,255,0.3)" }}>
          © 2025 Torodo Business · Dakar, Sénégal · <Link href="/" style={{ color:P.roseGoldLight }}>Retour à la boutique</Link>
        </p>
      </footer>

      <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer"
        style={{ position:"fixed", bottom:24, right:20, width:56, height:56, background:P.green, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, boxShadow:"0 6px 28px rgba(37,211,102,0.5)", zIndex:49 }}>
        📲
      </a>
    </>
  );
}
