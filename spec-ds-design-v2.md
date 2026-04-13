# SPEC-DS — Design System v2: Cauce Landing

> **Qué es este SPEC:** Actualización quirúrgica de la capa visual.
> La estructura, el copy, las APIs, el formulario y la funcionalidad NO se tocan.
> Solo cambia: tipografía, paleta, hero, y botones.
>
> **Tiempo estimado:** 2-3 horas en Claude Code.
>
> **Resultado:** Landing que transmite "equipo tech senior que construye cosas reales"
> sin verse como galería editorial ni template de agencia genérica.

---

## Definition of Success

El SPEC está completo cuando:

- [ ] El hero tiene fondo oscuro `#0A0A0A` con texto blanco y el mockup de métricas
- [ ] El resto de la página usa fondo blanco `#FFFFFF` limpio
- [ ] La tipografía es Plus Jakarta Sans en todos los elementos (cero Fraunces)
- [ ] Los botones CTA tienen `border-radius: 8px` y color `#2563EB`
- [ ] `npm run build` pasa sin errores
- [ ] La página se ve correcta en 375px, 390px, 768px y 1440px
- [ ] Ningún anti-patrón del CLAUDE.md está activo

---

## CAMBIO 1 — Tipografía nueva

### Desinstalar Fraunces, instalar Plus Jakarta Sans

```bash
npm uninstall @fontsource-variable/fraunces
npm install @fontsource-variable/plus-jakarta-sans
```

**Por qué Plus Jakarta Sans:** Geométrica humanista con personalidad. Bold a 800 tiene
presencia sin ser genérica. La usan startups serias en 2025-2026. No es Inter.
No es Space Grotesk. Tiene carácter sin ser editorial.

---

## CAMBIO 2 — global.css completo (reemplazar todo)

Archivo: `src/styles/global.css`

