import React, { useEffect, useState, useRef } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { useQuiz } from '@/contexts/QuizContext';
import { useQuizStep } from '@/hooks/useQuizStep';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CustomVideoPlayer } from '@/components/ui/CustomVideoPlayer';
import { ChevronRight } from 'lucide-react';
import { QuizPageProps } from '@/types/quiz';
import { GLOBAL_CONSTANTS, AB_TEST_DEFAULTS, AB_TEST_FLAGS } from '@/config/globalConstants';
import { SocialBadges } from '@/components/ui/SocialBadges';
import { useABExperiments } from '@/hooks/useABExperiments';
import { trackEvent } from '@/utils/tracking';
export const Page14VSLNutritionistAuthority: React.FC<QuizPageProps> = ({
  audio = {}
}) => {
  useQuizStep('VSL_Autoridade');
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);
  const {
    nextPage,
    userInfo,
    getAnswer
  } = useQuiz();

  // Get gender for personalization
  const genderAnswer = getAnswer('Qual é o seu gênero?');
  const isUserMale = genderAnswer?.answer === 'Homem';
  useEffect(() => {
    // Track VSL view
    trackEvent('vsl_view', {
      name: userInfo.name
    });
    audio.onEnter?.();

    // Track analysis start
    trackEvent('analysis_start', {
      name: userInfo.name
    });

    // Start slow initial analysis immediately when page loads
    const initialInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (videoStarted) {
          clearInterval(initialInterval);
          return prev;
        }
        // Slow initial progress (reaches ~30% in about 60 seconds if user doesn't click)
        const increment = 0.5; // Very slow increment
        const newProgress = Math.min(prev + increment, 30); // Cap at 30% until video starts

        // Track analysis_tick every 10%
        if (Math.floor(newProgress / 10) > Math.floor(prev / 10)) {
          trackEvent('analysis_tick', {
            progress: Math.floor(newProgress / 10) * 10,
            name: userInfo.name
          });
        }
        return newProgress;
      });
    }, 1000); // Update every second for slow progress

    return () => clearInterval(initialInterval);
  }, [videoStarted]);
  const handleVideoPlay = () => {
    console.log('Video started');
    setVideoStarted(true);

    // Track video play
    trackEvent('video_play', {
      video_type: 'vsl_nutritionist',
      name: userInfo.name
    });

    // Calculate remaining progress and time to sync with CTA
    const currentProgress = analysisProgress;
    const remainingProgress = 100 - currentProgress;
    const ctaDelayTime = 32000; // 32 seconds after video play
    const intervalTime = 100; // Update every 100ms
    const incrementPerInterval = remainingProgress / (ctaDelayTime / intervalTime);

    // Start accelerated progress to reach 100% in exactly ctaDelayTime
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        const newProgress = prev + incrementPerInterval;

        // Track analysis_tick every 10%
        if (Math.floor(newProgress / 10) > Math.floor(prev / 10)) {
          trackEvent('analysis_tick', {
            progress: Math.floor(newProgress / 10) * 10,
            name: userInfo.name
          });
        }
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setAnalysisComplete(true);
          setShowContinueButton(true);

          // Focus CTA button when unlocked
          setTimeout(() => {
            ctaButtonRef.current?.focus();
          }, 100);

          // Track CTA impression and unlock timing
          trackEvent('cta_view_results_impression', {
            name: userInfo.name
          });
          trackEvent('vsl_cta_unlocked_time', {
            delay_seconds: 32,
            name: userInfo.name
          });
          return 100;
        }
        return newProgress;
      });
    }, intervalTime);
  };
  const handleVideoUnmute = () => {
    trackEvent('video_unmute', {
      name: userInfo.name
    });
  };
  const handleContinue = () => {
    // Track CTA click
    trackEvent('cta_view_results_click', {
      name: userInfo.name
    });
    audio.onSelect?.();
    setTimeout(() => {
      audio.onNext?.();
      nextPage();
    }, 100);
  };
  return <ProfessionalQuizLayout>
      <div className="space-y-8 animate-betterme-page-enter">
        {/* H1 em quadro verde */}
        
        
        <SocialBadges variant="compact" showPix={false} />

        {/* Analysis Progress Bar */}
        {isAnalyzing && <div className="max-w-md mx-auto space-y-3">
            <div className="text-center">
              <p className="text-sm text-muted-foreground font-medium">
                {analysisComplete ? "Análise concluída!" : "Analisando suas respostas..."}
              </p>
              {!showContinueButton && !analysisComplete}
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden" role="progressbar" aria-valuenow={Math.round(analysisProgress)} aria-valuemin={0} aria-valuemax={100} aria-label={`Analisando suas respostas... ${Math.round(analysisProgress)}%`}>
              <div className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-100 ease-out" style={{
            width: `${analysisProgress}%`
          }} />
            </div>
            <div className="text-center">
              <span className="text-xs text-muted-foreground font-mono">
                {Math.round(analysisProgress)}%
              </span>
            </div>
          </div>}

        {/* BetterMe Video Container */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-border">
            <CustomVideoPlayer src="https://res.cloudinary.com/dpsmdgdzi/video/upload/v1757199582/VSL_2_hoanyr.mp4" onPlay={handleVideoPlay} onUnmute={handleVideoUnmute} poster="/lovable-uploads/p13-poster.jpg" aria-label="Assistir vídeo sobre o ritual de bem-estar" width={400} height={225} />
          </div>
        </div>

        {/* Botão verde fixo abaixo do vídeo - só aparece após 32s */}
        {showContinueButton && (
          <div className="space-y-3 animate-fade-in">
            <Button ref={ctaButtonRef} onClick={handleContinue} variant="emerald" size="betterme" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white" aria-label="Continuar">
              CONTINUAR
            </Button>
          </div>
        )}

        {/* Social Proof Section - Always visible */}
        
        
        {/* Single Disclaimer */}
        <div className="text-center px-4 mt-6">
          
        </div>
      </div>
    </ProfessionalQuizLayout>;
};