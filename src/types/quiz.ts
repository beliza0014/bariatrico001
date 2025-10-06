// Common audio handlers type for quiz pages
export interface QuizAudioHandlers {
  onSelect?: () => void;
  onNext?: () => void;
  onValid?: () => void;
  onInvalid?: () => void;
  onEnter?: () => void;
  onReveal?: () => void;
  onBonus?: () => void;
  onShow?: () => void;
}

// Common props for quiz pages
export interface QuizPageProps {
  audio?: QuizAudioHandlers;
}