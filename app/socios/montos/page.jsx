"use client";

import { useMemo, useRef, useState } from "react";

const BRAND_RED = "#bc1717";

const PLANS = [
  {
    id: "activo",
    badge: "Más económico",
    title: "Socio Activo",
    price: "$ 10000 / mes",
    description: "Acompañá al club todo el año.",
    includes: [
      "Carnet de socio (digital o físico)",
      "Descuentos en comercios adheridos",
      "Entrada a partidos de local sin recargo",
    ],
  },
  {
    id: "pleno",
    badge: "Más elegido",
    title: "Socio Pleno",
    price: "$ 15000 / mes",
    description: "Disfrutá Barrio Norte al completo.",
    includes: [
      "Carnet de socio (digital o físico)",
      "Descuentos en comercios adheridos",
      "Entrada a partidos de local sin recargo",
      "Prioridad en alquiler de salones",
      "Beneficios en el Carnaval de Gualeguay",
    ],
  },
];

/** SOLO descuentos (ordenados por porcentaje desc) */
const DISCOUNT_PARTNERS = [
  { name: "Cantina de Samba Verá", percent: 15 },
  { name: "Planeta Fútbol", percent: 10, note: "Indumentaria del club" },
  { name: "Pinturerías Calcagno", percent: 10 },
  { name: "Lo Geniol", percent: 10 },
  { name: "La Mansión Bar", percent: 10, note: "Excluye bebidas"},
  { name: "Imperiales LA", percent: 5 },
  { name: "El Mirador SA", percent: 5 },
];

function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" className={props.className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M9.55 17.3 4.8 12.55l1.4-1.4 3.35 3.35 8.25-8.25 1.4 1.4L9.55 17.3z"
      />
    </svg>
  );
}

