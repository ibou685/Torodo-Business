import { getProducts, getCategories } from '../lib/supabase';
import { useState } from 'react';
import Link from 'next/link';
import SEO from '../components/SEO';
import { PRODUCTS, SITE } from '../lib/products';
const P = {
  blush:"#FDE8E8",rose:"#E8A4A4",roseDark:"#C47A7A",
  roseGold:"#C9956A",roseGoldLight:"#E8C4A0",
  black:"#1A1010",muted:"#8C6E6E",mutedLight:"#B09090",
  border:"#F0D8D8",bg:"#FDF8F6",surface:"#FFFFFF",
  green:"#25D366",
};

const fmt  = p => new Intl.NumberFormat('fr-FR').format(p)+' FCFA';

function Stars({n}){return <span style={{color:P.roseGold,fontSize:12}}>{'★'.repeat(n)}{'☆'.repeat(5-n)}</span>;}
function Badge({text}){
  if(!text)return null;
  const m={"Best-seller":{bg:"#FEF0F0",c:"#C47A7A"},"Nouveau":{bg:"#F0F8F0",c:"#4A8A5A"},"Promo":{bg:"#FEF3E8",c:"#B87A2A"},"Bio":{bg:"#F0F8F0",c:"#3A7A4A"},"Premium":{bg:"#1A1010",c:"#E8C4A0"},"Exclusif":{bg:"#F8F0FE",c:"#8A4AB8"}};
  const s=m[text]||{bg:"#F5F5F5",c:"#666"};
  return <span style={{background:s.bg,color:s.c,fontSize:10,fontWeight:600,padding:"3px 9px",borderRadius:99,letterSpacing:"0.8px",textTransform:"uppercase",whiteSpace:"nowrap"}}>{text}</span>;
}

