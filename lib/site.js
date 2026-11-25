// Origen canónico del sitio, usado por canonical, Open Graph, robots y sitemap.
// NUNCA se lee del header Host ni de x-forwarded-*: son falsificables y
// permitirían "envenenar" los links canónicos que ve Google. Viene de una
// variable de BUILD (NEXT_PUBLIC_*, incrustada al compilar).
const ORIGEN_FALLBACK = "https://crybe-next.crybe.workers.dev";

export function getSiteUrl() {
  const valor = process.env.NEXT_PUBLIC_SITE_URL;
  if (!valor) return ORIGEN_FALLBACK;
  try {
    const url = new URL(valor);
    if (url.protocol !== "https:" && url.protocol !== "http:") return ORIGEN_FALLBACK;
    // http solo para desarrollo local; en producción se exige https.
    if (url.protocol === "http:" && !["localhost", "127.0.0.1"].includes(url.hostname)) {
      return ORIGEN_FALLBACK;
    }
    // Solo el origen: descarta path, query y hash que pueda traer la variable.
    return url.origin;
  } catch {
    return ORIGEN_FALLBACK;
  }
}
