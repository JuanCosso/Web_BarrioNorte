"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const WHATSAPP_NUMBER = "5493444620469";
const ALIAS_TRANSFERENCIA = "barrionorte1950";

const PREMIOS_FINALES = [
  { puesto: "1° PREMIO", detalle: "1 CASA A ESTRENAR", extra: "En Schiaffino 724, Gualeguay", destacado: true },
  { puesto: "2° PREMIO", detalle: "$ 5.000.000.-", extra: "Objeto Arte Valor" },
  { puesto: "3° PREMIO", detalle: "$ 4.000.000.-", extra: "Objeto Arte Valor" },
  { puesto: "4° PREMIO", detalle: "$ 3.000.000.-", extra: "Objeto Arte Valor" },
  { puesto: "5° PREMIO", detalle: "$ 2.000.000.-", extra: "Objeto Arte Valor" },
];

const PREMIOS_MENSUALES = [
  { puesto: "1° Premio", monto: "$ 400.000.-" },
  { puesto: "2° Premio", monto: "$ 300.000.-" },
  { puesto: "3° Premio", monto: "$ 200.000.-" },
];

const CRONOGRAMA_CUOTAS = [
  { cuota: "1°", fecha: "15 de Agosto de 2026", monto: "$ 20.000.-" },
  { cuota: "2°", fecha: "19 de Septiembre de 2026", monto: "$ 20.000.-" },
  { cuota: "3°", fecha: "17 de Octubre de 2026", monto: "$ 20.000.-" },
  { cuota: "4°", fecha: "21 de Noviembre de 2026", monto: "$ 24.000.-" },
  { cuota: "5°", fecha: "19 de Diciembre de 2026", monto: "$ 24.000.-" },
  { cuota: "6°", fecha: "16 de Enero de 2027", monto: "$ 24.000.-" },
  { cuota: "7°", fecha: "20 de Febrero de 2027", monto: "$ 28.000.-" },
  { cuota: "8°", fecha: "20 de Marzo de 2027", monto: "$ 28.000.-" },
  { cuota: "9°", fecha: "17 de Abril de 2027", monto: "$ 28.000.-" },
  { cuota: "10°", fecha: "15 de Mayo de 2027", monto: "$ 28.000.-" },
  { cuota: "11° (FINAL)", fecha: "19 de Junio de 2027", monto: "$ 30.000.-", isFinal: true },
];

