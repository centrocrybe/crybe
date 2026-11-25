# Centro CRYBE — Sitio Web Institucional

Sitio web del **Centro de Rehabilitación y Bienestar Emocional (CRYBE)** en General Roca, Río Negro. Desarrollado con **Next.js 16 (App Router)**, desplegado en **Cloudflare Workers** vía **OpenNext**.

---

## 🎯 Qué hace este sitio

- **Home (One-page)** con secciones: Hero, Nosotros, Especialidades, Profesionales (Equipo), Alquiler de Módulos, Recursos (Blog/Artículos), Contacto.
- **Panel de Administración** (`/admin`) para editar todo el contenido sin tocar código: textos, imágenes, profesionales, especialidades, novedades, ajustes globales.
- **Páginas de detalle** de profesionales (`/profesionales/[slug]`).
- **Formulario de contacto** con validación cliente/servidor + Turnstile (anti-bot).
- **WhatsApp flotante** fijo en todas las páginas.
- **Navbar sticky** con detección de sección activa al scroll, menú hamburguesa en móvil, panel de usuario admin.

---

## 🛠 Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Framework | **Next.js 16.4** (App Router, React 19, Turbopack) |
| Despliegue | **Cloudflare Workers** vía **@opennextjs/cloudflare** |
| Base de Datos / CMS | **Supabase** (PostgreSQL + Storage + Auth) |
| Estilos | **Tailwind CSS v4** (CSS-first, `@theme`, variables CSS) |
| Animaciones | **Framer Motion** (solo donde aporta UX; desactivado en táctil) |
| Iconos | **Lucide React** |
| Formularios | **React Hook Form** (implícito) + **Zod** (validación server) + **Turnstile** |
| Tipografías | **Manrope** (UI), **League Spartan** (Títulos), **Literata** (Serif display) — auto-hospedadas por Next (`next/font/google`) |
| Lint/Format | **ESLint 9** (config Next) |

---

## 📁 Estructura del Proyecto

```
crybe-next/
├── app/
│   ├── layout.js                 # Root layout: fonts, metadata, preconnect Supabase
│   ├── page.js                   # Home (server component) — fetch contenido + compone secciones
│   ├── globals.css               # Tailwind v4 + tema + utilidades responsive
│   ├── actions.js                # Server Actions (contacto, auth admin)
│   ├── admin/
│   │   ├── layout.js             # Layout panel admin (protegido con middleware)
│   │   ├── page.js               # Dashboard
│   │   ├── actions.js            # Server Actions admin (CRUD contenido)
│   │   ├── *.jsx                 # Vistas: inicio, nosotros, especialidades, equipo, novedades, datos, foto-field
│   │   └── login/
│   │       └── page.js           # Login admin (magic link / email)
│   ├── api/
│   │   ├── admin-status/route.js # Check sesión admin (para navbar)
│   │   └── keepalive/route.js    # Ping para evitar cold starts
│   └── profesionales/[slug]/page.js  # Detalle profesional (SSR)
├── components/
│   ├── layout/
│   │   ├── NavBar.jsx            # Navbar completo (sticky, scroll spy, menú admin, responsive)
│   │   ├── Footer.jsx            # Footer con navegación, legales (modales), redes
│   │   └── WhatsApp.jsx          # Botón flotante WhatsApp con pulso CSS
│   └── home/
│       ├── Hero.jsx              # Carrusel hero (preload imágenes, crossfade, solo 1 capa)
│       ├── Nosotros.jsx          # Grilla pilares + complementarios (datos CMS)
│       ├── Especialidades.jsx    # Grid tarjetas (hover desktop / tap→modal móvil)
│       ├── Equipo.jsx            # Profesionales con filtros, modal detalle, Reveal
│       ├── AlquilerModulos.jsx   # Info alquiler consultorios
│       ├── Novedades.jsx         # Blog/Recursos: grid paginado + modal artículo + carrusel imágenes
│       ├── Contacto.jsx          # Formulario + info sede + mapa Google Maps embed
│       └── Reveal.jsx            # IntersectionObserver wrapper (desactiva en táctil)
├── lib/
│   ├── contenido.js              # Fetch público a Supabase (anon key) — normaliza datos para componentes
│   ├── supabase.js               # Cliente Supabase browser (anon)
│   ├── supabaseServer.js         # Cliente Supabase server (service role)
│   ├── supabaseMiddleware.js     # Helper para middleware auth
│   ├── iconos.js                 # Mapa de iconos Lucide por nombre string
│   ├── navegacion.js             # Array único de links (Navbar + Footer)
│   ├── comprimir.js              # Utilidad compresión imágenes (sharp)
│   ├── limites.js                # Rate limiting simple
│   └── ip.js                     # Helper obtener IP real
├── data/
│   ├── especialidades.js         # Fallback local (ya no se usa, queda por compat)
│   └── profesionales.js          # Fallback local (ya no se usa)
├── workers/
│   └── keepalive-worker.js       # Worker programado (cron) para ping
├── public/                       # Imágenes estáticas (logo, placeholders, etc.)
├── .dev.vars                     # Variables de entorno LOCAL (no commitear)
├── open-next.config.ts           # Config OpenNext (middleware, incremental cache)
├── package.json
├── jsconfig.json
└── wrangler.toml / wrangler.jsonc  # Config Cloudflare (si aplica)
```

