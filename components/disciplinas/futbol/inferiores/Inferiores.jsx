"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { FutbolLayout } from "../shared/FutbolShared";

import { TournamentSelector } from "../masculino/MasculinoUI";

import {
  HERO,
  CONTACT,
  QUICK_FACTS,
  BACKGROUND_IMAGE_URL,
  JOIN_AD,
  TEAM_LOGOS,
  CATEGORIES,
  TOURNAMENTS_BY_CATEGORY,
} from "./inferiores.config";

import { FlyerSumateInferioresFull, CategoryPillsCard, TablaFinalesIdaVueltaCard, TablaPosicionesInferioresLike } from "./InferioresUI";

const CAT_PARAM = "cat";
const TOUR_PARAM = "tour";

async function fetchJSON(url) {
  const r = await fetch(url, { cache: "no-store" });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j?.error || "Fetch failed");
  return j;
}

function normalizeTeamName(v) {
  return String(v || "").replace(/\u00A0/g, " ").trim().replace(/\s+/g, " ");
}

function withTeamLogosFinales(rows) {
  const safe = Array.isArray(rows) ? rows : [];

  return safe.map((r) => {
    const name = normalizeTeamName(r?.equipo);
    const noSpaces = name.replace(/\s+/g, "");
    const mapped = TEAM_LOGOS?.[name] || TEAM_LOGOS?.[noSpaces] || TEAM_LOGOS?.[r?.slug] || null;

    return {
      ...r,
      logo: mapped || r?.logo || "/escudos/BarrioNorte_V1.png",
    };
  });
}

function withTeamLogosEquipos(equipos) {
  const safe = Array.isArray(equipos) ? equipos : [];

  return safe.map((e) => {
    const name = normalizeTeamName(e?.name || e?.shortName);
    const noSpaces = name.replace(/\s+/g, "");
    const mapped = TEAM_LOGOS?.[name] || TEAM_LOGOS?.[noSpaces] || TEAM_LOGOS?.[e?.slug] || null;

    return {
      ...e,
      logo: mapped || e?.logo || "/escudos/BarrioNorte_V1.png",
    };
  });
}

function pickDefaultTournament(list) {
  const safe = Array.isArray(list) ? list : [];
  if (!safe.length) return null;

  const t2026 = safe.find((t) => /2026/i.test(String(t?.id)) || /2026/i.test(String(t?.label)));
  return t2026 || safe[0];
}

function normalizeId(v) {
  return String(v || "").trim().toLowerCase();
}

function findCategoryForTournament(tournamentId) {
  const map = TOURNAMENTS_BY_CATEGORY || {};
  for (const catId of Object.keys(map)) {
    const list = Array.isArray(map[catId]) ? map[catId] : [];
    if (list.some((t) => t.id === tournamentId)) return catId;
  }
  return null;
}

