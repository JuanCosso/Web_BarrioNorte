import { motion } from "framer-motion";
import { MediaFrame } from "./MediaComponents";

/* =========================================================
   EraCard
   Renderiza una era individual de la historia.

   Cada era puede usar uno de estos dos modos:
   ─────────────────────────────────────────────
   A) MODO CLÁSICO (mayoría de eras)
      Usa `content` (JSX) + `imageSrc` lateral automática.
      Props opcionales: floatImage

   B) MODO SECTIONS (eras con layout personalizado)
      Usa `sections` (array de objetos).
      No necesita `imageSrc` ni `content`.
      Cada section controla su propio layout de forma declarativa.
   ========================================================= */
export default function EraCard({ era, index }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ margin: "-15%", once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative group w-full"
    >
      {/* Año gigante decorativo de fondo */}
      <div
        className={`absolute top-[-34px] md:top-[-70px] z-0 pointer-events-none select-none ${
          isEven
            ? "left-0 md:-left-10"
            : "right-0 md:-right-10 w-[520px] md:w-[620px] text-left"
        }`}
      >
        <span
          className="text-[110px] md:text-[210px] font-black leading-none text-transparent opacity-20"
          style={{ WebkitTextStroke: "2px rgba(255,255,255,0.14)" }}
        >
          {era.id}
        </span>
      </div>

      {/* ── SELECTOR DE MODO ── */}
      {era.sections ? (
        <SectionsLayout era={era} isEven={isEven} />
      ) : era.floatImage ? (
        <FloatLayout era={era} index={index} />
      ) : (
        <FlexLayout era={era} isEven={isEven} index={index} />
      )}
    </motion.div>
  );
}

/* =========================================================
   MODO B — SectionsLayout
   Renderiza un array de secciones con layout configurable.

   Cada section acepta:
     title          → subtítulo del bloque
     texts          → array de párrafos ["párrafo 1", "párrafo 2", ...]
     highlight      → true = card con borde blanco lateral (estilo Fundación)

     imagePosition  → "right" | "left"  (default "right")
     imageSrc       → ruta de la imagen
     imageAspect    → ej: "4/3" | "16/9" | "16/10" | "3/4"  (default "4/3")
     imageContain   → true = object-contain (para docs/cartas), false = cover
     imageCaption   → pie de foto

     docs           → array de { src, alt } — muestra docs en grilla
     docsCols       → 1 | 2  (default: 2 si hay 2+ docs, 1 si hay 1)
     docsCaption    → pie de los docs
   ========================================================= */
function SectionsLayout({ era, isEven }) {
  return (
    <div className="relative z-10 w-full pt-6">
      <div className={`relative mb-10 ${!isEven ? "text-right" : ""}`}>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
          {era.title}
        </h2>
        <div className={`h-1 w-20 bg-red-600 rounded-full ${!isEven ? "ml-auto" : ""}`} />
      </div>

      <div className="space-y-12">
        {era.sections.map((section, i) => (
          <SectionBlock key={i} section={section} />
        ))}
      </div>
    </div>
  );
}

function SectionBlock({ section }) {
  const imageOnLeft = section.imagePosition === "left";
  const hasImage = !!section.imageSrc;
  const hasDocs = !!(section.docs?.length);
  const hasMedia = hasImage || hasDocs;

  /* ── Bloque de texto ── */
  const textBlock = section.highlight ? (
    <div className="self-start bg-neutral-900 border-l-4 border-white/70 p-5 rounded-r-lg">
      {section.title && (
        <strong className="text-white text-lg block mb-2">{section.title}</strong>
      )}
      {section.texts?.map((t, i) => (
        <p key={i} className={`text-neutral-300 ${i > 0 ? "mt-3" : ""}`}>{t}</p>
      ))}
    </div>
  ) : (
    <div className="space-y-3">
      {section.title && (
        <strong className="text-white text-base block">{section.title}</strong>
      )}
      {section.texts?.map((t, i) => <p key={i}>{t}</p>)}
    </div>
  );

  /* ── Bloque de imagen ── */
  const aspectRatio = section.imageAspect || "4/3";
  const imageBlock = hasImage ? (
    <figure>
      <div className="relative group/img">
        <div className="absolute -inset-4 bg-red-600/10 rounded-[2rem] blur-2xl opacity-0 group-hover/img:opacity-100 transition-opacity duration-1000 pointer-events-none" />
        <div
          className="relative w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-neutral-900 transform transition-transform duration-700 group-hover/img:-translate-y-1"
          style={{ aspectRatio }}
        >
          <img
            src={section.imageSrc}
            alt={section.title || ""}
            className={`w-full h-full ${section.imageContain ? "object-contain p-2" : "object-cover"}`}
          />
          {!section.imageContain && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          )}
        </div>
      </div>
      {section.imageCaption && (
        <figcaption className="mt-2 text-xs text-neutral-500 font-mono pl-3 border-l-2 border-red-900">
          {section.imageCaption}
        </figcaption>
      )}
    </figure>
  ) : null;

  /* ── Bloque de documentos ── */
  const cols = section.docsCols ?? (section.docs?.length > 1 ? 2 : 1);
  const docsBlock = hasDocs ? (
    <div className={`grid grid-cols-${cols} gap-3`}>
      {section.docs.map((doc, i) => (
        <img
          key={i}
          src={doc.src}
          alt={doc.alt}
          className="w-full rounded-lg shadow-lg object-contain"
        />
      ))}
    </div>
  ) : null;

  const mediaBlock = imageBlock || docsBlock;

  /* ── Sin media → ancho completo ── */
  if (!hasMedia) {
    return (
      <div className="text-[15px] sm:text-[16px] md:text-[17px] leading-relaxed text-neutral-300 font-light">
        {textBlock}
      </div>
    );
  }

  /* ── Con media → grilla 2 columnas ── */
  return (
    <div
      className="grid grid-cols-1 gap-8 items-start text-[15px] sm:text-[16px] md:text-[17px] leading-relaxed text-neutral-300 font-light"
      style={{ gridTemplateColumns: section.imageNarrow ? "1fr 0.55fr" : "1fr 1fr" }}
    >
      {imageOnLeft ? <>{mediaBlock}{textBlock}</> : <>{textBlock}{mediaBlock}</>}
    </div>
  );
}