export default function SociosMontosPage() {
  const formRef = useRef(null);

  const defaultPlanId = PLANS[0]?.id ?? "activo";
  const [selectedPlanId, setSelectedPlanId] = useState(defaultPlanId);

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    whatsapp: "",
    plan: defaultPlanId,
    mensaje: "",
    consentimiento: false,
  });

  const [ui, setUi] = useState({ status: "idle", msg: "" });

  const selectedPlan = useMemo(
    () => PLANS.find((p) => p.id === selectedPlanId) ?? PLANS[0],
    [selectedPlanId]
  );

  const SORTED_DISCOUNTS = useMemo(() => {
    // Desc por porcentaje y, en empate, alfabético por nombre
    return [...DISCOUNT_PARTNERS].sort((a, b) => {
      if (b.percent !== a.percent) return b.percent - a.percent;
      return a.name.localeCompare(b.name, "es");
    });
  }, []);

  const MAX_DISCOUNT = useMemo(() => {
    return Math.max(...SORTED_DISCOUNTS.map((p) => p.percent), 1);
  }, [SORTED_DISCOUNTS]);

  function pickPlan(planId) {
    setSelectedPlanId(planId);
    setForm((f) => ({ ...f, plan: planId }));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function buildWhatsappMessage() {
    const planTitle = (PLANS.find((p) => p.id === form.plan)?.title ?? "—").trim();
    const lines = [
      "Hola, quiero pre-asociarme al Club Atlético Barrio Norte.",
      "",
      `Plan: ${planTitle}`,
      `Nombre: ${form.nombre} ${form.apellido}`.trim(),
      `DNI: ${form.dni}`,
      `Email: ${form.email}`,
      `WhatsApp: ${form.whatsapp}`,
      form.mensaje ? "" : null,
      form.mensaje ? `Mensaje: ${form.mensaje}` : null,
    ].filter(Boolean);

    return encodeURIComponent(lines.join("\n"));
  }

  function onSubmit(e) {
    e.preventDefault();

    if (!form.consentimiento) {
      setUi({
        status: "error",
        msg: "Por favor aceptá el consentimiento para poder enviar tu solicitud.",
      });
      return;
    }

    const number = process.env.NEXT_PUBLIC_WHATSAPP_SOCIOS || "5490000000000";
    const text = buildWhatsappMessage();
    const url = `https://wa.me/${number}?text=${text}`;

    window.open(url, "_blank", "noopener,noreferrer");
    setUi({ status: "ok", msg: "Listo: se abrió WhatsApp con tu solicitud pre-cargada." });
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-neutral-50 text-neutral-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 pt-8 pb-10 sm:pt-10 sm:pb-12">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-neutral-800 font-semibold text-center mb-3">
            ASOCIATE
          </p>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 text-center">
            Seamos{" "}
            <span className="italic" style={{ color: BRAND_RED }}>
              cada
            </span>{" "}
            vez{" "}
            <span className="italic" style={{ color: BRAND_RED }}>
              más
            </span>
            <span className="text-neutral-900"> norteños</span>
          </h1>
        </div>
      </header>

      {/* Contenido */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Planes */}
          <div className="lg:col-span-7">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-xl font-bold sm:text-2xl">Planes de socios</h2>
              <p className="text-xs text-neutral-500">Formá parte de la familia</p>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {PLANS.map((plan) => {
                const active = plan.id === selectedPlanId;

                return (
                  <article
                    key={plan.id}
                    className={[
                      "relative h-full overflow-hidden rounded-2xl border bg-white shadow-sm",
                      active ? "border-red-200 ring-2 ring-red-200" : "border-neutral-200",
                    ].join(" ")}
                  >
                    <div className="flex h-full flex-col p-4 sm:p-5">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold tracking-wide text-neutral-500">
                            {plan.badge}
                          </p>
                          <h3 className="mt-1 text-lg font-extrabold break-words">
                            {plan.title}
                          </h3>
                        </div>

                        <span className="shrink-0 self-start rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold text-white whitespace-nowrap">
                          {plan.price}
                        </span>
                      </div>

                      <p className="mt-3 text-sm text-neutral-600">{plan.description}</p>

                      <ul className="mt-4 space-y-2">
                        {plan.includes.map((item) => (
                          <li key={item} className="flex gap-2 text-sm">
                            <IconCheck
                              className="mt-0.5 h-5 w-5 flex-none"
                              style={{ color: BRAND_RED }}
                            />
                            <span className="text-neutral-700">{item}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-auto pt-5">
                        <button
                          type="button"
                          onClick={() => pickPlan(plan.id)}
                          className={[
                            "inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold transition",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                            active
                              ? "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-300"
                              : "bg-neutral-900 text-white hover:bg-neutral-800 focus-visible:ring-neutral-300",
                          ].join(" ")}
                        >
                          Elegir este plan
                        </button>
                      </div>
                    </div>

                    <div
                      className="absolute -right-16 -top-16 h-40 w-40 rounded-full blur-2xl"
                      style={{ background: "rgba(188, 23, 23, 0.10)" }}
                    />
                  </article>
                );
              })}
            </div>

            {/* Importante debajo de los planes */}
            <div className="mt-5 rounded-2xl border border-neutral-800 bg-neutral-900 p-4 sm:p-5 text-white shadow-sm">
              <p className="text-sm font-semibold">Importante</p>

              <ul className="mt-3 space-y-2 text-sm text-neutral-200">
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-neutral-200" />
                  <span>
                    La cuota mensual ayuda al <strong>mantenimiento</strong> y funcionamiento general del club.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-neutral-200" />
                  <span>
                    Se destina a <strong>mejoras edilicias</strong> e infraestructura (arreglos, iluminación, espacios, etc.).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-neutral-200" />
                  <span>
                    Contribuye a <strong>materiales</strong>, equipamiento y servicios para disciplinas y categorías formativas.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-neutral-200" />
                  <span>
                    Para conocer el destino del aporte, podés consultarlo en <strong>secretaría</strong>.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Formulario */}
          <div className="lg:col-span-5">
            <div
              ref={formRef}
              className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-xl font-extrabold">Pre-asociación</h2>
                  <p className="mt-1 text-sm text-neutral-600">
                    Completá tus datos y enviá la solicitud por WhatsApp.
                  </p>
                </div>
              </div>

              <form onSubmit={onSubmit} className="mt-5 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700">Nombre</label>
                    <input
                      name="nombre"
                      value={form.nombre}
                      onChange={onChange}
                      required
                      className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-400 focus:ring-2 focus:ring-red-200"
                      placeholder="Tu nombre"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700">Apellido</label>
                    <input
                      name="apellido"
                      value={form.apellido}
                      onChange={onChange}
                      required
                      className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-400 focus:ring-2 focus:ring-red-200"
                      placeholder="Tu apellido"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700">DNI</label>
                    <input
                      name="dni"
                      value={form.dni}
                      onChange={onChange}
                      required
                      className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-400 focus:ring-2 focus:ring-red-200"
                      placeholder="Ej: 12345678"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700">WhatsApp</label>
                    <input
                      name="whatsapp"
                      value={form.whatsapp}
                      onChange={onChange}
                      required
                      className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-400 focus:ring-2 focus:ring-red-200"
                      placeholder="Ej: +54 9 3444 123456"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    required
                    className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-400 focus:ring-2 focus:ring-red-200"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700">Plan elegido</label>
                  <select
                    name="plan"
                    value={form.plan}
                    onChange={(e) => {
                      onChange(e);
                      setSelectedPlanId(e.target.value);
                    }}
                    className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-400 focus:ring-2 focus:ring-red-200"
                  >
                    {PLANS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>

                  <p className="mt-2 text-xs text-neutral-500">
                    Seleccionado:{" "}
                    <span className="font-semibold text-neutral-800">
                      {selectedPlan?.title}
                    </span>
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700">Mensaje (opcional)</label>
                  <textarea
                    name="mensaje"
                    value={form.mensaje}
                    onChange={onChange}
                    rows={4}
                    className="mt-1 w-full resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-400 focus:ring-2 focus:ring-red-200"
                    placeholder="Si querés, agregá información extra."
                  />
                </div>

                <label className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="consentimiento"
                    checked={form.consentimiento}
                    onChange={onChange}
                    className="mt-1 h-4 w-4 rounded border-neutral-300"
                  />
                  <span className="text-neutral-700">
                    Acepto que el club me contacte para finalizar el alta de socio.
                  </span>
                </label>

                {ui.status !== "idle" && (
                  <div
                    className={[
                      "rounded-xl px-3 py-2 text-sm",
                      ui.status === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800",
                    ].join(" ")}
                  >
                    {ui.msg}
                  </div>
                )}

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-red-600 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-300"
                >
                  Enviar por WhatsApp
                </button>

                <div className="rounded-xl bg-neutral-50 px-3 py-2">
                  <p className="text-xs text-neutral-600">
                    Se considera adeudador a cualquier persona que deba más de 45 días de su cuota; se suspenden beneficios hasta regularizar.
                    Las cuotas adeudadas no son acumulativas.
                  </p>
                </div>

                <p className="text-xs text-neutral-500">
                  Tip: configurá tu número en <span className="font-semibold">.env.local</span> con{" "}
                  <span className="font-semibold">NEXT_PUBLIC_WHATSAPP_SOCIOS</span>.
                </p>
              </form>
            </div>
          </div>

          {/* DESCUENTOS: solo esto, al final y ancho completo */}
          <div className="lg:col-span-12">
            <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-sm">
              <h3 className="text-base font-extrabold text-neutral-900">Descuentos en comercios adheridos</h3>
              <p className="mt-1 text-sm text-neutral-600">
                Presentando carnet físico o digital.
              </p>

              <ul className="mt-4 grid gap-3 md:grid-cols-2">
                {SORTED_DISCOUNTS.map((p) => {
                  // Barra comparativa: el mayor descuento es 100%
                  const normalized = Math.round((p.percent / MAX_DISCOUNT) * 100);

                  return (
                    <li key={p.name} className="rounded-xl bg-neutral-50 px-3 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-neutral-900">{p.name}</p>
                          {p.note ? (
                            <p className="mt-0.5 text-xs text-neutral-600">{p.note}</p>
                          ) : null}
                        </div>

                        <span
                          className="shrink-0 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-xs font-extrabold text-neutral-900"
                          title={`${p.percent}% de descuento`}
                        >
                          {p.percent}%
                        </span>
                      </div>

                      <div
                        className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-200"
                        role="progressbar"
                        aria-label={`Descuento ${p.percent}% en ${p.name}`}
                        aria-valuenow={p.percent}
                        aria-valuemin={0}
                        aria-valuemax={MAX_DISCOUNT}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${normalized}%`,
                            background: BRAND_RED,
                          }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-3 text-xs text-neutral-500">
                Nota: la lista de comercios y porcentajes puede actualizarse. Consultá en secretaría para el detalle vigente.
              </p>
            </div>
          </div>

          {/* fin grid */}
        </div>
      </section>
    </main>
  );
}
