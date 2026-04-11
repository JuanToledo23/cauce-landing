# PRD — Landing Page CAUCE v1.0

> **Basado en:** PDD v1.0 aprobado + correcciones de auditoría (15 hallazgos, 6 medios resueltos aquí)
> **Propósito:** Traducir las decisiones del PDD a componentes, props, estados, breakpoints y criterios de aceptación ejecutables. Un desarrollador puede leer este documento sin el PDD y saber exactamente qué construir.
> **Siguiente paso:** SPEC-0 (setup) → SPEC-001 a SPEC-005 (implementación)

---

## CORRECCIONES DE AUDITORÍA APLICADAS EN ESTE PRD

| Hallazgo | Sección PDD | Corrección aplicada |
|----------|-------------|---------------------|
| H01 | §8.8 | Assets 🔴 son 13, no 11 — corregido en §PRD-9 |
| H02 | §7.3 | Endpoint usa `Promise.all` con error logging independiente |
| H03 | §7.2 | Font preload resuelto vía `import` estático de Astro, no path hardcoded |
| H04 | §3.5/§4.5 | Copy "Desde $8,000 MXN" bajo Track A acompañado de aclaración de nivel |
| H05 | §3.8/§7.9 | Aviso de privacidad añadido como ASSET-Q05 🔴 y TODO-03 |
| H06 | §7.1 | Justificación Astro usa argumento del bundle estructural como primario |
| H07 | §4.5 | Dolor 3 reescrito a ≤16 palabras por oración |
| H09 | §3.1 | Nav "Casos" renombrado a "El equipo" en bootstrap mode |
| H10 | §4.4 | A/B FOVC manejado con cookie de primera parte |
| H12 | Pre-spec | `pageview` unificado como `page_view` en DoS y §7.5 |
| H04 (Var B) | §4.4 | Variante B ajustada: "Menos promesas. Más resultado." |

---

## SECCIÓN PRD-1 — Base.astro

Archivo: `src/layouts/Base.astro`

### Props

```typescript
interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
  abVariant?: 'A' | 'B' | 'C';
}

const {
  title = 'Cauce — Consultora de Producto Digital y Marca',
  description = 'Investigamos el problema real. Construimos lo que funciona. Estrategia, diseño y desarrollo para PYMES mexicanas.',
  ogImage = '/og-image.png',
  abVariant = 'A',
} = Astro.props;
```

### Head completo

```astro
---
// Importar fuentes via Fontsource — Astro las procesa a través de Vite
// y genera las URLs correctas con hash de contenido en producción.
// NO hardcodear paths de /node_modules — usar import estático.
import '@fontsource-variable/fraunces/wght-italic.css';
import '@fontsource-variable/instrument-sans/wght.css';
---

<html lang="es-MX">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#F6F3EE" />

  <!-- SEO -->
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={new URL(Astro.url.pathname, Astro.site)} />

  <!-- Open Graph -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={new URL(ogImage, Astro.site)} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="es_MX" />

  <!-- Twitter/X Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={new URL(ogImage, Astro.site)} />

  <!-- Favicons -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

  <!-- Sitemap -->
  <link rel="sitemap" href="/sitemap-index.xml" />

  <!-- Analytics — carga async, no bloquea render -->
  <script
    is:inline
    define:vars={{ phKey: import.meta.env.PUBLIC_POSTHOG_KEY, ga4Id: import.meta.env.PUBLIC_GA4_MEASUREMENT_ID, abVariant }}
  >
    // Posthog — init con cookie de primera parte para A/B persistente
    !function(t,e){/* posthog snippet v1.87+ */}(window,'posthog');
    posthog.init(phKey, {
      api_host: 'https://app.posthog.com',
      capture_pageview: false, // pageview manual para incluir ab_variant
      persistence: 'cookie',
    });

    // Leer o asignar variante A/B
    // Cookie de primera parte previene FOVC en visitas subsiguientes
    let variant = document.cookie.match(/cauce_ab=([ABC])/)?.[1];
    if (!variant) {
      posthog.onFeatureFlags(function() {
        variant = posthog.getFeatureFlag('hero-ab-test') || 'A';
        document.cookie = `cauce_ab=${variant};max-age=2592000;path=/;samesite=lax`;
        document.dispatchEvent(new CustomEvent('ab:ready', { detail: { variant } }));
      });
    } else {
      // Variante ya conocida — aplicar sin esperar a Posthog
      document.dispatchEvent(new CustomEvent('ab:ready', { detail: { variant } }));
    }

    // GA4
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', ga4Id, { send_page_view: false });

    // page_view manual con ab_variant
    const utmSource = new URLSearchParams(window.location.search).get('utm_source') || '';
    const utmMedium = new URLSearchParams(window.location.search).get('utm_medium') || '';
    const utmCampaign = new URLSearchParams(window.location.search).get('utm_campaign') || '';
    posthog.capture('page_view', { ab_variant: variant || 'A', utm_source: utmSource, utm_medium: utmMedium, utm_campaign: utmCampaign });
    gtag('event', 'page_view', { ab_variant: variant || 'A', utm_source: utmSource, utm_medium: utmMedium, utm_campaign: utmCampaign });
  </script>
  <script async src={`https://www.googletagmanager.com/gtag/js?id=${import.meta.env.PUBLIC_GA4_MEASUREMENT_ID}`}></script>
</head>
<body class="bg-paper text-ink font-body antialiased">
  <slot />
</body>
</html>
```

### Notas de implementación

- `@fontsource-variable/fraunces/wght-italic.css` importa el archivo CSS de Fontsource que contiene el `@font-face` con la URL correcta. Vite procesa ese CSS y hash-ea el WOFF2 automáticamente — el preload ocurre porque el browser parsea el `@font-face` y pre-carga las fuentes declaradas con `font-display: swap`.
- El snippet de Posthog usa la cookie `cauce_ab` para persistir la variante. Primera visita: espera a `onFeatureFlags`. Visitas subsiguientes: aplica la variante de la cookie sin esperar.
- **Criterio de aceptación:** Ningún `<link rel="preload">` hardcodeado con path de `/node_modules`. Las fuentes cargan sin 404 en producción. El `document.cookie` contiene `cauce_ab=[A|B|C]` después de la primera visita.

---

## SECCIÓN PRD-2 — global.css (Design System Tokens)

Archivo: `src/styles/global.css`

```css
/* ============================================================
   CAUCE — Design System Tokens
   Fuente de verdad: PDD §2a, §2b, §2c
   ============================================================ */

