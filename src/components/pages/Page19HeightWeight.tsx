import React, { useState } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { HeightWeightPicker } from '@/components/ui/height-weight-picker';
import { Button } from '@/components/ui/button';
import { useQuiz } from '@/contexts/QuizContext';
import { useQuizStep } from '@/hooks/useQuizStep';
import { QuizPageProps } from '@/types/quiz';

export const Page19HeightWeight: React.FC<QuizPageProps> = ({ audio = {} }) => {
  useQuizStep('Altura_Peso');
  const { updateUserInfo, nextPage } = useQuiz();
  const [height, setHeight] = useState(165);
  const [weight, setWeight] = useState(70);

  const handleContinue = () => {
    audio.onSelect?.();
    updateUserInfo({ height, weight });
    setTimeout(() => {
      audio.onNext?.();
      nextPage();
    }, 100);
  };

  return (
    <ProfessionalQuizLayout headerTitle="BetterMe">
      <div className="space-y-4 animate-betterme-page-enter bg-gradient-to-br from-emerald-50/20 via-white to-emerald-50/30 rounded-2xl p-4 border border-emerald-100/50">
        <div className="text-center space-y-3">
          <div className="bg-gradient-to-r from-emerald-600 via-emerald-600 to-emerald-700 bg-clip-text text-transparent">
            <h2 className="betterme-question-title font-black tracking-tight">
              Altura e peso atuais
            </h2>
          </div>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-emerald-500 rounded-full mx-auto shadow-sm"></div>
        </div>

        {/* Scrollable Height/Weight Picker */}
        <div className="max-w-lg mx-auto">
          <HeightWeightPicker
            height={height}
            weight={weight}
            onHeightChange={setHeight}
            onWeightChange={setWeight}
            className="space-y-3"
          />
        </div>

        <div className="pt-2">
          <Button
            onClick={handleContinue}
            disabled={!height || !weight}
            variant="emerald"
            size="betterme"
            className="w-full"
          >
            PRÓXIMO PASSO
          </Button>
        </div>
      </div>
    </ProfessionalQuizLayout>
  );
};