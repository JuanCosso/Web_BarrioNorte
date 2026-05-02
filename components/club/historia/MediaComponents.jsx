import Image from "next/image";

/* =========================================================
   MediaFrame — imagen base sin lightbox
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
      <div className="w-full text-left relative">
        <div
          className={[
            "relative w-full",
            aspect,
            unstyled
              ? "overflow-hidden"
              : "overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-neutral-900",
            !unstyled && padding ? "p-4" : "",
          ].join(" ")}
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