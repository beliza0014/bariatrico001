import React, { useState, useEffect, useRef } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { useQuizStep } from '@/hooks/useQuizStep';
import { useQuiz } from '@/contexts/QuizContext';
import { QuizPageProps } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { TRACKING_EVENTS } from '@/config/globalConstants';
import { useABExperiments } from '@/hooks/useABExperiments';
import { toast } from '@/components/ui/use-toast';
import { QUIZ_EMOJIS } from '@/constants/quizEmojis';

export const Page06WeightImpact: React.FC<QuizPageProps> = ({ audio = {} }) => {
  useQuizStep('Impacto_do_Peso');
  const { getAnswer, addAnswer, nextPage, startTime } = useQuiz();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [customText, setCustomText] = useState<string>('');
  const [timeOnStep, setTimeOnStep] = useState(0);
  const lastTrackingRef = useRef<number>(0);
  const abExperiments = useABExperiments();
  
  // Obter o gênero para personalizar textos (compatível com P03)
  const genderAnswer = getAnswer('Qual é o seu gênero?');
  let genderId = 'female'; // fallback
  if (genderAnswer?.answer === 'Homem') genderId = 'male';
  else if (genderAnswer?.answer === 'Mulher') genderId = 'female';
  else if (genderAnswer?.answer === 'Prefiro não informar') genderId = 'unspecified';
  
  // Opções reordenadas por relevância conforme especificação
  const WEIGHT_IMPACT_OPTIONS = [
    { 
      id: "clothes_tight", 
      label: "Roupas apertadas",
      emoji: QUIZ_EMOJIS.page06.clothes_tight
    },
    { 
      id: "fatigue_low_energy", 
      label: "Cansaço no dia a dia",
      emoji: QUIZ_EMOJIS.page06.fatigue_low_energy
    },
    { 
      id: "low_self_esteem", 
      label: "Autoestima em baixa",
      emoji: QUIZ_EMOJIS.page06.low_self_esteem
    },
    { 
      id: "joint_pain", 
      label: "Dores nas articulações",
      emoji: QUIZ_EMOJIS.page06.joint_pain
    },
    { 
      id: "medical_checks", 
      label: "Exames/saúde",
      emoji: QUIZ_EMOJIS.page06.medical_checks
    },
    { 
      id: "other", 
      label: "Outro (opcional)",
      emoji: QUIZ_EMOJIS.page06.other,
      allowCustomText: true,
      placeholder: "Digite aqui (máx. 60 caracteres)"
    }
  ];

  // Time tracking para analytics
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOnStep(Date.now() - startTime);
    }, 100);
    return () => clearInterval(interval);
  }, [startTime]);

  // Carregar seleções do localStorage ao montar
  useEffect(() => {
    const savedData = localStorage.getItem("lm_impacts");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (Array.isArray(parsed)) {
          setSelectedOptions(parsed);
        }
      } catch (error) {
        console.warn('Error loading saved impacts:', error);
      }
    }
    
    const savedCustomText = localStorage.getItem("impact_other");
    if (savedCustomText) {
      setCustomText(savedCustomText);
    }
  }, []);

  const handleOptionSelect = (optionId: string) => {
    const currentIndex = selectedOptions.indexOf(optionId);
    let newSelected: string[];
    
    if (currentIndex >= 0) {
      // Remove se já estiver selecionado
      newSelected = selectedOptions.filter(id => id !== optionId);
    } else {
      // Adicionar se não atingiu limite de 3
      if (selectedOptions.length >= 3) {
        toast({
          description: "Escolha até 3 opções",
          duration: 2500,
        });
        return;
      }
      newSelected = [...selectedOptions, optionId];
    }
    
    setSelectedOptions(newSelected);
    
    // Persistir no localStorage.lm_impacts
    localStorage.setItem("lm_impacts", JSON.stringify(newSelected));
    
    // Mapear flags para personalização posterior
    const flags = {
      impact_clothes: newSelected.includes('clothes_tight'),
      impact_fatigue: newSelected.includes('fatigue_low_energy'),
      impact_joint_pain: newSelected.includes('joint_pain'),
      impact_self_esteem: newSelected.includes('low_self_esteem'),
      impact_medical: newSelected.includes('medical_checks'),
      impact_other: newSelected.includes('other')
    };
    localStorage.setItem("p06_impact_flags", JSON.stringify(flags));
    
    // Persistir no QuizContext
    const selectedLabels = newSelected.map(id => 
      WEIGHT_IMPACT_OPTIONS.find(option => option.id === id)?.label
    ).filter(Boolean);
    addAnswer("Como isso impacta seu dia a dia?", selectedLabels);
    
    // Tracking com debouncing (300ms)
    const now = Date.now();
    if (now - lastTrackingRef.current > 300) {
      lastTrackingRef.current = now;
      
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'weight_impact_selected', {
          impacts: newSelected,
          has_other: newSelected.includes('other')
        });
      }
    }
    
    audio.onSelect?.();
  };

  const handleContinue = () => {
    if (selectedOptions.length === 0) {
      toast({
        description: "Escolha pelo menos 1 opção",
        duration: 2500,
      });
      return;
    }

    // Tracking do CTA click
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'continue_click', {
        step: "P06",
        selected: selectedOptions,
        selected_count: selectedOptions.length,
        variant: abExperiments.experiments,
        gender: genderId,
        time_on_step_ms: timeOnStep
      });
    }
    
    audio.onNext?.();
    nextPage();
  };

  return (
    <ProfessionalQuizLayout headerTitle="Análise pessoal">
      <div className="animate-betterme-page-enter">
        {/* Title & microcopy */}
        <div className="text-center mb-6">
          <h1 id="p06-title" className="text-2xl font-bold text-foreground mb-2">
            Como isso impacta seu dia a dia?
          </h1>
          <p className="text-muted-foreground text-sm mb-2">
            Escolha todas as que se aplicam.
          </p>
          <div className="flex items-center justify-center">
            <span className="text-primary font-medium text-sm" aria-live="polite">
              Selecionadas {selectedOptions.length}/3
            </span>
          </div>
        </div>

        {/* Opções com acessibilidade completa */}
        <div 
          className="space-y-3 mb-6"
          role="group"
          aria-labelledby="p06-title"
        >
          {WEIGHT_IMPACT_OPTIONS.map((option, index) => {
            const isSelected = selectedOptions.includes(option.id);
            
            return (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                role="checkbox"
                aria-checked={isSelected}
                aria-describedby={`desc-${option.id}`}
                tabIndex={0}
                title={option.id === 'medical_checks' ? 'Orientação geral; não substitui avaliação médica' : undefined}
                className={`
                  relative w-full bg-white/95 backdrop-blur-sm border-2 rounded-xl p-4 text-left
                  transition-all duration-150 hover:scale-[1.02] min-h-[44px]
                  flex items-center shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50
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
                {/* Icon */}
                <div className="mr-4 text-2xl">
                  {option.emoji}
                </div>
                
                {/* Text */}
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm leading-tight">
                    {option.label}
                  </p>
                  {/* Hidden description for aria-describedby */}
                  <span id={`desc-${option.id}`} className="sr-only">
                    {option.id === 'medical_checks' ? 'Orientação geral; não substitui avaliação médica' : option.label}
                  </span>
                </div>
                
                {/* Tooltip icon para exames/saúde */}
                {option.id === 'medical_checks' && (
                  <div className="ml-2 text-muted-foreground">
                    <Info className="w-4 h-4" />
                  </div>
                )}
                
                {/* Selection indicator */}
                <div className={`
                  ml-2 w-5 h-5 rounded border-2 transition-colors flex items-center justify-center
                  ${isSelected 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'border-gray-400 bg-white'
                  }
                `}>
                  {isSelected && (
                     <div className="w-2.5 h-2.5 rounded bg-white" />
                  )}
                </div>
              </button>
            );
          })}
          
          {/* Input inline para "Outro" quando selecionado */}
          {selectedOptions.includes('other') && (
            <div className="mt-3 px-4 animate-in fade-in slide-in-from-top-1 duration-200">
              <input
                type="text"
                value={customText}
                onChange={(e) => {
                  const sanitized = e.target.value.trim().substring(0, 60);
                  setCustomText(sanitized);
                  localStorage.setItem("impact_other", sanitized);
                }}
                placeholder="Digite aqui (máx. 60 caracteres)"
                maxLength={60}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                aria-label="Digite seu impacto personalizado"
              />
              <p className="text-xs text-muted-foreground/60 mt-1">
                {customText.length}/60 caracteres
              </p>
            </div>
          )}
        </div>

        {/* Chips das opções selecionadas */}
        {selectedOptions.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {selectedOptions.map((optionId, index) => {
              const option = WEIGHT_IMPACT_OPTIONS.find(opt => opt.id === optionId);
              return (
                <span 
                  key={optionId}
                  className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full border border-primary/20"
                >
                  {index + 1}. {option?.label}
                </span>
              );
            })}
          </div>
        )}

        {/* CTA com feedback dinâmico */}
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-lg">
          <Button 
            onClick={handleContinue}
            disabled={selectedOptions.length === 0}
            variant="emerald"
            size="betterme"
            className="w-full"
          >
            {selectedOptions.length > 0 
              ? `Continuar (${selectedOptions.length}/3)` 
              : 'Continuar (0/3)'
            }
          </Button>
        </div>
      </div>
    </ProfessionalQuizLayout>
  );
};