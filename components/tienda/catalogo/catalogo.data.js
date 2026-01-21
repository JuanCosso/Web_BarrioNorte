export const STORE = {
  name: "Tienda Barrio Norte",
  currency: "ARS",
  // WhatsApp opcional como fallback
  whatsappNumber: "5490000000000",
  whatsappMsg: "Hola, quiero comprar/consultar por:",
};

// 3 destacados de Planeta Fútbol (IDs de PRODUCTS)
export const PLANETA_HIGHLIGHT_IDS = [
  "camiseta-titular-2026",
  "camiseta-alternativa-2026",
  "short-entrenamiento",
];

// 4 “Lo más buscado”
export const BESTSELLERS_IDS = [
  "camiseta-titular-2026",
  "buzo-club",
  "gorra-bn",
  "botella-bn",
];

export const PRODUCTS = [
  {
    id: "camiseta-titular-2026",
    name: "Camiseta Titular Oficial",
    category: "Deportivo",
    vendor: "Planeta Fútbol",
    price: 32000,
    images: ["/tienda/camiseta-titular.webp"],
    description: "Camiseta oficial. Consultá talles y stock.",
    variants: {
      size: ["S", "M", "L", "XL", "XXL"],
    },
    stock: 10,
  },
  {
    id: "camiseta-alternativa-2026",
    name: "Camiseta Alternativa",
    category: "Deportivo",
    vendor: "Planeta Fútbol",
    price: 30000,
    images: ["/tienda/camiseta-alternativa.webp"],
    description: "Diseño alternativo para entrenar o usar a diario.",
    variants: { size: ["S", "M", "L", "XL"] },
    stock: 10,
  },
  {
    id: "short-entrenamiento",
    name: "Short de Entrenamiento",
    category: "Deportivo",
    vendor: "Planeta Fútbol",
    price: 18000,
    images: ["/tienda/short.webp"],
    description: "Short liviano, ideal para entrenamiento.",
    variants: { size: ["S", "M", "L", "XL"] },
    stock: 10,
  },

  // Hogar
  {
    id: "mate-bn",
    name: "Mate Barrio Norte",
    category: "Para el hogar",
    price: 15000,
    images: ["/tienda/mate.webp"],
    description: "Mate con el escudo.",
    stock: 15,
  },

  // Accesorios
  {
    id: "gorra-bn",
    name: "Gorra Barrio Norte",
    category: "Accesorios",
    price: 12000,
    images: ["/tienda/gorra.webp"],
    description: "Gorra bordada con el escudo.",
    stock: 30,
  },

  // Hidratación
  {
    id: "botella-bn",
    name: "Botella Deportiva",
    category: "Hidratación",
    price: 9000,
    images: ["/tienda/botella.webp"],
    description: "Botella reutilizable para entrenamientos.",
    stock: 10,
  },

  // Deportivo
  {
    id: "buzo-club",
    name: "Buzo Oficial del Club",
    category: "Deportivo",
    price: 42000,
    images: ["/tienda/buzo.webp"],
    description: "Buzo abrigado con identidad del club.",
    variants: { size: ["S", "M", "L", "XL", "XXL"] },
    stock: 5,
  },
];
