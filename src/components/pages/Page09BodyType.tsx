import React, { useState } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { UnifiedQuizQuestion } from '@/components/quiz/UnifiedQuizQuestion';
import { useQuizStep } from '@/hooks/useQuizStep';
import { useQuiz } from '@/contexts/QuizContext';
import { QuizPageProps } from '@/types/quiz';
import { Check } from 'lucide-react';

export const Page09BodyType: React.FC<QuizPageProps> = ({ audio = {} }) => {
  useQuizStep('Tipo_de_Corpo');
  const { getAnswer, addAnswer, nextPage, updateUserInfo } = useQuiz();
  const [selectedOption, setSelectedOption] = useState<string>('');
  
  // Obter o gênero selecionado na página 3 (chave canônica)
  const genderAnswer = getAnswer('genero');
  const isUserMale = genderAnswer?.answer === 'Homem';
  
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
    { id: "barriga_falsa", text: "Regular" },
    { id: "flacida", text: "Flácido" },
    { id: "sobrepeso", text: "Sobrepeso" }
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
    addAnswer("corpo_dos_sonhos", selectedText);
    updateUserInfo({ body_type: optionId });
    audio.onSelect?.();
    
    // Auto advance after a short delay like in the reference
    setTimeout(() => {
      audio.onNext?.();
      nextPage();
    }, 800);
  };

  return (
    <ProfessionalQuizLayout headerTitle="Meu perfil">
      <div className="animate-betterme-page-enter space-y-8 max-w-lg mx-auto">
        {/* Title and Subtitle */}
        <div className="text-center space-y-3">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Qual é o seu tipo de corpo atual?
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Vamos personalizar os Chás que funcionem para seu tipo de corpo.
          </p>
        </div>

        {/* Options List - Vertical layout like reference */}
        <div className="space-y-3">
          {options.map((option, index) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className={`
                w-full flex items-center gap-4 p-4 rounded-2xl border-2 
                transition-all duration-300 hover:scale-[1.02]
                ${selectedOption === option.id 
                  ? 'border-primary bg-primary/5 shadow-md' 
                  : 'border-border bg-background hover:border-primary/50'
                }
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Body Image - smaller on the left */}
              <div className="w-16 h-20 flex-shrink-0">
                <img 
                  src={option.image} 
                  alt={option.text}
                  className="w-full h-full object-cover rounded-lg"
                  loading="eager"
                />
              </div>
              
              {/* Text Label - centered */}
              <div className="flex-1 text-center">
                <p className="font-semibold text-foreground text-base md:text-lg">
                  {option.text}
                </p>
              </div>

              {/* Selection indicator */}
              <div className="flex-shrink-0">
                {selectedOption === option.id ? (
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg animate-betterme-confirm">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-border bg-background" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </ProfessionalQuizLayout>
  );
};