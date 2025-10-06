import React, { ReactNode } from 'react';
import { useQuiz } from '@/contexts/QuizContext';
import { ChevronLeft } from 'lucide-react';
import { QuizProgressBars } from '@/components/ui/QuizProgressBars';
import { useLogoCache } from '@/hooks/useLogoCache';
import { PreloadHeadManager } from '@/components/ui/PreloadHeadManager';
interface ProfessionalQuizLayoutProps {
  children: ReactNode;
  showProgress?: boolean;
  showBackButton?: boolean;
  showHeader?: boolean;
  headerTitle?: string;
  progressMode?: 'segmented' | 'bar';
  fullWidth?: boolean;
  reduceTopPadding?: boolean;
}
export const ProfessionalQuizLayout: React.FC<ProfessionalQuizLayoutProps> = ({
  children,
  showProgress = true,
  showBackButton = true,
  showHeader = true,
  headerTitle = "Questionário",
  progressMode = 'segmented',
  fullWidth = false,
  reduceTopPadding = false
}) => {
  const {
    navigateToPreviousPage,
    progressInfo,
    currentPage
  } = useQuiz();

  // LOGO CACHE: Carregada uma única vez e reutilizada
  const {
    isLoaded: logoLoaded,
    logoUrl,
    error: logoError
  } = useLogoCache();
  return <div className="betterme-page" style={reduceTopPadding ? {
    paddingTop: 8
  } : undefined}>
      {/* PRELOAD HEAD MANAGER - INVISÍVEL */}
      <PreloadHeadManager currentPage={currentPage} />
      
      {/* BetterMe Header - 60px Fixed */}
      {showHeader && <div className="betterme-header">
          {showBackButton && <button className="betterme-back-button" onClick={navigateToPreviousPage} aria-label="Voltar">
              <ChevronLeft size={24} />
            </button>}
          <div className="flex items-center justify-center">
            {logoLoaded ? <img src={logoUrl} alt="LeveMe - Rotina dos Chás Bariátricos" className="h-36 max-w-[420px] object-contain drop-shadow-sm" loading="eager" style={{
          visibility: logoLoaded ? 'visible' : 'hidden'
        }} /> : <div className="h-36 max-w-[420px] flex items-center justify-center">
                {logoError ? <span className="text-muted-foreground text-sm">Logo</span> : <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
              </div>}
          </div>
          
          {/* Número da página - sutil */}
          
          
        </div>}

      {/* Quiz Progress Bars - New 4-segment progressive system */}
      <QuizProgressBars currentPage={currentPage} />

      {/* BetterMe Main Content */}
      <div className={fullWidth ? "betterme-content-full" : "betterme-content"} style={reduceTopPadding ? {
      paddingTop: 0
    } : undefined}>
        {children}
      </div>
    </div>;
};