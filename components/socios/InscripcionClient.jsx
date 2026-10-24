"use client";

import { useState } from "react";

const WHATSAPP_NUMBER = "5493444622714";

export default function InscripcionClient() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    mensaje: "",
  });

  const [ui, setUi] = useState({ status: "idle", msg: "" });

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function buildWhatsappMessage() {
    const lines = [
      "👋 Hola Secretaría del Club Atlético Barrio Norte,",
      "Quiero solicitar mi asociación al club:",
      "",
      `👤 Nombre completo: ${form.nombre} ${form.apellido}`.trim(),
      `📄 DNI: ${form.dni}`,
      `✉️ Email: ${form.email}`,
      form.mensaje ? `💬 Mensaje u observación: ${form.mensaje}` : null,
      "",
      "¡Aguardo indicaciones para coordinar el alta! Muchas gracias.",
    ].filter(Boolean);

    return encodeURIComponent(lines.join("\n"));
  }

  function onSubmit(e) {
    e.preventDefault();

    if (!form.nombre.trim() || !form.apellido.trim() || !form.dni.trim() || !form.email.trim()) {
      setUi({
        status: "error",
        msg: "Por favor completá todos los campos obligatorios.",
      });
      return;
    }

    const text = buildWhatsappMessage();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;

    window.open(url, "_blank", "noopener,noreferrer");
    setUi({
      status: "ok",
      msg: "¡Listo! Se abrió WhatsApp con tu solicitud formateada para la secretaría del club.",
    });
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

      {/* FORMULARIO */}
      <div className="container mx-auto max-w-2xl px-4 pt-8 sm:pt-10">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <div className="border-b border-gray-100 pb-4 mb-6">
            <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#B71C1C]">
              SOLICITUD ONLINE
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900 mt-1">
              Formulario de Inscripción
            </h2>
            <p className="mt-1.5 text-sm text-gray-600">
              Completá tus datos para contactar directamente a la secretaría del club vía WhatsApp e iniciar tu asociación.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
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
                Mensaje u Observación (Opcional)
              </label>
              <textarea
                name="mensaje"
                value={form.mensaje}
                onChange={onChange}
                rows={3}
                className="mt-1.5 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#B71C1C] focus:bg-white focus:ring-2 focus:ring-[#B71C1C]/20 transition-all"
                placeholder="¿Querés consultar por grupo familiar o disciplinas?"
              />
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
                Enviar Solicitud por WhatsApp
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
