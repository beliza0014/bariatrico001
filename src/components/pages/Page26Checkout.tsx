import React, { useState, useEffect, useRef } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { useQuiz } from '@/contexts/QuizContext';
import { useQuizStep } from '@/hooks/useQuizStep';
import { Button } from '@/components/ui/button';
import { CustomVideoPlayer } from '@/components/ui/CustomVideoPlayer';
import { ChevronRight, Clock, Users, Shield, CreditCard } from 'lucide-react';
import { QuizPageProps } from '@/types/quiz';
import { trackEvent } from '@/utils/tracking';
import { SmartImage } from '@/components/ui/SmartImage';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import whatsappTransformationAnaLucia from '@/assets/whatsapp-transformation-ana-lucia.jpg';
import { SocialBadges } from '@/components/ui/SocialBadges';
import { SocialProofCarousel } from '@/components/ui/SocialProofCarousel';
import { GLOBAL_CONSTANTS } from '@/config/globalConstants';
import { EnhancedCTACard } from '@/components/ui/EnhancedCTACard';
import { useOptimizedImageCache } from '@/hooks/useOptimizedImageCache';
import { trackPixelInitiateCheckout } from '@/utils/pixelTracking';
import { InterstitialQuestion } from '@/components/ui/Interstitial';

// Enhanced types for barrier and goal mapping
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
    microcopy: 'Benefícios gerais: menos inchaço, energia, saciedade.',
    subHeadline: 'Em menos de 1 minuto, veja como pessoas como você chegaram aos seus objetivos.'
  }
};
export const Page26Checkout: React.FC<QuizPageProps> = ({
  audio = {}
}) => {
  useQuizStep('Checkout');
  const {
    userInfo,
    discount,
    nextPage,
    getAnswer
  } = useQuiz();

  // Interstitial state management
  const [showBodyQuestion, setShowBodyQuestion] = useState(true);
  const [showMainContent, setShowMainContent] = useState(false);
  const [bodyGoal, setBodyGoal] = useState<string>('');

  // State management - SIMPLIFIED LIKE PAGE14
  const [timeLeft, setTimeLeft] = useState(0);
  const [showUrgency, setShowUrgency] = useState(false);
  const [showSocialToast, setShowSocialToast] = useState(false);
  const [videoWatchedPercent, setVideoWatchedPercent] = useState(0);

  // Video play control and CTA timing (50 seconds after play) - EXACTLY LIKE PAGE14
  const [hasVideoPlayed, setHasVideoPlayed] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const ctaTimerRef = useRef<NodeJS.Timeout | null>(null);
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
    const goalId = String(goalAnswer.answer);
    switch (goalId) {
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

  // Generate dynamic viewers count (27 fallback)
  const viewersCount = Math.floor(Math.random() * 15) + 20; // 20-34 range

  // Initialize image preloading system
  const {
    preloadImage
  } = useOptimizedImageCache(26);

  // Timer management - starts when CTA buttons appear
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize page and tracking
  useEffect(() => {
    // Track page view
    trackEvent('p24_view', {
      mainBarrier_normalized: mainBarrier,
      goal_short: goalShort,
      name: userInfo.name || 'anonymous'
    });

    // Show social toast once per session
    const toastShown = sessionStorage.getItem('p24_toast_shown');
    if (!toastShown && !hasShownToast.current) {
      setTimeout(() => {
        setShowSocialToast(true);
        hasShownToast.current = true;
        sessionStorage.setItem('p24_toast_shown', 'true');
        trackEvent('ps_toast_show', {
          viewers_24h: viewersCount
        });
        setTimeout(() => setShowSocialToast(false), 4000);
      }, 2000);
    }

    // Play enter sound
    audio.onEnter?.();
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (ctaTimerRef.current) clearTimeout(ctaTimerRef.current);
    };
  }, [audio, mainBarrier, goalShort, userInfo.name]);

  // Start timer when CTA buttons appear
  useEffect(() => {
    if (showContinueButton && !timerIntervalRef.current) {
      console.log('⏰ Starting 15-minute timer - CTA buttons are visible');

      // Initialize deadline
      const initializeDeadline = () => {
        let deadline = localStorage.getItem('checkout_deadline');
        if (!deadline) {
          deadline = (Date.now() + 15 * 60 * 1000).toString();
          localStorage.setItem('checkout_deadline', deadline);
        }
        return parseInt(deadline);
      };
      const deadlineTime = initializeDeadline();

      // Update timer every second
      timerIntervalRef.current = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((deadlineTime - now) / 1000));
        setTimeLeft(remaining);
        if (remaining <= 300) setShowUrgency(true);
        if (remaining <= 0 && timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
      }, 1000);
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [showContinueButton]);

  // Video event handlers - EXACTLY LIKE PAGE14 (but 50s instead of 30s)
  const handleVideoPlay = () => {
    console.log('🎬 Video play started - Page26');
    trackEvent('p26_video_start', {
      mainBarrier_normalized: mainBarrier,
      goal_short: goalShort,
      name: userInfo.name
    });

    // IDENTICAL TO PAGE14 - Simple CTA timer but 50 seconds
    if (!hasVideoPlayed) {
      console.log('🚀 Starting 90s CTA timer (identical to Page14 pattern)');
      setHasVideoPlayed(true);

      // Clear any existing timer
      if (ctaTimerRef.current) {
        clearTimeout(ctaTimerRef.current);
      }

      // ✨ NOVO: Pré-carregamento de imagens durante o vídeo
      console.log('🎯 Iniciando pré-carregamento de imagens durante vídeo...');
      const imagesToPreload = ['/lovable-uploads/cupom-desconto-50-off.png', '/lovable-uploads/3027f407-e3e3-49d9-b580-9b2a2e329a97.png',
      // Karolina
      '/lovable-uploads/0c6d3fef-1fb2-4895-9686-e0182a8e27a9.png',
      // Jessica
      '/lovable-uploads/ba7ba216-78ee-425f-a50d-dc289dcb1b8e.png',
      // Paulinha
      '/lovable-uploads/seu-plano-inclui.png', '/lovable-uploads/aplicativo-facil-acesso.png', '/lovable-uploads/garantia-30-dias.png', '/lovable-uploads/nutricionista-camila-santos.png', '/lovable-uploads/progress-chart-transformation.png?v=2'];

      // Inicia pré-carregamento imediatamente com prioridade alta
      imagesToPreload.forEach((src, index) => {
        setTimeout(() => {
          // preloadImage agora não retorna promise, apenas adiciona à fila
          preloadImage(src, 1); // Priority 1 = essential
          console.log(`🎯 Imagem ${index + 1}/${imagesToPreload.length} adicionada à fila: ${src.split('/').pop()}`);
        }, index * 100); // Reduzido de 500ms para 100ms
      });

      // Exactly like Page14 - simple timeout
      ctaTimerRef.current = setTimeout(() => {
        console.log('✅ 90s completed - Showing CTA (Page14 pattern)');
        setShowContinueButton(true);

        // Track CTA show after 90s
        trackEvent('p26_cta_unlocked', {
          delay_seconds: 90,
          barrier: mainBarrier,
          name: userInfo.name
        });
      }, 90000); // 90 seconds as requested
    }
  };

  // CTA handler - IMMEDIATE REDIRECT TO KIWIFY
  const handleContinue = () => {
    // Fire tracking events asynchronously (non-blocking)
    trackPixelInitiateCheckout();
    trackEvent('p26_liberar_acesso_click', {
      value: 37.90,
      currency: 'BRL',
      mainBarrier_normalized: mainBarrier,
      name: userInfo.name
    });
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'begin_checkout', {
        value: 37.90,
        currency: 'BRL'
      });
    }

    // Immediate redirect to Kiwify
    window.location.replace('https://pay.kiwify.com.br/I7LKmAh');
  };

  // Keyboard handlers - SIMPLIFIED LIKE PAGE14
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // Only allow if CTA is actually available
        if (showContinueButton) {
          handleContinue();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showContinueButton]);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  // Handle body question answer
  const handleBodyAnswer = (answer: string) => {
    setBodyGoal(answer);
    setShowBodyQuestion(false);
    setShowMainContent(true);
  };
  const originalPrice = 297;
  const discountedPrice = originalPrice * (1 - discount / 100);

  // Show body question first
  if (showBodyQuestion) {
    return <InterstitialQuestion title="Qual o corpo dos seus sonhos?" subtitle="Escolha a opção abaixo:" options={[{
      label: 'Natural',
      value: 'natural'
    }, {
      label: 'Em forma',
      value: 'em_forma'
    }]} onAnswer={handleBodyAnswer} fromStep={25} toStep={26} questionType="body" />;
  }

  // Show main content only after question is answered
  if (!showMainContent) {
    return <div>Carregando...</div>;
  }
  return <ProfessionalQuizLayout showProgress={false}>
      <div className="space-y-8 animate-fade-in">
        {/* Social Proof Toast */}
        {showSocialToast && <div className="fixed top-4 right-4 z-50 bg-emerald-50 border border-emerald-500/20 rounded-xl p-4 shadow-lg animate-slide-in-from-right" role="status" aria-live="polite">
            <div className="flex items-center space-x-2 text-emerald-800">
              <Users className="w-4 h-4" />
              <span className="font-medium text-sm">
                ✅ {viewersCount} pessoas estão assistindo agora
              </span>
            </div>
          </div>}

        {/* Urgency Timer */}
        {showUrgency}

        {/* H1 em quadro verde acima do vídeo */}
        <div className="bg-emerald-500 rounded-2xl p-6 mb-6 max-w-2xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold text-black text-center leading-tight">
            Seu plano está pronto! Assista o vídeo e libere por R$ 37,90
          </h1>
        </div>

        {/* Video Section */}
        <div className="max-w-2xl mx-auto">
          <CustomVideoPlayer src="https://res.cloudinary.com/dpsmdgdzi/video/upload/v1757199582/ROTINA_DOS_CH%C3%81S_BARI%C3%81TRICOS_EMAGRECEDORES_1_ulwdtr.mp4" poster="/lovable-uploads/p13-poster.jpg" onPlay={handleVideoPlay} className="w-full rounded-2xl" />
        </div>

       {/* Botão verde fixo abaixo do vídeo - só aparece após 90s de vídeo */}
        {showContinueButton && <div className="text-center space-y-4 mt-6">
            <Button onClick={handleContinue} variant="emerald" size="betterme" className="w-full max-w-md mx-auto text-white">
              LIBERAR ACESSO
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>}

        {/* COMPLETE PAGE 27 CONTENT - Only shows when CTA is unlocked */}
        {showContinueButton && <div className="space-y-8 animate-fade-in mt-8">
            {/* Social Proof Carousel */}
            <div className="space-y-6 mt-8">
              <SocialProofCarousel images={[{
            src: "/lovable-uploads/3027f407-e3e3-49d9-b580-9b2a2e329a97.png",
            alt: "Depoimento Karolina - Perdeu 13kg em 27 dias com os chás bariátricos"
          }, {
            src: "/lovable-uploads/0c6d3fef-1fb2-4895-9686-e0182a8e27a9.png",
            alt: "Depoimento Jessica - Transformação incrível com os chás"
          }, {
            src: "/lovable-uploads/ba7ba216-78ee-425f-a50d-dc289dcb1b8e.png",
            alt: "Depoimento Paulinha - Perdeu 6kg em 10 dias"
          }]} autoplayInterval={4000} />
            </div>

            {/* Bônus Grátis Section */}
            <div className="space-y-6 mt-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Você Ainda Recebe 5 BÔNUS Grátis
                </h2>
              </div>
              
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 shadow-lg border border-amber-200">
                  {/* Header com preço */}
                  <div className="text-center mb-6">
                    <div className="text-gray-500 line-through text-sm mb-1">R$ 97,00</div>
                    <div className="text-3xl font-bold text-emerald-600">GRÁTIS</div>
                  </div>
                  
                  {/* Lista de bônus */}
                  <div className="space-y-4">
                    {/* Bônus 1 */}
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-emerald-500 rounded flex items-center justify-center mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-teal-700 text-base">Protocolo Anti Infarto:</h3>
                        <p className="text-gray-700 text-sm">Receitas que Promovem a prevenção de Infartos</p>
                      </div>
                    </div>
                    
                    {/* Bônus 2 */}
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-emerald-500 rounded flex items-center justify-center mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-teal-700 text-base">Protocolo Anti AVC:</h3>
                        <p className="text-gray-700 text-sm">Receitas que Promovem a prevenção de possíveis AVC</p>
                      </div>
                    </div>
                    
                    {/* Bônus 3 */}
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-emerald-500 rounded flex items-center justify-center mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-teal-700 text-base">Receitas de Suco Detox:</h3>
                        <p className="text-gray-700 text-sm">Desintoxicação natural</p>
                      </div>
                    </div>
                    
                    {/* Bônus 4 */}
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-emerald-500 rounded flex items-center justify-center mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-teal-700 text-base">Método "Foguete Metabólico":</h3>
                        <p className="text-gray-700 text-sm">Método que acelera o metabolismo e aumenta a disposição diária</p>
                      </div>
                    </div>
                    
                    {/* Bônus 5 */}
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-emerald-500 rounded flex items-center justify-center mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-teal-700 text-base">Protocolo "12 Alimentos do Amor":</h3>
                        <p className="text-gray-700 text-sm">Alimentos que estimulam a libido.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Card após Bônus Grátis */}
            <div className="mt-8">
              <EnhancedCTACard onClickAction={handleContinue} disabled={false} isProcessing={false} />
            </div>

            {/* Aplicativo Fácil Acesso Section */}
            <div className="space-y-6 mt-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Veja como é fácil emagrecer com esse protocolo seguindo o passo a passo.
                </h2>
              </div>
              
              <div className="max-w-4xl mx-auto">
                <SmartImage src={whatsappTransformationAnaLucia} alt="Depoimento WhatsApp - Ana Lúcia perdeu 11kg com chás bariátricos, mostrando transformação real antes e depois" className="w-full h-auto rounded-2xl shadow-lg" currentPage={26} priority="normal" loading="lazy" />
              </div>
            </div>

            {/* CTA Card após Aplicativo */}
            <div className="mt-8">
              <EnhancedCTACard onClickAction={handleContinue} disabled={false} isProcessing={false} />
            </div>

            {/* Garantia Section - Detailed Version */}
            <div className="space-y-6 mt-8">
              <div className="flex justify-center mb-6">
                <SmartImage src="/lovable-uploads/garantia-30-dias.png" alt="Garantia de 30 dias" className="w-32 h-32" currentPage={26} priority="normal" loading="lazy" />
              </div>
              
              <div className="max-w-2xl mx-auto">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-bold text-foreground">
                      Garantia de Reembolso
                    </h3>
                    
                    <div className="flex justify-center space-x-1 mb-4">
                      <span className="text-yellow-400 text-lg">⭐⭐⭐⭐⭐</span>
                    </div>
                    
                    <div className="space-y-4 text-muted-foreground">
                      <p>
                        Confiamos tanto na fórmula que oferecemos <strong className="text-foreground">30 dias de Garantia</strong>.
                      </p>
                      
                      <p>
                        Ou seja, se você não gostar ou não conseguir perder 1kg sequer no primeiro mês de uso, nós reembolsaremos cada centavo que você pagou, <strong className="text-foreground">sem questionar</strong>.
                      </p>
                      
                      <p className="text-sm">
                        Basta enviar um e-mail para o suporte em <strong className="text-emerald-600">contato.suporte.officiall@gmail.com</strong> ou pedir direto pelo aplicativo!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Card após Garantia */}
            <div className="mt-8">
              <EnhancedCTACard onClickAction={handleContinue} disabled={false} isProcessing={false} />
            </div>

            {/* Imagem da Nutricionista */}
            <div className="flex justify-center mt-6">
              <SmartImage src="/lovable-uploads/nutricionista-camila-santos.png" alt="Nutricionista Camila Santos - CRN SP 10-9552" className="w-48 h-auto rounded-lg shadow-lg" currentPage={26} priority="normal" loading="lazy" />
            </div>

            {/* Card da Nutricionista */}
            <div className="bg-card border border-border rounded-xl p-6 max-w-md mx-auto mt-4 shadow-lg">
              <div className="text-center space-y-2">
                <p className="text-foreground font-semibold">
                  Protocolo gerado por: <span className="text-primary">Camila Santos</span>
                </p>
                <p className="text-muted-foreground">
                  Nutricionista: <span className="font-medium">CRN SP 10-9552</span>
                </p>
              </div>
            </div>

            {/* Progress Chart */}
            <div className="flex justify-center mt-6">
              
            </div>

            {/* CTA 4 - Enhanced Design After Progress Chart */}
            <div className="flex justify-center">
              <EnhancedCTACard onClickAction={handleContinue} disabled={false} isProcessing={false} />
            </div>

            {/* FAQ Section */}
            <div className="space-y-6 mt-8">
              <h2 className="text-2xl font-bold text-foreground text-center">
                Perguntas Frequentes
              </h2>
              
              <div className="max-w-2xl mx-auto">
                <Accordion type="single" collapsible className="space-y-4">
                  <AccordionItem value="item-1" className="border border-gray-200 rounded-lg px-4">
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                      Quando terei acesso ao material?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      👉 Assim que o pagamento for confirmado pelo sistema, você receberá um e-mail e Whatsapp com todos os dados de acesso imediatamente.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2" className="border border-gray-200 rounded-lg px-4">
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                      É seguro? Terei alguma cobrança adicional?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      👉 Sim, é 100% seguro! Você paga apenas uma vez e não há nenhuma cobrança adicional ou mensalidade.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3" className="border border-gray-200 rounded-lg px-4">
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                      Quais formas de pagamento vocês aceitam?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      👉 Aceitamos PIX e cartão de crédito (em até 8x).
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4" className="border border-gray-200 rounded-lg px-4">
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                      Preciso fazer dieta junto com o uso dos chás?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      👉 NÃO. O protocolo funciona independentemente de dietas restritivas. Ele acelera o metabolismo e ajuda na queima de gordura mesmo sem você mudar nada na sua alimentação.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5" className="border border-gray-200 rounded-lg px-4">
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                      Preciso fazer exercícios para ter resultado?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      👉 Não. O grande diferencial do Ritual é que ele age diretamente no metabolismo e no acúmulo de gordura, sem depender de exercícios.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6" className="border border-gray-200 rounded-lg px-4">
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                      Funciona para qualquer idade?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      👉 Sim. Os chás foram desenvolvidos para o corpo feminino em diferentes fases da vida.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-7" className="border border-gray-200 rounded-lg px-4">
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                      É seguro? Tem algum efeito colateral?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      👉 100% seguro. O Ritual é baseado em chás naturais, sem química, sem cápsulas artificiais e sem risco de dependência.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-8" className="border border-gray-200 rounded-lg px-4">
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                      Os ingredientes são caros ou difíceis de achar?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      👉 Não. Todos os ingredientes dos chás são naturais, baratos e encontrados facilmente em qualquer supermercado ou feira. Nada de fórmulas caras ou produtos importados.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            {/* CTA após FAQ - Adiciona botão após última pergunta */}
            <div className="mt-8">
              <EnhancedCTACard onClickAction={handleContinue} disabled={false} isProcessing={false} />
            </div>

            {/* Final guarantee and social badges */}
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-500/20 rounded-xl p-4 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-2 text-emerald-600">
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">Garantia de {GLOBAL_CONSTANTS.GUARANTEE_DAYS}</span>
                </div>
                <p className="text-emerald-600 text-sm mt-1">Compra 100% protegida - risco zero para você</p>
              </div>

              <SocialBadges variant="compact" showPix={true} />

              <div className="text-center text-sm text-muted-foreground">
                <p>Dúvidas? Entre em contato conosco através do suporte</p>
              </div>
            </div>
          </div>}

      </div>
    </ProfessionalQuizLayout>;
};