// components/disciplinas/futbol/masculino/masculino.config.js
import { IconShield } from "../shared/FutbolShared";

/* ========= HERO / CONTACTO / QUICK FACTS (no cambian por torneo) ========= */

export const HERO = {
  title: "Fútbol",
  subtitle: "Primera Masculina",
  tagline: "Infomación de Barrio Norte actualizada.",
  hideTagline: false,
  imageSrc: "/disciplinas/futbol/masculino/banner.jpg",
  pills: ["Fixture", "Resultados", "Tabla"],
  hidePills: true,
};

export const CONTACT = {
  whatsappHref:
    "https://wa.me/5490000000000?text=Hola%20quiero%20info%20de%20F%C3%BAtbol%20Masculino%20en%20Barrio%20Norte",
  whatsappLabel: "Asociate hoy",
  instagramHref: "https://www.instagram.com/barrionortegualeguay/?hl=es",
  instagramLabel: "Instagram",
  facebookHref: "https://www.facebook.com/profile.php?id=100063591160216",
  facebookLabel: "Facebook",
};

export const QUICK_FACTS = [
  {
    label: "Socio Online",
    value: "Completá los datos",
    hint: "Seguí al norte en todos lados",
    icon: IconShield,
  },
  {
    label: "Cobertura",
    value: "Todas las competencias",
    hint: "Torneos locales y provinciales",
    icon: IconShield,
  },
];

/* ========= FLYER ========= */

export const BACKGROUND_IMAGE_URL = "/inicio/Proximo-Partido-Fondo.png";

/* ========= PALMARÉS (no cambia por torneo) ========= */

export const TITLES = [
  { title: "Torneo Oficial LDFG", year: "1990" },
  { title: "Torneo Oficial LDFG", year: "1995" },
  { title: "Torneo Apertura LDFG", year: "1999" },
  { title: "Torneo Oficial LDFG", year: "2001" },
  { title: "Regionalito (Copa Entre Ríos)", year: "2001" },
  { title: "Torneo Preparación LDFG", year: "2003" },
  { title: "Torneo Oficial LDFG", year: "2004" },
  { title: "Torneo Oficial LDFG", year: "2021" },
  { title: "Torneo Oficial LDFG", year: "2022" },
  { title: "Torneo Preparación LDFG", year: "2024" },
  { title: "Torneo Oficial LDFG", year: "2024" },
];

/* ========= TORNEOS (solo config de UI + types para la API) =========
   format:
   - "oficial": liga + repechaje + petit
   - "preparacion": grupoA + grupoB + playoffs
   - "supercopa": group + playoffs

   Footnotes opcionales:
   - Usá "{label}" para insertar tournament.label
   - Si un footnote es "" (vacío), se oculta.
*/

