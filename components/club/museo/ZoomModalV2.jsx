"use client";

import { useMemo } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Captions from "yet-another-react-lightbox/plugins/captions";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/captions.css";

function toSlide(item) {
  if (!item) return null;

  const base = [
    item.temporada || item.periodo,
    item.titulo && item.titulo !== "-" ? item.titulo : null,
  ].filter(Boolean).join(" · ");

  const tipo    = item.tipo ? `  ·  ${item.tipo.toUpperCase()}` : "";
  const trofeos = item.hitos?.length
    ? "  ·  " + item.hitos.map((h) => `🏆 ${h.titulo}`).join("  ·  ")
    : "";

  const isEscudo = !item.temporada && Boolean(item.periodo);

  return {
    src:        item.src,
    alt:        item.alt || base || "Imagen",
    title:      (base + tipo + trofeos) || undefined,
    description: item.historia || item.descripcion || undefined,
    imageFit:   "contain",
    _isEscudo:  isEscudo,
  };
}

// ── Íconos ────────────────────────────────────────────────────────────────────

const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="4" y1="4" x2="14" y2="14"/><line x1="14" y1="4" x2="4" y2="14"/>
  </svg>
);
const IconZoomIn = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="8" cy="8" r="5"/><line x1="12" y1="12" x2="16" y2="16"/>
    <line x1="8" y1="5.5" x2="8" y2="10.5"/><line x1="5.5" y1="8" x2="10.5" y2="8"/>
  </svg>
);
const IconZoomOut = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="8" cy="8" r="5"/><line x1="12" y1="12" x2="16" y2="16"/>
    <line x1="5.5" y1="8" x2="10.5" y2="8"/>
  </svg>
);
const IconCaptions = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="14" height="10" rx="1.5"/>
    <line x1="5" y1="9" x2="9" y2="9"/><line x1="5" y1="12" x2="13" y2="12"/>
    <line x1="11" y1="9" x2="13" y2="9"/>
  </svg>
);
const IconPrev = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="11 4 7 9 11 14"/>
  </svg>
);
const IconNext = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="7 4 11 9 7 14"/>
  </svg>
);

// ── Componente ────────────────────────────────────────────────────────────────

export default function ZoomModalV2({ open, item, items = [], onClose }) {
  const slides = useMemo(
    () => (items.length > 0 ? items.map(toSlide) : item ? [toSlide(item)] : []),
    [items, item]
  );

  const index = useMemo(() => {
    if (items.length === 0) return 0;
    const i = items.findIndex((x) => x?.id === item?.id);
    return i >= 0 ? i : 0;
  }, [items, item]);

  if (!open || slides.length === 0) return null;

  return (
    <Lightbox
      open={open}
      close={onClose}
      slides={slides}
      index={index}
      plugins={[Zoom, Thumbnails, Captions]}

      zoom={{
        maxZoomPixelRatio: 5,
        zoomInMultiplier: 1.5,
        doubleTapDelay: 300,
        doubleClickDelay: 300,
        doubleClickMaxStops: 2,
        scrollToZoom: true,
        wheelZoomDistanceFactor: 100,
      }}

      thumbnails={{
        position: "bottom",
        width: 72,
        height: 56,
        border: 2,
        borderRadius: 8,
        padding: 3,
        gap: 6,
        imageFit: "contain",
        vignette: false,
      }}

      captions={{
        showToggle: true,
        descriptionTextAlign: "center",
        descriptionMaxLines: 6,
      }}

      render={{
        iconClose:    () => <IconClose />,
        iconZoomIn:   () => <IconZoomIn />,
        iconZoomOut:  () => <IconZoomOut />,
        iconPrev:     () => <IconPrev />,
        iconNext:     () => <IconNext />,
        iconCaptions: () => <IconCaptions />,

        // Escudos: tamaño moderado, sin sombra
        slide: ({ slide }) => {
          if (!slide._isEscudo) return undefined;
          return (
            <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={slide.src} alt={slide.alt}
                style={{ maxHeight:"72%", maxWidth:"72%", objectFit:"contain" }} />
            </div>
          );
        },
      }}

      styles={{
        container: { backgroundColor: "rgb(8,8,8)" },

        // ── BOTONES: sin fondo, sin borde, sin círculo ──
        // Estos inline styles son lo que yarl aplica al elemento — acá es donde estaba el círculo
        button: {
          filter:       "none",
          color:        "rgba(255,255,255,0.50)",
          background:   "transparent",   // ← antes "rgba(255,255,255,0.08)"
          border:       "none",          // ← antes "1px solid rgba(...)"
          borderRadius: "0",             // ← antes "50%"  ← ACÁ ESTABA EL CÍRCULO
          boxShadow:    "none",
          width:        "34px",
          height:       "34px",
          padding:      "0",
          display:      "flex",
          alignItems:   "center",
          justifyContent: "center",
          transition:   "color 0.15s",
        },

        navigationPrev: { marginLeft: "12px" },
        navigationNext: { marginRight: "12px" },

        thumbnail: {
          border: "2px solid transparent",
          borderRadius: "8px",
          background: "rgba(255,255,255,0.04)",
        },
        thumbnailsContainer: {
          background: "rgb(15,15,15)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          padding: "8px 0",
        },

        captionsTitleContainer: {
          background: "rgb(14,14,14)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "8px 20px",
        },
        captionsTitle: {
          fontSize: "13px",
          fontWeight: "700",
          color: "#f3f4f6",
          fontFamily: "inherit",
          letterSpacing: "0.02em",
        },

        captionsDescriptionContainer: {
          background: "rgb(12,12,12)",
          width: "100%",
          padding: "8px 0 12px",
        },
        captionsDescription: {
          fontSize: "12.5px",
          lineHeight: "1.7",
          color: "rgba(255,255,255,0.50)",
          fontFamily: "inherit",
          textAlign: "center",
          width: "100%",
          padding: "0 32px",
          boxSizing: "border-box",
        },
      }}
    />
  );
}