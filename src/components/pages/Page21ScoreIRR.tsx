import React, { useState, useEffect } from 'react';
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
import { IRRScoreVisual } from '@/components/shared/IRRScoreVisual';
import { InteractiveBMIChart } from '@/components/ui/interactive-bmi-chart';
export const Page21ScoreIRR: React.FC<QuizPageProps> = ({
  audio = {}
}) => {
  useQuizStep('Score_IRR');
  const {
    getAnswer,
    addAnswer,
    nextPage,
    userInfo
  } = useQuiz();
  const [irrScore, setIrrScore] = useState<number>(0);
  const [waterScore, setWaterScore] = useState<number>(0);
  const [budgetScore, setBudgetScore] = useState<number>(0);
  const [routineScore, setRoutineScore] = useState<number>(0);
  const [isCalculated, setIsCalculated] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const [bmi, setBmi] = useState<number>(0);
  const [dwellStartTime] = useState(Date.now());

  // A/B experiments
  const {
    isVariant
  } = useABExperiments();
  const {
    setPreferredSlot
  } = useLeveMePreferences();
  const {
    toast
  } = useToast();

  // Get answers for personalization - using standardized keys
  const userName = userInfo.name || 'Você';
  const barriersData = getQuizData(getAnswer, QUIZ_DATA_KEYS.BARRIERS);
  const waterData = getQuizData(getAnswer, QUIZ_DATA_KEYS.WATER_INTAKE);
  const routineData = getQuizData(getAnswer, QUIZ_DATA_KEYS.DAILY_ROUTINE);
  const goalData = getQuizData(getAnswer, QUIZ_DATA_KEYS.GOAL_PRIMARY);
  const genderData = getQuizData(getAnswer, QUIZ_DATA_KEYS.GENDER);
  const barriersList = barriersData.array.filter(Boolean);
  const waterAnswer = waterData.value;
  const routineAnswer = routineData.value;
  const goalAnswer = goalData.value;
  const genderAnswer = genderData.value;

  // Calculate persona
  const mainBarrier = normalizeBarrier(barriersList?.[0] || '');
  const persona = getPersonaFromBarriers(barriersList?.filter(Boolean) || []);
  useEffect(() => {
    // Calculate BMI first
    const calculateBMI = () => {
      if (userInfo.height && userInfo.weight) {
        const heightInMeters = userInfo.height / 100;
        const calculatedBMI = userInfo.weight / (heightInMeters * heightInMeters);
        setBmi(calculatedBMI);
      }
    };

    // Calculate IRR score based on user answers - ENHANCED LOGIC
    const calculateIRR = () => {
      let score = 0;
      let waterScore = 0;
      let budgetScore = 0;
      let routineScore = 0;

      // Water intake scoring (0-3 points)
      if (waterAnswer === '7_mais_copos') {
        waterScore = 3;
      } else if (waterAnswer === '5_6_copos') {
        waterScore = 2;
      } else if (waterAnswer === '3_4_copos') {
        waterScore = 1;
      }

      // Budget scoring (0-3 points)
      if (!barriersList?.includes('orcamento_curto')) {
        budgetScore = 3;
      }

      // Routine flexibility scoring (0-4 points)
      if (routineAnswer === 'afternoon_free' || routineAnswer === 'night_free') {
        routineScore = 4;
      } else if (routineAnswer === 'weekend_focus') {
        routineScore = 2;
      } else if (routineAnswer === 'shift_work') {
        routineScore = 1;
      }
      score = waterScore + budgetScore + routineScore;

      // Store individual scores for visualization
      setWaterScore(waterScore);
      setBudgetScore(budgetScore);
      setRoutineScore(routineScore);

      // Clamp between 0-10
      score = Math.max(0, Math.min(10, score));
      setIrrScore(score);
      addAnswer(QUIZ_DATA_KEYS.IRR_SCORE, score.toString());
      setIsCalculated(true);

      // Track IRR score view - enhanced
      const trackingData = {
        step: 16,
        irr_score: score,
        persona: persona,
        main_goal: goalAnswer || 'emagrecimento',
        mainBarrier,
        mainBarrier_normalized: mainBarrier,
        dwell_ms: Date.now() - dwellStartTime,
        page_id: 'P16',
        user_name: userName,
        barriers: barriersList?.filter(Boolean) || [],
        routine: routineAnswer,
        water_intake: waterAnswer,
        gender: genderAnswer
      };

      // GA4 Event  
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'p16_view', trackingData);
      }
      trackEvent('p16_view', trackingData);
    };
    calculateBMI();
    calculateIRR();
    audio.onShow?.();

    // Show toast when score is calculated
    setTimeout(() => {
      toast({
        title: "✅ Índice LeveMe desbloqueado",
        description: "Seu perfil foi analisado com sucesso!",
        duration: 3000
      });
    }, 1000);

    // Show CTA after 2.5s
    const ctaTimer = setTimeout(() => setShowCTA(true), 2500);
    return () => {
      clearTimeout(ctaTimer);
    };
  }, []);

  // Get personalized subcopy - FIXED ID MAPPING
  const getPersonalizedSubcopy = () => {
    const waterText = waterAnswer === '0_2_copos' ? '0-2 copos' : waterAnswer === '3_4_copos' ? '3-4 copos' : waterAnswer === '5_6_copos' ? '5-6 copos' : waterAnswer === '7_mais_copos' ? '7+ copos' : waterAnswer === 'nao_sei_varia' ? 'quantidade variada' : 'não informada';
    const routineText = routineAnswer === 'morning_rush' ? 'manhã corrida' : routineAnswer === 'afternoon_free' ? 'tarde livre' : routineAnswer === 'night_free' ? 'noite livre' : routineAnswer === 'shift_work' ? 'turno variado' : routineAnswer === 'weekend_focus' ? 'foco no fim de semana' : 'rotina específica';
    const barrierText = barriersList?.[0] === 'falta_tempo' ? 'falta de tempo' : barriersList?.[0] === 'ansiedade' ? 'ansiedade' : barriersList?.[0] === 'falta_constancia' ? 'falta de constância' : barriersList?.[0] === 'falta_apoio' ? 'falta de apoio' : barriersList?.[0] === 'orcamento_curto' ? 'orçamento curto' : barriersList?.[0]?.startsWith('outro:') ? 'outro motivo' : 'barreira específica';
    return `Baseado em hidratação (${waterText}), rotina (${routineText}) e barreira (${barrierText}).`;
  };

  // Get score feedback with persona integration
  const getScoreFeedback = () => {
    if (irrScore >= 8) {
      return "Você já tem uma base forte, só precisa ajustar pequenos hábitos para destravar resultados rápidos";
    } else if (irrScore >= 6) {
      return "Sua rotina permite adaptações que trarão resultados consistentes em poucas semanas";
    } else if (irrScore >= 4) {
      return "Com alguns ajustes simples na sua rotina, você pode acelerar muito seus resultados";
    } else {
      return "Vamos criar estratégias específicas para seu perfil garantir o sucesso gradual";
    }
  };
  const handleCTAClick = () => {
    // Track CTA click with enhanced data
    const trackingData = {
      step: 16,
      cta_label: "Ver meu ritual recomendado",
      dwell_ms: Date.now() - dwellStartTime,
      page_id: 'P16'
    };
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'p16_cta_click', trackingData);
    }
    trackEvent('p16_cta_click', trackingData);

    // Direct advance to next page
    audio.onNext?.();
    nextPage();
  };
  return <ProfessionalQuizLayout headerTitle="Análise personalizada">
      <div className="animate-betterme-page-enter">

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Seu Índice de Transformação: {isCalculated ? `${irrScore}/10` : '...'}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Seu perfil indica <strong>potencial alto</strong> com um plano <strong>rápido e simples</strong>.
          </p>
        </div>


        {/* IRR Score Display - Compact Professional Version */}
        <div className="max-w-md mx-auto mb-6">
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Índice LeveMe</h3>
                <p className="text-sm text-muted-foreground">Potencial de transformação</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-emerald-600">
                  {isCalculated ? irrScore : '...'}
                </div>
                <div className="text-sm text-emerald-500">/10</div>
              </div>
            </div>
            
            {isCalculated && <div className="space-y-2">
                <div className="w-full bg-emerald-100 rounded-full h-2">
                  <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2 rounded-full transition-all duration-1000" style={{
                width: `${irrScore / 10 * 100}%`
              }} />
                </div>
                <div className="text-sm font-medium text-emerald-700">
                  {irrScore >= 8 ? 'Excelente base para resultados rápidos' : irrScore >= 6 ? 'Boa base, ajustes simples trarão grandes resultados' : irrScore >= 4 ? 'Base sólida, vamos otimizar alguns pontos' : 'Vamos construir uma base forte juntas'}
                </div>
              </div>}

            {/* Loading indicator while calculating */}
            {!isCalculated && <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500"></div>
                <p className="text-sm text-muted-foreground">Calculando seu índice...</p>
              </div>}
          </div>
        </div>

        {/* BMI Professional Display */}
        {isCalculated && userInfo.height && userInfo.weight && <div className="max-w-md mx-auto mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-lg p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Seu IMC Atual
                </h3>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="text-4xl font-bold text-blue-600">
                    {bmi.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {userInfo.height}cm • {userInfo.weight}kg
                  </div>
                </div>
              </div>
              
              <InteractiveBMIChart initialHeight={userInfo.height} initialWeight={userInfo.weight} className="border-0 shadow-none bg-transparent p-0" />
              
              <div className="mt-4 text-center">
                
              </div>
            </div>
          </div>}

        {/* IRR Visual Breakdown */}
        {isCalculated && <div className="max-w-md mx-auto mb-6">
            <IRRScoreVisual score={irrScore} waterScore={waterScore} budgetScore={budgetScore} routineScore={routineScore} waterLabel={WATER_INTAKE_LABELS[waterAnswer as keyof typeof WATER_INTAKE_LABELS] || 'não informada'} hasFlexibleRoutine={routineAnswer === 'afternoon_free' || routineAnswer === 'night_free'} hasNoBudgetBarrier={!barriersList?.includes('orcamento_curto')} />
          </div>}

        {/* Pattern interrupt - Professional insight */}
        {isCalculated && <div className="max-w-md mx-auto mb-6">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-amber-600 font-bold text-sm">💡</span>
                </div>
                <div>
                  
                  <p className="text-sm text-foreground leading-relaxed">
                    Isto explica por que dietas anteriores falharam: <strong>o ritmo não combinava com sua rotina específica</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>}

        {/* Continue Button */}
        {showCTA && <div className="text-center mt-8">
            <button onClick={handleCTAClick} className="px-8 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-semibold min-h-[44px] min-w-[44px]" aria-label="Ver meu ritual recomendado - próxima etapa">
              Ver meu ritual recomendado
            </button>
          </div>}

        {/* Social Badges */}
        <div className="mt-8">
          <SocialBadges variant="compact" />
        </div>
        
        {/* Disclaimer educativo */}
        <div className="text-center px-4 mt-6">
          
        </div>
      </div>

    </ProfessionalQuizLayout>;
};