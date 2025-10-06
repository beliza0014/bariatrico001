import React, { useEffect, useState } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { useQuizStep } from '@/hooks/useQuizStep';
import { useQuiz } from '@/contexts/QuizContext';
import { QuizPageProps } from '@/types/quiz';
import { GLOBAL_CONSTANTS } from '@/config/globalConstants';
import { SocialBadges } from '@/components/ui/SocialBadges';
import { useABExperiments } from '@/hooks/useABExperiments';
import { useLeveMePreferences } from '@/hooks/useLeveMePreferences';
import { trackEvent } from '@/utils/tracking';
import { useToast } from '@/hooks/use-toast';
import { normalizeBarrier, getPersonaLabel } from '@/utils/barrierNormalization';
import { QUIZ_DATA_KEYS, WATER_INTAKE_LABELS, ROUTINE_LABELS, BARRIER_LABELS, getQuizData } from '@/utils/quizDataConstants';
import { PersonalizedInsights } from '@/components/shared/PersonalizedInsights';

export const Page22InterpretacaoIRR: React.FC<QuizPageProps> = ({ audio = {} }) => {
  useQuizStep('Interpretacao_IRR');
  const { getAnswer, nextPage, userInfo } = useQuiz();
  const [showCTA, setShowCTA] = useState(false);
  const [dwellStartTime] = useState(Date.now());

  // A/B experiments
  const { isVariant } = useABExperiments();
  const { setDose } = useLeveMePreferences();
  const { toast } = useToast();

  // Get user data for personalization - using standardized keys
  const userName = userInfo.name || 'Você';
  const barriersData = getQuizData(getAnswer, QUIZ_DATA_KEYS.BARRIERS);
  const waterData = getQuizData(getAnswer, QUIZ_DATA_KEYS.WATER_INTAKE);
  const routineData = getQuizData(getAnswer, QUIZ_DATA_KEYS.DAILY_ROUTINE);
  const preferencesData = getQuizData(getAnswer, QUIZ_DATA_KEYS.FRUIT_PREFERENCES);
  const irrScoreData = getQuizData(getAnswer, QUIZ_DATA_KEYS.IRR_SCORE);
  
  const barriersList = barriersData.array.filter(Boolean);
  const mainBarrier = normalizeBarrier(barriersList?.[0] || 'falta_constancia');
  const waterAnswer = waterData.value;
  const routineAnswer = routineData.value;
  const preferencesArray = preferencesData.array.filter(Boolean);
  const irrScore = parseInt(irrScoreData.value || '0');

  // Get persona label
  const personaLabel = getPersonaLabel(mainBarrier);
  useEffect(() => {
    audio.onShow?.();
    
    // Track persona view with enhanced data
    const trackingData = {
      step: 17,
      persona: mainBarrier,
      page_id: 'P17',
      user_name: userName,
      mainBarrier: barriersList?.[0],
      mainBarrier_normalized: mainBarrier,
      planIntensity: getAnswer('planIntensity')?.answer || 'balanceado',
      dwell_ms: Date.now() - dwellStartTime,
      barriers: barriersList?.filter(Boolean) || [],
      routine: routineAnswer,
      hydration: waterAnswer
    };

    // GA4 Event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'persona_view', trackingData);
    }

    trackEvent('p17_view', trackingData);

    // Show toast
    setTimeout(() => {
      toast({
        title: "🧠 Perfil validado. Atalhos ativados.",
        description: "Seu plano foi personalizado com base nas suas respostas!",
        duration: 3000,
      });
    }, 1000);
    
    // Show CTA after 2.5s
    const ctaTimer = setTimeout(() => setShowCTA(true), 2500);
    
    return () => {
      clearTimeout(ctaTimer);
    };
  }, []);

  // Get enhanced personalized insights
  const getPersonalizedBullets = () => {
    const bullets = [];
    
    // Barreira principal
    const barrierText = BARRIER_LABELS[mainBarrier as keyof typeof BARRIER_LABELS] || 'barreira específica';
    
    // Multiple barriers consideration
    if (barriersList.length > 1) {
      bullets.push(`Seu perfil combina ${barriersList.length} desafios principais - nosso ritual ataca cada um deles.`);
    } else {
      bullets.push(`Ritual otimizado especificamente para ${barrierText}.`);
    }
    
    // Hydration + routine integration
    const waterText = WATER_INTAKE_LABELS[waterAnswer as keyof typeof WATER_INTAKE_LABELS] || 'não informada';
    const routineText = ROUTINE_LABELS[routineAnswer as keyof typeof ROUTINE_LABELS] || 'sua rotina';
    
    bullets.push(`Hidratação atual (${waterText}) + rotina (${routineText}) = timing perfeito determinado.`);
    
    // Fruit preferences integration
    if (preferencesArray.length > 0) {
      const favoriteFruit = preferencesArray[0];
      bullets.push(`Suas frutas preferidas (${preferencesArray.join(', ')}) aceleram resultados naturalmente.`);
    }
    
    // IRR score-based insight
    if (irrScore >= 8) {
      bullets.push("Seu perfil indica potencial para resultados em 10-15 dias.");
    } else if (irrScore >= 6) {
      bullets.push("Base sólida permite progressão consistente nas próximas 3 semanas.");
    } else {
      bullets.push("Estratégia gradual garante sustentabilidade a longo prazo.");
    }
    
    return bullets;
  };

  const handleCTAClick = () => {
    // Track CTA click with enhanced data
    const trackingData = {
      step: 17,
      persona: mainBarrier,
      page_id: 'P17',
      dwell_ms: Date.now() - dwellStartTime
    };

    // GA4 Event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'p17_cta_click', trackingData);
    }

    trackEvent('p17_cta_click', trackingData);
    
    // Direct advance to next page
    audio.onNext?.();
    nextPage();
  };


  return (
    <ProfessionalQuizLayout headerTitle="Seu perfil">
      <div className="animate-betterme-page-enter space-y-4">

        {/* Compact Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center bg-primary/5 text-primary px-3 py-1.5 rounded-full border border-primary/15">
            <span className="text-xs font-medium">✨ {personaLabel}</span>
          </div>
          
          <h1 className="text-2xl font-bold text-foreground leading-tight">
            Ritual <span className="text-primary">3 min/dia</span> personalizado
          </h1>
          
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-3 border border-primary/10">
            <p className="text-sm text-muted-foreground mb-1">
              Resultados típicos em ~15 dias: <strong className="text-foreground">roupas mais folgadas</strong>
            </p>
            <p className="text-xs text-primary">
              💪 Combinação manhã + noite • 70% reportam constância na 1ª semana
            </p>
          </div>
        </div>

        {/* Compact Insights Grid */}
        <div className="space-y-3">
          <PersonalizedInsights
            barriers={barriersList}
            waterIntake={waterAnswer}
            routine={routineAnswer}
            fruitPreferences={preferencesArray}
            userName={userName}
            persona={personaLabel}
          />
          
          <div className="bg-gradient-to-br from-white to-primary/5 rounded-2xl border-2 border-primary/20 p-4 shadow-lg">
            <div className="text-center mb-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full mb-1">
                <span className="text-xl">🎯</span>
              </div>
              <h3 className="text-base font-bold text-foreground leading-tight">Seu plano otimizado</h3>
              <p className="text-xs text-muted-foreground">Baseado no seu perfil único</p>
            </div>
            
            <div className="space-y-2">
              {getPersonalizedBullets().map((bullet, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-primary/10 shadow-sm">
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-primary text-xs font-bold">✓</span>
                    </div>
                    <p className="text-xs text-foreground leading-relaxed font-medium">{bullet}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Compact CTA Section */}
        {showCTA && (
          <div className="text-center">
            <button
              onClick={handleCTAClick}
              className="px-8 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-semibold min-h-[44px] min-w-[44px] shadow-lg"
              aria-label="Ver meus 3 passos - próxima etapa"
            >
              ⚡ Ver meus 3 passos
            </button>
          </div>
        )}

        {/* Compact Footer */}
        <div className="space-y-3">
          <SocialBadges variant="compact" />
          <p className="text-xs text-muted-foreground text-center px-2">
            {GLOBAL_CONSTANTS.DISCLAIMERS.EDUCATIONAL}
          </p>
        </div>
      </div>
    </ProfessionalQuizLayout>
  );
};