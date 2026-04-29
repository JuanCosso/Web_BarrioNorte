"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { FutbolLayout } from "../shared/FutbolShared";

import {
  HERO,
  CONTACT,
  QUICK_FACTS,
  BACKGROUND_IMAGE_URL,
  JOIN_AD,
  TOURNAMENTS,
  TOURNAMENT_CONTENT,
  TEAM_LOGOS,
} from "./femenino.config";

import {
  FlyerSumateFemeninoFull,
  TablaPosicionesInicioLike,
  TablaLlavesCard,
  TablaPetitLikeRepechaje,
  UltimosPartidosCard,
  PeopleCard,
  TournamentSelector,
} from "./FemeninoUI";

const TOUR_PARAM = "tour";

async function fetchJSON(url) {
  const r = await fetch(url, { cache: "no-store" });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j?.error || "Fetch failed");
  return j;
}

function normalizeSpaces(s) {
  return String(s || "")
    .replace(/\u00A0/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function stripDiacritics(s) {
  return String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function teamLogoFor(teamName) {
  const name = normalizeSpaces(teamName);
  const noSpaces = name.replace(/\s+/g, "");

  const plain = stripDiacritics(name);
  const plainNoSpaces = plain.replace(/\s+/g, "");

  return (
    TEAM_LOGOS[name] ||
    TEAM_LOGOS[noSpaces] ||
    TEAM_LOGOS[plain] ||
    TEAM_LOGOS[plainNoSpaces] ||
    null
  );
}

function withTeamLogosEquipos(equipos) {
  const TEAM_SHORT = {
    "Sociedad Sportiva": "Sportiva",
    SociedadSportiva: "Sportiva",
    "Gualeguay Central": "Central",
    GualeguayCentral: "Central",
  };

  return (Array.isArray(equipos) ? equipos : []).map((e) => {
    const teamName = e?.name || e?.shortName || e?.equipo || "";
    const rawName = String(teamName || "").replace(/\u00A0/g, " ").trim();
    const name = rawName.replace(/\s+/g, " ");
    const noSpaces = name.replace(/\s+/g, "");
    const slug = noSpaces.toLowerCase();

    const mapped = teamLogoFor(teamName);
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

function withTeamLogosRows(rows) {
  return (Array.isArray(rows) ? rows : []).map((r) => {
    const mapped = teamLogoFor(r?.equipo);
    return { ...r, logo: mapped || "/escudos/BarrioNorte_V1.png" };
  });
}

/**
 * Petit femenino: si la final viene como "ida" sola, la pasamos a "resultado"
 * para que se muestre como partido único (coherente con tu UI).
 */
function normalizePetitFinalSingleLeg(rows) {
  const safe = Array.isArray(rows) ? rows : [];
  return safe.map((r) => {
    const stage = String(r?.etapa || "").trim().toLowerCase();
    const isFinal = stage === "final" || (/final/.test(stage) && !/semi/.test(stage));
    if (!isFinal) return r;

    const ida = String(r?.ida || "").trim();
    const vuelta = String(r?.vuelta || "").trim();

    const vueltaEmpty = !vuelta || vuelta === "-" || vuelta === "—";
    const hasLegScore = !!ida && ida !== "-" && ida !== "—";

    if (hasLegScore && vueltaEmpty) {
      return { ...r, resultado: ida, ida: "", vuelta: "" };
    }
    return r;
  });
}

export default function Femenino({ nav, active, onChange }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const spString = searchParams.toString();

  // Default: último torneo
  const [tournamentId, setTournamentId] = useState("oficial-2026-fem");

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

  // ✅ Cambia torneo + actualiza URL preservando otros params (tab, etc.)
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
      
      // Si es oficial-2026-fem, intenta cargar desde el API
      if (tournamentId.includes("2026")) {
        try {
          const category = "femenino";
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
  const [repechajeRows, setRepechajeRows] = useState(null);
  const [petitRows, setPetitRows] = useState(null);
  const [loading, setLoading] = useState(false);

  // ===== Footnotes por torneo (igual que Masculino) =====
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
      setRepechajeRows(null);
      setPetitRows(null);

      // placeholders (null = cargando)
      if (tournament.format === "oficial") setTables({ liga: null });

      const base = `/api/tabla-posiciones?tournament=${encodeURIComponent(tournament.id)}`;

      try {
        if (tournament.format === "oficial") {
          const [liga, repe, petit] = await Promise.all([
            fetchJSON(`${base}&type=${encodeURIComponent(tournament.tables.liga.type)}`)
              .then((j) => withTeamLogosEquipos(Array.isArray(j?.equipos) ? j.equipos : []))
              .catch(() => []),

            fetchJSON(`${base}&type=${encodeURIComponent(tournament.tables.repechaje.type)}`)
              .then((j) => withTeamLogosRows(Array.isArray(j?.rows) ? j.rows : []))
              .catch(() => []),

            fetchJSON(`${base}&type=${encodeURIComponent(tournament.tables.petit.type)}`)
              .then((j) => withTeamLogosRows(Array.isArray(j?.rows) ? j.rows : []))
              .then((rows) => normalizePetitFinalSingleLeg(rows))
              .catch(() => []),
          ]);

          if (!cancelled) {
            setTables({ liga });
            setRepechajeRows(repe);
            setPetitRows(petit);
          }
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
      return Array.isArray(tables.liga) && Array.isArray(repechajeRows) && Array.isArray(petitRows);
    }

    return false;
  }, [loading, tables, repechajeRows, petitRows, tournament.format]);

  return (
    <FutbolLayout hero={HERO} nav={nav} active={active} onChange={onChange} contact={CONTACT} quickFacts={QUICK_FACTS}>
      <style jsx global>{`
        html,
        body {
          overflow-x: hidden;
        }
      `}</style>

      <FlyerSumateFemeninoFull data={JOIN_AD} backgroundImageUrl={BACKGROUND_IMAGE_URL} />

      <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 bg-gray-50">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-10 py-8">
          <div className="space-y-6">
            <div className="min-w-0">
              <div className="flex items-end justify-between gap-3 mb-3 min-w-0">
                <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">Tablas de posiciones</h2>
                <span className="text-xs text-gray-500">{tournament.label}</span>
              </div>

              {!tablasReady ? (
                <div className="bg-white rounded-lg shadow-sm p-4 text-gray-800 min-w-0">
                  <p className="text-sm text-gray-600">{loading ? "Cargando torneo..." : "Cargando tablas..."}</p>
                </div>
              ) : (
                <div className="grid gap-4 xl:grid-cols-2 items-start min-w-0">
                  <div className="min-w-0">
                    <TablaPosicionesInicioLike
                      title={tournament.ui.ligaTitle}
                      phase={tournament.ui.ligaPhase}
                      equipos={tables.liga}
                      footnote={getFootnote("ligaFootnote", `Tabla de posiciones (${tournament.label}).`)}
                      withPositionColors
                      positionColorScheme={tournamentId === "oficial-2026-fem" ? "fem2026" : "liga"}
                    />
                  </div>

                  <div className="space-y-4 min-w-0">
                    <TablaLlavesCard
                      rows={repechajeRows}
                      title={tournamentId === "oficial-2026-fem" ? "Playoffs" : tournament.ui.repechajeTitle}
                      phase={tournament.ui.repechajePhase || "Fase Eliminatoria"}
                      footnote={getFootnote("repechajeFootnote", "Formato: semifinales y final.")}
                    />

                    {tournamentId !== "oficial-2026-fem" && (
                      <TablaPetitLikeRepechaje
                        rows={petitRows}
                        title={tournament.ui.petitTitle}
                        phase={tournament.ui.petitPhase}
                        footnote={getFootnote("petitFootnote", "Formato: semifinales ida/vuelta y final única.")}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* SELECTOR DE TORNEO */}
            <div className="w-full min-w-0">
              <TournamentSelector tournaments={TOURNAMENTS} value={tournamentId} onChange={handleTournamentChange} />
            </div>

            {/* RESULTADOS (por torneo) */}
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
