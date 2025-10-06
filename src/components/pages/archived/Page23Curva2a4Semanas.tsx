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
import { normalizeBarrier, getPersonaFromBarriers } from '@/utils/barrierNormalization';
import { QUIZ_DATA_KEYS, getQuizData } from '@/utils/quizDataConstants';
import { PersonalizedTimeline } from '@/components/shared/PersonalizedTimeline';
import { TrendingUp, Calendar, Target, Trophy, Star, Users, Award } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
export const Page23Curva2a4Semanas: React.FC<QuizPageProps> = ({
  audio = {}
}) => {
  useQuizStep('Curva_2_4_Semanas');
  const {
    getAnswer,
    addAnswer,
    nextPage,
    userInfo
  } = useQuiz();
  const [showCTA, setShowCTA] = useState(false);
  const [activeTab, setActiveTab] = useState('sem1');
  const [remindersOptin, setRemindersOptin] = useState(false);
  const [dwellStartTime] = useState(Date.now());

  // A/B experiments
  const {
    isVariant
  } = useABExperiments();
  const {
    preferences
  } = useLeveMePreferences();
  const {
    toast
  } = useToast();

  // Get user data for personalization - using standardized keys
  const userName = userInfo.name || 'Você';
  const barriersData = getQuizData(getAnswer, QUIZ_DATA_KEYS.BARRIERS);
  const waterData = getQuizData(getAnswer, QUIZ_DATA_KEYS.WATER_INTAKE);
  const routineData = getQuizData(getAnswer, QUIZ_DATA_KEYS.DAILY_ROUTINE);
  // const planIntensityData = getQuizData(getAnswer, QUIZ_DATA_KEYS.PLAN_INTENSITY); // Removido - campo descontinuado
  const goalData = getQuizData(getAnswer, QUIZ_DATA_KEYS.GOAL_PRIMARY);
  const irrScoreData = getQuizData(getAnswer, QUIZ_DATA_KEYS.IRR_SCORE);
  const barriersList = barriersData.array.filter(Boolean);
  const mainBarrier = normalizeBarrier(barriersList?.[0] || 'falta_constancia');
  const waterAnswer = waterData.value;
  const routineAnswer = routineData.value;
  const intensityAnswer = 'balanceado'; // Default value - plan_intensity field discontinued
  const goalAnswer = goalData.value || 'emagrecimento';
  const irrScore = parseInt(irrScoreData.value || '0');
  useEffect(() => {
    audio.onShow?.();

    // Track expectations view with enhanced data
    const trackingData = {
      step: 19,
      barriers: barriersList,
      preferred_slot: preferences.preferred_slot,
      page_id: 'P19',
      user_name: userName,
      mainBarrier: mainBarrier,
      planIntensity: intensityAnswer,
      dwell_ms: Date.now() - dwellStartTime,
      irr_score: irrScore,
      goal: goalAnswer
    };
    trackEvent('p19_view', trackingData);

    // Show toast
    setTimeout(() => {
      toast({
        title: "🎉 Mapa de 30 dias desbloqueado",
        description: "Você está pronta para começar sua transformação!",
        duration: 3000
      });
    }, 1000);

    // Show CTA after 2.5s
    const ctaTimer = setTimeout(() => setShowCTA(true), 2500);
    return () => {
      clearTimeout(ctaTimer);
    };
  }, []);

  // Get profile-specific milestones
  const getProfileMilestones = () => {
    const milestones = [];
    if (irrScore >= 8) {
      milestones.push({
        title: 'Primeiros sinais',
        description: 'Menos inchaço e mais disposição',
        timeframe: '3-5 dias'
      }, {
        title: 'Mudanças visíveis',
        description: 'Roupas mais folgadas',
        timeframe: '8-12 dias'
      }, {
        title: 'Consolidação',
        description: 'Hábito formado e resultados consistentes',
        timeframe: '15-20 dias'
      });
    } else if (irrScore >= 6) {
      milestones.push({
        title: 'Adaptação inicial',
        description: 'Corpo se ajusta ao ritual',
        timeframe: '5-7 dias'
      }, {
        title: 'Benefícios evidentes',
        description: 'Mais energia e menos fome',
        timeframe: '12-16 dias'
      }, {
        title: 'Transformação visível',
        description: 'Mudanças na balança e espelho',
        timeframe: '20-25 dias'
      });
    } else {
      milestones.push({
        title: 'Base sólida',
        description: 'Construindo consistência',
        timeframe: '7-10 dias'
      }, {
        title: 'Momentum crescente',
        description: 'Primeiros resultados aparecem',
        timeframe: '15-20 dias'
      }, {
        title: 'Transformação sustentável',
        description: 'Mudança de hábitos consolidada',
        timeframe: '25-30 dias'
      });
    }

    // Add barrier-specific milestone
    if (mainBarrier === 'falta_tempo') {
      milestones[0].description += ' (só 3 min/dia!)';
    } else if (mainBarrier === 'ansiedade') {
      milestones[1].description += ' + redução da ansiedade';
    }
    return milestones;
  };

  // Get "why it works for you" content
  const getWhyItWorks = () => {
    const barrierText = mainBarrier === 'falta_tempo' ? 'falta de tempo' : mainBarrier === 'ansiedade' ? 'ansiedade' : mainBarrier === 'falta_constancia' ? 'falta de constância' : mainBarrier === 'orcamento_curto' ? 'orçamento curto' : 'sua barreira principal';
    const shortcutText = mainBarrier === 'falta_tempo' ? 'preparo simples + lembretes de 10s' : mainBarrier === 'ansiedade' ? 'dose relaxante à noite + saciedade à tarde' : mainBarrier === 'falta_constancia' ? 'pequenos passos consistentes' : 'simplicidade e eficácia';
    const routineText = routineAnswer === 'morning_rush' ? 'manhã corrida' : routineAnswer === 'afternoon_free' ? 'tarde livre' : routineAnswer === 'night_free' ? 'noite livre' : routineAnswer === 'shift_work' ? 'turno variado' : 'sua rotina';
    const slotText = preferences.preferred_slot === 'morning' ? 'manhã' : preferences.preferred_slot === 'afternoon' ? 'tarde' : preferences.preferred_slot === 'night' ? 'noite' : 'horário flexível';
    const waterText = waterAnswer === '0_2_copos' ? '0-2 copos/dia' : waterAnswer === '3_4_copos' ? '3-4 copos/dia' : waterAnswer === '5_6_copos' ? '5-6 copos/dia' : waterAnswer === '7_mais_copos' ? '7+ copos/dia' : waterAnswer === 'nao_sei_varia' ? 'quantidade variada' : 'não informada';
    return [`Barreira "${barrierText}" → priorizamos ${shortcutText}.`, `Horário "${routineText}" combina com ${slotText}.`, `Água/dia "${waterText}" ganha boost com lembretes.`];
  };
  const handlePrimaryCTAClick = () => {
    // Track primary CTA click with enhanced data
    const trackingData = {
      step: 19,
      reminders_opt_in: remindersOptin,
      page_id: 'P19',
      dwell_ms: Date.now() - dwellStartTime
    };

    // GA4 Event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'commitment_final_click', trackingData);
    }
    trackEvent('p19_cta_click_primary', trackingData);
    audio.onNext?.();
    nextPage();
  };
  const handleRemindersToggle = () => {
    const newState = !remindersOptin;
    setRemindersOptin(newState);
    addAnswer('reminders_opt_in', newState.toString());
    audio.onSelect?.();
  };
  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);

    // GA4 Event for tab clicks
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'timeline_tab_click', {
        tab: tabValue,
        page_id: 'P19'
      });
    }
  };
  return <ProfessionalQuizLayout headerTitle="Cronograma">
      <div className="animate-betterme-page-enter space-y-3">

        {/* Ultra Compact Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center bg-emerald-500/10 text-emerald-700 px-2 py-1 rounded-full border border-emerald-500/20">
            <Calendar className="w-3 h-3 mr-1" />
            <span className="text-xs font-semibold">CRONOGRAMA PERSONALIZADO</span>
          </div>
          
          <h1 className="text-xl font-bold text-foreground leading-tight">
            {userName}, próximas <span className="text-primary">semanas</span>
          </h1>
        </div>

        {/* Main Timeline Simplified */}
        <div className="bg-background border border-border rounded-lg p-3">
          <PersonalizedTimeline irrScore={irrScore} mainBarrier={mainBarrier} goalPrimary={goalAnswer} userName={userName} />
        </div>

        {/* Simplified Stats */}
        

        {/* Why It Works - Simplified */}
        <div className="bg-background border border-border rounded-lg p-3">
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium text-foreground">Por que funciona para você</span>
          </div>
          <div className="space-y-1">
            {getWhyItWorks().map((reason, index) => <div key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground leading-tight">{reason}</p>
              </div>)}
          </div>
        </div>

        {/* Milestones - Simplified */}
        

        {/* Compact Social + CTA */}
        <div className="space-y-2">
          <SocialBadges variant="compact" />
          
          {showCTA && <button onClick={handlePrimaryCTAClick} className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-emerald-400/30" aria-label="Bloquear meu plano por 7 dias - próxima etapa">
              <span className="flex items-center justify-center gap-2 text-sm">
                <Award className="w-4 h-4" />
                Bloquear meu plano por 7 dias
              </span>
            </button>}
        </div>

        {/* Minimal Footer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground leading-tight px-2">
            {GLOBAL_CONSTANTS.DISCLAIMERS.EDUCATIONAL}
          </p>
        </div>
      </div>
    </ProfessionalQuizLayout>;
};