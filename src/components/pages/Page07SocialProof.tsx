import React from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { useQuiz } from '@/contexts/QuizContext';
import { useQuizStep } from '@/hooks/useQuizStep';
import { QuizPageProps } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { SmartImage } from '@/components/ui/SmartImage';
export const Page07SocialProof: React.FC<QuizPageProps> = ({
  audio = {}
}) => {
  useQuizStep('Prova Social');
  const {
    nextPage
  } = useQuiz();
  const handleContinue = () => {
    audio.onNext?.();
    nextPage();
  };
  return <ProfessionalQuizLayout headerTitle="Resultados Reais">
      <div className="space-y-8 animate-betterme-page-enter max-w-2xl mx-auto">
        {/* Logo dos Chás Bariátricos */}
        

        {/* Título principal */}
        <div className="text-center space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
            Veja o Resultado dos Chás Bariátricos na Vida da Mariana
          </h2>
          
          {/* Texto descritivo */}
          <p className="text-gray-700 text-sm md:text-base leading-relaxed px-4">
            Com dificuldades para emagrecer e muita ansiedade, Mariana incluiu 
            os chás bariátricos em sua rotina noturna. Em apenas três semanas, 
            perdeu <span className="font-bold text-green-600">9 kg</span>, melhorando sua autoestima e vida.
          </p>
        </div>

        {/* Imagens de antes e depois */}
        <div className="relative overflow-hidden rounded-2xl shadow-xl">
          <SmartImage src="/lovable-uploads/1dc22174-9e4e-4794-9445-fa26141e7ab5.png" alt="Transformação da Mariana - Antes e Depois" currentPage={7} priority="critical" skeletonType="card" className="w-full h-auto object-cover" />
        </div>

        {/* Botão Continuar */}
        <div className="pt-6">
          <Button onClick={handleContinue} className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold rounded-2xl transition-all duration-200 transform hover:scale-[1.02]">
            Continuar
          </Button>
        </div>

        {/* Pequeno texto de disclamer */}
        <div className="text-center">
          
        </div>
      </div>
    </ProfessionalQuizLayout>;
};