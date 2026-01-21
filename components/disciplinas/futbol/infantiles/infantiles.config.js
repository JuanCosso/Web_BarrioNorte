// components/disciplinas/futbol/infantiles/infantiles.config.js
import { IconShield } from "../shared/FutbolShared";

/* ========= HERO / CONTACTO / QUICK FACTS ========= */

export const HERO = {
  title: "Fútbol",
  subtitle: "Infantiles",
  tagline: "Información de las categorías infantiles.",
  hideTagline: false,
  // Ajustá la ruta si usás otra imagen
  imageSrc: "/disciplinas/futbol/infantiles/banner.jpg",
  pills: ["Tablas", "Contacto"],
  hidePills: true,
};

export const CONTACT = {
  whatsappHref:
    "https://wa.me/5490000000000?text=Hola%20quiero%20sumar%20a%20mi%20hijo%20a%20Infantiles%20de%20Barrio%20Norte",
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
    hint: "Desde 2018 a 2015",
    icon: IconShield,
  },
];

/* ========= FLYER (Mismo look que Femenino / Inferiores) ========= */

export const BACKGROUND_IMAGE_URL = "/inicio/Proximo-Partido-Fondo.png";

export const JOIN_AD = {
  kicker: "FÚTBOL INFANTILES",
  title: "SUMATE A BARRIO NORTE",
  subtitle: "Un espacio para aprender, competir y crecer en equipo.",
  locationValue: "Club Atlético Barrio Norte",
  scheduleLabel: "Entrenamientos",
  scheduleValue: "Consultá los horarios",
  ctaLabel: "Quiero sumarme",
  ctaHref:
    "https://wa.me/5490000000000?text=Hola%20quiero%20sumar%20a%20mi%20hijo%20a%20Infantiles%20de%20Barrio%20Norte",
  centerImageSrc: "/escudos/BarrioNorte_V1.png",
  // note: "Te respondemos por WhatsApp.",
};

/* ========= CATEGORÍAS ========= */

export const CATEGORIES = [
  { id: "cat_a", label: "Categoría A (2015)"},
  { id: "cat_b", label: "Categoría B (2016)"},
  { id: "cat_c", label: "Categoría C (2017)"},
  { id: "cat_d", label: "Categoría D (2018)"},
];

/* ========= TORNEOS =========
   - Solo Oficial 2025 y Oficial 2026.
   - Cada torneo: Liga + Finales (Semis/Final ida-vuelta).
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
      ligaTitle: "Liga Departamental",
      ligaPhase: "Fase regular",
      ligaFootnote: "Posiciones {label}.",

      finalesTitle: "Playoffs",
      finalesPhase: "Fase Eliminatoria",
      finalesFootnote: "Serie ida y vuelta: define el global.",

      note: "Torneo {label}.",
      ...ui,
    },
  };
}

export const TOURNAMENTS_BY_CATEGORY = {
  cat_a: [
    torneoOficial({
      categoryId: "cat_a",
      year: 2025,
      ligaType: "inf_cat_a_2025",
      finalesType: "inf_finales_cat_a_2025",
      ui: {finalesFootnote: "Sociedad Sportiva se consagra campéon del Torneo Oficial 2025 en Categoría A (2014)."}
    }),
    torneoOficial({
      categoryId: "cat_a",
      year: 2026,
      ligaType: "inf_cat_a_2026",
      finalesType: "inf_finales_cat_a_2026",
      ui: { finalesFootnote: "Torneo {label} por disputarse." },
    }),
  ],

  cat_b: [
    torneoOficial({
      categoryId: "cat_b",
      year: 2025,
      ligaType: "inf_cat_b_2025",
      finalesType: "inf_finales_cat_b_2025",
      ui: {finalesFootnote: "Bancario se consagra campéon del Torneo Oficial 2025 en Categoría B (2015)."}
    }),
    torneoOficial({
      categoryId: "cat_b",
      year: 2026,
      ligaType: "inf_cat_b_2026",
      finalesType: "inf_finales_cat_b_2026",
      ui: { finalesFootnote: "Torneo {label} por disputarse." },
    }),
  ],

  cat_c: [
    torneoOficial({
      categoryId: "cat_c",
      year: 2025,
      ligaType: "inf_cat_c_2025",
      finalesType: "inf_finales_cat_c_2025",
      ui: {finalesFootnote: "Bancario se consagra campéon del Torneo Oficial 2025 en Categoría C (2016)."}
    }),
    torneoOficial({
      categoryId: "cat_c",
      year: 2026,
      ligaType: "inf_cat_c_2026",
      finalesType: "inf_finales_cat_c_2026",
      ui: { finalesFootnote: "Torneo {label} por disputarse." },
    }),
  ],

  cat_d: [
    torneoOficial({
      categoryId: "cat_d",
      year: 2025,
      ligaType: "inf_cat_d_2025",
      finalesType: "inf_finales_cat_d_2025",
      ui: {finalesFootnote: "Barrio Norte se consagra campéon del Torneo Oficial 2025 en Categoría D (2017)."}
    }),
    torneoOficial({
      categoryId: "cat_d",
      year: 2026,
      ligaType: "inf_cat_d_2026",
      finalesType: "inf_finales_cat_d_2026",
      ui: { finalesFootnote: "Torneo {label} por disputarse." },
    }),
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
