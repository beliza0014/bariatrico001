// ARCHIVED - Originally Page21HeightWeight  
// This page has been moved to archived/ directory for future use
// Original functionality preserved for reference
// @ts-nocheck - Variables removed from active quiz flow

import React, { useState } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { useQuizStep } from '@/hooks/useQuizStep';
import { useQuiz } from '@/contexts/QuizContext';
import { HeightWeightPicker } from '@/components/ui/height-weight-picker';
import { QuizPageProps } from '@/types/quiz';

export const Page21HeightWeight: React.FC<QuizPageProps> = ({ audio = {} }) => {
  useQuizStep('Altura_Peso');
  const { addAnswer, nextPage, updateUserInfo } = useQuiz();
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [hasChanged, setHasChanged] = useState(false);

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    setHasChanged(true);
  };

  const handleWeightChange = (newWeight: number) => {
    setWeight(newWeight);
    setHasChanged(true);
  };

  const handleSubmit = () => {
    // Save answers and update user info
    addAnswer('Altura', `${height}cm`);
    addAnswer('Peso', `${weight}kg`);
    updateUserInfo({ 
      height: height, 
      weight: weight 
    });
    
    audio.onSelect?.();
    
    setTimeout(() => {
      audio.onNext?.();
      nextPage();
    }, 300);
  };

  return (
    <ProfessionalQuizLayout headerTitle="Informações pessoais">
      <div className="animate-betterme-page-enter">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Qual sua altura e peso atual?
          </h2>
          <p className="text-muted-foreground text-sm">
            Essas informações nos ajudam a personalizar melhor seu plano
          </p>
        </div>

        {/* Height and Weight Picker */}
        <div className="max-w-md mx-auto">
          <HeightWeightPicker
            height={height}
            weight={weight}
            onHeightChange={handleHeightChange}
            onWeightChange={handleWeightChange}
          />
          
          {/* Continue Button */}
          <div className="mt-8 text-center">
            <button 
              onClick={handleSubmit}
              className="betterme-button-primary"
              disabled={!hasChanged}
            >
              CONTINUAR
            </button>
          </div>
        </div>
      </div>
    </ProfessionalQuizLayout>
  );
};