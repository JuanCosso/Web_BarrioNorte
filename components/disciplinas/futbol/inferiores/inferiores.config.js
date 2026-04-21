// components/disciplinas/futbol/inferiores/inferiores.config.js
import { IconShield } from "../shared/FutbolShared";

/* ========= HERO / CONTACTO / QUICK FACTS ========= */

export const HERO = {
  title: "Fútbol",
  subtitle: "Inferiores",
  tagline: "Información de las categorías inferiores.",
  hideTagline: false,
  imageSrc: "/disciplinas/futbol/inferiores/banner.png",
  pills: ["Tablas", "Contacto"],
  hidePills: true,
};

export const CONTACT = {
  whatsappHref:
    "https://wa.me/5490000000000?text=Hola%20quiero%20sumar%20a%20mi%20hijo%20a%20Inferiores%20de%20Barrio%20Norte",
  whatsappLabel: "Asociate hoy ",
  instagramHref: "https://www.instagram.com/barrionortegualeguay/?hl=es",
  instagramLabel: "Instagram",
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
    hint: "Desde séptima hasta tercera",
    icon: IconShield,
  },
];

/* ========= FLYER (Mismo look que Femenino) ========= */

export const BACKGROUND_IMAGE_URL = "/inicio/Proximo-Partido-Fondo.png";

export const JOIN_AD = {
    kicker: "FÚTBOL INFERIORES",
    title: "SUMATE A BARRIO NORTE",
    subtitle: "Un espacio donde se fomentan valores y competividad deportiva.",
    locationValue: "Club Atlético Barrio Norte",
    scheduleLabel: "Entrenamientos",
    scheduleValue: "Consultá los horarios",
    ctaLabel: "Quiero sumarme",
    ctaHref:
      "https://wa.me/5490000000000?text=Hola%20quiero%20sumar%20a%20mi%20hijo%20a%20Inferiores%20de%20Barrio%20Norte",
    centerImageSrc: "/escudos/BarrioNorte_V1.png",
    // note: "Te respondemos por WhatsApp.",
  };
  

/* ========= CATEGORÍAS ========= */

export const CATEGORIES = [
  { id: "tercera", label: "Tercera" },
  { id: "cuarta", label: "Cuarta" },
  { id: "quinta", label: "Quinta" },
  { id: "sexta", label: "Sexta" },
  { id: "septima", label: "Séptima" },
];

/* ========= TORNEOS =========
   - Solo Oficial 2025 y Oficial 2026.
   - Cada torneo: Liga + Finales (Semis/Final ida-vuelta).
   - En 2025 dejamos types reales (los tuyos).
   - En 2026 lo dejamos listo (types vacíos) hasta que pases env vars 2026.
*/

/* ========= TORNEOS =========
   - Solo Oficial 2025 y Oficial 2026.
   - Cada torneo: Liga + Finales (Semis/Final ida-vuelta).
   - ui: textos editables por torneo (campeón, notas, etc.)
*/

function torneoOficial({ categoryId, year, ligaType, finalesType, ui = {} }) {
  return {
    id: `${categoryId}-oficial-${year}`,
    label: `Oficial ${year}`,
    tables: {
      liga: { type: ligaType || "" },
      finales: { type: finalesType || "" },
    },
    ui: {
      // Card Liga (izquierda)
      ligaTitle: "Liga Departamental",
      ligaPhase: "Fase regular",
      ligaFootnote: "Posiciones {label}.",

      // Card Finales (derecha)
      finalesTitle: "Playoffs",
      finalesPhase: "Fase Eliminatoria",
      finalesFootnote: "Serie ida y vuelta: define el global.",

      // Texto libre opcional (si luego querés mostrarlo en algún lado)
      note: "Torneo {label}.",

      // Override por torneo
      ...ui,
    },
  };
}

