// @ts-nocheck - Variables removed from active quiz flow
import React, { useState, useEffect } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { useQuiz } from '@/contexts/QuizContext';
import { useQuizStep } from '@/hooks/useQuizStep';
import { CheckCircle2, UserCheck, Activity, BarChart3, ThumbsUp } from 'lucide-react';
import { QuizPageProps } from '@/types/quiz';
import { Button } from '@/components/ui/button';

interface AnalysisStep {
  label: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  completed: boolean;
}

export const Page22TripleAnalysis: React.FC<QuizPageProps> = ({ audio = {} }) => {
  useQuizStep('Analise_Tripla');
  const {
    nextPage,
    userInfo
  } = useQuiz();
  const [currentStep, setCurrentStep] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [analyses, setAnalyses] = useState<AnalysisStep[]>([{
    label: "Análise Corporal",
    description: "IMC e composição corporal",
    icon: <BarChart3 className="w-4 h-4" />,
    progress: 0,
    completed: false
  }, {
    label: "Avaliação Nutricional", 
    description: "Análise por nutricionista especializada",
    icon: <UserCheck className="w-4 h-4" />,
    progress: 0,
    completed: false
  }, {
    label: "Cálculo Metabólico",
    description: "Taxa metabólica e recomendações", 
    icon: <Activity className="w-4 h-4" />,
    progress: 0,
    completed: false
  }]);

  useEffect(() => {
    const animateProgress = async () => {
      // Animate each step much faster
      for (let i = 0; i < analyses.length; i++) {
        setCurrentStep(i);
        
        // Quick animation using CSS transitions
        setAnalyses(prev => prev.map((analysis, index) => index === i ? {
          ...analysis,
          progress: 100,
          completed: true
        } : analysis));
        
        setOverallProgress(((i + 1) / analyses.length) * 100);
        
        // Much shorter delay between steps
        await new Promise(resolve => setTimeout(resolve, 600));
      }
      
      // Show results quickly
      setTimeout(() => {
        setShowResults(true);
      }, 400);
    };

    const timer = setTimeout(animateProgress, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ProfessionalQuizLayout showBackButton={false}>
      {!showResults ? (
        // Estado 1: Análise em progresso
        <div className="space-y-8 animate-betterme-page-enter">
          {/* BetterMe Header */}
          <div className="text-center space-y-4">
            {/* Nutricionista Avatar - Simples */}
            <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center shadow-lg">
              <UserCheck className="w-8 h-8 text-white" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-foreground">
                {userInfo.name && `${userInfo.name}, `}analisando suas respostas...
              </h1>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Nossa nutricionista está processando seus dados para criar seu plano personalizado
              </p>
            </div>
          </div>

          {/* Compact Progress Bar - Overall */}
          <div className="max-w-md mx-auto space-y-2">
            <div className="text-center">
              <p className="text-sm text-muted-foreground font-medium">
                Progresso: {Math.round(overallProgress)}%
              </p>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          {/* Compact Analysis Steps */}
          <div className="space-y-3">
            {analyses.map((analysis, index) => (
              <div key={analysis.label} className={`
                bg-white rounded-xl border p-3 transition-all duration-300
                ${index === currentStep && !analysis.completed ? 'border-primary shadow-md' : 
                  analysis.completed ? 'border-primary/20 bg-primary/5' : 'border-border'}
              `}>
                <div className="flex items-center gap-3">
                  {/* Compact Icon */}
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                    ${analysis.completed ? 'bg-primary text-white' : 
                      index === currentStep ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}
                  `}>
                    {analysis.completed ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      analysis.icon
                    )}
                  </div>
                  
                  {/* Compact Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm text-foreground truncate">
                        {analysis.label}
                      </h3>
                      {(index === currentStep || analysis.completed) && (
                        <span className="text-xs font-medium text-primary ml-2">
                          {analysis.progress}%
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                      {analysis.description}
                    </p>
                    
                    {/* Compact Progress Bar */}
                    {(index === currentStep || analysis.completed) && (
                      <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${analysis.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Compact Technical Data */}
                {analysis.completed && (
                  <div className="mt-2 pt-2 border-t border-muted/50 text-xs text-center">
                    {index === 0 && userInfo.height > 0 && userInfo.weight > 0 && (
                      <span className="text-primary font-medium">
                        IMC: {userInfo.bmi} | {userInfo.height}cm | {userInfo.weight}kg
                      </span>
                    )}
                    {index === 1 && (
                      <span className="text-primary font-medium">Dra. Alice Moreira - Online</span>
                    )}
                    {index === 2 && (
                      <span className="text-primary font-medium">Algoritmo Concluído</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* BetterMe Footer */}
          <div className="text-center text-xs text-muted-foreground space-y-1">
            <div>Análise baseada em evidências científicas</div>
            <div>Protocolo validado por especialista certificada</div>
          </div>
        </div>
      ) : (
        // Estado 2: Resultados da análise (formato compacto como página 5)
        <div className="space-y-8 animate-betterme-page-enter">
          <div className="text-center space-y-6 max-w-md mx-auto px-4">
            {/* Ícone de thumbs up */}
            <div className="flex justify-start mb-2">
              <ThumbsUp className="w-12 h-12 text-muted-foreground" />
            </div>
            
            {/* Título principal */}
            <div className="text-left space-y-3">
              <h1 className="text-3xl font-bold text-foreground leading-tight">
                Isso é melhor que 83% dos usuários
              </h1>
              
              {/* Subtítulo */}
              <p className="text-lg text-muted-foreground">
                Pronto para ver <strong>progresso real em semanas</strong>, não meses?
              </p>
            </div>

            {/* Texto sobre a receita do chá */}
            <div className="text-left space-y-3 py-2">
              <p className="text-lg text-muted-foreground leading-relaxed">
                A receita do chá pode te ajudar a conquistar o{' '}
                <strong>corpo que você sempre quis.</strong>
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                É totalmente possível e pode ser mais fácil do que você imagina.
              </p>
            </div>

            {/* Botão Continuar */}
            <div className="pt-2">
              <Button 
                variant="emerald" 
                size="betterme"
                onClick={() => {
                  audio.onNext?.();
                  nextPage();
                }}
                className="w-full"
              >
                CONTINUAR
              </Button>
            </div>
          </div>
        </div>
      )}
    </ProfessionalQuizLayout>
  );
};