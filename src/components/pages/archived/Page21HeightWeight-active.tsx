// @ts-nocheck - Variables removed from active quiz flow
import React, { useState } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { HeightWeightPicker } from '@/components/ui/height-weight-picker';
import { useQuiz } from '@/contexts/QuizContext';
import { useQuizStep } from '@/hooks/useQuizStep';
import { Button } from '@/components/ui/button';
import { QuizPageProps } from '@/types/quiz';

export const Page21HeightWeight: React.FC<QuizPageProps> = ({ audio = {} }) => {
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
      <div className="space-y-8 animate-betterme-page-enter">
        <div className="text-center space-y-4">
          <h2 className="betterme-question-title">
            Altura e peso atuais
          </h2>
        </div>

        {/* BetterMe Height/Weight Input */}
        <div className="max-w-sm mx-auto space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground block text-center">
                Altura
              </label>
              <div className="bg-white border-2 border-border rounded-xl p-4 focus-within:border-primary transition-colors">
                <input
                  type="number"
                  placeholder="165"
                  value={height}
                  onChange={e => setHeight(Number(e.target.value))}
                  className="w-full text-center text-2xl font-bold border-0 focus:outline-none bg-transparent"
                />
                <p className="text-center text-sm text-muted-foreground mt-1">cm</p>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground block text-center">
                Peso
              </label>
              <div className="bg-white border-2 border-border rounded-xl p-4 focus-within:border-primary transition-colors">
                <input
                  type="number"
                  placeholder="70"
                  value={weight}
                  onChange={e => setWeight(Number(e.target.value))}
                  className="w-full text-center text-2xl font-bold border-0 focus:outline-none bg-transparent"
                />
                <p className="text-center text-sm text-muted-foreground mt-1">kg</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={!height || !weight}
          className="betterme-button-primary"
        >
          PRÓXIMO PASSO
        </button>
      </div>
    </ProfessionalQuizLayout>
  );
};