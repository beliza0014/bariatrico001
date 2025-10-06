import React, { useState } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuiz } from '@/contexts/QuizContext';
import { useQuizStep } from '@/hooks/useQuizStep';
import { QuizPageProps } from '@/types/quiz';
import { User } from 'lucide-react';
export const Page20DesiredWeight: React.FC<QuizPageProps> = ({
  audio = {}
}) => {
  useQuizStep('Peso_Desejado');
  const {
    updateUserInfo,
    nextPage
  } = useQuiz();
  const [desiredWeight, setDesiredWeight] = useState('');
  const handleContinue = () => {
    if (!desiredWeight || desiredWeight.trim() === '') return;
    audio.onSelect?.();
    updateUserInfo({
      desired_weight: parseInt(desiredWeight)
    });
    setTimeout(() => {
      audio.onNext?.();
      nextPage();
    }, 100);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers
    if (value === '' || /^\d+$/.test(value)) {
      setDesiredWeight(value);
    }
  };
  const isValid = desiredWeight.trim() !== '' && parseInt(desiredWeight) > 0;
  return <ProfessionalQuizLayout headerTitle="BetterMe">
      <div className="space-y-6 animate-betterme-page-enter bg-gradient-to-br from-emerald-50/20 via-white to-emerald-50/30 rounded-2xl p-6 border border-emerald-100/50">
        <div className="text-center space-y-4">
          <div className="bg-gradient-to-r from-emerald-600 via-emerald-600 to-emerald-700 bg-clip-text text-transparent">
            <h2 className="betterme-question-title font-black tracking-tight">
              Qual é o seu peso desejado?
            </h2>
          </div>
          <p className="text-base text-slate-600 font-medium leading-relaxed max-w-md mx-auto">
            Estamos quase lá! Vamos ajustar seu plano de acordo com seu corpo.
          </p>
          
        </div>

        <div className="max-w-sm mx-auto space-y-6">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <User className="w-5 h-5" />
            </div>
            <Input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="Digite o seu peso desejado" value={desiredWeight} onChange={handleInputChange} className="pl-12 pr-4 py-4 text-base rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-white/80 backdrop-blur-sm placeholder:text-slate-400" />
          </div>

          <Button onClick={handleContinue} disabled={!isValid} variant="emerald" size="betterme" className="w-full">
            Continuar
          </Button>
        </div>

        <div className="bg-emerald-50/80 rounded-xl p-4 border border-emerald-100 max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center mt-0.5">
              <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-slate-700 font-medium leading-relaxed">
              <strong>Baseado nisso</strong>, ajustaremos a dosagem ideal para os melhores resultados!
            </p>
          </div>
        </div>
      </div>
    </ProfessionalQuizLayout>;
};