export const TOURNAMENTS_BY_CATEGORY = {
  tercera: [
    torneoOficial({
      categoryId: "tercera",
      year: 2025,
      ligaType: "inf_tercera_2025",
      finalesType: "inf_finales_tercera_2025",
      ui: {
        // Ejemplo: campeón / comentario
        finalesFootnote: "Gualeguay Central se consagra campeón del Torneo Oficial 2025 en Tercera División.",
      },
    }),
    torneoOficial({
      categoryId: "tercera",
      year: 2026,
      ligaType: "inf_tercera_2026",
      finalesType: "inf_finales_tercera_2026",
      ui: {
        finalesFootnote: "Torneo Oficial 2026 por disputarse.",
      },
    }),
  ],

  cuarta: [
    torneoOficial({
      categoryId: "cuarta",
      year: 2025,
      ligaType: "inf_cuarta_2025",
      finalesType: "inf_finales_cuarta_2025",
      ui: {
        finalesFootnote: "Bancario se consagra campeón del Torneo Oficial 2025 en Cuarta División.",
      },
    }),
    torneoOficial({ 
    categoryId: "cuarta", 
    year: 2026, 
    ligaType: "inf_cuarta_2026",
    finalesType: "inf_finales_cuarta_2026",
    ui: { 
      finalesFootnote: "Torneo Oficial 2026 por disputarse." 
    },
    }),
  ],

  quinta: [
    torneoOficial({
      categoryId: "quinta",
      year: 2025,
      ligaType: "inf_quinta_2025",
      finalesType: "inf_finales_quinta_2025",
      ui: {
        finalesFootnote: "Urquiza se consagra campeón del Torneo Oficial 2025 en Quinta División.",
      },
    }),
    torneoOficial({ 
    categoryId: "quinta", 
    year: 2026,
    ligaType: "inf_quinta_2026",
    finalesType: "inf_finales_quinta_2026", 
    ui: { 
      finalesFootnote: "Torneo Oficial 2026 por disputarse." 
    },
    }),
  ],

  sexta: [
    torneoOficial({
      categoryId: "sexta",
      year: 2025,
      ligaType: "inf_sexta_2025",
      finalesType: "inf_finales_sexta_2025",
      ui: {
        finalesFootnote: "Barrio Norte se consagra campeón del Torneo Oficial 2025 en Sexta División.",
      },
    }),
    torneoOficial({ 
      categoryId: "sexta", 
      year: 2026,
      ligaType: "inf_sexta_2026",
      finalesType: "inf_finales_sexta_2026",
      ui: { 
        finalesFootnote: "Torneo Oficial 2026 por disputarse." 
      },
    }),
  ],

  septima: [
    torneoOficial({
      categoryId: "septima",
      year: 2025,
      ligaType: "inf_septima_2025",
      finalesType: "inf_finales_septima_2025",
      ui: {
        finalesFootnote: "Libertad se consagra campeón del Torneo Oficial 2025 en Séptima División..",
      },
    }),
    torneoOficial({ 
      categoryId: "septima", 
      year: 2026,
      ligaType:    "inf_septima_2026",
      finalesType: "inf_finales_septima_2026",
      ui: { finalesFootnote: "Torneo Oficial 2026 por disputarse." }
    })
  ],
};


/* ========= LOGOS ========= */

export const TEAM_LOGOS = {
  "Barrio Norte": "/escudos/BarrioNorte_V1.png",
  Libertad: "/escudos/Libertad_V2.png",
  Quilmes: "/escudos/Quilmes.png",
  Urquiza: "/escudos/Urquiza.png",
  "Gualeguay Central": "/escudos/GualeguayCentral.png",
  GualeguayCentral: "/escudos/GualeguayCentral.png",
  "Sociedad Sportiva": "/escudos/SociedadSportiva.png",
  SociedadSportiva: "/escudos/SociedadSportiva.png",
  "La Academia": "/escudos/LaAcademia.png",
  LaAcademia: "/escudos/LaAcademia.png",
  Bancario: "/escudos/Bancario.png",
  "El Progreso": "/escudos/ElProgreso.png",
  ElProgreso: "/escudos/ElProgreso.png",
  "Aldea Asuncion": "/escudos/AldeaAsuncion.png",
  "Aldea Asunción": "/escudos/AldeaAsuncion.png",
  AldeaAsuncion: "/escudos/AldeaAsuncion.png",
  "Juventud Carbó": "/escudos/JuventudCarbo.png",
  JuventudCarbo: "/escudos/JuventudCarbo.png",
  Juventud: "/escudos/JuventudCarbo.png",
};
