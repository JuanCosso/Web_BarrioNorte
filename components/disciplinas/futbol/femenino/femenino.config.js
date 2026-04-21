// components/disciplinas/futbol/femenino/femenino.config.js
import { IconShield } from "../shared/FutbolShared";

/* ========= HERO / CONTACTO / QUICK FACTS ========= */

export const HERO = {
  title: "Fútbol",
  subtitle: "Primera Femenina",
  tagline: "Información de la rama femenina del norte.",
  hideTagline: false,
  imageSrc: "/disciplinas/futbol/femenino/banner.webp",
  pills: ["Fixture", "Resultados", "Tabla"],
  hidePills: true,
};

export const CONTACT = {
  whatsappHref:
    "https://wa.me/5490000000000?text=Hola%20quiero%20sumarme%20al%20F%C3%BAtbol%20Femenino%20de%20Barrio%20Norte",
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
    label: "Sumate al plantel",
    value: "Convocatoria abierta",
    hint: "Primera e inferiores.",
    icon: IconShield,
  },
];

/* ========= BANNER “SUMATE” ========= */

export const BACKGROUND_IMAGE_URL = "/inicio/Proximo-Partido-Fondo.png";

export const JOIN_AD = {
  kicker: "FÚTBOL FEMENINO",
  title: "Sumate a Barrio Norte",
  subtitle: "Categorías inferiores y primera.",
  bullets: ["Ambiente de equipo", "Competencia local", "Formación y crecimiento"],
  scheduleLabel: "Entrenamientos",
  scheduleValue: "Consultá los horarios",
  locationLabel: "Lugar",
  locationValue: "Club Atlético Barrio Norte",
  ctaLabel: "Quiero sumarme",
  ctaHref:
    "https://wa.me/5490000000000?text=Hola%20quiero%20sumarme%20al%20F%C3%BAtbol%20Femenino%20de%20Barrio%20Norte",
  centerImageSrc: "/escudos/BarrioNorte_V1.png",
};

/* ========= TORNEOS ========= */

export const TOURNAMENTS = [
  {
    id: "oficial-2025-fem",
    label: "Oficial 2025",
    format: "oficial",
    tables: {
      liga: { type: "fem_oficial_2025_liga" },
      repechaje: { type: "fem_oficial_2025_repechaje" },
      petit: { type: "fem_oficial_2025_petit_playoffs" },
    },
    ui: {
      ligaTitle: "Liga Departamental",
      ligaPhase: "Fase regular",
      repechajeTitle: "Repechaje",
      repechajePhase: "Fase Eliminatoria",
      petitTitle: "Petit torneo",
      petitPhase: "Fase Final",
      ligaFootnote: "Posiciones {label}.",
      repechajeFootnote: "Barrio Norte clasifica al Petit Torneo",
      petitFootnote: "Gualeguay Central se consagra como campeón del Torneo {label} femenino.",
    },
  },
  {
    id: "oficial-2026-fem",
    label: "Oficial 2026",
    format: "oficial",
    tables: {
      liga: { type: "fem_oficial_2026_liga" },
      repechaje: { type: "fem_oficial_2026_repechaje" },
      petit: { type: "fem_oficial_2026_petit_playoffs" },
    },
    ui: {
      ligaTitle: "Liga Departamental",
      ligaPhase: "Fase regular",
      repechajeTitle: "Repechaje",
      repechajePhase: "Fase Eliminatoria",
      petitTitle: "Petit torneo",
      petitPhase: "Fase Final",
      ligaFootnote: "Posiciones {label}.",
      repechajeFootnote: "Torneo {label} femenino por disputarse.",
      petitFootnote: "Torneo {label} femenino por disputarse.",
    },
  },
];

/* ========= LOGOS ========= */