export default function Inferiores({ nav, active, onChange }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const spString = searchParams.toString();

  const defaultCategoryId = "tercera";

  const categories = Array.isArray(CATEGORIES) ? CATEGORIES : [];
  const initialCategory = categories.find((c) => c.id === defaultCategoryId)?.id || categories[0]?.id || defaultCategoryId;

  const [categoryId, setCategoryId] = useState(initialCategory);

  const tournaments = useMemo(() => {
    const map = TOURNAMENTS_BY_CATEGORY || {};
    return Array.isArray(map?.[categoryId]) ? map[categoryId] : [];
  }, [categoryId]);

  const defaultTournament = useMemo(() => pickDefaultTournament(tournaments), [tournaments]);
  const [tournamentId, setTournamentId] = useState(defaultTournament?.id || tournaments[0]?.id || "");

  // Si el URL pide un tour que requiere cambiar de categoría, lo “pendienteamos”
  const pendingTourRef = useRef(null);

  // ✅ Lee ?cat= y/o ?tour= (deep-link)
  useEffect(() => {
    const urlCat = normalizeId(searchParams.get(CAT_PARAM));
    const urlTour = normalizeId(searchParams.get(TOUR_PARAM));

    const validCat = urlCat && categories.some((c) => c.id === urlCat) ? urlCat : null;

    if (urlTour) {
      const inferredCat = findCategoryForTournament(urlTour) || validCat;

      if (inferredCat && inferredCat !== categoryId) {
        pendingTourRef.current = urlTour;
        setCategoryId(inferredCat);
        return;
      }

      if (tournaments.some((t) => t.id === urlTour) && urlTour !== tournamentId) {
        setTournamentId(urlTour);
      }

      pendingTourRef.current = null;
      return;
    }

    if (validCat && validCat !== categoryId) {
      setCategoryId(validCat);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spString, categories, categoryId, tournaments, tournamentId]);

  // Si venía un tour pendiente y ya estamos en la categoría correcta
  useEffect(() => {
    const pending = pendingTourRef.current;
    if (!pending) return;

    if (tournaments.some((t) => t.id === pending)) {
      setTournamentId(pending);
      pendingTourRef.current = null;
    }
  }, [tournaments]);

  // ✅ Cuando cambia la categoría, solo forzamos default si el torneo actual no existe en esa categoría
  useEffect(() => {
    if (!tournaments.length) return;

    if (tournamentId && tournaments.some((t) => t.id === tournamentId)) return;

    if (defaultTournament?.id) setTournamentId(defaultTournament.id);
  }, [tournaments, defaultTournament?.id, tournamentId]);

  // ✅ Cambio de categoría desde UI: actualiza URL (cat) y limpia tour (se volverá a setear al elegir/caer en default)
  function handleCategoryChange(nextCatId) {
    const nextCat = normalizeId(nextCatId);
    if (!nextCat || !categories.some((c) => c.id === nextCat)) return;

    setCategoryId(nextCat);

    const sp = new URLSearchParams(searchParams.toString());
    sp.set(CAT_PARAM, nextCat);
    sp.delete(TOUR_PARAM);

    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  // ✅ Cambio de torneo desde UI: actualiza URL (cat + tour) preservando tab, etc.
  function handleTournamentChange(nextId) {
    const next = normalizeId(nextId);
    if (!next) return;

    setTournamentId(next);

    const sp = new URLSearchParams(searchParams.toString());
    sp.set(CAT_PARAM, categoryId);
    sp.set(TOUR_PARAM, next);

    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const tournament = useMemo(() => {
    return tournaments.find((t) => t.id === tournamentId) || defaultTournament || tournaments[0] || null;
  }, [tournaments, tournamentId, defaultTournament]);

  const ui = tournament?.ui || {};
  const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

  function getUiText(key, fallback) {
    const raw = hasOwn(ui, key) ? ui[key] : fallback;

    if (raw === "" || raw === null) return undefined;

    if (typeof raw === "string") {
      return raw.replace(/\{label\}/g, tournament?.label || "");
    }

    return raw;
  }

  const [liga, setLiga] = useState(null);
  const [finalesRows, setFinalesRows] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!tournament?.id) return;

    async function load() {
      setLoading(true);
      setLiga(null);
      setFinalesRows(null);

      const bust = process.env.NODE_ENV === "development" ? `&_ts=${Date.now()}` : "";
      const base = `/api/tabla-posiciones?tournament=${encodeURIComponent(tournament.id)}${bust}`;

      try {
        const [ligaResp, finalesResp] = await Promise.all([
          fetchJSON(`${base}&type=${encodeURIComponent(tournament.tables.liga.type)}`)
            .then((j) => withTeamLogosEquipos(Array.isArray(j?.equipos) ? j.equipos : []))
            .catch(() => []),

          fetchJSON(`${base}&type=${encodeURIComponent(tournament.tables.finales.type)}`)
            .then((j) => withTeamLogosFinales(Array.isArray(j?.rows) ? j.rows : []))
            .catch(() => []),
        ]);

        if (!cancelled) {
          setLiga(ligaResp);
          setFinalesRows(finalesResp);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [tournament?.id, tournament?.tables?.liga?.type, tournament?.tables?.finales?.type]);

  const ready = !loading && Array.isArray(liga) && Array.isArray(finalesRows);

  return (
    <FutbolLayout hero={HERO} nav={nav} active={active} onChange={onChange} contact={CONTACT} quickFacts={QUICK_FACTS}>
      <style jsx global>{`
        html,
        body {
          overflow-x: hidden;
        }
      `}</style>

      <FlyerSumateInferioresFull data={JOIN_AD} backgroundImageUrl={BACKGROUND_IMAGE_URL} />

      <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 bg-gray-50">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-10 py-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
              <div className="min-w-0">
                <div className="flex items-end justify-between gap-3 mb-3 min-w-0">
                  <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">Tablas de posiciones</h2>
                  <span className="text-xs text-gray-500">{tournament?.label || ""}</span>
                </div>

                {!ready ? (
                  <div className="bg-white rounded-lg shadow-sm p-4 text-gray-800 min-w-0">
                    <p className="text-sm text-gray-600">{loading ? "Cargando torneo..." : "Cargando tablas..."}</p>
                  </div>
                ) : (
                  <div className="grid gap-4 xl:grid-cols-2 items-start min-w-0">
                    <TablaPosicionesInferioresLike
                      title={getUiText("ligaTitle", "Liga Departamental")}
                      phase={getUiText("ligaPhase", "Fase regular")}
                      equipos={liga}
                      footnote={getUiText("ligaFootnote", `Posiciones ${tournament?.label || ""}.`)}
                    />

                    <TablaFinalesIdaVueltaCard
                      rows={finalesRows}
                      title={getUiText("finalesTitle", "Semifinales y Final")}
                      phase={getUiText("finalesPhase", "Ida y vuelta")}
                      footnote={getUiText("finalesFootnote", "Serie ida y vuelta: define el global.")}
                      useShortNames
                    />
                  </div>
                )}
              </div>

              <aside className="min-w-0 w-full">
                <div className="flex items-end justify-between gap-3 mb-3 min-w-0">
                  <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">Categorías</h2>
                  <span className="text-xs text-gray-500">{tournament?.label || ""}</span>
                </div>

                <CategoryPillsCard categories={categories} value={categoryId} onChange={handleCategoryChange} />
              </aside>
            </div>

            <div className="w-full min-w-0">
              <TournamentSelector tournaments={tournaments} value={tournamentId} onChange={handleTournamentChange} />
            </div>
          </div>
        </div>
      </section>
    </FutbolLayout>
  );
}
