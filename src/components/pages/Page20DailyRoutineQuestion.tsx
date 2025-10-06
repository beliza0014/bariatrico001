import React, { useState, useEffect } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { UnifiedQuizQuestion } from '@/components/quiz/UnifiedQuizQuestion';
import { useQuizStep } from '@/hooks/useQuizStep';
import { useQuiz } from '@/contexts/QuizContext';
import { QuizPageProps } from '@/types/quiz';
import { useToast } from '@/hooks/use-toast';
import { QUIZ_EMOJIS } from '@/constants/quizEmojis';
export const Page20DailyRoutineQuestion: React.FC<QuizPageProps> = ({
  audio = {}
}) => {
  useQuizStep('Rotina_Diaria');
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
    const savedRoutine = localStorage.getItem('daily_routine_question');
    if (savedRoutine) {
      setSelectedOption(savedRoutine);
    }
  }, []);
  const options = [{
    id: "trabalho_fora_agitada",
    text: "Trabalho fora e tenho uma rotina agitada",
    icon: QUIZ_EMOJIS.page20.trabalho_fora_agitada,
    description: "Rotina corrida e exigente"
  }, {
    id: "trabalho_casa_flexivel",
    text: "Trabalho em casa e tenho uma rotina flexível",
    icon: QUIZ_EMOJIS.page20.trabalho_casa_flexivel,
    description: "Flexibilidade de horários"
  }, {
    id: "casa_cuidando_familia",
    text: "Em casa cuidando da família",
    icon: QUIZ_EMOJIS.page20.casa_cuidando_familia,
    description: "Foco no cuidado familiar"
  }, {
    id: "outro",
    text: "Outro",
    icon: QUIZ_EMOJIS.page20.outro,
    description: "Situação específica"
  }];

  // Helper to get routine label by key
  const getRoutineLabel = (key: string): string => {
    const option = options.find(opt => opt.id === key);
    return option?.text || key;
  };
  const handleAnswer = (answer: string | string[]) => {
    const selectedValue = Array.isArray(answer) ? answer[0] : answer;
    setSelectedOption(selectedValue);

    // Save to context and localStorage
    addAnswer('daily_routine_question', selectedValue);
    localStorage.setItem('daily_routine_question', selectedValue);

    // Track routine selection
    try {
      // Prevent duplicate tracking by checking if already tracked
      const trackedKey = `routine_selected_${selectedValue}`;
      if (!sessionStorage.getItem(trackedKey)) {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'routine_selected', {
            step: 'P20',
            routine_key: selectedValue,
            routine_label: getRoutineLabel(selectedValue),
            ab_variant: 'default'
          });
        }

        // Mark as tracked to prevent duplicates
        sessionStorage.setItem(trackedKey, 'true');
        console.log('Tracking routine_selected:', {
          step: 'P20',
          routine_key: selectedValue,
          routine_label: getRoutineLabel(selectedValue)
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
  return <ProfessionalQuizLayout headerTitle="Sua rotina">
      <UnifiedQuizQuestion title="Como é a sua rotina diária?" subtitle="Vamos personalizar seu plano conforme sua Rotina diária" options={options} onAnswer={handleAnswer} autoAdvance={false} showContinueButton={true} required={true} onSelect={audio.onSelect} onNext={handleContinue} onValid={audio.onValid} onInvalid={audio.onInvalid} />
      
      {/* Microcopy below the CTA */}
      <div className="text-center mt-4">
        
      </div>
    </ProfessionalQuizLayout>;
};