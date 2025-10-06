/**
 * Facebook Pixel Tracking Utilities
 * Gera eventID único para deduplicação entre browser e servidor
 */

/**
 * Gera um eventID único para eventos do Facebook Pixel
 * Formato: timestamp_randomString para garantir unicidade
 */
export const generateEventID = (): string => {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substr(2, 9);
  return `${timestamp}_${randomPart}`;
};

/**
 * Dispara evento Contact no Facebook Pixel
 */
export const trackPixelContact = (method: 'WhatsApp' | 'Email'): void => {
  if (typeof window === 'undefined' || !(window as any).fbq) return;

  const eventID = generateEventID();
  
  (window as any).fbq('track', 'Contact', {
    content_name: 'Contact Captured',
    content_category: method
  }, { eventID });

  console.log(`📊 Pixel Contact Event: ${method} (eventID: ${eventID})`);
};

/**
 * Dispara evento InitiateCheckout no Facebook Pixel
 */
export const trackPixelInitiateCheckout = (): void => {
  if (typeof window === 'undefined' || !(window as any).fbq) return;

  const eventID = generateEventID();
  
  (window as any).fbq('track', 'InitiateCheckout', {
    value: 37.90,
    currency: 'BRL'
  }, { eventID });

  console.log(`📊 Pixel InitiateCheckout Event (eventID: ${eventID})`);
};

/**
 * Dispara evento Purchase no Facebook Pixel
 */
export const trackPixelPurchase = (): void => {
  if (typeof window === 'undefined' || !(window as any).fbq) return;

  const eventID = generateEventID();
  
  (window as any).fbq('track', 'Purchase', {
    value: 37.90,
    currency: 'BRL',
    content_name: 'Chá Bariátrico - Receita Personalizada'
  }, { eventID });

  console.log(`📊 Pixel Purchase Event (eventID: ${eventID})`);
};
