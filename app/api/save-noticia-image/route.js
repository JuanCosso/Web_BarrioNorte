// app/api/save-noticia-image/route.js
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const CONTENT_TYPE_EXT = {
  "image/jpeg": "jpg",
  "image/jpg":  "jpg",
  "image/png":  "png",
  "image/webp": "webp",
  "image/gif":  "gif",
};

export async function POST(req) {
  try {
    const { url, filename } = await req.json();
    if (!url) return NextResponse.json({ error: "Falta 'url'" }, { status: 400 });

    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) return NextResponse.json({ error: `HTTP ${res.status} al descargar imagen` }, { status: 502 });

    const ct  = (res.headers.get("content-type") || "image/jpeg").split(";")[0].trim();
    const ext = CONTENT_TYPE_EXT[ct] || "jpg";

    // Nombre: usa el provisto (sin extensión) o genera uno por timestamp
    const base = filename
      ? String(filename).replace(/[^a-z0-9_\-]/gi, "_").replace(/\.[^.]+$/, "")
      : `noticia_${Date.now()}`;
    const safeName = `${base}.${ext}`;

    const dir  = path.join(process.cwd(), "public", "noticias");
    const dest = path.join(dir, safeName);

    await mkdir(dir, { recursive: true });
    await writeFile(dest, Buffer.from(await res.arrayBuffer()));

    return NextResponse.json({ ok: true, localPath: `/noticias/${safeName}` });
  } catch (err) {
    console.error("[save-noticia-image]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}