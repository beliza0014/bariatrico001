// ARCHIVED - Originally Page08BodyType
// This page has been moved to archived/ directory for future use
// Original functionality preserved for reference

import React, { useState } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { UnifiedQuizQuestion } from '@/components/quiz/UnifiedQuizQuestion';
import { useQuizStep } from '@/hooks/useQuizStep';
import { useQuiz } from '@/contexts/QuizContext';
import { QuizPageProps } from '@/types/quiz';
import { Check } from 'lucide-react';

export const Page08BodyType: React.FC<QuizPageProps> = ({ audio = {} }) => {
  useQuizStep('Tipo_de_Corpo');
  const { getAnswer, addAnswer, nextPage } = useQuiz();
  const [selectedOption, setSelectedOption] = useState<string>('');
  
  // Obter o gênero selecionado na página 3
  const genderAnswer = getAnswer('Qual é o seu sexo?');
  const isUserMale = genderAnswer?.answer === 'Masculino';
  
  // Novas imagens femininas atualizadas
  const femaleImages = {
    regular: '/lovable-uploads/c24837e6-ee61-4ba9-b6de-9a200a46762d.png',
    barriga_falsa: '/lovable-uploads/57837bef-7591-4ef9-89b1-8e47b0c1eae5.png',
    flacida: '/lovable-uploads/377a8cff-1ed1-469f-980d-ba2699a23f70.png',
    sobrepeso: '/lovable-uploads/40f7afd4-e4e2-4df2-8901-489d1700d3c4.png'
  };

  // Novas imagens masculinas atualizadas
  const maleImages = {
    regular: '/lovable-uploads/9d6020ae-3512-402e-acda-4b8509bdee18.png',
    barriga_falsa: '/lovable-uploads/d6dd4652-ad6e-498c-8155-e875e0910b1f.png',
    flacida: '/lovable-uploads/96f23253-562e-4671-b88e-44f725230de4.png',
    sobrepeso: '/lovable-uploads/a3fb2acc-8c03-4939-b86a-93c5ac1f0efc.png'
  };

  // Define options based on gender
  const maleOptions = [
    { id: "regular", text: "Alguns tamanhos menores" },
    { id: "barriga_falsa", text: "Atlético" },
    { id: "flacida", text: "Trincado" },
    { id: "sobrepeso", text: "Inchado" }
  ];

  const femaleOptions = [
    { id: "regular", text: "Magro" },
    { id: "barriga_falsa", text: "Médio" },
    { id: "flacida", text: "Tamanho grande" },
    { id: "sobrepeso", text: "Significativamente acima do peso" }
  ];

  const textOptions = isUserMale ? maleOptions : femaleOptions;

  const options = [
    { 
      id: "regular", 
      text: textOptions[0].text, 
      image: isUserMale ? maleImages.regular : femaleImages.regular
    },
    { 
      id: "barriga_falsa", 
      text: textOptions[1].text, 
      image: isUserMale ? maleImages.barriga_falsa : femaleImages.barriga_falsa
    },
    { 
      id: "flacida", 
      text: textOptions[2].text, 
      image: isUserMale ? maleImages.flacida : femaleImages.flacida
    },
    { 
      id: "sobrepeso", 
      text: textOptions[3].text, 
      image: isUserMale ? maleImages.sobrepeso : femaleImages.sobrepeso
    }
  ];

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    const selectedText = options.find(opt => opt.id === optionId)?.text || '';
    addAnswer("Qual seu tipo de corpo?", selectedText);
    audio.onSelect?.();
    
    // Auto advance after a short delay like in the reference
    setTimeout(() => {
      audio.onNext?.();
      nextPage();
    }, 800);
  };

  return (
    <ProfessionalQuizLayout headerTitle="Meu perfil">
      <div className="animate-betterme-page-enter space-y-6">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Qual seu tipo de corpo?
          </h2>
        </div>

        {/* Options Grid - 2x2 layout similar to reference */}
        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
          {options.map((option, index) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className={`
                relative bg-white border-2 rounded-2xl overflow-hidden 
                transition-all duration-300 hover:scale-105
                ${selectedOption === option.id ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'}
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Body Image */}
              <div className="aspect-[3/4] relative">
                <img 
                  src={option.image} 
                  alt={option.text}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                
                {/* Selection indicator */}
                {selectedOption === option.id && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg animate-betterme-confirm">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
              </div>
              
              {/* Text Label with Radio Circle */}
              <div className="p-2 bg-white flex items-center gap-2">
                <p className="font-semibold text-gray-900 text-xs sm:text-sm leading-tight flex-1">
                  {option.text}
                </p>
                
                {/* Radio Circle - smaller for mobile */}
                <div className={`
                  w-4 h-4 rounded-full border-2 transition-colors flex-shrink-0
                  ${selectedOption === option.id 
                    ? 'bg-primary border-primary' 
                    : 'border-gray-300 bg-white'
                  }
                `}>
                  {selectedOption === option.id && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </ProfessionalQuizLayout>
  );
};