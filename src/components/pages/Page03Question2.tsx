import React, { useState, useEffect } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { useQuiz } from '@/contexts/QuizContext';
import { useQuizStep } from '@/hooks/useQuizStep';
import { QuizPageProps } from '@/types/quiz';
import { Lock } from 'lucide-react';
import genderFemaleOption from '@/assets/gender-female-option.png';
import genderMaleOption from '@/assets/gender-male-option.png';

export const Page03Question2: React.FC<QuizPageProps> = ({
  audio = {}
}) => {
  useQuizStep('Genero');
  const { addAnswer, nextPage } = useQuiz();
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [stepStartTime] = useState(Date.now());

  // Opções de gênero simplificadas - apenas homem e mulher
  const genderOptions = [
    {
      id: 'F',
      label: 'Mulher',
      image: genderFemaleOption
    },
    {
      id: 'M', 
      label: 'Homem',
      image: genderMaleOption
    }
  ];

  // Carregar seleção persistida
  useEffect(() => {
    const savedData = localStorage.getItem('lm_gender');
    if (savedData) {
      try {
        const genderData = JSON.parse(savedData);
        setSelectedGender(genderData.gender_id || '');
      } catch (e) {
        // Handle invalid JSON
      }
    }
  }, []);

  const handleGenderSelect = (genderId: string) => {
    const option = genderOptions.find(opt => opt.id === genderId);
    if (!option) return;
    
    setSelectedGender(genderId);

    // Persistir dados no formato lm_gender
    const genderData = {
      gender_id: genderId,
      gender_label: option.label
    };
    localStorage.setItem('lm_gender', JSON.stringify(genderData));

    // Salvar resposta no contexto usando chave canônica
    addAnswer('genero', option.label);
    audio.onSelect?.();
    
    const timeOnStep = Date.now() - stepStartTime;

    // Tracking - gender_selected
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'gender_selected', {
        gender_id: genderId,
        gender_label: option.label,
        step: 'P03',
        ab_variant: 'default',
        time_on_step_ms: timeOnStep
      });
    }

    // Auto-advance com delay de 600ms
    setTimeout(() => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'auto_advance_next', {
          gender_id: genderId,
          gender_label: option.label,
          step: 'P03',
          ab_variant: 'default',
          time_on_step_ms: timeOnStep
        });
      }
      audio.onNext?.();
      nextPage();
    }, 600);
  };

  return (
    <ProfessionalQuizLayout headerTitle="Meu perfil">
      <div className="space-y-6 max-w-lg mx-auto px-4">
        {/* Título e subtítulo */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Qual seu Sexo?
          </h1>
          <p className="text-sm text-muted-foreground">
            Selecione abaixo
          </p>
        </div>

        {/* Opções de gênero com imagens lado a lado */}
        <div className="grid grid-cols-2 gap-4">
          {genderOptions.map(option => {
            const isSelected = selectedGender === option.id;
            return (
              <div key={option.id}>
                <button
                  onClick={() => handleGenderSelect(option.id)}
                  className={`
                    w-full aspect-[3/4] rounded-2xl border-2 transition-all duration-200 cursor-pointer
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                    overflow-hidden relative
                    ${isSelected ? 'border-green-500 bg-green-50' : 'border-green-400 hover:border-green-500'}
                  `}
                >
                  <img 
                    src={option.image} 
                    alt={option.label}
                    className="w-full h-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Container informativo */}
        <div className="bg-green-50 border-2 border-green-400 rounded-2xl p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <Lock className="w-5 h-5 text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-green-900 text-base">
                As informações são para fazer ajustes em seu plano exclusivo e personalizado.
              </h3>
              <p className="text-sm text-green-800 leading-relaxed">
                O sexo biológico é um fator que afeta a sua TMB (taxa metabólica), que determina quantas calorias você queima por dia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProfessionalQuizLayout>
  );
};