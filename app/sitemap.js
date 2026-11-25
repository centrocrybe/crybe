import { createClient } from "@supabase/supabase-js";

import { profesionales as profesionalesLocales } from "../data/profesionales";
import { getSiteUrl } from "../lib/site";

// Un bot que pida /sitemap.xml en bucle no debe pegarle a Supabase en cada
// request: se regenera como máximo una vez por hora y con tope de URLs.
export const revalidate = 3600;

const SLUG_SEGURO = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_URLS = 500;

export default async function sitemap() {
  const origen = getSiteUrl();
  const urls = [
    {
      url: origen,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const slugs = new Map();
  let desdeDb = false;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Solo la anon key: nada de service_role ni datos del panel en el sitemap.
  if (url && key) {
    try {
      const sb = createClient(url, key);
      const { data, error } = await sb
        .from("profesionales")
        .select("slug, created_at")
        .eq("activo", true)
        .order("orden", { ascending: true })
        .limit(MAX_URLS);
      if (!error && Array.isArray(data)) {
        desdeDb = true;
        for (const p of data) {
          // El slug se valida antes de meterlo en una URL pública.
          if (typeof p.slug === "string" && SLUG_SEGURO.test(p.slug)) {
            slugs.set(p.slug, p.created_at);
          }
        }
      }
    } catch {
      // Sin respuesta de Supabase: se usa el fallback local de siempre.
    }
  }

  if (!desdeDb) {
    for (const p of profesionalesLocales) {
      if (p?.activo !== false && typeof p.slug === "string" && SLUG_SEGURO.test(p.slug)) {
        slugs.set(p.slug, undefined);
      }
    }
  }

  for (const [slug, creado] of slugs) {
    if (urls.length >= MAX_URLS) break;
    const modificacion = creado && !Number.isNaN(Date.parse(creado)) ? creado : undefined;
    urls.push({
      url: `${origen}/profesionales/${slug}`,
      ...(modificacion ? { lastModified: modificacion } : {}),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return urls;
}
