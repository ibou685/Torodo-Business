import { useState } from 'react';
import Link from 'next/link';
import SEO from '../../components/SEO';
import { SITE } from '../../lib/products';
import { getProductById, getProducts } from '../../lib/supabase';

const P = {
  blush:"#FDE8E8",rose:"#E8A4A4",roseDark:"#C47A7A",
  roseGold:"#C9956A",black:"#1A1010",muted:"#8C6E6E",mutedLight:"#B09090",
  border:"#F0D8D8",bg:"#FDF8F6",surface:"#FFFFFF",green:"#25D366",
};
const fmt = p => new Intl.NumberFormat('fr-FR').format(p)+' FCFA';

function Stars({n,size=14}){ return <span style={{color:P.roseGold,fontSize:size}}>{'★'.repeat(n)}{'☆'.repeat(5-n)}</span>; }
function Badge({text}){
  if(!text)return null;
  const m={"Best-seller":{bg:"#FEF0F0",c:"#C47A7A"},"Nouveau":{bg:"#F0F8F0",c:"#4A8A5A"},"Promo":{bg:"#FEF3E8",c:"#B87A2A"},"Bio":{bg:"#F0F8F0",c:"#3A7A4A"},"Premium":{bg:"#1A1010",c:"#E8C4A0"},"Exclusif":{bg:"#F8F0FE",c:"#8A4AB8"}};
  const s=m[text]||{bg:"#F5F5F5",c:"#666"};
  return <span style={{background:s.bg,color:s.c,fontSize:11,fontWeight:600,padding:"4px 12px",borderRadius:99,letterSpacing:"0.8px",textTransform:"uppercase"}}>{text}</span>;
}

