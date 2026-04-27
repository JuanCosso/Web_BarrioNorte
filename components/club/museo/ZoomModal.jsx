"use client";

/**
 * ZoomModal — powered by yet-another-react-lightbox
 *
 * Instalación (una sola vez):
 *   npm install yet-another-react-lightbox
 *
 * Props (sin cambios respecto a la versión anterior):
 *   open    {boolean}
 *   item    {object}   — item actualmente seleccionado
 *   items   {array}    — lista completa para nav prev/next
 *   onClose {function}
 */

import { useMemo } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Captions from "yet-another-react-lightbox/plugins/captions";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/captions.css";

const BRAND_RED = "#bc1717";

/**
 * Convierte un item del museo al formato que espera YARL:
 * { src, alt, title, description }
 */
function toSlide(item) {
  if (!item) return null;

  const title = [item.temporada || item.periodo, item.titulo && item.titulo !== "-" ? item.titulo : null]
    .filter(Boolean)
    .join(" · ");

  const trofeos = item.hitos?.length
    ? "🏆 " + item.hitos.map((h) => h.titulo).join(" · ")
    : null;

  const description = [item.historia || item.descripcion, trofeos]
    .filter(Boolean)
    .join("\n\n");

  return {
    src: item.src,
    alt: item.alt || title || "Imagen",
    title: title || undefined,
    description: description || undefined,
  };
}

export default function ZoomModal({ open, item, items = [], onClose }) {
  /* Convertir todos los items al formato YARL */
  const slides = useMemo(
    () => (items.length > 0 ? items.map(toSlide) : item ? [toSlide(item)] : []),
    [items, item]
  );

  /* Índice inicial según el item seleccionado */
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

      /* ── Opciones de zoom ── */
      zoom={{
        maxZoomPixelRatio: 5,
        zoomInMultiplier: 1.5,
        doubleTapDelay: 300,
        doubleClickDelay: 300,
        doubleClickMaxStops: 2,
        keyboardMoveDistance: 50,
        wheelZoomDistanceFactor: 100,
        pinchZoomDistanceFactor: 100,
        scrollToZoom: true,
      }}

      /* ── Opciones de thumbnails ── */
      thumbnails={{
        position: "bottom",
        width: 80,
        height: 60,
        border: 2,
        borderRadius: 8,
        padding: 4,
        gap: 8,
        imageFit: "contain",
        vignette: false,
      }}

      /* ── Opciones de captions (título + descripción) ── */
      captions={{
        showToggle: true,
        descriptionTextAlign: "start",
        descriptionMaxLines: 4,
      }}

      /* ── Estilos globales para coincidir con el diseño del sitio ── */
      styles={{
        container: {
          backgroundColor: "rgba(0, 0, 0, 0.65)",
          backdropFilter: "blur(10px)",
        },
        button: {
          filter: "none",
          color: "#374151",
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "10px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        },
        navigationPrev: { marginLeft: "12px" },
        navigationNext: { marginRight: "12px" },
        thumbnail: {
          border: "2px solid transparent",
          borderRadius: "8px",
          background: "#ffffff",
        },
        thumbnailsContainer: {
          background: "#f9fafb",
          borderTop: "1px solid #e5e7eb",
          padding: "10px 0",
        },
        captionsTitle: {
          fontSize: "15px",
          fontWeight: "700",
          color: "#111827",
        },
        captionsTitleContainer: {
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #e5e7eb",
          padding: "10px 16px 8px",
        },
        captionsDescription: {
          fontSize: "13px",
          lineHeight: "1.6",
          color: "#4b5563",
        },
        captionsDescriptionContainer: {
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(8px)",
          padding: "8px 16px 12px",
        },
        /* Highlight del thumbnail activo en el color del club */
        thumbnailsTrack: {},
      }}

      /* Sobreescribir el color del thumbnail activo via CSS inline */
      render={{
        /* Botón de cerrar personalizado (opcional — YARL ya lo tiene) */
      }}
    />
  );
}