export const TOURNAMENTS = [
  {
    id: "supercopa-entre-rios-2023",
    label: "Supercopa Entre Ríos 2023",
    format: "supercopa",
    tables: {
      group: { type: "supercopa_grupo" },
      playoffs: { type: "supercopa_playoffs" },
    },
    ui: {
      groupTitle: "Fase de grupos",
      playoffsTitle: "Eliminatorias",
      note: "Supercopa Entre Ríos 2023.",

      // ✅ Footnotes personalizables
      groupFootnote: "Primera Ronda de la Supercopa Entre Ríos 2023.",
      playoffsFootnote:
        "La Supercopa Entre Ríos 2023 finalmente fue alzada por el Club Gimnasia y Esgrima (Concepción del Uruguay).",
    },
  },
  {
    id: "oficial-2023",
    label: "Oficial 2023",
    format: "oficial",
    tables: {
      liga: { type: "primera" },
      repechaje: { type: "repechaje" },
      petit: { type: "petit" },
    },
    ui: {
      ligaTitle: "Liga Departamental",
      ligaPhase: "Fase regular",
      repechajeTitle: "Repechaje",
      petitTitle: "Petit Torneo",
      petitPhase: "Fase final",
      note: "Torneo {label}.",
      ligaFootnote: "Posiciones {label}.",
      repechajeFootnote: "Gualeguay Central clasifica al Petit Torneo.",
      petitFootnote: "Libertad se consagra como campeón del Torneo {label}.",
    },
  },
  {
    id: "preparacion-2024",
    label: "Preparación 2024",
    format: "preparacion",
    tables: {
      grupoA: { type: "prep_2024_grupo_a" },
      grupoB: { type: "prep_2024_grupo_b" },
      playoffs: { type: "prep_2024_playoffs" },
    },
    ui: {
      grupoATitle: "Grupo A",
      grupoBTitle: "Grupo B",
      playoffsTitle: "Playoffs",
      note: "Torneo {label}",
      grupoAFootnote: "Posiciones Torneo {label}.",
      grupoBFootnote: "Posiciones Torneo {label}.",
      playoffsFootnote: "Barrio Norte se consagra como campeón del Torneo {label}.",
    },
  },
  {
    id: "oficial-2024",
    label: "Oficial 2024",
    format: "oficial",
    tables: {
      liga: { type: "oficial_2024_liga" },
      repechaje: { type: "oficial_2024_repechaje" },
      petit: { type: "oficial_2024_petit" },
    },
    ui: {
      ligaTitle: "Liga Departamental",
      ligaPhase: "Fase regular",
      repechajeTitle: "Repechaje",
      petitTitle: "Petit Torneo",
      petitPhase: "Fase final",
      note: "Torneo {label}.",
      ligaFootnote: "Posiciones {label}.",
      repechajeFootnote: "Barrio Norte clasifica al Petit Torneo.",
      petitFootnote: "Barrio Norte se consagra como campeón del Torneo {label}.",
    },
  },
  {
    id: "preparacion-2025",
    label: "Preparación 2025",
    format: "preparacion",
    tables: {
      grupoA: { type: "prep_2025_grupo_a" },
      grupoB: { type: "prep_2025_grupo_b" },
      playoffs: { type: "prep_2025_playoffs" },
    },
    ui: {
      grupoATitle: "Grupo A",
      grupoBTitle: "Grupo B",
      playoffsTitle: "Playoffs",
      note: "Torneo {label}",
      grupoAFootnote: "Posiciones Torneo {label}.",
      grupoBFootnote: "Posiciones Torneo {label}.",
      playoffsFootnote: "Sociedad Sportiva se consagra como campeón del Torneo {label}.",
    },
  },
  {
    id: "oficial-2025",
    label: "Oficial 2025",
    format: "oficial",
    tables: {
      liga: { type: "primera" },
      repechaje: { type: "repechaje" },
      petit: { type: "petit" },
    },
    ui: {
      ligaTitle: "Liga Departamental",
      ligaPhase: "Fase regular",
      repechajeTitle: "Repechaje",
      petitTitle: "Petit Torneo",
      petitPhase: "Fase final",
      note: "Torneo {label}.",
      ligaFootnote: "Posiciones {label}.",
      repechajeFootnote: "Sociedad Sportiva clasifica al Petit Torneo.",
      petitFootnote: "La Academia se consagra como campeón del Torneo {label} tras vencer por un global de 6-2 a Sociedad Sportiva en una serie a desempate.",
    },
  },
  {
    id: "preparacion-2026",
    label: "Preparación 2026",
    format: "preparacion",
    tables: {
      grupoA: { type: "prep_2026_grupo_a" },
      grupoB: { type: "prep_2026_grupo_b" },
      playoffs: { type: "prep_2026_playoffs" },
    },
    ui: {
      grupoATitle: "Grupo A",
      grupoBTitle: "Grupo B",
      playoffsTitle: "Playoffs",
      note: "Torneo {label}",
      grupoAFootnote: "Posiciones Torneo {label}.",
      grupoBFootnote: "Posiciones Torneo {label}.",
      playoffsFootnote: "Torneo {label} disputándose.",
    },
  },
];

/* ========= LOGOS (para llaves / eliminatorias) ========= */

export const TEAM_LOGOS = {
  "Aldea Asuncion": "/escudos/AldeaAsuncion.png",
  AldeaAsuncion: "/escudos/AldeaAsuncion.png",
  Bancario: "/escudos/Bancario.png",
  "Barrio Norte": "/escudos/BarrioNorte_V1.png",
  "El Progreso": "/escudos/ElProgreso.png",
  ElProgreso: "/escudos/ElProgreso.png",
  "Gualeguay Central": "/escudos/GualeguayCentral.png",
  GualeguayCentral: "/escudos/GualeguayCentral.png",
  Juventud: "/escudos/JuventudCarbo.png",
  "Juventud Carbó": "/escudos/JuventudCarbo.png",
  JuventudCarbo: "/escudos/JuventudCarbo.png",
  "La Academia": "/escudos/LaAcademia.png",
  LaAcademia: "/escudos/LaAcademia.png",
  Libertad: "/escudos/Libertad_V2.png",
  Quilmes: "/escudos/Quilmes.png",
  "Sociedad Sportiva": "/escudos/SociedadSportiva.png",
  SociedadSportiva: "/escudos/SociedadSportiva.png",
  Urquiza: "/escudos/Urquiza.png",
  "Juventud Unida": "/escudos/JuventudUnida.png",
  JuventudUnida: "/escudos/JuventudUnida.png",
  "Deportivo Urdinarrain": "/escudos/DeportivoUrdinarrain.png",
  DeportivoUrdinarrain: "/escudos/DeportivoUrdinarrain.png",
  "Ferrocarril (Chajarí)": "/escudos/Ferrocarril-Chajari.png",
  "Libertad (Concordia)": "/escudos/Libertad-Concordia.png",
};

