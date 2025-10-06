import React, { useState, useEffect } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { useQuiz } from '@/contexts/QuizContext';
import { useQuizStep } from '@/hooks/useQuizStep';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';
import { QuizPageProps } from '@/types/quiz';
import { SmartImage } from '@/components/ui/SmartImage';
import { SocialBadges } from '@/components/ui/SocialBadges';
import { WhatsAppChatCard } from '@/components/ui/WhatsAppChatCard';
export const Page18FaceTransformation: React.FC<QuizPageProps> = ({
  audio = {}
}) => {
  useQuizStep('Face_Transformation');
  const {
    nextPage,
    userInfo
  } = useQuiz();
  const [showTransformation, setShowTransformation] = useState(false);
  useEffect(() => {
    audio.onEnter?.();
    const timer = setTimeout(() => {
      setShowTransformation(true);
      audio.onReveal?.();
    }, 800);
    return () => clearTimeout(timer);
  }, [audio]);
  const handleContinue = () => {
    audio.onSelect?.();
    setTimeout(() => {
      audio.onNext?.();
      nextPage();
    }, 80);
  };
  const testimonials = [{
    id: 'face1',
    name: 'Patricia',
    city: 'SP',
    text: 'Em 6 semanas meu rosto mudou completamente. Até minha autoestima melhorou!',
    avatar: '/lovable-uploads/53b5bee8-0364-4359-a2cb-5a098011a989.png',
    mediaSrc: '/lovable-uploads/8bb8ee2e-22e9-4cac-9d23-e92ee06b10a1.png',
    time: '00:26'
  }, {
    id: 'face2',
    name: 'Juliana',
    city: 'RJ',
    text: 'As pessoas perguntam se fiz harmonização facial. É só o poder do emagrecimento!',
    avatar: '/lovable-uploads/9806ee48-f8bc-4dba-98de-897aac584a40.png',
    mediaSrc: '/lovable-uploads/c7038f7e-deca-4699-bcdd-951620998aa2.png',
    time: '23:02'
  }, {
    id: 'face3',
    name: 'Carla',
    city: 'MG',
    text: 'Perdi a papada e ganhei autoconfiança. Melhor decisão que tomei!',
    avatar: '/lovable-uploads/7e356b84-30b7-4c25-bb0c-e815780ce430.png',
    mediaSrc: '/lovable-uploads/be27528f-2f96-46d9-86d3-ae2c7d8f0779.png',
    time: '21:48'
  }];
  return <ProfessionalQuizLayout>
      <div className="animate-fade-in space-y-6">
        {/* Main Title - Enhanced */}
        <div className="text-center space-y-6 mb-8">
          <div className="space-y-4">
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Descubra como a perda de peso pode <strong className="text-foreground">redefinir completamente seu rosto</strong>, 
              eliminando a papada e realçando seus traços naturais
            </p>
          </div>
          
          {/* Highlight badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-full px-4 py-2">
            <Star className="w-4 h-4 text-amber-500 fill-current" />
            <span className="text-sm font-medium text-amber-700">Resultados reais em 4-8 semanas</span>
          </div>
        </div>

        {/* Face Transformation Section - Redesigned */}
        <div className={`transition-all duration-1000 ${showTransformation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Integrated transformation display */}
          <div className="max-w-4xl mx-auto mb-8">
            {/* Main transformation image - Seamless design */}
            
          </div>
        </div>

        {/* WhatsApp-style Testimonials */}
        <div className="space-y-4 max-w-6xl mx-auto">
          
          
          {/* WhatsApp Cards - Realistic screenshot layout */}
          <div className="space-y-3 max-w-sm mx-auto">
            {testimonials.map(testimonial => <WhatsAppChatCard key={testimonial.id} name={testimonial.name} message={testimonial.text} mediaSrc={testimonial.mediaSrc} time={testimonial.time} mediaAlt={`Transformação de ${testimonial.name} - antes e depois`} />)}
          </div>
          
          {/* Trust indicator */}
          <div className="text-center mt-8">
            
          </div>
        </div>

        {/* Social Badges */}
        <SocialBadges variant="compact" className="mb-6" />

        {/* Enhanced CTA Button - More compact */}
        <div className="text-center pt-8 space-y-4">
          <div className="relative inline-block">
            <Button onClick={handleContinue} variant="emerald" size="betterme" className="w-full max-w-xs mx-auto relative overflow-hidden group shadow-xl hover:shadow-2xl transition-all duration-300 px-6 py-4">
              <span className="relative z-10 flex items-center justify-center text-sm font-semibold">
                VER MINHA TRANSFORMAÇÃO COMPLETA
              </span>
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
            
            {/* Pulsing ring effect */}
            <div className="absolute inset-0 rounded-xl bg-emerald-400 opacity-30 animate-pulse -z-10 blur-xl"></div>
          </div>
          
          <div className="space-y-2">
            
            
          </div>
        </div>
      </div>
    </ProfessionalQuizLayout>;
};