@import '@fontsource-variable/fraunces/wght-italic.css';
@import '@fontsource-variable/instrument-sans/wght.css';
@import 'tailwindcss';

@theme {
  /* Tipografía */
  --font-display: 'Fraunces Variable', Georgia, 'Fraunces Fallback', serif;
  --font-body: 'Instrument Sans Variable', system-ui, 'Instrument Fallback', sans-serif;

  /* Paleta */
  --color-ink:          #0C0B09;
  --color-paper:        #F6F3EE;
  --color-mist:         #E4E0D8;
  --color-stone:        #8C8880;
  --color-accent:       #BF5B2E;
  --color-accent-dark:  #9E4621;

  /* Estados semánticos */
  --color-error:        #C0392B;
  --color-success:      #2E6B4F;
  --color-focus-ring:   #BF5B2E;
  --color-disabled:     #C8C4BB;
  --color-overlay:      rgba(12, 11, 9, 0.72);

  /* Breakpoints */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}

/* ============================================================
   FONT FALLBACKS — calibrar con fontpie antes de producción:
   npx fontpie ./node_modules/@fontsource-variable/fraunces/files/fraunces-latin-wght-italic.woff2 Georgia
   npx fontpie ./node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2 system-ui
   Los valores siguientes son ESTIMADOS — reemplazar con los valores
   de fontpie para CLS < 0.05.
   ============================================================ */
@font-face {
  font-family: 'Fraunces Fallback';
  src: local('Georgia');
  size-adjust: 94%;
  ascent-override: 95%;
  descent-override: 20%;
  font-display: swap;
}

@font-face {
  font-family: 'Instrument Fallback';
  src: local('system-ui');
  size-adjust: 100%;
  ascent-override: 96%;
  descent-override: 22%;
  font-display: swap;
}

/* ============================================================
   UTILIDADES TIPOGRÁFICAS
   Uso: class="type-display" en lugar de clases individuales.
   ============================================================ */
.type-display {
  font-family: var(--font-display);
  font-weight: 700;
  font-style: italic;
  font-variation-settings: "WONK" 1;
  font-size: 44px;
  line-height: 1.0;
  letter-spacing: -0.03em;
}

