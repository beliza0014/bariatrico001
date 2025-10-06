import React, { useState, useEffect } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { useQuizStep } from '@/hooks/useQuizStep';
import { useQuiz } from '@/contexts/QuizContext';
import { QuizPageProps } from '@/types/quiz';
import { QUIZ_EMOJIS } from '@/constants/quizEmojis';
export const Page15WeightTriggers: React.FC<QuizPageProps> = ({
  audio = {}
}) => {
  useQuizStep('Barreiras');
  const {
    addAnswer,
    nextPage
  } = useQuiz();
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [lastTrackTime, setLastTrackTime] = useState(0);

  // Novas opções conforme especificação
  const options = [{
    id: "insatisfeita_acima_peso",
    text: "Não, porque me sinto acima do peso e isso afeta minha autoestima",
    subtitle: "",
    emoji: QUIZ_EMOJIS.page15.insatisfeita_acima_peso
  }, {
    id: "satisfeita_pode_melhorar",
    text: "Sim, mas sei que posso melhorar minha saúde",
    subtitle: "",
    emoji: QUIZ_EMOJIS.page15.satisfeita_pode_melhorar
  }, {
    id: "perder_peso_bem_estar",
    text: "Não, gostaria de perder peso para melhorar meu bem-estar",
    subtitle: "",
    emoji: QUIZ_EMOJIS.page15.perder_peso_bem_estar
  }, {
    id: "nao_corresponde_objetivos",
    text: "Não, minha aparência física não corresponde aos meus objetivos de saúde",
    subtitle: "",
    emoji: QUIZ_EMOJIS.page15.nao_corresponde_objetivos
  }];

  // Carregar dados do localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("lm_barriers");
    if (savedData) {
      setSelectedOption(savedData);
    }
  }, []);
  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    localStorage.setItem("lm_barriers", optionId);
    addAnswer("gatilhos", optionId); // Chave canônica

    // Tracking com guard de timestamp
    const now = Date.now();
    if (now - lastTrackTime > 500) {
      setLastTrackTime(now);
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'barriers_selected', {
          page: 'P15',
          barrier: optionId
        });
      }
    }
    audio.onSelect?.();

    // Auto-advance após seleção
    setTimeout(() => {
      audio.onNext?.();
      nextPage();
    }, 300);
  };
  const handleContinue = () => {
    // Função removida pois agora auto-avança
  };
  return <ProfessionalQuizLayout headerTitle="Análise pessoal">
      <div className="space-y-6 max-w-md mx-auto px-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Você se sente satisfeita com a sua aparência física atual?
          </h1>
          <p className="text-sm text-muted-foreground">
            Selecione abaixo
          </p>
        </div>

        <fieldset className="space-y-3">
          <legend className="sr-only">Você se sente satisfeita com a sua aparência física atual?</legend>
          {options.map(option => {
          const isSelected = selectedOption === option.id;
          return <div key={option.id}>
                <label className={`w-full min-h-[60px] p-4 rounded-xl border-2 transition-all duration-150 cursor-pointer
                    focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2
                    flex items-center gap-3
                    ${isSelected ? 'border-primary bg-primary/5 shadow-sm' : 'border-border bg-card hover:border-primary/30'}`}>
                  <input type="radio" name="barriers" checked={isSelected} onChange={() => handleOptionSelect(option.id)} className="sr-only" />
                  <div className="flex-shrink-0 text-2xl">
                    {option.emoji}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className={`font-medium transition-colors ${isSelected ? 'text-foreground' : 'text-foreground/90'}`}>
                      {option.text}
                    </span>
                    <span className={`text-sm transition-colors leading-tight ${isSelected ? 'text-muted-foreground' : 'text-muted-foreground/70'}`}>
                      {option.subtitle}
                    </span>
                  </div>
                </label>
              </div>;
        })}
        </fieldset>

        {/* Microcopy */}
        <div className="pt-2">
          
        </div>
      </div>
    </ProfessionalQuizLayout>;
};