```css
/* ============================================================
   CAUCE v2 — Design System Tokens
   Dirección: Tech Studio moderno. Dark hero + light body.
   Una sola familia tipográfica. Acento azul eléctrico.
   ============================================================ */

@import '@fontsource-variable/plus-jakarta-sans/wght.css';
@import 'tailwindcss';

@theme {
  /* Tipografía — una sola familia */
  --font-display: 'Plus Jakarta Sans Variable', system-ui, sans-serif;
  --font-body:    'Plus Jakarta Sans Variable', system-ui, sans-serif;

  /* Paleta — dos mundos */
  /* Hero (dark) */
  --color-dark-bg:      #0A0A0A;
  --color-dark-surface: #141414;
  --color-dark-border:  #2A2A2A;
  --color-dark-text:    #F5F5F5;
  --color-dark-muted:   #888888;

  /* Body (light) */
  --color-light-bg:     #FFFFFF;
  --color-light-surface:#F4F4F5;
  --color-light-border: #E4E4E7;
  --color-light-text:   #09090B;
  --color-light-muted:  #71717A;

  /* Acento único — azul eléctrico */
  --color-accent:       #2563EB;
  --color-accent-hover: #1D4ED8;
  --color-accent-light: #EFF6FF;

  /* Estados semánticos */
  --color-error:        #EF4444;
  --color-success:      #22C55E;
  --color-focus-ring:   #2563EB;

  /* Aliases para Tailwind (backwards compat con componentes existentes) */
  --color-ink:    #09090B;
  --color-paper:  #FFFFFF;
  --color-mist:   #F4F4F5;
  --color-stone:  #71717A;

  /* Breakpoints */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}

/* ============================================================
   FONT FALLBACK — Plus Jakarta Sans → system-ui
   Calibrar con fontpie si CLS > 0.05 post-deploy.
   ============================================================ */
@font-face {
  font-family: 'Jakarta Fallback';
  src: local('system-ui');
  size-adjust: 102%;
  ascent-override: 98%;
  descent-override: 22%;
  font-display: swap;
}

/* ============================================================
   ESCALA TIPOGRÁFICA
   Una familia, pesos diferenciados para jerarquía.
   800 = display impact · 700 = headlines · 400 = body
   ============================================================ */

/* Display — hero statement */
.type-display {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 48px;
  line-height: 1.05;
  letter-spacing: -0.03em;
}

/* H1 — section CTAs */
.type-h1 {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 36px;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

/* H2 — section headlines */
.type-h2 {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 28px;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

/* H3 — step titles */
.type-h3 {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 20px;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.type-body    { font-family: var(--font-body); font-weight: 400; font-size: 16px; line-height: 1.65; }
.type-body-lg { font-family: var(--font-body); font-weight: 400; font-size: 18px; line-height: 1.6; }
.type-small   { font-family: var(--font-body); font-weight: 400; font-size: 14px; line-height: 1.55; }
.type-label   {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 11px;
  line-height: 1.4;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.type-cta     { font-family: var(--font-body); font-weight: 600; font-size: 15px; line-height: 1.3; }
.type-caption { font-family: var(--font-body); font-weight: 400; font-size: 13px; line-height: 1.5; }

/* Desktop overrides ≥ 1024px */
@media (min-width: 1024px) {
  .type-display { font-size: 72px; }
  .type-h1      { font-size: 52px; }
  .type-h2      { font-size: 40px; }
  .type-h3      { font-size: 24px; }
}

/* Tablet 768px–1023px */
@media (min-width: 768px) and (max-width: 1023px) {
  .type-display { font-size: clamp(48px, 6vw, 64px); }
  .type-h1      { font-size: clamp(36px, 5vw, 48px); }
  .type-h2      { font-size: clamp(28px, 4vw, 36px); }
}

/* ============================================================
   WORDMARK
   Plus Jakarta Sans Bold en lugar de Fraunces Italic.
   Más directo, más moderno.
   ============================================================ */
.wordmark {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 20px;
  letter-spacing: -0.03em;
  color: var(--color-light-text);
}

.wordmark-dark {
  color: var(--color-dark-text);
}

.wordmark-inverse {
  color: var(--color-dark-text);
}

/* ============================================================
   PROOF TICKER — CSS-only, sin JS
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

/* ============================================================
   HERO — fondo oscuro, partículas de ruido sutiles
   El único fondo no-blanco fuera del footer.
   ============================================================ */
.hero-bg {
  background-color: var(--color-dark-bg);
  /* Textura de ruido sutil — señal de cuidado visual sin ser decorativa */
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
}

/* ============================================================
   BADGE — etiqueta de track/categoría
   ============================================================ */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 9999px;
  border: 1px solid var(--color-dark-border);
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 500;
  color: var(--color-dark-muted);
  letter-spacing: 0.02em;
}

/* ============================================================
   METRIC CARD — para el hero mockup
   ============================================================ */
.metric-card {
  background: var(--color-dark-surface);
  border: 1px solid var(--color-dark-border);
  border-radius: 12px;
  padding: 20px 24px;
}

.metric-card-value {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 36px;
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--color-dark-text);
}

.metric-card-label {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 400;
  color: var(--color-dark-muted);
  margin-top: 6px;
}

.metric-card-delta {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  color: var(--color-success);
  display: inline-flex;
  align-items: center;
  gap: 3px;
}
```

---

## CAMBIO 3 — Button.astro (actualizar)

Archivo: `src/components/ui/Button.astro`

El único cambio: `rounded-none` → `rounded-lg` (8px). El cuadrado perfecto era coherente
con el estilo editorial. La nueva dirección es moderna y `rounded-lg` es correcto aquí.
El acento cambia de terracota a azul.

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
      'type-cta inline-flex items-center justify-center transition-all duration-150',
      variant === 'primary' && [
        'bg-[#2563EB] text-white rounded-lg px-8 h-14 w-full',
        'hover:bg-[#1D4ED8] active:scale-[0.98]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]'
      ],
      variant === 'text' && 'text-[#71717A] hover:text-[#09090B]',
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
      'type-cta inline-flex items-center justify-center transition-all duration-150',
      variant === 'primary' && [
        'bg-[#2563EB] text-white rounded-lg px-8 h-14 w-full',
        'hover:bg-[#1D4ED8] active:scale-[0.98]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]',
        'disabled:bg-[#C4C4C4] disabled:cursor-not-allowed disabled:scale-100'
      ],
      variant === 'text' && 'text-[#71717A] hover:text-[#09090B]',
      className
    ]}
  >
    <slot />
  </button>
)}
```

---

## CAMBIO 4 — Input.astro (actualizar border-radius)

Solo una línea cambia: `rounded-none` → `rounded-lg` en el `<input>`.

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
  <label for={inputId} class="type-label text-[#71717A]">{label}</label>
  <input
    id={inputId}
    name={name}
    type={type}
    placeholder={placeholder}
    required={required}
    autocomplete={type === 'email' ? 'email' : name === 'nombre' ? 'name' : 'organization'}
    class="h-14 bg-white border border-[#E4E4E7] rounded-lg px-4 type-body text-[#09090B]
           placeholder:text-[#A1A1AA]
           focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]
           aria-[invalid=true]:border-[#EF4444]"
    aria-describedby={errorMessage ? `${inputId}-error` : undefined}
  />
  {errorMessage && (
    <p id={`${inputId}-error`} class="type-caption text-[#EF4444]" role="alert">{errorMessage}</p>
  )}
</div>
```

