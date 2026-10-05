// Cart kept in the visitor's browser (localStorage). Items are product slugs + quantity;
// titles and prices are always taken from the current page data, never from storage.
const KEY = 'aa-cart';

export type CartItem = { slug: string; qty: number };

export function readCart(): CartItem[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(raw) ? raw.filter((i) => i && typeof i.slug === 'string' && i.qty > 0) : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  window.dispatchEvent(new CustomEvent('cart:change'));
}

export function addToCart(slug: string, qty = 1) {
  const items = readCart();
  const found = items.find((i) => i.slug === slug);
  if (found) found.qty = Math.min(found.qty + qty, 99);
  else items.push({ slug, qty });
  writeCart(items);
}

export function setQty(slug: string, qty: number) {
  writeCart(readCart().map((i) => (i.slug === slug ? { ...i, qty: Math.max(1, Math.min(qty, 99)) } : i)));
}

export function removeFromCart(slug: string) {
  writeCart(readCart().filter((i) => i.slug !== slug));
}

export function clearCart() {
  writeCart([]);
}

export const cartCount = () => readCart().reduce((n, i) => n + i.qty, 0);
