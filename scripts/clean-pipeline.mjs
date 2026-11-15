import fs from "fs";
import path from "path";

const inputPath = "C:/Users/juanc/.gemini/antigravity/brain/0e4f9b27-d269-4836-978d-004c95874bd2/scratch/parsed_flow.json";
const outputPath = "C:/Users/juanc/.gemini/antigravity/brain/0e4f9b27-d269-4836-978d-004c95874bd2/scratch/cleaned_flow.json";

let flow = JSON.parse(fs.readFileSync(inputPath, "utf8"));

const nodesToDelete = new Set([
  "68bced8445de196a", // Preparar POST Partidos
  "eebbf428fec92ccc", // POST a DB (Partidos)
  "8f763220c6b522c0", // DB Partidos Response
]);

// 1. Quitar referencias a nodos eliminados en los wires de los nodos restantes
flow.forEach((n) => {
  if (n.wires && Array.isArray(n.wires)) {
    n.wires = n.wires.map((wireGroup) =>
      wireGroup.filter((id) => !nodesToDelete.has(id))
    );
  }
});

// 2. Eliminar físicamente los nodos de partidos
flow = flow.filter((n) => !nodesToDelete.has(n.id));

// 3. Actualizar 'Armar request Gemini' (69017225811954a0)
const armarGemini = flow.find((n) => n.id === "69017225811954a0");
if (armarGemini) {
  armarGemini.func = `const cuenta = String(msg.cuenta_origen || "").toLowerCase();
const caption = String(msg.caption || "").trim();

const PROMPT = \`Sos el sistema de prensa y contenidos oficial del Club Atlético Barrio Norte (Gualeguay, Entre Ríos).

Analizá con atención la imagen y el texto de la publicación para clasificarla en UNO de los siguientes 2 casos. Respondé ÚNICAMENTE con JSON válido:
{ "tipo_contenido": "noticia" | "descartar", "datos": { ... } }

━━━ CASO 1: NOTICIA DEL CLUB (tipo_contenido = "noticia") ━━━
Aplica si la publicación trata DIRECTAMENTE de una actividad, logro, partido, anuncio, evento o novedad del CLUB ATLÉTICO BARRIO NORTE (escudo CABN, camiseta albirroja / roja y blanca a bastones verticales, mención expresa a Barrio Norte, 'el Norte', 'el Norteño', sus jugadores/as, categorías o disciplinas).
Abarca tanto fútbol como TODAS sus disciplinas deportivas, formativas, culturales e institucionales:
- "Fútbol" (Primera División masculina del club)
- "Femenino" (Fútbol femenino del club)
- "Inferiores" (sub-13 a sub-17 del club)
- "Infantiles" (formativas y escuelita del club)
- "Ciclismo" (carreras, podios, circuito, ciclistas del club como Milagros Sanabria)
- "Bochas" (torneos de bochas, parejas, tríos del club)
- "Tenis" (torneos, dobles, singles, escuelita)
- "Billar" (5 quillas, casín)
- "Gimnasia" (gimnasia rítmica, presentaciones)
- "Samba Verá" (comparsa, batucada, carnaval del club)
- "Institucional" (sede, socios, obras, aniversarios, cenas)

Redacción: Estilo periodístico deportivo argentino, conciso, emocionante y cercano al hincha de Barrio Norte.
Prohibido lenguaje neutro ("balompié", "zaga", "guardameta").
Formato datos:
{
  "titulo": "Título periodístico directo (máx 8 palabras)",
  "resumen": "Resumen conciso y claro de lo ocurrido o anunciado (máximo 2 oraciones).",
  "categoria": "[Fútbol|Femenino|Inferiores|Infantiles|Ciclismo|Bochas|Tenis|Billar|Gimnasia|Samba Verá|Institucional]",
  "tags": ["Barrio Norte", "Norteños", "Gualeguay"]
}

━━━ CASO 2: DESCARTAR (tipo_contenido = "descartar") ━━━
Aplica para TODO lo que NO sea una noticia propia del Club Atlético Barrio Norte.
Ejemplos a descartar:
- Marcadores o resultados de partidos donde NO juega Barrio Norte.
- Tablas de posiciones generales de la liga o de otros torneos.
- Publicaciones exclusivas de clubes rivales (Libertad, Urquiza, Bancario, Central, Juventud, etc.) sin relación con Barrio Norte.
- Publicidades ajenas comerciales, sponsors generales o clasificados.
- Memes o publicaciones sin información institucional/deportiva del club.
Formato datos:
{
  "motivo": "Explicación breve del descarte"
}\`;

msg.gemini_intentos = msg.gemini_intentos || 1;
msg.gemini_modelo = "gemini-2.5-flash";

// Clave API de Gemini: variable de entorno o clave directa
const API_KEY = env.get("GEMINI_API_KEY") || "TU_GEMINI_API_KEY";
msg.gemini_api_key = API_KEY;

msg.url = \`https://generativelanguage.googleapis.com/v1beta/models/\${msg.gemini_modelo}:generateContent?key=\${API_KEY}\`;
msg.gemini_url = msg.url;

msg.payload = {
  contents: [{
    parts: [
      { inlineData: { mimeType: msg.image_mime || "image/jpeg", data: msg.image_base64 } },
      { text: PROMPT + "\\n\\nCUENTA ORIGEN: " + cuenta + "\\nTEXTO DE LA PUBLICACIÓN:\\n" + caption }
    ]
  }],
  generationConfig: { temperature: 0.1, response_mime_type: "application/json", maxOutputTokens: 1024 }
};

// Guardar copia exacta de la petición para posibles reintentos sin corromperse
msg.gemini_request_backup = JSON.parse(JSON.stringify(msg.payload));

node.log("📤 Preparando Gemini (Modelo: " + msg.gemini_modelo + " - Intento " + msg.gemini_intentos + ") | cuenta: " + cuenta);
return msg;`;
}