.type-h1 {
  font-family: var(--font-display);
  font-weight: 600;
  font-style: italic;
  font-variation-settings: "WONK" 1;
  font-size: 34px;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.type-h2 {
  font-family: var(--font-display);
  font-weight: 500;
  font-style: normal;
  font-variation-settings: "WONK" 0;
  font-size: 26px;
  line-height: 1.15;
  letter-spacing: -0.01em;
}

.type-h3 {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 20px;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.type-body { font-family: var(--font-body); font-weight: 400; font-size: 16px; line-height: 1.65; }
.type-body-lg { font-family: var(--font-body); font-weight: 400; font-size: 18px; line-height: 1.65; }
.type-small { font-family: var(--font-body); font-weight: 400; font-size: 14px; line-height: 1.55; }
.type-label { font-family: var(--font-body); font-weight: 600; font-size: 12px; line-height: 1.4; letter-spacing: 0.06em; text-transform: uppercase; }
.type-cta { font-family: var(--font-body); font-weight: 600; font-size: 15px; line-height: 1.3; letter-spacing: 0.01em; }
.type-caption { font-family: var(--font-body); font-weight: 400; font-size: 13px; line-height: 1.5; letter-spacing: 0.01em; }

/* Desktop overrides — aplican en lg (≥1024px) */
@media (min-width: 1024px) {
  .type-display { font-size: 88px; }
  .type-h1 { font-size: 56px; }
  .type-h2 { font-size: 40px; }
  .type-h3 { font-size: 26px; }
}

/* Tablet intermedio (768px–1023px): escala interpolada para evitar H08 */
@media (min-width: 768px) and (max-width: 1023px) {
  .type-display { font-size: clamp(44px, 7vw, 72px); }
  .type-h1 { font-size: clamp(34px, 5vw, 48px); }
  .type-h2 { font-size: clamp(26px, 4vw, 36px); }
}

/* ============================================================
   WORDMARK
   ============================================================ */
.wordmark {
  font-family: var(--font-display);
  font-weight: 500;
  font-style: italic;
  font-variation-settings: "WONK" 0;
  font-size: 20px;
  letter-spacing: -0.02em;
  color: var(--color-ink);
}

.wordmark-inverse {
  color: var(--color-paper);
}

/* ============================================================
   PROOF TICKER
   CSS-only marquee. Sin JavaScript.
   ============================================================ */
@keyframes ticker-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.ticker-track {
  display: flex;
  width: max-content;
  animation: ticker-scroll 30s linear infinite;
}

.ticker-track:hover { animation-play-state: paused; }
```

**Criterio de aceptación:** `npx tailwindcss build` sin warnings. Todos los tokens `--color-*` y `--font-*` resolvibles en cualquier componente. Clases `.type-*` aplicables sin especificidad conflictiva con Tailwind utilities.

---

## SECCIÓN PRD-3 — Componentes Primitivos

### Button.astro

Archivo: `src/components/ui/Button.astro`

```astro
---
interface Props {
  variant?: 'primary' | 'text';
  type?: 'button' | 'submit';
  href?: string;
  class?: string;
  id?: string;
}

const { variant = 'primary', type = 'button', href, class: className = '', id } = Astro.props;
---

{href ? (
  <a
    href={href}
    id={id}
    class:list={[
      'type-cta inline-flex items-center justify-center rounded-none transition-colors',
      variant === 'primary' && 'bg-accent text-paper px-8 h-14 w-full hover:bg-accent-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
      variant === 'text' && 'text-stone underline-offset-2 hover:text-ink',
      className
    ]}
  >
    <slot />
  </a>
) : (
  <button
    type={type}
    id={id}
    class:list={[
      'type-cta inline-flex items-center justify-center rounded-none transition-colors',
      variant === 'primary' && 'bg-accent text-paper px-8 h-14 w-full hover:bg-accent-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:bg-disabled disabled:cursor-not-allowed',
      variant === 'text' && 'text-stone hover:text-ink',
      className
    ]}
  >
    <slot />
  </button>
)}
```

**Reglas:** `rounded-none` siempre. Jamás `rounded-*`. AP-11.

### Input.astro

Archivo: `src/components/ui/Input.astro`

```astro
---
interface Props {
  name: string;
  type?: 'text' | 'email';
  placeholder?: string;
  label: string;
  required?: boolean;
  errorMessage?: string;
  id?: string;
}

const { name, type = 'text', placeholder, label, required = false, errorMessage, id } = Astro.props;
const inputId = id || `field-${name}`;
---

<div class="flex flex-col gap-1">
  <label for={inputId} class="type-label text-stone">{label}</label>
  <input
    id={inputId}
    name={name}
    type={type}
    placeholder={placeholder}
    required={required}
    autocomplete={type === 'email' ? 'email' : name === 'nombre' ? 'name' : 'organization'}
    class="h-14 bg-paper border border-stone rounded-none px-4 type-body text-ink
           placeholder:text-stone
           focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink
           aria-[invalid=true]:border-error"
    aria-describedby={errorMessage ? `${inputId}-error` : undefined}
  />
  {errorMessage && (
    <p id={`${inputId}-error`} class="type-caption text-error" role="alert">{errorMessage}</p>
  )}
</div>
```

---

## SECCIÓN PRD-4 — Componentes de Página

### Nav.astro

Archivo: `src/components/Nav.astro`

**Props:** ninguna.

**Mobile (< 1024px):**
```
sticky top-0 z-50
bg-paper border-b border-mist
height: 56px
padding: 0 20px (px-5)
layout: flex justify-between items-center

LEFT: wordmark "cauce" (.wordmark)
RIGHT: <a href="#auditoria"> "Auditoría gratis →" (type-label, text-accent)
```

**Desktop (≥ 1024px):**
```
padding: 0 64px (px-16)
layout: flex justify-between items-center

LEFT: wordmark "cauce"
CENTER: flex gap-8
  - <a href="#como-trabajamos"> "Cómo trabajamos" (type-small, text-stone, hover:text-ink)
  - <a href="#servicios"> "Servicios" (type-small, text-stone, hover:text-ink)
  - <a href="#el-equipo"> "El equipo" (type-small, text-stone, hover:text-ink)
RIGHT: <Button variant="primary" href="#auditoria" class="w-auto h-10 px-5 text-sm">
         Auditoría gratis →
       </Button>
```

**Criterio de aceptación:** Nav no oculta contenido al hacer scroll. El sticky funciona en iOS Safari (position: sticky en `<nav>` directo, no en wrapper). Sin sombra — solo `border-b border-mist`.

---

### Hero.astro

Archivo: `src/components/Hero.astro`

**Props:**
```typescript
interface Props {
  abVariant: 'A' | 'B' | 'C';
}
```

**Estados del componente:** el A/B se controla desde el cliente vía evento `ab:ready`. El HTML inicial renderiza Variante A (default). Si la cookie indica otra variante, el script del cliente actualiza el DOM antes de que el usuario lo vea (el evento se dispara sincrónicamente desde cookie).

**Estructura HTML:**

```astro
---
const { abVariant } = Astro.props;
import { heroVariants } from '../data/ab-variants';
const defaultVariant = heroVariants[abVariant] || heroVariants['A'];
---

<section id="hero" class="pt-16 pb-16 px-5 lg:px-16">
  <!-- Mobile: columna única. Desktop: 7/12 + 5/12 -->
  <div class="max-w-screen-xl mx-auto lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">

    <!-- Columna de texto (col-span-7 desktop) -->
    <div class="lg:col-span-7">

      <!-- Statement principal — A/B swappable -->
      <h1
        id="hero-statement"
        class="type-display text-ink max-w-[340px] lg:max-w-none"
        data-variant={abVariant}
      >
        {defaultVariant.statement.map(line => <span class="block">{line}</span>)}
      </h1>

      <p
        id="hero-sub"
        class="type-body-lg text-stone mt-6 max-w-[340px] lg:max-w-[520px]"
      >
        {defaultVariant.subStatement}
      </p>

      <!-- CTAs -->
      <div class="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center">
        <Button
          variant="primary"
          href="#auditoria"
          id="hero-cta"
          class="lg:w-auto lg:px-8"
        >
          Quiero mi auditoría →
        </Button>
        <a
          href="/whatsapp?from=hero"
          id="hero-whatsapp"
          class="type-small text-stone text-center hover:text-ink transition-colors lg:text-left"
          target="_blank"
          rel="noopener"
        >
          o escríbenos por WhatsApp →
        </a>
      </div>

      <!-- Señal de tracks -->
      <div class="mt-8 type-label text-stone flex flex-wrap gap-x-4 gap-y-1">
        <span>▸ Producto digital</span>
        <span>▸ Marca y presencia digital</span>
        <span>9+ años · CDMX · Dos tracks</span>
      </div>

    </div>

    <!-- Columna imagen — desktop únicamente -->
    <div
      class="hidden lg:block lg:col-span-5 aspect-[4/3] bg-mist"
      aria-hidden="true"
    >
      <!-- placeholder hasta ASSET-I01 (primer caso de estudio) -->
    </div>

  </div>
</section>

<!-- Script de A/B swap — se ejecuta al recibir ab:ready -->
<script>
  import { heroVariants } from '../data/ab-variants';
  import { trackEvent } from '../utils/analytics';

  document.addEventListener('ab:ready', (e: CustomEvent) => {
    const variant = e.detail.variant as 'A' | 'B' | 'C';
    const data = heroVariants[variant];
    if (!data) return;

    // Swap statement
    const el = document.getElementById('hero-statement');
    if (el) {
      el.innerHTML = data.statement.map(l => `<span class="block">${l}</span>`).join('');
      el.dataset.variant = variant;
    }

    // Swap sub-statement
    const sub = document.getElementById('hero-sub');
    if (sub) sub.textContent = data.subStatement;
  });

  // Tracking CTA click con variante actual
  document.getElementById('hero-cta')?.addEventListener('click', () => {
    const variant = document.getElementById('hero-statement')?.dataset.variant || 'A';
    trackEvent('hero_cta_click', { ab_variant: variant, cta_location: 'hero' });
  });

  document.getElementById('hero-whatsapp')?.addEventListener('click', () => {
    const variant = document.getElementById('hero-statement')?.dataset.variant || 'A';
    trackEvent('whatsapp_click', { ab_variant: variant, cta_location: 'hero' });
  });
</script>
```

**Criterio de aceptación:**
- En primera visita sin cookie: el hero muestra Variante A mientras Posthog carga. Cuando `onFeatureFlags` resuelve, el texto se actualiza (puede haber swap visible de < 300ms — aceptado).
- En visitas subsiguientes con cookie: el swap ocurre antes de que el usuario vea contenido (el evento `ab:ready` se dispara síncronamente desde cookie antes del primer paint).
- El atributo `data-variant` del `h1` refleja la variante real en el momento del `hero_cta_click`.

---

### Problema.astro

Archivo: `src/components/Problema.astro`

**Props:** ninguna.

```astro
<section id="problema" class="pt-16 pb-16 px-5 lg:px-16">
  <div class="max-w-screen-xl mx-auto lg:grid lg:grid-cols-12 lg:gap-8">

    <!-- Columna izquierda (col-span-6) -->
    <div class="lg:col-span-6">
      <p class="type-label text-stone mb-8">¿TE SUENA FAMILIAR?</p>
      <h2 class="type-h2 text-ink">
        Contrataste ayuda.<br>
        Te entregaron algo que nadie usa.
      </h2>
      <p class="type-body-lg text-stone mt-8">
        Tres señales de que el problema no era de ejecución. Era de diagnóstico.
      </p>
    </div>

    <!-- Columna derecha (col-span-6): dolores -->
    <div class="mt-8 lg:mt-0 lg:col-span-6 flex flex-col gap-6">
      <p class="type-body text-ink">
        — Construiste antes de entender qué necesitaba tu cliente.<br>
        <span class="text-stone">El producto existe. Nadie lo usa como esperabas.</span>
      </p>
      <p class="type-body text-ink">
        — Tienes presencia digital: sitio, redes, quizás un logo.<br>
        <span class="text-stone">Pero no llegan clientes por ahí.</span>
      </p>
      <p class="type-body text-ink">
        <!-- H07: reescrito a ≤16 palabras por oración -->
        — No sabes qué sigue: ¿arreglarlo, rediseñar, o empezar de cero?<br>
        <span class="text-stone">Y contratar a alguien más tampoco te da claridad.</span>
      </p>
    </div>

  </div>
</section>
```

**Criterio de aceptación:** Sin CTA en esta sección. Los dolores usan em dash, no íconos. AP-06 no violado.

---

### Metodologia.astro

Archivo: `src/components/Metodologia.astro`

```astro
<section id="como-trabajamos" class="pt-16 pb-16 px-5 lg:px-16">
  <div class="max-w-screen-xl mx-auto">

    <p class="type-label text-stone mb-8">CÓMO TRABAJAMOS</p>

    <!-- Mobile: headline visible. Desktop: oculto (los 3 pasos en columnas hablan solos) -->
    <h2 class="type-h2 text-ink mb-12 lg:hidden">
      Tres pasos. En ese orden. Sin saltarse ninguno.
    </h2>

    <div class="flex flex-col gap-12 lg:grid lg:grid-cols-3 lg:gap-8">
      {[
        {
          num: '01',
          title: 'Research primero',
          body: 'Antes de diseñar o construir, entendemos el problema real. Entrevistas, análisis de métricas, benchmarking. Así sabemos qué vale la pena resolver — y qué no.'
        },
        {
          num: '02',
          title: 'Especificación',
          body: 'Antes de escribir una línea de código o diseño, todo está documentado. Qué se construye, cómo se evalúa, qué queda fuera. Sin sorpresas a la mitad del proyecto.'
        },
        {
          num: '03',
          title: 'Construcción acelerada',
          body: 'Ejecutamos con un equipo completo. Metodología que reduce los tiempos sin reducir la calidad. Cada avance es visible y testeable. En semanas, no en trimestres.'
        },
      ].map(paso => (
        <div>
          <span class="type-display text-mist block" aria-hidden="true">{paso.num}</span>
          <h3 class="type-h3 text-ink mt-2">{paso.title}</h3>
          <p class="type-body text-stone mt-3 max-w-[320px] lg:max-w-none">{paso.body}</p>
        </div>
      ))}
    </div>

  </div>
</section>
```

**Criterio de aceptación:** Los números `01/02/03` usan `--color-mist` (no `--color-ink`). Sin íconos. Sin separadores horizontales entre pasos. AP-06, AP-09 no violados.

---

### Servicios.astro

Archivo: `src/components/Servicios.astro`

```astro
<section id="servicios" class="pt-16 pb-16 px-5 lg:px-16">
  <div class="max-w-screen-xl mx-auto">

    <p class="type-label text-stone mb-8">LO QUE CONSTRUIMOS</p>

    <div class="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-8">

      <!-- Track A -->
      <div class="border border-mist p-6 rounded-none">
        <p class="type-label text-accent mb-4">TRACK A</p>
        <h2 class="type-h2 text-ink">Producto Digital</h2>
        <p class="type-body text-stone mt-3">
          Para negocios que necesitan software que funcione — y que escale cuando el negocio crezca.
        </p>
        <ul class="mt-4 flex flex-col gap-2">
          <li class="type-body text-ink">— MVPs funcionales en 4 a 6 semanas</li>
          <li class="type-body text-ink">— Diagnóstico y rediseño de productos existentes</li>
          <li class="type-body text-ink">— Integraciones, automatizaciones y plataformas internas</li>
        </ul>
        <!-- H04: aclaración de nivel para evitar anchor de precio incorrecto -->
        <p class="type-small text-stone mt-4">
          Desde $8,000 MXN · <span class="text-stone/70">el alcance define el nivel</span>
        </p>
      </div>

      <!-- Track B -->
      <div class="border border-mist p-6 rounded-none">
        <p class="type-label text-accent mb-4">TRACK B</p>
        <h2 class="type-h2 text-ink">Marca y Presencia Digital</h2>
        <p class="type-body text-stone mt-3">
          Para negocios que necesitan ser encontrados, recordados — y elegidos por encima de la competencia.
        </p>
        <ul class="mt-4 flex flex-col gap-2">
          <li class="type-body text-ink">— Identidad de marca completa desde cero</li>
          <li class="type-body text-ink">— Sitio web profesional que convierte visitas en clientes</li>
          <li class="type-body text-ink">— Estrategia digital de arranque con métricas desde el día uno</li>
        </ul>
        <p class="type-small text-stone mt-4">
          Desde $8,000 MXN · <span class="text-stone/70">el alcance define el nivel</span>
        </p>
      </div>

    </div>

    <!-- Texto puente -->
    <div class="mt-10 max-w-[560px]">
      <p class="type-body-lg text-stone">
        ¿No sabes en cuál de los dos encaja tu proyecto?
      </p>
      <p class="type-body-lg text-stone">
        La auditoría express lo define. Es gratuita.
      </p>
    </div>

  </div>
</section>
```

**Criterio de aceptación:** Sin íconos en cards. Sin CTA sólido dentro de las tarjetas. AP-06, AP-10, AP-19 no violados. Las cards tienen `rounded-none`. El precio aparece con la aclaración de nivel.

---

### PruebaSocial.astro

Archivo: `src/components/PruebaSocial.astro`

```astro
---
import { casos } from '../data/casos';
import { tickerItems } from '../data/ticker';
const casosPublicados = casos.filter(c => c.publicado);
---

<section id="el-equipo" class="pt-16 pb-16 px-5 lg:px-16">
  <div class="max-w-screen-xl mx-auto">

    <p class="type-label text-stone mb-8">EL EQUIPO</p>

    <div class="lg:grid lg:grid-cols-12 lg:gap-8">

      <!-- Col izquierda (col-span-5) -->
      <div class="lg:col-span-5">
        <h2 class="type-h2 text-ink max-w-[340px] lg:max-w-none">
          9 años construyendo productos digitales y marcas en México.
        </h2>

        <p class="type-caption text-stone mt-6">CDMX · México · Desde 2016</p>
      </div>

      <!-- Col derecha (col-span-7) -->
      <div class="mt-8 lg:mt-0 lg:col-span-7">

        <!-- Bootstrap: credencial de trayectoria -->
        {casosPublicados.length === 0 && (
          <blockquote class="type-body text-ink">
            <p>"Construimos Wapi, una plataforma de agentes de IA para WhatsApp Business, actualmente con pilotos activos con negocios en México."</p>
            <footer class="type-small text-stone mt-3">— Equipo Cauce</footer>
          </blockquote>
        )}

        <!-- Estado futuro: casos reales -->
        {casosPublicados.map(caso => caso.testimonio && (
          <blockquote class="type-body text-ink mb-6">
            <p>"{caso.testimonio.texto}"</p>
            <footer class="type-small text-stone mt-3">
              — {caso.testimonio.nombre}, {caso.testimonio.cargo}, {caso.testimonio.empresa}
            </footer>
          </blockquote>
        ))}

      </div>
    </div>

    <!-- Proof ticker — CSS only, sin JS -->
    <div class="mt-12 overflow-hidden" aria-hidden="true">
      <div class="ticker-track">
        {[...tickerItems, ...tickerItems].map(item => (
          <span class="type-label text-stone whitespace-nowrap mr-8">{item} ·</span>
        ))}
      </div>
    </div>

  </div>
</section>
```

**Criterio de aceptación:** Sin logo wall. Ticker CSS-only sin JS. AP-14, AP-16 no violados. `data-section="prueba-social"` en el elemento raíz para IntersectionObserver de scroll_depth.

---

### CTAPrincipal.astro

Archivo: `src/components/CTAPrincipal.astro`

**Estados del formulario:** `idle | loading | success | error`

```astro
---
// No props — el formulario es único en la landing
---

<section
  id="auditoria"
  class="bg-mist pt-16 pb-16 px-5 lg:px-16"
  data-section="cta"
>
  <div class="max-w-screen-xl mx-auto">
    <div class="max-w-[520px] mx-auto">

      <h2 class="type-h1 text-ink">Auditoría Express Gratuita</h2>
      <p class="type-body text-stone mt-4">
        48 horas. Sin compromiso.<br>
        Te decimos qué está roto y qué vale la pena arreglar.
      </p>

      <!-- Formulario — state: idle (inicial) -->
      <form
        id="auditoria-form"
        class="mt-8 flex flex-col gap-4"
        novalidate
        aria-label="Formulario de auditoría express"
      >
        <Input name="nombre" label="Nombre completo" placeholder="Tu nombre" required />
        <Input name="empresa" label="Empresa o proyecto" placeholder="Nombre de tu empresa" required />
        <Input name="correo" type="email" label="Correo electrónico" placeholder="tu@empresa.com" required />

        <Button type="submit" id="form-submit">
          <span id="btn-text">Quiero mi auditoría →</span>
          <span id="btn-loading" class="hidden">Enviando...</span>
        </Button>
      </form>

      <!-- Estado success (hidden por defecto) -->
      <div id="form-success" class="hidden mt-8" role="status" aria-live="polite">
        <p class="type-h3 text-ink">Recibimos tu solicitud.</p>
        <p class="type-body text-stone mt-2">Te escribimos en las próximas 24 horas.</p>
      </div>

      <!-- Estado error (hidden por defecto) -->
      <div id="form-error" class="hidden mt-4" role="alert">
        <p class="type-caption text-error">
          Algo falló al enviar. Escríbenos directamente a
          <a href="mailto:hola@cauce.mx" class="underline">hola@cauce.mx</a>
        </p>
      </div>

      <!-- Alt WhatsApp -->
      <p class="mt-6 text-center">
        <a
          href="/whatsapp?from=cta"
          id="cta-whatsapp"
          class="type-small text-stone hover:text-ink transition-colors"
          target="_blank"
          rel="noopener"
        >
          Prefiero WhatsApp →
        </a>
      </p>

      <!-- Aviso de privacidad — H05 resuelto -->
      <p class="type-caption text-stone mt-4 text-center">
        Al enviar aceptas nuestro
        <a href="/privacidad" class="underline hover:text-ink">Aviso de privacidad</a>.
        Respondemos en menos de 24 horas.
      </p>

    </div>
  </div>
</section>

<script>
  import { trackEvent } from '../utils/analytics';

  const form = document.getElementById('auditoria-form') as HTMLFormElement;
  const submitBtn = document.getElementById('form-submit') as HTMLButtonElement;
  const btnText = document.getElementById('btn-text') as HTMLSpanElement;
  const btnLoading = document.getElementById('btn-loading') as HTMLSpanElement;
  const successEl = document.getElementById('form-success') as HTMLDivElement;
  const errorEl = document.getElementById('form-error') as HTMLDivElement;

  let formStarted = false;
  const abVariant = document.querySelector('[data-variant]')?.getAttribute('data-variant') || 'A';

  // Tracking form_start — primer focus
  form.addEventListener('focusin', () => {
    if (formStarted) return;
    formStarted = true;
    trackEvent('form_start', { ab_variant: abVariant, first_field: (document.activeElement as HTMLInputElement)?.name || '' });
  }, { once: true });

  // Tracking whatsapp_click desde CTA
  document.getElementById('cta-whatsapp')?.addEventListener('click', () => {
    trackEvent('whatsapp_click', { ab_variant: abVariant, cta_location: 'cta_section' });
  });

  // Submit handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validación client-side
    const nombre = (form.elements.namedItem('nombre') as HTMLInputElement).value.trim();
    const empresa = (form.elements.namedItem('empresa') as HTMLInputElement).value.trim();
    const correo = (form.elements.namedItem('correo') as HTMLInputElement).value.trim();

    if (!nombre || !empresa || !correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      // Resaltar campos inválidos con aria-invalid
      if (!nombre) (form.elements.namedItem('nombre') as HTMLInputElement).setAttribute('aria-invalid', 'true');
      if (!empresa) (form.elements.namedItem('empresa') as HTMLInputElement).setAttribute('aria-invalid', 'true');
      if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        (form.elements.namedItem('correo') as HTMLInputElement).setAttribute('aria-invalid', 'true');
      }
      return;
    }

    // Estado loading
    submitBtn.disabled = true;
    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');

    const utmSource = new URLSearchParams(window.location.search).get('utm_source') || '';
    const utmMedium = new URLSearchParams(window.location.search).get('utm_medium') || '';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, empresa, correo, ab_variant: abVariant, utm_source: utmSource, utm_medium: utmMedium }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Éxito
      form.classList.add('hidden');
      successEl.classList.remove('hidden');
      trackEvent('form_submit', { ab_variant: abVariant, utm_source: utmSource, utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign') || '' });

    } catch (err) {
      // Error — mostrar fallback con email directo
      errorEl.classList.remove('hidden');
      submitBtn.disabled = false;
      btnText.classList.remove('hidden');
      btnLoading.classList.add('hidden');
    }
  });
