import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { useQuiz } from '@/contexts/QuizContext';
import { useQuizStep } from '@/hooks/useQuizStep';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Star, MapPin } from 'lucide-react';
import { QuizPageProps } from '@/types/quiz';
import { SmartImage } from '@/components/ui/SmartImage';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from '@/components/ui/carousel';
import { GLOBAL_CONSTANTS, AB_TEST_DEFAULTS, AB_TEST_FLAGS } from '@/config/globalConstants';
import { SocialBadges } from '@/components/ui/SocialBadges';

// COMPONENTE ROBUSTO PARA IMAGENS DE DEPOIMENTO COM FALLBACK
const RobustTestimonialImage: React.FC<{
  src: string;
  fallbackSrc: string;
  alt: string;
  priority: 'critical' | 'essential' | 'high';
  testimonialName: string;
}> = ({
  src,
  fallbackSrc,
  alt,
  priority,
  testimonialName
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const handleImageError = () => {
    console.warn(`❌ IMAGE FAILED: ${src} for ${testimonialName}, switching to fallback: ${fallbackSrc}`);
    if (!hasError && currentSrc !== fallbackSrc) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    }
  };
  const handleImageLoad = () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`✅ IMAGE LOADED: ${currentSrc} for ${testimonialName}`);
    }
  };
  return <SmartImage 
    key={`robust-${testimonialName}-${currentSrc}`} 
    src={currentSrc} 
    alt={`Antes e depois – ${testimonialName}, ${testimonialName === 'Deyse' ? 'Recife/PE' : testimonialName === 'Mariana' ? 'Rio de Janeiro/RJ' : testimonialName === 'Ana Paula' ? 'Belo Horizonte/MG' : testimonialName === 'Carlos' ? 'São Paulo/SP' : testimonialName === 'Roberto' ? 'Porto Alegre/RS' : 'Curitiba/PR'} (imagem autorizada)`} 
    currentPage={15} 
    priority={priority} 
    skeletonType="body" 
    className="w-full h-auto rounded-2xl shadow-lg" 
    onError={handleImageError} 
    onLoad={handleImageLoad}
    loading="lazy"
    decoding="async"
    width={400}
    height={600}
  />;
};
export const Page19Testimonial: React.FC<QuizPageProps> = ({
  audio = {}
}) => {
  useQuizStep('Depoimento');
  console.log('🎯 PAGE 19 ENHANCED VERSION LOADING - Auto-carousel active');
  
  const {
    nextPage,
    getAnswer,
    userInfo
  } = useQuiz();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const carouselRef = useRef<HTMLDivElement>(null);
  const hasTrackedImpression = useRef(false);
  const autoSlideTimer = useRef<NodeJS.Timeout>();
  
  // A/B Testing for CTA
  const ctaVariant = Math.random() > 0.5 ? 'A' : 'B';
  const ctaTexts = {
    A: GLOBAL_CONSTANTS.CTA_PATTERNS.TRANSFORMATION,
    B: 'Começar minha transformação'
  };

  // Get gender and desired benefits for personalization  
  const genderAnswer = getAnswer('Qual é o seu gênero?');
  const isUserMale = genderAnswer?.answer === 'Homem';
  const benefitsAnswer = getAnswer('Como você quer se sentir daqui a 30 dias?');
  const desiredBenefits = Array.isArray(benefitsAnswer?.answer) ? benefitsAnswer?.answer : [];

  // Testimonials data based on gender
  // IMAGENS COM FALLBACKS ROBUSTOS - Garantia de que existem no sistema
  const femaleTestimonials = [{
    name: "Deyse",
    age: 34,
    location: "Recife, PE",
    image: "/lovable-uploads/ef33ffb5-2660-456b-840e-208443e97600.png",
    fallbackImage: "/lovable-uploads/e8214167-875b-4896-942a-c9f94f312ab1.png",
    // Fallback conhecido
    text: "Os Chás mudaram minha vida! Perdi 12 kgs e não sofro mais com cólicas estomacais, minhas diabetes estão controladas me sinto super leve. Os Chás da Nutri Alice me devolveu o controle da minha vida!"
  }, {
    name: "Mariana",
    age: 28,
    location: "Rio de Janeiro, RJ",
    image: "/lovable-uploads/7cc14238-1538-4ba1-ba99-63a3ff38e4ab.png",
    fallbackImage: "/lovable-uploads/ef33ffb5-2660-456b-840e-208443e97600.png",
    // Usa Deyse como fallback
    text: "Incrível! Perdi 18 kgs em 3 meses e minha energia voltou completamente. Antes eu vivia cansada, agora acordo disposta e feliz. Os Chás da Nutri Alice transformaram minha vida!"
  }, {
    name: "Ana Paula",
    age: 41,
    location: "Belo Horizonte, MG",
    image: "/lovable-uploads/4134e5e4-d36e-4d27-a67c-033fd72213a1.png",
    fallbackImage: "/lovable-uploads/ef33ffb5-2660-456b-840e-208443e97600.png",
    // Usa Deyse como fallback
    text: "Resultado surpreendente! Eliminei 14 kgs e acabou o inchaço que me incomodava há anos. Me sinto leve, confiante e cheia de energia. Recomendo os Chás da Nutri Alice para todas!"
  }];
  const maleTestimonials = [{
    name: "Carlos",
    age: 45,
    location: "São Paulo, SP",
    image: "/lovable-uploads/ec7145cc-8743-40a2-a1aa-10485cb6389c.png",
    fallbackImage: "/lovable-uploads/e8214167-875b-4896-942a-c9f94f312ab1.png",
    // Fallback conhecido
    text: "Os Chás mudaram minha vida! Perdi 15 kgs e recuperei minha disposição para treinar e estar com a família. Os Chás da Nutri Alice me devolveram o controle da minha vida!"
  }, {
    name: "Roberto",
    age: 52,
    location: "Porto Alegre, RS",
    image: "/lovable-uploads/20752c73-cf95-486e-80ea-68f6e67d3bd9.png",
    fallbackImage: "/lovable-uploads/ec7145cc-8743-40a2-a1aa-10485cb6389c.png",
    // Usa Carlos como fallback
    text: "Fantástico! Eliminei 20 kgs e minha pressão normalizou. Voltei a ter energia para trabalhar e brincar com meus filhos. Os Chás da Nutri Alice salvaram minha saúde!"
  }, {
    name: "Fernando",
    age: 38,
    location: "Curitiba, PR",
    image: "/lovable-uploads/2bcec368-3ea9-46eb-8cea-09d90ec7c930.png",
    fallbackImage: "/lovable-uploads/ec7145cc-8743-40a2-a1aa-10485cb6389c.png",
    // Usa Carlos como fallback
    text: "Resultado impressionante! Perdi 17 kgs e acabaram as dores nas costas. Agora tenho disposição para tudo e me sinto 10 anos mais jovem. Obrigado Nutri Alice!"
  }];
  const testimonials = isUserMale ? maleTestimonials : femaleTestimonials;
  const currentTestimonialData = testimonials[currentTestimonial];

  // Tracking functions
  const trackStoryImpression = useCallback(() => {
    if (hasTrackedImpression.current) return;
    hasTrackedImpression.current = true;
    
    // GA4 tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'p15_story_impression', {
        story_id: currentTestimonialData.name.toLowerCase(),
        position: currentTestimonial,
        variant: isUserMale ? 'male' : 'female',
        session_id: userInfo.name || 'anonymous',
        content_group: 'P15_SuccessStories'
      });
    }
    
  }, [currentTestimonialData.name, currentTestimonial, isUserMale, userInfo.name]);

  const trackSlideChange = useCallback((from: number, to: number, direction: 'auto' | 'manual') => {
    // GA4 tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'p15_story_slide_change', {
        from,
        to,
        direction: direction === 'manual' ? 'manual' : 'auto',
        mode: direction,
        content_group: 'P15_SuccessStories'
      });
    }
  }, []);

  // Intersection Observer for impression tracking
  useEffect(() => {
    if (!carouselRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            trackStoryImpression();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(carouselRef.current);
    return () => observer.disconnect();
  }, [trackStoryImpression]);

  // Keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!api) return;
    
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        api.scrollPrev();
        trackSlideChange(currentTestimonial, Math.max(0, currentTestimonial - 1), 'manual');
        break;
      case 'ArrowRight':
        event.preventDefault();
        api.scrollNext();
        trackSlideChange(currentTestimonial, Math.min(testimonials.length - 1, currentTestimonial + 1), 'manual');
        break;
      case 'Escape':
        event.preventDefault();
        (event.target as HTMLElement).blur();
        break;
    }
  }, [api, currentTestimonial, testimonials.length, trackSlideChange]);

  // Prefetch next route
  useEffect(() => {
    // Prefetch P16 route
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = '/page16'; // Adjust based on your routing
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);
  useEffect(() => {
    const preloadCriticalImages = async () => {
      const imagesToPreload = testimonials.map(t => t.image);
      console.log('🔥 PRELOADING CRITICAL TESTIMONIAL IMAGES:', imagesToPreload);

      // Força preload de todas as imagens antes de renderizar
      const preloadPromises = imagesToPreload.map(src => {
        return new Promise<void>(resolve => {
          const img = new Image();
          img.onload = () => {
            if (process.env.NODE_ENV !== 'production') {
              console.log('✅ PRELOADED SUCCESSFULLY:', src);
            }
            resolve();
          };
          img.onerror = () => {
            console.warn('⚠️ PRELOAD FAILED, WILL USE FALLBACK:', src);
            resolve(); // Resolve anyway to not block
          };
          img.src = src;
        });
      });
      await Promise.allSettled(preloadPromises);
      console.log('🎯 ALL TESTIMONIAL IMAGES PRELOAD COMPLETED');
    };
    preloadCriticalImages();
  }, [testimonials]);

  // Debug: Log das imagens sendo usadas
  useEffect(() => {
    console.log('🖼️ TESTIMONIAL IMAGES DEBUG:', {
      isUserMale,
      selectedTestimonials: testimonials.map(t => ({
        name: t.name,
        image: t.image,
        fallback: t.fallbackImage
      })),
      currentTestimonial,
      currentImage: currentTestimonialData.image
    });
  }, [isUserMale, testimonials, currentTestimonial, currentTestimonialData.image]);

  // Connect with desired benefits if available
  const benefitConnection = desiredBenefits.length > 0 ? `Assim como você, ${currentTestimonialData.name} queria ${desiredBenefits[0]} e conseguiu.` : '';
  // Auto-slide functionality - intervalo mais longo para evitar travamentos
  const startAutoSlide = useCallback(() => {
    if (autoSlideTimer.current) clearInterval(autoSlideTimer.current);
    
    autoSlideTimer.current = setInterval(() => {
      if (api && api.canScrollNext && api.canScrollPrev) {
        try {
          const currentIndex = api.selectedScrollSnap();
          const nextIndex = (currentIndex + 1) % testimonials.length;
          api.scrollTo(nextIndex);
          trackSlideChange(currentIndex, nextIndex, 'auto');
        } catch (error) {
          console.warn('Auto-slide error:', error);
          // Restart auto-slide if error occurs
          setTimeout(() => startAutoSlide(), 1000);
        }
      }
    }, 4000); // 4 seconds - intervalo mais longo
  }, [api, testimonials.length, trackSlideChange]);

  const stopAutoSlide = useCallback(() => {
    if (autoSlideTimer.current) {
      clearInterval(autoSlideTimer.current);
      autoSlideTimer.current = undefined;
    }
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }
    
    setCurrentTestimonial(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrentTestimonial(api.selectedScrollSnap());
    });

    // Start auto-slide when component mounts
    startAutoSlide();

    // Cleanup on unmount
    return () => {
      stopAutoSlide();
    };
  }, [api, startAutoSlide, stopAutoSlide]);
  useEffect(() => {
    // Track testimonial view
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'testimonial_view', {
        testimonial_person: currentTestimonialData.name,
        user_gender: isUserMale ? 'Masculino' : 'Feminino',
        testimonial_index: currentTestimonial
      });
    }

    // Track time spent reading testimonial
    const startTime = Date.now();
    return () => {
      const timeSpent = Date.now() - startTime;
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'testimonial_time_spent', {
          time_seconds: Math.floor(timeSpent / 1000),
          testimonial_index: currentTestimonial
        });
      }
    };
  }, [currentTestimonial, currentTestimonialData.name, isUserMale]);

  // Handle dots navigation
  const handleDotClick = (index: number) => {
    if (api) {
      stopAutoSlide(); // Stop auto-slide when user manually navigates
      api.scrollTo(index);
      // Restart auto-slide after 5 seconds of inactivity
      setTimeout(() => startAutoSlide(), 5000);
    }
  };
  const handleContinue = () => {
    // Track testimonial CTA click with A/B testing
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'p15_story_cta_click', {
        story_id: currentTestimonialData.name.toLowerCase(),
        position: currentTestimonial,
        variant: isUserMale ? 'male' : 'female',
        ab_arm: ctaVariant,
        testimonial_person: currentTestimonialData.name,
        user_gender: isUserMale ? 'Masculino' : 'Feminino',
        testimonial_index: currentTestimonial,
        name: userInfo.name,
        content_group: 'P15_SuccessStories'
      });
    }
    
    
    audio.onSelect?.();
    setTimeout(() => {
      audio.onNext?.();
      nextPage();
    }, 100);
  };
  return <ProfessionalQuizLayout headerTitle="Transformações">
      <div className="space-y-4 animate-fade-in">
        {/* Header ultra compacto */}
        <div className="text-center space-y-1">
          <Badge variant="secondary" className="px-2 py-0.5 text-xs bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 text-emerald-700">
            <Star className="w-3 h-3 mr-1 fill-current text-yellow-500" />
            Resultados Reais
          </Badge>
          
          <h2 className="text-base font-semibold text-foreground">
            Transformações que inspiram
          </h2>
        </div>

        {/* Carousel Section ultra compacto */}
        <div className="relative">
          <div className="space-y-2">
            {/* Social Proof Badge compacto */}
            <div className="text-center">
              <SocialBadges variant="compact" />
            </div>
            
            {/* Carousel Layout - Imagem e Texto Side by Side */}
            <div className="flex gap-3 items-start">
              {/* Coluna da Imagem */}
              <div className="w-36 flex-shrink-0">
                <div 
                  ref={carouselRef}
                  className="relative"
                  role="region"
                  aria-label="Transformações de clientes"
                  tabIndex={-1}
                  onKeyDown={handleKeyDown}
                  onMouseEnter={stopAutoSlide}
                  onMouseLeave={startAutoSlide}
                >
                  <Carousel 
                    key={`carousel-${isUserMale ? 'male' : 'female'}-${testimonials.map(t => t.image).join('-')}`} 
                    setApi={setApi} 
                    className="w-full" 
                    opts={{
                      align: "center",
                      loop: true
                    }}
                  >
                    <CarouselContent>
                      {testimonials.map((testimonial, index) => (
                        <CarouselItem key={`${testimonial.name}-${index}-robust`}>
                          <div className="relative overflow-hidden rounded-lg shadow-md border border-border/20">
                            <RobustTestimonialImage 
                              src={testimonial.image} 
                              fallbackSrc={testimonial.fallbackImage} 
                              alt={`Transformação d${isUserMale ? 'o' : 'a'} ${testimonial.name} - antes e depois`} 
                              priority={index === 0 ? "critical" : "essential"} 
                              testimonialName={testimonial.name} 
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>
              </div>

              {/* Coluna do Texto */}
              <div className="flex-1">
                <div className="bg-background/50 border border-primary/10 rounded-lg p-3 space-y-2">
                  {/* Stars ultra compactas */}
                  <div className="flex gap-0.5" aria-label="5 estrelas de avaliação">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-3 h-3 text-yellow-500 fill-current" 
                      />
                    ))}
                  </div>

                  {/* Texto do depoimento ultra compacto */}
                  <blockquote className="text-foreground/90 leading-tight text-xs">
                    <span className="text-lg text-primary/40 font-serif leading-none">"</span>
                    <span className="mx-1">{currentTestimonialData.text}</span>
                    <span className="text-lg text-primary/40 font-serif leading-none">"</span>
                  </blockquote>

                  {/* Info do cliente compacta */}
                  <div className="space-y-0.5">
                    <p className="font-semibold text-foreground text-xs">{currentTestimonialData.name}</p>
                    <p className="text-muted-foreground text-xs flex items-center gap-2">
                      <span>{currentTestimonialData.age} anos</span>
                      <span className="w-1 h-1 bg-current rounded-full"></span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" />
                        {currentTestimonialData.location}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Indicadores de progresso ultra compactos */}
            <div className="flex justify-center gap-1.5 mt-2">
              {testimonials.map((testimonial, index) => (
                <button 
                  key={index} 
                  onClick={() => handleDotClick(index)} 
                  className={`w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center ${
                    index === currentTestimonial 
                      ? 'bg-primary shadow-md' 
                      : 'bg-muted-foreground/20 hover:bg-muted-foreground/40'
                  }`}
                  aria-label={`Ver depoimento de ${testimonial.name}`}
                  aria-current={index === currentTestimonial ? "true" : "false"}
                >
                  <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-primary-foreground' 
                      : 'bg-current'
                  }`} />
                </button>
              ))}
            </div>
          </div>
        </div>


        {/* Continue Button - with A/B test variant */}
        <Button 
          onClick={handleContinue}
          variant="emerald"
          size="betterme"
          className="w-full"
        >
          {ctaTexts[ctaVariant]}
        </Button>
        
        
        {/* Disclaimer compacto */}
        <div className="text-center px-4">
          <p className="text-xs text-gray-500">
            Depoimentos reais, imagens autorizadas. Resultados variam.
          </p>
        </div>
      </div>
    </ProfessionalQuizLayout>;
};