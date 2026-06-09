import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import SEO from '../components/SEO';
import { PRODUCTS as DEFAULT_PRODUCTS, SITE } from '../lib/products';
import {
  getProducts, getCategories,
  createProduct, updateProduct, deleteProduct,
  createCategory, deleteCategory,
  signIn, signOut, getSession,
  uploadMedia, deleteMedia,
} from '../lib/supabase';
 
const AD = {
  bg:"#120C0C", surf:"#1E1212", bord:"#2E1E1E", accent:"#C47A7A",
  text:"#FFFFFF", muted:"rgba(255,255,255,0.45)", gold:"#C9956A",
};
 
const BADGES = ["","Best-seller","Nouveau","Promo","Bio","Premium","Exclusif"];
const EMPTY  = { name:"", price:"", oldPrice:"", cat:"Soins", badge:"", stars:5, desc:"", longDesc:"", ingredients:"", media:[] };
const fmt    = p => new Intl.NumberFormat('fr-FR').format(p)+' FCFA';
const inp    = { width:"100%", padding:"11px 14px", borderRadius:10, border:`1px solid ${AD.bord}`, background:"rgba(255,255,255,0.06)", color:AD.text, fontFamily:"Jost,sans-serif", fontSize:13, outline:"none", boxSizing:"border-box" };
const lbl    = { fontFamily:"Jost,sans-serif", fontSize:10, color:AD.muted, letterSpacing:"1.2px", textTransform:"uppercase", display:"block", marginBottom:7 };
 
/* ── Login ─────────────────────────────────────────────── */
function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pw, setPw]       = useState("");
  const [err, setErr]     = useState("");
  const [load, setLoad]   = useState(false);
 
  const go = async () => {
    if (!email.trim() || !pw.trim()) return;
    setLoad(true); setErr("");
    const result = await signIn(email.trim(), pw.trim());
    if (result.success) {
      onLogin();
    } else {
      setErr("Email ou mot de passe incorrect.");
      setPw(""); setLoad(false);
    }
  };
 
  return (
    <div style={{ minHeight:"100vh", background:AD.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:AD.surf, borderRadius:22, padding:"48px 44px", width:"min(420px,100%)", border:`1px solid ${AD.bord}`, boxShadow:"0 40px 80px rgba(0,0,0,0.7)" }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ width:64, height:64, background:"rgba(196,122,122,0.15)", borderRadius:20, display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, margin:"0 auto 16px" }}>🔐</div>
          <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:26, fontWeight:700, color:AD.text, marginBottom:4 }}>Administration</p>
          <p style={{ fontFamily:"Jost,sans-serif", fontSize:11, color:AD.accent, letterSpacing:"2.5px", textTransform:"uppercase" }}>TORODO BUSINESS</p>
        </div>
        <label style={lbl}>Email</label>
        <input type="email" value={email} onChange={e=>{setEmail(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&go()} autoFocus placeholder="admin@tororodobusiness.com" style={{...inp,marginBottom:14}}/>
        <label style={lbl}>Mot de passe</label>
        <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="••••••••" style={{...inp,border:`1.5px solid ${err?"#E55":AD.bord}`,marginBottom:err?8:18}}/>
        {err && <p style={{ fontFamily:"Jost,sans-serif", fontSize:12, color:"#E87070", marginBottom:14 }}>❌ {err}</p>}
        <button onClick={go} disabled={load} style={{ width:"100%", background:load?"#A06060":AD.accent, color:AD.text, border:"none", borderRadius:12, padding:14, fontFamily:"Jost,sans-serif", fontSize:13, fontWeight:600, cursor:load?"wait":"pointer", letterSpacing:"1px", textTransform:"uppercase", marginBottom:10 }}>
          {load ? "Connexion…" : "Se connecter"}
        </button>
        <p style={{ fontFamily:"Jost,sans-serif", fontSize:11, color:AD.muted, textAlign:"center", marginTop:12 }}>
          <Link href="/" style={{ color:AD.muted }}>← Retour à la boutique</Link>
        </p>
      </div>
    </div>
  );
}
 
