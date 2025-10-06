import React, { useState, useEffect } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { useQuizStep } from '@/hooks/useQuizStep';
import { useQuiz } from '@/contexts/QuizContext';
import { Check } from 'lucide-react';
import { QuizPageProps } from '@/types/quiz';
import { SocialBadges } from '@/components/ui/SocialBadges';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { QUIZ_EMOJIS } from '@/constants/quizEmojis';
export const Page17DesiredBenefits: React.FC<QuizPageProps> = ({
  audio = {}
}) => {
  useQuizStep('Beneficios');
  const {
    getAnswer,
    addAnswer,
    nextPage,
    userInfo
  } = useQuiz();
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  const {
    toast
  } = useToast();

  // Get gender for personalization (chave canônica)
  const genderAnswer = getAnswer('genero');
  const isUserMale = genderAnswer?.answer === 'Homem';
  const options = [{
    id: "sono_profundo",
    text: "Sono mais profundo",
    emoji: QUIZ_EMOJIS.page17.sono_profundo,
    description: "Qualidade superior do descanso noturno"
  }, {
    id: "menos_dores",
    text: "Menos dores e inflamações",
    emoji: QUIZ_EMOJIS.page17.menos_dores,
    description: "Redução de desconfortos corporais"
  }, {
    id: "mais_energia_disposicao",
    text: "Mais energia e disposição ao longo do dia",
    emoji: QUIZ_EMOJIS.page17.mais_energia_disposicao,
    description: "Vitalidade constante durante todo o dia"
  }, {
    id: "reducao_estresse",
    text: "Redução do estresse e ansiedade",
    emoji: QUIZ_EMOJIS.page17.reducao_estresse,
    description: "Maior equilíbrio emocional e mental"
  }, {
    id: "autoestima_confianca",
    text: "Aumento da autoestima e confiança",
    emoji: QUIZ_EMOJIS.page17.autoestima_confianca,
    description: "Melhora da percepção sobre si mesmo"
  }, {
    id: "protecao_doencas",
    text: "Proteção contra doenças metabólicas",
    emoji: QUIZ_EMOJIS.page17.protecao_doencas,
    description: "Prevenção de problemas de saúde"
  }, {
    id: "emagrecer_sem_esforco",
    text: "Emagrecer sem esforço e sem efeito sanfona",
    emoji: QUIZ_EMOJIS.page17.emagrecer_sem_esforco,
    description: "Perda de peso sustentável e natural"
  }];

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('p14_benefits');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setSelectedBenefits(parsed);
        }
      } catch (e) {
        console.warn('Failed to parse saved benefits:', e);
      }
    }
  }, []);

  // Save to localStorage when benefits change
  useEffect(() => {
    if (selectedBenefits.length > 0) {
      localStorage.setItem('p14_benefits', JSON.stringify(selectedBenefits));
    }
  }, [selectedBenefits]);
  const trackBenefitToggle = (benefitId: string, selected: boolean) => {
    // GA4 tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'benefit_select', {
        step: 14,
        benefit_slug: benefitId,
        selected: selected,
        name: userInfo.name,
        gender: genderAnswer?.answer
      });
    }

  };
  const handleBenefitToggle = (benefitId: string) => {
    const isCurrentlySelected = selectedBenefits.includes(benefitId);
    if (isCurrentlySelected) {
      // Remove benefit
      const newSelected = selectedBenefits.filter(id => id !== benefitId);
      setSelectedBenefits(newSelected);
      trackBenefitToggle(benefitId, false);
      audio.onSelect?.();
    } else {
      // Add benefit - sem limite
      const newSelected = [...selectedBenefits, benefitId];
      setSelectedBenefits(newSelected);
      trackBenefitToggle(benefitId, true);
      audio.onSelect?.();
    }
  };
  const handleContinue = () => {
    if (selectedBenefits.length === 0) {
      toast({
        title: "Escolha pelo menos 1 benefício",
        description: "Selecione ao menos uma opção para continuar.",
        variant: "destructive",
        duration: 3000
      });
      audio.onInvalid?.();
      return;
    }

    // Track submission
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'benefits_submit', {
        step: 14,
        benefits: selectedBenefits,
        count: selectedBenefits.length,
        name: userInfo.name,
        gender: genderAnswer?.answer
      });
    }

    // Save the selected benefits usando chave canônica
    addAnswer('beneficios', selectedBenefits);

    // Audio feedback
    audio.onValid?.();

    // Advance to next page
    setTimeout(() => {
      audio.onNext?.();
      nextPage();
    }, 200);
  };
  const handleKeyDown = (event: React.KeyboardEvent, benefitId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleBenefitToggle(benefitId);
    }
  };
  return <ProfessionalQuizLayout headerTitle="Estilo de vida e hábitos">
      <div className="space-y-6 animate-betterme-page-enter">
        <SocialBadges variant="compact" />
        
        {/* Title and Icon */}
        <div className="text-center space-y-3">
          
          <h2 className="text-2xl font-bold text-foreground">
            Quais desses benefícios gostaria de ter?
          </h2>
          
          
          {/* Dynamic Counter */}
          <div className="text-sm text-primary font-medium" aria-live="polite" role="status">
            {selectedBenefits.length > 0 && `${selectedBenefits.length} selecionado${selectedBenefits.length !== 1 ? 's' : ''}`}
          </div>
        </div>

        {/* Benefits Options */}
        <div className="grid grid-cols-1 gap-3 max-w-lg mx-auto">
          {options.map((option, index) => {
          const isSelected = selectedBenefits.includes(option.id);
          return <button key={option.id} onClick={() => handleBenefitToggle(option.id)} onKeyDown={e => handleKeyDown(e, option.id)} role="checkbox" aria-checked={isSelected} className={`
                  group relative flex items-center gap-4 p-4 rounded-2xl border-2 
                  transition-all duration-300 hover:scale-[1.02] focus:outline-none 
                  focus:ring-2 focus:ring-primary focus:ring-offset-2
                  ${isSelected ? 'border-primary bg-primary/5 shadow-md' : 'border-border bg-background hover:border-primary/50'}
                `} style={{
            animationDelay: `${index * 100}ms`
          }} tabIndex={0}>
                {/* Icon */}
                <div className={`
                  flex-shrink-0 p-2 rounded-xl transition-colors text-2xl
                  ${isSelected ? 'bg-primary/10' : 'bg-muted'}
                `}>
                  {option.emoji}
                </div>
                
                {/* Content */}
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {option.text}
                  </h3>
                  
                </div>
                
                {/* Selection Indicator */}
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                  ${isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/30 bg-transparent'}
                `}>
                  {isSelected && <Check className="w-3 h-3 text-primary-foreground animate-betterme-confirm" />}
                </div>
              </button>;
        })}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center pt-4">
          <Button onClick={handleContinue} disabled={selectedBenefits.length === 0} variant="emerald" size="betterme" className="min-w-[200px]" data-cta-button>
            Continuar
          </Button>
        </div>
      </div>
    </ProfessionalQuizLayout>;
};