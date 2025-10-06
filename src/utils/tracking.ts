interface TrackingPayload {
  [key: string]: any;
}

export const trackEvent = (eventName: string, payload: TrackingPayload = {}) => {
  if (typeof window === 'undefined' || !(window as any).gtag) return;

  const standardPayload = {
    quiz_id: 'leveme_quiz',
    wave: 'DCA19',
    ...payload,
  };

  // Remove any potential PII
  const sanitizedPayload = { ...standardPayload };
  if ('name' in sanitizedPayload) delete sanitizedPayload.name;
  if ('email' in sanitizedPayload) delete sanitizedPayload.email;
  if ('phone' in sanitizedPayload) delete sanitizedPayload.phone;

  (window as any).gtag('event', eventName, sanitizedPayload);
};