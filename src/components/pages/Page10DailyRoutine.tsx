import React, { useState, useEffect } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { UnifiedQuizQuestion } from '@/components/quiz/UnifiedQuizQuestion';
import { useQuizStep } from '@/hooks/useQuizStep';
import { useQuiz } from '@/contexts/QuizContext';
import { QuizPageProps } from '@/types/quiz';
import { useToast } from '@/hooks/use-toast';
import { QUIZ_EMOJIS } from '@/constants/quizEmojis';
export const Page10DailyRoutine: React.FC<QuizPageProps> = ({
  audio = {}
}) => {
  useQuizStep('Impacto_Peso_Vida');
  const {
    addAnswer,
    nextPage
  } = useQuiz();
  const {
    toast
  } = useToast();
  const [selectedOption, setSelectedOption] = useState<string>('');

  // Restore selection from localStorage
  useEffect(() => {
    const savedWeightImpact = localStorage.getItem('weight_life_impact');
    if (savedWeightImpact) {
      setSelectedOption(savedWeightImpact);
    }
  }, []);
  const options = [{
    id: "shame_photos",
    text: "Tenho vergonha de tirar fotos",
    icon: QUIZ_EMOJIS.page10.shame_photos,
    description: "Evito ser fotografado"
  }, {
    id: "partner_health_concern",
    text: "Meu parceiro está preocupado com minha saúde",
    icon: QUIZ_EMOJIS.page10.partner_health_concern,
    description: "Preocupação do relacionamento"
  }, {
    id: "social_judgment",
    text: "Sinto-me julgado por amigos e colegas",
    icon: QUIZ_EMOJIS.page10.social_judgment,
    description: "Julgamento social"
  }, {
    id: "avoid_romantic",
    text: "Evito encontros românticos por não me sentir atraente",
    icon: QUIZ_EMOJIS.page10.avoid_romantic,
    description: "Impacto na vida amorosa"
  }, {
    id: "none_options",
    text: "Nenhuma das opções",
    icon: QUIZ_EMOJIS.page10.none_options,
    description: "Não se aplica"
  }];

  // Helper to get weight impact label by key
  const getWeightImpactLabel = (key: string): string => {
    const option = options.find(opt => opt.id === key);
    return option?.text || key;
  };

  // Helper to get IRR score contribution
  const getIRRScore = (impactKey: string): number => {
    const scores: Record<string, number> = {
      shame_photos: 2,
      partner_health_concern: 3,
      social_judgment: 2,
      avoid_romantic: 2,
      none_options: 0
    };
    return scores[impactKey] || 0;
  };

  // Helper to get impact hint for later personalization
  const getImpactHint = (impactKey: string): string => {
    const hints: Record<string, string> = {
      shame_photos: "autoestima visual",
      partner_health_concern: "preocupação relacional",
      social_judgment: "pressão social",
      avoid_romantic: "bloqueio romântico",
      none_options: "sem impacto específico"
    };
    return hints[impactKey] || "personalizado";
  };
  const handleAnswer = (answer: string | string[]) => {
    const selectedValue = Array.isArray(answer) ? answer[0] : answer;
    setSelectedOption(selectedValue);

    // Save to context usando chave canônica (consolidado em rotina_diaria)
    addAnswer('rotina_diaria', selectedValue);
    localStorage.setItem('rotina_diaria', selectedValue);

    // Track weight impact selection
    try {
      // Prevent duplicate tracking by checking if already tracked
      const trackedKey = `weight_impact_selected_${selectedValue}`;
      if (!sessionStorage.getItem(trackedKey)) {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'weight_impact_selected', {
            step: 'P10',
            impact_key: selectedValue,
            impact_label: getWeightImpactLabel(selectedValue),
            ab_variant: 'default' // Replace with actual AB variant helper
          });
        }

        // Mark as tracked to prevent duplicates
        sessionStorage.setItem(trackedKey, 'true');
        console.log('Tracking weight_impact_selected:', {
          step: 'P10',
          impact_key: selectedValue,
          impact_label: getWeightImpactLabel(selectedValue)
        });
      }
    } catch (error) {
      console.warn('Tracking error:', error);
    }
    audio.onValid?.();

    // Auto advance after selection with 800ms delay
    setTimeout(() => {
      audio.onNext?.();
      nextPage();
    }, 800);
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
  return <ProfessionalQuizLayout headerTitle="Análise pessoal">
      <UnifiedQuizQuestion title="Como o seu peso afeta sua vida?" subtitle="Escolha a situação que mais se aplica ao seu caso" options={options} onAnswer={handleAnswer} autoAdvance={false} showContinueButton={true} required={true} onSelect={audio.onSelect} onNext={handleContinue} onValid={audio.onValid} onInvalid={audio.onInvalid} />
      
      {/* Microcopy below the CTA */}
      <div className="text-center mt-4">
        
      </div>
    </ProfessionalQuizLayout>;
};