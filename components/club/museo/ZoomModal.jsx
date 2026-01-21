"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

function IconX() { /* igual que antes */ return (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    <path fill="currentColor" d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3 1.4 1.4z" />
  </svg>
);}

function IconPlus() { return (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    <path fill="currentColor" d="M11 5h2v14h-2zM5 11h14v2H5z" />
  </svg>
);}

function IconMinus() { return (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    <path fill="currentColor" d="M5 11h14v2H5z" />
  </svg>
);}

function IconReset() { return (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    <path fill="currentColor" d="M12 6V3L8 7l4 4V8c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5H5c0 3.9 3.1 7 7 7s7-3.1 7-7-3.1-7-7-7z" />
  </svg>
);}

export default function ZoomModal({ open, item, onClose }) {
  const src = item?.src;
  const alt = item?.alt || "Imagen ampliada";

  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const startRef = useRef({ x: 0, y: 0, px: 0, py: 0 });

  const minScale = 1;
  const maxScale = 5;

  const reset = () => {
    setScale(1);
    setPos({ x: 0, y: 0 });
    setDragging(false);
  };

  useEffect(() => {
    if (!open) return;
    reset();

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "+" || e.key === "=") setScale((s) => Math.min(maxScale, +(s + 0.25).toFixed(2)));
      if (e.key === "-") setScale((s) => Math.max(minScale, +(s - 0.25).toFixed(2)));
      if (e.key === "0") reset();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const zoomIn = () => setScale((s) => Math.min(maxScale, +(s + 0.25).toFixed(2)));
  const zoomOut = () => setScale((s) => Math.max(minScale, +(s - 0.25).toFixed(2)));

  const onWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setScale((s) => Math.max(minScale, Math.min(maxScale, +(s + delta).toFixed(2))));
  };

  // Pointer (PC + móviles modernos)
  const onPointerDown = (e) => {
    if (scale <= 1) return;
    setDragging(true);
    startRef.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    setPos({ x: startRef.current.px + dx, y: startRef.current.py + dy });
  };

  const onPointerUp = () => setDragging(false);

  // Touch fallback (iOS viejo o casos donde Pointer no engancha bien)
  const onTouchStart = (e) => {
    if (scale <= 1) return;
    const t = e.touches?.[0];
    if (!t) return;
    setDragging(true);
    startRef.current = { x: t.clientX, y: t.clientY, px: pos.x, py: pos.y };
  };

  const onTouchMove = (e) => {
    if (!dragging) return;
    const t = e.touches?.[0];
    if (!t) return;
    const dx = t.clientX - startRef.current.x;
    const dy = t.clientY - startRef.current.y;
    setPos({ x: startRef.current.px + dx, y: startRef.current.py + dy });
  };

  const onTouchEnd = () => setDragging(false);

  const onDoubleClick = () => {
    if (scale === 1) setScale(2);
    else reset();
  };

  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm" role="dialog" aria-modal="true">
      {/* Backdrop clickeable (siempre permite salir) */}
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Controles arriba (encima de todo) */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <button type="button" onClick={zoomOut} className="rounded-xl border border-neutral-700 bg-neutral-900/70 p-2 text-white">
          <IconMinus />
        </button>
        <button type="button" onClick={zoomIn} className="rounded-xl border border-neutral-700 bg-neutral-900/70 p-2 text-white">
          <IconPlus />
        </button>
        <button type="button" onClick={reset} className="rounded-xl border border-neutral-700 bg-neutral-900/70 p-2 text-white">
          <IconReset />
        </button>
        <button type="button" onClick={onClose} className="rounded-xl border border-neutral-700 bg-neutral-900/70 p-2 text-white">
          <IconX />
        </button>
      </div>

      {/* Visor (también por encima del backdrop, pero debajo de controles) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-4 sm:p-6">
        <div
          className="relative w-full h-full max-w-6xl max-h-[85vh] rounded-2xl border border-neutral-700 bg-neutral-950 overflow-hidden"
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onDoubleClick={onDoubleClick}
          style={{
            cursor: scale > 1 ? (dragging ? "grabbing" : "grab") : "zoom-in",
            touchAction: "none", // CLAVE para móvil
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="absolute inset-0 select-none"
            style={{
              transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
              transformOrigin: "center",
              willChange: "transform",
            }}
          >
            <Image
              src={src || ""}
              alt={alt}
              fill
              draggable={false}
              className="object-contain"
              sizes="(min-width: 1024px) 80vw, 100vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
