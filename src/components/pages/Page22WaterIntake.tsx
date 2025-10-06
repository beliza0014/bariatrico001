import React, { useState, useEffect } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { useQuizStep } from '@/hooks/useQuizStep';
import { useQuiz } from '@/contexts/QuizContext';
import { QuizPageProps } from '@/types/quiz';
import { Check, Info } from 'lucide-react';
import { SmartImage } from '@/components/ui/SmartImage';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
export const Page22WaterIntake: React.FC<QuizPageProps> = ({
  audio = {}
}) => {
  useQuizStep('Objecoes_Condicionais');
  const {
    getAnswer,
    addAnswer,
    nextPage
  } = useQuiz();
  const {
    toast
  } = useToast();
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [startTime] = useState<number>(Date.now());

  // Obter o gênero selecionado na página 3
  const genderAnswer = getAnswer('Qual é o seu gênero?');
  const isUserMale = genderAnswer?.answer === 'Homem';

  // Restore selection from localStorage
  useEffect(() => {
    const savedWaterIntake = localStorage.getItem('water_intake');
    if (savedWaterIntake) {
      setSelectedOption(savedWaterIntake);
    }
  }, []);

  // Imagens específicas para cada gênero
  const waterImage = isUserMale ? "/lovable-uploads/f18afb48-8006-4d0f-831f-e15d3bc56d44.png" // Homem bebendo água
  : "/lovable-uploads/29d7889c-ff9c-4b67-85a7-ba7de1e439a3.png"; // Mulher bebendo água

  // Water intake mapping for calculations
  const waterIntakeMapping: Record<string, {
    raw: string;
    value_num: number | null;
    points: number;
  }> = {
    "0_2_copos": {
      raw: "0-2",
      value_num: 2,
      points: 0
    },
    "3_4_copos": {
      raw: "3-4",
      value_num: 4,
      points: 1
    },
    "5_6_copos": {
      raw: "5-6",
      value_num: 6,
      points: 2
    },
    "7_mais_copos": {
      raw: "7+",
      value_num: 8,
      points: 3
    },
    "nao_sei_varia": {
      raw: "unknown",
      value_num: null,
      points: 1
    }
  };
  const options = [{
    id: "0_2_copos",
    text: "💧 0-2 copos por dia"
  }, {
    id: "3_4_copos",
    text: "💧 3-4 copos por dia"
  }, {
    id: "5_6_copos",
    text: "💧 5-6 copos por dia"
  }, {
    id: "7_mais_copos",
    text: "💧 Mais de 7"
  }, {
    id: "nao_sei_varia",
    text: "💧 Não sei / varia"
  }];
  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    const waterData = waterIntakeMapping[optionId];

    // Save to context with basic value and store detailed data separately
    addAnswer("water_intake", optionId);
    addAnswer("water_intake_data", JSON.stringify(waterData));
    localStorage.setItem('water_intake', optionId);

    // Calculate time to answer
    const timeToAnswer = Date.now() - startTime;

    // Track water intake selection
    try {
      const trackedKey = `water_intake_selected_${optionId}`;
      if (!sessionStorage.getItem(trackedKey)) {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'water_intake_selected', {
            step: 24,
            value_raw: waterData.raw,
            value_num: waterData.value_num,
            points: waterData.points,
            time_to_answer_ms: timeToAnswer,
            variant: 'default' // Replace with actual AB variant helper
          });
        }
        sessionStorage.setItem(trackedKey, 'true');
        console.log('Tracking water_intake_selected:', {
          step: 24,
          value_raw: waterData.raw,
          value_num: waterData.value_num,
          points: waterData.points,
          time_to_answer_ms: timeToAnswer
        });
      }
    } catch (error) {
      console.warn('Tracking error:', error);
    }
    audio.onValid?.();

    // Auto advance with increased delay
      setTimeout(() => {
        audio.onNext?.();
        nextPage();
      }, 300);
  };
  const handleContinue = () => {
    if (!selectedOption) {
      toast({
        title: "Escolha uma opção para continuar.",
        duration: 2500,
        variant: "destructive"
      });
      audio.onInvalid?.();
      return;
    }
    audio.onNext?.();
    nextPage();
  };
  return <ProfessionalQuizLayout headerTitle="Estilo de vida e hábitos" fullWidth={!isUserMale}>
      <div className="animate-betterme-page-enter">
        {/* Title */}
        <div className="text-center mb-4" role="group" aria-labelledby="water-intake-title">
          <div className="flex items-center justify-center gap-2 mb-1">
            <h2 id="water-intake-title" className="text-2xl font-bold text-foreground">
              Quantos copos de água você bebe por dia?
            </h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-5 h-5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="text-sm">
                    ≈250 ml. Água e chás sem açúcar contam. Refrigerantes e sucos açucarados não.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          
        </div>

        {/* Layout unificado igual à página 4 - Body Map */}
        <div className="flex gap-2 md:gap-3 h-[calc(100vh-220px)] relative" role="radiogroup" aria-labelledby="water-intake-title">
          {/* Coluna esquerda - Opções em lista vertical */}
          <div className="w-[50%] md:w-[35%] flex flex-col justify-center space-y-2 md:space-y-3 relative z-10 pr-2">
            {options.map((option, index) => {
              const isSelected = selectedOption === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  className={`
                    relative w-full bg-white/95 backdrop-blur-sm border-2 rounded-xl 
                    p-2 md:p-4 text-left transition-all duration-150 hover:scale-105 
                    min-h-[55px] md:min-h-[60px] flex items-center shadow-md 
                    focus:outline-none focus:ring-2 focus:ring-primary/50
                    ${isSelected ? 'border-primary ring-2 ring-primary/20 bg-primary/10' : 'border-gray-200 hover:border-gray-300'}
                  `}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      handleOptionSelect(option.id);
                    }
                  }}
                >
                  {/* Radio Circle - posicionado à esquerda */}
                  <div className="mr-2 md:mr-3 flex-shrink-0">
                    <div className={`
                      w-4 h-4 md:w-5 md:h-5 rounded-full border-2 transition-colors flex items-center justify-center
                      ${isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-gray-400 bg-white'}
                    `}>
                      {isSelected && <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  
                  {/* Text */}
                  <p className="font-medium text-gray-900 text-xs md:text-sm leading-tight flex-1 mr-1">
                    {option.text}
                  </p>
                  
                  {/* Selection indicator - check mark quando selecionado */}
                  {isSelected && (
                    <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-primary rounded-full flex items-center justify-center shadow-lg animate-betterme-confirm">
                      <Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-primary-foreground" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Coluna direita - Imagem ocupando o resto do espaço */}
          <div className="flex-1 absolute -right-8 top-0 h-full">
            <div className="w-full h-full overflow-hidden">
              <SmartImage 
                src={waterImage} 
                alt="Pessoa bebendo água" 
                className="w-full h-full object-cover object-right" 
                style={{ objectPosition: 'right 20%' }}
                currentPage={22} 
                priority="critical" 
                skeletonType="card" 
                loading="eager" 
              />
            </div>
          </div>
        </div>

        {/* Botão Continuar - Sticky bottom */}
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-lg">
          <Button 
            onClick={handleContinue} 
            disabled={!selectedOption} 
            variant="emerald" 
            size="betterme" 
            className="w-full"
          >
            Continuar
          </Button>
        </div>
      </div>
    </ProfessionalQuizLayout>;
};