---

## ⚙️ Variables de Entorno

Crear `.dev.vars` local (o configurar en Cloudflare Pages → Settings → Environment variables):

```bash
# Supabase (Público - cliente)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# Supabase (Privado - solo server)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# Turnstile (anti-bot formulario contacto)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAAxxxxxxxx
TURNSTILE_SECRET_KEY=0x4AAAAAAAxxxxxxxx

# Opcional: dominio propio (cambiar en app/layout.js:40 metadataBase)
# NEXT_PUBLIC_SITE_URL=https://tudominio.com
```

> **Nota:** En producción (Cloudflare Pages) estas variables se configuran en el dashboard, **no** en `.dev.vars`.

---

## 🗄 Esquema de Datos en Supabase (Resumen)

Tablas principales que el panel admin gestiona:

| Tabla | Qué almacena | Campos clave |
|-------|--------------|--------------|
| `ajustes` | Configuración global (clave/valor) | `clave` (whatsapp, email, telefono, mapa, instagram, facebook, avatar, horarios...), `valor` |
| `secciones` | Cabeceras editables por sección | `slug` (hero, nosotros, especialidades, equipo, novedades, contacto, alquiler), `titulo`, `descripcion` |
| `portadas` | Slides del Hero | `id`, `nombre`, `titulo`, `subtitulo`, `imagen`, `orden`, `activo` |
| `especialidades` | Tarjetas de especialidades | `slug`, `nombre`, `tag`, `descripcion`, `imagen`, `hero_titulo`, `hero_subtitulo`, `hero_imagen`, `activo` |
| `profesionales` | Equipo | `id`, `slug`, `nombre`, `especialidad`, `especialidad_slug`, `modalidad`, `foto_url`, `matricula`, `resumen`, `descripcion`, `whatsapp`, `dias[]`, `horarios`, `mostrar_horarios`, `areas[]`, `orden`, `activo` |
| `novedades` | Artículos / Recursos | `id`, `categoria`, `titulo`, `descripcion`, `cuerpo[]`, `imagen_principal`, `galeria[]`, `autor`, `fecha_publicacion`, `publicado` |
| `nosotros_items` | Pilares / complementarios | `id`, `icono` (string Lucide), `titulo`, `texto`, `orden`, `activo` |
| `admins` | Usuarios admin | `id`, `email`, `avatar`, `rol` |

---

## 🚀 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo local (Turbopack)
npm run dev
# Abre http://localhost:3000

# Build de producción (Next.js)
npm run build

# Preview build local (simula Cloudflare)
npm run preview

# Deploy a Cloudflare Workers
npm run deploy

# Solo build OpenNext (sin deploy)
npm run upload