/* ========= CONTENIDO POR TORNEO (esto es lo que vas a editar) ========= */

export const TOURNAMENT_CONTENT = {
  "oficial-2025": {
    results: [
      { round: "Fecha 1", date: "06/04", condition: "Local", rival: "Bancario", score: "2 - 1", competition: "Torneo Oficial" },
      { round: "Fecha 2", date: "13/04", condition: "Local", rival: "La Academia", score: "0 - 2", competition: "Torneo Oficial" },
      { round: "Fecha 3", date: "20/04", condition: "Visitante", rival: "Urquiza", score: "3 - 1", competition: "Torneo Oficial" },
      { round: "Fecha 4", date: "27/04", condition: "Local", rival: "Central", score: "1 - 0", competition: "Torneo Oficial" },
      { round: "Fecha 5", date: "04/05", condition: "Visitante", rival: "Sportiva", score: "3 - 0", competition: "Torneo Oficial" },
      { round: "Fecha 6", date: "11/05", condition: "Local", rival: "Libertad", score: "2 - 2", competition: "Torneo Oficial" },
      { round: "Fecha 7", date: "25/05", condition: "Visitante", rival: "Quilmes", score: "1 - 3", competition: "Torneo Oficial" },
      { round: "Fecha 8", date: "01/06", condition: "Local", rival: "Juventud", score: "0 - 0", competition: "Torneo Oficial" },
      { round: "Fecha 9", date: "08/06", condition: "Visitante", rival: "El Progreso", score: "1 - 1", competition: "Torneo Oficial" },
      { round: "Fecha 10", date: "06/06", condition: "Visitante", rival: "Bancario", score: "0 - 1", competition: "Torneo Oficial" },
      { round: "Fecha 11", date: "22/06", condition: "Visitante", rival: "La Academia", score: "0 - 0", competition: "Torneo Oficial" },
      { round: "Fecha 12", date: "29/06", condition: "Local", rival: "Urquiza", score: "2 - 0", competition: "Torneo Oficial" },
      { round: "Fecha 13", date: "05/07", condition: "Visitante", rival: "Central", score: "0 - 1", competition: "Torneo Oficial" },
      { round: "Fecha 14", date: "13/07", condition: "Local", rival: "Sportiva", score: "2 - 1", competition: "Torneo Oficial" },
      { round: "Fecha 15", date: "20/07", condition: "Visitante", rival: "Libertad", score: "1 - 0", competition: "Torneo Oficial" },
      { round: "Fecha 16", date: "03/08", condition: "Local", rival: "Quilmes", score: "2 - 2", competition: "Torneo Oficial" },
      { round: "Fecha 17", date: "10/08", condition: "Visitante", rival: "Juventud", score: "3 - 2", competition: "Torneo Oficial" },
      { round: "Fecha 18", date: "17/08", condition: "Local", rival: "El Progreso", score: "5 - 1", competition: "Torneo Oficial" },
      { round: "Fecha 1", date: "07/09", condition: "Visitante", rival: "Sportiva", score: "2 - 1", competition: "Petit Torneo" },
      { round: "Fecha 2", date: "14/09", condition: "Local", rival: "La Academia", score: "3 - 3", competition: "Petit Torneo" },
      { round: "Fecha 3", date: "21/09", condition: "Visitante", rival: "Juventud", score: "2 - 3", competition: "Petit Torneo" },
      { round: "Fecha 4", date: "28/09", condition: "Local", rival: "Sportiva", score: "0 - 1", competition: "Petit Torneo" },
      { round: "Fecha 5", date: "12/10", condition: "Visitante", rival: "La Academia", score: "1 - 0", competition: "Petit Torneo" },
      { round: "Fecha 6", date: "19/10", condition: "Local", rival: "Juventud", score: "Susp.", competition: "Petit Torneo" },
    ],
    staff: [
      { name: "Roberto García", role: "Director Técnico" },
      { name: "Silvio Ponce", role: "Ayudante de campo" },
      { name: "Victorio Silguero", role: "Ayudante de campo" },
    ],
    roster: [
      { name: "Jugador 1", role: "Arquero" },
      { name: "Jugador 2", role: "Defensor" },
      { name: "Jugador 3", role: "Mediocampista" },
      { name: "Jugador 4", role: "Delantero" },
    ],
  },

  // Completá estos cuando tengas la info:
  "oficial-2024": { 
    results: [
      { round: "Fecha 1", date: "12/05", condition: "Visitante", rival: "Urquiza", score: "0 - 1", competition: "Torneo Oficial" },
      { round: "Fecha 2", date: "19/05", condition: "Local", rival: "Libertad", score: "3 - 1", competition: "Torneo Oficial" },
      { round: "Fecha 3", date: "26/05", condition: "Local", rival: "Sportiva", score: "0 - 0", competition: "Torneo Oficial" },
      { round: "Fecha 4", date: "02/06", condition: "Visitante", rival: "Bancario", score: "1 - 3", competition: "Torneo Oficial" },
      { round: "Fecha 5", date: "09/06", condition: "Visitante", rival: "Quilmes", score: "0 - 1", competition: "Torneo Oficial" },
      { round: "Fecha 6", date: "16/06", condition: "Local", rival: "El Progreso", score: "3 - 3", competition: "Torneo Oficial" },
      { round: "Fecha 7", date: "23/06", condition: "Visitante", rival: "La Academia", score: "1 - 0", competition: "Torneo Oficial" },
      { round: "Fecha 8", date: "30/06", condition: "Visitante", rival: "Juventud", score: "2 - 3", competition: "Torneo Oficial" },
      { round: "Fecha 9", date: "07/07", condition: "Local", rival: "Central", score: "0 - 2", competition: "Torneo Oficial" },
      { round: "Fecha 10", date: "14/07", condition: "Local", rival: "Urquiza", score: "2 - 2", competition: "Torneo Oficial" },
      { round: "Fecha 11", date: "21/07", condition: "Visitante", rival: "Libertad", score: "1 - 1", competition: "Torneo Oficial" },
      { round: "Fecha 12", date: "28/08", condition: "Visitante", rival: "Sportiva", score: "1 - 0", competition: "Torneo Oficial" },
      { round: "Fecha 13", date: "04/08", condition: "Local", rival: "Bancario", score: "4 - 1", competition: "Torneo Oficial" },
      { round: "Fecha 14", date: "11/08", condition: "Local", rival: "Quilmes", score: "3 - 0", competition: "Torneo Oficial" },
      { round: "Fecha 15", date: "18/08", condition: "Visitante", rival: "El Progreso", score: "1 - 2", competition: "Torneo Oficial" },
      { round: "Fecha 16", date: "25/08", condition: "Local", rival: "La Academia", score: "1 - 0", competition: "Torneo Oficial" },
      { round: "Fecha 17", date: "08/09", condition: "Local", rival: "Juventud", score: "5 - 1", competition: "Torneo Oficial" },
      { round: "Fecha 18", date: "15/09", condition: "Visitante", rival: "Central", score: "2 - 2", competition: "Torneo Oficial" },
      { round: "Semifinal", date: "18/09", condition: "Local", rival: "El Progreso", score: "1 - 0", competition: "Repechaje" },
      { round: "Final", date: "22/09", condition: "Local", rival: "Quilmes", score: "2 - 0", competition: "Repechaje" },
      { round: "Fecha 1", date: "06/10", condition: "Visitante", rival: "Libertad", score: "1 - 0", competition: "Petit Torneo" },
      { round: "Fecha 2", date: "20/10", condition: "Local", rival: "Urquiza", score: "3 - 2", competition: "Petit Torneo" },
      { round: "Fecha 3", date: "27/10", condition: "Visitante", rival: "Sportiva", score: "1 - 1", competition: "Petit Torneo" },
      { round: "Fecha 4", date: "03/11", condition: "Local", rival: "Libertad", score: "1 - 1", competition: "Petit Torneo" },
      { round: "Fecha 5", date: "10/11", condition: "Visitante", rival: "Urquiza", score: "0 - 2", competition: "Petit Torneo" },
      { round: "Fecha 6", date: "18/10", condition: "Local", rival: "Sportiva", score: "4 - 1", competition: "Petit Torneo" },
    ],
    staff: [
      { name: "Roberto García", role: "Director Técnico" },
      { name: "Silvio Ponce", role: "Ayudante de campo" },
      { name: "Victorio Silguero", role: "Ayudante de campo" },
    ],
    roster: [
      { name: "Jugador 1", role: "Arquero" },
      { name: "Jugador 2", role: "Defensor" },
      { name: "Jugador 3", role: "Mediocampista" },
      { name: "Jugador 4", role: "Delantero" },
    ],
  },
  "preparacion-2024": {
    results: [
      { round: "Fecha 1", date: "17/01", condition: "Local", rival: "Urquiza", score: "0 - 1", competition: "Torneo Preparación" },
      { round: "Fecha 2", date: "22/01", condition: "Visitante", rival: "Juventud", score: "0 - 1", competition: "Torneo Preparación" },
      { round: "Fecha 3", date: "30/01", condition: "Local", rival: "Quilmes", score: "1 - 0", competition: "Torneo Preparación" },
      { round: "Fecha 4", date: "05/02", condition: "Visitante", rival: "El Progreso", score: "4 - 1", competition: "Torneo Preparación" },
      { round: "Semifinal", date: "14/02", condition: "Local", rival: "Sportiva", score: "1 - 1", competition: "Fase Final" },
      { round: "Final", date: "16/02", condition: "Visitante", rival: "Central", score: "0 - 0", competition: "Fase Final" },
    ],
    staff: [
      { name: "Roberto García", role: "Director Técnico" },
      { name: "Silvio Ponce", role: "Ayudante de campo" },
      { name: "Victorio Silguero", role: "Ayudante de campo" },
    ],
    roster: [
      { name: "Jugador 1", role: "Arquero" },
      { name: "Jugador 2", role: "Defensor" },
      { name: "Jugador 3", role: "Mediocampista" },
      { name: "Jugador 4", role: "Delantero" },
    ],
  },

  "oficial-2023": {
    results: [
      { round: "Fecha 1", date: "16/04", condition: "Visitante", rival: "Libertad", score: "3 - 1", competition: "Torneo Oficial" },
      { round: "Fecha 2", date: "23/04", condition: "Local", rival: "Urquiza", score: "3 - 0", competition: "Torneo Oficial" },
      { round: "Fecha 3", date: "30/04", condition: "Local", rival: "La Academia", score: "2 - 2", competition: "Torneo Oficial" },
      { round: "Fecha 4", date: "14/05", condition: "Visitante", rival: "El Progreso", score: "0 - 2", competition: "Torneo Oficial" },
      { round: "Fecha 5", date: "01/06", condition: "Local", rival: "Central", score: "2 - 0", competition: "Torneo Oficial" },
      { round: "Fecha 6", date: "01/06", condition: "Visitante", rival: "Juventud", score: "1 - 1", competition: "Torneo Oficial" },
      { round: "Fecha 7", date: "01/06", condition: "Local", rival: "Quilmes", score: "0 - 0", competition: "Torneo Oficial" },
      { round: "Fecha 8", date: "01/06", condition: "Visitante", rival: "Sportiva", score: "1 - 0", competition: "Torneo Oficial" },
      { round: "Fecha 9", date: "02/07", condition: "Visitante", rival: "Bancario", score: "0 - 1", competition: "Torneo Oficial" },
      { round: "Fecha 10", date: "09/07", condition: "Local", rival: "Libertad", score: "0 - 1", competition: "Torneo Oficial" },
      { round: "Fecha 11", date: "23/07", condition: "Visitante", rival: "Urquiza", score: "1 - 0", competition: "Torneo Oficial" },
      { round: "Fecha 12", date: "30/07", condition: "Visitante", rival: "La Academia", score: "1 - 5", competition: "Torneo Oficial" },
      { round: "Fecha 13", date: "06/08", condition: "Local", rival: "El Progreso", score: "1 - 1", competition: "Torneo Oficial" },
      { round: "Fecha 14", date: "20/08", condition: "Visitante", rival: "Central", score: "2 - 0", competition: "Torneo Oficial" },
      { round: "Fecha 15", date: "27/08", condition: "Local", rival: "Juventud", score: "2 - 4", competition: "Torneo Oficial" },
      { round: "Fecha 16", date: "10/09", condition: "Visitante", rival: "Quilmes", score: "0 - 1", competition: "Torneo Oficial" },
      { round: "Fecha 17", date: "17/09", condition: "Local", rival: "Sportiva", score: "0 - 2", competition: "Torneo Oficial" },
      { round: "Fecha 18", date: "23/09", condition: "Local", rival: "Bancario", score: "1 - 0", competition: "Torneo Oficial" },
      { round: "Semifinal", date: "27/09", condition: "Visitante", rival: "Urquiza", score: "1 - 1", competition: "Repechaje" },
      { round: "Final", date: "01/10", condition: "Visitante", rival: "Central", score: "0 - 0", competition: "Repechaje" },
    ],
    staff: [
      { name: "Cristian Ariel Mallarino", role: "Director Técnico" },
      { name: "Desconocido", role: "Ayudante de campo" },
    ],
    roster: [
      { name: "Jugador 1", role: "Arquero" },
      { name: "Jugador 2", role: "Defensor" },
      { name: "Jugador 3", role: "Mediocampista" },
      { name: "Jugador 4", role: "Delantero" },
    ],
  },

  "supercopa-entre-rios-2023": {
    results: [
      { round: "Fecha 1", date: "04/12", condition: "Local", rival: "Juventud Unida", score: "2 - 1", competition: "Supercopa Entre Ríos" },
      { round: "Fecha 2", date: "11/12", condition: "Local", rival: "Central", score: "3 - 2", competition: "Supercopa Entre Ríos" },
      { round: "Fecha 3", date: "17/12", condition: "Visitante", rival: "Deportivo Urdinarrain", score: "1 - 0", competition: "Supercopa Entre Ríos" },
      { round: "Fecha 4", date: "08/01", condition: "Visitante", rival: "Juventud Unida", score: "2 - 0", competition: "Supercopa Entre Ríos" },
      { round: "Fecha 5", date: "15/01", condition: "Visitante", rival: "Central", score: "0 - 2", competition: "Supercopa Entre Ríos" },
      { round: "Fecha 6", date: "22/01", condition: "Local", rival: "Deportivo Urdinarrain", score: "1 - 0", competition: "Supercopa Entre Ríos" },
      { round: "Ronda 2", date: "05/02", condition: "Visitante", rival: "Ferrocarril (Chajarí)", score: "1 - 1", competition: "Supercopa Entre Ríos" },
      { round: "Ronda 2", date: "12/02", condition: "Local", rival: "Ferrocarril (Chajarí)", score: "1 - 0", competition: "Supercopa Entre Ríos" },
      { round: "Ronda 3", date: "19/02", condition: "Visitante", rival: "Libertad (Concordia)", score: "2 - 1", competition: "Supercopa Entre Ríos" },
      { round: "Ronda 3", date: "26/02", condition: "Local", rival: "Libertad (Concordia)", score: "1 - 2", competition: "Supercopa Entre Ríos" },
    ],
    staff: [
      { name: "Martín Caminos", role: "Director Técnico" },
      { name: "Leandro Villabona", role: "Director Técnico" },
    ],
    roster: [
      { name: "Jugador 1", role: "Arquero" },
      { name: "Jugador 2", role: "Defensor" },
      { name: "Jugador 3", role: "Mediocampista" },
      { name: "Jugador 4", role: "Delantero" },
    ],
  },

  "preparacion-2025": { 
    results: [
      { round: "Fecha 1", date: "08/01", condition: "Visitante", rival: "Central", score: "1 - 2", competition: "Torneo Preparación" },
      { round: "Fecha 2", date: "10/01", condition: "Local", rival: "La Academia", score: "0 - 0", competition: "Torneo Preparación" },
      { round: "Fecha 4", date: "21/01", condition: "Visitante", rival: "Libertad", score: "4 - 3", competition: "Torneo Preparación" },
      { round: "Fecha 5", date: "05/02", condition: "Local", rival: "Juventud", score: "Susp.", competition: "Torneo Preparación" },
    ],
    staff: [
      { name: "Roberto García", role: "Director Técnico" },
      { name: "Silvio Ponce", role: "Ayudante de campo" },
      { name: "Victorio Silguero", role: "Ayudante de campo" },
    ],
    roster: [
      { name: "Jugador 1", role: "Arquero" },
      { name: "Jugador 2", role: "Defensor" },
      { name: "Jugador 3", role: "Mediocampista" },
      { name: "Jugador 4", role: "Delantero" },
    ], 
  },
  "preparacion-2026": { results: [], staff: [], roster: [] },
};
