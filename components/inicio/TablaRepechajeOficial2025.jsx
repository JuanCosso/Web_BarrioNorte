// components/inicio/TablaRepechajeOficial2025.jsx
import Image from "next/image";

function norm(str = "") {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// Tus nombres reales de archivos (public/escudos/*.png)
const SHIELD_MAP = {
  "aldea asuncion": "AldeaAsuncion",
  bancario: "Bancario",
  "barrio norte": "BarrioNorte_V1",
  "el progreso": "ElProgreso",
  "gualeguay central": "GualeguayCentral",
  "juventud carbo": "JuventudCarbo",
  "juventud": "JuventudCarbo",
  "la academia": "LaAcademia",
  "libertad": "Libertad_V2",
  quilmes: "Quilmes",
  "sociedad sportiva": "SociedadSportiva",
  sportiva: "SociedadSportiva",
  urquiza: "Urquiza",
};

function escudoSrc(team) {
  const key = norm(team);
  const file = SHIELD_MAP[key];
  if (file) return `/escudos/${file}.png`;

  // fallback por si aparece algún nombre inesperado
  const guess = String(team)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");
  return `/escudos/${guess}.png`;
}

// Parser CSV simple (soporta comillas)
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (c === '"' && inQuotes && next === '"') {
      field += '"';
      i++;
      continue;
    }

    if (c === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (!inQuotes && (c === "," || c === "\n" || c === "\r")) {
      if (c === "\r" && next === "\n") i++;
      row.push(field.trim());
      field = "";

      if (c === "\n" || c === "\r") {
        const hasAny = row.some((x) => String(x || "").trim() !== "");
        if (hasAny) rows.push(row);
        row = [];
      }
      continue;
    }

    field += c;
  }

  if (field.length || row.length) {
    row.push(field.trim());
    const hasAny = row.some((x) => String(x || "").trim() !== "");
    if (hasAny) rows.push(row);
  }

  return rows;
}

function buildMatches(items) {
  const byStage = new Map();
  for (const it of items) {
    const key = String(it.stage || "").trim();
    if (!byStage.has(key)) byStage.set(key, []);
    byStage.get(key).push(it);
  }

  const stages = Array.from(byStage.keys());

  const semiStages = stages
    .filter((s) => norm(s).includes("semifinal"))
    .sort((a, b) => {
      const na = parseInt(String(a).match(/\d+/)?.[0] || "0", 10);
      const nb = parseInt(String(b).match(/\d+/)?.[0] || "0", 10);
      return na - nb;
    });

    const finalStage =
    stages.find((s) => {
      const ns = norm(s);
      return (ns === "final" || ns.startsWith("final ")) && !ns.includes("semifinal");
    }) || null;
  

  const semifinals = semiStages.map((s) => ({
    stage: s,
    teams: byStage.get(s) || [],
  }));

  const finalMatch = finalStage
    ? { stage: finalStage, teams: byStage.get(finalStage) || [] }
    : null;

  return { semifinals, finalMatch };
}

function TeamRow({ team, score, pens }) {
  const pensOk =
    pens != null && String(pens).trim() && String(pens).trim() !== "-";

  return (
    <div className="flex items-center justify-between gap-3 px-2 py-1">
      {/* Izquierda: escudo + nombre (igual estilo que TablaPosiciones) */}
      <div className="min-w-0 flex items-center gap-2">
        <Image
          src={escudoSrc(team)}
          alt={`Escudo ${team}`}
          width={24}
          height={24}
          className="object-contain"
        />
        <span className="min-w-0 text-xs md:text-sm text-gray-800 whitespace-normal break-words">
          {team}
        </span>
      </div>

      {/* Derecha: penales (si aplica) + resultado */}
      <div className="shrink-0 flex items-center gap-2">
        {pensOk ? (
          <span className="text-xs font-semibold text-gray-500">
            ({String(pens).trim()})
          </span>
        ) : null}

        <span className="inline-flex items-center justify-center rounded-md bg-red-50 px-2 py-1 text-xs font-black text-red-600 min-w-[34px] text-center">
          {score}
        </span>
      </div>
    </div>
  );
}

function MatchCard({ teams }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white overflow-hidden">
      {/* Divider más “negro” para acercarse al contraste de tus tablas */}
      <div className="divide-y divide-gray-100">
        {teams.map((t, idx) => (
          <TeamRow
            key={`${t.team}-${idx}`}
            team={t.team}
            score={t.score}
            pens={t.pens}
          />
        ))}
      </div>
    </div>
  );
}

export default async function TablaRepechajeOficial2025() {
  // OJO: mantené el mismo nombre que tengas en tu .env.local
  const sheetUrl = process.env.NEXT_PUBLIC_SHEET_OFICIAL_REPECHAJE_2025_URL;

  if (!sheetUrl) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-baseline justify-between mb-2">
          <p className="text-sm font-semibold text-gray-800">Repechaje</p>
          <span className="text-xs text-gray-500">Semifinales y final</span>
        </div>
        <p className="text-sm text-gray-600">
          Falta configurar NEXT_PUBLIC_SHEET_OFICIAL_REPECHAJE_2025_URL.
        </p>
      </div>
    );
  }

  const res = await fetch(sheetUrl, { cache: "no-store" });
  const csv = await res.text();

  const raw = parseCSV(csv);

  // Espera headers: Equipo | Etapa | Resultado | Penales
  const header = (raw[0] || []).map((h) => norm(h));
  const idxEquipo = header.findIndex((h) => h === "equipo");
  const idxEtapa = header.findIndex((h) => h === "etapa");
  const idxRes = header.findIndex((h) => h === "resultado");
  const idxPen = header.findIndex((h) => h === "penales");

  const rows = raw
    .slice(1)
    .map((r) => ({
      team: r[idxEquipo] ?? "",
      stage: r[idxEtapa] ?? "",
      score: r[idxRes] ?? "",
      pens: r[idxPen] ?? "",
    }))
    .filter((x) => String(x.team).trim() && String(x.stage).trim());

  const { semifinals, finalMatch } = buildMatches(rows);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-baseline justify-between mb-3">
        <p className="text-sm font-semibold text-gray-800">Repechaje</p>
        <span className="text-xs text-gray-500">Fase Eliminatoria</span>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] items-start">
        {/* Semifinales */}
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-2">
            Semifinales
          </p>
          <div className="space-y-3">
            {semifinals.map((m, i) => (
              <MatchCard key={`${m.stage}-${i}`} teams={m.teams} />
            ))}
          </div>
        </div>

        {/* Final */}
        <div className="md:pt-6">
          <p className="text-xs font-semibold text-gray-700 mb-2">Final</p>
          {finalMatch ? <MatchCard teams={finalMatch.teams} /> : null}
        </div>
      </div>

      <p className="mt-2 text-[11px] text-gray-500">
        Sociedad Sportiva se suma como cuarto equipo al Petit Torneo.
      </p>
    </div>
  );
}