export const TEAM_LOGOS = {
  "Aldea Asuncion": "/escudos/AldeaAsuncion.png",
  "Aldea Asunción": "/escudos/AldeaAsuncion.png",
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

/* ========= CONTENIDO POR TORNEO ========= */

export const TOURNAMENT_CONTENT = {
  "oficial-2025-fem": {
    results: [
      { round: "Fecha 1", date: "06/04", condition: "Local", rival: "Bancario", score: "2 - 0", competition: "Torneo Oficial" },
      { round: "Fecha 2", date: "13/04", condition: "Local", rival: "Aldea", score: "0 - 0", competition: "Torneo Oficial" },
      { round: "Fecha 3", date: "20/04", condition: "Visitante", rival: "Urquiza", score: "1 - 0", competition: "Torneo Oficial" },
      { round: "Fecha 4", date: "27/04", condition: "Local", rival: "Central", score: "1 - 2", competition: "Torneo Oficial" },
      { round: "Fecha 5", date: "04/05", condition: "Visitante", rival: "Sportiva", score: "1 - 1", competition: "Torneo Oficial" },
      { round: "Fecha 6", date: "11/05", condition: "Local", rival: "Libertad", score: "3 - 1", competition: "Torneo Oficial" },
      { round: "Fecha 7", date: "25/05", condition: "Visitante", rival: "Quilmes", score: "0 - 4", competition: "Torneo Oficial" },
      { round: "Fecha 8", date: "01/06", condition: "Local", rival: "Juventud", score: "3 - 1", competition: "Torneo Oficial" },
      { round: "Fecha 9", date: "08/06", condition: "Visitante", rival: "El Progreso", score: "1 - 0", competition: "Torneo Oficial" },
      { round: "Fecha 10", date: "06/06", condition: "Visitante", rival: "Bancario", score: "2 - 2", competition: "Torneo Oficial" },
      { round: "Fecha 11", date: "22/06", condition: "Visitante", rival: "Aldea", score: "0 - 0", competition: "Torneo Oficial" },
      { round: "Fecha 12", date: "29/06", condition: "Local", rival: "Urquiza", score: "2 - 4", competition: "Torneo Oficial" },
      { round: "Fecha 13", date: "05/07", condition: "Visitante", rival: "Central", score: "3 - 1", competition: "Torneo Oficial" },
      { round: "Fecha 14", date: "13/07", condition: "Local", rival: "Sportiva", score: "2 - 1", competition: "Torneo Oficial" },
      { round: "Fecha 15", date: "20/07", condition: "Visitante", rival: "Libertad", score: "1 - 0", competition: "Torneo Oficial" },
      { round: "Fecha 16", date: "03/08", condition: "Local", rival: "Quilmes", score: "1 - 1", competition: "Torneo Oficial" },
      { round: "Fecha 17", date: "10/08", condition: "Visitante", rival: "Juventud", score: "1 - 0", competition: "Torneo Oficial" },
      { round: "Fecha 18", date: "17/08", condition: "Local", rival: "El Progreso", score: "0 - 2", competition: "Torneo Oficial" },
      { round: "Semifinal", date: "24/08", condition: "Visitante", rival: "Libertad", score: "0 - 1", competition: "Repechaje" },
      { round: "Final", date: "07/09", condition: "Visitante", rival: "El Progreso", score: "1 - 2", competition: "Repechaje" },
      { round: "Semifinal", date: "14/09", condition: "Local", rival: "Central", score: "1 - 0", competition: "Petit Torneo" },
      { round: "Semifinal", date: "21/09", condition: "Visitante", rival: "Central", score: "2 - 0", competition: "Petit Torneo" },
    ],
    staff: [
      { name: "Roberto García", role: "Director Técnico" },
      { name: "Silvio Ponce", role: "Ayudante de campo" },
    ],
    roster: [
      { name: "Jugadora 1", role: "Arquero" },
      { name: "Jugadora 2", role: "Defensor" },
      { name: "Jugadora 3", role: "Mediocampista" },
      { name: "Jugadora 4", role: "Delantero" },
    ],
  },
  "oficial-2026-fem": {
    // ⚠️ ELIMINADO EL CÓDIGO CON "fs" Y "path" QUE ROMPÍA TODO
    // Si llegás a necesitar cargar el JSON en el futuro, importalo 
    // arriba de todo junto con los otros imports.
    results: [],
    staff: [],
    roster: [],
  },
};