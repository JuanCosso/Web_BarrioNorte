"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function AdminNoticias() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("TODAS");

  // Estado del Modal / Formulario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    title: "",
    slug: "",
    summary: "",
    content: "",
    category: "Fútbol",
    tags: "Liga, Barrio Norte",
    imageUrl: "/inicio/Proximo-Partido-Fondo.png",
    featured: false,
    publishedAt: new Date().toISOString().split("T")[0],
    source: "Oficial CABN",
  };
  const [formData, setFormData] = useState(initialForm);
  const [statusMessage, setStatusMessage] = useState(null);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/noticias");
      const data = await res.json();
      if (data.news) setNews(data.news);
    } catch (err) {
      console.error("Error cargando noticias:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      ...initialForm,
      publishedAt: new Date().toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      slug: item.slug,
      summary: item.summary || "",
      content: item.content || "",
      category: item.category || "Fútbol",
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : "",
      imageUrl: item.imageUrl || "/inicio/Proximo-Partido-Fondo.png",
      featured: Boolean(item.featured),
      publishedAt: item.publishedAt
        ? new Date(item.publishedAt).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      source: item.source || "Oficial CABN",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`¿Estás seguro de eliminar la noticia "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/noticias?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setNews((prev) => prev.filter((n) => n.id !== id));
        showToast("Noticia eliminada correctamente.");
      } else {
        alert("Error al eliminar la noticia");
      }
    } catch (err) {
      alert("Error de conexión al eliminar");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      let res;
      if (editingId) {
        res = await fetch("/api/admin/noticias", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
      } else {
        res = await fetch("/api/admin/noticias", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setIsModalOpen(false);
        fetchNews();
        showToast(editingId ? "Noticia actualizada con éxito." : "Noticia creada con éxito.");
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error || "No se pudo guardar la noticia"}`);
      }
    } catch (err) {
      alert("Error de red al guardar la noticia.");
    } finally {
      setSaving(false);
    }
  };

  const showToast = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const filteredNews = news.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.summary.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === "TODAS" || n.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = ["TODAS", "Fútbol", "Primera", "Femenino", "Institucional", "Obras", "Samba Verá"];

  return (
    <div className="space-y-6">
      {/* Toast de notificación */}
      {statusMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white font-bold px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span>✓</span> {statusMessage}
        </div>
      )}

      {/* Barra de Acciones y Filtros */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-neutral-900/90 border border-neutral-800 p-4 rounded-2xl shadow-xl">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <input
            type="text"
            placeholder="Buscar noticia por título o resumen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-600 flex-1 min-w-[200px]"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-600"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs sm:text-sm tracking-wider px-5 py-2.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <span className="text-lg leading-none">+</span> Nueva Noticia
        </button>
      </div>

      {/* Lista de Noticias */}
      {loading ? (
        <div className="py-20 text-center text-neutral-500 font-bold">Cargando noticias desde Neon DB...</div>
      ) : filteredNews.length === 0 ? (
        <div className="py-20 text-center bg-neutral-900/40 border border-neutral-800 rounded-2xl text-neutral-400">
          No se encontraron noticias con los filtros seleccionados.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNews.map((item) => (
            <div
              key={item.id}
              className="bg-neutral-900/80 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                {/* Imagen */}
                <div className="relative h-44 w-full bg-neutral-950">
                  <Image
                    src={item.imageUrl || "/inicio/Proximo-Partido-Fondo.png"}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-red-600/90 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                      {item.category}
                    </span>
                    {item.featured && (
                      <span className="bg-amber-500 text-black text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                        ★ Destacada
                      </span>
                    )}
                  </div>
                  <span className="absolute bottom-2 right-3 text-neutral-400 text-xs font-mono">
                    {new Date(item.publishedAt).toLocaleDateString("es-AR")}
                  </span>
                </div>

                {/* Contenido */}
                <div className="p-4 space-y-2">
                  <h3 className="font-extrabold text-white text-base line-clamp-2 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-neutral-400 text-xs line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="p-4 pt-0 flex items-center justify-between border-t border-neutral-800/60 mt-3 pt-3">
                <span className="text-[11px] text-neutral-500 font-mono">ID: #{item.id}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded-lg transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="px-3 py-1.5 bg-red-950/50 hover:bg-red-900/60 text-red-400 text-xs font-bold rounded-lg transition-colors border border-red-900/40"
                  >
                    Borrar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL CREAR / EDITAR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-2xl rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h2 className="text-xl font-black uppercase text-white tracking-wide">
                {editingId ? "Editar Noticia" : "Nueva Noticia Institucional"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Título */}
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                  Título de la Noticia *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Gran triunfo en el clásico de la ciudad"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              {/* Categoría y Fecha */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                    Categoría
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-600"
                  >
                    <option value="Fútbol">Fútbol General</option>
                    <option value="Primera">Primera Masculino</option>
                    <option value="Femenino">Fútbol Femenino</option>
                    <option value="Inferiores">Inferiores / Infantiles</option>
                    <option value="Institucional">Institucional / Club</option>
                    <option value="Obras">Obras y Progreso</option>
                    <option value="Samba Verá">Comparsa Samba Verá</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                    Fecha de Publicación
                  </label>
                  <input
                    type="date"
                    value={formData.publishedAt}
                    onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              {/* Copete / Resumen */}
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                  Copete / Resumen Corto *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Resumen de dos oraciones para la portada del sitio..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              {/* Contenido Extenso */}
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                  Cuerpo / Contenido Completo (Opcional)
                </label>
                <textarea
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Detalles completos de la noticia, crónica del partido o comunicado..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              {/* URL de Imagen y Previsualización */}
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                  URL de la Imagen
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://... o /inicio/foto.jpg"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-600"
                />
                {formData.imageUrl && (
                  <div className="mt-2 relative h-28 w-full max-w-sm rounded-xl overflow-hidden border border-neutral-800">
                    <Image
                      src={formData.imageUrl}
                      alt="Previsualización"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
              </div>

              {/* Tags y Destacada */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                    Etiquetas / Tags (separados por coma)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Liga, Resultados, Petit Torneo"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-red-600"
                  />
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 accent-red-600 rounded"
                  />
                  <label htmlFor="featured" className="text-sm font-bold text-white cursor-pointer select-none">
                    ★ Noticia Destacada en Portada
                  </label>
                </div>
              </div>

              {/* Botones */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-700 text-neutral-300 font-bold text-sm hover:bg-neutral-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm tracking-wider uppercase transition-all shadow-lg disabled:opacity-50"
                >
                  {saving ? "Guardando..." : editingId ? "Actualizar Noticia" : "Publicar Noticia"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
