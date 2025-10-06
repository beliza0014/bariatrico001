import React, { useState, useEffect } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { UnifiedQuizQuestion } from '@/components/quiz/UnifiedQuizQuestion';
import { useQuizStep } from '@/hooks/useQuizStep';
import { useQuiz } from '@/contexts/QuizContext';
import { QuizPageProps } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { GLOBAL_CONSTANTS, TRACKING_EVENTS } from '@/config/globalConstants';
import { useToast } from '@/hooks/use-toast';
import { QUIZ_EMOJIS } from '@/constants/quizEmojis';
export const Page02Question1: React.FC<QuizPageProps> = ({
  audio = {}
}) => {
  useQuizStep('Objetivo_Principal');
  const {
    addAnswer,
    nextPage
  } = useQuiz();
  const {
    toast
  } = useToast();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [startTime] = useState(Date.now());

  // Novas opções de resposta
  const options = [{
    id: "perder_peso",
    goal_id: "weight_loss",
    goal_group: "body",
    text: "Perder peso",
    emoji: QUIZ_EMOJIS.page02.perder_peso
  }, {
    id: "queimar_gordura_figado",
    goal_id: "liver_fat",
    goal_group: "body",
    text: "Queimar gordura no fígado",
    emoji: QUIZ_EMOJIS.page02.queimar_gordura_figado
  }, {
    id: "eliminar_retencao",
    goal_id: "fluid_retention",
    goal_group: "body",
    text: "Eliminar a retenção de líquidos",
    emoji: QUIZ_EMOJIS.page02.eliminar_retencao
  }, {
    id: "acelerar_metabolismo",
    goal_id: "metabolism",
    goal_group: "energy",
    text: "Acelerar o metabolismo",
    emoji: QUIZ_EMOJIS.page02.acelerar_metabolismo
  }, {
    id: "expectativa_vida",
    goal_id: "life_expectancy",
    goal_group: "health",
    text: "Aumento na expectativa de vida",
    emoji: QUIZ_EMOJIS.page02.expectativa_vida
  }, {
    id: "emagrecer_menopausa",
    goal_id: "menopause_weight",
    goal_group: "health",
    text: "Emagrecer na menopausa",
    emoji: QUIZ_EMOJIS.page02.emagrecer_menopausa
  }, {
    id: "acabar_besteira",
    goal_id: "cravings_control",
    goal_group: "habits",
    text: "Acabar com desejo de comer besteira",
    emoji: QUIZ_EMOJIS.page02.acabar_besteira
  }, {
    id: "reduzir_colesterol",
    goal_id: "cholesterol",
    goal_group: "health",
    text: "Redução nos níveis de colesterol",
    emoji: QUIZ_EMOJIS.page02.reduzir_colesterol
  }];

  // Carregar seleção do localStorage ao inicializar
  useEffect(() => {
    const savedData = localStorage.getItem('lm_goals');
    if (savedData) {
      try {
        const goalsData = JSON.parse(savedData);
        if (Array.isArray(goalsData)) {
          setSelectedGoals(goalsData.map((g: any) => g.goal_id));
        }
      } catch (e) {
        // Handle invalid JSON
      }
    }
  }, []);
  const handleOptionToggle = (optionId: string) => {
    const option = options.find(opt => opt.id === optionId);
    if (!option) return;

    const isCurrentlySelected = selectedGoals.includes(option.goal_id);
    let newSelectedGoals: string[];

    if (isCurrentlySelected) {
      // Remove da seleção
      newSelectedGoals = selectedGoals.filter(id => id !== option.goal_id);
    } else {
      // Adiciona à seleção
      newSelectedGoals = [...selectedGoals, option.goal_id];
    }

    setSelectedGoals(newSelectedGoals);

    // Persistir todas as seleções no localStorage
    const goalsData = newSelectedGoals.map(goalId => {
      const opt = options.find(o => o.goal_id === goalId);
      return {
        goal_id: goalId,
        goal_label: opt?.text || '',
        goal_group: opt?.goal_group || '',
        is_other: false,
        goal_other: '',
        ts: Date.now()
      };
    });
    localStorage.setItem('lm_goals', JSON.stringify(goalsData));

    // Salvar no contexto do quiz (chave canônica)
    addAnswer('objetivo_principal', newSelectedGoals);

    // Audio feedback
    audio.onSelect?.();

    // Tracking goal_selected
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'goal_selected', {
        goal_id: option.goal_id,
        goal_label: option.text,
        goal_group: option.goal_group,
        selected: !isCurrentlySelected,
        total_selected: newSelectedGoals.length,
        ts: Date.now()
      });
    }
  };
  return <ProfessionalQuizLayout headerTitle="Meu perfil" showBackButton={false}>
      <div className="space-y-6 max-w-lg mx-auto px-4">
        {/* Título e subtítulo */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Qual é o objetivo com seu corpo?
          </h1>
          <p className="text-sm text-muted-foreground underline">
            Escolha seus maiores interesses abaixo:
          </p>
        </div>

        {/* Fieldset com opções uma abaixo da outra */}
        <fieldset className="space-y-3">
          <legend className="sr-only">Qual é o objetivo com seu corpo?</legend>
          <div className="space-y-3">
            {options.map(option => {
            const isSelected = selectedGoals.includes(option.goal_id);
            return <div key={option.id}>
                  {/* Label acessível com checkbox */}
                  <label className={`
                      w-full p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer
                      focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2
                      flex items-center gap-3 text-left bg-white hover:bg-gray-50
                      ${isSelected ? 'border-green-500 bg-green-50' : 'border-green-400 hover:border-green-500'}
                    `}>
                    <input 
                      type="checkbox" 
                      name="objetivo" 
                      value={option.goal_id} 
                      checked={isSelected} 
                      onChange={() => handleOptionToggle(option.id)} 
                      className="sr-only" 
                    />
                    {/* Checkbox visual */}
                    <div className={`
                      w-6 h-6 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all
                      ${isSelected ? 'border-green-500 bg-green-500' : 'border-gray-300 bg-white'}
                    `}>
                      {isSelected && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    {/* Texto da opção */}
                    <span className="text-sm font-medium text-gray-800 leading-tight flex-1">
                      {option.text}
                    </span>
                  </label>
                </div>;
          })}
          </div>
        </fieldset>

        {/* Botão Continuar */}
        {selectedGoals.length > 0 && (
          <div className="pt-4">
            <button
              onClick={() => {
                // Tracking cta_click_next
                if (typeof window !== 'undefined' && window.gtag) {
                  const timeOnStep = Date.now() - startTime;
                  window.gtag('event', 'cta_click_next', {
                    goals: selectedGoals,
                    total_selected: selectedGoals.length,
                    ab_variant: localStorage.getItem('ab_variant') || 'default',
                    step: 'P02',
                    time_on_step_ms: timeOnStep
                  });
                }
                audio.onNext?.();
                nextPage();
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-2xl transition-colors duration-200 text-lg"
            >
              Continuar
            </button>
          </div>
        )}
      </div>
    </ProfessionalQuizLayout>;
};