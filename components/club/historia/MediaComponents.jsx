"use client";

import Image from "next/image";

export function openLightbox(src, alt, caption) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("openHistoryLightbox", {
        detail: { src, alt, caption },
      })
    );
  }
}

/* =========================================================
   MediaFrame — imagen con soporte de zoom
   ========================================================= */
export function MediaFrame({
  src,
  alt,
  caption,
  aspect = "aspect-[4/3]",
  fit = "cover",
  overlay = true,
  padding = false,
  priority = false,
  unstyled = false,
}) {
  return (
    <>
      <div className="w-full text-left relative group">
        <div
          onClick={() => openLightbox(src, alt, caption)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && openLightbox(src, alt, caption)}
          className={[
            "relative w-full cursor-zoom-in select-none",
            aspect,
            unstyled
              ? "overflow-hidden"
              : "overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-neutral-900",
            !unstyled && padding ? "p-4" : "",
          ].join(" ")}
          title="Hacé clic para ampliar"
        >
          <div className="relative w-full h-full">
            <Image
              src={src}
              alt={alt}
              fill
              priority={priority}
              className={[
                fit === "contain" ? "object-contain" : "object-cover",
                unstyled ? "" : "transition-transform duration-700 group-hover:scale-[1.04]",
              ].join(" ")}
              sizes="(min-width: 1024px) 50vw, 100vw"
            />

            {!unstyled && overlay && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-55 transition-opacity duration-300 group-hover:opacity-40" />
            )}

            {/* Icono de zoom en hover */}
            <div className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 pointer-events-none border border-white/20">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
            </div>

            {!unstyled && (
              <div className="absolute inset-0 rounded-2xl border border-white/5 pointer-events-none" />
            )}
          </div>
        </div>
      </div>

      {caption ? (
        <p className="mt-3 text-xs text-neutral-500 font-mono border-l-2 border-red-900 pl-3">
          {caption}
        </p>
      ) : null}
    </>
  );
}

/* =========================================================
   Figure — imagen individual dentro del texto
   ========================================================= */
export function Figure({ src, alt, caption, aspect = "aspect-[4/3]", variant = "photo" }) {
  const isDoc = variant === "doc";
  return (
    <figure className="my-8">
      <MediaFrame
        src={src}
        alt={alt}
        caption={caption}
        aspect={aspect}
        fit={isDoc ? "contain" : "cover"}
        overlay={!isDoc}
        padding={isDoc}
        unstyled={true}
      />
    </figure>
  );
}

/* =========================================================
   MediaGrid — grilla de imágenes dentro del texto
   ========================================================= */
export function MediaGrid({ images, caption, cols, aspect, variant = "photo" }) {
  const isDoc = variant === "doc";
  const resolvedCols =
    cols ?? (isDoc ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 sm:grid-cols-2");
  const resolvedAspect = aspect ?? (isDoc ? "aspect-[3/4]" : "aspect-[4/3]");

  return (
    <figure className="my-8">
      <div className={`grid ${resolvedCols} gap-4`}>
        {images.map((img, i) => (
          <div key={`${img.src}-${i}`}>
            <MediaFrame
              src={img.src}
              alt={img.alt}
              caption={null}
              aspect={resolvedAspect}
              fit={isDoc ? "contain" : "cover"}
              overlay={!isDoc}
              padding={isDoc}
              unstyled={true}
            />
          </div>
        ))}
      </div>

      {caption ? (
        <figcaption className="mt-2 text-xs text-neutral-500 font-mono pl-3 border-l-2 border-neutral-800">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/* =========================================================
   FlatImage — imagen plana para que el texto la envuelva
   ========================================================= */
export function FlatImage({ src, alt, align = "right", width = "w-full sm:w-1/3" }) {
  const floatClasses = align === "right" 
    ? "float-right ml-5 mb-3" 
    : "float-left mr-5 mb-3";

  return (
    <img
      src={src}
      alt={alt}
      onClick={() => openLightbox(src, alt, alt)}
      className={`${floatClasses} ${width} rounded-lg object-cover shadow-md cursor-zoom-in hover:opacity-90 hover:scale-[1.02] transition-all`}
      title="Hacé clic para ampliar"
    />
  );
}