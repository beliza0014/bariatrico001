// ARCHIVED - Originally Page23BMIResults
// This page has been moved to archived/ directory for future use
// Original functionality preserved for reference
// @ts-nocheck - Variables removed from active quiz flow

import React, { useEffect, useState } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { useQuizStep } from '@/hooks/useQuizStep';
import { useQuiz } from '@/contexts/QuizContext';
import { InteractiveBMIChart } from '@/components/ui/interactive-bmi-chart';
import { QuizPageProps } from '@/types/quiz';

export const Page23BMIResults: React.FC<QuizPageProps> = ({
  audio = {}
}) => {
  useQuizStep('Resultado_IMC');
  const { userInfo, nextPage } = useQuiz();
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    audio.onShow?.();
    
    // Show results after a brief delay for dramatic effect
    const timer = setTimeout(() => {
      setShowResults(true);
      audio.onReveal?.();
    }, 1000);

    // Auto advance after showing results
    const advanceTimer = setTimeout(() => {
      audio.onNext?.();
      nextPage();
    }, 6000);

    return () => {
      clearTimeout(timer);
      clearTimeout(advanceTimer);
    };
  }, []);

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return {
      category: 'Abaixo do peso',
      color: 'text-blue-600',
      description: 'Pode ser necessário ganhar peso de forma saudável'
    };
    if (bmi < 25) return {
      category: 'Peso normal',
      color: 'text-green-600',
      description: 'Parabéns! Você está na faixa de peso ideal'
    };
    if (bmi < 30) return {
      category: 'Sobrepeso',
      color: 'text-yellow-600',
      description: 'Pequenas mudanças podem trazer grandes benefícios'
    };
    if (bmi < 35) return {
      category: 'Obesidade grau I',
      color: 'text-orange-600',
      description: 'É importante focar em hábitos saudáveis'
    };
    if (bmi < 40) return {
      category: 'Obesidade grau II',
      color: 'text-red-600',
      description: 'Recomenda-se acompanhamento profissional'
    };
    return {
      category: 'Obesidade grau III',
      color: 'text-red-800',
      description: 'É fundamental buscar orientação médica'
    };
  };

  const bmiData = getBMICategory(userInfo.bmi);

  return (
    <ProfessionalQuizLayout headerTitle="Seus resultados">
      <div className="animate-betterme-page-enter space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Seus Resultados Personalizados
          </h2>
          <p className="text-muted-foreground text-lg">
            Com base na sua altura ({userInfo.height}cm) e peso ({userInfo.weight}kg)
          </p>
        </div>

        {showResults && (
          <>
            {/* BMI Display */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-3xl border border-border shadow-xl p-8 mb-8">
                <div className="text-center mb-8">
                  <div className="text-6xl font-bold text-primary mb-2">
                    {userInfo.bmi.toFixed(1)}
                  </div>
                  <div className={`text-xl font-semibold ${bmiData.color} mb-2`}>
                    {bmiData.category}
                  </div>
                  <div className="text-muted-foreground">
                    {bmiData.description}
                  </div>
                </div>

                {/* BMI Chart */}
                <InteractiveBMIChart 
                  initialHeight={userInfo.height}
                  initialWeight={userInfo.weight}
                  className="border-0 shadow-none bg-transparent"
                />
              </div>

              {/* Personalized Message */}
              <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
                <h3 className="text-xl font-semibold text-primary mb-4">
                  {userInfo.name}, aqui está seu plano personalizado
                </h3>
                <div className="space-y-3 text-foreground">
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span>IMC atual: <strong>{userInfo.bmi.toFixed(1)}</strong></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span>Categoria: <strong>{bmiData.category}</strong></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span>Nosso chá foi especialmente formulado para seu perfil</span>
                  </p>
                </div>
              </div>
            </div>
            </>
          )}

          {!showResults && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
    </ProfessionalQuizLayout>
  );
};