---

## CAMBIO 5 — Hero.astro (el más importante)

Archivo: `src/components/Hero.astro`

El hero tiene fondo oscuro y en lugar del placeholder `bg-mist` gris muestra un
**mockup de métricas** construido en HTML/CSS puro — sin imágenes externas.
Muestra números reales creíbles de lo que Cauce entrega.

```astro
---
interface Props {
  abVariant: 'A' | 'B' | 'C';
}

const { abVariant } = Astro.props;
import { heroVariants } from '../data/ab-variants';
const defaultVariant = heroVariants[abVariant] || heroVariants['A'];
---

<section id="hero" class="hero-bg pt-20 pb-20 px-5 lg:px-16">
  <div class="max-w-screen-xl mx-auto lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">

    <!-- Columna de texto — 6/12 desktop -->
    <div class="lg:col-span-6">

      <!-- Badge de contexto -->
      <div class="badge mb-8 w-fit">
        <span class="inline-block w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
        Research · Diseño · Desarrollo
      </div>

      <!-- Statement principal A/B -->
      <h1
        id="hero-statement"
        class="type-display text-[#F5F5F5]"
        data-variant={abVariant}
      >
        {defaultVariant.statement.map(line => <span class="block">{line}</span>)}
      </h1>

      <p
        id="hero-sub"
        class="type-body-lg text-[#888888] mt-6 max-w-[460px]"
      >
        {defaultVariant.subStatement}
      </p>

      <!-- CTAs -->
      <div class="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center">
        <a
          href="#auditoria"
          id="hero-cta"
          class="type-cta inline-flex items-center justify-center
                 bg-[#2563EB] text-white rounded-lg px-8 h-14
                 hover:bg-[#1D4ED8] active:scale-[0.98] transition-all duration-150
                 lg:w-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
        >
          Quiero mi auditoría →
        </a>
        <a
          href="/whatsapp?from=hero"
          id="hero-whatsapp"
          class="type-small text-[#888888] text-center hover:text-[#F5F5F5] transition-colors lg:text-left"
          target="_blank"
          rel="noopener"
        >
          o escríbenos por WhatsApp →
        </a>
      </div>

      <!-- Tracks -->
      <div class="mt-10 flex flex-wrap gap-x-6 gap-y-2">
        <span class="type-label text-[#555555]">▸ Producto digital</span>
        <span class="type-label text-[#555555]">▸ Marca y presencia</span>
        <span class="type-label text-[#555555]">9+ años · CDMX</span>
      </div>

    </div>

    <!-- Columna derecha — mockup de métricas (6/12 desktop) -->
    <!-- Sin imágenes externas. CSS puro. Muestra resultados reales. -->
    <div class="hidden lg:block lg:col-span-6 mt-0" aria-hidden="true">
      <div class="relative">

        <!-- Card principal: resultado de proyecto -->
        <div class="metric-card">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-[#2563EB]/20 flex items-center justify-center">
                <div class="w-3 h-3 rounded-sm bg-[#2563EB]"></div>
              </div>
              <div>
                <p class="text-[#F5F5F5] text-sm font-semibold">Wapi — WhatsApp Business</p>
                <p class="text-[#555555] text-xs mt-0.5">Plataforma de agentes IA · Track A</p>
              </div>
            </div>
            <span class="text-xs text-[#22C55E] font-medium bg-[#22C55E]/10 px-2 py-1 rounded-full">
              En producción
            </span>
          </div>

          <!-- Métricas de resultado -->
          <div class="grid grid-cols-3 gap-4 mb-6">
            <div>
              <p class="metric-card-value">4</p>
              <p class="metric-card-label">semanas a producción</p>
            </div>
            <div>
              <p class="metric-card-value text-[#22C55E]">+32%</p>
              <p class="metric-card-label">tasa de respuesta</p>
            </div>
            <div>
              <p class="metric-card-value">3</p>
              <p class="metric-card-label">pilotos activos MX</p>
            </div>
          </div>

          <!-- Barra de progreso visual -->
          <div class="space-y-2">
            <div class="flex justify-between text-xs">
              <span class="text-[#555555]">Research → Spec → Build</span>
              <span class="text-[#2563EB] font-medium">100%</span>
            </div>
            <div class="h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
              <div class="h-full bg-[#2563EB] rounded-full w-full"></div>
            </div>
          </div>
        </div>

        <!-- Card flotante: stack tecnológico -->
        <div class="metric-card mt-3 flex items-center gap-4">
          <div class="flex-1">
            <p class="text-[#888888] text-xs mb-2">Stack entregado</p>
            <div class="flex flex-wrap gap-2">
              {['Next.js', 'Supabase', 'WhatsApp API', 'Vercel', 'TypeScript'].map(tech => (
                <span class="text-xs text-[#A1A1A1] bg-[#1A1A1A] border border-[#2A2A2A] px-2 py-0.5 rounded-md">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div class="text-right shrink-0">
            <p class="metric-card-delta">↑ 4.8 <span class="text-[#555555] font-normal">/ 5</span></p>
            <p class="text-[#555555] text-xs mt-0.5">satisfacción</p>
          </div>
        </div>

      </div>
    </div>

  </div>
</section>

<script>
  import { heroVariants } from '../data/ab-variants';
  import { trackEvent } from '../utils/analytics';

  document.addEventListener('ab:ready', ((e: Event) => {
    const variant = (e as CustomEvent).detail.variant as 'A' | 'B' | 'C';
    const data = heroVariants[variant];
    if (!data) return;

    const el = document.getElementById('hero-statement');
    if (el) {
      el.innerHTML = data.statement.map(l => `<span class="block">${l}</span>`).join('');
      el.dataset.variant = variant;
    }

    const sub = document.getElementById('hero-sub');
    if (sub) sub.textContent = data.subStatement;
  }) as EventListener);

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

---

## CAMBIO 6 — Nav.astro (adaptar para hero oscuro)

El wordmark en la nav necesita ser blanco cuando está sobre el hero oscuro y negro cuando
el usuario scrollea al body claro. Solución: clase que cambia con scroll.

Reemplazar el componente `Nav.astro` completo:

```astro
---
// Nav con comportamiento scroll-aware para adaptarse al hero oscuro
---

