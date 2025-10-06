import React, { useState } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { useQuiz } from '@/contexts/QuizContext';
import { useQuizStep } from '@/hooks/useQuizStep';
import { QuizPageProps } from '@/types/quiz';
import { SmartImage } from '@/components/ui/SmartImage';
export const Page06WeightGoal: React.FC<QuizPageProps> = ({
  audio = {}
}) => {
  useQuizStep('Meta de Peso');
  const {
    addAnswer,
    nextPage
  } = useQuiz();
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const weightGoalOptions = [{
    id: "5-10kg",
    text: "5-10 kg",
    image: "/lovable-uploads/6fcbd0a4-de1f-4f47-9024-443760612239.png" // Balança com fita métrica
  }, {
    id: "10-15kg",
    text: "10-15 kg",
    image: "/lovable-uploads/6fcbd0a4-de1f-4f47-9024-443760612239.png" // Balança com fita métrica
  }, {
    id: "15-25kg",
    text: "15-25 kg",
    image: "/lovable-uploads/6fcbd0a4-de1f-4f47-9024-443760612239.png" // Balança com fita métrica
  }, {
    id: "no-exact-goal",
    text: "Não tenho meta exata",
    image: "/lovable-uploads/6b14fbdb-5b15-42cf-8853-4c5e65e769bf.png" // Figura com interrogações
  }];
  const handleGoalSelect = (goalId: string, goalText: string) => {
    setSelectedGoal(goalId);
    addAnswer('meta_peso', goalText);
    audio.onSelect?.();
    setTimeout(() => {
      audio.onNext?.();
      nextPage();
    }, 500);
  };
  return <ProfessionalQuizLayout headerTitle="Meu perfil">
      <div className="space-y-8 animate-betterme-page-enter">
        {/* Título da pergunta */}
        <div className="text-center space-y-4">
          <h2 className="betterme-question-title">
            Quantos quilos deseja perder?
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">A rotina dos chás bariátricos pode eliminar gordura de forma acelerada.</p>
        </div>

        {/* Grade de opções de meta de peso - layout BetterMe */}
        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
          {weightGoalOptions.map(option => <button key={option.id} onClick={() => handleGoalSelect(option.id, option.text)} className="relative overflow-hidden rounded-2xl bg-white shadow-lg border border-border hover:shadow-xl transition-all duration-200 group">
              {/* Container da imagem com proporção correta */}
              <div className="relative h-48 w-full overflow-hidden">
                <SmartImage src={option.image} alt={option.text} currentPage={6} priority="critical" skeletonType="avatar" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300" />
                
                {/* Label da meta - estilo BetterMe */}
                <div className="absolute bottom-0 left-0 right-0 bg-primary text-white px-4 py-3 rounded-b-2xl">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">
                      {option.text}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </button>)}
        </div>
      </div>
    </ProfessionalQuizLayout>;
};