</script>
```

**Criterio de aceptación:** El formulario muestra confirmación inline sin redirect (Definition of Success). Estado de error muestra el email alternativo. El botón submit tiene `rounded-none` (AP-11). No más de 3 campos visibles (AP-10 / DoS). El `aria-invalid` activa el estilo de error del Input component.

---

### Footer.astro

Archivo: `src/components/Footer.astro`

```astro
<footer class="bg-ink pt-12 pb-12 px-5 lg:px-16">
  <div class="max-w-screen-xl mx-auto">
    <div class="flex flex-col gap-6 lg:flex-row lg:justify-between lg:items-end">

      <div class="flex flex-col gap-3">
        <!-- Wordmark inverso -->
        <span class="wordmark wordmark-inverse">cauce</span>

        <a href="mailto:hola@cauce.mx" class="type-body text-paper hover:text-mist transition-colors">
          hola@cauce.mx
        </a>
        <p class="type-small text-stone">Ciudad de México · México</p>
      </div>

      <div class="flex flex-col gap-2 lg:text-right">
        <!-- H09: "El equipo" en lugar de "Casos" en bootstrap -->
        <nav aria-label="Footer" class="flex gap-6 lg:justify-end">
          <a href="#servicios" class="type-small text-stone hover:text-paper transition-colors">Servicios</a>
          <a href="#como-trabajamos" class="type-small text-stone hover:text-paper transition-colors">Cómo trabajamos</a>
          <a href="/privacidad" class="type-small text-stone hover:text-paper transition-colors">Privacidad</a>
        </nav>
        <!-- Sin redes sociales en lanzamiento — AP-15 -->
        <p class="type-caption text-stone">
          © 2026 Cauce · Todos los derechos reservados
        </p>
      </div>

    </div>
  </div>
