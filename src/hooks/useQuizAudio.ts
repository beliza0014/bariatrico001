import { useMemo } from "react";
import { useSoundContext } from "@/contexts/SoundContext";
import { quizSoundPlan, SoundKey } from "@/audio/quizSoundPlan";

type Handlers = {
  onSelect?: () => void;
  onNext?: () => void;
  onValid?: () => void;
  onInvalid?: () => void;
  onEnter?: () => void;
  onReveal?: () => void;
  onBonus?: () => void;
  onShow?: () => void;
};

export function useQuizAudio(currentPageIndex: number): Handlers {
  const soundContext = useSoundContext();
  const entry = quizSoundPlan[currentPageIndex] ?? {};

  // Map SoundKey to actual sound context methods with improved specificity
  const playSound = (soundKey: SoundKey) => {
    switch (soundKey) {
      case "click":
        soundContext.playButtonClick();
        break;
      case "correct":
        soundContext.playCorrectAnswer();
        break;
      case "transition":
        soundContext.playPageTransition();
        break;
      case "wheel":
        soundContext.playEnhancedWheelSpin();
        break;
      case "confettiPop":
        soundContext.playConfettiPop(); // Use individual sound instead of celebration sequence
        break;
      case "applause":
        soundContext.playApplause(); // Use individual sound instead of victory sequence
        break;
      case "achievement":
        soundContext.playAchievement(); // Use individual sound instead of victory sequence
        break;
      case "pageOpen":
        soundContext.playPageOpen();
        break;
    }
  };

  const make = (k?: SoundKey) => (k ? () => playSound(k) : undefined);

  return useMemo(
    () => ({
      onSelect:  make(entry.onSelect),
      onNext:    make(entry.onNext),
      onValid:   make(entry.onValid),
      onInvalid: make(entry.onInvalid),
      onEnter:   make(entry.onEnter),
      onReveal:  make(entry.onReveal),
      onBonus:   make(entry.onBonus),
      onShow:    make(entry.onShow),
    }),
    [currentPageIndex, soundContext]
  );
}