function CartPanel({items,onClose,onRemove,onQty}){
  const total=items.reduce((s,i)=>s+i.price*i.qty,0);
  const msg=encodeURIComponent("Bonjour Torodo Business 🌸\n\nCommande :\n"+items.map(i=>`• ${i.name} x${i.qty} — ${fmt(i.price*i.qty)}`).join('\n')+`\n\n💰 Total : ${fmt(total)}`);
  return(
    <div style={{position:"fixed",inset:0,zIndex:150,display:"flex"}}>
      <div onClick={onClose} style={{flex:1,background:"rgba(26,16,16,0.5)",backdropFilter:"blur(5px)"}}/>
      <div className="cart-panel" style={{background:P.surface,display:"flex",flexDirection:"column",boxShadow:"-16px 0 60px rgba(196,122,122,0.2)"}}>
        <div style={{padding:"20px 24px 16px",borderBottom:`1px solid ${P.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <p style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,fontWeight:600,color:P.black}}>Mon Panier</p>
            <p style={{fontFamily:"Jost,sans-serif",fontSize:11,color:P.muted,marginTop:2}}>{items.length} article{items.length>1?'s':''}</p>
          </div>
          <button onClick={onClose} style={{background:P.blush,border:"none",width:36,height:36,borderRadius:"50%",cursor:"pointer",fontSize:17,color:P.roseDark}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"16px 24px",display:"flex",flexDirection:"column",gap:16}}>
          {items.length===0
            ?<div style={{textAlign:"center",paddingTop:80}}><div style={{fontSize:54,marginBottom:12}}>🌸</div><p style={{fontFamily:"Cormorant Garamond,serif",fontSize:19,color:P.muted}}>Panier vide</p></div>
            :items.map(item=>(
              <div key={item.id} style={{display:"flex",gap:12,alignItems:"center"}}>
<div style={{width:54,height:54,borderRadius:12,overflow:"hidden",background:P.blush,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
  {item.media && item.media.length > 0
    ? <img src={item.media[0].data} alt={item.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
    : <span style={{fontSize:26,opacity:0.4}}>📷</span>
  }
</div>                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontFamily:"Cormorant Garamond,serif",fontSize:14,fontWeight:600,color:P.black,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2}}>{item.name}</p>
                  <p style={{fontFamily:"Jost,sans-serif",fontSize:12,color:P.roseDark,fontWeight:500}}>{fmt(item.price)}</p>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <button onClick={()=>onQty(item.id,-1)} style={{width:28,height:28,borderRadius:6,border:`1px solid ${P.border}`,background:"none",cursor:"pointer",color:P.roseDark,fontSize:16}}>−</button>
                  <span style={{fontFamily:"Jost,sans-serif",fontSize:13,fontWeight:500,minWidth:20,textAlign:"center"}}>{item.qty}</span>
                  <button onClick={()=>onQty(item.id,1)} style={{width:28,height:28,borderRadius:6,border:`1px solid ${P.border}`,background:"none",cursor:"pointer",color:P.roseDark,fontSize:16}}>+</button>
                </div>
                <button onClick={()=>onRemove(item.id)} style={{background:"none",border:"none",color:P.mutedLight,cursor:"pointer",fontSize:16,padding:4}}>✕</button>
              </div>
            ))
          }
        </div>
        {items.length>0&&(
          <div style={{padding:"18px 24px",borderTop:`1px solid ${P.border}`,background:P.bg}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:16}}>
              <span style={{fontFamily:"Jost,sans-serif",fontSize:13,color:P.muted}}>Total</span>
              <span style={{fontFamily:"Cormorant Garamond,serif",fontSize:24,fontWeight:700,color:P.roseDark}}>{fmt(total)}</span>
            </div>
            <a href={`https://wa.me/${SITE.whatsapp}?text=${msg}`} target="_blank" rel="noreferrer"
              style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,background:P.green,color:"#fff",borderRadius:12,padding:"14px 0",fontFamily:"Jost,sans-serif",fontSize:14,fontWeight:600}}>
              <span style={{fontSize:20}}>📲</span> Commander via WhatsApp
            </a>
            <p style={{fontFamily:"Jost,sans-serif",fontSize:11,color:P.muted,textAlign:"center",marginTop:10}}>Paiement à la livraison</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({p,onAdd}){
  const[hov,setHov]=useState(false);
  return(
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:P.surface,borderRadius:14,overflow:"hidden",border:`1px solid ${hov?P.rose:P.border}`,transition:"all 0.3s",transform:hov?"translateY(-4px)":"none",boxShadow:hov?"0 12px 36px rgba(196,122,122,0.14)":"0 2px 8px rgba(196,122,122,0.04)",display:"flex",flexDirection:"column"}}>
      <Link href={`/produits/${p.id}`} style={{display:"block"}}>
        
         <div className="product-card-img" style={{height:200,background:`linear-gradient(145deg,${P.blush},#FEF0F0)`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
  {p.media && p.media.length > 0
    ? p.media[0].type === 'video'
      ? <video src={p.media[0].data} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
      : <img src={p.media[0].data} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.4s",transform:hov?"scale(1.06)":"scale(1)"}}/>
    : <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,opacity:0.4}}>
        <span style={{fontSize:40}}>📷</span>
        <span style={{fontFamily:"Jost,sans-serif",fontSize:11,color:P.muted}}>Photo à venir</span>
      </div>
  }
  {p.badge&&<div style={{position:"absolute",top:10,left:10}}><Badge text={p.badge}/></div>}
</div>

      </Link>
      <div className="product-card-body" style={{padding:"13px 15px",flex:1,display:"flex",flexDirection:"column",gap:5}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontFamily:"Jost,sans-serif",fontSize:10,color:P.muted,textTransform:"uppercase",letterSpacing:"1.5px"}}>{p.cat}</span>
          <Stars n={p.stars}/>
        </div>
        <h2 className="product-card-name" style={{fontFamily:"Cormorant Garamond,serif",fontSize:16,fontWeight:600,color:P.black,lineHeight:1.25,marginBottom:2}}>
          <Link href={`/produits/${p.id}`} style={{color:"inherit"}}>{p.name}</Link>
        </h2>
        <div style={{display:"flex",alignItems:"baseline",gap:7}}>
          <span className="product-card-price" style={{fontFamily:"Jost,sans-serif",fontSize:14,fontWeight:600,color:P.roseDark}}>{fmt(p.price)}</span>
          {p.oldPrice&&<span style={{fontFamily:"Jost,sans-serif",fontSize:11,color:P.mutedLight,textDecoration:"line-through"}}>{fmt(p.oldPrice)}</span>}
        </div>
        <button className="product-card-btn" onClick={()=>onAdd(p)}
          style={{marginTop:6,background:hov?P.roseDark:"transparent",color:hov?"#fff":P.roseDark,border:`1.5px solid ${P.roseDark}`,borderRadius:99,padding:"9px 0",fontFamily:"Jost,sans-serif",fontSize:12,fontWeight:500,cursor:"pointer",letterSpacing:"0.8px",textTransform:"uppercase",transition:"all 0.2s"}}>
          + Ajouter
        </button>
      </div>
    </div>
  );
}