/* ── Formulaire produit ─────────────────────────────────── */
function ProductForm({ initial, onSave, onCancel, cats }) {
  const mediaRef = useRef();
  const [uploading, setUploading] = useState(false);
 
  // f doit être déclaré AVANT handleMediaDrop
  const [f, setF] = useState(() =>
    initial
      ? {
          ...initial,
          price:       String(initial.price),
          oldPrice:    initial.oldPrice ? String(initial.oldPrice) : "",
          ingredients: Array.isArray(initial.ingredients) ? initial.ingredients.join(", ") : "",
          media:       initial.media || [],
        }
      : { ...EMPTY }
  );
 
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
 
  const handleMediaDrop = async (files) => {
    setUploading(true);
    const arr = [...(f.media || [])];
    for (const file of Array.from(files)) {
      if (arr.length >= 5) break;
      const tempId = initial?.id || 'new-' + Date.now();
      const uploaded = await uploadMedia(file, tempId);
      if (uploaded) arr.push(uploaded);
    }
    set("media", arr);
    setUploading(false);
  };
 
  const valid = f.name.trim() && Number(f.price) > 0 && f.desc.trim();
 
  const handleSave = () => {
    if (!valid) return;
    onSave({
      ...f,
      id:          initial?.id || f.name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'') + '-' + Date.now(),
      price:       Number(f.price),
      oldPrice:    Number(f.oldPrice) || null,
      ingredients: f.ingredients ? f.ingredients.split(',').map(s=>s.trim()).filter(Boolean) : [],
      longDesc:    f.longDesc || f.desc,
      media:       f.media || [],
    });
  };
 
  return (
    <div style={{ background:AD.surf, borderRadius:18, padding:"28px", border:`1px solid ${AD.bord}` }}>
      <h2 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:22, fontWeight:700, color:AD.text, marginBottom:26 }}>
        {initial ? "✏️ Modifier le produit" : "➕ Nouveau produit"}
      </h2>
 
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:"16px 24px" }}>
 
        <div style={{ gridColumn:"1/-1" }}>
          <label style={lbl}>Nom du produit *</label>
          <input style={inp} value={f.name} onChange={e=>set("name",e.target.value)} placeholder="Ex: Sérum Éclat Rose"/>
        </div>
 
        <div>
          <label style={lbl}>Prix (FCFA) *</label>
          <input style={inp} type="number" value={f.price} onChange={e=>set("price",e.target.value)} placeholder="25000" min="0"/>
        </div>
        <div>
          <label style={lbl}>Ancien prix (promo)</label>
          <input style={inp} type="number" value={f.oldPrice} onChange={e=>set("oldPrice",e.target.value)} placeholder="32000" min="0"/>
        </div>
 
        <div>
          <label style={lbl}>Catégorie</label>
          <select style={{...inp, background:AD.surf}} value={f.cat} onChange={e=>set("cat",e.target.value)}>
            {cats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>Badge</label>
          <select style={{...inp, background:AD.surf}} value={f.badge} onChange={e=>set("badge",e.target.value)}>
            {BADGES.map(b => <option key={b} value={b}>{b||"— Aucun —"}</option>)}
          </select>
        </div>
 
        <div>
          <label style={lbl}>Note (étoiles)</label>
          <div style={{ display:"flex", gap:8, marginTop:4 }}>
            {[3,4,5].map(n => (
              <button key={n} onClick={()=>set("stars",n)}
                style={{ padding:"9px 16px", borderRadius:10, border:`1.5px solid ${f.stars===n?AD.accent:AD.bord}`, background:f.stars===n?"rgba(196,122,122,0.2)":"transparent", color:f.stars===n?AD.accent:AD.muted, fontFamily:"Jost,sans-serif", fontSize:13, cursor:"pointer" }}>
                {"★".repeat(n)}
              </button>
            ))}
          </div>
        </div>
 
        <div style={{ gridColumn:"1/-1" }}>
          <label style={lbl}>Description courte * (carte produit + SEO)</label>
          <textarea style={{...inp, resize:"vertical"}} rows={2} value={f.desc} onChange={e=>set("desc",e.target.value)} placeholder="Description courte affichée sur les cartes..."/>
        </div>
        <div style={{ gridColumn:"1/-1" }}>
          <label style={lbl}>Description longue (page produit + GEO/AEO)</label>
          <textarea style={{...inp, resize:"vertical"}} rows={3} value={f.longDesc} onChange={e=>set("longDesc",e.target.value)} placeholder="Description détaillée pour la fiche produit..."/>
        </div>
        <div style={{ gridColumn:"1/-1" }}>
          <label style={lbl}>Ingrédients (séparés par des virgules)</label>
          <input style={inp} value={f.ingredients} onChange={e=>set("ingredients",e.target.value)} placeholder="Vitamine C, Acide hyaluronique, Extrait de rose"/>
        </div>
 
        {/* ── Upload photos/vidéos — dans le grid ── */}
        <div style={{ gridColumn:"1/-1" }}>
          <label style={lbl}>Photos & Vidéos (max 5)</label>
          <div
            onDragOver={e=>e.preventDefault()}
            onDrop={e=>{e.preventDefault();handleMediaDrop(e.dataTransfer.files);}}
            onClick={()=>mediaRef.current.click()}
            style={{ border:`2px dashed ${AD.bord}`, borderRadius:12, padding:"24px 20px", textAlign:"center", cursor:"pointer", marginBottom:10, transition:"border-color 0.2s" }}
          >
            <div style={{ fontSize:28, marginBottom:6 }}>📸</div>
            {uploading
              ? <p style={{ fontFamily:"Jost,sans-serif", fontSize:12, color:AD.accent }}>⏳ Upload en cours…</p>
              : <>
                  <p style={{ fontFamily:"Jost,sans-serif", fontSize:12, color:AD.muted }}>Glissez vos photos/vidéos ici ou cliquez</p>
                  <p style={{ fontFamily:"Jost,sans-serif", fontSize:11, color:"rgba(255,255,255,0.2)", marginTop:4 }}>JPG, PNG, WEBP, MP4 — max 5 fichiers</p>
                </>
            }
            <input ref={mediaRef} type="file" multiple accept="image/*,video/*" onChange={e=>handleMediaDrop(e.target.files)} style={{ display:"none" }}/>
          </div>
 
          {f.media?.length > 0 && (
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {f.media.map((m, i) => (
                <div key={i} style={{ position:"relative", width:72, height:72, borderRadius:10, overflow:"hidden", border:`1px solid ${AD.bord}` }}>
                  {m.type === "image"
                    ? <img src={m.data} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                    : <video src={m.data} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  }
                  <button
                    onClick={async (e) => { e.stopPropagation(); await deleteMedia(m.data); set("media", f.media.filter((_,j)=>j!==i)); }}
                    style={{ position:"absolute", top:3, right:3, background:"rgba(0,0,0,0.7)", border:"none", color:"#fff", borderRadius:"50%", width:20, height:20, fontSize:11, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
 
      </div>{/* fin grid */}
 
      <div style={{ display:"flex", gap:12, justifyContent:"flex-end", marginTop:24 }}>
        <button onClick={onCancel} style={{ padding:"11px 24px", borderRadius:10, border:`1px solid ${AD.bord}`, background:"transparent", color:AD.muted, fontFamily:"Jost,sans-serif", fontSize:12, cursor:"pointer" }}>Annuler</button>
        <button onClick={handleSave} disabled={!valid}
          style={{ padding:"11px 26px", borderRadius:10, border:"none", background:valid?AD.accent:"#555", color:AD.text, fontFamily:"Jost,sans-serif", fontSize:12, fontWeight:600, cursor:valid?"pointer":"not-allowed" }}>
          {initial ? "💾 Enregistrer" : "✅ Ajouter"}
        </button>
      </div>
    </div>
  );
}
 
/* ── Page admin principale ──────────────────────────────── */
export default function AdminPage() {
 
  // ── 1. Tous les useState ────────────────────────────────
  const [auth, setAuth]               = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [products, setProducts]       = useState([]);
  const [cats, setCats]               = useState([]);
  const [loading, setLoading]         = useState(false);
  const [view, setView]               = useState("list");
  const [editing, setEditing]         = useState(null);
  const [search, setSearch]           = useState("");
  const [catF, setCatF]               = useState("Tout");
  const [toast, setToast]             = useState(null);
  const [newCat, setNewCat]           = useState("");
 
  // ── 2. Fonctions (avant useEffect) ──────────────────────
  const showToast = (msg, warn=false) => {
    setToast({ msg, warn });
    setTimeout(() => setToast(null), 3000);
  };
 
  const loadData = async () => {
    setLoading(true);
    const [prods, categories] = await Promise.all([getProducts(), getCategories()]);
    setProducts(prods.length > 0 ? prods : DEFAULT_PRODUCTS);
    setCats(categories.length > 0 ? categories : ["Soins","Beauté","Parfumerie","Nouveautés"]);
    setLoading(false);
  };
 
  // ── 3. Tous les useEffect ────────────────────────────────
  useEffect(() => {
    getSession().then(session => {
      if (session) setAuth(true);
      setAuthChecked(true);
    });
  }, []);
 
  useEffect(() => {
    if (!auth) return;
    loadData();
  }, [auth]);
 
  // ── 4. Handlers ─────────────────────────────────────────
  const handleSave = async (p) => {
    setLoading(true);
    if (editing) {
      await updateProduct(p.id, p);
      showToast("✅ Produit modifié !");
    } else {
      await createProduct(p);
      showToast("✅ Produit ajouté !");
    }
    await loadData();
    setView("list"); setEditing(null);
    setLoading(false);
  };
 
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Supprimer "${name}" définitivement ?`)) return;
    setLoading(true);
    await deleteProduct(id);
    showToast("🗑 Produit supprimé", true);
    await loadData();
    setLoading(false);
  };
 
  const handleAddCat = async () => {
    if (!newCat.trim() || cats.includes(newCat.trim())) return;
    await createCategory(newCat.trim());
    showToast("✅ Catégorie ajoutée !");
    setNewCat("");
    await loadData();
  };
 
  const handleDeleteCat = async (name) => {
    if (!window.confirm(`Supprimer la catégorie "${name}" ?`)) return;
    await deleteCategory(name);
    showToast("🗑 Catégorie supprimée", true);
    await loadData();
  };
 
  // ── 5. Données dérivées ──────────────────────────────────
  const shown = products.filter(p =>
    (catF === "Tout" || p.cat === catF) &&
    (!search || p.name.toLowerCase().includes(search.toLowerCase()))
  );
 
  const stats = {
    total:  products.length,
    byCat:  cats.map(c => ({ c, n: products.filter(p=>p.cat===c).length })),
    avg:    products.length ? Math.round(products.reduce((s,p)=>s+p.price,0)/products.length) : 0,
    promos: products.filter(p=>p.oldPrice).length,
  };
 
  // ── 6. Returns conditionnels (APRÈS tous les hooks) ──────
  if (!authChecked) return (
    <div style={{ minHeight:"100vh", background:AD.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:40, height:40, border:`3px solid ${AD.bord}`, borderTopColor:AD.accent, borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/>
      <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
    </div>
  );
 
  if (!auth) return <AdminLogin onLogin={() => setAuth(true)} />;
 
  // ── 7. Rendu principal ───────────────────────────────────
  return (
    <>
      <SEO title="Administration" noindex={true} />
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        body { font-family:'Jost',sans-serif; background:${AD.bg}; color:${AD.text}; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-thumb { background:${AD.accent}; border-radius:3px; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @media(max-width:768px){
          .admin-topbar{padding:0 16px !important;}
          .admin-content{padding:20px 16px !important;}
          .stats-grid{grid-template-columns:repeat(2,1fr) !important;}
          .product-list-item{flex-wrap:wrap !important;}
          .product-actions{width:100% !important;justify-content:flex-end !important;}
        }
      `}</style>
 
      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", top:20, left:"50%", transform:"translateX(-50%)", background:toast.warn?"#7A3A1A":"#1A6A3A", color:"#fff", padding:"11px 24px", borderRadius:99, fontFamily:"Jost,sans-serif", fontSize:13, fontWeight:500, zIndex:999, whiteSpace:"nowrap", boxShadow:"0 6px 24px rgba(0,0,0,0.4)" }}>
          {toast.msg}
        </div>
      )}
 
      {/* Barre de chargement */}
      {loading && (
        <div style={{ position:"fixed", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${AD.accent},#E8C4A0,${AD.accent})`, backgroundSize:"200% 100%", animation:"shimmer 1.5s infinite", zIndex:9999 }}/>
      )}
 
      {/* TOPBAR */}
      <div className="admin-topbar" style={{ background:AD.surf, borderBottom:`1px solid ${AD.bord}`, padding:"0 32px", height:68, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:40, height:40, background:"rgba(196,122,122,0.15)", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🌸</div>
          <div>
            <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:18, fontWeight:700, color:AD.text, lineHeight:1 }}>Administration</p>
            <p style={{ fontFamily:"Jost,sans-serif", fontSize:10, color:AD.accent, letterSpacing:"2px", marginTop:2 }}>TORODO BUSINESS</p>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
          {view !== "list"
            ? <button onClick={()=>{setView("list");setEditing(null);}} style={{ padding:"8px 16px", borderRadius:8, border:`1px solid ${AD.bord}`, background:"transparent", color:AD.muted, fontFamily:"Jost,sans-serif", fontSize:12, cursor:"pointer" }}>← Liste</button>
            : <button onClick={()=>setView("add")} style={{ padding:"8px 18px", borderRadius:8, border:"none", background:AD.accent, color:AD.text, fontFamily:"Jost,sans-serif", fontSize:12, fontWeight:600, cursor:"pointer" }}>+ Nouveau produit</button>
          }
          <button onClick={loadData} style={{ padding:"8px 14px", borderRadius:8, border:`1px solid ${AD.bord}`, background:"transparent", color:AD.muted, fontFamily:"Jost,sans-serif", fontSize:12, cursor:"pointer" }}>🔄 Actualiser</button>
          <button onClick={async()=>{await signOut();setAuth(false);}} style={{ padding:"8px 14px", borderRadius:8, border:`1px solid ${AD.bord}`, background:"transparent", color:"#E87070", fontFamily:"Jost,sans-serif", fontSize:12, cursor:"pointer" }}>🚪 Déconnexion</button>
          <Link href="/" style={{ padding:"8px 14px", borderRadius:8, border:`1px solid ${AD.bord}`, background:"transparent", color:AD.muted, fontFamily:"Jost,sans-serif", fontSize:12 }}>🏠 Boutique</Link>
        </div>
      </div>
 
      <div className="admin-content" style={{ maxWidth:1140, margin:"0 auto", padding:"32px" }}>
        {view === "list" && (
          <>
            {/* Catégories */}
            <div style={{ background:AD.surf, borderRadius:14, padding:"20px 24px", border:`1px solid ${AD.bord}`, marginBottom:24 }}>
              <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:18, fontWeight:600, color:AD.text, marginBottom:16 }}>📂 Catégories</p>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
                {cats.map(c => (
                  <div key={c} style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.05)", borderRadius:8, padding:"6px 12px" }}>
                    <span style={{ fontFamily:"Jost,sans-serif", fontSize:13, color:AD.text }}>{c}</span>
                    <button onClick={()=>handleDeleteCat(c)} style={{ border:"none", background:"transparent", color:"#E87070", cursor:"pointer", fontSize:14, lineHeight:1, padding:0 }}>✕</button>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <input value={newCat} onChange={e=>setNewCat(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAddCat()} placeholder="Nouvelle catégorie…" style={{...inp, maxWidth:240}}/>
                <button onClick={handleAddCat} style={{ padding:"0 18px", borderRadius:10, border:"none", background:AD.accent, color:"#fff", fontFamily:"Jost,sans-serif", fontSize:12, fontWeight:600, cursor:"pointer" }}>+ Ajouter</button>
              </div>
            </div>
 
            {/* Stats */}
            <div className="stats-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:14, marginBottom:32 }}>
              {[
                { l:"Total", v:stats.total, ic:"📦" },
                ...stats.byCat.map(({c,n})=>({ l:c, v:n, ic:{Soins:"🌿",Beauté:"💄",Parfumerie:"🌸",Nouveautés:"✨"}[c]||"📦" })),
                { l:"En promo", v:stats.promos, ic:"🏷️" },
                { l:"Prix moyen", v:fmt(stats.avg).replace(" FCFA","")+" F", ic:"💰" },
              ].map(({l,v,ic})=>(
                <div key={l} style={{ background:AD.surf, borderRadius:14, padding:"18px 20px", border:`1px solid ${AD.bord}` }}>
                  <p style={{ fontFamily:"Jost,sans-serif", fontSize:10, color:AD.muted, textTransform:"uppercase", letterSpacing:"1px", marginBottom:8 }}>{ic} {l}</p>
                  <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:26, fontWeight:700, color:AD.accent }}>{v}</p>
                </div>
              ))}
            </div>
 
            {/* Filtres */}
            <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap", alignItems:"center" }}>
              <div style={{ position:"relative", flex:1, minWidth:200 }}>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher..." style={{...inp, paddingLeft:36}}/>
                <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:14, color:AD.muted }}>🔍</span>
              </div>
              {["Tout",...cats].map(c=>(
                <button key={c} onClick={()=>setCatF(c)} style={{ padding:"8px 14px", borderRadius:8, border:`1px solid ${catF===c?AD.accent:AD.bord}`, background:catF===c?"rgba(196,122,122,0.15)":"transparent", color:catF===c?AD.accent:AD.muted, fontFamily:"Jost,sans-serif", fontSize:12, cursor:"pointer" }}>
                  {c}
                </button>
              ))}
            </div>
 
            <p style={{ fontFamily:"Jost,sans-serif", fontSize:11, color:AD.muted, marginBottom:14 }}>{shown.length} produit{shown.length>1?"s":""}</p>
 
            {/* Message Supabase */}
            <div style={{ background:"rgba(37,211,102,0.08)", border:"1px solid rgba(37,211,102,0.2)", borderRadius:10, padding:"12px 16px", marginBottom:20 }}>
              <p style={{ fontFamily:"Jost,sans-serif", fontSize:12, color:"#25D366" }}>
                ✅ Toutes les modifications sont sauvegardées directement dans Supabase.
              </p>
            </div>
 
            {/* Liste produits */}
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {shown.map(p => (
                <div key={p.id} className="product-list-item" style={{ background:AD.surf, borderRadius:12, padding:"14px 18px", border:`1px solid ${AD.bord}`, display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ width:56, height:56, background:"rgba(196,122,122,0.1)", borderRadius:10, overflow:"hidden", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {p.media && p.media.length > 0
                      ? <img src={p.media[0].data} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                      : <span style={{ fontSize:26 }}>🛍</span>
                    }
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
                      <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:15, fontWeight:600, color:AD.text }}>{p.name}</p>
                      {p.badge && <span style={{ fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:99, background:"rgba(196,122,122,0.2)", color:AD.accent }}>{p.badge}</span>}
                    </div>
                    <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
                      <span style={{ fontFamily:"Jost,sans-serif", fontSize:11, color:AD.muted, background:"rgba(255,255,255,0.06)", padding:"2px 8px", borderRadius:6 }}>{p.cat}</span>
                      <span style={{ fontFamily:"Jost,sans-serif", fontSize:13, color:AD.accent, fontWeight:600 }}>{fmt(p.price)}</span>
                      {p.oldPrice && <span style={{ fontFamily:"Jost,sans-serif", fontSize:12, color:AD.muted, textDecoration:"line-through" }}>{fmt(p.oldPrice)}</span>}
                      <span style={{ color:AD.gold, fontSize:11 }}>{"★".repeat(p.stars)}</span>
                    </div>
                  </div>
                  <div className="product-actions" style={{ display:"flex", gap:8, flexShrink:0 }}>
                    <button onClick={()=>{setEditing(p);setView("edit");}} style={{ padding:"8px 14px", borderRadius:8, border:`1px solid ${AD.bord}`, background:"transparent", color:AD.muted, fontFamily:"Jost,sans-serif", fontSize:12, cursor:"pointer" }}>✏️ Modifier</button>
                    <button onClick={()=>handleDelete(p.id,p.name)} style={{ padding:"8px 14px", borderRadius:8, border:"1px solid rgba(220,80,80,0.3)", background:"rgba(220,80,80,0.07)", color:"#E87070", fontFamily:"Jost,sans-serif", fontSize:12, cursor:"pointer" }}>🗑</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
 
        {(view === "add" || view === "edit") && (
          <ProductForm
            initial={view === "edit" ? editing : null}
            onSave={handleSave}
            onCancel={()=>{setView("list");setEditing(null);}}
            cats={cats}
          />
        )}
      </div>
    </>
  );
}
 