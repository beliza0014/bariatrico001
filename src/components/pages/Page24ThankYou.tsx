import React, { useEffect } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';

import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles, Heart } from 'lucide-react';
import { QuizPageProps } from '@/types/quiz';

export const Page24ThankYou: React.FC<QuizPageProps> = ({ audio = {} }) => {
  useEffect(() => {
  }, []);

  return (
    <ProfessionalQuizLayout showProgress={false} showBackButton={false}>
      <div className="space-y-8 animate-fade-in text-center">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Obrigada pela sua compra!
          </h1>
          <p className="text-muted-foreground">
            Sua jornada de transformação começou agora
          </p>
        </div>

        {/* Success Message */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-primary mt-1" />
            <div className="text-left">
              <h3 className="font-semibold text-foreground mb-2">
                Seu plano personalizado está sendo preparado
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Em breve você receberá todas as informações no seu email para 
                começar sua transformação com os chás personalizados.
              </p>
            </div>
          </div>
        </div>

        {/* Encouragement */}
        <div className="flex items-center justify-center gap-2 text-primary">
          <Heart className="w-5 h-5" />
          <span className="font-medium">Estamos torcendo por você!</span>
          <Heart className="w-5 h-5" />
        </div>
      </div>
    </ProfessionalQuizLayout>
  );
};