# Typecheck / Lint
npm run lint
```

---

## 🌐 Despliegue en Cloudflare

### Primera vez (setup)

1. **Conectar repo** en Cloudflare Pages → "Connect to Git".
2. **Build command**: `npm run deploy` (o `npx opennextjs-cloudflare build && npx opennextjs-cloudflare deploy`)
3. **Output directory**: `.open-next` (lo maneja OpenNext)
4. **Environment variables**: agregar todas las de la sección anterior.
5. **Compatibility date**: `2026-10-15` (o la actual).
6. **Node.js version**: 20+ (recomendado 22).

### Deploy manual (desde local)

```bash
npm run deploy
# Equivale a:
# npx opennextjs-cloudflare build && npx opennextjs-cloudflare deploy
```

### Dominio personalizado

1. En Cloudflare Pages → Custom domains → Add domain.
2. Cambiar `metadataBase` en `app/layout.js:40`:
   ```js
   export const metadata = {
     metadataBase: new URL("https://TU_DOMINIO.com"),
     // ...
   }
   ```
3. Redeploy (`npm run deploy`).

---

## 🔐 Panel de Administración

- **Acceso**: `/admin/login` (magic link por email).
- **Sesión**: Cookie HttpOnly + middleware que protege `/admin/*`.
- **Permisos**: Tabla `admins` en Supabase (email + avatar).
- **Qué se edita**:
  - **Inicio**: Slides del Hero (portadas).
  - **Nosotros**: Textos cabecera + items (pilares/complementarios).
  - **Especialidades**: Cabecera + tarjetas (CRUD completo).
  - **Equipo**: Profesionales (CRUD + foto + especialidades + horarios).
  - **Recursos**: Artículos (CRUD + galería imágenes + fecha + autor).
  - **Datos y redes**: WhatsApp, email, teléfono, dirección, mapa, horarios, redes sociales, avatar global.
- **Subida de imágenes**: Directo a Supabase Storage (bucket `public` o `imagenes`) desde el panel.

---

## ♿ Accesibilidad y Rendimiento

- **Fuentes**: `display: swap` + preload automático (`next/font`) → sin flash de texto.
- **Imágenes**: `loading="lazy"` + `decoding="async"` + `sizes` + `fetchPriority="high"` en Hero.
- **Animaciones**: `prefers-reduced-motion: reduce` respetado globalmente (`globals.css:277`).
- **Touch targets**: Mínimo 44px en móvil (`globals.css:232`).
- **No layout shift**: `scroll-margin-top` en secciones (`globals.css:121`).
- **Blur/Backdrop-filter**: Solo en desktop (`@media (hover: hover)`), en móvil fondo sólido → 60fps en scroll.
- **IntersectionObserver** (`Reveal.jsx`) desactivado en táctil (`(hover: none), (pointer: coarse)`).
- **Carruseles**: Throttle con `requestAnimationFrame` (no `setState` por píxel).

---

## 🧩 Convenciones de Código

- **Client Components**: `"use client"` al principio; solo donde hace falta (interactividad, hooks, browser APIs).
- **Server Components**: Por defecto (fetch datos, SEO, render estático).
- **Server Actions**: En `app/actions.js` y `app/admin/actions.js` (validación Zod + Supabase).
- **Tailwind v4**: Variables CSS en `@theme` + `@layer base` + utilidades responsive en `globals.css`.
- **Iconos**: Importar de `lucide-react`; para strings dinámicos usar `lib/iconos.js`.
- **Navegación**: Array único en `lib/navegacion.js` (evita duplicados Navbar/Footer).
- **Tipografías**: Clases `.font-titulo` (Spartan), `.font-texto` (Manrope), `.font-literata` (Literata).

---

## 🐛 Troubleshooting Común

| Problema | Solución |
|----------|----------|
| **Build falla con `EPERM` en `.open-next`** (Windows) | `taskkill /f /im node.exe` → borrar `.open-next` → reintentar |
| **Navbar no marca sección activa** | Verificar `data-navbar-color` en cada `<section>` y `id` coincidente con `links` en `lib/navegacion.js` |
| **Imágenes no cargan en producción** | Revisar bucket Supabase Storage público + CORS + `NEXT_PUBLIC_SUPABASE_URL` correcto |
| **Formulario contacto no envía** | Verificar `TURNSTILE_SECRET_KEY` + `SUPABASE_SERVICE_ROLE_KEY` en Cloudflare Pages env vars |
| **Admin no loguea** | Verificar tabla `admins` en Supabase + middleware `supabaseMiddleware.js` + cookies HttpOnly |
| **Fonts se ven distintas** | `npm run build` regenera CSS de `next/font`; limpiar `.next` si persiste |

---

## 📝 Licencia y Créditos

- **Desarrollo**: Leandro Calfin
- **Diseño/UI**: Referencias de sitios de salud/terapia (estilo limpio, accesible, calido).
- **Fotos/Ilustraciones**: Propias del centro + placeholders temporales.
- **Código**: MIT License (librerías de terceros bajo sus respectivas licencias).

---

## 📞 Contacto Técnico

Para dudas sobre el código, despliegue o Supabase:
- **Email**: leandro.calfin@email.com (reemplazar)
- **WhatsApp**: +54 9 298 4xx-xxxx

---

> **Última actualización**: Octubre 2026 — Next.js 16.4 / React 19 / Cloudflare Workers / Supabase