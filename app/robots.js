import { getSiteUrl } from "../lib/site";

// El panel y las rutas internas no deben aparecer en Google. El login también
// queda cubierto por /admin.
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/api/"],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
