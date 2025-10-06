import React, { useEffect, useState } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { SocialBadges } from '@/components/ui/SocialBadges';
import { Button } from '@/components/ui/button';
import { WhatsAppChatCard } from '@/components/ui/WhatsAppChatCard';
import { SmartImage } from '@/components/ui/SmartImage';
import { useQuiz } from '@/contexts/QuizContext';
import { useSoundContext } from '@/contexts/SoundContext';
import { useABExperiments } from '@/hooks/useABExperiments';
import { useLogoCache } from '@/hooks/useLogoCache';
import { useSmartImageBatch } from '@/hooks/useSmartImage';
import { useStableTestimonials } from '@/hooks/useStableTestimonials';
import { useThrottledEffect } from '@/hooks/useThrottledEffect';
import { GLOBAL_CONSTANTS, TRACKING_EVENTS } from '@/config/globalConstants';
import { QuizPageProps } from '@/types/quiz';
export const Page01Landing: React.FC<QuizPageProps> = ({
  audio = {}
}) => {
  const {
    nextPage,
    getAnswer,
    setCurrentPage
  } = useQuiz();
  const {
    initializeAudioOnUserGesture
  } = useSoundContext();

  // LOGO CACHE: Mesma logo das outras páginas
  const {
    isLoaded: logoLoaded,
    logoUrl,
    error: logoError
  } = useLogoCache();

  // Reactivate A/B experiments for P01
  const {
    trackExperimentEvent = () => {},
    p01HeadlineText,
    p01CTAText,
    p01HeadlineVariant,
    p01CTAVariant
  } = useABExperiments();

  // Final headline text (exact specification)
  const finalHeadlineText = "Descubra o ritual de chá de 3 minutos para secar 8kg em apenas 1 mês — sem dieta ou esforço.";

  // Use custom CTA text
  const finalCTAText = "Quero a receita!";

  // Get gender for personalization
  const genderAnswer = getAnswer('Qual é o seu gênero?');
  const isUserMale = genderAnswer?.answer === 'Homem';

  // WhatsApp Social proof testimonials - HOOK ESTÁVEL para prevenir re-renders
  const socialProofTestimonials = useStableTestimonials();

  // WhatsApp carousel state
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // PRELOAD CRÍTICO: Todas as imagens da página 1 com prioridade máxima - MEMOIZADO
  const criticalImages = React.useMemo(() => ["/lovable-uploads/7b7d27ab-f22a-4116-8992-141c880e5f42.png",
  // Hero image
  ...socialProofTestimonials.map(t => t.mediaSrc) // Todas as imagens do carousel
  ], [socialProofTestimonials]);
  const {
    loading: imagesLoading
  } = useSmartImageBatch(criticalImages, 1, 8); // Página 1, máxima concorrência

  // Auto-play carousel - OTIMIZADO com dependências estáveis
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => {
        const nextIndex = (prev + 1) % socialProofTestimonials.length;
        return nextIndex;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [socialProofTestimonials.length]);

  // Track quiz_start on P01 render and scroll depth tracking - THROTTLED para prevenir loops
  useThrottledEffect(() => {
    // Track quiz_start on P01 render
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', TRACKING_EVENTS.QUIZ_START, {
        content_name: 'Landing Page',
        step_id: 'landing_render',
        experiment_variant: p01CTAVariant
      });
    }
    const handleScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
      if (scrolled >= 25) {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', TRACKING_EVENTS.SCROLL_DEPTH_25, {
            content_name: 'Landing Page',
            step_id: 'landing'
          });
        }
        window.removeEventListener('scroll', handleScroll);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [p01CTAVariant], 500); // 500ms throttle

  // PRELOAD CRÍTICO: Preload das imagens críticas na inicialização - EXECUTA APENAS UMA VEZ
  useEffect(() => {
    // Preload hero image com prioridade máxima
    const heroImg = new Image();
    heroImg.fetchPriority = 'high';
    heroImg.decoding = 'sync';
    heroImg.loading = 'eager';
    heroImg.src = "/lovable-uploads/7b7d27ab-f22a-4116-8992-141c880e5f42.png";

    // Preload primeira imagem do carousel (a que aparece primeiro)
    const firstCarouselImg = new Image();
    firstCarouselImg.fetchPriority = 'high';
    firstCarouselImg.decoding = 'async';
    firstCarouselImg.loading = 'eager';
    firstCarouselImg.src = socialProofTestimonials[0].mediaSrc;

    // Prefetch Page02 assets
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = '/page02';
    document.head.appendChild(link);
  }, []); // DEPENDÊNCIAS VAZIAS - executa apenas uma vez
  const handleStart = async () => {
    // Meta Pixel - ViewContent event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', {
        content_name: 'Quiz Start',
        content_category: 'Landing Page'
      });
    }

    // Track hero CTA click with A/B variants
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', TRACKING_EVENTS.HERO_CTA_CLICK, {
        content_name: 'Landing Page',
        step_id: 'landing',
        variant: p01CTAVariant,
        ab_cohort: p01HeadlineVariant
      });
    }

    // Track experiment events
    trackExperimentEvent('p01_headline_variant', 'cta_click');
    trackExperimentEvent('p01_cta_copy', 'cta_click');

    // Initialize audio
    await initializeAudioOnUserGesture();
    localStorage.setItem('audio_activated', 'true');

    // Track quiz start with A/B variants
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', TRACKING_EVENTS.QUIZ_START, {
        content_name: 'Landing Page',
        step_id: 'landing',
        ab_page01_cta: p01CTAVariant,
        ab_page01_headline: p01HeadlineVariant,
        experiment_variant: p01CTAVariant
      });
    }

    // Audio feedback
    audio.onSelect?.();
    setTimeout(() => {
      audio.onNext?.();
      nextPage();
    }, 80);
  };
  const handleSecondCTA = async () => {
    // Track second CTA click
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', TRACKING_EVENTS.HERO_CTA_CLICK, {
        content_name: 'Landing Page - Second CTA',
        step_id: 'landing_second_cta',
        variant: 'fazer_teste_gratis',
        ab_cohort: p01HeadlineVariant
      });
    }

    // Track experiment events
    trackExperimentEvent('p01_second_cta', 'cta_click');

    // Initialize audio
    await initializeAudioOnUserGesture();
    localStorage.setItem('audio_activated', 'true');

    // Audio feedback
    audio.onSelect?.();
    setTimeout(() => {
      audio.onNext?.();
      nextPage();
    }, 80);
  };
  return <ProfessionalQuizLayout showProgress={false} showBackButton={false} showHeader={false} reduceTopPadding>
      <div className="animate-betterme-page-enter space-y-0.5 lg:space-y-1" style={{
      paddingTop: 0
    }}>
        {/* Logo Principal - Compacta como outras páginas */}
        <div className="flex justify-center pt-0 pb-0 -mt-6">
          {logoLoaded ? <img src={logoUrl} alt="LeveMe - Rotina dos Chás Bariátricos" className="h-36 max-w-[480px] object-contain object-top drop-shadow-sm" loading="eager" style={{
          visibility: logoLoaded ? 'visible' : 'hidden'
        }} /> : <div className="h-36 max-w-[480px] flex items-center justify-center">
              {logoError ? <span className="text-muted-foreground text-sm">LeveMe - Rotina dos Chás Bariátricos</span> : <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
            </div>}
        </div>

        {/* Hero Section - Título principal com sobreposição */}
        <div className="text-center space-y-1 -mt-4 relative z-10">
          {/* H1 Principal mantido */}
          <div className="flex justify-center">
            <div className="bg-primary/5 border-2 border-primary rounded-xl px-4 py-2.5 lg:px-6 lg:py-3 text-center" style={{
            maxWidth: '660px'
          }}>
              <h1 className="font-bold text-gray-900" style={{
              fontSize: 'clamp(20px, 5.5vw, 36px)',
              lineHeight: '1.18'
            }}>
                {finalHeadlineText}
              </h1>
            </div>
          </div>
        </div>

        {/* Imagem principal - SmartImage com prioridade crítica */}
        <div className="flex justify-center py-2">
          <div className="relative w-full max-w-[270px] mx-auto">
            <SmartImage src="/lovable-uploads/7b7d27ab-f22a-4116-8992-141c880e5f42.png" alt="Nutri Camila - Chás Bariátricos" className="w-full h-auto rounded-2xl shadow-lg" currentPage={1} priority="critical" />
          </div>
        </div>

        {/* CTA Section final */}
        <div className="text-center space-y-1.5 px-4">
          <Button onClick={handleStart} variant="premium" size="betterme" className="w-full max-w-sm mx-auto" aria-label="Começar o quiz agora; leva cerca de 60 segundos">
            {finalCTAText}
          </Button>
          
          {/* Microcopy final */}
          
          
          {/* Título das Provas Sociais - Destaque igual ao primeiro */}
          <div className="pt-6 pb-2 px-4 flex justify-center">
            
          </div>
          
          {/* WhatsApp Social Proof Carousel */}
          <div className="px-2 pt-2">
            <div className="relative max-w-2xl mx-auto flex items-center gap-4">
              {/* Left Arrow - Outside */}
              <button 
                onClick={() => setCurrentTestimonial(prev => prev === 0 ? socialProofTestimonials.length - 1 : prev - 1)} 
                className="flex-shrink-0 bg-primary hover:bg-primary/90 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10"
                aria-label="Depoimento anterior"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              <div className="flex-1 max-w-sm mx-auto">
                {/* Current WhatsApp Card - key forçar re-render completo */}
                <WhatsAppChatCard 
                  key={`testimonial-${currentTestimonial}`} 
                  name={socialProofTestimonials[currentTestimonial].name} 
                  message={socialProofTestimonials[currentTestimonial].message} 
                  mediaSrc={socialProofTestimonials[currentTestimonial].mediaSrc} 
                  time={socialProofTestimonials[currentTestimonial].time} 
                  mediaAlt={`Transformação de ${socialProofTestimonials[currentTestimonial].name} - Antes e depois`} 
                />
                
                {/* Navigation dots */}
                <div className="flex justify-center mt-4 space-x-2">
                  {socialProofTestimonials.map((_, index) => (
                    <button 
                      key={index} 
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        index === currentTestimonial 
                          ? 'bg-primary w-8' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`} 
                      onClick={() => setCurrentTestimonial(index)} 
                      aria-label={`Ver depoimento ${index + 1}`} 
                    />
                  ))}
                </div>
              </div>

              {/* Right Arrow - Outside */}
              <button 
                onClick={() => setCurrentTestimonial(prev => (prev + 1) % socialProofTestimonials.length)} 
                className="flex-shrink-0 bg-primary hover:bg-primary/90 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10"
                aria-label="Próximo depoimento"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Botão de debug para Page 26 */}
          
          
          {/* Segundo CTA - Fazer teste grátis */}
          <div className="pt-6 px-4">
            
          </div>
          
          {/* Trust Strip */}
          
          
        </div>

        {/* Disclaimer Legal final - mais compacto */}
        <div className="text-center pt-1 px-4">
          
        </div>
      </div>
    </ProfessionalQuizLayout>;
};