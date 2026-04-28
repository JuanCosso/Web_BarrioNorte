"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { PRODUCTS, STORE } from "./catalogo.data";

// Encabezado de sección: se mantiene #BC1717
const BRAND_RED = "#BC1717";

function formatARS(n) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
}

function hasSizes(product) {
  return Array.isArray(product.variants?.size) && product.variants.size.length > 0;
}

// ── Ícono carrito ─────────────────────────────────────────────────────────────

function IconCart({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.997-7.5H7.5M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
      />
    </svg>
  );
}

// ── Tarjeta de producto ───────────────────────────────────────────────────────

function ProductCard({ product, onOpen }) {
  const img = product.images?.[0] ?? "/tienda/placeholder.webp";

  return (
    <article
      onClick={() => onOpen(product)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative h-44 overflow-hidden bg-neutral-50">
        <Image
          src={img}
          alt={product.name}
          fill
          className="object-contain p-3 transition group-hover:scale-105"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        />
        {product.vendor && (
          <span className="absolute left-2 top-2 rounded-md bg-white/90 border border-neutral-200 px-2 py-0.5 text-[10px] font-bold text-neutral-700 uppercase tracking-wide">
            {product.vendor}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="text-sm font-bold text-neutral-900 line-clamp-2 leading-snug">
          {product.name}
        </h3>
        <p className="text-[11px] text-neutral-400 uppercase tracking-wide">{product.category}</p>
        <p className="mt-auto pt-2 text-base font-extrabold text-neutral-900">
          {formatARS(product.price)}
        </p>
      </div>
    </article>
  );
}

// ── Modal de producto ─────────────────────────────────────────────────────────

function ProductModal({ product, onClose, onAddToCart }) {
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const img = product.images?.[0] ?? "/tienda/placeholder.webp";
  const needSize = hasSizes(product);
  const canAdd = !needSize || size;

  function handleAdd() {
    if (!canAdd) return;
    onAddToCart(product, { size, qty });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center px-0 sm:px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
        {/* Imagen */}
        <div className="relative h-52 bg-neutral-50">
          <Image src={img} alt={product.name} fill className="object-contain p-6" />
          <button
            onClick={onClose}
            className="absolute right-3 top-3 p-2 bg-white/80 rounded-full shadow hover:bg-white transition"
          >
            <svg className="w-4 h-4 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Datos */}
        <div className="p-5">
          <p className="text-[11px] text-neutral-400 uppercase tracking-widest">{product.category}</p>
          <h3 className="mt-1 text-xl font-extrabold text-neutral-900">{product.name}</h3>
          <p className="mt-1 text-lg font-bold text-neutral-900">{formatARS(product.price)}</p>
          {product.description && (
            <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{product.description}</p>
          )}

          {/* Selector de talle */}
          {needSize && (
            <div className="mt-4">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
                Talle
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.variants.size.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-3 py-1.5 rounded-xl border text-sm font-bold transition ${
                      size === s
                        ? "border-red-600 bg-red-600 text-white"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-red-600/50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cantidad */}
          <div className="mt-4">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
              Cantidad
            </label>
            <div className="mt-2 flex items-center gap-3">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center font-bold hover:bg-neutral-50 transition"
              >
                −
              </button>
              <span className="w-6 text-center font-bold text-neutral-900">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock ?? 10, q + 1))}
                className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center font-bold hover:bg-neutral-50 transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Botón agregar */}
          <button
            onClick={handleAdd}
            disabled={!canAdd}
            className="mt-5 w-full rounded-xl bg-red-600 py-3 text-sm font-extrabold text-white transition hover:bg-red-700 disabled:opacity-40"
          >
            {needSize && !size ? "Seleccioná un talle" : "Agregar al carrito"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Panel de carrito ──────────────────────────────────────────────────────────

function CartPanel({ open, onClose, cart, onRemove, onSetQty, subtotal }) {
  if (!open) return null;

  const count = cart.reduce((a, x) => a + x.qty, 0);

  function buildWaMsg() {
    const lines = ["Hola, quiero consultar/comprar:", ""];
    cart.forEach((x) => {
      const v = x.variant?.size ? ` (Talle ${x.variant.size})` : "";
      lines.push(`• ${x.name}${v} x${x.qty} — ${formatARS(x.price * x.qty)}`);
    });
    lines.push("", `Total: ${formatARS(subtotal)}`);
    return encodeURIComponent(lines.join("\n"));
  }

  const waUrl = `https://wa.me/${STORE.whatsappNumber}?text=${buildWaMsg()}`;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm h-full bg-white shadow-2xl flex flex-col">
        {/* Encabezado del carrito */}
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-neutral-900">Carrito</h2>
            <p className="text-xs text-neutral-500">
              {count} {count === 1 ? "producto" : "productos"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Ítems */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-400 gap-3">
              <IconCart className="w-12 h-12 opacity-25" />
              <p className="text-sm">El carrito está vacío</p>
            </div>
          ) : (
            cart.map((x) => (
              <div
                key={x.key}
                className="flex gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100"
              >
                <div className="relative w-14 h-14 bg-white rounded-lg overflow-hidden border border-neutral-200 shrink-0">
                  <Image
                    src={x.image || "/tienda/placeholder.webp"}
                    alt={x.name}
                    fill
                    className="object-contain p-1"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-neutral-900 line-clamp-1">{x.name}</p>
                  {x.variant?.size && (
                    <p className="text-xs text-neutral-500">Talle {x.variant.size}</p>
                  )}
                  <div className="mt-1.5 flex items-center gap-2">
                    <button
                      onClick={() => onSetQty(x.key, x.qty - 1)}
                      className="w-6 h-6 rounded-full border border-neutral-200 text-xs font-bold flex items-center justify-center hover:bg-neutral-100"
                    >
                      −
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{x.qty}</span>
                    <button
                      onClick={() => onSetQty(x.key, x.qty + 1)}
                      className="w-6 h-6 rounded-full border border-neutral-200 text-xs font-bold flex items-center justify-center hover:bg-neutral-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between shrink-0">
                  <p className="text-sm font-extrabold text-neutral-900">
                    {formatARS(x.price * x.qty)}
                  </p>
                  <button
                    onClick={() => onRemove(x.key)}
                    className="text-xs text-neutral-400 hover:text-red-600 transition"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer del carrito */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-neutral-100 bg-neutral-50 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-500">Total</span>
              <span className="text-lg font-extrabold text-neutral-900">{formatARS(subtotal)}</span>
            </div>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center rounded-xl bg-red-600 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-red-700"
            >
              Consultar por WhatsApp
            </a>
            <p className="text-center text-xs text-neutral-400">
              La compra se coordina directamente con el club
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function Catalogo() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [pdpProduct, setPdpProduct] = useState(null);

  function addToCart(product, { size = "", qty = 1 } = {}) {
    const key = `${product.id}::${size}`;
    setCart((prev) => {
      const idx = prev.findIndex((x) => x.key === key);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          name: product.name,
          price: Number(product.price) || 0,
          qty,
          image: product.images?.[0] || "",
          variant: size ? { size } : null,
        },
      ];
    });
  }

  function setQty(key, qty) {
    if (qty < 1) return removeFromCart(key);
    setCart((prev) => prev.map((x) => (x.key === key ? { ...x, qty } : x)));
  }

  function removeFromCart(key) {
    setCart((prev) => prev.filter((x) => x.key !== key));
  }

  const cartCount = useMemo(() => cart.reduce((a, x) => a + x.qty, 0), [cart]);
  const subtotal = useMemo(() => cart.reduce((a, x) => a + x.price * x.qty, 0), [cart]);

  return (
    <div className="w-full min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header de sección */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 pt-8 pb-10 sm:pt-10 sm:pb-12">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-neutral-800 font-semibold text-center mb-3">
            TIENDA OFICIAL
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 text-center">
            Todos los{" "}
            {/* Encabezado: #BC1717 */}
            <span className="italic" style={{ color: BRAND_RED }}>
              productos
            </span>{" "}
            del club
          </h1>
        </div>
      </header>

      {/* Barra sticky con carrito — debajo del header de sección, no se superpone */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-end">
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-neutral-700"
          >
            <IconCart className="w-4 h-4" />
            <span>Carrito</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-extrabold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Grilla de productos */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} onOpen={setPdpProduct} />
          ))}
        </div>
      </main>

      {/* Modal de producto */}
      {pdpProduct && (
        <ProductModal
          product={pdpProduct}
          onClose={() => setPdpProduct(null)}
          onAddToCart={(p, opts) => {
            addToCart(p, opts);
            setPdpProduct(null);
            setCartOpen(true);
          }}
        />
      )}

      {/* Panel carrito */}
      <CartPanel
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onRemove={removeFromCart}
        onSetQty={setQty}
        subtotal={subtotal}
      />
    </div>
  );
}