export default function Bono2027Client() {
  const [copied, setCopied] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [numberGroups, setNumberGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [groupsError, setGroupsError] = useState("");
  const [numberStorageAvailable, setNumberStorageAvailable] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/bono-numeros", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "No se pudieron cargar los números.");
        if (isMounted) {
          setNumberGroups(data.groups);
          setNumberStorageAvailable(data.storageAvailable);
        }
      })
      .catch((error) => {
        console.error("Error cargando números del bono:", error);
        if (isMounted) setGroupsError("No se pudieron cargar los números. Volvé a intentar más tarde.");
      })
      .finally(() => {
        if (isMounted) setLoadingGroups(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  function copyAlias() {
    navigator.clipboard.writeText(ALIAS_TRANSFERENCIA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function getWhatsAppUrl(groupNumbers = null) {
    let text = "👋 Hola Secretaría del Club Atlético Barrio Norte, me interesa adquirir el Bono Contribución 2027.";
    if (groupNumbers) {
      text += ` Me interesa el grupo de números: ${groupNumbers.join(" - ")}. Ya cuento con el alias ${ALIAS_TRANSFERENCIA} para transferir.`;
    } else {
      text += ` Ya cuento con el alias ${ALIAS_TRANSFERENCIA} para transferir y enviarles el comprobante.`;
    }
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      {/* HEADER INSTITUCIONAL */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 pt-8 pb-10 sm:pt-10 sm:pb-12 text-center">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gray-900 font-semibold mb-2">
            BONO CONTRIBUCIÓN
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">
            Participá por <span className="text-[#B71C1C] italic">grandes</span> premios
          </h1>
        </div>
      </header>

      <div className="container mx-auto max-w-7xl px-4 pt-8 sm:pt-10 space-y-12">
        {/* CUERPO PRINCIPAL: 2 COLUMNAS (IZQUIERDA: NÚMEROS / DERECHA: PREMIOS Y MAPA) */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* COLUMNA IZQUIERDA: NÚMEROS DISPONIBLES & MÉTODO DE PAGO */}
          <section className="lg:col-span-7 space-y-6">
            
            {/* CARD DE PAGO Y PASOS */}
            <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50/60 via-white to-white p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-red-100 pb-4">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#B71C1C]">
                    MÉTODO DE COMPRA
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                    Transferencia Bancaria
                  </h2>
                </div>
                
                {/* BOTÓN COPIAR ALIAS */}
                <div className="flex items-center gap-2">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] uppercase font-bold text-gray-500">Alias de Cuenta</p>
                    <p className="font-mono text-base font-black text-[#B71C1C]">{ALIAS_TRANSFERENCIA}</p>
                  </div>
                  <button
                    type="button"
                    onClick={copyAlias}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 hover:bg-[#B71C1C] text-white px-3.5 py-2 text-xs font-bold transition-all shadow-xs"
                    title="Copiar alias"
                  >
                    {copied ? (
                      <>
                        <span>✓</span>
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <rect width="13" height="13" x="9" y="9" rx="2" ry="2"/>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* INSTRUCCIONES */}
              <div className="mt-4 grid gap-3 sm:grid-cols-3 text-xs text-gray-700">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-gray-100 shadow-xs">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-[#B71C1C] font-black text-xs">
                    1
                  </span>
                  <div>
                    <p className="font-bold text-gray-900">Elegí tus números</p>
                    <p className="text-gray-500 mt-0.5">Cada bono te adjudica 4 números de 4 cifras.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-gray-100 shadow-xs">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-[#B71C1C] font-black text-xs">
                    2
                  </span>
                  <div>
                    <p className="font-bold text-gray-900">Transferí al Alias</p>
                    <p className="text-gray-500 mt-0.5">Transferí a <strong>{ALIAS_TRANSFERENCIA}</strong> el valor de cuota o contado.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-gray-100 shadow-xs">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-[#B71C1C] font-black text-xs">
                    3
                  </span>
                  <div>
                    <p className="font-bold text-gray-900">Enviá Comprobante</p>
                    <p className="text-gray-500 mt-0.5">Enviá la captura por WhatsApp y te confirmarán vencimientos.</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 border-t border-red-100 pt-4 sm:grid-cols-2">
                <a
                  href="#precio-en-cuotas"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2.5 text-xs font-bold text-[#B71C1C] transition-colors hover:border-red-300 hover:bg-red-50"
                >
                  Ver precio en cuotas
                  <span aria-hidden="true">↓</span>
                </a>
                <a
                  href="#condiciones-bono"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs font-bold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
                >
                  Ver condiciones
                  <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>

            {/* LISTA DE NÚMEROS DISPONIBLES */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#B71C1C]">
                    COMBINACIONES DISPONIBLES
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-gray-900">
                    Grupos de 4 Números
                  </h3>
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  {numberStorageAvailable
                    ? `${numberGroups.filter((group) => !group.sold).length} disponibles`
                    : "Disponibilidad sin confirmar"} ({numberGroups.length} combinaciones)
                </span>
              </div>

              <p className="text-xs sm:text-sm text-gray-600">
                Seleccioná la combinación que prefieras para solicitarla por WhatsApp a la secretaría del club.
              </p>

              {!loadingGroups && !groupsError && !numberStorageAvailable && (
                <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
                  Mostramos los números, pero no podemos confirmar su disponibilidad en este momento. Consultá a Secretaría antes de elegir.
                </p>
              )}

              {groupsError ? (
                <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-700">
                  {groupsError}
                </p>
              ) : loadingGroups ? (
                <p className="py-6 text-center text-sm font-semibold text-gray-500">Cargando números...</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {numberGroups.map((group) => {
                  const isVendido = group.sold;

                  return (
                    <div
                      key={group.id}
                      className={`rounded-xl border p-3.5 transition-all flex flex-col justify-between gap-3 ${
                        isVendido
                          ? "border-gray-200 bg-gray-50/70"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      {/* NÚMEROS */}
                      <div className="grid grid-cols-4 gap-1.5 text-center">
                        {group.numbers.map((num) => (
                          <span
                            key={num}
                            className={`font-mono text-sm sm:text-base font-extrabold py-1 rounded-lg border tracking-wider transition-colors ${
                              isVendido
                                ? "bg-gray-100 text-gray-400 border-gray-200 line-through"
                                : "bg-gray-100 text-gray-900 border-gray-200"
                            }`}
                          >
                            {num}
                          </span>
                        ))}
                      </div>

                      {/* BOTÓN SELECCIÓN / CONSULTA */}
                      <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-xs">
                        <span className="text-gray-400 font-semibold text-[11px]">
                          Opción #{group.id}
                        </span>
                        {isVendido ? (
                          <span className="inline-flex items-center gap-1 font-bold text-gray-400 bg-gray-200/80 px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider cursor-not-allowed">
                            Vendido
                          </span>
                        ) : !numberStorageAvailable ? (
                          <span className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider">
                            Consultar disponibilidad
                          </span>
                        ) : (
                          <a
                            href={getWhatsAppUrl(group.numbers)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-bold text-white bg-[#B71C1C] hover:bg-red-800 px-3 py-1.5 rounded-lg transition-colors shadow-xs"
                          >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.52 3.48A11.86 11.86 0 0 0 12.02 0C5.4 0 .02 5.38.02 12c0 2.12.55 4.19 1.6 6.02L0 24l6.17-1.6A11.96 11.96 0 0 0 12.02 24C18.64 24 24 18.62 24 12c0-3.2-1.25-6.21-3.48-8.52ZM12.02 22a9.98 9.98 0 0 1-5.1-1.4l-.37-.22-3.67.95.98-3.58-.24-.37A10.01 10.01 0 0 1 2.02 12C2.02 6.49 6.5 2 12.02 2c2.67 0 5.18 1.04 7.07 2.93A9.92 9.92 0 0 1 22.02 12c0 5.51-4.49 10-10 10Zm5.79-7.52c-.31-.16-1.82-.9-2.1-1-.28-.1-.48-.16-.68.16-.2.31-.78 1-.96 1.2-.18.2-.35.23-.66.08-.31-.16-1.29-.47-2.46-1.5-.91-.81-1.52-1.8-1.7-2.1-.18-.31-.02-.47.14-.63.14-.14.31-.35.47-.53.16-.18.2-.31.31-.51.1-.2.06-.39-.02-.55-.08-.16-.68-1.64-.93-2.25-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.51.08-.78.39-.27.31-1.02 1-1.02 2.44 0 1.43 1.04 2.81 1.18 3 .14.2 2.05 3.14 4.97 4.4.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.55-.08 1.82-.74 2.08-1.45.25-.71.25-1.31.18-1.45-.08-.14-.28-.23-.58-.39Z" />
                            </svg>
                            <span>Elegir</span>
                          </a>
                        )}
                      </div>
                    </div>
                  );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* COLUMNA DERECHA: INFORMACIÓN PRINCIPAL & MAPA DE LA CASA */}
          <aside className="lg:col-span-5 space-y-6">

            {/* 1° PREMIO DESTACADO */}
            <div className="rounded-2xl border-2 border-[#B71C1C] bg-white overflow-hidden shadow-md">
              <div className="relative w-full aspect-[16/9] bg-neutral-900">
                <Image
                  src="/inicio/casa.png"
                  alt="Casa a estrenar en Schiaffino 724 - 1° Premio Bono 2027"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-3 left-3 bg-[#B71C1C] text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-md shadow-md">
                  1° PREMIO
                </div>
              </div>

              <div className="p-5 sm:p-6 space-y-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                    1 CASA A ESTRENAR
                  </h2>
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-gray-600">
                    <span className="text-red-600">📍</span>
                    <span>Schiaffino 724, Gualeguay, Entre Ríos</span>
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Otros Premios Principales
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {PREMIOS_FINALES.slice(1).map((p) => (
                      <div key={p.puesto} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="font-extrabold text-[#B71C1C] text-[10px] uppercase block">
                          {p.puesto}
                        </span>
                        <p className="text-sm font-black text-gray-900 mt-0.5">{p.detalle}</p>
                        <span className="text-[10px] text-gray-400">{p.extra}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* DETALLES DE SORTEO & VALOR */}
                <div className="rounded-xl bg-neutral-900 text-white p-4 space-y-2">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs text-gray-300">Valor Total:</span>
                    <span className="text-base font-black text-white">$ 270.000.-</span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Contado (hasta diciembre 2026) ó en 11 cuotas mensuales.
                  </p>
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-gray-300">Fecha Sorteo:</span>
                    <span className="text-xs font-bold text-red-400">19 de Junio de 2027</span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Por Tómbola Nocturna de Entre Ríos.
                  </p>
                </div>
              </div>
            </div>

            {/* MINIMAPA DE GOOGLE MAPS */}
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#B71C1C]">
                    UBICACIÓN EXACTA
                  </p>
                  <h3 className="text-sm font-bold text-gray-900">
                    Schiaffino 724 · Gualeguay
                  </h3>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Schiaffino+724,+Gualeguay,+Entre+Rios"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#B71C1C] hover:underline"
                >
                  Ver en Google Maps →
                </a>
              </div>

              <div className="relative w-full h-56 sm:h-64 bg-gray-100">
                <iframe
                  src="https://maps.google.com/maps?q=Schiaffino+724,+Gualeguay,+Entre+Rios,+Argentina&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de la casa a estrenar"
                />
              </div>
            </div>

          </aside>
        </div>

        {/* SECCIÓN COMPLETA DE ANCHO TOTAL (INFORMACIÓN CLAVE DE LA 2DA IMAGEN) */}
        <div className="pt-6 border-t border-gray-200 space-y-10">

          {/* PREMIOS MENSUALES POR CUOTA AL DÍA & VENCIMIENTOS */}
          <div className="grid gap-8 lg:grid-cols-12">
            
            {/* PREMIOS MENSUALES */}
            <section className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#B71C1C]">
                  INCENTIVO MENSUAL
                </span>
                <h3 className="text-2xl font-black text-gray-900 mt-1">
                  3 Premios Mensuales
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Exclusivo para los adquirentes con la <strong>cuota al día</strong> en cada sorteo mensual.
                </p>

                <div className="mt-6 space-y-3">
                  {PREMIOS_MENSUALES.map((p, idx) => (
                    <div
                      key={p.puesto}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100 text-[#B71C1C] font-black text-xs">
                          {idx + 1}°
                        </span>
                        <span className="font-bold text-gray-900 text-sm">{p.puesto}</span>
                      </div>
                      <span className="font-black text-base text-[#B71C1C] font-mono">{p.monto}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 p-3 rounded-xl bg-amber-50 border border-amber-200/60 text-xs text-amber-900">
                💡 <em>Todos los premios mensuales son en concepto de Objeto Arte Valor.</em>
              </div>
            </section>

            {/* CRONOGRAMA DE CUOTAS Y SORTEOS */}
            <section id="precio-en-cuotas" className="scroll-mt-6 lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#B71C1C]">
                PLAN EN 11 CUOTAS
              </span>
              <h3 className="text-2xl font-black text-gray-900 mt-1">
                Vencimientos y Fechas de Sorteo
              </h3>
              <p className="text-sm text-gray-600 mt-1 mb-4">
                Fechas oficiales de vencimiento de cuotas mensuales y sorteos correspondientes.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 font-bold uppercase text-[11px]">
                      <th className="py-2.5 px-3">Cuota</th>
                      <th className="py-2.5 px-3">Fecha Vencimiento / Sorteo</th>
                      <th className="py-2.5 px-3 text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {CRONOGRAMA_CUOTAS.map((item) => (
                      <tr
                        key={item.cuota}
                        className={`transition-colors ${
                          item.isFinal ? "bg-red-50/70 font-bold" : "hover:bg-gray-50/70"
                        }`}
                      >
                        <td className="py-2 px-3 font-semibold text-gray-900">
                          {item.cuota}
                        </td>
                        <td className="py-2 px-3 text-gray-700">
                          {item.fecha}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-gray-900">
                          {item.monto}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* CONDICIONES GENERALES COMPLETAS */}
          <section id="condiciones-bono" className="scroll-mt-6 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <div className="border-b border-gray-100 pb-3 mb-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#B71C1C]">
                BASES LEGALES E INSTITUCIONALES
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                Condiciones Generales del Bono
              </h3>
            </div>

            <div className="prose prose-sm max-w-none text-gray-600 space-y-3 leading-relaxed text-xs sm:text-sm">
              <p>
                Este Bono puede ser adquirido al contado, cuyo valor total es de <strong>$ 270.000.- (Pesos Doscientos setenta mil)</strong> ó en <strong>11 (once) cuotas</strong> mensuales y consecutivas, distribuidas de la siguiente manera: 3 (tres) de $ 20.000.- (Pesos Veinte mil), 4 (cuatro) de $ 24.000.- (Pesos veinticuatro mil), 3 (tres) de $ 28.000.- (Pesos veintiocho mil), y 1 (una) de $ 30.000. Venciendo la primera cuota el día 15 de Agosto de 2026.
              </p>
              <p>
                El Club no se responsabiliza por pérdida o sustracción del Bono. El mismo es al portador. El Club se reserva el derecho de recolocar el Bono en caso de que cualesquiera de las cuotas no sean abonadas en término, perdiendo el adquirente el importe de las cuotas abonadas.
              </p>
              <p>
                Se fija un plazo de <strong>30 (treinta) días</strong> para presentar los bonos favorecidos y retirar los premios, vencido el cual caducará el derecho a reclamo. Se pone a la venta únicamente <strong>2.500 (dos mil quinientos)</strong> Bonos con 4 (cuatro) números de 4 (cuatro) cifras cada uno, numerados del 0000 al 9999.
              </p>
              <p>
                En caso de que la Tómbola Nocturna de Entre Ríos postergare o suspendiese el sorteo de la fecha programada y coincidente con el sorteo final del Bono, automáticamente el mismo pasará para el primer sorteo posterior. Para el retiro de los premios deberá presentarse el Bono, conjuntamente con la totalidad de los recibos de las cuotas vencidas.
              </p>
              <p className="bg-red-50 p-3.5 rounded-xl border border-red-100 font-semibold text-gray-800">
                🏆 <strong>Escrituración Oficial:</strong> Los gastos y honorarios que demande la escritura de dominio a favor del titular del número ganador serán abonados íntegramente por el <strong>CLUB ATLÉTICO BARRIO NORTE</strong>. El presente constituye para el comprador el total reconocimiento de estas condiciones generales y su total aceptación.
              </p>
            </div>
          </section>

          {/* CTA FINAL WHATSAPP */}
          <div className="rounded-2xl bg-neutral-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md text-center sm:text-left">
            <div>
              <p className="text-xs uppercase tracking-widest text-red-500 font-bold">
                SECRETARÍA DEL CLUB
              </p>
              <h3 className="text-2xl font-black text-white mt-1">
                ¿Tenés consultas sobre el Bono 2027?
              </h3>
              <p className="text-sm text-gray-400 mt-1 max-w-xl">
                Contactanos por WhatsApp para confirmar disponibilidad de números o enviar tu comprobante de transferencia.
              </p>
            </div>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#B71C1C] hover:bg-red-700 text-white px-6 py-3.5 text-sm font-bold uppercase tracking-wider transition-all shadow-md shrink-0 hover:scale-105"
            >
              Consultar por WhatsApp →
            </a>
          </div>

        </div>
      </div>
    </main>
  );
}
