"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  STORE,
  PRODUCTS,
  PLANETA_HIGHLIGHT_IDS,
  BESTSELLERS_IDS,
} from "./catalogo.data";

const BRAND_RED = "#bc1717";
const FREE_SHIPPING_THRESHOLD = 199999;

// Categorías de navegación
const NAV_CATEGORIES = [
  "Todo",
  "Planeta Fútbol",
  "Deportivo",
  "Accesorios",
  "Para el hogar",
];

/* ---------- Helpers ---------- */
function formatARS(value) {
  const v = Number(value) || 0;
  try {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: STORE.currency || "ARS",
      maximumFractionDigits: 0,
    }).format(v);
  } catch {
    return `$ ${v}`;
  }
}

function pickByIds(ids, list) {
  const map = new Map(list.map((p) => [p.id, p]));
  return (ids || []).map((id) => map.get(id)).filter(Boolean);
}

function hasSizes(product) {
  return Array.isArray(product?.variants?.size) && product.variants.size.length > 0;
}

function normalizeStr(s) {
  return String(s || "").toLowerCase().trim();
}

function buildWhatsAppHref(product) {
  const msg = `Hola, tengo una consulta sobre: ${product?.name || "Producto"}.`;
  return `https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(msg)}`;
}

/* ---------- Icons ---------- */
function IconHeart({ filled = false, className = "" }) {
  return filled ? (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 21s-7-4.35-9.33-8.5C.9 9.19 2.62 6 6.11 6c1.9 0 3.2 1.01 3.89 2.02C10.8 7.01 12.1 6 14 6c3.49 0 5.21 3.19 3.44 6.5C19 16.65 12 21 12 21z"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12.1 20.3l-.1.1-.1-.1C8 16.9 3.5 13.8 3.5 9.9 3.5 7.5 5.2 6 7.3 6c1.4 0 2.7.8 3.3 2h1c.6-1.2 1.9-2 3.3-2 2.1 0 3.8 1.5 3.8 3.9 0 3.9-4.5 7-8.6 10.4zM7.3 4.5C4.3 4.5 2 6.6 2 9.9c0 4.6 5 8 9.5 11.6l.5.4.5-.4C17 17.9 22 14.5 22 9.9c0-3.3-2.3-5.4-5.3-5.4-1.7 0-3.3.8-4.2 2.1-.9-1.3-2.5-2.1-4.2-2.1z"
      />
    </svg>
  );
}

function IconCart({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.2 14h9.9c.8 0 1.5-.5 1.8-1.2l2.1-6.1c.3-.9-.3-1.9-1.2-1.9H6.1L5.7 2.6C5.6 2.2 5.2 2 4.8 2H2v2h2.1l2.3 10.5C6.6 13.3 6.9 14 7.2 14z"
      />
    </svg>
  );
}

function IconSearch({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M10 18a8 8 0 1 1 5.3-14 8 8 0 0 1-5.3 14zm11 3-5.2-5.2 1.4-1.4L22.4 19.6 21 21z"
      />
    </svg>
  );
}

/* ---------- Components ---------- */

// Título de sección con barra roja vertical (Estilo Imagen)
function SectionTitle({ title }) {
    return (
        <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-1.5 rounded-sm" style={{ backgroundColor: BRAND_RED }}></div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                {title}
            </h3>
        </div>
    );
}

