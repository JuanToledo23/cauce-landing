// H12: nombre unificado como page_view (con guión bajo) — estándar GA4

declare global {
  interface Window {
    posthog?: {
      capture: (name: string, properties?: Record<string, unknown>) => void;
      [key: string]: unknown;
    };
    gtag?: (...args: unknown[]) => void;
  }
}

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
