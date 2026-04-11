import type { APIRoute } from 'astro';

// Astro 5 output: 'static' — marcar como on-demand para que el adapter
// de Vercel lo convierta en serverless function en vez de prerenderizar.
export const prerender = false;

export const GET: APIRoute = ({ request }) => {
  const url = new URL(request.url);
  const from = url.searchParams.get('from') || 'unknown';

  const number = import.meta.env.WHATSAPP_NUMBER;
  const message = encodeURIComponent('Hola, quiero solicitar una auditoría express gratuita. Mi empresa es ');
  const waUrl = `https://wa.me/${number}?text=${message}`;

  // GA4 registrará el pageview de /whatsapp como conversión configurable.
  // El `from` queda en los logs de Vercel Functions para trazabilidad.
  console.info(`[cauce/whatsapp] redirect desde: ${from}`);

  return Response.redirect(waUrl, 302);
};
