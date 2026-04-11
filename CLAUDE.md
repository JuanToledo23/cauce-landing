# CLAUDE.md — Cauce Landing

Contexto para Claude Code. Leer completo antes de cualquier tarea.

---

## Qué es este proyecto

Landing page de generación de leads para **Cauce**, consultora boutique mexicana de producto digital y marca. Framework: **Astro 5**. Sin React, sin Next.js, sin frameworks de UI. Tailwind CSS 4. Deploy en Vercel.

**Un solo objetivo de la landing:** que el visitante solicite la Auditoría Express Gratuita llenando el formulario de 3 campos o por WhatsApp.

---

## Stack exacto

| Tecnología | Versión | Notas |
|-----------|---------|-------|
| Astro | 5.x | `.astro` files, frontmatter, NO JSX, NO React hooks |
| Tailwind CSS | 4.x | Vite plugin (`@tailwindcss/vite`), NO `tailwind.config.js` |
| Fontsource | latest | npm, NO Google Fonts directo |
| Resend | latest | form backend + notificaciones |
| Posthog | latest | analytics + A/B feature flags |
| GA4 | — | analytics de validación cruzada |
| Vercel | latest | adapter `@astrojs/vercel/serverless`, output: `hybrid` |

---

## Estructura de archivos

```
cauce-landing/
├── src/
│   ├── layouts/
│   │   └── Base.astro          ← head, meta, OG, analytics init, A/B cookie
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Hero.astro          ← A/B swappable via evento ab:ready
│   │   ├── Problema.astro
│   │   ├── Metodologia.astro
│   │   ├── Servicios.astro
│   │   ├── PruebaSocial.astro
│   │   ├── CTAPrincipal.astro  ← formulario con estados idle/loading/success/error
│   │   ├── Footer.astro
│   │   └── ui/
│   │       ├── Button.astro
│   │       └── Input.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── privacidad.astro
│   │   └── api/
│   │       ├── contact.ts      ← Promise.allSettled, NO await secuencial
│   │       └── whatsapp.ts     ← redirect a wa.me con tracking
│   ├── data/
│   │   ├── ab-variants.ts      ← heroVariants: Record<'A'|'B'|'C', {...}>
│   │   ├── casos.ts            ← CasoEstudio interface + array vacío
│   │   └── ticker.ts           ← string[] mínimo 12 ítems
│   ├── utils/
│   │   └── analytics.ts        ← trackEvent() + initScrollDepth()
│   ├── emails/
│   │   └── notification.ts     ← HTML template del email al equipo
│   └── styles/
│       └── global.css          ← @theme tokens + .type-* utilities + fallbacks
├── public/
│   ├── logo/
│   │   ├── cauce-ink.svg       ← wordmark tinta sobre papel
│   │   └── cauce-paper.svg     ← wordmark papel sobre tinta (footer)
│   ├── favicon.svg
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   ├── og-image.png            ← 1200×630px
│   └── robots.txt
├── .github/
│   └── PULL_REQUEST_TEMPLATE.md
├── astro.config.mjs
├── vercel.json
├── .env.example
└── CLAUDE.md                   ← este archivo
```

---

## Variables de entorno

```bash
# Servidor únicamente (sin prefijo PUBLIC_)
RESEND_API_KEY=                 # re_xxxx — de resend.com → API Keys
RESEND_AUDIENCE_ID=             # 13728ad9-34c9-45eb-b8d6-3b8b74144f1c
CAUCE_EMAIL_CONTACT=            # hola@cauce.mx
WHATSAPP_NUMBER=                # 521XXXXXXXXXX (código país + 1 + 10 dígitos)

# Cliente (prefijo PUBLIC_ = accesible en browser)
PUBLIC_POSTHOG_KEY=             # phc_xxxx — de posthog.com → Settings → API Key
PUBLIC_GA4_MEASUREMENT_ID=      # G-K3TKP09Q1T
PUBLIC_AB_TEST_ENABLED=true
```

---

## Restricciones críticas — NO negociables

### Tipografía
- SOLO dos familias: `Fraunces Variable` (display/headings) e `Instrument Sans Variable` (body/UI)
- Usar siempre clases `.type-*` de `global.css`, no utilities de Tailwind para tipografía
- `font-variation-settings: "WONK" 1` en `type-display` y `type-h1`
- `font-variation-settings: "WONK" 0` en `type-h2` y wordmark
- NUNCA `font-family: Inter` en ninguna regla CSS → AP-03

