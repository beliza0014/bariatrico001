import React, { useState, useEffect, useRef } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { useQuizStep } from '@/hooks/useQuizStep';
import { useQuiz } from '@/contexts/QuizContext';
import { QuizPageProps } from '@/types/quiz';
import { InterstitialQuestion } from '@/components/ui/Interstitial';
import { HealthConditionDetails } from './HealthConditionDetails';
import { HealthConditionConfirmation } from './HealthConditionConfirmation';
import { AnalysisLoadingBar } from '@/components/ui/AnalysisLoadingBar';
import { CheckCircle, ShieldCheck, Truck, CreditCard, Star, X, ArrowRight, ChevronRight, Clock, Target, TrendingUp, Zap, Heart, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SmartImage } from '@/components/ui/SmartImage';
import { WhatsAppChatCard } from '@/components/ui/WhatsAppChatCard';
import { GLOBAL_CONSTANTS, AB_TEST_DEFAULTS, AB_TEST_FLAGS } from '@/config/globalConstants';
import { SocialBadges } from '@/components/ui/SocialBadges';
import { useReservationTimer } from '@/hooks/useReservationTimer';
import { trackP20View, trackP20CTAClick, trackTimerExpired, trackProgressBarView, getPersonaFromAnswers } from '@/utils/trackingEnhanced';
// WhatsApp testimonials data with improved messages and realistic timestamps
const WHATSAPP_TESTIMONIALS_BY_BARRIER = {
  falta_tempo: [{
    name: 'Juliana',
    message: 'Gente, perdi 4 kg em 5 semanas mesmo sem tempo! Faço o chá em 3 minutos só 🙏',
    mediaSrc: '/lovable-uploads/9806ee48-f8bc-4dba-98de-897aac584a40.png',
    time: '14:23'
  }, {
    name: 'Carla',
    message: 'Rotina super corrida aqui e mesmo assim consegui emagrecer 6kg. O ritual é rápido demais! ✨',
    mediaSrc: '/lovable-uploads/7e356b84-30b7-4c25-bb0c-e815780ce430.png',
    time: '09:45'
  }, {
    name: 'Sandra',
    message: 'Sou mãe de 3 e sem tempo pra nada, mas o chá coube perfeitamente na rotina 💪',
    mediaSrc: '/lovable-uploads/e8605e35-590c-418b-a109-cb8d514353da.png',
    time: '16:12'
  }],
  ansiedade: [{
    name: 'Deyse',
    message: 'Parei de beliscar à noite! Acordo leve e com menos vontade de doce 🌟',
    mediaSrc: '/lovable-uploads/9806ee48-f8bc-4dba-98de-897aac584a40.png',
    time: '21:18'
  }, {
    name: 'Roberta',
    message: 'A ansiedade diminuiu muito! Não ataco mais a geladeira de madrugada 😅',
    mediaSrc: '/lovable-uploads/7e356b84-30b7-4c25-bb0c-e815780ce430.png',
    time: '15:42'
  }, {
    name: 'Luciana',
    message: 'Controlo melhor os impulsos e durmo tranquila. -5kg em 1 mês! 🎉',
    mediaSrc: '/lovable-uploads/e8605e35-590c-418b-a109-cb8d514353da.png',
    time: '11:33'
  }],
  orcamento_curto: [{
    name: 'Patrícia',
    message: 'Coube no bolso e valeu cada centavo! Minha energia subiu demais 💚',
    mediaSrc: '/lovable-uploads/e8605e35-590c-418b-a109-cb8d514353da.png',
    time: '13:27'
  }, {
    name: 'Rita',
    message: 'Muito em conta comparado a outros tratamentos. Resultado garantido! ✅',
    mediaSrc: '/lovable-uploads/9806ee48-f8bc-4dba-98de-897aac584a40.png',
    time: '10:55'
  }, {
    name: 'Helena',
    message: 'Paguei menos que uma academia e perdi 7kg. Melhor investimento da vida! 🔥',
    mediaSrc: '/lovable-uploads/7e356b84-30b7-4c25-bb0c-e815780ce430.png',
    time: '17:08'
  }],
  falta_constancia: [{
    name: 'Fernanda',
    message: 'Finalmente consegui seguir um plano! Medidas baixaram e ânimo voltou 💪',
    mediaSrc: '/lovable-uploads/7e356b84-30b7-4c25-bb0c-e815780ce430.png',
    time: '12:15'
  }, {
    name: 'Mônica',
    message: 'Pela primeira vez consegui ser constante. O sabor ajuda muito! 😍',
    mediaSrc: '/lovable-uploads/9806ee48-f8bc-4dba-98de-897aac584a40.png',
    time: '18:41'
  }, {
    name: 'Vera',
    message: 'Ritual simples que virou hábito. 3 semanas e já vejo diferença! 🌟',
    mediaSrc: '/lovable-uploads/e8605e35-590c-418b-a109-cb8d514353da.png',
    time: '08:29'
  }]
};
export const Page25PreCheckout: React.FC<QuizPageProps> = ({
  audio = {}
}) => {
  useQuizStep('Pre_Checkout');
  const {
    nextPage,
    userInfo,
    getAnswer,
    addAnswer
  } = useQuiz();

  // Interstitial state management
  const [showHealthQuestion, setShowHealthQuestion] = useState(true);
  const [showHealthDetails, setShowHealthDetails] = useState(false);
  const [showAnalysisLoading, setShowAnalysisLoading] = useState(false);
  const [showHealthConfirmation, setShowHealthConfirmation] = useState(false);
  const [showMainContent, setShowMainContent] = useState(false);
  const [showDeliveryQuestion, setShowDeliveryQuestion] = useState(false);
  const [healthCondition, setHealthCondition] = useState<string>('');
  const [healthConditionDetails, setHealthConditionDetails] = useState<string>('');
  const [deliveryPreference, setDeliveryPreference] = useState<string>('');

  // State management - consolidated from both pages
  const [currentProofIndex, setCurrentProofIndex] = useState(0);
  const [watcherCount, setWatcherCount] = useState(Math.floor(Math.random() * 23) + 21);
  const [showStickyButton, setShowStickyButton] = useState(false);
  const [ctaVariant] = useState(Math.random() < 0.5 ? 'primary' : 'alternative');
  const [scrollDepthTracked, setScrollDepthTracked] = useState(new Set<number>());
  const [showComparison, setShowComparison] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef(Date.now());

  // Get user's quiz responses (from Page24)
  const genderAnswer = getAnswer('Qual é o seu gênero?');
  const bodyTypeAnswer = getAnswer('Qual seu tipo de corpo?');
  const barriersAnswer = getAnswer('barreiras');
  const routineAnswer = getAnswer('daily_routine');
  const objectiveAnswer = getAnswer('Objetivo_Principal');
  const isUserMale = ['homem', 'masculino', 'm'].includes((genderAnswer?.answer || '').toString().toLowerCase());

  // Timer system for reservation (from Page24)
  const timer = useReservationTimer({
    initialMinutes: 15,
    pauseOnBlur: true,
    onExpired: () => {
      trackTimerExpired();
    }
  });

  // Helper function to determine main barrier with fallback
  const getMainBarrier = (): string => {
    try {
      const barriersAnswer = getAnswer('barreiras');
      const barriers = Array.isArray(barriersAnswer?.answer) ? barriersAnswer.answer : [];
      return barriers[0] || 'falta_constancia';
    } catch (error) {
      console.warn('Error getting main barrier:', error);
      return 'falta_constancia';
    }
  };

  // Enhanced personalization (consolidated from both pages)
  const getPersonalizedContent = () => {
    try {
      const mainBarrier = getMainBarrier();
      const userName = userInfo.name || 'Você';

      // Comparison page content
      const comparisonContent = {
        headline: userName ? `${userName}, seu plano foi gerado com base no seu perfil. ${isUserMale ? 'Pronto' : 'Pronta'} para começar?` : `Seu plano foi gerado com base no seu perfil. ${isUserMale ? 'Pronto' : 'Pronta'} para começar?`,
        subtitle: (() => {
          const persona = getPersonaFromAnswers(getAnswer);
          switch (persona) {
            case 'tempo_apertado':
              return 'Ajustado ao seu tempo limitado — 3 minutos que cabem na sua correria diária';
            case 'controle_impulso':
              return 'Fórmula que reduz a vontade de besteira — você vai se surpreender';
            default:
              return 'Ajustado ao seu tempo, rotina e objetivo — o quiz virou seu passo-a-passo';
          }
        })(),
        planMessage: 'Com base no seu perfil, criamos um protocolo nutricional simples e eficiente para seus objetivos'
      };

      // PreCheckout content
      const precheckoutContent = {
        falta_tempo: {
          headline: `${userName}, você está muito perto de garantir sua receita exclusiva para quem não tem tempo.`,
          subtitle: 'Antes do vídeo final, veja como pessoas com rotina corrida transformaram o corpo com 3 min/dia.',
          testimonials: WHATSAPP_TESTIMONIALS_BY_BARRIER.falta_tempo
        },
        ansiedade: {
          headline: `${userName}, você está muito perto de garantir sua receita exclusiva para controlar a ansiedade e beliscos noturnos.`,
          subtitle: 'Elas reduziram a vontade de doce e dormiram melhor nas primeiras semanas.',
          testimonials: WHATSAPP_TESTIMONIALS_BY_BARRIER.ansiedade
        },
        orcamento_curto: {
          headline: `${userName}, você está muito perto de garantir sua receita exclusiva sem gastar muito.`,
          subtitle: 'Resultados reais a partir de R$ 37,90, Pix aprovado na hora e garantia total.',
          testimonials: WHATSAPP_TESTIMONIALS_BY_BARRIER.orcamento_curto
        },
        falta_constancia: {
          headline: `${userName}, você está muito perto de garantir sua receita exclusiva com um plano simples para manter a constância.`,
          subtitle: 'Passo a passo curto, lembretes e sabor que ajuda a manter o ritual.',
          testimonials: WHATSAPP_TESTIMONIALS_BY_BARRIER.falta_constancia
        }
      };
      return {
        comparison: comparisonContent,
        precheckout: precheckoutContent[mainBarrier as keyof typeof precheckoutContent] || precheckoutContent.falta_constancia
      };
    } catch (error) {
      console.warn('Error getting personalized content:', error);
      // Fallback content
      return {
        comparison: {
          headline: `${userInfo.name || 'Você'}, seu plano está pronto!`,
          subtitle: 'Ajustado ao seu perfil e necessidades',
          planMessage: 'Protocolo personalizado baseado no seu quiz'
        },
        precheckout: {
          headline: `${userInfo.name || 'Você'}, você está muito perto de garantir sua receita exclusiva!`,
          subtitle: 'Antes do vídeo final, veja como milhares de pessoas já confiaram nesta solução e alcançaram resultados.',
          testimonials: WHATSAPP_TESTIMONIALS_BY_BARRIER.falta_constancia
        }
      };
    }
  };

  // Image mappings and body type logic (from Page24)
  const femaleImages = {
    regular: '/lovable-uploads/c24837e6-ee61-4ba9-b6de-9a200a46762d.png',
    barriga_falsa: '/lovable-uploads/57837bef-7591-4ef9-89b1-8e47b0c1eae5.png',
    flacida: '/lovable-uploads/377a8cff-1ed1-469f-980d-ba2699a23f70.png',
    sobrepeso: '/lovable-uploads/40f7afd4-e4e2-4df2-8901-489d1700d3c4.png'
  };
  const maleImages = {
    regular: '/lovable-uploads/9d6020ae-3512-402e-acda-4b8509bdee18.png',
    barriga_falsa: '/lovable-uploads/d6dd4652-ad6e-498c-8155-e875e0910b1f.png',
    flacida: '/lovable-uploads/96f23253-562e-4671-b88e-44f725230de4.png',
    sobrepeso: '/lovable-uploads/a3fb2acc-8c03-4939-b86a-93c5ac1f0efc.png'
  };
  const getBodyTypeKey = (bodyType: string) => {
    const mapping: {
      [key: string]: string;
    } = {
      'Regular': 'regular',
      'Barriga Falsa': 'barriga_falsa',
      'Flácida': 'flacida',
      'Sobrepeso': 'sobrepeso'
    };
    return mapping[bodyType] || 'regular';
  };
  const getCurrentBodyImage = () => {
    if (!bodyTypeAnswer?.answer) {
      return isUserMale ? maleImages.regular : femaleImages.regular;
    }
    const bodyTypeKey = getBodyTypeKey(bodyTypeAnswer.answer as string);
    return isUserMale ? maleImages[bodyTypeKey as keyof typeof maleImages] : femaleImages[bodyTypeKey as keyof typeof femaleImages];
  };

  // Progress bars calculation (from Page24)
  const getProgressBars = () => {
    const currentGordura = bodyTypeAnswer?.answer === 'Sobrepeso' ? 80 : bodyTypeAnswer?.answer === 'Barriga Falsa' ? 70 : bodyTypeAnswer?.answer === 'Flácida' ? 60 : 50;
    const currentEnergia = routineAnswer?.answer === 'morning_rush' ? 30 : routineAnswer?.answer === 'shift_work' ? 40 : routineAnswer?.answer === 'weekend_focus' ? 45 : routineAnswer?.answer === 'afternoon_free' ? 60 : routineAnswer?.answer === 'night_free' ? 70 : 50;
    const barriers = Array.isArray(barriersAnswer?.answer) ? barriersAnswer.answer : [];
    const currentConstancia = barriers.includes('falta_constancia') ? 40 : barriers.includes('ansiedade') ? 50 : 60;
    return {
      current: {
        gordura: currentGordura,
        energia: currentEnergia,
        constancia: currentConstancia
      },
      projected: {
        gordura: 20,
        energia: 90,
        constancia: 85
      }
    };
  };

  // Contextual testimonial (from Page24)
  const getContextualTestimonial = () => {
    const persona = getPersonaFromAnswers(getAnswer);
    const testimonials = {
      tempo_apertado: {
        text: "Eu também tinha pouco tempo. Ajustei os horários do chá e perdi os inchaços na 1ª semana.",
        author: "Deyse, 34, Recife"
      },
      estresse_alto: {
        text: "O estresse estava me sabotando. O ritual me acalmou e ainda perdi 3kg no primeiro mês.",
        author: "Carla, 41, São Paulo"
      },
      controle_impulso: {
        text: "Não conseguia parar de beliscar. Depois do chá, a vontade de besteira sumiu.",
        author: "Juliana, 28, Fortaleza"
      },
      geral: {
        text: "Resultado rápido e natural. Já estou no meu peso ideal em 6 semanas!",
        author: "Patricia, 35, Rio de Janeiro"
      }
    };
    return testimonials[persona] || testimonials.geral;
  };

  // Social proof ticker items
  const socialProofItems = [`✅ ${watcherCount} pessoas estão assistindo agora.`, "✅ Juliana, SP — eliminou 4kg em 15 dias.", "✅ Ana, RJ — fez a compra há 3 minutos.", "✅ Carlos, MG — perdeu 12kg em 2 meses.", "⚡ 156 receitas personalizadas entregues hoje.", "✅ Maria, RJ — mais energia em apenas 1 semana."];

  // Get personalized content and CTA text
  const personalizedContent = getPersonalizedContent();
  const currentBodyImage = getCurrentBodyImage();
  const progressBars = getProgressBars();
  const testimonialComparison = getContextualTestimonial();
  const ctaText = ctaVariant === 'primary' ? 'QUERO MINHA RECEITA AGORA' : 'GARANTIR MINHA RECEITA';
  useEffect(() => {
    let isMounted = true;
    try {
      audio.onEnter?.();
      const mainBarrier = getMainBarrier();

      // Combined tracking from both pages
      trackP20View(getAnswer, timer.timeRemaining);
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'p25_precheckout_view', {
          barrier: mainBarrier,
          variants: ctaVariant,
          hasSticky: false,
          timer_remaining: timer.timeRemaining
        });
      }

      // Show comparison after delay (from Page24)
      const showTimer = setTimeout(() => {
        if (isMounted) {
          setShowComparison(true);
          audio.onReveal?.();
          trackProgressBarView(`gordura_${progressBars.current.gordura}%`, `gordura_${progressBars.projected.gordura}%`);
        }
      }, 600);

      // Prefetch Kiwify checkout URL for performance
      const prefetchLink = document.createElement('link');
      prefetchLink.rel = 'prefetch';
      prefetchLink.href = 'https://pay.kiwify.com.br/I7LKmAh';
      document.head.appendChild(prefetchLink);

      // Auto-rotate social proof ticker every 25 seconds
      const tickerInterval = setInterval(() => {
        if (isMounted) {
          setCurrentProofIndex(prev => (prev + 1) % socialProofItems.length);
        }
      }, 25000);

      // Update watcher count every 25 seconds (range: 21-43)
      const watcherInterval = setInterval(() => {
        if (isMounted) {
          const newCount = Math.floor(Math.random() * 23) + 21;
          setWatcherCount(newCount);
        }
      }, 25000);

      // Scroll detection for sticky CTA and tracking
      const handleScroll = () => {
        if (!pageRef.current || !isMounted) return;
        try {
          const scrollTop = window.pageYOffset;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrollPercent = docHeight > 0 ? Math.round(scrollTop / docHeight * 100) : 0;

          // Show sticky CTA after 40% scroll on mobile
          if (scrollPercent >= 40 && window.innerWidth <= 768) {
            setShowStickyButton(prev => {
              if (!prev && typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'p23_view', {
                  barrier: mainBarrier,
                  variants: ctaVariant,
                  hasSticky: true
                });
              }
              return true;
            });
          }

          // Track scroll depth milestones
          [25, 50, 75, 100].forEach(milestone => {
            if (scrollPercent >= milestone) {
              setScrollDepthTracked(prev => {
                if (!prev.has(milestone) && typeof window !== 'undefined' && (window as any).gtag) {
                  (window as any).gtag('event', 'p23_scroll_depth', {
                    pct: milestone,
                    barrier: mainBarrier
                  });
                }
                return new Set([...prev, milestone]);
              });
            }
          });
        } catch (error) {
          console.warn('Error in scroll handler:', error);
        }
      };
      window.addEventListener('scroll', handleScroll, {
        passive: true
      });

      // Track dwell time on page unload
      const handleBeforeUnload = () => {
        try {
          const dwellTime = Date.now() - startTimeRef.current;
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'p23_dwell_ms', {
              dwell_ms: dwellTime,
              barrier: mainBarrier
            });
          }
        } catch (error) {
          console.warn('Error tracking dwell time:', error);
        }
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        isMounted = false;
        clearTimeout(showTimer);
        clearInterval(tickerInterval);
        clearInterval(watcherInterval);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('beforeunload', handleBeforeUnload);
        if (prefetchLink.parentNode) {
          prefetchLink.parentNode.removeChild(prefetchLink);
        }
      };
    } catch (error) {
      console.error('Error in Page23PreCheckout useEffect:', error);
    }
  }, []); // Remove dependencies to prevent recreation
  // Handle health question answer
  const handleHealthAnswer = (answer: string) => {
    setHealthCondition(answer);
    setShowHealthQuestion(false);
    if (answer === 'sim') {
      // Show health condition details page
      setShowHealthDetails(true);
    } else {
      // Go directly to main content if "não"
      setShowMainContent(true);
    }
  };

  // Handle health condition details
  const handleHealthConditionDetails = (details: string) => {
    setHealthConditionDetails(details);
    setShowHealthDetails(false);
    setShowAnalysisLoading(true);
  };

  // Handle analysis loading completion
  const handleAnalysisComplete = () => {
    setShowAnalysisLoading(false);
    setShowHealthConfirmation(true);
  };

  // Handle health condition confirmation
  const handleHealthConfirmationContinue = () => {
    setShowHealthConfirmation(false);
    setShowMainContent(true);
  };

  // Handle delivery question answer
  const handleDeliveryAnswer = (answer: string) => {
    setDeliveryPreference(answer);
    addAnswer('delivery_preference', answer);
    setShowDeliveryQuestion(false);
    // Navigate to contact capture page
    nextPage();
  };
  const handleContinue = (position: 'primary' | 'sticky' = 'primary') => {
    try {
      const mainBarrier = getMainBarrier();

      // Instead of going to next page directly, show delivery question
      setShowMainContent(false);
      setShowDeliveryQuestion(true);

      // Combined tracking from both pages
      trackP20CTAClick(getAnswer, ctaVariant === 'primary' ? 'começar_plano_ajustado' : 'ver_receita_completa', timer.timeRemaining, userInfo.name);
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'p25_precheckout_cta_click', {
          pos: position,
          variant: ctaVariant,
          barrier: mainBarrier,
          timer_remaining: timer.timeRemaining
        });
      }
      audio.onSelect?.();

      // Auto-scroll to prevent "jump" on some browsers
      if (position === 'sticky') {
        window.scrollBy({
          top: 40,
          behavior: 'smooth'
        });
      }
      setTimeout(() => {
        audio.onNext?.();
        // Don't navigate directly - show delivery question instead
      }, 80);
    } catch (error) {
      console.error('Error in handleContinue:', error);
    }
  };
  const handleTestimonialView = (testimonialId: string) => {
    try {
      const mainBarrier = getMainBarrier();
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'p23_testimonial_view', {
          id: testimonialId,
          barrier: mainBarrier
        });
      }
    } catch (error) {
      console.warn('Error tracking testimonial view:', error);
    }
  };
  const handleSocialTickerInteraction = () => {
    try {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'social_ticker_interaction', {
          proof_item: socialProofItems[currentProofIndex]
        });
      }
    } catch (error) {
      console.warn('Error tracking social ticker interaction:', error);
    }
  };
  const handleTrustRowView = () => {
    try {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'p23_trust_impression', {
          barrier: getMainBarrier()
        });
      }
    } catch (error) {
      console.warn('Error tracking trust row view:', error);
    }
  };
  // Progress bar components (from Page24)
  const ProgressBar = ({
    label,
    current,
    projected,
    icon: Icon,
    ariaLabel
  }: {
    label: string;
    current: number;
    projected: number;
    icon: React.ElementType;
    ariaLabel: string;
  }) => <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-muted-foreground" aria-label={ariaLabel} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground">Atual: {current > 60 ? 'Alta' : current > 40 ? 'Média' : 'Baixa'}</div>
        <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
          <div className="h-full bg-muted-foreground/60 rounded-full transition-all duration-300" style={{
          width: `${current}%`
        }} />
        </div>
      </div>
    </div>;
  const ProjectedProgressBar = ({
    label,
    projected,
    icon: Icon,
    ariaLabel
  }: {
    label: string;
    projected: number;
    icon: React.ElementType;
    ariaLabel: string;
  }) => <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-primary" aria-label={ariaLabel} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="space-y-1">
        <div className="text-xs text-primary font-medium">Meta: {projected > 80 ? 'Alta' : projected > 40 ? 'Média' : 'Baixa'}</div>
        <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300" style={{
          width: `${projected}%`
        }} />
        </div>
      </div>
    </div>;

  // Show health question first
  if (showHealthQuestion) {
    return <InterstitialQuestion title="Você tem alguma condição de saúde?" subtitle="Antes de finalizar, precisamos de mais um detalhe importante." options={[{
      label: 'Sim',
      value: 'sim'
    }, {
      label: 'Não',
      value: 'nao'
    }]} onAnswer={handleHealthAnswer} fromStep={24} toStep={25} questionType="health" />;
  }

  // Show health condition details if user answered "sim"
  if (showHealthDetails) {
    return <HealthConditionDetails onContinue={handleHealthConditionDetails} onBack={() => {
      setShowHealthDetails(false);
      setShowHealthQuestion(true);
    }} />;
  }

  // Show analysis loading bar after health condition details
  if (showAnalysisLoading) {
    return <AnalysisLoadingBar onComplete={handleAnalysisComplete} />;
  }

  // Show health condition confirmation after analysis is complete
  if (showHealthConfirmation) {
    return <HealthConditionConfirmation userName={userInfo.name} healthCondition={healthConditionDetails} onContinue={handleHealthConfirmationContinue} />;
  }

  // Show delivery question after main content CTA
  if (showDeliveryQuestion) {
    return <InterstitialQuestion title="Onde prefere receber seu plano personalizado?" options={[{
      label: 'WhatsApp',
      value: 'whatsapp'
    }, {
      label: 'E-mail',
      value: 'email'
    }]} onAnswer={handleDeliveryAnswer} fromStep={25} toStep={26} questionType="delivery" />;
  }

  // Show main content after health questions are completed
  // This ensures the page doesn't get stuck in loading state

  return <ProfessionalQuizLayout showProgress={false}>
      <div ref={pageRef} className="animate-betterme-page-enter space-y-6">
        {/* 1. Comparison Section (from Page24) */}
        <div className="space-y-6 animate-fade-in">
          <div className="text-center space-y-4">
            
          </div>

          {/* Before vs After Comparison */}
          {showComparison && <div className="transition-all duration-1000 opacity-100 translate-y-0">
              <div className="max-w-lg mx-auto">
                <div className="grid grid-cols-2 gap-4 relative">
                  {/* Before - Current State */}
                  <div className="bg-gradient-to-br from-muted/50 to-muted/30 border border-muted rounded-2xl p-5 text-center space-y-4 backdrop-blur-sm shadow-lg">
                    <div className="flex items-center justify-center mb-3">
                      <Badge variant="outline" className="text-xs px-3 py-1 bg-muted/80">
                        <Clock className="w-3 h-3 mr-1" />
                        Situação Atual
                      </Badge>
                    </div>
                    <div className="relative">
                      <SmartImage src={currentBodyImage} alt={`Situação atual - ${bodyTypeAnswer?.answer || 'Regular'}`} className="w-16 h-24 object-cover mx-auto rounded-xl grayscale shadow-lg" currentPage={27} priority="critical" skeletonType="body" loading="lazy" decoding="async" />
                    </div>
                    <div className="space-y-3">
                      <ProgressBar label="Gordura" current={progressBars.current.gordura} projected={0} icon={TrendingUp} ariaLabel="Gordura atual alta" />
                      <ProgressBar label="Energia" current={progressBars.current.energia} projected={0} icon={Zap} ariaLabel="Energia atual baixa" />
                      <ProgressBar label="Constância" current={progressBars.current.constancia} projected={0} icon={Target} ariaLabel="Constância atual média" />
                    </div>
                  </div>

                  {/* Animated Arrow */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-lg" style={{
                  animation: 'pulse-twice 2s ease-in-out'
                }}>
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* After - Goal State */}
                  <div className="bg-gradient-to-br from-primary/8 to-secondary/8 border border-primary/30 rounded-2xl p-5 text-center space-y-4 backdrop-blur-sm shadow-xl relative overflow-hidden">
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-primary to-secondary text-white text-xs px-3 py-1 shadow-lg">
                        <Award className="w-3 h-3 mr-1" />
                        Seu Objetivo
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 animate-pulse"></div>
                    <div className="relative z-10 mt-4">
                      
                    </div>
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur-sm"></div>
                      <SmartImage src={isUserMale ? maleImages.regular : femaleImages.regular} alt={`Seu objetivo - Corpo definido (${isUserMale ? 'Masculino' : 'Feminino'})`} className="relative w-16 h-24 object-cover mx-auto rounded-xl shadow-lg" currentPage={27} priority="critical" skeletonType="body" loading="lazy" decoding="async" />
                    </div>
                    <div className="space-y-3">
                      <ProjectedProgressBar label="Gordura" projected={progressBars.projected.gordura} icon={TrendingUp} ariaLabel="Gordura projetada baixa" />
                      <ProjectedProgressBar label="Energia" projected={progressBars.projected.energia} icon={Zap} ariaLabel="Energia projetada alta" />
                      <ProjectedProgressBar label="Constância" projected={progressBars.projected.constancia} icon={Target} ariaLabel="Constância projetada alta" />
                    </div>
                  </div>
                </div>

                  {/* Plan Ready Message - Enhanced */}
                <div className="mt-8 text-center space-y-6">
                  
                </div>
              </div>
            </div>}
        </div>

        {/* 2. PreCheckout Section - Enhanced */}
        

        {/* 2. Dynamic Social Proof Ticker with Watcher Count */}
        <div className="rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 hover:bg-gray-50" onClick={handleSocialTickerInteraction} style={{
        backgroundColor: '#F9F9F9',
        marginBottom: '24px'
      }}>
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-700 animate-fade-in">
            <span className="text-emerald-600 text-lg">✅</span>
            <span aria-live="polite" aria-label={`Prova social: ${socialProofItems[currentProofIndex]}`}>
              {socialProofItems[currentProofIndex].replace(/[✅🔥⚡]\s/, '')}
            </span>
          </div>
        </div>

        {/* 3. Trust Row Above CTA */}
        

        {/* 4. WhatsApp Style Testimonials - Profile Only */}
        <div className="space-y-4">
          {personalizedContent.precheckout.testimonials.slice(0, 3).map((testimonial, index) => <div key={`whatsapp-${testimonial.name}-${index}`} className="max-w-sm mx-auto">
              <div className="relative bg-[#0F1419] rounded-2xl overflow-hidden shadow-md">
                {/* WhatsApp Background */}
                <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `url(/lovable-uploads/fd2c4dc1-ae44-4cae-b252-568a4e74bde4.png)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} />
                <div className="absolute inset-0 bg-black/20" />
                
                {/* Message Content */}
                <div className="relative z-10 p-4">
                  <div className="flex items-start gap-3">
                    {/* Profile Image - Small */}
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#00A884]/20 flex-shrink-0">
                      <img src={testimonial.mediaSrc} alt={`${testimonial.name} - foto de perfil`} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    
                    {/* Message Bubble */}
                    <div className="flex-1 max-w-[85%]">
                      <div className="bg-[#202C33] rounded-lg rounded-tl-sm overflow-hidden shadow-md">
                        {/* Name */}
                        <div className="px-3 pt-2 pb-1">
                          <div className="text-[#00A884] text-[13px] font-semibold leading-tight">
                            {testimonial.name}
                          </div>
                        </div>
                        
                        {/* Message */}
                        <div className="px-3 pb-2">
                          <p className="text-[#E9EDEF] text-[14px] leading-[1.3] font-normal mb-1">
                            {testimonial.message}
                          </p>
                          
                          {/* Time and checkmarks */}
                          <div className="flex items-center justify-end gap-1">
                            <span className="text-[#8696A0] text-[11px] font-normal">{testimonial.time}</span>
                            <div className="flex items-center ml-1">
                              <svg className="w-3 h-3 text-[#53BDEB]" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                              </svg>
                              <svg className="w-3 h-3 text-[#53BDEB] -ml-1.5" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>)}
        </div>

        {/* 5. Primary CTA with Price - Moved after testimonials */}
        <div className="text-center" style={{
        marginBottom: '32px'
      }}>
          <Button onClick={() => handleContinue('primary')} variant="emerald" size="betterme" className="w-full max-w-md mx-auto mb-3" aria-label={`${ctaText} - Botão principal para continuar`}>
            {ctaText}
          </Button>
          
        </div>

        {/* 6. Social Proof Badges */}
        <SocialBadges variant="full" className="mb-6" />
        
        {/* Educational Disclaimer */}
        <div className="text-center px-4 mb-4">
          
        </div>
        
        {/* Legal Links */}
        <div className="text-center px-4">
          
        </div>
      </div>

      {/* Sticky CTA for Mobile */}
      {showStickyButton}
    </ProfessionalQuizLayout>;
};