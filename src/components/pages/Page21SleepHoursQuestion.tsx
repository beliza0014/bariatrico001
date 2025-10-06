import React, { useState, useEffect } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { useQuizStep } from '@/hooks/useQuizStep';
import { useQuiz } from '@/contexts/QuizContext';
import { QuizPageProps } from '@/types/quiz';
import { useToast } from '@/hooks/use-toast';
import { QUIZ_EMOJIS } from '@/constants/quizEmojis';
export const Page21SleepHoursQuestion: React.FC<QuizPageProps> = ({
  audio = {}
}) => {
  useQuizStep('Horas_Sono');
  const {
    addAnswer,
    nextPage
  } = useQuiz();
  const {
    toast
  } = useToast();
  const [selectedOption, setSelectedOption] = useState<string>('');

  // Restore selection from localStorage
  useEffect(() => {
    const savedSleep = localStorage.getItem('sleep_hours');
    if (savedSleep) {
      setSelectedOption(savedSleep);
    }
  }, []);
  const options = [{
    id: "menos_5_horas",
    text: "Menos de 5 horas",
    emoji: QUIZ_EMOJIS.page21.menos_5_horas,
    description: "Sono insuficiente"
  }, {
    id: "entre_5_7_horas",
    text: "Entre 5 e 7 horas",
    emoji: QUIZ_EMOJIS.page21.entre_5_7_horas,
    description: "Sono limitado"
  }, {
    id: "entre_7_9_horas",
    text: "Entre 7 e 9 horas",
    emoji: QUIZ_EMOJIS.page21.entre_7_9_horas,
    description: "Sono adequado"
  }, {
    id: "mais_9_horas",
    text: "Mais de 9 horas",
    emoji: QUIZ_EMOJIS.page21.mais_9_horas,
    description: "Sono prolongado"
  }];

  // Helper to get sleep label by key
  const getSleepLabel = (key: string): string => {
    const option = options.find(opt => opt.id === key);
    return option?.text || key;
  };
  const handleAnswer = (answer: string | string[]) => {
    const selectedValue = Array.isArray(answer) ? answer[0] : answer;
    setSelectedOption(selectedValue);

    // Save to context and localStorage
    addAnswer('sleep_hours', selectedValue);
    localStorage.setItem('sleep_hours', selectedValue);

    // Track sleep selection
    try {
      // Prevent duplicate tracking by checking if already tracked
      const trackedKey = `sleep_selected_${selectedValue}`;
      if (!sessionStorage.getItem(trackedKey)) {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'sleep_selected', {
            step: 'P21',
            sleep_key: selectedValue,
            sleep_label: getSleepLabel(selectedValue),
            ab_variant: 'default'
          });
        }

        // Mark as tracked to prevent duplicates
        sessionStorage.setItem(trackedKey, 'true');
        console.log('Tracking sleep_selected:', {
          step: 'P21',
          sleep_key: selectedValue,
          sleep_label: getSleepLabel(selectedValue)
        });
      }
    } catch (error) {
      console.warn('Tracking error:', error);
    }
    audio.onValid?.();

    // Auto advance after selection with 800ms delay
    setTimeout(() => {
      audio.onNext?.();
      nextPage();
    }, 800);
  };
  const handleContinue = () => {
    if (!selectedOption) {
      toast({
        title: "Escolha uma opção para continuar.",
        duration: 2500,
        variant: "destructive"
      });
      audio.onInvalid?.();
      return;
    }
    audio.onNext?.();
    nextPage();
  };
  return <ProfessionalQuizLayout headerTitle="Qualidade do sono">
      <div className="animate-betterme-page-enter space-y-6">
        {/* Title and Subtitle */}
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-bold text-foreground">
            Quantas horas de sono você costuma ter por noite?
          </h1>
          <p className="text-base text-muted-foreground">
            A qualidade do seu sono impacta diretamente no seu emagrecimento!
          </p>
        </div>

        {/* Hero Image */}
        <div className="text-center">
          
        </div>

        {/* Options Grid 2x2 */}
        <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
          {options.map(option => {
          const isSelected = selectedOption === option.id;
          return <button key={option.id} onClick={() => handleAnswer(option.id)} className={`
                  p-4 rounded-xl border-2 transition-all duration-200 min-h-[80px]
                  ${isSelected ? 'border-primary bg-primary/10 text-primary shadow-lg scale-105' : 'border-border bg-background hover:border-primary/50 hover:bg-primary/5'}
                `} aria-label={option.text}>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="text-sm font-medium text-center leading-tight">
                    {option.text}
                  </span>
                </div>
              </button>;
        })}
        </div>

        {/* Continue Button */}
        {selectedOption && <div className="text-center pt-4">
            
          </div>}

        {/* Microcopy */}
        <div className="text-center mt-4">
          
        </div>
      </div>
    </ProfessionalQuizLayout>;
};