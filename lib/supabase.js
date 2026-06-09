import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Produits ──────────────────────────────────────────────
export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('position', { ascending: true });

  if (error) { console.error('getProducts:', error); return []; }
  return data.map(formatProduct);
}

export async function getProductById(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) { console.error('getProductById:', error); return null; }
  return formatProduct(data);
}

export async function createProduct(product) {
  const { data, error } = await supabase
    .from('products')
    .insert([toDbFormat(product)])
    .select()
    .single();

  if (error) { console.error('createProduct:', error); return null; }
  return formatProduct(data);
}

export async function updateProduct(id, product) {
  const { data, error } = await supabase
    .from('products')
    .update(toDbFormat(product))
    .eq('id', id)
    .select()
    .single();

  if (error) { console.error('updateProduct:', error); return null; }
  return formatProduct(data);
}

export async function deleteProduct(id) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) { console.error('deleteProduct:', error); return false; }
  return true;
}

// ─── Catégories ────────────────────────────────────────────
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('position', { ascending: true });

  if (error) { console.error('getCategories:', error); return []; }
  return data.map(c => c.name);
}

export async function createCategory(name) {
  const { error } = await supabase
    .from('categories')
    .insert([{ name }]);

  if (error) { console.error('createCategory:', error); return false; }
  return true;
}

export async function deleteCategory(name) {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('name', name);

  if (error) { console.error('deleteCategory:', error); return false; }
  return true;
}

// ─── Formatage ─────────────────────────────────────────────
// Convertit les noms de colonnes Supabase (snake_case)
// vers le format utilisé dans le code React (camelCase)
function formatProduct(p) {
  return {
    id:          p.id,
    name:        p.name,
    price:       p.price,
    oldPrice:    p.old_price    ?? null,
    cat:         p.category,
    badge:       p.badge        ?? null,
    stars:       p.stars        ?? 5,
    desc:        p.description,
    longDesc:    p.long_description ?? null,
    ingredients: p.ingredients  || [],
    media:       p.media        || [],
    active:      p.active       ?? true,
    position:    p.position     ?? 0,
  };
}

// Convertit le format React vers Supabase avant sauvegarde
function toDbFormat(p) {
  return {
    name:             p.name,
    price:            Number(p.price),
    old_price:        p.oldPrice ? Number(p.oldPrice) : null,
    category:         p.cat,
    badge:            p.badge || null,
    stars:            p.stars,
    description:      p.desc,
    long_description: p.longDesc || p.desc,
    ingredients:      Array.isArray(p.ingredients) ? p.ingredients : [],
    media:            p.media || [],
    active:           true,
    position:         p.position ?? 0,  // ← ajoutez cette ligne
  };
}

// ─── Authentification ──────────────────────────────────────
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return { success: false, message: error.message };
  return { success: true, user: data.user };
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

// ─── Storage — Upload fichiers ─────────────────────────────
export async function uploadMedia(file, productId) {
  const ext      = file.name.split('.').pop();
  const filename = `${productId}/${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from('products')
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) { console.error('uploadMedia:', error); return null; }

  // Retourne l'URL publique du fichier
  const { data: urlData } = supabase.storage
    .from('products')
    .getPublicUrl(filename);

  return {
    type: file.type.startsWith('video/') ? 'video' : 'image',
    data: urlData.publicUrl,
    name: file.name,
  };
}

export async function deleteMedia(url) {
  try {
    // Extrait et décode le chemin depuis l'URL publique
    const parts = url.split('/object/public/products/');
    if (parts.length < 2) return;
    const path = decodeURIComponent(parts[1]);

    const { error } = await supabase.storage
      .from('products')
      .remove([path]);

    if (error) console.error('deleteMedia:', error);
  } catch (e) {
    console.error('deleteMedia error:', e);
  }
} 