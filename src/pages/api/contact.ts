import type { APIRoute } from 'astro';

// Astro 5 output: 'static' — marcar como on-demand para que el adapter
// de Vercel lo convierta en serverless function en vez de prerenderizar.
export const prerender = false;

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const RESEND_AUDIENCE_ID = import.meta.env.RESEND_AUDIENCE_ID;
const CAUCE_EMAIL = import.meta.env.CAUCE_EMAIL_CONTACT;

// Validación de email estricta (H02: mejor que solo .includes('@'))
const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

const jsonResponse = (body: unknown, status: number): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, string>;

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Payload inválido' }, 400);
  }

  const { nombre, empresa, correo, telefono, ab_variant, utm_source, utm_medium } = body;

  if (!nombre?.trim() || !empresa?.trim() || !correo?.trim() || !isValidEmail(correo)) {
    return jsonResponse({ error: 'Campos inválidos' }, 400);
  }

  const timestamp = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });

  // H02: Promise.allSettled con logging independiente por operación.
  // Si una falla, la otra sigue ejecutándose.
  // - Si el email de notificación falla → 500 (el equipo no se entera).
  // - Si solo Audience falla → 200 (el lead es recuperable desde el correo).
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
        data: {
          empresa,
          ab_variant: ab_variant || 'A',
          utm_source: utm_source || '',
          utm_medium: utm_medium || '',
        },
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
        from: 'Cauce <leads@cauce.tech>',
        to: CAUCE_EMAIL,
        subject: `[Cauce] Nuevo diagnóstico: ${empresa} — ${nombre}`,
        html: `
          <p><strong>Nueva solicitud de diagnóstico express</strong></p>
          <table>
            <tr><td><strong>Nombre:</strong></td><td>${nombre}</td></tr>
            <tr><td><strong>Empresa:</strong></td><td>${empresa}</td></tr>
            <tr><td><strong>Correo:</strong></td><td><a href="mailto:${correo}">${correo}</a></td></tr>
            <tr><td><strong>Teléfono:</strong></td><td>${telefono || '—'}</td></tr>
            <tr><td><strong>Recibido:</strong></td><td>${timestamp} (CDMX)</td></tr>
          </table>
        `,
      }),
    }),

  ]);

  // Clasificación: una operación "falla" si la promesa fue rechazada
  // (error de red) O si el Response HTTP no es OK (ej. 401 sin API key).
  // fetch() no rechaza en errores HTTP por sí solo — hay que inspeccionar .ok.
  const classify = async (
    result: PromiseSettledResult<Response>,
    label: string,
  ): Promise<boolean> => {
    if (result.status === 'rejected') {
      console.error(`[cauce/contact] ${label} rechazó:`, result.reason);
      return true;
    }
    if (!result.value.ok) {
      const errorBody = await result.value.text().catch(() => '');
      console.error(
        `[cauce/contact] ${label} HTTP ${result.value.status} ${result.value.statusText}`,
        errorBody,
      );
      return true;
    }
    return false;
  };

  const audienceFailed = await classify(audienceResult, 'Resend Audiences');
  const emailFailed = await classify(emailResult, 'Resend Email');

  // Si el email de notificación falló, el equipo no se enterará — retornar error
  // para que el cliente muestre el fallback con hola@cauce.tech.
  if (emailFailed) {
    return jsonResponse({ error: 'No se pudo enviar la notificación' }, 500);
  }

  // Audience puede fallar sin bloquear — el lead se puede recuperar del email.
  // audienceFailed ya quedó loggeado arriba para trazabilidad.
  void audienceFailed;

  return jsonResponse({ success: true }, 200);
};
