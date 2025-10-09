// utils/pixel.ts
// ============================================================
// Meta Pixel utilities: init, cookies (_fbp/_fbc), and event tracking
// Pixel ID: 9182042128586541
// ============================================================

const PIXEL_ID = '9182042128586541';

// ---------- Helpers
function generateEventID(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return;
  const match = document.cookie.split('; ').find(row => row.startsWith(`${name}=`));
  return match?.split('=')[1];
}

function setCookie(name: string, value: string, days = 180) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const base = `${name}=${value}; Expires=${expires}; Path=/; SameSite=Lax`;
  document.cookie = base;
  try {
    const host = location.hostname.replace(/^www\./, '');
    document.cookie = `${base}; Domain=.${host}`;
  } catch {}
}

function getQueryParam(name: string): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// Cria _fbc a partir do fbclid (quando existir)
export function ensureFbcFromFbclid(): void {
  if (typeof window === 'undefined') return;
  const fbclid = getQueryParam('fbclid');
  const hasFbc = !!getCookie('_fbc');
  if (fbclid && !hasFbc) {
    const fbc = `fb.1.${Math.floor(Date.now() / 1000)}.${fbclid}`;
    setCookie('_fbc', fbc);
  }
}

// Lê cookies do Meta (_fbp e _fbc)
function getMetaCookies() {
  return {
    fbp: getCookie('_fbp'),
    fbc: getCookie('_fbc'),
  };
}

// ---------- Inicialização do Pixel
export function initMetaPixel(): void {
  if (typeof window === 'undefined') return;
  if ((window as any).fbq && (window as any).fbq.loaded) return;

  (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  (window as any).fbq('init', PIXEL_ID);
  (window as any).fbq('track', 'PageView');
  console.log(`📊 Meta Pixel inicializado com ID: ${PIXEL_ID}`);
}

// ---------- Eventos
export function trackPageView(): void {
  if (typeof window === 'undefined' || !(window as any).fbq) return;
  (window as any).fbq('track', 'PageView');
}

export function trackInitiateCheckout(params?: {
  value?: number;
  currency?: string;
  contents?: Array<{ id: string; quantity?: number }>;
  num_items?: number;
}): string | null {
  if (typeof window === 'undefined' || !(window as any).fbq) {
    console.warn('⚠️ fbq não encontrado; initMetaPixel() precisa ser chamado antes.');
    return null;
  }

  ensureFbcFromFbclid();

  const eventID = generateEventID();
  const { fbp, fbc } = getMetaCookies();

  const payload: Record<string, any> = {
    value: params?.value ?? 37.9,
    currency: params?.currency ?? 'BRL',
    fbp,
    fbc,
  };

  if (params?.contents) payload.contents = params.contents;
  if (params?.num_items != null) payload.num_items = params.num_items;

  (window as any).fbq('track', 'InitiateCheckout', payload, { eventID });

  console.log('📊 InitiateCheckout enviado', { eventID, payload });
  return eventID;
}

export function trackPurchase(params?: {
  value?: number;
  currency?: string;
  content_name?: string;
  contents?: Array<{ id: string; quantity?: number }>;
  num_items?: number;
}): string | null {
  if (typeof window === 'undefined' || !(window as any).fbq) {
    console.warn('⚠️ fbq não encontrado; initMetaPixel() precisa ser chamado antes.');
    return null;
  }

  ensureFbcFromFbclid();

  const eventID = generateEventID();
  const { fbp, fbc } = getMetaCookies();

  const payload: Record<string, any> = {
    value: params?.value ?? 37.9,
    currency: params?.currency ?? 'BRL',
    content_name: params?.content_name ?? 'Chá Bariátrico - Receita Personalizada',
    fbp,
    fbc,
  };

  if (params?.contents) payload.contents = params.contents;
  if (params?.num_items != null) payload.num_items = params.num_items;

  (window as any).fbq('track', 'Purchase', payload, { eventID });

  console.log('📊 Purchase enviado', { eventID, payload });
  return eventID;
}
