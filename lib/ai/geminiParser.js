/**
 * lib/ai/geminiParser.js
 *
 * Módulo de procesamiento multimodal con Gemini Flash Vision para la Liga de Gualeguay.
 * - Recibe URLs o buffers de imágenes/flyers.
 * - Clasifica categoría (Primera, Femenino, Reserva, Inferiores) y tipo de placa.
 * - Extrae marcadores o filas de posiciones en formato JSON estructurado y tipado.
 * - Redacta copete institucional para la sección de novedades.
 */

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const SYSTEM_INSTRUCTION = `Eres el analista de datos oficial del Club Atlético Barrio Norte (Gualeguay, Entre Ríos, Argentina).
Tu tarea es analizar placas gráficas deportivas de la Liga Departamental de Fútbol de Gualeguay y extraer los datos con máxima precisión.

Reglas obligatorias:
1. Relevancia y Filtro: Si la imagen NO corresponde a la Liga Departamental de Fútbol de Gualeguay, o no contiene información deportiva de los torneos y clubes locales (Barrio Norte, Juventud y Ferrocarril Unidos, Quilmes, Sociedad Sportiva, CASS, Urquiza, Central Gualeguay, San Lorenzo, Centro Bancario Gualeguay, Gualeguay Central, Libertad, La Academia, El Progreso), clasifícala estrictamente con tipoContenido: "OTRO".
2. Identifica la categoría deportiva:
   - "PRIMERA_MASCULINO" -> si dice "Primera División", "Primera", o no especifica división pero son los clubes mayores.
   - "PRIMERA_FEMENINO" -> si dice "Femenino" o "Fútbol Femenino".
   - "TERCERA_RESERVA" -> si dice "Tercera" o "Reserva".
   - "CUARTA", "QUINTA", "SEXTA", "SEPTIMA" -> si son divisiones inferiores.
   - "CAT_A", "CAT_B", "CAT_C", "CAT_D" -> si son categorías infantiles.
3. Identifica el tipo de contenido:
   - "RESULTADOS_FECHA" -> si la placa contiene resultados y goles de partidos ya jugados.
   - "TABLA_POSICIONES" -> si es una tabla con PJ, PG, PE, PP, GF/GM, GC, DG, Pts.
   - "FIXTURE_PROXIMA_FECHA" -> si son los partidos programados a jugarse (días, horarios, canchas).
   - "OTRO" -> comunicados institucionales ajenos, publicidad, saludos o contenido no deportivo.
4. Extrae el número de fecha (ej: 5 para "Fecha 5").
5. Para resultados: extrae local, visitante, goles local, goles visitante.
6. Para tablas: extrae equipo, pj, pg, pe, pp, gf, gc, dg, pts.
7. Redacta un titular institucional sobrio y un copete de 2 oraciones resumidas solo si es relevante para el club o la liga.`;

export async function parseGraphicWithGemini({
  imageBuffer,
  imageUrl,
  mimeType = "image/jpeg",
  captionHint = "",
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY no está configurada en las variables de entorno.");
  }

  let imagePart;

  if (imageBuffer) {
    const base64Data = Buffer.isBuffer(imageBuffer)
      ? imageBuffer.toString("base64")
      : imageBuffer;
    imagePart = {
      inlineData: {
        data: base64Data,
        mimeType,
      },
    };
  } else if (imageUrl) {
    // Descargar la imagen y convertir a base64
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error(`No se pudo descargar la imagen desde ${imageUrl}`);
    const arrayBuffer = await res.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");
    const contentType = res.headers.get("content-type") || mimeType;
    imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: contentType,
      },
    };
  } else {
    throw new Error("Se requiere imageBuffer o imageUrl para procesar con Gemini.");
  }

  let promptInstruction = `Analiza esta imagen y devuelve estrictamente un objeto JSON con este formato:
{
  "categoria": "PRIMERA_MASCULINO | PRIMERA_FEMENINO | TERCERA_RESERVA | CUARTA | QUINTA | SEXTA | SEPTIMA | CAT_A | CAT_B | CAT_C | CAT_D",
  "tipoContenido": "RESULTADOS_FECHA | TABLA_POSICIONES | FIXTURE_PROXIMA_FECHA | OTRO",
  "numeroFecha": 5,
  "nombreFase": "Fase Regular | Petit Torneo | Repechaje | Playoffs",
  "partidos": [
    {
      "local": "Barrio Norte",
      "visitante": "Quilmes",
      "homeScore": 2,
      "awayScore": 1,
      "status": "FINISHED | SUSPENDED | SCHEDULED",
      "date": "07/06",
      "stadium": "Estadio Pocha Badaracco"
    }
  ],
  "tabla": [
    {
      "teamName": "Juventud",
      "pj": 8,
      "pg": 7,
      "pe": 1,
      "pp": 0,
      "gf": 14,
      "gc": 4,
      "dg": 10,
      "pts": 22
    }
  ],
  "titularNoticia": "...",
  "copeteNoticia": "..."
}

REGLAS CRÍTICAS PARA RESULTADOS:
- Si la placa es de resultados jugados (ej: RESULTADOS NOVENA FECHA, RESULTADOS FECHA 10), es OBLIGATORIO extraer los marcadores y goles en 'homeScore' (goles del local) y 'awayScore' (goles del visitante) como números enteros.
- Si empataron 0 a 0, coloca 'homeScore': 0 y 'awayScore': 0. Nunca omitas los goles si figuran en la placa.
- En ese caso coloca 'status': 'FINISHED'.`;

  if (captionHint && captionHint.trim()) {
    promptInstruction += `\n\nContexto / notas adicionales sobre la publicación o imagen: "${captionHint}". Tenlo en cuenta en caso de erratas o aclaraciones.`;
  }

  const payload = {
    systemInstruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }],
    },
    contents: [
      {
        parts: [
          imagePart,
          {
            text: promptInstruction,
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1,
    },
  };

  const candidateModels = [
    "gemini-2.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash",
  ];

  let rawText = null;
  let lastError = null;

  for (const modelName of candidateModels) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        rawText = jsonResponse?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) break;
      } else {
        const errText = await response.text();
        lastError = new Error(`Error en modelo ${modelName} (${response.status}): ${errText}`);
        // Si es 429 (cuota) o 503 (servidor caído), probar siguiente modelo inmediatamente
        if (response.status === 429 || response.status === 503) {
          console.warn(`Aviso: ${modelName} devolvió ${response.status}. Probando modelo alternativo...`);
          continue;
        }
      }
    } catch (netErr) {
      lastError = netErr;
    }
  }

  if (!rawText) {
    throw lastError || new Error("Ningún modelo de Gemini pudo procesar la imagen.");
  }

  return robustJsonParse(rawText);
}

function robustJsonParse(text) {
  let cleaned = String(text || "").trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (initialErr) {
    // Reparar comas finales antes de } o ]
    let repaired = cleaned.replace(/,\s*([}\]])/g, "$1");
    // Reparar claves sin comillas
    repaired = repaired.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');

    try {
      return JSON.parse(repaired);
    } catch (secondErr) {
      const match = repaired.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          return JSON.parse(match[0]);
        } catch (thirdErr) {
          throw new Error(`Error en JSON de Gemini: ${initialErr.message}. Muestra: ${cleaned.slice(0, 150)}`);
        }
      }
      throw new Error(`Error en JSON de Gemini: ${initialErr.message}`);
    }
  }
}
