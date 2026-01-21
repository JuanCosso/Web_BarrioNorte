// data/equiposConfig.js

export const equiposConfig = {
    "Barrio Norte": {
      shortName: "Barrio Norte",
      slug: "barrio-norte",
      logo: "/escudos/BarrioNorte_V1.png",
    },
    Bancario: {
      shortName: "Bancario",
      slug: "bancario",
      logo: "/escudos/Bancario.png",
    },
    Juventud: {
      shortName: "Juventud",
      slug: "juventud",
      logo: "/escudos/JuventudCarbo.png",
    },
    "El Progreso": {
      shortName: "El Progreso",
      slug: "el-progreso",
      logo: "/escudos/ElProgreso.png",
    },
    "Gualeguay Central": {
      shortName: "Gualeguay Central",
      slug: "gualeguay-central",
      logo: "/escudos/GualeguayCentral.png",
    },
    "La Academia": {
      shortName: "La Academia",
      slug: "la-academia",
      logo: "/escudos/LaAcademia.png",
    },
    Libertad: {
      shortName: "Libertad",
      slug: "libertad",
      logo: "/escudos/Libertad_V2.png",
    },
    Quilmes: {
      shortName: "Quilmes",
      slug: "quilmes",
      logo: "/escudos/Quilmes.png",
    },
    "Sociedad Sportiva": {
      shortName: "Sociedad Sportiva",
      slug: "sociedad-sportiva",
      logo: "/escudos/SociedadSportiva.png",
    },
    Urquiza: {
      shortName: "Urquiza",
      slug: "urquiza",
      logo: "/escudos/Urquiza.png",
    },
  };
  
  // Función de ayuda para aplicar esta config a cada equipo
  export function aplicarConfigEquipo(equipoBase) {
    const config = equiposConfig[equipoBase.name] || {};
  
    const slugGenerico = equipoBase.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // saca tildes
      .replace(/\s+/g, "-");
  
    return {
      ...equipoBase,
      shortName: config.shortName || equipoBase.name,
      slug: config.slug || slugGenerico,
      logo: config.logo || "/escudos/default.png", // poné un escudo genérico si querés
    };
  }
  