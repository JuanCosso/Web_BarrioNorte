"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";

const BRAND_RED = "#B71C1C";

const PLANS = [
  {
    id: "activo",
    badge: "Acceso Popular",
    title: "Socio Activo",
    price: "$ 10.000",
    period: "por mes",
    description: "Acompañá al club en todas las canchas durante todo el año.",
    includes: [
      "Carnet de socio digital y físico oficial",
      "Descuentos exclusivos en comercios adheridos",
      "Ingreso libre a partidos de local sin recargo",
    ],
  },
  {
    id: "pleno",
    badge: "Experiencia Total",
    title: "Socio Pleno",
    price: "$ 15.000",
    period: "por mes",
    description: "Disfrutá al 100% las instalaciones y eventos del Club Atlético Barrio Norte.",
    includes: [
      "Carnet de socio digital y físico oficial",
      "Descuentos exclusivos en comercios adheridos",
      "Ingreso libre a partidos de local sin recargo",
      "Prioridad en alquiler del salón social y quincho",
      "Beneficios y ubicaciones en el Carnaval de Gualeguay (Samba Verá)",
      "Uso de instalaciones deportivas del predio",
    ],
  },
];

const DISCOUNT_PARTNERS = [
  { name: "Cantina de Samba Verá", percent: 15, note: "Consumos en el corsódromo" },
  { name: "Planeta Fútbol", percent: 10, note: "Indumentaria oficial y calzado" },
  { name: "Pinturerías Calcagno", percent: 10, note: "Materiales y pintura" },
  { name: "Lo Geniol", percent: 10, note: "Sandwichería y minutas" },
  { name: "La Mansión Bar", percent: 10, note: "Gastronomía (excluye bebidas)" },
  { name: "Imperiales LA", percent: 5, note: "Artículos regionales" },
  { name: "El Mirador SA", percent: 5, note: "Comercio adherido" },
];

