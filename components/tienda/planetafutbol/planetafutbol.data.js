export const BRAND_RED = "#bc1717";

export const STORE = {
  name: "Planeta Fútbol",
  city: "Gualeguay, Entre Ríos",

  // Completá estos campos con los reales:
  addressLine1: "DIRECCIÓN (calle y número)",
  addressLine2: "Gualeguay, Entre Ríos",

  // WhatsApp del local o del club (formato internacional sin +)
  whatsappNumber: "5490000000000",
  whatsappDefaultMsg:
    "Hola, quiero consultar por indumentaria de fútbol de Barrio Norte en Planeta Fútbol.",

  // Link de Google Maps (para botón “Cómo llegar”)
  mapsUrl: "https://www.google.com/maps",

  /**
   * Embed de Google Maps:
   * En Google Maps → Compartir → Insertar un mapa → copiá el src del iframe y pegalo acá.
   * Ejemplo:
   * "https://www.google.com/maps/embed?pb=..."
   */
  mapsEmbedUrl: "",

  // Opcional
  instagramUrl: "",
};

export const HOURS = [
  { day: "Lunes a Viernes", hours: "10:00 a 12:30 / 17:00 a 20:30" },
  { day: "Sábados", hours: "10:00 a 13:00" },
  { day: "Domingos", hours: "Cerrado" },
];

export const HIGHLIGHTS = [
  {
    title: "Indumentaria de Barrio Norte",
    description:
      "Camisetas, shorts, buzos y artículos para entrenar y alentar.",
  },
  {
    title: "Talles y asesoramiento",
    description:
      "Consultá disponibilidad y combinaciones; te ayudamos a elegir.",
  },
  {
    title: "Retiro en el local",
    description:
      "Coordinación simple por WhatsApp y retiro presencial en Gualeguay.",
  },
];

export const GALLERY = [
  // Reemplazá por fotos reales del local cuando las tengas
  { src: "/tienda/planeta/local-01.webp", alt: "Frente del local Planeta Fútbol" },
  { src: "/tienda/planeta/local-02.webp", alt: "Interior del local" },
  { src: "/tienda/planeta/local-03.webp", alt: "Indumentaria Barrio Norte" },
  { src: "/tienda/planeta/local-04.webp", alt: "Mostrador y atención" },
];
