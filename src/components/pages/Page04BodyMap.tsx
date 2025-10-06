import React, { useState, useEffect, useRef } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { useQuizStep } from '@/hooks/useQuizStep';
import { useQuiz } from '@/contexts/QuizContext';
import { QuizPageProps } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { TRACKING_EVENTS } from '@/config/globalConstants';
import { useABExperiments } from '@/hooks/useABExperiments';
import { toast } from '@/components/ui/use-toast';
export const Page04BodyMap: React.FC<QuizPageProps> = ({
  audio = {}
}) => {
  useQuizStep('Mapa_Corporal');
  const {
    getAnswer,
    addAnswer,
    nextPage,
    startTime
  } = useQuiz();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [timeOnStep, setTimeOnStep] = useState(0);
  const lastTrackingRef = useRef<number>(0);
  const abExperiments = useABExperiments();

  // Obter o gênero selecionado - usando chave canônica
  const genderAnswer = getAnswer('genero');
  let genderId = 'female'; // fallback
  if (genderAnswer?.answer === 'Homem') genderId = 'male';else if (genderAnswer?.answer === 'Mulher') genderId = 'female';else if (genderAnswer?.answer === 'Prefiro não informar') genderId = 'unspecified';

  // Imagens específicas para cada gênero com fallback neutro
  const bodyImage = genderId === 'male' ? "/lovable-uploads/6c3a3325-1985-4cc4-a41f-8d3599daa4ce.png" // Homem
  : genderId === 'female' ? "/lovable-uploads/99bfc5d4-7a66-41c8-b70c-8a4acf0f5dbb.png" // Mulher
  : "/lovable-uploads/99bfc5d4-7a66-41c8-b70c-8a4acf0f5dbb.png"; // Neutral fallback (same as female)

  // 6 opções conforme especificação atualizada com imagens
  const BODY_AREAS = [{
    id: "hips",
    label: "Culotes",
    image: "/lovable-uploads/38205f58-d2fe-4e98-bac1-10691787fedc.png"
  }, {
    id: "arms",
    label: "Braços",
    image: "/lovable-uploads/ceb04ab6-854c-47ce-a338-1fb43a38f690.png"
  }, {
    id: "abdomen",
    label: "Barriga",
    image: "/lovable-uploads/c963ffa5-fc98-4f2b-93ec-76afbd0e63eb.png"
  }, {
    id: "thighs",
    label: "Coxas",
    image: "/lovable-uploads/354b2074-7ae9-466b-ba17-94221394f8a1.png"
  }, {
    id: "glutes",
    label: "Glúteos",
    image: "/lovable-uploads/2c661a02-b7c7-4144-9d1f-cb7defcbd263.png"
  }, {
    id: "full_body",
    label: "Corpo todo"
  } // Sem imagem
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
    const savedBodyAreas = localStorage.getItem("body_areas");
    if (savedBodyAreas) {
      try {
        const parsed = JSON.parse(savedBodyAreas);
        if (Array.isArray(parsed)) {
          setSelectedOptions(parsed);
        }
      } catch (error) {
        console.warn('Error loading saved body areas:', error);
      }
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
          description: "Escolha até 3 áreas",
          duration: 2500
        });
        return;
      }
      newSelected = [...selectedOptions, optionId];
    }
    setSelectedOptions(newSelected);

    // Persistir no localStorage.lm_body_areas
    localStorage.setItem("lm_body_areas", JSON.stringify(newSelected));
    localStorage.setItem("body_areas", JSON.stringify(newSelected)); // backward compatibility

    // Persistir no QuizContext usando chave canônica
    const selectedLabels = newSelected.map(id => BODY_AREAS.find(area => area.id === id)?.label).filter(Boolean);
    addAnswer("mapa_corporal", selectedLabels);

    // Tracking com debouncing (300ms)
    const now = Date.now();
    if (now - lastTrackingRef.current > 300) {
      lastTrackingRef.current = now;
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'body_map_selected', {
          areas: newSelected,
          primary_area: newSelected[0] || null
        });
      }
    }
    audio.onSelect?.();

    // Auto-advance após 3ª seleção (400ms delay)
    if (newSelected.length === 3) {
      setTimeout(() => {
        handleContinue(true); // passar flag de auto-advance
      }, 400);
    }
  };
  const handleContinue = (isAutoAdvance = false) => {
    if (selectedOptions.length === 0) {
      toast({
        description: "Escolha pelo menos 1 área",
        duration: 2500
      });
      return;
    }

    // Tracking do CTA click
    if (typeof window !== 'undefined' && window.gtag) {
      const eventName = isAutoAdvance ? "auto_advance_next" : "continue_click";
      window.gtag('event', eventName, {
        step: "P04",
        selected: selectedOptions,
        count: selectedOptions.length,
        primary: selectedOptions[0] || null,
        gender: genderId,
        ab_variant: abExperiments.experiments,
        time_on_step_ms: timeOnStep,
        source: isAutoAdvance ? "auto_advance" : "button"
      });
    }
    audio.onNext?.();
    nextPage();
  };
  return <ProfessionalQuizLayout headerTitle="Áreas do corpo" fullWidth>
      <div className="animate-betterme-page-enter">
        {/* Title & microcopy */}
        <div className="text-center mb-4">
          <h1 id="body-areas-title" className="text-2xl font-bold text-foreground mb-2">
            Escolha de 1 a 3 áreas que mais te incomodam
          </h1>
          <p id="body-areas-description" className="text-muted-foreground text-sm mb-2">
            Toque nas opções para personalizar sua análise (máx. 3).
          </p>
          <div className="flex items-center justify-center">
            
          </div>
          
          {/* Chips das áreas selecionadas */}
          {selectedOptions.length > 0 && <div className="flex flex-wrap gap-2 justify-center mt-3 mb-2">
              {selectedOptions.map((optionId, index) => {
            const area = BODY_AREAS.find(area => area.id === optionId);
            return <span key={optionId} className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full border border-primary/20">
                    {index + 1}. {area?.label}
                  </span>;
          })}
            </div>}
        </div>

        {/* Layout unificado com opções acessíveis */}
        <div className="flex gap-2 md:gap-3 h-[calc(100vh-220px)] relative" role="group" aria-labelledby="body-areas-title">
          {/* Coluna esquerda - Opções em lista vertical com acessibilidade total */}
          <div className="w-[50%] md:w-[35%] flex flex-col justify-center space-y-2 md:space-y-3 relative z-10 pr-2">
            {BODY_AREAS.map((area, index) => {
            const isSelected = selectedOptions.includes(area.id);
            const selectionOrder = selectedOptions.indexOf(area.id) + 1;
            return <button key={area.id} onClick={() => handleOptionSelect(area.id)} role="checkbox" aria-checked={isSelected} aria-describedby="body-areas-description" tabIndex={0} className={`
                    relative w-full bg-white/95 backdrop-blur-sm border-2 rounded-xl 
                    p-2 md:p-4 text-left transition-all duration-150 hover:scale-105 
                    min-h-[55px] md:min-h-[60px] flex items-center shadow-md 
                    focus:outline-none focus:ring-2 focus:ring-primary/50
                    ${isSelected ? 'border-primary ring-2 ring-primary/20 bg-primary/10' : 'border-gray-200 hover:border-gray-300'}
                  `} style={{
              animationDelay: `${index * 100}ms`
            }} onKeyDown={e => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                handleOptionSelect(area.id);
              }
            }}>
                  {/* Image indicator ou Checkbox */}
                  <div className="mr-2 md:mr-3 flex-shrink-0">
                    {area.image ?
                // Renderizar imagem para áreas com imagem disponível
                <div className={`
                        relative w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden border-2 transition-all
                        ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-gray-300'}
                      `}>
                        <img src={area.image} alt={area.label} className="w-full h-full object-cover" />
                        {/* Overlay de seleção */}
                        {isSelected && <div className="absolute inset-0 bg-primary/20 flex items-center justify-center rounded-lg">
                            <Check className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                          </div>}
                      </div> :
                // Checkbox padrão para "Corpo todo"
                <div className={`
                        w-4 h-4 md:w-5 md:h-5 rounded border-2 transition-colors flex items-center justify-center
                        ${isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-gray-400 bg-white'}
                      `}>
                        {isSelected && <Check className="w-2.5 h-2.5 md:w-3 md:h-3" />}
                      </div>}
                  </div>
                  
                  {/* Text */}
                  <p className="font-medium text-gray-900 text-xs md:text-sm leading-tight flex-1 mr-1">
                    {area.label}
                  </p>
                  
                  {/* Selection order indicator */}
                  {isSelected && <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {selectionOrder}
                    </div>}
                </button>;
          })}
          </div>

          {/* Coluna direita - Imagem do corpo com gênero apropriado */}
          <div className="flex-1 absolute -right-8 top-0 h-full">
            <div className="w-full h-full overflow-hidden">
              <img src={bodyImage} alt={`${genderId === 'male' ? 'Homem' : genderId === 'female' ? 'Mulher' : 'Pessoa'} - Mapa corporal`} className="w-full h-full object-cover object-right" style={{
              objectPosition: 'right 20%'
            }} loading="eager" />
            </div>
          </div>
        </div>

        {/* Botão Continuar - Sticky bottom */}
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-lg">
          <Button onClick={() => handleContinue(false)} disabled={selectedOptions.length === 0} variant="emerald" size="betterme" className="w-full">
            ANALISAR MINHAS ÁREAS ({selectedOptions.length})
          </Button>
        </div>
      </div>
    </ProfessionalQuizLayout>;
};