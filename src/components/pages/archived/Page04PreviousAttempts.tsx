// ARCHIVED - Originally Page04PreviousAttempts
// This page has been moved to archived/ directory for future use
// Original functionality preserved for reference

import React, { useState } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { useQuizStep } from '@/hooks/useQuizStep';
import { useQuiz } from '@/contexts/QuizContext';
import { QuizPageProps } from '@/types/quiz';
import { Check } from 'lucide-react';

export const Page04PreviousAttempts: React.FC<QuizPageProps> = ({ audio = {} }) => {
  useQuizStep('Tentativas_Anteriores');
  const { getAnswer, addAnswer, nextPage } = useQuiz();
  const [selectedOption, setSelectedOption] = useState<string>('');
  
  // Get gender from previous answer to show appropriate image
  const genderAnswer = getAnswer('Qual é o seu sexo?');
  const isUserMale = genderAnswer?.answer === 'Masculino';
  
  // Images sent by the user
  const femaleImage = "/lovable-uploads/b32d2ae7-11d7-4d02-90a7-54499e23f0df.png"; // Pink workout outfit woman
  const maleImage = "/lovable-uploads/24f260a0-6d52-4ea7-a521-b71b67e3a3c3.png"; // Shirtless man with tattoos
  
  const heroImage = isUserMale ? maleImage : femaleImage;

  const options = [
    { 
      id: "sim", 
      text: "Sim", 
      description: "Já tentei emagrecer antes"
    },
    { 
      id: "nao", 
      text: "Não", 
      description: "Esta é minha primeira tentativa"
    }
  ];

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    const selectedText = options.find(opt => opt.id === optionId)?.text || '';
    addAnswer("Você já tentou emagrecer antes?", selectedText);
    audio.onSelect?.();
    
    // Auto advance after a short delay
    setTimeout(() => {
      audio.onNext?.();
      nextPage();
    }, 800);
  };

  return (
    <ProfessionalQuizLayout headerTitle="Histórico pessoal" fullWidth={true}>
      <div className="animate-betterme-page-enter">
        {/* Title */}
        <div className="text-center mb-1 relative z-30">
          <h2 className="text-2xl font-bold text-foreground mb-1">
            Você já tentou emagrecer antes?
          </h2>
          <p className="text-muted-foreground text-sm">
            Saber sobre suas tentativas anteriores nos ajuda a personalizar melhor seu plano.
          </p>
        </div>

        {/* Layout idêntico ao feminino da Página 19 */}
        <div className="flex gap-3 h-[calc(100vh-160px)] relative -mt-16 z-10">
          {/* Coluna esquerda - Opções em lista vertical */}
          <div className="w-[45%] flex flex-col justify-center space-y-3 relative z-10">
            {options.map((option, index) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                className={`
                  relative w-full bg-white/95 backdrop-blur-sm border-2 rounded-xl p-4 text-left
                  transition-all duration-300 hover:scale-105 min-h-[60px]
                  flex items-center shadow-md
                  ${selectedOption === option.id ? 'border-primary ring-2 ring-primary/20 bg-primary/10' : 'border-gray-200 hover:border-gray-300'}
                `}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Radio Circle - posicionado à esquerda */}
                <div className="mr-3">
                  <div className={`
                    w-5 h-5 rounded-full border-2 transition-colors
                    ${selectedOption === option.id 
                      ? 'bg-primary border-primary' 
                      : 'border-gray-400 bg-white'
                    }
                  `}>
                    {selectedOption === option.id && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Text */}
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm leading-tight">
                    {option.text}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {option.description}
                  </p>
                </div>
                
                {/* Selection indicator - check mark quando selecionado */}
                {selectedOption === option.id && (
                  <div className="ml-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-lg animate-betterme-confirm">
                    <Check className="w-2.5 h-2.5 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Coluna direita - Imagem ocupando o resto */}
          <div className="flex-1 absolute -right-8 top-0 h-full z-0 pointer-events-none">
            <div className="w-full h-full overflow-hidden">
              <img 
                src={heroImage} 
                alt={isUserMale ? "Homem em tentativa de emagrecimento" : "Mulher em tentativa de emagrecimento"}
                className="w-full h-full object-cover object-right"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </ProfessionalQuizLayout>
  );
};