function ProductCard({ product, isFav, onToggleFav, onOpen }) {
  const images =
    Array.isArray(product?.images) && product.images.length
      ? product.images
      : ["/tienda/placeholder.webp"];

  return (
    <article
      onClick={() => onOpen(product)}
      className="group cursor-pointer rounded-2xl border border-neutral-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col h-full"
    >
      <div className="relative bg-neutral-50 aspect-[4/5] overflow-hidden w-full">
        <Image
          src={images[0]}
          alt={product.name}
          fill
          className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 90vw, 360px"
        />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFav(product.id);
          }}
          className="absolute top-3 right-3 rounded-full bg-white/95 border border-neutral-200 p-2 hover:bg-white z-10 shadow-sm transition-transform active:scale-95"
        >
          <IconHeart
            filled={isFav}
            className={["h-5 w-5", isFav ? "text-red-600" : "text-neutral-900"].join(" ")}
          />
        </button>

        {product.vendor ? (
          <div className="absolute left-3 top-3 rounded-md bg-white/90 border border-neutral-200 px-2 py-1 text-[10px] font-bold text-neutral-900 uppercase tracking-wider">
            {product.vendor}
          </div>
        ) : null}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
            <h3 className="text-sm font-bold text-neutral-900 leading-snug line-clamp-2 min-h-[2.5em] flex-1 pr-2">
            {product.name}
            </h3>
        </div>
        <div className="mt-auto">
            <p className="text-lg font-extrabold text-neutral-900 whitespace-nowrap">
                {formatARS(product.price)}
            </p>
            <p className="mt-1 text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
            {(product.category || "Producto")}
            </p>
        </div>
      </div>
    </article>
  );
}

// Fila de sección para la Home
function SectionRow({ title, products, favIds, onToggleFav, onOpen }) {
    if (!products || products.length === 0) return null;
    return (
        <div className="mb-16">
            <SectionTitle title={title} />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {products.map(p => (
                     <ProductCard
                     key={p.id}
                     product={p}
                     isFav={favIds.includes(p.id)}
                     onToggleFav={onToggleFav}
                     onOpen={onOpen}
                   />
                ))}
            </div>
        </div>
    )
}

