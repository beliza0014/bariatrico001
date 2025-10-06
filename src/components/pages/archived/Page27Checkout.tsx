import React, { useState, useEffect, useRef } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { useQuiz } from '@/contexts/QuizContext';
import { useQuizStep } from '@/hooks/useQuizStep';
import { Button } from '@/components/ui/button';
import { ChevronRight, Clock, Users, Shield, CreditCard } from 'lucide-react';
import { QuizPageProps } from '@/types/quiz';
import { trackEvent } from '@/utils/tracking';
import { SmartImage } from '@/components/ui/SmartImage';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type BarrierNormalized = 'tempo' | 'ansiedade' | 'financeiro' | 'constancia' | 'apoio_social' | 'outro';
type GoalShort = 'menos_inchaco' | 'mais_energia' | 'reduzir_medidas' | 'melhorar_digestao' | 'outro';

interface BarrierConfig {
  label: string;
  microcopy: string;
  subHeadline: string;
}

const BARRIER_CONFIG: Record<BarrierNormalized, BarrierConfig> = {
  tempo: {
    label: 'Falta de tempo',
    microcopy: 'Preparo em 30s, leva junto para o trabalho.',
    subHeadline: 'Em menos de 1 minuto, veja como pessoas como você chegaram ao seu objetivo mesmo com a correria.'
  },
  ansiedade: {
    label: 'Ansiedade/compulsão',
    microcopy: 'Ritual noturno anti-belisco + lembretes leves.',
    subHeadline: 'Se sua barreira é ansiedade alimentar, este ritual de 3 min/dia foi feito para você.'
  },
  financeiro: {
    label: 'Orçamento curto',
    microcopy: 'A partir de ~R$3,30/dia. Mais barato que 1 lanche.',
    subHeadline: 'Solução que cabe no seu orçamento e dá resultados reais.'
  },
  constancia: {
    label: 'Falta de constância',
    microcopy: 'Ritual noturno anti-belisco + lembretes leves.',
    subHeadline: 'Sistema simples para manter a consistência sem esforço.'
  },
  apoio_social: {
    label: 'Falta de apoio',
    microcopy: 'Comunidade para caminhar junto.',
    subHeadline: 'Mais de 10.000 pessoas já começaram. Você não está sozinha.'
  },
  outro: {
    label: 'Outra prioridade',
    microcopy: 'Protocolo personalizado baseado nas suas respostas.',
    subHeadline: 'Seu plano personalizado está pronto para download.'
  }
};

export const Page27Checkout: React.FC<QuizPageProps> = ({ audio = {} }) => {
  useQuizStep('Checkout');
  const { userInfo, discount, getAnswer } = useQuiz();

  const [timeLeft, setTimeLeft] = useState(0);
  const [showUrgency, setShowUrgency] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [showSocialToast, setShowSocialToast] = useState(false);
  const hasShownToast = useRef(false);

  const getMainBarrier = (): BarrierNormalized => {
    const barriersAnswer = getAnswer('barreiras');
    if (Array.isArray(barriersAnswer?.answer)) {
      const barriers = barriersAnswer.answer;
      if (barriers.includes('falta_tempo')) return 'tempo';
      if (barriers.includes('ansiedade') || barriers.includes('compulsao')) return 'ansiedade';
      if (barriers.includes('orcamento_curto')) return 'financeiro';
      if (barriers.includes('falta_constancia')) return 'constancia';
      if (barriers.includes('falta_apoio')) return 'apoio_social';
    }
    return 'outro';
  };

  const getGoalShort = (): GoalShort => {
    const goalAnswer = getAnswer('Objetivo_Principal');
    if (!goalAnswer?.answer) return 'outro';
    switch (String(goalAnswer.answer)) {
      case 'energy':
        return 'mais_energia';
      case 'debloat':
        return 'menos_inchaco';
      case 'belly_fat':
      case 'inch_loss':
        return 'reduzir_medidas';
      default:
        return 'outro';
    }
  };

  const mainBarrier = getMainBarrier();
  const goalShort = getGoalShort();
  const barrierConfig = BARRIER_CONFIG[mainBarrier];
  const viewersCount = Math.floor(Math.random() * 15) + 20;

  useEffect(() => {
    trackEvent('p27_view', {
      mainBarrier_normalized: mainBarrier,
      goal_short: goalShort,
      name: userInfo.name || 'anonymous'
    });

    const initializeDeadline = () => {
      let deadline = localStorage.getItem('checkout_deadline');
      if (!deadline) {
        deadline = (Date.now() + 20 * 60 * 1000).toString();
        localStorage.setItem('checkout_deadline', deadline);
      }
      return parseInt(deadline);
    };

    const deadlineTime = initializeDeadline();
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.floor((deadlineTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 300) setShowUrgency(true);
      if (remaining <= 0) clearInterval(timer);
    }, 1000);

    if (!sessionStorage.getItem('p27_toast_shown') && !hasShownToast.current) {
      setTimeout(() => {
        setShowSocialToast(true);
        hasShownToast.current = true;
        sessionStorage.setItem('p27_toast_shown', 'true');
        trackEvent('ps_toast_show', { viewers_24h: viewersCount });
        setTimeout(() => setShowSocialToast(false), 4000);
      }, 2000);
    }

    audio.onEnter?.();
    return () => clearInterval(timer);
  }, [audio, mainBarrier, goalShort, userInfo.name]);

  const handleContinue = () => {
    if (isProcessingCheckout) return;
    setIsProcessingCheckout(true);
    audio.onSelect?.();


    // GA opcional
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'initiate_checkout_click', {
        label: 'p27_checkout',
        value: 37.90,
        currency: 'BRL'
      });
    }

    trackEvent('p27_cta_click', {
      cta_label: 'QUERO MINHA RECEITA AGORA',
      mainBarrier_normalized: mainBarrier
    });

    window.location.href = 'https://pay.kiwify.com.br/I7LKmAh';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const originalPrice = 297;
  const discountedPrice = originalPrice * (1 - discount / 100);

  return (
    <ProfessionalQuizLayout showProgress={false}>
      <div className="space-y-8 animate-fade-in">
        {showSocialToast && (
          <div className="fixed top-4 right-4 z-50 bg-emerald-50 border border-emerald-500/20 rounded-xl p-4 shadow-lg animate-slide-in-from-right">
            <div className="flex items-center space-x-2 text-emerald-800">
              <Users className="w-4 h-4" />
              <span className="font-medium text-sm">✅ {viewersCount} pessoas estão assistindo agora</span>
            </div>
          </div>
        )}

        {showUrgency && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 text-center animate-pulse">
            <p className="text-destructive font-bold">🚨 OFERTA EXPIRA EM: {formatTime(timeLeft)}</p>
          </div>
        )}

        <div className="text-center space-y-4">
          <h1 className="professional-question-title">
            {userInfo.name
              ? `${userInfo.name}, você está a um passo da sua receita exclusiva`
              : 'Sua Receita Foi Liberada!'}
          </h1>
        </div>

        {/* CTA: dispara InitiateCheckout */}
        <div className="text-center space-y-4">
          <Button
            onClick={handleContinue}
            disabled={isProcessingCheckout}
            variant="emerald"
            size="betterme"
            className="w-full transition-all duration-300"
            aria-label={`Clique para pegar sua receita personalizada. ${barrierConfig.microcopy}`}
          >
            QUERO MINHA RECEITA AGORA
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* ... restante do seu conteúdo permanece igual (cards, provas sociais, FAQ etc.) */}
      </div>
    </ProfessionalQuizLayout>
  );
};
