// Enhanced tracking system with granular P20 events
import { trackEvent } from './tracking';

interface P20TrackingData {
  step: number;
  persona?: string;
  main_goal?: string;
  difficulty?: number | string;
  plan_ready: boolean;
  timer_remaining_ms?: number;
  gender?: string;
  body_type?: string;
  name?: string;
  cta_variant?: string;
}

interface QuizAnswer {
  question: string;
  answer: string | string[];
  pageNumber: number;
  timestamp: number;
}

// Helper to determine persona from quiz answers (updated keys)
export const getPersonaFromAnswers = (getAnswer: (question: string) => QuizAnswer | undefined): string => {
  const routineAnswer = getAnswer('daily_routine');
  const barriersAnswer = getAnswer('barreiras');
  
  // Handle barriers as string array
  const barriers = Array.isArray(barriersAnswer?.answer) ? barriersAnswer.answer : [];
  
  // Time-pressed persona: rush routines or time barriers
  if (routineAnswer?.answer === 'morning_rush' || 
      routineAnswer?.answer === 'shift_work' ||
      barriers.includes('falta_tempo')) {
    return 'tempo_apertado';
  }
  
  // Impulse control issues: anxiety or consistency barriers
  if (barriers.includes('ansiedade') || barriers.includes('falta_constancia')) {
    return 'controle_impulso';
  }
  
  return 'geral';
};

// Helper to determine main goal from quiz answers (updated to use Objetivo_Principal)
export const getMainGoalFromAnswers = (getAnswer: (question: string) => QuizAnswer | undefined): string => {
  const goalAnswer = getAnswer('Objetivo_Principal');
  
  if (!goalAnswer?.answer) return 'emagrecimento';
  
  const goalId = String(goalAnswer.answer);
  
  // Map new objective IDs to tracking categories
  switch (goalId) {
    case 'energy':
      return 'energia';
    case 'debloat':
      return 'desinchar';
    case 'cravings_control':
      return 'saciedade';
    case 'belly_fat':
    case 'inch_loss':
      return 'emagrecimento';
    default:
      return 'emagrecimento';
  }
};

// Helper to get difficulty score (updated mapping)
export const getDifficultyScore = (getAnswer: (question: string) => QuizAnswer | undefined): number => {
  const routineAnswer = getAnswer('daily_routine');
  const barriersAnswer = getAnswer('barreiras');
  
  let score = 7; // Base score
  
  // Map daily routine IDs to difficulty adjustments
  if (routineAnswer?.answer === 'morning_rush') score -= 2;
  if (routineAnswer?.answer === 'shift_work') score -= 1;
  if (routineAnswer?.answer === 'night_free') score += 0; // neutral
  
  // Handle barriers as string array
  const barriers = Array.isArray(barriersAnswer?.answer) ? barriersAnswer.answer : [];
  
  if (barriers.includes('falta_tempo')) score -= 1;
  if (barriers.includes('orcamento_curto')) score -= 2;
  
  return Math.max(3, Math.min(10, score));
};

// Track P20 page view with full context (updated keys)
export const trackP20View = (
  getAnswer: (question: string) => QuizAnswer | undefined,
  timerRemainingMs?: number
) => {
  const genderAnswer = getAnswer('Qual é o seu gênero?'); // Updated key
  const bodyTypeAnswer = getAnswer('Qual seu tipo de corpo?'); // May be undefined (archived)
  
  const trackingData: P20TrackingData = {
    step: 20,
    persona: getPersonaFromAnswers(getAnswer),
    main_goal: getMainGoalFromAnswers(getAnswer),
    difficulty: getDifficultyScore(getAnswer),
    plan_ready: true,
    timer_remaining_ms: timerRemainingMs,
    gender: genderAnswer?.answer as string,
    // Only include body_type if it exists (handle archived data)
    ...(bodyTypeAnswer?.answer && { body_type: bodyTypeAnswer.answer as string })
  };

  // GA4 Event
  trackEvent('p20_view', trackingData);

};

// Track P20 CTA click with context (updated keys)
export const trackP20CTAClick = (
  getAnswer: (question: string) => QuizAnswer | undefined,
  ctaVariant: string,
  timerRemainingMs?: number,
  userName?: string
) => {
  const genderAnswer = getAnswer('Qual é o seu gênero?'); // Updated key
  const bodyTypeAnswer = getAnswer('Qual seu tipo de corpo?'); // May be undefined (archived)
  
  const trackingData = {
    step: 20,
    cta_variant: ctaVariant,
    persona: getPersonaFromAnswers(getAnswer),
    main_goal: getMainGoalFromAnswers(getAnswer),
    difficulty: getDifficultyScore(getAnswer),
    timer_remaining_ms: timerRemainingMs,
    gender: genderAnswer?.answer as string,
    // Only include body_type if it exists (handle archived data)  
    ...(bodyTypeAnswer?.answer && { body_type: bodyTypeAnswer.answer as string }),
    // Don't track PII directly
    has_name: !!userName
  };

  trackEvent('cta_click', trackingData);
};

// Track timer expiration
export const trackTimerExpired = () => {
  trackEvent('timer_expired', {
    step: 20,
    event_type: 'reservation_expired'
  });
};

// Track progress bar interaction
export const trackProgressBarView = (
  currentState: string,
  projectedState: string
) => {
  trackEvent('progress_comparison_view', {
    step: 20,
    current_state: currentState,
    projected_state: projectedState,
    interaction_type: 'visual_comparison'
  });
};