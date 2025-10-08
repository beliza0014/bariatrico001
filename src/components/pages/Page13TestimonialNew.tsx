import React, { useEffect, useState } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { useQuiz } from '@/contexts/QuizContext';
import { useQuizStep } from '@/hooks/useQuizStep';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Star } from 'lucide-react';
import { QuizPageProps } from '@/types/quiz';
import { SmartImage } from '@/components/ui/SmartImage';
import { WhatsAppChatCard } from '@/components/ui/WhatsAppChatCard';
import { GLOBAL_CONSTANTS } from '@/config/globalConstants';
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
  return <SmartImage key={`robust-${testimonialName}-${currentSrc}`} src={currentSrc} alt={`Antes e depois – ${testimonialName}, ${testimonialName === 'Deyse' ? 'Recife/PE' : testimonialName === 'Mariana' ? 'Rio de Janeiro/RJ' : testimonialName === 'Ana Paula' ? 'Belo Horizonte/MG' : testimonialName === 'Carlos' ? 'São Paulo/SP' : testimonialName === 'Roberto' ? 'Porto Alegre/RS' : 'Curitiba/PR'} (imagem autorizada)`} currentPage={19} priority={priority} skeletonType="body" className="w-full h-auto rounded-2xl shadow-2xl border border-border/20" onError={handleImageError} onLoad={handleImageLoad} loading="lazy" decoding="async" width={400} height={600} />;
};
export const Page13TestimonialNew: React.FC<QuizPageProps> = ({
  audio = {}
}) => {
  useQuizStep('Transformacoes');
  if (process.env.NODE_ENV !== 'production') {
    console.log('🚀 ENHANCED PAGE 19 WITH AUTO-CAROUSEL LOADED');
  }
  const {
    nextPage,
    getAnswer,
    userInfo
  } = useQuiz();

  // Get gender for personalization  
  const genderAnswer = getAnswer('Qual é o seu gênero?');
  const isUserMale = genderAnswer?.answer === 'Homem';
  const benefitsAnswer = getAnswer('Como você quer se sentir daqui a 30 dias?');
  const desiredBenefits = Array.isArray(benefitsAnswer?.answer) ? benefitsAnswer?.answer : [];

  // Testimonials data based on gender
  const femaleTestimonials = [{
    name: "Deyse",
    age: 34,
    location: "Recife, PE",
    image: "/lovable-uploads/ef33ffb5-2660-456b-840e-208443e97600.png",
    fallbackImage: "/lovable-uploads/e8214167-875b-4896-942a-c9f94f312ab1.png",
    text: "Os Chás mudaram minha vida! Perdi 12 kgs e não sofro mais com cólicas estomacais, minhas diabetes estão controladas me sinto super leve. Os Chás da Nutri Camila me devolveu o controle da minha vida!"
  }, {
    name: "Mariana",
    age: 28,
    location: "Rio de Janeiro, RJ",
    image: "/lovable-uploads/7cc14238-1538-4ba1-ba99-63a3ff38e4ab.png",
    fallbackImage: "/lovable-uploads/ef33ffb5-2660-456b-840e-208443e97600.png",
    text: "Incrível! Perdi 18 kgs em 3 meses e minha energia voltou completamente. Antes eu vivia cansada, agora acordo disposta e feliz. Os Chás da Nutri Camila transformaram minha vida!"
  }, {
    name: "Ana Paula",
    age: 41,
    location: "Belo Horizonte, MG",
    image: "/lovable-uploads/4134e5e4-d36e-4d27-a67c-033fd72213a1.png",
    fallbackImage: "/lovable-uploads/ef33ffb5-2660-456b-840e-208443e97600.png",
    text: "Resultado surpreendente! Eliminei 14 kgs e acabou o inchaço que me incomodava há anos. Me sinto leve, confiante e cheia de energia. Recomendo os Chás da Nutri Camila para todas!"
  }];
  const maleTestimonials = [{
    name: "Carlos",
    age: 45,
    location: "São Paulo, SP",
    image: "/lovable-uploads/ec7145cc-8743-40a2-a1aa-10485cb6389c.png",
    fallbackImage: "/lovable-uploads/e8214167-875b-4896-942a-c9f94f312ab1.png",
    text: "Os Chás mudaram minha vida! Perdi 15 kgs e recuperei minha disposição para treinar e estar com a família. Os Chás da Nutri Camila me devolveram o controle da minha vida!"
  }, {
    name: "Roberto",
    age: 52,
    location: "Porto Alegre, RS",
    image: "/lovable-uploads/20752c73-cf95-486e-80ea-68f6e67d3bd9.png",
    fallbackImage: "/lovable-uploads/ec7145cc-8743-40a2-a1aa-10485cb6389c.png",
    text: "Fantástico! Eliminei 20 kgs e minha pressão normalizou. Voltei a ter energia para trabalhar e brincar com meus filhos. Os Chás da Nutri Camila salvaram minha saúde!"
  }, {
    name: "Fernando",
    age: 38,
    location: "Curitiba, PR",
    image: "/lovable-uploads/2bcec368-3ea9-46eb-8cea-09d90ec7c930.png",
    fallbackImage: "/lovable-uploads/ec7145cc-8743-40a2-a1aa-10485cb6389c.png",
    text: "Resultado impressionante! Perdi 17 kgs e acabaram as dores nas costas. Agora tenho disposição para tudo e me sinto 10 anos mais jovem. Obrigado Nutri Camila!"
  }];
  const testimonials = isUserMale ? maleTestimonials : femaleTestimonials;
  const handleContinue = () => {
    // Track testimonial CTA click
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'p19_whatsapp_cta_click', {
        user_gender: isUserMale ? 'Masculino' : 'Feminino',
        name: userInfo.name
      });
    }
    audio.onSelect?.();
    setTimeout(() => {
      audio.onNext?.();
      nextPage();
    }, 100);
  };

  // Connect with desired benefits if available
  const benefitConnection = desiredBenefits.length > 0 ? `Assim como você, elas queriam ${desiredBenefits[0]} e conseguiram.` : '';
  useEffect(() => {
    audio.onShow?.();
  }, []);
  return <ProfessionalQuizLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Enhanced Header with gradient background */}
        <div className="text-center space-y-4 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-blue-500/5 to-emerald-500/10 rounded-3xl -z-10"></div>
          <div className="p-8">
            <Badge variant="secondary" className="px-6 py-3 bg-gradient-to-r from-emerald-500/15 to-blue-500/15 border border-emerald-500/30 text-emerald-800 font-semibold text-sm">
              <Star className="w-5 h-5 mr-2 fill-current text-yellow-500" />
              Suas respostas são parecidas com as delas...
            </Badge>
            
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed max-w-md mx-auto">
              Isso significa que você também pode se beneficiar da nossa <strong className="font-bold text-foreground">Rotina de Chás Bariátricos</strong>, assim como milhares de mulheres que já transformaram suas vidas.
            </p>
            
            {benefitConnection && <p className="text-sm text-muted-foreground mt-4 leading-relaxed max-w-md mx-auto">
                {benefitConnection}
              </p>}
            
            
          </div>
        </div>

        {/* WhatsApp Style Testimonials */}
        <div className="space-y-4 max-w-6xl mx-auto">
          <div className="text-center space-y-2">
            <SocialBadges variant="compact" />
          </div>
          
          {/* WhatsApp Cards */}
          <div className="space-y-3 max-w-sm mx-auto">
            {testimonials.map((testimonial, index) => <WhatsAppChatCard key={`whatsapp-${testimonial.name}-${index}`} name={testimonial.name} message={testimonial.text} mediaSrc={testimonial.image} time={index === 0 ? '14:23' : index === 1 ? '09:45' : '16:12'} mediaAlt={`Transformação d${isUserMale ? 'o' : 'a'} ${testimonial.name} - antes e depois`} />)}
          </div>
          
          {/* Trust indicator */}
          <div className="text-center mt-6">
            
          </div>
        </div>

        {/* Enhanced Continue Button */}
        <div className="max-w-md mx-auto">
          <Button onClick={handleContinue} variant="emerald" size="betterme" className="w-full text-lg font-semibold py-4 shadow-2xl transform hover:scale-105 transition-all duration-200" aria-label="Continuar para próxima etapa">
            <span className="flex items-center justify-center">
              QUERO MEU RESULTADO
            </span>
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center max-w-2xl mx-auto">
          
        </div>
      </div>
    </ProfessionalQuizLayout>;
};