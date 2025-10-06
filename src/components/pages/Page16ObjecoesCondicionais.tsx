import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { useQuizStep } from '@/hooks/useQuizStep';
import { useQuiz } from '@/contexts/QuizContext';
import { useReservationTimer } from '@/hooks/useReservationTimer';
import { QuizPageProps } from '@/types/quiz';
import { Clock, Heart, DollarSign, Target, Lightbulb, Zap, CheckCircle, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SmartImage } from '@/components/ui/SmartImage';
import { GLOBAL_CONSTANTS } from '@/config/globalConstants';
import { trackEvent } from '@/utils/tracking';

// Simplified barrier types focusing on Page 15 responses
type BarrierType = 'falta_tempo' | 'autocontrole' | 'financeiro';
interface BarrierConfig {
  id: BarrierType;
  title: string;
  subtitle: string;
  mainCard: {
    icon: React.ElementType;
    gradient: string;
    borderColor: string;
    iconBg: string;
    textColor: string;
    accentColor: string;
    headline: string;
    benefits: string;
    urgency: string;
  };
  socialProof: {
    stat: string;
    testimonial: string;
    author: string;
  };
  objections: {
    title: string;
    solutions: string[];
  };
}

// Intelligent barrier configurations
const BARRIER_CONFIGS: Record<BarrierType, BarrierConfig> = {
  falta_tempo: {
    id: 'falta_tempo',
    title: 'Sua solução personalizada para FALTA DE TEMPO',
    subtitle: 'Ritual otimizado para rotinas corridas - apenas 3 minutos',
    mainCard: {
      icon: Clock,
      gradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-300',
      iconBg: 'bg-blue-500',
      textColor: 'text-blue-800',
      accentColor: 'text-blue-600',
      headline: '⚡ Ritual de 3 minutos que cabe na sua rotina',
      benefits: '✓ Zero preparo • ✓ Encaixa entre compromissos • ✓ Resultados em 7 dias',
      urgency: 'Perfeito para quem tem agenda lotada'
    },
    socialProof: {
      stat: '94% das usuárias ocupadas perderam 3-7kg em 30 dias',
      testimonial: '"Mesmo com 3 filhos e trabalho, consegui emagrecer 5kg em 1 mês!"',
      author: 'Marina, 34 anos, empresária'
    },
    objections: {
      title: 'Mas e se eu esquecer ou não conseguir manter?',
      solutions: ['Lembretes automáticos no celular', 'Ritual flexível: manhã, tarde ou noite', 'Backup para dias corridos: versão 1 minuto']
    }
  },
  autocontrole: {
    id: 'autocontrole',
    title: 'Sua solução personalizada para AUTOCONTROLE',
    subtitle: 'Sistema que mantém disciplina automaticamente',
    mainCard: {
      icon: Target,
      gradient: 'from-emerald-50 to-emerald-100',
      borderColor: 'border-emerald-300',
      iconBg: 'bg-emerald-500',
      textColor: 'text-emerald-800',
      accentColor: 'text-emerald-600',
      headline: '🎯 Sistema que funciona mesmo sem força de vontade',
      benefits: '✓ Rotina guiada • ✓ Progresso visível • ✓ Constância automática',
      urgency: 'Ideal para quem já tentou várias vezes'
    },
    socialProof: {
      stat: '87% conseguiram manter por +6 meses (primeira vez)',
      testimonial: '"Finalmente algo que consegui manter! Já são 4 meses emagrecendo."',
      author: 'Carla, 41 anos, tentou +10 dietas'
    },
    objections: {
      title: 'E se eu desistir como das outras vezes?',
      solutions: ['Sistema de micro-hábitos (impossível falhar)', 'Check-ins diários que motivam continuar', 'Progresso visível desde o 3º dia']
    }
  },
  financeiro: {
    id: 'financeiro',
    title: 'Sua solução personalizada para ORÇAMENTO APERTADO',
    subtitle: 'Menos que R$3,30/dia - cabe no seu bolso',
    mainCard: {
      icon: DollarSign,
      gradient: 'from-emerald-50 to-emerald-100',
      borderColor: 'border-emerald-300',
      iconBg: 'bg-emerald-500',
      textColor: 'text-emerald-800',
      accentColor: 'text-emerald-600',
      headline: '💰 Menos que 1 café por dia para emagrecer',
      benefits: '✓ R$3,30/dia • ✓ Pix aprovado • ✓ Garantia 30 dias',
      urgency: 'Investimento que se paga em autoestima'
    },
    socialProof: {
      stat: '91% economizaram dinheiro (menos gastos com comida)',
      testimonial: '"Gastava R$15/dia em besteiras. Agora gasto R$3,30 e emagreço!"',
      author: 'Patrícia, 28 anos, auxiliar administrativa'
    },
    objections: {
      title: 'E se não der certo? Vou perder o dinheiro?',
      solutions: ['Garantia total de 30 dias (devolução 100%)', 'Pode parcelar sem juros no cartão', 'Suporte gratuito por WhatsApp']
    }
  }
};
export const Page16ObjecoesCondicionais: React.FC<QuizPageProps> = ({
  audio = {}
}) => {
  useQuizStep('Consumo_de_Agua');
  const {
    getAnswer,
    nextPage,
    userInfo
  } = useQuiz();
  const [expandedObjection, setExpandedObjection] = useState<boolean>(false);
  const [dwellStartTime] = useState(Date.now());
  const [hasInteracted, setHasInteracted] = useState(false);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer from Page26
  const timer = useReservationTimer({
    initialMinutes: 15,
    onExpired: () => {
      trackEvent('timer_expired', {
        step: 16,
        event_type: 'reservation_expired'
      });
    }
  });

  // Get barrier from Page 15 - improved logic to handle different answer formats
  const getSelectedBarrier = (): BarrierType => {
    // Try different possible answer keys from Page 15
    const barrierAnswer = getAnswer('O que te impede de emagrecer?') || getAnswer('barreiras') || localStorage.getItem('lm_barriers');
    if (process.env.NODE_ENV !== 'production') {
      console.log('🎯 Barrier answer:', barrierAnswer);
    }

    // Extract the actual value from different formats
    let barrierValue: string;
    if (typeof barrierAnswer === 'object' && barrierAnswer?.answer) {
      // Handle both string and array cases for answer property
      if (Array.isArray(barrierAnswer.answer)) {
        barrierValue = barrierAnswer.answer[0];
      } else {
        barrierValue = barrierAnswer.answer;
      }
    } else if (typeof barrierAnswer === 'string') {
      barrierValue = barrierAnswer;
    } else if (Array.isArray(barrierAnswer) && barrierAnswer.length > 0) {
      barrierValue = barrierAnswer[0];
    } else {
      barrierValue = 'autocontrole'; // fallback
    }
    if (process.env.NODE_ENV !== 'production') {
      console.log('🎯 Extracted barrier value:', barrierValue);
    }

    // Ensure it's a valid barrier type
    if (['falta_tempo', 'autocontrole', 'financeiro'].includes(barrierValue)) {
      return barrierValue as BarrierType;
    }
    return 'autocontrole'; // safe fallback
  };
  const selectedBarrier = getSelectedBarrier();
  const config = BARRIER_CONFIGS[selectedBarrier];
  if (process.env.NODE_ENV !== 'production') {
    console.log('🎯 Selected barrier:', selectedBarrier);
    console.log('🎯 Config:', config);
  }

  // Timer pulse and scroll effect
  const handleTimerPulse = useCallback(() => {
    if (!hasInteracted && ctaRef.current && mainCardRef.current) {
      // Pulse main card
      mainCardRef.current.style.transform = 'scale(1.02)';
      mainCardRef.current.style.transition = 'transform 0.3s ease-in-out';
      setTimeout(() => {
        if (mainCardRef.current) {
          mainCardRef.current.style.transform = 'scale(1)';
        }
      }, 300);

      // Gentle scroll to CTA
      setTimeout(() => {
        ctaRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 400);
    }
  }, [hasInteracted]);

  // Separate useEffect for audio to prevent loops
  useEffect(() => {
    audio.onEnter?.();
  }, []); // Only run once on mount

  useEffect(() => {
    // Track personalized view with detailed analytics
    trackEvent('personalized_solution_view', {
      barrier_type: selectedBarrier,
      barrier_title: config.title,
      page: 16,
      user_name: userInfo.name
    });

    // Set 9s timer for pulse effect
    timerRef.current = setTimeout(handleTimerPulse, 9000);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [selectedBarrier, config.title, userInfo.name, handleTimerPulse]);
  const handleContinue = () => {
    setHasInteracted(true);

    // Track CTA click with rich analytics
    const dwellMs = Date.now() - dwellStartTime;
    trackEvent('personalized_cta_click', {
      barrier_type: selectedBarrier,
      cta_copy: "VER MINHA SOLUÇÃO PERSONALIZADA",
      dwell_ms_when_click: dwellMs,
      timer_remaining_ms: timer.timeRemaining,
      user_name: userInfo.name,
      objection_expanded: expandedObjection
    });
    audio.onSelect?.();
    setTimeout(() => {
      audio.onNext?.();
      // Preserve timer state for next page
      sessionStorage.setItem('p16_timer_started', 'true');
      nextPage();
    }, 100);
  };
  const handleExpandObjection = () => {
    setHasInteracted(true);
    setExpandedObjection(!expandedObjection);

    // Track objection expansion
    trackEvent('objection_expand', {
      barrier_type: selectedBarrier,
      action: expandedObjection ? 'collapse' : 'expand'
    });
  };
  const MainIcon = config.mainCard.icon;
  return <ProfessionalQuizLayout headerTitle="Solução personalizada">
      <div className="animate-betterme-page-enter">
        <div className="space-y-6 max-w-md mx-auto px-4">
          {/* Personalized Header */}
          

          {/* Main Personalized Card */}
          

          {/* Texto explicativo antes da imagem */}
          <div className="text-center mb-6 space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Te entendemos!
            </h2>
            <p className="text-base text-foreground/90">
              Os Chás Bariátricos age enquanto você dorme, queimando gordura de forma acelerada!
            </p>
          </div>

          {/* Imagem explicativa do Chá Pronto */}
          <div className="flex justify-center mb-4">
            <SmartImage src="/lovable-uploads/como-cha-bariatrico-funciona.png" alt="Como o chá bariátrico funciona - ciclo de emagrecimento" className="w-full max-w-sm h-auto object-contain rounded-xl" currentPage={24} priority="high" skeletonType="card" loading="lazy" decoding="async" />
          </div>

          {/* Social Proof Section */}
          

          {/* Objection Handling (Collapsible) */}
          

          {/* Timer and Urgency */}
          

          {/* CTA Button */}
          <div className="space-y-3">
            <Button ref={ctaRef} onClick={handleContinue} variant="emerald" size="betterme" className="w-full text-base font-bold py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200">
              VER MINHA SOLUÇÃO PERSONALIZADA
            </Button>
            
            {/* Microcopy */}
            
          </div>
        </div>
      </div>
    </ProfessionalQuizLayout>;
};