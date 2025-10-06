import React, { useState, useEffect, useRef } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { useQuizStep } from '@/hooks/useQuizStep';
import { useQuiz } from '@/contexts/QuizContext';
import { QuizPageProps } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone, Mail, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { trackPixelContact } from '@/utils/pixelTracking';

// Validation schemas - aceita números com ou sem +
const whatsappSchema = z.string().trim().regex(/^\+?[0-9]{10,15}$/, 'Digite apenas números').min(10, 'Mínimo 10 dígitos').max(15, 'Máximo 15 dígitos');
const emailSchema = z.string().trim().email('E-mail inválido').max(255, 'E-mail muito longo');
export const Page25bContactCapture: React.FC<QuizPageProps> = ({
  audio = {}
}) => {
  useQuizStep('Contact_Capture');
  const {
    nextPage,
    addAnswer,
    getAnswer,
    leadId,
    userInfo
  } = useQuiz();

  // Get delivery preference from previous page
  const deliveryPreference = getAnswer('delivery_preference')?.answer || 'whatsapp';
  const isWhatsApp = deliveryPreference === 'whatsapp';
  const [contactValue, setContactValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedToCloud, setSavedToCloud] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  useEffect(() => {
    audio.onEnter?.();

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Validate input on change
  useEffect(() => {
    if (!contactValue) {
      setIsValid(false);
      setError('');
      return;
    }
    try {
      if (isWhatsApp) {
        whatsappSchema.parse(contactValue);
      } else {
        emailSchema.parse(contactValue);
      }
      setIsValid(true);
      setError('');
    } catch (err) {
      setIsValid(false);
      if (err instanceof z.ZodError) {
        setError(err.errors[0]?.message || '');
      }
    }
  }, [contactValue, isWhatsApp]);
  const handleContinue = async () => {
    if (!isValid || isSaving) return;
    setIsSaving(true);
    try {
      // Salvar no localStorage primeiro
      addAnswer(isWhatsApp ? 'whatsapp_contact' : 'email_contact', contactValue);

      // Recuperar session_id e leadId
      const sessionId = localStorage.getItem('quiz-session-id') || crypto.randomUUID();
      const leadIdFromStorage = localStorage.getItem('nutrition-quiz-lead-id') || sessionId;

      // Salvar no Cloud usando a função unificada capture-contact
      const body = {
        session_id: leadIdFromStorage,
        contact_type: isWhatsApp ? 'whatsapp' : 'email',
        contact_value: contactValue,
        lead_name: getAnswer('name')?.answer as string || userInfo.name || 'Cliente'
      };

      const { data, error: cloudError } = await supabase.functions.invoke('capture-contact', { body });
      if (cloudError) {
        console.error('Erro ao salvar no Cloud:', cloudError);
      } else {
        setSavedToCloud(true);
      }

      // Meta Pixel - Contact event com eventID
      trackPixelContact(isWhatsApp ? 'WhatsApp' : 'Email');
      audio.onSelect?.();
      audio.onNext?.();

      // Navigate after delay with cleanup
      timeoutRef.current = setTimeout(() => {
        nextPage();
      }, 600);
    } catch (err) {
      console.error('Erro ao processar contato:', err);
      // Mesmo com erro, continua (localStorage é fallback)
      audio.onNext?.();
      nextPage();
    } finally {
      setIsSaving(false);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isWhatsApp) {
      // Remove tudo que não é número
      const numeric = value.replace(/[^0-9]/g, '');
      // Limita a 15 dígitos (formato internacional)
      const limited = numeric.slice(0, 15);
      setContactValue(limited);
    } else {
      setContactValue(value);
    }
  };
  return <ProfessionalQuizLayout>
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="text-center space-y-8">
            {/* Logo/Progress Bar */}
            <div className="mb-8">
              <div className="w-full max-w-xs mx-auto">
                <div className="h-2 bg-emerald-500 rounded-full"></div>
              </div>
            </div>

            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center">
                {isWhatsApp ? <Phone className="w-10 h-10 text-white" /> : <Mail className="w-10 h-10 text-white" />}
              </div>
            </div>

            {/* Headline em quadro com bordas verdes e fundo branco */}
            <div className="border-4 border-emerald-500 bg-white rounded-2xl p-6 mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-black leading-tight">
                Elimine 8kg em 30 dias
              </h1>
            </div>

            {/* Subheadline */}
            <div className="space-y-2 mb-6">
              <p className="text-lg md:text-xl font-bold text-black">
                Por apenas <span className="text-emerald-500">R$ 37,90</span> — Receba seu Plano Personalizado de Emagrecimento
              </p>
            </div>

            {/* Pergunta */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">Digite no campo abaixo</p>
            </div>

            {/* Input Field */}
            <div className="mt-8">
              <Input type={isWhatsApp ? 'tel' : 'email'} placeholder={isWhatsApp ? '11987654321' : 'seu@email.com'} value={contactValue} onChange={handleInputChange} className="w-full h-14 text-lg text-center border-2 border-gray-300 focus:border-emerald-500 rounded-xl" autoFocus inputMode={isWhatsApp ? 'numeric' : 'email'} />
              {error}
            </div>

            {/* Continue Button */}
            <div className="mt-8">
              <Button onClick={handleContinue} disabled={!isValid || isSaving} className="w-full h-14 text-lg font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                {isSaving ? <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Salvando...
                  </span> : savedToCloud ? <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Salvo!
                  </span> : 'Continuar'}
              </Button>
            </div>

            {/* Security/Privacy note */}
            <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                🔒 Seus dados estão seguros e protegidos
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProfessionalQuizLayout>;
};