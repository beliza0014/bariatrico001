// ARCHIVED - Originally Page22TripleAnalysis
// This page has been moved to archived/ directory for future use  
// Original functionality preserved for reference

import React, { useState, useEffect } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { useQuizStep } from '@/hooks/useQuizStep';
import { useQuiz } from '@/contexts/QuizContext';
import { QuizPageProps } from '@/types/quiz';

export const Page22TripleAnalysis: React.FC<QuizPageProps> = ({ audio = {} }) => {
  useQuizStep('Analise_Tripla');
  const { nextPage } = useQuiz();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const analysisSteps = [
    {
      title: "Analisando seu perfil nutricional...",
      subtitle: "Processando suas preferências alimentares e rotina",
      duration: 2000
    },
    {
      title: "Calculando seu metabolismo basal...",
      subtitle: "Determinando suas necessidades calóricas personalizadas",
      duration: 2500
    },
    {
      title: "Criando sua fórmula personalizada...",
      subtitle: "Ajustando ingredientes para máxima eficácia",
      duration: 2000
    }
  ];

  useEffect(() => {
    audio.onShow?.();
    
    let stepTimer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;
    
    // Start progress animation
    const startProgress = () => {
      const stepDuration = analysisSteps[currentStep]?.duration || 2000;
      let progressValue = 0;
      
      progressTimer = setInterval(() => {
        progressValue += 2;
        setProgress(progressValue);
        
        if (progressValue >= 100) {
          clearInterval(progressTimer);
          
          if (currentStep < analysisSteps.length - 1) {
            setCurrentStep(prev => prev + 1);
            setProgress(0);
          } else {
            // Analysis complete, advance to next page
            setTimeout(() => {
              audio.onNext?.();
              nextPage();
            }, 500);
          }
        }
      }, stepDuration / 50);
    };

    startProgress();

    return () => {
      if (stepTimer) clearTimeout(stepTimer);
      if (progressTimer) clearInterval(progressTimer);
    };
  }, [currentStep]);

  const currentAnalysis = analysisSteps[currentStep];

  return (
    <ProfessionalQuizLayout headerTitle="Processando" showProgress={false}>
      <div className="animate-betterme-page-enter min-h-[60vh] flex flex-col justify-center">
        {/* Analysis Content */}
        <div className="text-center space-y-8 max-w-md mx-auto">
          {/* Loading Animation */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
            <div 
              className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"
              style={{ animationDuration: '1s' }}
            ></div>
            <div className="absolute inset-4 flex items-center justify-center">
              <div className="text-2xl font-bold text-primary">
                {Math.round((currentStep + 1) / analysisSteps.length * 100)}%
              </div>
            </div>
          </div>

          {/* Current Step */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              {currentAnalysis?.title}
            </h2>
            <p className="text-muted-foreground text-lg">
              {currentAnalysis?.subtitle}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center space-x-4 pt-4">
            {analysisSteps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index < currentStep 
                    ? 'bg-primary' 
                    : index === currentStep 
                    ? 'bg-primary/50' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Motivational Message */}
          <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 mt-8">
            <p className="text-sm text-foreground">
              <strong>Aguarde!</strong> Estamos criando um plano exclusivo baseado em suas respostas. 
              Este processo garante os melhores resultados para seu perfil.
            </p>
          </div>
        </div>
      </div>
    </ProfessionalQuizLayout>
  );
};