export default function ProductPage({product,relatedProducts}){
  const[qty,setQty]=useState(1);
  if(!product)return null;
  const msg=encodeURIComponent(`Bonjour Torodo Business 🌸\n\nJe souhaite commander :\n• ${product.name} x${qty} — ${fmt(product.price*qty)}\n\n💰 Total : ${fmt(product.price*qty)}`);
  return(
    <>
      <SEO title={`${product.name} — ${product.cat}`} description={product.desc} canonical={`/produits/${product.id}`} type="product" product={product}/>

      {/* HEADER */}
      <header className="detail-header" style={{background:"rgba(253,248,246,0.97)",borderBottom:`1px solid ${P.border}`,padding:"0 20px",height:60,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50,backdropFilter:"blur(20px)"}}>
        <Link href="/" style={{fontFamily:"Cormorant Garamond,serif",fontSize:19,fontWeight:700,color:P.black}}>
          Torodo<span style={{color:P.roseDark,fontStyle:"italic"}}>Business</span>
        </Link>
        <div style={{display:"flex",gap:10}}>
          <Link href="/" className="detail-back-btn"
            style={{padding:"8px 16px",borderRadius:99,border:`1.5px solid ${P.border}`,fontFamily:"Jost,sans-serif",fontSize:12,color:P.muted,display:"flex",alignItems:"center",gap:6}}>
            ← <span>Boutique</span>
          </Link>
          <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer"
            style={{display:"flex",alignItems:"center",gap:6,background:P.green,color:"#fff",borderRadius:10,padding:"8px 14px",fontFamily:"Jost,sans-serif",fontSize:12,fontWeight:600}}>
            📲
          </a>
        </div>
      </header>

      <main className="product-detail-section" style={{maxWidth:1100,margin:"0 auto",padding:"40px 24px 80px"}}>
        {/* Fil d'Ariane */}
        <nav aria-label="Fil d'Ariane" style={{marginBottom:28}}>
          <ol style={{display:"flex",gap:8,listStyle:"none",fontFamily:"Jost,sans-serif",fontSize:12,color:P.muted,flexWrap:"wrap"}}>
            <li><Link href="/" style={{color:P.roseDark}}>Accueil</Link></li>
            <li>›</li>
            <li><Link href={`/#catalogue`} style={{color:P.roseDark}}>{product.cat}</Link></li>
            <li>›</li>
            <li aria-current="page">{product.name}</li>
          </ol>
        </nav>

        {/* GRILLE 2 colonnes desktop / 1 colonne mobile */}
        <div className="product-detail-grid">

          {/* Visuel */}
          <div>
            <div className="product-visual" style={{background:`linear-gradient(145deg,${P.blush},#FEE8E8)`,borderRadius:20,height:400,display:"flex",alignItems:"center",justifyContent:"center",fontSize:120,position:"relative"}}>
                 {product.media && product.media.length > 0
                ? product.media[0].type === 'image'
                  ? <img
                      src={product.media[0].data}
                      alt={product.name}
                      style={{ width:"100%", height:"100%", objectFit:"cover" }}
                    />
                  : <video
                      src={product.media[0].data}
                      controls
                      style={{ width:"100%", height:"100%", objectFit:"cover" }}
                    />
                : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:120 }}>
                    {product.icon}
                  </div>
              }
              {product.badge && (
                <div style={{ position:"absolute", top:16, left:16 }}>
                  <Badge text={product.badge}/>
                </div>
              )}
            </div>
          </div>

          {/* Infos */}
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <Badge text={product.badge}/>
              <span style={{fontFamily:"Jost,sans-serif",fontSize:11,color:P.muted,textTransform:"uppercase",letterSpacing:"1.5px"}}>{product.cat}</span>
            </div>
            <h1 className="product-h1" style={{fontFamily:"Cormorant Garamond,serif",fontSize:36,fontWeight:700,color:P.black,lineHeight:1.1,marginBottom:12}}>{product.name}</h1>
            <Stars n={product.stars} size={16}/>
            <p style={{fontFamily:"Jost,sans-serif",fontSize:14,color:P.muted,lineHeight:1.8,margin:"18px 0 22px"}}>{product.longDesc}</p>

            {/* Prix */}
            <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:26}}>
              <span className="product-price" style={{fontFamily:"Cormorant Garamond,serif",fontSize:32,fontWeight:700,color:P.roseDark}}>{fmt(product.price)}</span>
              {product.oldPrice&&<>
                <span style={{fontFamily:"Jost,sans-serif",fontSize:16,color:P.mutedLight,textDecoration:"line-through"}}>{fmt(product.oldPrice)}</span>
                <span style={{fontFamily:"Jost,sans-serif",fontSize:12,color:"#4A8A5A",fontWeight:600,background:"#F0F8F0",padding:"3px 10px",borderRadius:99}}>-{Math.round((1-product.price/product.oldPrice)*100)}%</span>
              </>}
            </div>

            {/* Quantité + Commander */}
            <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",border:`1.5px solid ${P.border}`,borderRadius:12,overflow:"hidden"}}>
                <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{width:46,height:50,background:"none",border:"none",cursor:"pointer",color:P.roseDark,fontSize:22}}>−</button>
                <span style={{width:44,textAlign:"center",fontFamily:"Jost,sans-serif",fontSize:16,fontWeight:500}}>{qty}</span>
                <button onClick={()=>setQty(q=>q+1)} style={{width:46,height:50,background:"none",border:"none",cursor:"pointer",color:P.roseDark,fontSize:22}}>+</button>
              </div>
              <a href={`https://wa.me/${SITE.whatsapp}?text=${msg}`} target="_blank" rel="noreferrer"
                style={{flex:1,background:P.roseDark,color:"#fff",borderRadius:12,height:50,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Jost,sans-serif",fontSize:13,fontWeight:600,letterSpacing:"0.8px",textTransform:"uppercase",gap:8}}>
                📲 Commander · {fmt(product.price*qty)}
              </a>
            </div>

            {/* Garanties */}
            <div className="product-guarantees" style={{display:"flex",gap:20,padding:"16px 0",borderTop:`1px solid ${P.border}`,borderBottom:`1px solid ${P.border}`,marginBottom:24,flexWrap:"wrap"}}>
              {[["🚚","Livraison rapide"],["↩","Retours 7 jours"],["🔒","Garanti authentique"]].map(([ic,t])=>(
                <div key={t} style={{display:"flex",alignItems:"center",gap:7}}>
                  <span style={{fontSize:18}}>{ic}</span>
                  <span style={{fontFamily:"Jost,sans-serif",fontSize:11,color:P.muted}}>{t}</span>
                </div>
              ))}
            </div>

            {/* Ingrédients */}
            {product.ingredients?.length>0&&(
              <div>
                <h2 style={{fontFamily:"Jost,sans-serif",fontSize:11,textTransform:"uppercase",letterSpacing:"1.5px",color:P.muted,marginBottom:10}}>Ingrédients principaux</h2>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {product.ingredients.map(ing=>(
                    <span key={ing} style={{fontFamily:"Jost,sans-serif",fontSize:12,background:P.blush,color:P.roseDark,padding:"5px 12px",borderRadius:99}}>{ing}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Produits similaires */}
        {relatedProducts.length>0&&(
          <section style={{marginTop:64}} aria-label="Produits similaires">
            <div style={{textAlign:"center",marginBottom:28}}>
              <p style={{fontFamily:"Jost,sans-serif",fontSize:10,letterSpacing:"3px",textTransform:"uppercase",color:P.roseGold,marginBottom:8}}>✦ Vous aimerez aussi ✦</p>
              <h2 style={{fontFamily:"Cormorant Garamond,serif",fontSize:"clamp(22px,5vw,30px)",fontWeight:600,color:P.black}}>Produits similaires</h2>
            </div>
            <div className="related-grid">
              {relatedProducts.map(rp=>(
                <Link key={rp.id} href={`/produits/${rp.id}`}
                  style={{background:P.surface,borderRadius:14,overflow:"hidden",border:`1px solid ${P.border}`,display:"flex",flexDirection:"column"}}>
                  <div style={{height:150,background:`linear-gradient(145deg,${P.blush},#FEF0F0)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:56}}>{rp.icon}</div>
                  <div style={{padding:"12px 14px"}}>
                    <p style={{fontFamily:"Cormorant Garamond,serif",fontSize:15,fontWeight:600,color:P.black,marginBottom:6}}>{rp.name}</p>
                    <p style={{fontFamily:"Jost,sans-serif",fontSize:13,fontWeight:600,color:P.roseDark}}>{fmt(rp.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer"
        style={{position:"fixed",bottom:24,right:20,width:56,height:56,background:P.green,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,boxShadow:"0 6px 28px rgba(37,211,102,0.5)",zIndex:49}}
        aria-label="Commander sur WhatsApp">📲</a>
    </>
  );
}

export async function getStaticPaths(){
  const products = await getProducts();
  return{
    paths: products.map(p => ({ params:{ id: String(p.id) } })),
    fallback: 'blocking', // Génère les nouvelles pages à la demande
  };
}

export async function getStaticProps({ params }){
  const product = await getProductById(params.id);
  if(!product) return { notFound: true };

  const allProducts = await getProducts();
  const related = allProducts
    .filter(p => p.cat === product.cat && p.id !== product.id)
    .slice(0, 4);

  return {
    props: { product, relatedProducts: related },
    revalidate: 30,
  };
}
