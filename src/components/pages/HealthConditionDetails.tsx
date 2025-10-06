import React, { useState } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { trackEvent } from '@/utils/tracking';

interface HealthConditionDetailsProps {
  onContinue: (condition: string) => void;
  onBack?: () => void;
}

export const HealthConditionDetails: React.FC<HealthConditionDetailsProps> = ({
  onContinue,
  onBack
}) => {
  const [healthCondition, setHealthCondition] = useState('');
  const [isValid, setIsValid] = useState(false);

  const handleInputChange = (value: string) => {
    setHealthCondition(value);
    setIsValid(value.trim().length > 0);
  };

  const handleSubmit = () => {
    if (isValid) {
      trackEvent('health_condition_detailed', {
        condition_length: healthCondition.length,
        has_content: healthCondition.trim().length > 0
      });
      onContinue(healthCondition);
    }
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

            {/* Question */}
            <div className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                Qual dos problemas abaixo? 🌿
              </h1>
              
              <p className="text-gray-600 text-base">
                Diabetes, Hipertensão, Doenças cardiovasculares, Pressão alta,<br />
                Menopausa, Hipotireoidismo, Depressão, Ansiedade, Síndrome do<br />
                Intestino Irritável, problemas Digestivos como refluxo, gastrite e outros...
              </p>
            </div>

            {/* Input field */}
            <div className="mt-12 space-y-4">
              <div className="relative">
                <div className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-xl bg-gray-50 focus-within:border-emerald-500 focus-within:bg-white transition-all">
                  <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <Textarea
                    value={healthCondition}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="Escreva o seu problema aqui"
                    className="border-0 bg-transparent p-0 resize-none min-h-[60px] placeholder:text-gray-400 focus-visible:ring-0 text-gray-900"
                    rows={3}
                  />
                </div>
              </div>

              <div className="text-left">
                <p className="text-sm text-red-500 font-medium">
                  campo obrigatório
                </p>
              </div>
            </div>

            {/* Continue button */}
            <div className="mt-8">
              <Button
                onClick={handleSubmit}
                disabled={!isValid}
                className={`
                  w-full py-6 text-lg font-semibold rounded-xl transition-all duration-200
                  ${isValid 
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                Enviar
              </Button>
            </div>

            {/* Security message */}
            <div className="mt-8 bg-gray-50 rounded-2xl p-4 border border-gray-200">
              <div className="flex items-center justify-center gap-2">
                <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Isso garantirá que sua fórmula seja 100% segura para você!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProfessionalQuizLayout>
  );
};