function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" className={props.className} fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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
      "👋 Hola Secretaría del Club Atlético Barrio Norte,",
      "Quiero completar mi pre-asociación al club:",
      "",
      `📌 Plan: ${planTitle}`,
      `👤 Nombre completo: ${form.nombre} ${form.apellido}`.trim(),
      `📄 DNI: ${form.dni}`,
      `✉️ Email: ${form.email}`,
      form.mensaje ? `💬 Mensaje extra: ${form.mensaje}` : null,
      "",
      "¡Aguardo indicaciones para abonar la primera cuota y retirar mi carnet! Muchas gracias.",
    ].filter(Boolean);

    return encodeURIComponent(lines.join("\n"));
  }

  function onSubmit(e) {
    e.preventDefault();

    if (!form.consentimiento) {
      setUi({
        status: "error",
        msg: "Por favor aceptá el consentimiento para tramitar tu solicitud.",
      });
      return;
    }

    const number = process.env.NEXT_PUBLIC_WHATSAPP_SOCIOS || "5493444123456";
    const text = buildWhatsappMessage();
    const url = `https://wa.me/${number}?text=${text}`;

    window.open(url, "_blank", "noopener,noreferrer");
    setUi({ status: "ok", msg: "¡Listo! Se abrió WhatsApp con tu solicitud pre-cargada para la secretaría." });
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      {/* HEADER INSTITUCIONAL */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 pt-8 pb-10 sm:pt-10 sm:pb-12 text-center">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gray-900 font-semibold mb-2">
            MASA SOCIETARIA
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">
            Asociate a <span className="text-[#B71C1C] italic">Barrio Norte</span>
          </h1>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-4 pt-8 sm:pt-10 space-y-8">
        {/* PLANES DE SOCIOS */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#B71C1C]">
                CATEGORÍAS
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900">Planes de Socios</h2>
            </div>
            <p className="text-xs text-gray-500 mt-1 sm:mt-0">Valores actualizados período 2026</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {PLANS.map((plan) => {
              const active = plan.id === selectedPlanId;

              return (
                <article
                  key={plan.id}
                  className={`relative flex flex-col rounded-2xl border bg-white p-5 shadow-sm transition-all ${
                    active
                      ? "border-[#B71C1C] ring-2 ring-[#B71C1C]/25 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-[#B71C1C] uppercase tracking-wider">
                        {plan.badge}
                      </span>
                      <h3 className="mt-2 text-2xl font-black text-gray-900">{plan.title}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl sm:text-3xl font-black text-gray-900">{plan.price}</p>
                      <p className="text-xs text-gray-500">{plan.period}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-gray-600">{plan.description}</p>

                  <div className="my-4 border-t border-gray-100" />

                  <ul className="space-y-3 text-sm text-gray-700 flex-1">
                    {plan.includes.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="flex-shrink-0 mt-0.5 rounded-full bg-red-100 text-[#B71C1C] p-0.5">
                          <IconCheck className="w-4 h-4" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={() => pickPlan(plan.id)}
                      className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-xs ${
                        active
                          ? "bg-[#B71C1C] text-white hover:bg-red-800 shadow-md scale-[1.01]"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {active ? "✓ Plan Seleccionado" : "Elegir este Plan"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* SIMULADOR DE CARNET DIGITAL + FORMULARIO */}
        <section ref={formRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* COLUMNA IZQUIERDA: CARNET DIGITAL INTERACTIVO */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#B71C1C]">
                TU IDENTIDAD NORTEÑA
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900">
                Carnet de Socio Digital
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Visualizá cómo se verá tu credencial oficial del club mientras completás tus datos.
              </p>
            </div>

            {/* TARJETA / CARNET */}
            <div className="relative aspect-[1.586/1] w-full rounded-2xl overflow-hidden shadow-2xl p-5 text-white flex flex-col justify-between border border-neutral-700 bg-gradient-to-br from-neutral-900 via-[#8A0000] to-neutral-950">
              {/* Textura de fondo */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay"
                style={{
                  backgroundImage: "url(/fondos/fondo_campeon2.png)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              {/* Cabecera del Carnet */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-12">
                    <Image
                      src="/escudos/BarrioNorte_V3.png"
                      alt="Escudo Oficial CABN"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.25em] text-white/80 uppercase font-semibold">
                      Club Atlético
                    </p>
                    <p className="text-sm font-black tracking-tight uppercase leading-none">
                      Barrio Norte
                    </p>
                  </div>
                </div>

                <div className="px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-md border border-white/30 text-[10px] font-black uppercase tracking-wider">
                  {selectedPlan.title}
                </div>
              </div>

              {/* Centro / Chip & Relieve */}
              <div className="relative z-10 flex items-center justify-between my-auto">
                <div className="w-10 h-8 rounded-md bg-amber-400/80 border border-amber-300/60 shadow-inner flex items-center justify-center opacity-80">
                  <div className="w-6 h-4 border border-amber-600/50 rounded-xs" />
                </div>
                <div className="text-right">
                  <p className="text-[9px] uppercase tracking-widest text-white/60">Gualeguay, E.R.</p>
                  <p className="text-[10px] font-mono font-bold tracking-widest text-white/90">
                    2026 • OFICIAL
                  </p>
                </div>
              </div>

              {/* Pie del Carnet: Datos dinámicos */}
              <div className="relative z-10 pt-2 border-t border-white/20 flex items-end justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-white/60">Titular</p>
                  <p className="text-base sm:text-lg font-black tracking-wide uppercase leading-tight truncate max-w-[200px] sm:max-w-[240px]">
                    {form.nombre || form.apellido
                      ? `${form.nombre} ${form.apellido}`
                      : "NOMBRE Y APELLIDO"}
                  </p>
                  <p className="text-[10px] font-mono text-white/80">
                    DNI: {form.dni ? form.dni : "• • • • • • • •"}
                  </p>
                </div>

                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/80 text-white uppercase tracking-wider">
                    PRE-ALTA
                  </span>
                </div>
              </div>
            </div>

            {/* AVISO INSTITUCIONAL */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-xs text-gray-600 space-y-2">
              <p className="font-bold text-gray-900">¿Para qué se destina tu aporte?</p>
              <ul className="space-y-1 list-disc pl-4">
                <li>Mantenimiento diario de instalaciones y canchas.</li>
                <li>Materiales y competencias para divisiones infantiles e inferiores.</li>
                <li>Obras y mejoras edilicias en el predio y salón social.</li>
              </ul>
            </div>
          </div>

          {/* COLUMNA DERECHA: FORMULARIO DE PRE-ALTA */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
              Formulario de Solicitud
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Completá tus datos para enviar la pre-asociación a la secretaría por WhatsApp.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Nombre *
                  </label>
                  <input
                    name="nombre"
                    value={form.nombre}
                    onChange={onChange}
                    required
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#B71C1C] focus:bg-white focus:ring-2 focus:ring-[#B71C1C]/20 transition-all"
                    placeholder="Ej: Juan"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Apellido *
                  </label>
                  <input
                    name="apellido"
                    value={form.apellido}
                    onChange={onChange}
                    required
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#B71C1C] focus:bg-white focus:ring-2 focus:ring-[#B71C1C]/20 transition-all"
                    placeholder="Ej: Pérez"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    DNI *
                  </label>
                  <input
                    name="dni"
                    value={form.dni}
                    onChange={onChange}
                    required
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#B71C1C] focus:bg-white focus:ring-2 focus:ring-[#B71C1C]/20 transition-all"
                    placeholder="Ej: 38123456"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    required
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#B71C1C] focus:bg-white focus:ring-2 focus:ring-[#B71C1C]/20 transition-all"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Plan Elegido
                </label>
                <select
                  name="plan"
                  value={form.plan}
                  onChange={(e) => {
                    onChange(e);
                    setSelectedPlanId(e.target.value);
                  }}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:border-[#B71C1C] focus:bg-white focus:ring-2 focus:ring-[#B71C1C]/20 transition-all"
                >
                  {PLANS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} — {p.price} {p.period}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Mensaje u Observación (Opcional)
                </label>
                <textarea
                  name="mensaje"
                  value={form.mensaje}
                  onChange={onChange}
                  rows={3}
                  className="mt-1.5 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#B71C1C] focus:bg-white focus:ring-2 focus:ring-[#B71C1C]/20 transition-all"
                  placeholder="¿Querés consultar por grupo familiar o disciplinas adicionales?"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-3 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    name="consentimiento"
                    checked={form.consentimiento}
                    onChange={onChange}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#B71C1C] focus:ring-[#B71C1C]"
                  />
                  <span>
                    Acepto que la secretaría del club me contacte vía WhatsApp para confirmar los datos y finalizar el alta de mi carnet.
                  </span>
                </label>
              </div>

              {ui.status !== "idle" && (
                <div
                  className={`rounded-xl p-3 text-xs font-semibold ${
                    ui.status === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
                  }`}
                >
                  {ui.msg}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#B71C1C] px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-md hover:bg-red-800 transition-all hover:scale-[1.01]"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.52 3.48A11.86 11.86 0 0 0 12.02 0C5.4 0 .02 5.38.02 12c0 2.12.55 4.19 1.6 6.02L0 24l6.17-1.6A11.96 11.96 0 0 0 12.02 24C18.64 24 24 18.62 24 12c0-3.2-1.25-6.21-3.48-8.52ZM12.02 22a9.98 9.98 0 0 1-5.1-1.4l-.37-.22-3.67.95.98-3.58-.24-.37A10.01 10.01 0 0 1 2.02 12C2.02 6.49 6.5 2 12.02 2c2.67 0 5.18 1.04 7.07 2.93A9.92 9.92 0 0 1 22.02 12c0 5.51-4.49 10-10 10Zm5.79-7.52c-.31-.16-1.82-.9-2.1-1-.28-.1-.48-.16-.68.16-.2.31-.78 1-.96 1.2-.18.2-.35.23-.66.08-.31-.16-1.29-.47-2.46-1.5-.91-.81-1.52-1.8-1.7-2.1-.18-.31-.02-.47.14-.63.14-.14.31-.35.47-.53.16-.18.2-.31.31-.51.1-.2.06-.39-.02-.55-.08-.16-.68-1.64-.93-2.25-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.51.08-.78.39-.27.31-1.02 1-1.02 2.44 0 1.43 1.04 2.81 1.18 3 .14.2 2.05 3.14 4.97 4.4.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.55-.08 1.82-.74 2.08-1.45.25-.71.25-1.31.18-1.45-.08-.14-.28-.23-.58-.39Z" />
                  </svg>
                  Enviar Pre-Asociación por WhatsApp
                </button>
              </div>

              <p className="text-center text-[11px] text-gray-500 pt-1">
                Al presionar el botón se abrirá WhatsApp con los datos ya formateados para enviar a la secretaría.
              </p>
            </form>
          </div>
        </section>

        {/* BENEFICIOS: COMERCIOS ADHERIDOS */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#B71C1C]">
                BENEFICIOS EXCLUSIVOS
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900">
                Descuentos en Comercios Adheridos
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-1 sm:mt-0">Presentando tu carnet de socio al día</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {SORTED_DISCOUNTS.map((partner) => {
              const normalized = Math.round((partner.percent / MAX_DISCOUNT) * 100);

              return (
                <div
                  key={partner.name}
                  className="rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all hover:bg-white hover:shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{partner.name}</p>
                      {partner.note && (
                        <p className="text-xs text-gray-500 mt-0.5">{partner.note}</p>
                      )}
                    </div>
                    <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-black bg-red-100 text-[#B71C1C]">
                      {partner.percent}% OFF
                    </span>
                  </div>

                  <div className="mt-3 h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#B71C1C]"
                      style={{ width: `${normalized}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-xs text-gray-500 text-center">
            * El convenio de descuentos se amplía permanentemente. Si sos comerciante y querés sumarte a la red de beneficios de Barrio Norte, contactanos.
          </p>
        </section>
      </div>
    </main>
  );
}