// ARCHIVED - Originally Page09DreamBody
// This page has been moved to archived/ directory for future use
// Original functionality preserved for reference

import React, { useState } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { UnifiedQuizQuestion } from '@/components/quiz/UnifiedQuizQuestion';
import { useQuizStep } from '@/hooks/useQuizStep';
import { useQuiz } from '@/contexts/QuizContext';
import { QuizPageProps } from '@/types/quiz';
import { Check } from 'lucide-react';

export const Page09DreamBody: React.FC<QuizPageProps> = ({ audio = {} }) => {
  useQuizStep('Corpo_dos_Sonhos');
  const { getAnswer, addAnswer, nextPage } = useQuiz();
  const [selectedOption, setSelectedOption] = useState<string>('');
  
  // Obter o gênero selecionado na página 3
  const genderAnswer = getAnswer('Qual é o seu sexo?');
  const isUserMale = genderAnswer?.answer === 'Masculino';
  
  // Female images - new images from user upload for dream body
  const femaleImages = {
    magro: '/lovable-uploads/d39840c3-217d-4b2c-8c2c-32b74f0d67f9.png',
    tonificado: '/lovable-uploads/8eea1905-381d-4aef-a123-6ed8681ec95a.png',
    com_curvas: '/lovable-uploads/d6dc8632-3cfc-4cb6-ae32-317b9e7e61a3.png',
    medio: '/lovable-uploads/5f95af04-31fc-4127-be40-b806ebd17a72.png'
  };

  // Male images - reuse the same images from Page07BodyType
  const maleImages = {
    magro: '/lovable-uploads/9d6020ae-3512-402e-acda-4b8509bdee18.png',      // regular
    tonificado: '/lovable-uploads/d6dd4652-ad6e-498c-8155-e875e0910b1f.png', // barriga_falsa
    com_curvas: '/lovable-uploads/96f23253-562e-4671-b88e-44f725230de4.png', // flacida
    medio: '/lovable-uploads/a3fb2acc-8c03-4939-b86a-93c5ac1f0efc.png'       // sobrepeso
  };

  const options = [
    { 
      id: "magro", 
      text: "Magro", 
      image: isUserMale ? maleImages.magro : femaleImages.magro
    },
    { 
      id: "tonificado", 
      text: "Tonificado", 
      image: isUserMale ? maleImages.tonificado : femaleImages.tonificado
    },
    { 
      id: "com_curvas", 
      text: "Com curvas", 
      image: isUserMale ? maleImages.com_curvas : femaleImages.com_curvas
    },
    { 
      id: "medio", 
      text: "Médio", 
      image: isUserMale ? maleImages.medio : femaleImages.medio
    }
  ];

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    const selectedText = options.find(opt => opt.id === optionId)?.text || '';
    addAnswer("Qual é o seu corpo de sonho?", selectedText);
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
            Qual é o seu corpo de sonho?
          </h2>
          <p className="text-muted-foreground text-sm">
            Selecione o tipo físico que você gostaria de alcançar
          </p>
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
              
              {/* Text Label */}
              <div className="p-4 bg-white">
                <p className="font-semibold text-gray-900 text-base">
                  {option.text}
                </p>
              </div>
              
              {/* Radio Circle - positioned like in reference */}
              <div className="absolute bottom-4 right-4">
                <div className={`
                  w-6 h-6 rounded-full border-2 transition-colors
                  ${selectedOption === option.id 
                    ? 'bg-primary border-primary' 
                    : 'border-gray-300 bg-white'
                  }
                `}>
                  {selectedOption === option.id && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-white" />
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