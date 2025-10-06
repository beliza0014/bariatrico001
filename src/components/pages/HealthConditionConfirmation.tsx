import React from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { trackEvent } from '@/utils/tracking';

interface HealthConditionConfirmationProps {
  userName: string;
  healthCondition: string;
  onContinue: () => void;
}

export const HealthConditionConfirmation: React.FC<HealthConditionConfirmationProps> = ({
  userName,
  healthCondition,
  onContinue
}) => {
  const handleContinue = () => {
    trackEvent('health_condition_confirmation_continue', {
      user_name: userName,
      health_condition: healthCondition
    });
    onContinue();
  };

  return (
    <ProfessionalQuizLayout showProgress={false}>
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="text-center space-y-8">
            {/* Progress bar */}
            <div className="mb-8">
              <div className="w-full max-w-xs mx-auto">
                <div className="h-2 bg-emerald-500 rounded-full"></div>
              </div>
            </div>

            {/* Heart icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-emerald-600 fill-current" />
              </div>
            </div>

            {/* Personalized message */}
            <div className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {userName}, você diz que tem {healthCondition}.
              </h1>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                Pode ficar em paz — vamos adaptar as receitas especialmente para que você queime gordura de forma simples e segura! ❤️
              </p>
            </div>

            {/* Continue button */}
            <div className="mt-12">
              <Button
                onClick={handleContinue}
                className="w-full py-6 text-lg font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all duration-200"
              >
                Continuar
              </Button>
            </div>

            {/* Security message */}
            <div className="mt-8 bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
              <div className="flex items-center justify-center gap-2">
                <div className="w-6 h-6 bg-emerald-600 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-emerald-700">
                  Suas receitas serão personalizadas considerando sua condição de saúde
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProfessionalQuizLayout>
  );
};