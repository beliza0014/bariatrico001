import React, { useEffect } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { useQuizStep } from '@/hooks/useQuizStep';
import { useQuiz } from '@/contexts/QuizContext';
import { QuizPageProps } from '@/types/quiz';
import { Shield, Award, Users, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GLOBAL_CONSTANTS } from '@/config/globalConstants';

export const Page21AuthorityBoost: React.FC<QuizPageProps> = ({ audio = {} }) => {
  useQuizStep('Authority_Boost');
  const { nextPage, userInfo } = useQuiz();

  useEffect(() => {
    audio.onEnter?.();
    
    // Track authority view
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'authority_view', {
        name: userInfo.name
      });
    }
    
  }, []);

  const handleContinue = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'authority_cta_click', {
        name: userInfo.name
      });
    }
    
    audio.onSelect?.();
    audio.onNext?.();
    nextPage();
  };

  return (
    <ProfessionalQuizLayout headerTitle="Credenciais profissionais">
      <div className="animate-betterme-page-enter">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {userInfo.name && `${userInfo.name}, `}você está em boas mãos
          </h1>
          <p className="text-lg text-muted-foreground">
            Conheça as credenciais da nossa especialista
          </p>
        </div>

        {/* Authority Card */}
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Nutritionist Profile */}
          <div className="bg-white rounded-2xl border border-border shadow-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 overflow-hidden rounded-full">
                <img 
                  src="/lovable-uploads/gender-female-dra-alice-clear.webp"
                  alt="Foto profissional da Dra. Alice, nutricionista especializada"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Dra. Alice Nutricionista
                </h3>
                <p className="text-muted-foreground">CRN Ativa — Conselho Regional de Nutricionistas</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-muted-foreground">
                Graduada em Nutrição pela USP, especialista em nutrição clínica e funcional com mais de 10 anos de experiência 
                em emagrecimento saudável e sustentável. Certificada em Fitoterapia e Metabolismo.
              </p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline" className="text-xs">Nutrição Clínica</Badge>
                <Badge variant="outline" className="text-xs">Fitoterapia</Badge>
                <Badge variant="outline" className="text-xs">Metabolismo</Badge>
              </div>
            </div>
          </div>

          {/* Credentials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* CRN Certification */}
            <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
              <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-800 mb-1">CRN Ativa</h4>
              <p className="text-xs text-blue-600">Conselho Regional de Nutricionistas</p>
            </div>

            {/* Guarantee */}
            <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-500/20">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <h4 className="font-semibold text-emerald-800 mb-1">{GLOBAL_CONSTANTS.GUARANTEE_DAYS}</h4>
              <p className="text-xs text-emerald-600">Garantia Total</p>
            </div>

            {/* Success Stories */}
            <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-200">
              <Users className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <h4 className="font-semibold text-emerald-800 mb-1">+10.000</h4>
              <p className="text-xs text-emerald-600">Clientes Atendidas</p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 text-center">
            <h3 className="text-lg font-semibold text-primary mb-2">
              ✓ Método cientificamente comprovado
            </h3>
            <p className="text-sm text-foreground">
              Baseado em estudos sobre metabolismo e fitoterapia para emagrecimento natural
            </p>
          </div>
        </div>

        {/* Continue Button */}
        <Button 
          onClick={handleContinue}
          variant="emerald"
          size="betterme"
          className="w-full"
        >
          PROSSEGUIR COM CONFIANÇA
        </Button>
      </div>
    </ProfessionalQuizLayout>
  );
};