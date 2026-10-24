"use client";

import { useEffect, useState } from "react";

export default function AdminBono() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [storageAvailable, setStorageAvailable] = useState(true);

  const loadGroups = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/bono", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudieron cargar los grupos.");
      setGroups(data.groups);
      setStorageAvailable(data.storageAvailable);
    } catch (loadError) {
      setError(loadError.message || "Error de conexión al cargar los grupos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const setGroupSold = async (group, sold) => {
    setSavingId(group.id);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/bono", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: group.id, sold }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo actualizar el grupo.");
      setGroups((current) =>
        current.map((item) => (item.id === data.group.id ? data.group : item))
      );
      setMessage(`Grupo #${group.id} actualizado. El cambio ya se refleja en la página.`);
    } catch (saveError) {
      setError(saveError.message || "Error de conexión al actualizar el grupo.");
    } finally {
      setSavingId(null);
    }
  };

  const soldCount = groups.filter((group) => group.sold && !group.hidden).length;

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6">
        <h2 className="text-lg font-black uppercase text-white">Bono Contribución 2027</h2>
        <p className="mt-2 text-sm text-neutral-400">
          Marcá cada grupo como vendido o disponible. El cambio se guarda en la base de datos
          y aparece en la web sin necesidad de publicar una nueva versión.
        </p>
        {!loading && (
          <p className="mt-3 text-xs font-bold uppercase tracking-wide text-neutral-300">
            {soldCount} vendidos · {groups.filter((group) => !group.sold && !group.hidden).length} disponibles
          </p>
        )}
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-red-800 bg-red-950/50 p-4 text-sm text-red-200">
          {error}
        </div>
      )}
      {!loading && !storageAvailable && (
        <div role="alert" className="rounded-xl border border-amber-800 bg-amber-950/50 p-4 text-sm text-amber-200">
          Se muestran los grupos iniciales, pero no se pudieron leer de la base de datos. Los estados no se pueden modificar hasta que la tabla del bono esté creada y la conexión a PostgreSQL funcione.
        </div>
      )}
      {message && (
        <p role="status" className="rounded-xl border border-emerald-800 bg-emerald-950/40 p-4 text-sm text-emerald-200">
          {message}
        </p>
      )}

      {loading ? (
        <p className="py-10 text-center text-sm font-semibold text-neutral-400">Cargando grupos...</p>
      ) : groups.length === 0 ? (
        <p className="py-10 text-center text-sm font-semibold text-neutral-400">No hay grupos cargados.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <article
              key={group.id}
              className="rounded-xl border border-neutral-800 bg-neutral-900 p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Grupo #{group.id}
                </span>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${
                  !storageAvailable
                    ? "bg-amber-950 text-amber-300"
                    : group.sold
                    ? "bg-red-950 text-red-300"
                    : "bg-emerald-950 text-emerald-300"
                }`}>
                  {!storageAvailable
                    ? "No confirmado"
                    : group.sold
                      ? "Vendido"
                      : "Disponible"}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {group.numbers.map((number) => (
                  <span
                    key={number}
                    className="rounded-lg bg-neutral-800 px-1 py-2 text-center font-mono text-sm font-bold text-white"
                  >
                    {number}
                  </span>
                ))}
              </div>
              <button
                type="button"
                disabled={!storageAvailable || savingId === group.id}
                onClick={() => setGroupSold(group, !group.sold)}
                className={`mt-4 w-full rounded-lg px-3 py-2.5 text-xs font-black uppercase transition-colors disabled:cursor-wait disabled:opacity-50 ${
                  group.sold
                    ? "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                    : "bg-red-700 text-white hover:bg-red-600"
                }`}
              >
                {savingId === group.id
                  ? "Guardando..."
                  : group.sold
                    ? "Marcar disponible"
                    : "Marcar vendido"}
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
