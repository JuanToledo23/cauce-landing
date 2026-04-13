export function initScrollReveal(): void {
  const elements = document.querySelectorAll('.reveal-element, .reveal-stagger, .reveal-number');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');

          // For stagger containers, also reveal children
          if (entry.target.classList.contains('reveal-stagger')) {
            entry.target.querySelectorAll('.reveal-element, .reveal-number').forEach((child) => {
              child.classList.add('is-visible');
            });
          }

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((el) => observer.observe(el));
}