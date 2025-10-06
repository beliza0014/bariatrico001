import React, { useState, useEffect, useRef } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { useQuiz } from '@/contexts/QuizContext';
import { useQuizStep } from '@/hooks/useQuizStep';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { QuizPageProps } from '@/types/quiz';
import { GLOBAL_CONSTANTS, TRACKING_EVENTS } from '@/config/globalConstants';
import { validateName, getNameLengthBucket, saveFirstName } from '@/utils/nameValidation';
import { useToast } from '@/hooks/use-toast';
export const Page08NameInput: React.FC<QuizPageProps> = ({
  audio = {}
}) => {
  useQuizStep('Nome');
  const {
    toast
  } = useToast();
  const {
    addAnswer,
    nextPage,
    updateUserInfo
  } = useQuiz();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Track page view on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'step_view', {
        step: 12,
        content_name: 'Name Input Page'
      });
    }
  }, []);

  // Auto-focus input with mobile optimization
  useEffect(() => {
    const focusInput = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    // Small delay for mobile compatibility
    const timer = setTimeout(focusInput, 100);
    return () => clearTimeout(timer);
  }, []);
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Truncate if too long and show toast
    if (value.length > 20) {
      toast({
        description: "Nome muito longo (máximo 20 caracteres)",
        duration: 2500
      });
      return;
    }
    setName(value);

    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };
  const handleSubmit = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setError('');
    const validation = validateName(name);
    if (!validation.isValid) {
      setError(validation.error || 'Nome inválido');
      setIsProcessing(false);
      return;
    }
    const cleanedName = validation.cleaned!;

    // Save locally only (LGPD compliance)
    saveFirstName(cleanedName);

    // Update quiz context
    addAnswer('Nome', cleanedName);
    updateUserInfo({
      name: cleanedName
    });

    // ❌ Evento Lead removido conforme instrução
    // Mantém apenas Contact (em Page25bContactCapture) e InitiateCheckout (em Page26Checkout)

    // Track without PII - only length bucket
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'first_name_submit', {
        len_bucket: getNameLengthBucket(cleanedName),
        skipped: false
      });
      window.gtag('event', 'cta_click', {
        button_text: 'CRIAR MINHA RECEITA AGORA',
        step: 12
      });
    }
    audio.onValid?.();
    setTimeout(() => {
      audio.onNext?.();
      nextPage();
      setIsProcessing(false);
    }, 200);
  };
  const handleSkip = () => {
    if (isProcessing) return;
    setIsProcessing(true);

    // Clear any saved name
    saveFirstName('');

    // Use fallback name
    addAnswer('Nome', 'Usuário');
    updateUserInfo({
      name: 'Usuário'
    });

    // Track skip event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'first_name_submit', {
        len_bucket: '0',
        skipped: true
      });
    }
    audio.onNext?.();
    setTimeout(() => {
      nextPage();
      setIsProcessing(false);
    }, 200);
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };
  return <ProfessionalQuizLayout>
      <div className="animate-betterme-page-enter">
        {/* Título principal */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold text-foreground">
            Qual o seu nome?
          </h1>
        </div>

        {/* Campo de Input acessível */}
        <div className="max-w-sm mx-auto">
          <div className="relative mb-6">
            <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
              Seu primeiro nome
            </label>
            
            <Input id="firstName" ref={inputRef} type="text" placeholder="Ana, Marina, Julia..." value={name} onChange={handleNameChange} onKeyDown={handleKeyPress} className={`text-lg bg-transparent border-0 border-b-2 ${error ? 'border-destructive' : 'border-border'} rounded-none focus:border-primary focus:ring-0 focus:outline-none px-0 py-3 placeholder:text-muted-foreground/70`} maxLength={20} autoComplete="given-name" autoCapitalize="words" inputMode="text" aria-describedby="nameHelp nameError" aria-invalid={!!error} autoFocus />
            
            {/* Error message with accessibility */}
            {error && <div id="nameError" className="text-sm text-destructive mt-1" role="alert" aria-live="polite">
                {error}
              </div>}
          </div>

          {/* Help text acessível */}
          <div id="nameHelp" className="text-center space-y-2 mb-4">
            
            
          </div>

          {/* Social Proof */}
          

          {/* Botões */}
          <div className="text-center space-y-4">
            <Button onClick={handleSubmit} disabled={isProcessing} variant="emerald" size="betterme" className="w-full">
              {isProcessing ? 'CRIANDO...' : 'CRIAR MINHA RECEITA AGORA'}
            </Button>
            
            {/* Botão secundário */}
            
          </div>
        </div>
      </div>
    </ProfessionalQuizLayout>;
};