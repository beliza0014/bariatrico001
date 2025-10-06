import React, { useState, useEffect, useRef } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { useQuizStep } from '@/hooks/useQuizStep';
import { useQuiz } from '@/contexts/QuizContext';
import { QuizPageProps } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { QUIZ_EMOJIS } from '@/constants/quizEmojis';
export const Page12PhysicalDifficulties: React.FC<QuizPageProps> = ({
  audio = {}
}) => {
  useQuizStep('Dificuldades_Fisicas');
  const {
    addAnswer,
    nextPage
  } = useQuiz();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const startTimeRef = useRef(Date.now());
  const options = [{
    id: "stairs",
    text: "Subir as escadas",
    emoji: QUIZ_EMOJIS.page12.stairs
  }, {
    id: "sitting",
    text: "Se sentar",
    emoji: QUIZ_EMOJIS.page12.sitting
  }, {
    id: "squatting",
    text: "Agachar",
    emoji: QUIZ_EMOJIS.page12.squatting
  }, {
    id: "lying_bed",
    text: "Deitar na cama",
    emoji: QUIZ_EMOJIS.page12.lying_bed
  }, {
    id: "others",
    text: "Outros",
    emoji: QUIZ_EMOJIS.page12.others
  }, {
    id: "no_difficulties",
    text: "Não tenho dificuldades",
    emoji: QUIZ_EMOJIS.page12.no_difficulties
  }];

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('quiz.physical_difficulties');
    if (saved) {
      setSelectedDifficulty(saved);
    }
  }, []);

  // Save to localStorage when selection changes
  useEffect(() => {
    if (selectedDifficulty) {
      localStorage.setItem('quiz.physical_difficulties', selectedDifficulty);
    }
  }, [selectedDifficulty]);
  const handleOptionSelect = (optionId: string) => {
    setSelectedDifficulty(optionId);

    // Save answer usando chave canônica (como array)
    addAnswer('dificuldades_fisicas', [optionId]);

    // Track selection
    if (typeof window !== 'undefined' && (window as any).gtag) {
      const timeSpent = Date.now() - startTimeRef.current;
      (window as any).gtag('event', 'difficulties_selected', {
        page: 'P12',
        selected: optionId,
        time_spent_ms: timeSpent
      });
    }
    audio.onSelect?.();

    // Auto-advance after selection with delay for visual feedback
    setTimeout(() => {
      audio.onNext?.();
      nextPage();
    }, 300);
  };
  return <ProfessionalQuizLayout headerTitle="Análise pessoal">
      <div className="space-y-4 max-w-md mx-auto px-4">
        {/* Título e subtítulo */}
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold text-foreground">
            Você enfrenta alguma dificuldade no dia a dia devido ao peso?
          </h1>
          <p className="text-xs text-muted-foreground">
            Selecione abaixo
          </p>
        </div>

        {/* Fieldset com opções em grid 2x2 */}
        <fieldset className="space-y-3">
          <legend className="sr-only">Você enfrenta alguma dificuldade no dia a dia devido ao peso?</legend>
          <div className="grid grid-cols-2 gap-3">
            {options.map(option => {
            const isSelected = selectedDifficulty === option.id;
            return <div key={option.id}>
                  {/* Label acessível com radio - altura fixa para uniformidade */}
                  <label className={`
                      w-full h-24 p-3 rounded-xl border-2 transition-all duration-150 cursor-pointer
                      focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2
                      flex flex-col items-center justify-center gap-2 text-center
                      ${isSelected ? 'border-primary bg-primary/5 shadow-sm' : 'border-border bg-card hover:border-primary/30'}
                    `}>
                    <input type="radio" name="dificuldade" value={option.id} checked={isSelected} onChange={() => handleOptionSelect(option.id)} className="sr-only" />
                    <div className="flex-shrink-0 text-2xl">
                      {option.emoji}
                    </div>
                    <span className={`
                      text-xs font-medium transition-colors leading-tight px-1
                      ${isSelected ? 'text-foreground' : 'text-foreground/90'}
                    `}>
                      {option.text}
                    </span>
                  </label>
                </div>;
          })}
          </div>
        </fieldset>

        {/* Microcopy */}
        <div className="pt-2">
          
        </div>
      </div>
    </ProfessionalQuizLayout>;
};