### Botones e inputs
- `rounded-none` SIEMPRE en `<Button>` e `<Input>` — NUNCA `rounded-*` → AP-11
- Botón CTA primario: `bg-accent text-paper h-14 w-full` en mobile

### Color
- `--color-accent` (#BF5B2E) SOLO en CTAs, focus-ring, estados interactivos
- NUNCA `--color-accent` en fondos de sección → AP-01
- Solo tres fondos permitidos: `--color-paper` (base), `--color-mist` (sección CTA), `--color-ink` (footer)
- NUNCA gradientes decorativos → AP-01

### JavaScript / framework
- NUNCA instalar React, `@astrojs/react`, Vue, Svelte o cualquier framework de UI
- NUNCA `import { useState }` ni ningún hook
- Interactividad: vanilla JS en `<script>` tags dentro de archivos `.astro`
- NUNCA `loading="lazy"` en elementos above-the-fold (hero) → degrada LCP

### Form endpoint `/api/contact.ts`
- SIEMPRE `Promise.allSettled` para las dos llamadas a Resend — NUNCA `await` secuencial
- Si email de notificación falla → retornar 500 (el equipo no se entera)
- Si solo Audience falla → retornar 200 (lead recuperable del email)
- Logging independiente con `console.error` por operación fallida

### Fuentes en producción
- Importar fuentes con `import '@fontsource-variable/fraunces/wght-italic.css'` en el layout
- NUNCA `<link rel="preload" href="/node_modules/...">` hardcodeado → produce 404 en producción
- Vite procesa los imports de Fontsource automáticamente con hash de contenido

---

## Tokens de color (usar nombres, no hex)

```
bg-ink / text-ink         → #0C0B09  (casi-negro cálido)
bg-paper / text-paper     → #F6F3EE  (blanco cálido, fondo base)
bg-mist / text-mist       → #E4E0D8  (gris cálido claro)
text-stone                → #8C8880  (gris cálido medio, texto secundario)
bg-accent / text-accent   → #BF5B2E  (terracota, SOLO CTAs)
bg-accent-dark            → #9E4621  (terracota hover)
text-error                → #C0392B
text-success              → #2E6B4F
```

---

## Clases tipográficas (definidas en global.css)

| Clase | Familia | Uso |
|-------|---------|-----|
| `.type-display` | Fraunces 700 italic WONK=1 | Hero statement principal |
| `.type-h1` | Fraunces 600 italic WONK=1 | CTA section headline |
| `.type-h2` | Fraunces 500 roman WONK=0 | Section headlines |
| `.type-h3` | Instrument Sans 600 | Step titles, card titles |
| `.type-body` | Instrument Sans 400 16px | Body copy |
| `.type-body-lg` | Instrument Sans 400 18px | Sub-statements, intros |
| `.type-small` | Instrument Sans 400 14px | Secondary copy, links |
| `.type-label` | Instrument Sans 600 12px uppercase | Labels, nav items |
| `.type-cta` | Instrument Sans 600 15px | Texto de botones |
| `.type-caption` | Instrument Sans 400 13px | Fine print, errores |
| `.wordmark` | Fraunces 500 italic WONK=0 | Logo "cauce" |
| `.wordmark-inverse` | igual + color paper | Logo en footer |

---

## Breakpoints

| Token | Valor | Descripción |
|-------|-------|-------------|
| `sm` | 640px | — |
| `md` | 768px | tablet — escala tipográfica interpolada con clamp() |
| `lg` | 1024px | desktop — escala tipográfica desktop completa |
| `xl` | 1280px | max content width |

---

## Sistema A/B

- Feature Flag en Posthog: `hero-ab-test`
- Variantes: `A` (34%), `B` (33%), `C` (33%) — Match by: **Device**
- Cookie de primera parte: `cauce_ab=[A|B|C]` (max-age 30 días)
- Primera visita: espera `onFeatureFlags` → asigna variante → guarda en cookie
- Visitas siguientes: lee cookie → aplica variante síncronamente → sin FOVC
- El `h1#hero-statement` tiene `data-variant` con la variante actual
- Todos los eventos de analytics incluyen `ab_variant` en sus properties

---

## Schema de 6 eventos de analytics

| Evento | Cuándo | Properties clave |
|--------|--------|-----------------|
| `page_view` | Al cargar | `ab_variant`, `utm_source`, `utm_medium`, `utm_campaign` |
| `hero_cta_click` | Click CTA hero | `ab_variant`, `cta_location: "hero"` |
| `form_start` | Primer focus en formulario | `ab_variant`, `first_field` |
| `form_submit` | Submit exitoso (200) | `ab_variant`, `utm_source`, `utm_campaign` |
| `whatsapp_click` | Click en link WhatsApp | `ab_variant`, `cta_location: "hero"\|"cta_section"` |
| `scroll_depth` | Al alcanzar 25/50/75/100% | `depth_percent`, `ab_variant`, `section_reached` |

---

## Anti-patrones activos (AP-01 a AP-19)

El checklist completo está en `.github/PULL_REQUEST_TEMPLATE.md`.
Antes de cualquier merge: 0 ítems fallados. Sin excepciones.

Resumen de los más críticos:
- AP-01: Sin gradientes decorativos en fondos
- AP-02: Sin stock photos (columna derecha hero = `bg-mist` placeholder)
- AP-03: Sin Inter como tipografía
- AP-06: Sin íconos Lucide en componentes de servicios/metodología
- AP-08: Sin elementos que "parezcan agua" (olas, ríos, ondas)
- AP-09: Sin separadores horizontales entre secciones (`<hr>`, `border-top`)
- AP-10: Sin dos CTAs de igual peso en la misma sección
- AP-11: Sin `rounded-*` en Button e Input
- AP-17: Sin oraciones de más de 20 palabras en copy

---

## Wireframe de alturas mobile (iPhone 14, 390px)

```
NAV          56px  sticky
HERO        700px  statement + CTA + tracks signal
PROBLEMA    440px  reconocimiento de dolor (sin CTA)
METODOLOGÍA 540px  3 pasos numerados (sin CTA)
SERVICIOS   760px  2 tarjetas + texto puente (sin CTA sólido en tarjetas)
PRUEBA      440px  credencial + ticker (sin CTA)
CTA FINAL   500px  formulario + confirmación inline
FOOTER      230px  wordmark inverso + email + copyright
─────────────────
TOTAL      ~3666px
```

---

## Criterios de victoria A/B

| Variante | Métrica de victoria | Umbral |
|----------|---------------------|--------|
| A | scroll_depth hasta §Problema | ≥15% más que las otras |
| B | hero_cta_click CTR | ≥20% más, AND form_submit no inferior a A |
| C | form_submit rate | ≥20% más que las otras |
| Default | Variante A | Si no hay datos en 60 días |

---

## Orden de SPECs

```
SPEC-0   Setup inicial (servicios externos + repo)     → COMPLETO
SPEC-001 Base.astro + astro.config.mjs                 → pendiente
SPEC-002 Design system (global.css, Button, Input, data files)
SPEC-003 Secciones (8 componentes + index.astro)
SPEC-004 Formulario + /api/contact.ts + /api/whatsapp.ts
SPEC-005 Performance + analytics + Lighthouse 95+
```

Trabajar de un SPEC a la vez. No iniciar el siguiente hasta que el anterior pase todos sus criterios de aceptación con `npm run build` sin errores.

---

## Señales de alerta — detener y corregir inmediatamente

Si alguna de estas aparece en el código, es una violación del spec:

```
❌ import React from 'react'
❌ import { useState, useEffect } from 'react'
❌ @astrojs/react en astro.config.mjs
❌ rounded-md / rounded-lg / rounded-full en Button o Input
❌ font-family: 'Inter' en cualquier CSS
❌ <link rel="preload" href="/node_modules/...">
❌ href="https://fonts.googleapis.com/..."
❌ await fetch(url1); await fetch(url2);  ← en /api/contact.ts
❌ linear-gradient / radial-gradient en background de sección
❌ loading="lazy" en imagen del hero
❌ <Icon /> de lucide-react en servicios o metodología
```

---

## Comandos útiles

```bash
npm run dev          # servidor local en localhost:4321
npm run build        # build de producción — correr después de cada cambio
npm run preview      # preview del build local
vercel --prod        # deploy manual a producción
```

---

## Contexto de negocio

**ICP:** Fundadora/director de PYME mexicana, 5-100 empleados, accede desde celular, desconfianza activa hacia agencias, evalúa a Cauce en paralelo con 1-2 opciones más.

**Embudo:** Auditoría Express Gratuita (gratis, 48h) → Quick-Win $8-12K → Sprint $20-30K → MVP $60-120K → Integral $180-350K MXN.

**Voz:** primera persona plural activa ("investigamos", "construimos"). NUNCA tercera persona ni voz pasiva. Nivel de lectura 5to-7mo grado.

**Metáfora Cauce:** se evoca, no se ilustra. Sin olas, ríos, agua, ondas. La dirección visual del layout ES la metáfora.