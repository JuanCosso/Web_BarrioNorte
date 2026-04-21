"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import fixture from "../../../../data/fixture/masculino.json";
import { getNextMatch, formatFlyerData } from "../../../../lib/fixture";

import { FutbolLayout } from "../shared/FutbolShared";

import {
  HERO,
  CONTACT,
  QUICK_FACTS,
  BACKGROUND_IMAGE_URL,
  TITLES,
  TOURNAMENTS,
  TOURNAMENT_CONTENT,
  TEAM_LOGOS,
} from "./masculino.config";

import {
  FlyerProximoPartidoFull,
  TablaPosicionesInicioLike,
  TablaLlavesCard,
  TablaRondasSeriesCard,
  UltimosPartidosCard,
  PeopleCard,
  PalmaresCard,
  TournamentSelector,
} from "./MasculinoUI";

const TOUR_PARAM = "tour";

async function fetchJSON(url) {
  const r = await fetch(url, { cache: "no-store" });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j?.error || "Fetch failed");
  return j;
}

function withTeamLogos(rows) {
  const safe = Array.isArray(rows) ? rows : [];
  return safe.map((r) => ({
    ...r,
    logo: TEAM_LOGOS[r.equipo] || "/escudos/BarrioNorte_V1.png",
  }));
}

/**
 * Enriquece equipos con: slug, logo, pts, shortName
 */
function enrichTeamData(equipos) {
  const TEAM_SHORT = {
    "Sociedad Sportiva": "Sportiva",
    SociedadSportiva: "Sportiva",
    "Gualeguay Central": "Central",
    GualeguayCentral: "Central",
  };

  const safe = Array.isArray(equipos) ? equipos : [];

  return safe.map((e) => {
    const rawName = String(e?.name || e?.shortName || "").replace(/\u00A0/g, " ").trim();
    const name = rawName.replace(/\s+/g, " ");
    const noSpaces = name.replace(/\s+/g, "");
    const slug = noSpaces.toLowerCase();

    const mapped = TEAM_LOGOS[name] || TEAM_LOGOS[noSpaces] || TEAM_LOGOS[e?.slug] || null;
    const pg = Number(e?.pg || 0);
    const pe = Number(e?.pe || 0);
    const pts = pg * 3 + pe;

    return {
      ...e,
      slug: e?.slug || slug,
      name: name,
      shortName: e?.shortName || TEAM_SHORT[name] || name,
      logo: mapped || e?.logo || "/escudos/BarrioNorte_V1.png",
      pts: e?.pts || pts,
    };
  });
}