<nav
  id="main-nav"
  class="sticky top-0 z-50 h-14 flex items-center justify-between px-5 lg:px-16
         transition-all duration-300
         bg-transparent border-b border-transparent"
>
  <a href="/" class="wordmark wordmark-dark transition-colors duration-300" id="nav-wordmark">
    cauce
  </a>

  <!-- Links desktop -->
  <div class="hidden lg:flex lg:gap-8">
    <a href="#como-trabajamos" class="type-small text-[#888888] hover:text-[#F5F5F5] transition-colors nav-link">
      Cómo trabajamos
    </a>
    <a href="#servicios" class="type-small text-[#888888] hover:text-[#F5F5F5] transition-colors nav-link">
      Servicios
    </a>
    <a href="#el-equipo" class="type-small text-[#888888] hover:text-[#F5F5F5] transition-colors nav-link">
      El equipo
    </a>
  </div>

  <!-- CTA nav -->
  <div class="flex items-center gap-3">
    <!-- Mobile -->
    <a href="#auditoria" class="type-label text-[#2563EB] hover:text-[#1D4ED8] transition-colors lg:hidden">
      Auditoría gratis →
    </a>
    <!-- Desktop -->
    <a
      href="#auditoria"
      class="hidden lg:inline-flex items-center justify-center
             type-cta bg-[#2563EB] text-white rounded-lg px-5 h-10
             hover:bg-[#1D4ED8] active:scale-[0.98] transition-all duration-150"
    >
      Auditoría gratis →
    </a>
  </div>
</nav>

<script>
  const nav = document.getElementById('main-nav');
  const wordmark = document.getElementById('nav-wordmark');
  const links = document.querySelectorAll('.nav-link');

  // Altura del hero
  const heroEl = document.getElementById('hero');
  const heroHeight = heroEl?.offsetHeight || 600;

  function updateNav() {
    const scrolled = window.scrollY > heroHeight - 56;

    if (scrolled) {
      // Sobre sección clara — nav con fondo blanco
      nav?.classList.add('bg-white', 'border-[#E4E4E7]');
      nav?.classList.remove('bg-transparent', 'border-transparent');
      wordmark?.classList.remove('text-[#F5F5F5]');
      wordmark?.classList.add('text-[#09090B]');
      links.forEach(l => {
        l.classList.remove('text-[#888888]', 'hover:text-[#F5F5F5]');
        l.classList.add('text-[#71717A]', 'hover:text-[#09090B]');
      });
    } else {
      // Sobre hero oscuro — nav transparente
      nav?.classList.remove('bg-white', 'border-[#E4E4E7]');
      nav?.classList.add('bg-transparent', 'border-transparent');
      wordmark?.classList.add('text-[#F5F5F5]');
      wordmark?.classList.remove('text-[#09090B]');
      links.forEach(l => {
        l.classList.add('text-[#888888]', 'hover:text-[#F5F5F5]');
        l.classList.remove('text-[#71717A]', 'hover:text-[#09090B]');
      });
    }
  }

  // Inicializar
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });
</script>
```

---

## CAMBIO 7 — Base.astro (actualizar import de fuente)

En el frontmatter de `src/layouts/Base.astro`, reemplazar las líneas de import de fuentes:

**Antes:**
```javascript
import '@fontsource-variable/fraunces/wght-italic.css';
import '@fontsource-variable/instrument-sans/wght.css';
```

**Después:**
```javascript
import '@fontsource-variable/plus-jakarta-sans/wght.css';
```

---

## CAMBIO 8 — Footer.astro (adaptar colores)

El footer usa `bg-ink` que ahora mapea a `#09090B` — sigue funcionando sin cambios.
Solo verificar que el wordmark use `.wordmark-inverse` para que sea texto claro.