export default function Home({products, categories}){
  const[cat,setCat]=useState("Tout");
  const[search,setSearch]=useState("");
  const[cart,setCart]=useState([]);
  const[cartOpen,setCartOpen]=useState(false);
  const[toast,setToast]=useState(null);

  const showToast=msg=>{setToast(msg);setTimeout(()=>setToast(null),2500);};
  const addToCart=p=>{
    setCart(c=>{const ex=c.find(i=>i.id===p.id);return ex?c.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i):[...c,{...p,qty:1}];});
    showToast(`🌸 ${p.name} ajouté !`);
  };

  const filtered=products.filter(p=>(cat==="Tout"||p.cat===cat)&&(!search||p.name.toLowerCase().includes(search.toLowerCase())));
  const cartCount=cart.reduce((s,i)=>s+i.qty,0);
  const topProds=products.filter(p=>p.stars===5).slice(0,3);

  return(
    <>
      <SEO/>
      {toast&&<div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:P.roseDark,color:"#fff",padding:"11px 24px",borderRadius:99,fontFamily:"Jost,sans-serif",fontSize:13,fontWeight:500,zIndex:1000,whiteSpace:"nowrap",boxShadow:"0 6px 24px rgba(196,122,122,0.4)",pointerEvents:"none"}}>{toast}</div>}

      {/* HEADER */}
      <header className="site-header">
        <Link href="/" className="header-logo">
          <p className="logo-name" style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,fontWeight:700,color:P.black,lineHeight:1}}>Torodo<span style={{color:"#C9956A",fontStyle:"italic"}}>Business</span></p>
          <p className="logo-tag" style={{fontFamily:"Jost,sans-serif",fontSize:8.5,color:P.muted,letterSpacing:"2.5px",textTransform:"uppercase",marginTop:2}}>Soins · Beauté · Parfumerie</p>
        </Link>
        <div className="header-search" style={{position:"relative"}}>
          <input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher…" aria-label="Rechercher"/>
          <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:P.rose,fontSize:15,pointerEvents:"none"}} aria-hidden>🔍</span>
        </div>
        <nav className="header-nav" aria-label="Catégories">
          {categories.map(c=><button key={c} className="header-nav-btn" onClick={()=>setCat(c)} style={{background:cat===c?P.roseDark:"transparent",color:cat===c?"#fff":P.muted}} aria-pressed={cat===c}>{c}</button>)}
        </nav>
        <div className="header-actions">
          <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer" className="wa-btn"
            style={{display:"flex",alignItems:"center",gap:6,background:P.green,color:"#fff",borderRadius:10,padding:"9px 16px",fontFamily:"Jost,sans-serif",fontSize:11,fontWeight:600}}>
            <span>📲</span><span className="wa-label">WhatsApp</span>
          </a>
          <button onClick={()=>setCartOpen(true)} className="cart-btn"
            style={{position:"relative",background:P.black,color:"#fff",border:"none",borderRadius:10,padding:"10px 16px",fontFamily:"Jost,sans-serif",fontSize:11,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6,textTransform:"uppercase"}}>
            🛍 Panier
            {cartCount>0&&<span style={{background:P.roseDark,borderRadius:99,minWidth:20,height:20,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,padding:"0 5px"}}>{cartCount}</span>}
          </button>
        </div>
      </header>

      {/* RECHERCHE MOBILE */}
      <div className="mobile-search-bar">
        <div style={{position:"relative"}}>
          <input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher un produit…" aria-label="Rechercher"/>
          <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:P.rose,fontSize:15,pointerEvents:"none"}} aria-hidden>🔍</span>
        </div>
      </div>

      {/* FILTRES MOBILE */}
      <nav className="mobile-cats" aria-label="Filtrer par catégorie">
        {categories.map(c=>(
          <button key={c} className="mobile-cat-btn" onClick={()=>setCat(c)}
            style={{borderColor:cat===c?P.roseDark:P.border,background:cat===c?P.roseDark:"transparent",color:cat===c?"#fff":P.muted}}>
            {c}
          </button>
        ))}
      </nav>

      <main>
        {/* HERO */}
        {cat==="Tout"&&!search&&(
          <section className="hero" aria-label="Bienvenue">
            <div style={{position:"absolute",top:-80,right:"8%",width:280,height:280,borderRadius:"50%",background:"rgba(201,149,106,0.08)",pointerEvents:"none"}} aria-hidden/>
            <p style={{fontFamily:"Jost,sans-serif",fontSize:10,letterSpacing:"4px",textTransform:"uppercase",color:P.roseGold,marginBottom:14,position:"relative"}}>✦ Votre Beauté, Notre Passion ✦</p>
            <h1 style={{fontFamily:"Cormorant Garamond,serif",fontSize:"clamp(36px,8vw,72px)",fontWeight:700,color:P.black,lineHeight:1.05,marginBottom:10,position:"relative"}}>
              Torodo<span style={{color:"#C9956A",fontStyle:"italic"}}>Business</span>
            </h1>
            <p style={{fontFamily:"Jost,sans-serif",fontSize:11,color:P.muted,letterSpacing:"3px",textTransform:"uppercase",marginBottom:18,position:"relative"}}>Soins · Beauté · Parfumerie — Dakar</p>
            <p style={{fontFamily:"Cormorant Garamond,serif",fontStyle:"italic",fontSize:"clamp(15px,3vw,19px)",color:P.muted,maxWidth:500,margin:"0 auto 36px",lineHeight:1.65,position:"relative"}}>
              Des soins d'exception et des parfums envoûtants pour sublimer votre beauté naturelle.
            </p>
            <div className="hero-btns">
              <a href="#catalogue" style={{background:P.roseDark,color:"#fff",borderRadius:99,padding:"14px 36px",fontFamily:"Jost,sans-serif",fontSize:13,fontWeight:600,letterSpacing:"1px",textTransform:"uppercase"}}>Découvrir</a>
              <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer"
                style={{background:"transparent",color:P.roseDark,border:`2px solid ${P.roseDark}`,borderRadius:99,padding:"14px 36px",fontFamily:"Jost,sans-serif",fontSize:13,fontWeight:500,letterSpacing:"1px",textTransform:"uppercase"}}>
                Nous contacter
              </a>
            </div>
          </section>
        )}

        {/* TRUST BAR */}
        {cat==="Tout"&&!search&&(
          <div className="trust-bar">
            {[["🚚","Livraison rapide"],["🔒","100% authentique"],["↩","Retours 7 jours"],["🌸","+1000 clientes"]].map(([ic,t])=>(
              <span key={t}>{ic} {t}</span>
            ))}
          </div>
        )}

        {/* COUPS DE CŒUR */}
        {cat==="Tout"&&!search&&topProds.length>0&&(
          <section className="featured-section" style={{maxWidth:1200,margin:"0 auto",padding:"48px 32px 0"}} aria-label="Coups de cœur">
            <div style={{textAlign:"center",marginBottom:24}}>
              <p style={{fontFamily:"Jost,sans-serif",fontSize:10,letterSpacing:"3px",textTransform:"uppercase",color:P.roseGold,marginBottom:8}}>✦ Notre Sélection ✦</p>
              <h2 style={{fontFamily:"Cormorant Garamond,serif",fontSize:"clamp(24px,5vw,34px)",fontWeight:600,color:P.black}}>Coups de Cœur</h2>
            </div>
            <div className="featured-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14}}>
              {topProds.map(p=>(
                <Link key={p.id} href={`/produits/${p.id}`}
                  style={{display:"flex",gap:14,alignItems:"center",padding:"18px 20px",background:`linear-gradient(135deg,${P.blush},#FEF4F0)`,borderRadius:16,border:`1px solid ${P.border}`}}>
<div style={{width:54,height:54,borderRadius:12,overflow:"hidden",flexShrink:0,background:"rgba(196,122,122,0.1)",display:"flex",alignItems:"center",justifyContent:"center"}}>
  {p.media && p.media.length > 0
    ? <img src={p.media[0].data} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
    : <span style={{fontSize:26,opacity:0.4}}>📷</span>
  }
</div>                  <div>
                    <p style={{fontFamily:"Cormorant Garamond,serif",fontSize:15,fontWeight:600,color:P.black,marginBottom:4}}>{p.name}</p>
                    <p style={{fontFamily:"Jost,sans-serif",fontSize:13,color:P.roseDark,fontWeight:600}}>{fmt(p.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CATALOGUE */}
        <section id="catalogue" className="catalogue-section" aria-label="Catalogue">
          <div className="catalogue-header">
            <div>
              {!search&&<p style={{fontFamily:"Jost,sans-serif",fontSize:10,letterSpacing:"3px",textTransform:"uppercase",color:P.roseGold,marginBottom:6}}>✦ Collection ✦</p>}
              <h2 style={{fontFamily:"Cormorant Garamond,serif",fontSize:"clamp(22px,5vw,30px)",fontWeight:600,color:P.black}}>
                {search?`"${search}"`:cat==="Tout"?"Tous les produits":cat}
              </h2>
            </div>
            <span style={{fontFamily:"Jost,sans-serif",fontSize:12,color:P.muted}}>{filtered.length} produit{filtered.length>1?'s':''}</span>
          </div>
          {filtered.length===0
            ?<div style={{textAlign:"center",padding:"70px 0"}}>
              <div style={{fontSize:52,marginBottom:14}}>🌸</div>
              <p style={{fontFamily:"Cormorant Garamond,serif",fontSize:20,color:P.muted}}>Aucun produit trouvé</p>
              {search&&<button onClick={()=>setSearch("")} style={{marginTop:14,background:"transparent",color:P.roseDark,border:`1.5px solid ${P.roseDark}`,borderRadius:99,padding:"9px 22px",fontFamily:"Jost,sans-serif",fontSize:12,cursor:"pointer"}}>Effacer</button>}
            </div>
            :<div className="product-grid">
              {filtered.map(p=><ProductCard key={p.id} p={p} onAdd={addToCart}/>)}
            </div>
          }
        </section>
      </main>

      {/* FOOTER */}
      <footer style={{background:P.black,color:"rgba(255,255,255,0.65)",padding:"48px 32px 24px"}}>
        <div className="footer-grid">
          <div style={{maxWidth:260}}>
            <p style={{fontFamily:"Cormorant Garamond,serif",fontSize:20,fontWeight:700,color:"#fff",marginBottom:4}}><span style={{color:"#C9956A",fontStyle:"italic"}}>Torodo</span>Business</p>
            <p style={{fontFamily:"Jost,sans-serif",fontSize:9,letterSpacing:"2px",color:P.roseGoldLight,textTransform:"uppercase",marginBottom:14}}>Soins · Beauté · Parfumerie</p>
            <p style={{fontFamily:"Jost,sans-serif",fontSize:13,lineHeight:1.75}}>Votre destination beauté à Dakar — produits authentiques, qualité premium.</p>
          </div>
          <nav>
            <p style={{fontFamily:"Jost,sans-serif",fontSize:9,textTransform:"uppercase",letterSpacing:"2px",color:P.roseGoldLight,marginBottom:14}}>Contact</p>
            <p style={{fontFamily:"Jost,sans-serif",fontSize:13,marginBottom:8}}>📲 {SITE.phone}</p>
            <p style={{fontFamily:"Jost,sans-serif",fontSize:13,marginBottom:8}}>📧 {SITE.email}</p>
            <p style={{fontFamily:"Jost,sans-serif",fontSize:13,marginBottom:8}}>📍 {SITE.address}</p>
            <p style={{fontFamily:"Jost,sans-serif",fontSize:13,marginBottom:4}}>🕐 {SITE.hoursWeek}</p>
            <p style={{fontFamily:"Jost,sans-serif",fontSize:13}}>🕐 {SITE.hoursWeekend}</p>
          </nav>
          <nav>
            <p style={{fontFamily:"Jost,sans-serif",fontSize:9,textTransform:"uppercase",letterSpacing:"2px",color:P.roseGoldLight,marginBottom:14}}>Suivez-nous</p>
            <p style={{fontFamily:"Jost,sans-serif",fontSize:13,marginBottom:8}}><a href={SITE.instagram} target="_blank" rel="noreferrer" style={{color:"rgba(255,255,255,0.65)"}}>📸 Instagram</a></p>
            <p style={{fontFamily:"Jost,sans-serif",fontSize:13,marginBottom:8}}><a href={SITE.facebook} target="_blank" rel="noreferrer" style={{color:"rgba(255,255,255,0.65)"}}>👥 Facebook</a></p>
            <p style={{fontFamily:"Jost,sans-serif",fontSize:13,marginBottom:8}}><a href={SITE.tiktok} target="_blank" rel="noreferrer" style={{color:"rgba(255,255,255,0.65)"}}>🎵 TikTok</a></p>
          </nav>
        </div>
        <div className="footer-bottom" style={{borderTop:"1px solid rgba(255,255,255,0.07)",paddingTop:20}}>
          <p style={{fontFamily:"Jost,sans-serif",fontSize:11,color:"rgba(255,255,255,0.25)"}}>© 2025 Torodo Business · Dakar, Sénégal</p>
          <p style={{fontFamily:"Cormorant Garamond,serif",fontSize:13,fontStyle:"italic",color:P.rose}}>Votre beauté mérite le meilleur ✦</p>
        </div>
      </footer>

      {cartOpen&&<CartPanel items={cart} onClose={()=>setCartOpen(false)} onRemove={id=>setCart(c=>c.filter(i=>i.id!==id))} onQty={(id,d)=>setCart(c=>c.map(i=>i.id===id?{...i,qty:Math.max(1,i.qty+d)}:i))}/>}

      <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer"
        style={{position:"fixed",bottom:24,right:20,width:56,height:56,background:P.green,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,boxShadow:"0 6px 28px rgba(37,211,102,0.5)",zIndex:49}}
        aria-label="Commander sur WhatsApp">📲</a>
    </>
  );
}

export async function getStaticProps() {
  try {
    const [products, categories] = await Promise.all([
      getProducts(),
      getCategories(),
    ]);

    return {
      props: {
        products:   products.length > 0 ? products : PRODUCTS,
        categories: ["Tout", ...(categories.length > 0 ? categories : ["Soins","Beauté","Parfumerie","Nouveautés"])],
      },
      revalidate: 30,
    };
  } catch (error) {
    // Si Supabase est inaccessible, on affiche quand même le site
    console.error("Supabase error:", error);
    return {
      props: {
        products:   PRODUCTS,
        categories: ["Tout","Soins","Beauté","Parfumerie","Nouveautés"],
      },
      revalidate: 10,
    };
  }
}
