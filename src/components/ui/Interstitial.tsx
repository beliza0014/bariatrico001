import React from 'react';
import { trackEvent } from '@/utils/tracking';
import bodyNatural from '@/assets/body-natural.png';
import bodyEmForma from '@/assets/body-em-forma.png';
import { Phone, Mail } from 'lucide-react';
interface InterstitialQuestionProps {
  title: string;
  subtitle?: string;
  options: {
    label: string;
    value: string;
  }[];
  onAnswer: (value: string) => void;
  fromStep?: number;
  toStep?: number;
  questionType?: 'health' | 'delivery' | 'body';
}
export const InterstitialQuestion: React.FC<InterstitialQuestionProps> = ({
  title,
  subtitle,
  options,
  onAnswer,
  fromStep,
  toStep,
  questionType = 'health'
}) => {
  const handleAnswer = (value: string) => {
    trackEvent('interstitial_question_answered', {
      question: title,
      answer: value,
      from_step: fromStep,
      to_step: toStep
    });
    onAnswer(value);
  };
  const getOptionIcon = (option: any, questionType: string) => {
    if (questionType === 'health') {
      return option.value === 'sim' ? <div className="w-16 h-16 bg-emerald-500 rounded-lg flex items-center justify-center mb-3">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div> : <div className="w-16 h-16 bg-pink-500 rounded-lg flex items-center justify-center mb-3">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>;
    }
    if (questionType === 'delivery') {
      return option.value === 'whatsapp' ? <div className="w-16 h-16 bg-emerald-500 rounded-lg flex items-center justify-center mb-3">
          <Phone className="w-8 h-8 text-white" />
        </div> : <div className="w-16 h-16 bg-sky-500 rounded-lg flex items-center justify-center mb-3">
          <Mail className="w-8 h-8 text-white" />
        </div>;
    }
    if (questionType === 'body') {
      return <div className="w-32 h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
          <img src={option.value === 'natural' ? bodyNatural : bodyEmForma} alt={option.label} className="w-full h-full object-cover" />
        </div>;
    }
    return null;
  };
  return <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center space-y-8">
          {/* Logo */}
          <div className="mb-8">
            
            <div className="w-full max-w-xs mx-auto">
              <div className="h-2 bg-emerald-500 rounded-full"></div>
            </div>
          </div>

          {/* Question */}
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {title}
            </h1>
            
            {subtitle && <p className="text-gray-600 text-base underline">
                {subtitle}
              </p>}
          </div>

          {/* Options */}
          <div className={`mt-12 ${questionType === 'body' ? 'space-y-0' : 'space-y-4'} ${questionType === 'body' ? 'flex justify-center gap-6' : ''}`}>
            {options.map((option, index) => <button key={index} onClick={() => handleAnswer(option.value)} className={`
                  w-full transition-all duration-200 hover:scale-105 active:scale-95
                  ${questionType === 'body' ? 'w-auto' : ''}
                  ${questionType === 'health' || questionType === 'delivery' ? 'border-2 border-emerald-500 bg-white rounded-2xl p-6 hover:bg-emerald-50' : ''}
                  ${questionType === 'body' ? 'bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 border-2 border-gray-200 hover:border-emerald-500' : ''}
                `}>
                <div className="flex flex-col items-center">
                  {getOptionIcon(option, questionType)}
                  <span className="text-lg font-medium text-gray-900">
                    {option.label}
                  </span>
                </div>
              </button>)}
          </div>

          {/* Security message for health question */}
          {questionType === 'health' && <div className="mt-8 bg-gray-50 rounded-2xl p-4 border border-gray-200">
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
            </div>}
        </div>
      </div>
    </div>;
};