</footer>
```

---

## SECCIÓN PRD-5 — API Routes

### /api/contact.ts

Archivo: `src/pages/api/contact.ts`

```typescript
import type { APIRoute } from 'astro';

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const RESEND_AUDIENCE_ID = import.meta.env.RESEND_AUDIENCE_ID;
const CAUCE_EMAIL = import.meta.env.CAUCE_EMAIL_CONTACT;

// Validación de email estricta (H02: mejor que solo .includes('@'))
const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, string>;

  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Payload inválido' }), { status: 400 });
  }

  const { nombre, empresa, correo, ab_variant, utm_source, utm_medium } = body;

  if (!nombre?.trim() || !empresa?.trim() || !correo?.trim() || !isValidEmail(correo)) {
    return new Response(JSON.stringify({ error: 'Campos inválidos' }), { status: 400 });
  }

  const timestamp = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });

  // H02: Promise.all con logging independiente por operación
  // Si una falla, la otra sigue ejecutándose.
  // El endpoint retorna 200 si AL MENOS el email de notificación tuvo éxito.
  // Si ambos fallan, retorna 500 para que el cliente muestre el fallback.

  const [audienceResult, emailResult] = await Promise.allSettled([

    // Operación 1: Guardar en Resend Audiences
    fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: correo,
        first_name: nombre,
        unsubscribed: false,
        data: { empresa, ab_variant: ab_variant || 'A', utm_source: utm_source || '', utm_medium: utm_medium || '' },
      }),
    }),

    // Operación 2: Email de notificación al equipo
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Cauce Leads <leads@cauce.mx>',
        to: CAUCE_EMAIL,
        subject: `[Cauce] Nueva auditoría: ${empresa} — ${nombre}`,
        html: `
          <p><strong>Nueva solicitud de auditoría express</strong></p>
          <table>
            <tr><td><strong>Nombre:</strong></td><td>${nombre}</td></tr>
            <tr><td><strong>Empresa:</strong></td><td>${empresa}</td></tr>
            <tr><td><strong>Correo:</strong></td><td><a href="mailto:${correo}">${correo}</a></td></tr>
            <tr><td><strong>Variante A/B:</strong></td><td>${ab_variant || 'A'}</td></tr>
            <tr><td><strong>Origen:</strong></td><td>${utm_source || 'directo'} / ${utm_medium || '—'}</td></tr>
            <tr><td><strong>Recibido:</strong></td><td>${timestamp} (CDMX)</td></tr>
          </table>
        `,
      }),
    }),

  ]);

  // Logging diferenciado para trazabilidad en Vercel Functions logs
  if (audienceResult.status === 'rejected') {
    console.error('[cauce/contact] Resend Audiences falló:', audienceResult.reason);
  }
  if (emailResult.status === 'rejected') {
    console.error('[cauce/contact] Resend Email falló:', emailResult.reason);
  }

  // Si el email de notificación falló, el equipo no se enterará — retornar error
  // para que el cliente muestre el fallback con hola@cauce.mx.
  if (emailResult.status === 'rejected') {
    return new Response(JSON.stringify({ error: 'No se pudo enviar la notificación' }), { status: 500 });
  }

  // Audience puede fallar sin bloquear — el lead se puede recuperar del email
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
```

---

### /api/whatsapp.ts

Archivo: `src/pages/api/whatsapp.ts`

```typescript
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ request }) => {
  const url = new URL(request.url);
  const from = url.searchParams.get('from') || 'unknown';

  const number = import.meta.env.WHATSAPP_NUMBER;
  const message = encodeURIComponent('Hola, quiero solicitar una auditoría express gratuita. Mi empresa es ');
  const waUrl = `https://wa.me/${number}?text=${message}`;

  // GA4 registrará el pageview de /whatsapp como conversión configurable
  // El from queda en los logs de Vercel Functions para trazabilidad
  console.info(`[cauce/whatsapp] redirect desde: ${from}`);

  return Response.redirect(waUrl, 302);
};
```

---

## SECCIÓN PRD-6 — Utilidades y Datos

### src/utils/analytics.ts

```typescript
// H12: nombre unificado como page_view (con guión bajo) — estándar GA4
export function trackEvent(
  name: string,
  properties: Record<string, string | number | boolean> = {}
): void {
  if (typeof window === 'undefined') return;

  if (window.posthog) {
    window.posthog.capture(name, properties);
  }
  if (window.gtag) {
    window.gtag('event', name, properties);
  }
}