function ProductModal({ product, isFav, onToggleFav, onClose, onAddToCart, onBuyNow }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const images = Array.isArray(product.images) && product.images.length
    ? product.images
    : ["/tienda/placeholder.webp"];

  const needSize = hasSizes(product);
  const currentStock = product.stock !== undefined ? product.stock : 10;
  const hasStock = currentStock > 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:w-[min(1040px,100%)] bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col sm:block animate-fade-in-up">
        
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-20 p-2 bg-white/80 rounded-full sm:hidden"
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="flex-1 overflow-auto sm:overflow-hidden h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 h-full">
            {/* Gallery */}
            <div className="p-6 bg-neutral-50 flex flex-col justify-center items-center">
              <div className="relative aspect-square w-full max-w-md rounded-2xl bg-white border border-neutral-100 shadow-sm overflow-hidden">
                <Image
                  src={images[imgIdx]}
                  alt={product.name}
                  fill
                  className="object-contain p-8"
                  sizes="(max-width: 768px) 90vw, 520px"
                />
              </div>
              {images.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className={`relative h-16 w-16 rounded-lg border overflow-hidden transition-all ${i === imgIdx ? 'border-neutral-900 ring-1 ring-neutral-900' : 'border-neutral-200'}`}
                    >
                      <Image src={src} alt="" fill className="object-contain p-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-6 md:p-10 flex flex-col overflow-y-auto">
              <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="text-xs font-bold tracking-[0.2em] text-neutral-500 uppercase mb-2">{(product.category || "Producto")}</p>
                    <h3 className="text-3xl font-extrabold text-neutral-900 leading-tight">{product.name}</h3>
                    <p className="mt-2 text-2xl font-bold text-neutral-900">{formatARS(product.price)}</p>
                  </div>
                  <button onClick={onClose} className="hidden sm:block text-neutral-400 hover:text-neutral-900"><svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => onToggleFav(product.id)}
                  className="inline-flex items-center gap-2 text-sm font-bold text-neutral-700 hover:text-red-600 transition-colors"
                >
                  <IconHeart className={isFav ? "text-red-600 w-5 h-5" : "w-5 h-5"} filled={isFav} />
                  {isFav ? "Guardado en favoritos" : "Agregar a favoritos"}
                </button>
              </div>

              {product.description && <p className="mt-4 text-neutral-600 leading-relaxed">{product.description}</p>}

              <div className="my-8 h-px bg-neutral-100" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-neutral-900 uppercase">
                        {needSize ? "Talle" : "Opción"}
                    </label>
                    {needSize ? (
                         <select value={size} onChange={(e) => setSize(e.target.value)} className="mt-2 w-full rounded-xl border border-neutral-300 px-3 py-3 text-sm font-medium outline-none focus:border-black">
                            <option value="">Seleccionar</option>
                            {product.variants.size.map(s => <option key={s} value={s}>{s}</option>)}
                         </select>
                    ) : (
                        <div className="mt-2 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-3 text-sm font-medium text-neutral-500">Única</div>
                    )}
                </div>
                <div>
                    <label className="text-xs font-bold text-neutral-900 uppercase">Cantidad</label>
                    <select value={qty} onChange={(e) => setQty(Number(e.target.value))} disabled={!hasStock} className="mt-2 w-full rounded-xl border border-neutral-300 px-3 py-3 text-sm font-medium outline-none focus:border-black">
                        {hasStock ? Array.from({length: Math.min(10, currentStock)}).map((_,i) => <option key={i+1} value={i+1}>{i+1}</option>) : <option>0</option>}
                    </select>
                </div>
              </div>

              <div className="mt-8 flex gap-3 flex-col sm:flex-row">
                 {hasStock ? (
                    <>
                        <button 
                            onClick={() => { if(needSize && !size) return alert("Seleccioná talle"); onAddToCart(product, {size, qty}); }}
                            className="flex-1 rounded-xl py-4 text-sm font-extrabold text-white shadow-lg hover:opacity-90 transition-all"
                            style={{ backgroundColor: BRAND_RED }}
                        >
                            AGREGAR AL CARRITO
                        </button>
                        <button 
                            onClick={() => { if(needSize && !size) return alert("Seleccioná talle"); onBuyNow(product, {size, qty}); }}
                            className="flex-1 rounded-xl border-2 border-neutral-900 py-4 text-sm font-extrabold text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all"
                        >
                            COMPRAR AHORA
                        </button>
                    </>
                 ) : (
                     <div className="w-full py-4 text-center bg-neutral-100 rounded-xl font-bold text-neutral-400">SIN STOCK</div>
                 )}
              </div>
              
               <a href={buildWhatsAppHref(product)} target="_blank" rel="noreferrer" className="mt-4 text-center text-xs text-neutral-500 hover:underline">
                    ¿Dudas? Consultar a un vendedor
               </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartModal({ open, onClose, cart, setQty, removeFromCart, buyer, setBuyer, delivery, setDelivery, subtotal, shippingCost, total, paying, onCheckout }) {
    if (!open) return null;
    const itemsCount = cart.reduce((acc, x) => acc + (x.qty || 1), 0);
  
    return (
      <div className="fixed inset-0 z-[70] flex justify-end">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-slide-in-right">
            {/* Header Cart */}
            <div className="p-5 border-b border-neutral-100 flex justify-between items-center bg-white z-10">
                <div>
                    <h2 className="text-xl font-extrabold text-neutral-900">Tu Carrito</h2>
                    <p className="text-sm text-neutral-500">{itemsCount} productos</p>
                </div>
                <button onClick={onClose} className="p-2 bg-neutral-100 rounded-full hover:bg-neutral-200"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-neutral-400">
                        <IconCart className="w-16 h-16 opacity-20 mb-3" />
                        <p>El carrito está vacío</p>
                    </div>
                ) : (
                    <>
                        {/* Items */}
                        <div className="space-y-4">
                            {cart.map(x => (
                                <div key={x.key} className="flex gap-4 p-3 bg-neutral-50 rounded-xl border border-neutral-100 relative group">
                                    <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-neutral-200">
                                        <Image src={x.image} alt={x.name} fill className="object-contain p-1" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-neutral-900 line-clamp-1 pr-6">{x.name}</h4>
                                        <p className="text-xs text-neutral-500 mb-2">{x.variant?.size ? `Talle: ${x.variant.size}` : 'Único'}</p>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center bg-white border border-neutral-200 rounded-lg">
                                                <button onClick={() => setQty(x.key, Math.max(1, (x.qty||1)-1))} className="px-2 py-1 text-xs hover:bg-neutral-50">-</button>
                                                <span className="px-1 text-xs font-bold">{x.qty}</span>
                                                <button onClick={() => setQty(x.key, (x.qty||1)+1)} className="px-2 py-1 text-xs hover:bg-neutral-50">+</button>
                                            </div>
                                            <span className="text-sm font-bold">{formatARS(x.price * x.qty)}</span>
                                        </div>
                                        <button onClick={() => removeFromCart(x.key)} className="absolute top-2 right-2 text-neutral-300 hover:text-red-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Form Buyer */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-widest">Tus Datos</h3>
                            <input placeholder="Nombre completo" value={buyer.fullName} onChange={e => setBuyer({...buyer, fullName: e.target.value})} className="w-full p-3 bg-neutral-50 rounded-xl text-sm border border-neutral-200 outline-none focus:border-black transition-colors" />
                            <input placeholder="Teléfono" value={buyer.phone} onChange={e => setBuyer({...buyer, phone: e.target.value})} className="w-full p-3 bg-neutral-50 rounded-xl text-sm border border-neutral-200 outline-none focus:border-black transition-colors" />
                        </div>

                        {/* Delivery */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-widest">Entrega</h3>
                            <div className="flex gap-2">
                                <button onClick={() => setDelivery("retiro")} className={`flex-1 py-2 text-sm font-bold rounded-xl border ${delivery === "retiro" ? "bg-black text-white border-black" : "bg-white text-neutral-600 border-neutral-200"}`}>Retiro</button>
                                <button onClick={() => setDelivery("envio")} className={`flex-1 py-2 text-sm font-bold rounded-xl border ${delivery === "envio" ? "bg-black text-white border-black" : "bg-white text-neutral-600 border-neutral-200"}`}>Envío</button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Footer Cart */}
            {cart.length > 0 && (
                <div className="p-5 border-t border-neutral-100 bg-neutral-50">
                    <div className="flex justify-between text-sm mb-2"><span className="text-neutral-500">Subtotal</span><span className="font-bold">{formatARS(subtotal)}</span></div>
                    <div className="flex justify-between text-sm mb-4"><span className="text-neutral-500">Envío</span><span className="font-bold">{delivery === "envio" ? formatARS(shippingCost) : "Gratis"}</span></div>
                    <div className="flex justify-between text-xl font-extrabold mb-4"><span>Total</span><span>{formatARS(total)}</span></div>
                    <button onClick={onCheckout} disabled={paying || !buyer.fullName || !buyer.phone} className="w-full py-4 rounded-xl text-white font-bold text-sm shadow-lg hover:opacity-90 disabled:opacity-50" style={{backgroundColor: BRAND_RED}}>
                        {paying ? "PROCESANDO..." : "INICIAR PAGO"}
                    </button>
                </div>
            )}
        </div>
      </div>
    );
}

/* ---------- MAIN LAYOUT ---------- */
export default function Catalogo() {
  const [favIds, setFavIds] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = JSON.parse(window.localStorage.getItem("cabn_favs") || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    try { localStorage.setItem("cabn_favs", JSON.stringify(favIds)); } catch {}
  }, [favIds]);
  function toggleFav(id) { setFavIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]); }

  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [paying, setPaying] = useState(false);

  function addToCart(product, { size = "", qty = 1 } = {}) {
    const variant = size ? { size } : null;
    const key = `${product.id}::${variant ? JSON.stringify(variant) : ""}`;
    setCart(prev => {
      const idx = prev.findIndex(x => x.key === key);
      if (idx >= 0) {
        const copy = prev.slice();
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      return [...prev, { key, productId: product.id, name: product.name, price: Number(product.price)||0, qty, image: product.images?.[0]||"", vendor: product.vendor, variant }];
    });
  }
  function setQty(key, qty) { setCart(prev => prev.map(x => x.key === key ? { ...x, qty: Math.max(1, qty) } : x)); }
  function removeFromCart(key) { setCart(prev => prev.filter(x => x.key !== key)); }

  const cartCount = useMemo(() => cart.reduce((acc, x) => acc + (x.qty || 1), 0), [cart]);
  const subtotal = useMemo(() => cart.reduce((acc, x) => acc + (x.price * x.qty), 0), [cart]);
  const [buyer, setBuyer] = useState({ fullName: "", phone: "", email: "" });
  const [delivery, setDelivery] = useState("retiro");
  const shippingCost = useMemo(() => (delivery === "envio" ? 4500 : 0), [delivery]);
  const total = useMemo(() => subtotal + shippingCost, [subtotal, shippingCost]);

  const [pdpOpen, setPdpOpen] = useState(false);
  const [pdpProduct, setPdpProduct] = useState(null);
  function openPdp(p) { setPdpProduct(p); setPdpOpen(true); }

  const [activeCat, setActiveCat] = useState("Todo");
  const [query, setQuery] = useState("");

  const bestsellers = useMemo(() => pickByIds(BESTSELLERS_IDS, PRODUCTS), []);

  // Lógica para filtrar cuando NO estamos en "Todo"
  const visibleProducts = useMemo(() => {
    if (activeCat === "Todo") return PRODUCTS;
    let base = PRODUCTS;
    if (activeCat === "Planeta Fútbol") base = pickByIds(PLANETA_HIGHLIGHT_IDS, PRODUCTS);
    else base = PRODUCTS.filter(p => p.category === activeCat);
    
    const q = normalizeStr(query);
    if (!q) return base;
    return base.filter(p => [p.name, p.category, p.vendor].map(normalizeStr).join(" ").includes(q));
  }, [activeCat, query]);

  // Secciones temáticas para la HOME ("Todo")
  const homeSections = useMemo(() => {
     // 1. Destacados
     const destacados = bestsellers;
     // 2. Vestite con prendas del norte (Deportivo)
     const ropa = PRODUCTS.filter(p => p.category === "Deportivo" && !BESTSELLERS_IDS.includes(p.id));
     // 3. Para la cancha (Accesorios + Hidratación)
     const cancha = PRODUCTS.filter(p => ["Accesorios", "Hidratación"].includes(p.category));
     // 4. Para regalar (Hogar)
     const hogar = PRODUCTS.filter(p => p.category === "Para el hogar");

     return { destacados, ropa, cancha, hogar };
  }, [bestsellers]);

  async function checkoutOnline() {
    if (!cart.length || paying) return;
    if (!buyer.fullName || !buyer.phone) return alert("Completá tus datos");
    setPaying(true);
    // Simulación
    setTimeout(() => { alert("Checkout placeholder"); setPaying(false); }, 1500);
  }

  return (
    <div className="w-full min-h-screen bg-neutral-50 text-neutral-900 pb-20">
      
      {/* 1. HEADER (Estructura de Autoridades solicitada) */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 pt-8 pb-10 sm:pt-10 sm:pb-12">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-neutral-800 font-semibold text-center mb-3">
            TIENDA OFICIAL
          </p>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 text-center">
            Todos los{" "}
            <span className="italic" style={{ color: BRAND_RED }}>
              productos
            </span>{" "}
            del club
          </h1>
        </div>
      </header>

      {/* 2. NAVBAR Sticky */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100 shadow-sm">
        <div className="container mx-auto px-4">
           <div className="flex items-center justify-between py-3 gap-4">
              {/* Categorías */}
              <nav className="flex-1 overflow-x-auto no-scrollbar">
                  <div className="flex items-center gap-1 md:gap-2">
                     {NAV_CATEGORIES.map(cat => (
                         <button
                            key={cat}
                            onClick={() => { setActiveCat(cat); setQuery(""); }}
                            className={`px-3 md:px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeCat === cat ? "bg-black text-white" : "text-neutral-500 hover:text-black hover:bg-neutral-50"}`}
                         >
                            {cat}
                         </button>
                     ))}
                  </div>
              </nav>

              {/* Acciones */}
              <div className="flex items-center gap-3">
                  <div className="hidden md:flex items-center bg-neutral-100 rounded-full px-3 py-2 w-48">
                      <IconSearch className="w-4 h-4 text-neutral-400" />
                      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar..." className="bg-transparent text-sm font-semibold outline-none w-full ml-2" />
                  </div>
                  <button onClick={() => setCartOpen(true)} className="relative p-2 rounded-full hover:bg-neutral-50">
                      <IconCart className="w-6 h-6" />
                      {cartCount > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">{cartCount}</span>}
                  </button>
              </div>
           </div>
           {/* Mobile Search */}
           <div className="md:hidden pb-3">
                <div className="flex items-center bg-neutral-100 rounded-xl px-3 py-2">
                    <IconSearch className="w-4 h-4 text-neutral-400" />
                    <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar productos..." className="bg-transparent text-sm font-semibold outline-none w-full ml-2" />
                </div>
           </div>
        </div>
      </div>

      {/* 3. CONTENIDO PRINCIPAL */}
      <main className="container mx-auto px-4 mt-8 md:mt-12">
        
        {/* VISTA 1: HOME CON SECCIONES TEMÁTICAS (Si categoría es "Todo" y no hay búsqueda) */}
        {activeCat === "Todo" && !query ? (
            <div className="animate-fadeIn">
                <SectionRow title="Destacados" products={homeSections.destacados} favIds={favIds} onToggleFav={toggleFav} onOpen={openPdp} />
                <SectionRow title="Vestite con el norte" products={homeSections.ropa} favIds={favIds} onToggleFav={toggleFav} onOpen={openPdp} />
                <SectionRow title="Para la cancha" products={homeSections.cancha} favIds={favIds} onToggleFav={toggleFav} onOpen={openPdp} />
                <SectionRow title="Para regalar" products={homeSections.hogar} favIds={favIds} onToggleFav={toggleFav} onOpen={openPdp} />
            </div>
        ) : (
            /* VISTA 2: GRILLA FILTRADA (Categoría específica o Búsqueda) */
            <div className="animate-fadeIn">
                <div className="flex items-center gap-3 mb-8">
                     {/* Usamos el mismo estilo de barra roja para el título de la categoría filtrada */}
                    <div className="h-8 w-1.5 rounded-sm" style={{ backgroundColor: BRAND_RED }}></div>
                    <div className="flex items-baseline gap-3">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                            {activeCat === "Todo" ? `Resultados para "${query}"` : activeCat}
                        </h2>
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{visibleProducts.length} productos</span>
                    </div>
                </div>
                
                {visibleProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {visibleProducts.map(p => (
                            <ProductCard key={p.id} product={p} isFav={favIds.includes(p.id)} onToggleFav={toggleFav} onOpen={openPdp} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <p className="text-neutral-500 font-medium">No hay productos que coincidan.</p>
                        <button onClick={() => {setActiveCat("Todo"); setQuery("");}} className="mt-4 text-sm font-bold underline">Volver al inicio</button>
                    </div>
                )}
            </div>
        )}
      </main>

      {/* MODALES */}
      {pdpOpen && (
        <ProductModal
          product={pdpProduct}
          isFav={pdpProduct ? favIds.includes(pdpProduct.id) : false}
          onToggleFav={toggleFav}
          onClose={() => setPdpOpen(false)}
          onAddToCart={(p, opts) => {
            addToCart(p, opts);
            setCartOpen(true);
          }}
          onBuyNow={(p, opts) => {
            addToCart(p, opts);
            setCartOpen(true);
          }}
        />
      )}
      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} setQty={setQty} removeFromCart={removeFromCart} buyer={buyer} setBuyer={setBuyer} delivery={delivery} setDelivery={setDelivery} subtotal={subtotal} shippingCost={shippingCost} total={total} paying={paying} onCheckout={checkoutOnline} />
    </div>
  );
}