Sin cambios necesarios si el footer ya usa las clases del PRD original.

---

## CAMBIO 9 — CTAPrincipal.astro (color de fondo)

La sección CTA usaba `bg-mist`. Con la nueva paleta, `--color-mist` es `#F4F4F5`.
Eso sigue siendo correcto — fondo gris muy claro que diferencia la zona de acción.

Sin cambios necesarios.

---

## Orden de ejecución para Claude Code

```
1. npm uninstall @fontsource-variable/fraunces
   npm uninstall @fontsource-variable/instrument-sans
   npm install @fontsource-variable/plus-jakarta-sans

2. Reemplazar global.css completo (CAMBIO 2)

3. Actualizar Base.astro — solo el import de fuente (CAMBIO 7)

4. Reemplazar Button.astro completo (CAMBIO 3)

5. Reemplazar Input.astro completo (CAMBIO 4)

6. Reemplazar Hero.astro completo (CAMBIO 5)

7. Reemplazar Nav.astro completo (CAMBIO 6)

8. npm run build → verificar sin errores

9. Verificar en localhost:4321:
   - Hero oscuro con mockup de métricas visible
   - Nav transparente sobre hero, blanca al scrollear
   - Tipografía Plus Jakarta Sans en todo
   - CTAs azules con rounded-lg
   - Secciones de cuerpo en blanco limpio
```

---

## Verificación anti-patrones (actualizada para v2)

Con esta nueva dirección, el checklist de AP se actualiza en dos puntos:

- **AP-11 (rounded-none):** ya no aplica — la nueva dirección usa `rounded-lg` (8px) de forma intencional y consistente. Actualizar el PR template.
- **AP-03 (Inter):** sigue activo — Plus Jakarta Sans no es Inter. Verificar que no haya fallback a Inter en ningún lado.
- **AP-01 (gradientes):** sigue activo — el hero usa `background-image` con SVG de ruido, no un gradiente decorativo. Es textura, no degradado de color.

---

## Qué NO cambia

- Copy de todas las secciones
- Estructura de 8 secciones
- Lógica A/B con Posthog
- APIs `/api/contact.ts` y `/api/whatsapp.ts`
- Formulario y sus estados
- Analytics (6 eventos)
- Aviso de privacidad
- robots.txt y sitemap
- Toda la funcionalidad del SPEC-004 y SPEC-005