// Scroll depth via IntersectionObserver
// Se inicializa una vez en el layout base
export function initScrollDepth(abVariant: string): void {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;

  const depthsFired = new Set<number>();
  const sectionMap: Record<string, string> = {
    'hero': '§hero',
    'problema': '§problema',
    'como-trabajamos': '§metodologia',
    'servicios': '§servicios',
    'el-equipo': '§prueba-social',
    'auditoria': '§cta',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const sectionId = entry.target.id;
      const scrollPct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      const bucket = [25, 50, 75, 100].find(b => scrollPct >= b && !depthsFired.has(b));
      if (bucket) {
        depthsFired.add(bucket);
        trackEvent('scroll_depth', {
          depth_percent: bucket,
          ab_variant: abVariant,
          section_reached: sectionMap[sectionId] || sectionId,
        });
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('section[id]').forEach(el => observer.observe(el));
}
```

### src/data/ab-variants.ts

```typescript
export type ABVariant = 'A' | 'B' | 'C';

export const heroVariants: Record<ABVariant, {
  statement: string[];
  subStatement: string;
}> = {
  A: {
    statement: ['Investigamos el problema real.', 'Construimos lo que funciona.'],
    subStatement: 'Estrategia, diseño y desarrollo. Un solo equipo senior. Sin pasar el proyecto de agencia en agencia.',
  },
  B: {
    // H04 (Var B): ajustada para incluir Track B — sin mencionar "agencia"
    statement: ['Menos promesas.', 'Más resultado para tu negocio.'],
    subStatement: 'Research profundo. Diseño y desarrollo en un equipo. Entregas en semanas.',
  },
  C: {
    statement: ['Estrategia, diseño y código.', 'Un solo equipo. Sin intermediarios.'],
    subStatement: 'Llevamos tu proyecto del diagnóstico al resultado. En semanas.',
  },
};
```

### src/data/casos.ts

```typescript
export interface CasoEstudio {
  id: string;
  cliente: string;
  sector: string;
  track: 'A' | 'B' | 'ambos';
  resultado: string;
  descripcion: string;
  testimonio?: {
    texto: string;
    nombre: string;
    cargo: string;
    empresa: string;
  };
  imagen?: string;
  publicado: boolean;
}

export const casos: CasoEstudio[] = [];
// Al agregar el primer caso: cambiar publicado: true y hacer deploy.
// El componente PruebaSocial.astro lo consume sin cambios en el componente.
```

### src/data/ticker.ts

```typescript
export const tickerItems: string[] = [
  'Producto digital', 'Branding', 'SaaS', 'eCommerce', 'EdTech',
  'Fintech', 'Retail', 'Servicios profesionales', 'WhatsApp Business API',
  'Identidad de marca', 'Estrategia digital', 'MVPs', 'CDMX', 'México',
];
// Mínimo 12 ítems. El componente duplica el array para el loop continuo.
```

---

## SECCIÓN PRD-7 — Página Principal (index.astro)

Archivo: `src/pages/index.astro`

```astro
---
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import Problema from '../components/Problema.astro';
import Metodologia from '../components/Metodologia.astro';
import Servicios from '../components/Servicios.astro';
import PruebaSocial from '../components/PruebaSocial.astro';
import CTAPrincipal from '../components/CTAPrincipal.astro';
import Footer from '../components/Footer.astro';
import { initScrollDepth } from '../utils/analytics';

// La variante por defecto es A — el script de Base.astro puede actualizar el DOM
const defaultVariant = 'A';
---

<Base>
  <Nav />
  <main>
    <Hero abVariant={defaultVariant} />
    <Problema />
    <Metodologia />
    <Servicios />
    <PruebaSocial />
    <CTAPrincipal />
  </main>
  <Footer />
</Base>

<script>
  // Inicializar scroll depth tracking después de que el DOM esté listo
  import { initScrollDepth } from '../utils/analytics';
  document.addEventListener('ab:ready', (e: CustomEvent) => {
    initScrollDepth(e.detail.variant);
  });
  // Si ab:ready no llega en 1s (Posthog bloqueado), inicializar con A
  setTimeout(() => initScrollDepth('A'), 1000);
</script>
```

---

## SECCIÓN PRD-8 — Página de Aviso de Privacidad (H05)

Archivo: `src/pages/privacidad.astro`

**Contenido mínimo requerido por LFPDPPP:**

```astro
---
import Base from '../layouts/Base.astro';
---

<Base title="Aviso de Privacidad — Cauce" description="Aviso de privacidad simplificado de Cauce.">
  <main class="max-w-[680px] mx-auto px-5 py-16 lg:py-24">
    <h1 class="type-h1 text-ink mb-8">Aviso de Privacidad</h1>

    <div class="type-body text-ink space-y-6">
      <p>
        <strong>Responsable:</strong> Cauce, con domicilio en Ciudad de México, México.
        Correo de contacto: <a href="mailto:hola@cauce.mx" class="underline">hola@cauce.mx</a>
      </p>

      <p>
        <strong>Datos que recabamos:</strong> nombre completo, nombre de empresa o proyecto,
        y correo electrónico.
      </p>

      <p>
        <strong>Finalidad:</strong> Los datos se utilizan exclusivamente para dar seguimiento a
        solicitudes de auditoría express y comunicación comercial relacionada con los servicios de Cauce.
        No se comparten con terceros ni se usan para fines distintos.
      </p>

      <p>
        <strong>Derechos ARCO:</strong> Puedes ejercer tus derechos de acceso, rectificación,
        cancelación u oposición enviando un correo a
        <a href="mailto:hola@cauce.mx" class="underline">hola@cauce.mx</a>
        con el asunto "Derechos ARCO".
      </p>

      <p>
        <strong>Cambios a este aviso:</strong> Cualquier modificación se publicará en esta página.
      </p>

      <p class="type-small text-stone">Última actualización: abril 2026</p>
    </div>

    <a href="/" class="type-small text-stone underline hover:text-ink mt-12 inline-block">
      ← Volver a cauce.mx
    </a>
  </main>
</Base>
```

---

## SECCIÓN PRD-9 — Verificación de Criterios por SPEC

### SPEC-001 (Setup) — Done cuando:
- [ ] `npm run dev` sin errores
- [ ] `npm run build` sin errores ni warnings de Tailwind
- [ ] Deploy inicial en Vercel con dominio configurado
- [ ] Variables de entorno configuradas (ver SPEC-0)
- [ ] `robots.txt` responde 200 en `cauce.mx/robots.txt`

### SPEC-002 (Design System) — Done cuando:
- [ ] `global.css` compila y todos los tokens `--color-*` y `.type-*` funcionan en Tailwind
- [ ] `size-adjust` calibrado con fontpie — CLS < 0.05 en Lighthouse
- [ ] `Button.astro` y `Input.astro` renderizan sin `rounded-*` (AP-11)
- [ ] Wordmark renderiza en Fraunces Italic 500 WONK=0 en Safari iOS 16+

### SPEC-003 (Secciones) — Done cuando:
- [ ] Las 8 secciones renderizan en 375px, 390px, 768px, 1440px sin overflow horizontal
- [ ] Hero A/B: cookie `cauce_ab` se setea en primera visita
- [ ] Hero A/B: variante correcta visible en visitas subsiguientes sin FOVC
- [ ] El proof ticker loopea sin salto visible en 390px

### SPEC-004 (Formulario + APIs) — Done cuando:
- [ ] Submit exitoso: confirmación inline, no redirect, Resend email llega en < 2 min
- [ ] Submit con email inválido: `aria-invalid=true` en campo, sin llamada a API
- [ ] Submit con Resend caído: mensaje de error con `hola@cauce.mx` visible
- [ ] `Promise.allSettled` — ambas ops logueadas independientemente en Vercel Functions
- [ ] WhatsApp redirect: `cauce.mx/whatsapp` → `wa.me` con número y mensaje correctos en iOS Safari + Android Chrome
- [ ] Aviso de privacidad accesible en `cauce.mx/privacidad`

### SPEC-005 (Performance + Analytics) — Done cuando:
- [ ] Lighthouse mobile ≥ 95 en Performance, Accessibility, Best Practices, SEO
- [ ] Los 6 eventos aparecen en Posthog Live Events en sesión de prueba manual completa
- [ ] `page_view` (con guión bajo) aparece en GA4 Realtime
- [ ] `form_submit` configurado como conversión en GA4 Admin
- [ ] 0 errores en Chrome DevTools Console
- [ ] Feature Flag `hero-ab-test` activo en Posthog con split 34/33/33

---

## SECCIÓN PRD-10 — Assets Actualizados (H01 corregido)

| Clasificación | Assets | Bloqueo |
|--------------|--------|---------|
| 🔴 **Bloquean deploy** (13 assets) | T01, T02, T03, L01, L02, C01, C02, X01, A01, F01, F02, F03, Q04 | Completar antes del primer deploy |
| 🟡 **Bloquean calidad** (7 assets) | L03, L04, X02, A02, Q01, Q02, Q03 | Completar en primeras 48h post-deploy |
| 🟢 **Post-lanzamiento** (2 assets) | A03, Q05-privacidad (contenido adicional) | Primeros 7 días |

**ASSET-Q05 (nuevo — H05) — Aviso de Privacidad**
- Qué es: página `cauce.mx/privacidad` con aviso LFPDPPP
- Dónde vive: `src/pages/privacidad.astro`
- Criterio: accesible en producción antes de que el formulario esté activo
- Bloqueo: 🔴

**TODO-03 (nuevo — H05):** Revisar que el aviso sea conforme a LFPDPPP con un abogado o usando la guía del INAI antes del primer deploy a producción.

---

## Changelog PRD

| Versión | Fecha | Descripción |
|---------|-------|-------------|
| v1.0 | Abril 2026 | PRD inicial. Incorpora 11 correcciones de auditoría críticas y medias. Resuelve: font preload vía import estático, Promise.all en endpoint, variante B copy, price anchor Track A, aviso de privacidad, pageview naming, tipografía 768px, FOVC handling, nav "El equipo". |