// 4. Actualizar 'Evaluar Gemini & Redundancia' (0dff8d3f98eb6f1a)
const evaluarGemini = flow.find((n) => n.id === "0dff8d3f98eb6f1a");
if (evaluarGemini) {
  evaluarGemini.func = `const payload = msg.payload || {};
const statusCode = msg.statusCode || 200;
const errorCode = (payload.error && payload.error.code) || (statusCode >= 400 ? statusCode : null);

// 1. Éxito: tiene candidates válidos
if (!errorCode && payload.candidates && payload.candidates.length > 0) {
  node.log("✅ Gemini respondió OK");
  return [msg, null]; // Salida 1: Parsear respuesta
}

// 2. Error
const intentos = msg.gemini_intentos || 1;
const errorMsg = (payload.error && payload.error.message) || ("HTTP " + statusCode);
node.warn(\`⚠️ Error en Gemini (Intento \${intentos}): \${errorMsg}\`);

// RESTAURAMOS el payload original para no reenviar el error a Gemini
if (msg.gemini_request_backup) {
  msg.payload = JSON.parse(JSON.stringify(msg.gemini_request_backup));
}

const API_KEY = msg.gemini_api_key || env.get("GEMINI_API_KEY") || "";
const modelo = msg.gemini_modelo || "gemini-2.5-flash";

// Intento 1 falló -> Reintentar tras pausa de 12s
if (intentos === 1) {
  node.warn("⏳ Reintento 1: Pausa de 12 segundos...");
  msg.gemini_intentos = 2;
  msg.delay = 12000;
  msg.url = \`https://generativelanguage.googleapis.com/v1beta/models/\${modelo}:generateContent?key=\${API_KEY}\`;
  return [null, msg];
}

// Intento 2 falló -> Segundo reintento con pausa de 15s
if (intentos === 2) {
  node.warn("⏳ Reintento 2: Pausa de 15 segundos adicional...");
  msg.gemini_intentos = 3;
  msg.delay = 15000;
  msg.url = \`https://generativelanguage.googleapis.com/v1beta/models/\${modelo}:generateContent?key=\${API_KEY}\`;
  return [null, msg];
}

node.error("❌ Fallaron los reintentos temporales de Gemini. El post NO se quema para reintentarlo en el siguiente ciclo.");
return [null, null];`;
}

// 5. Actualizar 'Parsear respuesta Gemini' (87ce112c81c8e28a)
const parsearGemini = flow.find((n) => n.id === "87ce112c81c8e28a");
if (parsearGemini) {
  parsearGemini.func = `try {
  const payload   = msg.payload || {};
  const errorCode = payload.error && payload.error.code;

  if (errorCode) {
    throw new Error("Error Gemini " + errorCode + ": " + (payload.error.message || "").substring(0, 120));
  }

  const candidates = payload.candidates;
  if (!candidates || !candidates[0]) {
    throw new Error("Sin candidates en respuesta de Gemini");
  }

  let texto = candidates[0].content.parts[0].text || "";

  // Log para diagnóstico
  node.warn("GEMINI RAW: " + texto.substring(0, 300));

  texto = texto.replace(/\`\`\`json\\s*/gi, "").replace(/\`\`\`\\s*/g, "").trim();

  const parsed = JSON.parse(texto);

  msg.tipo_contenido = parsed.tipo_contenido || "descartar";
  msg.datos          = parsed.datos || {};

  // Si no es noticia, descartar
  if (msg.tipo_contenido !== "noticia") {
    msg.tipo_contenido = "descartar";
  }

  // Si datos está vacío
  if (Object.keys(msg.datos).length === 0) {
    msg.tipo_contenido = "descartar";
    msg.datos = { motivo: "Sin datos" };
  }

  node.log("✅ Clasificación: " + msg.tipo_contenido +
    (msg.datos.categoria ? " | Cat: " + msg.datos.categoria : "") +
    (msg.datos.titulo ? " | Título: " + msg.datos.titulo : ""));

} catch(e) {
  node.error("❌ " + e.message);
  msg.tipo_contenido = "descartar";
  msg.datos = { motivo: e.message.substring(0, 100) };
}

return msg;`;
}

// 6. Actualizar 'Router contenido' (c0ca177449926361)
const router = flow.find((n) => n.id === "c0ca177449926361");
if (router) {
  router.rules = [
    { t: "eq", v: "noticia", vt: "str" },
    { t: "else" },
  ];
  router.wires = [
    ["08da17dbf545d263"], // Noticia -> Preparar Upload Cloudinary
    ["8fc504e49635de06"], // Else (descarte) -> Marcar descarte en memoria
  ];
}

console.log("Nodos antes: 41, Nodos después:", flow.length);
fs.writeFileSync(outputPath, JSON.stringify(flow, null, 4));
console.log("Flujo guardado con éxito en:", outputPath);
