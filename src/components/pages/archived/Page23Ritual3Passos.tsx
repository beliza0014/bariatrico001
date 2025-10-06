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
import { QUIZ_DATA_KEYS, WATER_INTAKE_LABELS, ROUTINE_LABELS, getQuizData } from '@/utils/quizDataConstants';
import { Clock, Coffee, Zap, Sun, Moon, Droplets } from 'lucide-react';
export const Page23Ritual3Passos: React.FC<QuizPageProps> = ({
  audio = {}
}) => {
  useQuizStep('Ritual_3_Passos');
  const {
    getAnswer,
    addAnswer,
    nextPage,
    userInfo
  } = useQuiz();
  const [showCTA, setShowCTA] = useState(false);
  const [doseForBeginners, setDoseForBeginners] = useState(true);
  const [day1ChallengeAccepted, setDay1ChallengeAccepted] = useState(false);
  const [dwellStartTime] = useState(Date.now());
  const [currentStep, setCurrentStep] = useState(0);

  // A/B experiments
  const {
    isVariant
  } = useABExperiments();
  const {
    setDose,
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
  const preferencesData = getQuizData(getAnswer, QUIZ_DATA_KEYS.FRUIT_PREFERENCES);
  const irrScoreData = getQuizData(getAnswer, QUIZ_DATA_KEYS.IRR_SCORE);
  const goalData = getQuizData(getAnswer, QUIZ_DATA_KEYS.GOAL_PRIMARY);
  const barriersList = barriersData.array.filter(Boolean);
  const mainBarrier = normalizeBarrier(barriersList?.[0] || 'falta_constancia');
  const waterAnswer = waterData.value;
  const routineAnswer = routineData.value;
  const intensityAnswer = 'balanceado' as 'leve' | 'balanceado' | 'acelerado'; // Default - plan_intensity discontinued
  const preferencesArray = preferencesData.array.filter(Boolean);
  const irrScore = parseInt(irrScoreData.value || '0');
  const goalAnswer = goalData.value;
  useEffect(() => {
    audio.onShow?.();

    // Track ritual view with enhanced data
    const trackingData = {
      step: 18,
      plan_intensity: intensityAnswer,
      preferred_slot: preferences.preferred_slot,
      dose: doseForBeginners ? 'light' : 'standard',
      page_id: 'P18',
      user_name: userName,
      mainBarrier: mainBarrier,
      dwell_ms: Date.now() - dwellStartTime,
      barriers: barriersList,
      routine: routineAnswer,
      water_intake: waterAnswer,
      irr_score: irrScore
    };
    trackEvent('p18_view', trackingData);

    // Show toast
    setTimeout(() => {
      toast({
        title: "🏅 Ritual 3×3 desbloqueado",
        description: "Seu plano personalizado está pronto para teste!",
        duration: 3000
      });
    }, 1000);

    // Auto-advance steps every 4 seconds
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        const next = prev + 1;
        if (next >= 3) {
          clearInterval(stepInterval);
          setShowCTA(true);
          return 2;
        }
        return next;
      });
    }, 4000);
    return () => {
      clearInterval(stepInterval);
    };
  }, []);

  // Get truly personalized ritual steps
  const getRitualSteps = () => {
    // Determine optimal timing based on routine
    const timing = routineAnswer === 'morning_rush' ? 'ao acordar (6-7h)' : routineAnswer === 'afternoon_free' ? 'meio da tarde (14-15h)' : routineAnswer === 'night_free' ? 'início da noite (18-19h)' : routineAnswer === 'shift_work' ? 'no seu melhor horário' : 'no horário que escolher';

    // Get personalized ingredients based on fruit preferences
    const getPersonalizedIngredient = () => {
      if (preferencesArray.includes('limao')) return 'chá com gotas de limão';
      if (preferencesArray.includes('laranja')) return 'chá com essência cítrica';
      if (preferencesArray.includes('maca')) return 'chá com toque adocicado natural';
      return 'chá na formulação padrão';
    };

    // Adjust dose based on intensity and IRR score
    const getDose = () => {
      if (intensityAnswer === 'leve') return '1/2 colher (sopa)';
      if (intensityAnswer === 'acelerado') return '1 colher (sopa) cheia';
      if (irrScore >= 8) return '1 colher (sopa)';
      return '3/4 colher (sopa)';
    };
    const personalizedIngredient = getPersonalizedIngredient();
    const dose = getDose();
    return [{
      step: 1,
      icon: routineAnswer === 'morning_rush' ? Sun : routineAnswer === 'night_free' ? Moon : Coffee,
      title: `Preparo ${timing}`,
      description: `Misture ${dose} do ${personalizedIngredient} em 200ml de água morna (40-50°C).`,
      tip: mainBarrier === 'falta_tempo' ? 'Dica: Deixe dose medida na noite anterior' : mainBarrier === 'ansiedade' ? 'Dica: Use este momento para relaxar e respirar' : mainBarrier === 'falta_constancia' ? 'Dica: Defina alarme no celular' : 'Dica: Crie um ritual prazeroso'
    }, {
      step: 2,
      icon: Droplets,
      title: 'Consumo personalizado',
      description: waterAnswer === '0_2_copos' ? 'Beba devagar, em pequenos goles. Seu corpo vai se adaptar gradualmente.' : waterAnswer === '3_4_copos' ? 'Tome em temperatura ambiente - você já tem boa hidratação.' : waterAnswer === '5_6_copos' || waterAnswer === '7_mais_copos' ? 'Beba normalmente - seu corpo já está bem hidratado.' : 'Adapte à sua preferência de temperatura.',
      tip: `Aguarde ${mainBarrier === 'falta_tempo' ? '20' : '30'} minutos antes de comer`
    }, {
      step: 3,
      icon: Zap,
      title: 'Ativação direcionada',
      description: mainBarrier === 'falta_tempo' ? 'Caminhe 2 minutos OU suba/desça escadas 1x' : mainBarrier === 'ansiedade' ? 'Faça 5 respirações profundas + alongue braços' : mainBarrier === 'falta_constancia' ? 'Movimento simples: 10 elevações de perna' : 'Movimente-se por 3-5 minutos como preferir',
      tip: routineAnswer === 'morning_rush' ? 'Pode fazer no trajeto para o trabalho' : routineAnswer === 'night_free' ? 'Relaxa e prepara para o sono' : 'Potencializa absorção dos nutrientes'
    }];
  };
  const handleToggleDose = () => {
    const newDoseState = !doseForBeginners;
    setDoseForBeginners(newDoseState);
    setDose(newDoseState ? 'light' : 'standard');
    trackEvent('p18_toggle_dose', {
      new_state: newDoseState ? 'light' : 'standard'
    });
  };
  const handleCTAClick = () => {
    // Track CTA click with enhanced data
    const trackingData = {
      step: 18,
      day1_challenge_accepted: day1ChallengeAccepted,
      page_id: 'P18',
      dwell_ms: Date.now() - dwellStartTime
    };

    // GA4 Event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'p18_cta_click', trackingData);
    }
    trackEvent('p18_cta_click', trackingData);

    // Direct advance to next page
    audio.onNext?.();
    nextPage();
  };
  return <ProfessionalQuizLayout headerTitle="Seu plano">
      <div className="animate-betterme-page-enter space-y-4">

        {/* Compact Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20">
            <Zap className="w-3 h-3 mr-1.5" />
            <span className="text-xs font-semibold">RITUAL PERSONALIZADO</span>
          </div>
          
          
          
          <div className="bg-gradient-to-r from-emerald-500/10 to-primary/10 rounded-xl p-3 border border-emerald-500/20">
            <p className="text-sm text-foreground font-medium">
              ✨ Para {goalAnswer === 'perder_peso' ? 'emagrecimento' : goalAnswer === 'tonificar' ? 'tonificação' : 'seus objetivos'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Baseado em: {preferencesArray.join(', ') || 'perfil personalizado'}
            </p>
          </div>
        </div>

        {/* Compact 3-Step Ritual Cards */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-primary/5 border-2 border-primary/20 shadow-lg">
            <div className="p-4">
              
              {/* Current Step Display */}
              <div className="mb-4">
                {getRitualSteps().map((ritual, index) => {
                const Icon = ritual.icon;
                const isActive = index === currentStep;
                return <div key={index} className={`transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute inset-4'}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-primary text-white animate-betterme-select' : 'bg-primary/10 text-primary'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-foreground mb-1">
                            Passo {ritual.step}: {ritual.title}
                          </h3>
                          <p className="text-sm text-foreground mb-2 leading-relaxed">{ritual.description}</p>
                          <div className="bg-emerald-500/10 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-emerald-500/20">
                            💡 {ritual.tip}
                          </div>
                        </div>
                      </div>
                    </div>;
              })}
              </div>

              {/* Step Progress Indicators */}
              <div className="flex justify-center items-center gap-2">
                {getRitualSteps().map((_, index) => <div key={index} className={`transition-all duration-300 ${index === currentStep ? 'w-6 h-2 bg-primary rounded-full' : index < currentStep ? 'w-2 h-2 bg-primary/60 rounded-full' : 'w-2 h-2 bg-muted rounded-full'}`} />)}
                <span className="ml-3 text-xs text-muted-foreground font-medium">
                  {currentStep + 1} / 3
                </span>
              </div>
            </div>
          </div>

          {/* Quick Benefits Preview */}
          
        </div>

        {/* Compact Social Proof */}
        <div className="space-y-3">
          <SocialBadges variant="compact" />
        </div>

        {/* Compact CTA Section */}
        {showCTA && <div className="text-center">
            <button onClick={handleCTAClick} className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 font-semibold min-h-[48px] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-emerald-400/30" aria-label="Ativar desafio e continuar - próxima etapa">
              <span className="flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" />
                Ativar desafio e continuar
              </span>
            </button>
          </div>}

        {/* Compact Footer */}
        <div className="text-center px-4">
          
        </div>
      </div>
    </ProfessionalQuizLayout>;
};