/* =========================================================
   MODO A — FloatLayout
   Imagen flotada a la derecha, texto fluye alrededor.
   Se activa con floatImage: true
   ========================================================= */
function FloatLayout({ era, index }) {
  const isEven = index % 2 === 0;

  return (
    <div className="relative z-10 w-full pt-6 clear-both">
      <div className="history-content text-left text-[15px] sm:text-[16px] md:text-[17px] leading-relaxed text-neutral-300 font-light block">
        
        {/* IMAGEN PRINCIPAL: Flota a Izquierda o Derecha según la época */}
        {era.imageSrc && (
          <div
            className={`relative group/img mb-4 w-full sm:w-[42%] ${isEven ? "sm:ml-8" : "sm:mr-8"}`}
            style={{ float: isEven ? "right" : "left" }}
          >
            <div className="absolute -inset-4 bg-red-600/10 rounded-[2rem] blur-2xl opacity-0 group-hover/img:opacity-100 transition-opacity duration-1000 pointer-events-none" />
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-900 transform transition-transform duration-700 group-hover/img:-translate-y-1">
              <MediaFrame
                src={era.imageSrc}
                alt={era.title}
                aspect="aspect-[4/3]"
                fit="cover"
                overlay={true}
                priority={index === 0}
              />
            </div>
          </div>
        )}

        {/* TÍTULO PRINCIPAL ("Primeros pasos"): Se alinea al lado opuesto de la foto */}
        <div className={`relative mb-6 ${isEven ? "text-left" : "text-right"}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 mt-2">
            {era.title}
          </h2>
          <div className={`h-1 w-20 bg-red-600 rounded-full ${isEven ? "" : "ml-auto"}`} />
        </div>

        {/* CONTENIDO (Texto y fotos secundarias) */}
        {era.content}
        
        <div className="clear-both table" />
      </div>
    </div>
  );
}

/* =========================================================
   MODO A — FlexLayout
   Dos columnas: texto | imagen (se alternan izq/der).
   Layout por defecto para la mayoría de eras.
   ========================================================= */
function FlexLayout({ era, isEven, index }) {
  return (
    <div
      className={`relative z-10 flex flex-col ${
        isEven ? "lg:flex-row" : "lg:flex-row-reverse"
      } gap-10 lg:gap-16 items-center lg:items-start`}
    >
      <div className="flex-1 w-full pt-6">
        <div className="relative mb-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
            {era.title}
          </h2>
          <div className="h-1 w-20 bg-red-600 rounded-full" />
        </div>
        <div className="history-content text-left text-[15px] sm:text-[16px] md:text-[17px] leading-relaxed text-neutral-300 font-light">
          {era.content}
        </div>
      </div>

      <div className="flex-1 w-full lg:w-1/2">
        <div className={`relative ${isEven ? "lg:mr-auto" : "lg:ml-auto"} max-w-xl mx-auto lg:max-w-none`}>
          <div className="absolute -inset-4 bg-red-600/10 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-900 transform transition-transform duration-700 group-hover:-translate-y-1">
            <MediaFrame
              src={era.imageSrc}
              alt={era.title}
              aspect="aspect-[4/3]"
              fit="cover"
              overlay={true}
              priority={index === 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}