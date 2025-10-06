// ARCHIVED - Originally Page05Question3  
// This page has been moved to archived/ directory for future use
// Original functionality preserved for reference
// @ts-nocheck - Variables removed from active quiz flow

import React, { useState } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { useQuiz } from '@/contexts/QuizContext';
import { useQuizStep } from '@/hooks/useQuizStep';
import { QuizPageProps } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { SmartImage } from '@/components/ui/SmartImage';

export const Page05Question3: React.FC<QuizPageProps> = ({ audio = {} }) => {
  useQuizStep('Idade');
  const { addAnswer, nextPage, updateUserInfo, getAnswer } = useQuiz();
  const [selectedAge, setSelectedAge] = useState<string>('');
  const [showMotivational, setShowMotivational] = useState<boolean>(true);

  // Obter o gênero selecionado na página 3
  const genderAnswer = getAnswer('Qual é o seu sexo?');
  const isUserMale = genderAnswer?.answer === 'Masculino';

  // Imagens baseadas no gênero selecionado
  const maleAgeImages = {
    "18-29": "/lovable-uploads/7573e5f7-fdbf-4498-b6c1-a986d5df7a8a.png",
    "30-39": "/lovable-uploads/aa599f6b-777e-463b-98e2-576212bc6024.png", 
    "40-49": "/lovable-uploads/ff6e48ac-e1e6-48e7-b611-c84e697c39db.png",
    "50+": "/lovable-uploads/5368c3f8-be79-4c02-8b95-85dce74c577c.png"
  };

  const femaleAgeImages = {
    "18-29": "/lovable-uploads/9ea5f56b-b44a-4ee2-90df-9fcfd0024515.png",
    "30-39": "/lovable-uploads/b06d4142-0440-43cd-97fb-3a3401da684f.png",
    "40-49": "/lovable-uploads/734b1843-e6ce-42ef-9a9b-7112f1dc6993.png",
    "50+": "/lovable-uploads/ad141648-1244-447c-8bab-467216811b8a.png"
  };

  // Selecionar imagens baseado no gênero
  const selectedImages = isUserMale ? maleAgeImages : femaleAgeImages;

  const ageOptions = [
    { 
      id: "18-29", 
      text: "Idade: 18-29", 
      image: selectedImages["18-29"]
    },
    { 
      id: "30-39", 
      text: "Idade: 30-39", 
      image: selectedImages["30-39"]
    },
    { 
      id: "40-49", 
      text: "Idade: 40-49", 
      image: selectedImages["40-49"]
    },
    { 
      id: "50+", 
      text: "Idade: 50+", 
      image: selectedImages["50+"]
    }
  ];

  const handleAgeSelect = (ageId: string, ageText: string) => {
    setSelectedAge(ageId);
    addAnswer('Qual sua faixa etária?', ageText);
    updateUserInfo({ age: ageId });
    
    audio.onSelect?.();
    setTimeout(() => {
      audio.onNext?.();
      nextPage();
    }, 500);
  };

  const handleContinueFromMotivational = () => {
    setShowMotivational(false);
    audio.onNext?.();
  };

  // Se deve mostrar a tela motivacional
  if (showMotivational) {
    return (
      <ProfessionalQuizLayout headerTitle="Meu perfil" showBackButton={true}>
        <div className="space-y-8 animate-betterme-page-enter">
          {/* Tela Motivacional */}
          <div className="text-center space-y-6 max-w-md mx-auto px-4">
            {/* Título Principal */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-foreground">
                Você vai arrasar!
              </h1>
              
              {/* Subtítulo */}
              <h2 className="text-xl text-muted-foreground font-medium">
                Nossa receita do chá é uma opção natural e eficaz para todos os níveis.
              </h2>
            </div>

            {/* Texto Principal */}
            <div className="space-y-4 py-6">
              <p className="text-lg text-foreground leading-relaxed">
                Nós vamos ajudar você <strong>acelerar seu metabolismo sem usar nenhuma química</strong> em casa!
              </p>
            </div>

            {/* Botão Continuar - Fixo */}
            <button 
              onClick={handleContinueFromMotivational}
              className="betterme-button-primary"
            >
              CONTINUAR
            </button>
          </div>
        </div>
      </ProfessionalQuizLayout>
    );
  }

  return (
    <ProfessionalQuizLayout headerTitle="Meu perfil">
      <div className="space-y-8 animate-betterme-page-enter">
        {/* Título da pergunta */}
        <div className="text-center space-y-4">
          <h2 className="betterme-question-title">
            Qual sua faixa etária?
          </h2>
        </div>

        {/* Grade de opções de idade - layout BetterMe */}
        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
          {ageOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAgeSelect(option.id, option.text)}
              className="relative overflow-hidden rounded-2xl bg-white shadow-lg border border-border hover:shadow-xl transition-all duration-200 group"
            >
              {/* Container da imagem com proporção correta */}
              <div className="relative h-48 w-full overflow-hidden">
                <SmartImage 
                  src={option.image} 
                  alt={option.text}
                  currentPage={5}
                  priority="critical"
                  skeletonType="avatar"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Label da idade - estilo BetterMe */}
                <div className="absolute bottom-0 left-0 right-0 bg-primary text-white px-4 py-3 rounded-b-2xl">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">
                      {option.text}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <svg 
                        className="w-4 h-4 text-white" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </ProfessionalQuizLayout>
  );
};