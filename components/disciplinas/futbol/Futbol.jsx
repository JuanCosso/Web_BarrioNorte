"use client";

// components/disciplinas/futbol/Futbol.jsx
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Masculino from "./masculino/Masculino";
import Femenino from "./femenino/Femenino";
import Inferiores from "./inferiores/Inferiores";
import Infantiles from "./infantiles/Infantiles";

const NAV = [
  { id: "masculino", label: "Masculino" },
  { id: "femenino", label: "Femenino" },
  { id: "inferiores", label: "Inferiores" },
  { id: "infantiles", label: "Infantiles" },
];

const DEFAULT_TAB = "masculino";
const TAB_PARAM = "tab";

// Aliases por si querés URLs más “humanas” o compatibilidad
const TAB_ALIASES = {
  primera: "masculino",
  masculino: "masculino",
  femenino: "femenino",
  inferiores: "inferiores",
  infantiles: "infantiles",
};

function normalizeTab(value) {
  const raw = String(value || "").trim().toLowerCase();
  return TAB_ALIASES[raw] || "";
}

export default function Futbol() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const validIds = useMemo(() => new Set(NAV.map((n) => n.id)), []);
  const [active, setActive] = useState(DEFAULT_TAB);

  // 1) Leer ?tab= al cargar y cuando cambie el URL (back/forward)
  useEffect(() => {
    const fromUrl = normalizeTab(searchParams.get(TAB_PARAM));
    if (fromUrl && validIds.has(fromUrl) && fromUrl !== active) {
      setActive(fromUrl);
      return;
    }

    // Si no hay tab, volvemos al default (solo si no estamos ya ahí)
    if (!fromUrl && active !== DEFAULT_TAB) {
      setActive(DEFAULT_TAB);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, validIds]);

  // 2) Cambiar tab y reflejarlo en el URL
  const handleChange = (nextId) => {
    const next = String(nextId || "").toLowerCase();
    if (!validIds.has(next)) return;

    setActive(next);

    // preserva otros parámetros (por ejemplo, cat/torneo en el futuro)
    const sp = new URLSearchParams(searchParams.toString());

    // Si es el default, no ensuciamos el link: /disciplinas/futbol
    if (next === DEFAULT_TAB) sp.delete(TAB_PARAM);
    else sp.set(TAB_PARAM, next);

    const qs = sp.toString();
    const href = qs ? `${pathname}?${qs}` : pathname;

    router.push(href, { scroll: false });
  };

  // Render de UNA rama a la vez (cada rama maneja su contenido interno)
  if (active === "femenino") {
    return <Femenino nav={NAV} active={active} onChange={handleChange} />;
  }
  if (active === "inferiores") {
    return <Inferiores nav={NAV} active={active} onChange={handleChange} />;
  }
  if (active === "infantiles") {
    return <Infantiles nav={NAV} active={active} onChange={handleChange} />;
  }
  return <Masculino nav={NAV} active={active} onChange={handleChange} />;
}