export default function Masculino({ nav, active, onChange }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const spString = searchParams.toString();

  // Default: Preparación 2026
  const [tournamentId, setTournamentId] = useState("oficial-2026");

  // ✅ Lee ?tour=... (deep-link)
  useEffect(() => {
    const fromUrl = String(searchParams.get(TOUR_PARAM) || "").trim().toLowerCase();
    if (!fromUrl) return;

    const exists = TOURNAMENTS.some((t) => t.id === fromUrl);
    if (exists && fromUrl !== tournamentId) {
      setTournamentId(fromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spString]);

  // ✅ Cuando cambia el selector: actualiza estado + URL preservando otros params (tab, etc.)
  function handleTournamentChange(nextId) {
    const next = String(nextId || "").trim().toLowerCase();
    if (!next) return;

    setTournamentId(next);

    const sp = new URLSearchParams(searchParams.toString());
    sp.set(TOUR_PARAM, next);

    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const tournament = useMemo(
    () => TOURNAMENTS.find((t) => t.id === tournamentId) || TOURNAMENTS[0],
    [tournamentId]
  );

  const [content, setContent] = useState(() => 
    TOURNAMENT_CONTENT[tournamentId] || { results: [], staff: [], roster: [] }
  );

  // Cargar resultados dinámicamente del API cuando sea oficial-2026
  useEffect(() => {
    async function loadResults() {
      const baseContent = TOURNAMENT_CONTENT[tournamentId] || { results: [], staff: [], roster: [] };
      
      // Si es oficial-2026 o femenino 2026, intenta cargar desde el API
      if (tournamentId.includes("2026")) {
        try {
          const category = tournamentId.includes("fem") ? "femenino" : "masculino";
          const response = await fetch(
            `/api/resultados?tournament=${encodeURIComponent(tournamentId)}&category=${encodeURIComponent(category)}`
          );
          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data.results) && data.results.length > 0) {
              setContent({ ...baseContent, results: data.results });
              return;
            }
          }
        } catch (e) {
          // Si falla, usa el del config
        }
      }
      
      setContent(baseContent);
    }
    
    loadResults();
  }, [tournamentId]);

  const [tables, setTables] = useState({});
  const [bracketRows, setBracketRows] = useState(null);
  const [loading, setLoading] = useState(false);

  const next = getNextMatch(fixture, new Date());
  const flyerData = formatFlyerData(next);

  // ===== Footnotes por torneo =====
  const ui = tournament?.ui || {};
  const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

  function getFootnote(key, fallback) {
    const raw = hasOwn(ui, key) ? ui[key] : fallback;

    if (raw === "" || raw === null) return undefined;

    if (typeof raw === "string") {
      return raw.replace(/\{label\}/g, tournament.label);
    }

    return raw;
  }

  useEffect(() => {
    let cancelled = false;

    async function loadTournamentTables() {
      setLoading(true);
      setBracketRows(null);

      // placeholders (null = cargando)
      if (tournament.format === "oficial") setTables({ liga: null, petit: null });
      if (tournament.format === "preparacion") setTables({ grupoA: null, grupoB: null });
      if (tournament.format === "supercopa") setTables({ group: null });

      const base = `/api/tabla-posiciones?tournament=${encodeURIComponent(tournament.id)}`;

      try {
        if (tournament.format === "oficial") {
          const [liga, petit, llaves] = await Promise.all([
            fetchJSON(`${base}&type=${encodeURIComponent(tournament.tables.liga.type)}`)
              .then((j) => enrichTeamData(Array.isArray(j?.equipos) ? j.equipos : []))
              .catch(() => []),

            fetchJSON(`${base}&type=${encodeURIComponent(tournament.tables.petit.type)}`)
              .then((j) => enrichTeamData(Array.isArray(j?.equipos) ? j.equipos : []))
              .catch(() => []),

            fetchJSON(`${base}&type=${encodeURIComponent(tournament.tables.repechaje.type)}`)
              .then((j) => withTeamLogos(Array.isArray(j?.rows) ? j.rows : []))
              .catch(() => []),
          ]);

          if (!cancelled) {
            setTables({ liga, petit });
            setBracketRows(llaves);
          }
          return;
        }

        if (tournament.format === "preparacion") {
          const [grupoA, grupoB, llaves] = await Promise.all([
            fetchJSON(`${base}&type=${encodeURIComponent(tournament.tables.grupoA.type)}`)
              .then((j) => enrichTeamData(Array.isArray(j?.equipos) ? j.equipos : []))
              .catch(() => []),

            fetchJSON(`${base}&type=${encodeURIComponent(tournament.tables.grupoB.type)}`)
              .then((j) => enrichTeamData(Array.isArray(j?.equipos) ? j.equipos : []))
              .catch(() => []),

            fetchJSON(`${base}&type=${encodeURIComponent(tournament.tables.playoffs.type)}`)
              .then((j) => withTeamLogos(Array.isArray(j?.rows) ? j.rows : []))
              .catch(() => []),
          ]);

          if (!cancelled) {
            setTables({ grupoA, grupoB });
            setBracketRows(llaves);
          }
          return;
        }

        // supercopa
        const [group, llaves] = await Promise.all([
          fetchJSON(`${base}&type=${encodeURIComponent(tournament.tables.group.type)}`)
            .then((j) => enrichTeamData(Array.isArray(j?.equipos) ? j.equipos : []))
            .catch(() => []),

          fetchJSON(`${base}&type=${encodeURIComponent(tournament.tables.playoffs.type)}`)
            .then((j) => withTeamLogos(Array.isArray(j?.rows) ? j.rows : []))
            .catch(() => []),
        ]);

        if (!cancelled) {
          setTables({ group });
          setBracketRows(llaves);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTournamentTables();

    return () => {
      cancelled = true;
    };
  }, [tournamentId, tournament.id, tournament.format]);

  const tablasReady = useMemo(() => {
    if (loading) return false;

    if (tournament.format === "oficial") {
      return Array.isArray(tables.liga) && Array.isArray(tables.petit) && Array.isArray(bracketRows);
    }

    if (tournament.format === "preparacion") {
      return Array.isArray(tables.grupoA) && Array.isArray(tables.grupoB) && Array.isArray(bracketRows);
    }

    return Array.isArray(tables.group) && Array.isArray(bracketRows);
  }, [loading, tables, bracketRows, tournament.format]);

  return (
    <FutbolLayout hero={HERO} nav={nav} active={active} onChange={onChange} contact={CONTACT} quickFacts={QUICK_FACTS}>
      <style jsx global>{`
        html,
        body {
          overflow-x: hidden;
        }
      `}</style>

      {flyerData ? <FlyerProximoPartidoFull data={flyerData} backgroundImageUrl={BACKGROUND_IMAGE_URL} /> : null}

      <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 bg-gray-50">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-10 py-8">
          <div className="space-y-6">
            {/* TABLAS (izq) + PALMARÉS (der) */}
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
              {/* TABLAS */}
              <div className="min-w-0">
                <div className="flex items-end justify-between gap-3 mb-3 min-w-0">
                  <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">Tablas de posiciones</h2>
                  <span className="text-xs text-gray-500">{tournament.label}</span>
                </div>

                {!tablasReady ? (
                  <div className="bg-white rounded-lg shadow-sm p-4 text-gray-800 min-w-0">
                    <p className="text-sm text-gray-600">{loading ? "Cargando torneo..." : "Cargando tablas..."}</p>
                  </div>
                ) : tournament.format === "oficial" ? (
                  <div className="grid gap-4 xl:grid-cols-2 items-start min-w-0">
                    <div className="min-w-0">
                      <TablaPosicionesInicioLike
                        title={tournament.ui.ligaTitle}
                        phase={tournament.ui.ligaPhase}
                        equipos={tables.liga}
                        footnote={getFootnote("ligaFootnote", `Posiciones ${tournament.label}.`)}
                        withPositionColors
                      />
                    </div>

                    <div className="space-y-4 min-w-0">
                      <TablaLlavesCard
                        rows={bracketRows}
                        title={tournament.ui.repechajeTitle}
                        phase="Fase Eliminatoria"
                        footnote={getFootnote("repechajeFootnote", "Formato: semifinales y final.")}
                      />

                      <TablaPosicionesInicioLike
                        title={tournament.ui.petitTitle}
                        phase={tournament.ui.petitPhase}
                        equipos={tables.petit}
                        footnote={getFootnote("petitFootnote", `Petit Torneo (${tournament.label}).`)}
                      />
                    </div>
                  </div>
                ) : tournament.format === "preparacion" ? (
                  <div className="space-y-4 min-w-0">
                    <div className="grid gap-4 xl:grid-cols-2 items-start min-w-0">
                      <TablaPosicionesInicioLike
                        title={tournament.ui.grupoATitle}
                        phase="Fase de grupos"
                        equipos={tables.grupoA}
                        footnote={getFootnote("grupoAFootnote", `Grupo A (${tournament.label}).`)}
                        withPositionColors
                        positionColorScheme="prep"
                      />
                      <TablaPosicionesInicioLike
                        title={tournament.ui.grupoBTitle}
                        phase="Fase de grupos"
                        equipos={tables.grupoB}
                        footnote={getFootnote("grupoBFootnote", `Grupo B (${tournament.label}).`)}
                        withPositionColors
                        positionColorScheme="prep"
                      />
                    </div>

                    <TablaLlavesCard
                      rows={bracketRows}
                      title={tournament.ui.playoffsTitle}
                      phase="Fase Eliminatoria"
                      footnote={getFootnote("playoffsFootnote", "Formato: semifinales y final.")}
                      useShortNames={false}
                    />
                  </div>
                ) : (
                  // SUPERCOPA
                  <div className="space-y-4 min-w-0">
                    <TablaPosicionesInicioLike
                      title="Grupo 5"
                      phase="Fase de grupos"
                      equipos={tables.group}
                      footnote={getFootnote("groupFootnote", "Primera Ronda de la Supercopa Entre Ríos 2023.")}
                      withPositionColors
                      positionColorScheme="prep"
                    />

                    <TablaRondasSeriesCard
                      rows={bracketRows}
                      title={tournament.ui.playoffsTitle}
                      phase="Playoffs"
                      footnote={getFootnote(
                        "playoffsFootnote",
                        "La Supercopa Entre Ríos 2023 finalmente fue alzada por el Club Gimnasia y Esgrima (Concepción del Uruguay)."
                      )}
                      useShortNames={false}
                    />
                  </div>
                )}
              </div>

              {/* PALMARÉS */}
              <aside className="w-full lg:w-[320px] lg:justify-self-end min-w-0">
                <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 mb-3">Palmarés</h2>
                <PalmaresCard items={TITLES} />
              </aside>
            </div>

            {/* SELECTOR DE TORNEO */}
            <div className="w-full min-w-0">
              <TournamentSelector tournaments={TOURNAMENTS} value={tournamentId} onChange={handleTournamentChange} />
            </div>

            {/* PARTIDOS (por torneo) */}
            <div className="w-full min-w-0">
              <UltimosPartidosCard items={content.results} />
            </div>

            {/* CUERPO TÉCNICO + PLANTEL (por torneo) */}
            <div className="w-full min-w-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch min-w-0">
                <PeopleCard title="Cuerpo técnico" subtitle={tournament.label} items={content.staff} layout="list" />
                <PeopleCard title="Plantel" subtitle={tournament.label} items={content.roster} layout="grid" columns={2} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </FutbolLayout>
  );
}
