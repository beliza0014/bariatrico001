import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { useQuizStep } from '@/hooks/useQuizStep';
import { useQuiz } from '@/contexts/QuizContext';
import { QuizPageProps } from '@/types/quiz';
import { Check, Apple, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GLOBAL_CONSTANTS, TRACKING_EVENTS, getExperimentVariant, AB_EXPERIMENTS } from '@/config/globalConstants';
import { useToast } from '@/hooks/use-toast';

// Frutas existentes
import abacaxiImage from '@/assets/fruit-abacaxi-realistic.png';
import laranjaImage from '@/assets/fruit-laranja-realistic.png';
import limaoImage from '@/assets/fruit-limao-realistic.png';
import macaImage from '@/assets/fruit-maca-realistic.png';
import morangoImage from '@/assets/fruit-morango-realistic.png';

// Frutas novas
import tangerinaImage from '@/assets/fruit-tangerina-realistic.png';
import maracujaImage from '@/assets/fruit-maracuja-realistic.png';
import uvaImage from '@/assets/fruit-uva-realistic.png';
interface FruitOption {
  id: string;
  text: string;
  shortText: string;
  image: string;
  tags: string[];
  category: string;
}
interface FruitCategory {
  id: string;
  title: string;
  icon: string;
  fruits: FruitOption[];
}
export const Page23FruitPreferences: React.FC<QuizPageProps> = ({
  audio = {}
}) => {
  useQuizStep('Preferencias_de_Frutas');
  const {
    addAnswer,
    nextPage,
    getAnswer
  } = useQuiz();
  const {
    toast
  } = useToast();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [ctaVariant, setCtaVariant] = useState<'control' | 'variant'>('control');
  const mountTimeRef = useRef<number>(Date.now());

  // Estrutura categorizada das frutas
  const fruitCategories: FruitCategory[] = [{
    id: "citrus",
    title: "Sabores Cítricos",
    icon: "🍊",
    fruits: [{
      id: "laranja",
      text: "Laranja",
      shortText: "Laranja",
      image: laranjaImage,
      tags: ["citrus"],
      category: "citrus"
    }, {
      id: "limao",
      text: "Limão",
      shortText: "Limão",
      image: limaoImage,
      tags: ["citrus"],
      category: "citrus"
    }, {
      id: "tangerina",
      text: "Tangerina",
      shortText: "Tangerina",
      image: tangerinaImage,
      tags: ["citrus"],
      category: "citrus"
    }, {
      id: "maracuja",
      text: "Maracujá",
      shortText: "Maracujá",
      image: maracujaImage,
      tags: ["citrus"],
      category: "citrus"
    }]
  }, {
    id: "sweet",
    title: "Sabores Doces",
    icon: "🍓",
    fruits: [{
      id: "morango",
      text: "Morango",
      shortText: "Morango",
      image: morangoImage,
      tags: ["sweet"],
      category: "sweet"
    }, {
      id: "abacaxi",
      text: "Abacaxi",
      shortText: "Abacaxi",
      image: abacaxiImage,
      tags: ["sweet"],
      category: "sweet"
    }, {
      id: "maca",
      text: "Maçã",
      shortText: "Maçã",
      image: macaImage,
      tags: ["sweet"],
      category: "sweet"
    }, {
      id: "uva",
      text: "Uva",
      shortText: "Uva",
      image: uvaImage,
      tags: ["sweet"],
      category: "sweet"
    }]
  }];

  // Array plano de todas as frutas para compatibilidade
  const allFruits = fruitCategories.flatMap(category => category.fruits);

  // Setup A/B test variant and restore state on mount
  useEffect(() => {
    // Initialize A/B test variant
    const variant = getExperimentVariant('p20_cta_variant');
    setCtaVariant(variant as 'control' | 'variant');

    // Restore selections from localStorage (chave canônica)
    const existingAnswer = getAnswer("preferencias_de_frutas");
    if (existingAnswer && Array.isArray(existingAnswer.answer)) {
      const savedIds = existingAnswer.answer.map(text => allFruits.find(opt => opt.text === text)?.id).filter(Boolean) as string[];
      setSelectedOptions(savedIds);
    }

    // Track page impression
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'fruits_open', {
        content_name: 'Fruit Preferences Page',
        step_id: 'preferencias_de_frutas',
        variant: variant
      });
    }
  }, []);
  const trackFruitEvent = useCallback((eventType: 'select' | 'deselect', option: FruitOption, newSelection: string[]) => {
    if (typeof window !== 'undefined' && window.gtag) {
      const position = allFruits.findIndex(opt => opt.id === option.id);
      const hasRefreshing = newSelection.some(id => allFruits.find(f => f.id === id)?.category === 'refreshing');
      const sweetPref = hasRefreshing ? 'low' : 'unset';
      const timeFromMount = Date.now() - mountTimeRef.current;
      window.gtag('event', eventType === 'select' ? TRACKING_EVENTS.FRUITS_SELECT : TRACKING_EVENTS.FRUITS_DESELECT, {
        step: 20,
        fruit: option.id,
        label: option.text,
        count: newSelection.length,
        selections: newSelection,
        sweet_pref: sweetPref,
        category: option.category,
        variant: ctaVariant,
        time_from_mount_ms: timeFromMount
      });
    }
  }, [ctaVariant, allFruits]);
  const handleOptionSelect = (optionId: string) => {
    let newSelection: string[];
    const option = allFruits.find(opt => opt.id === optionId);
    if (!option) return;
    if (selectedOptions.includes(optionId)) {
      newSelection = selectedOptions.filter(id => id !== optionId);
      trackFruitEvent('deselect', option, newSelection);
    } else {
      // Não permite mais de 4 seleções
      if (selectedOptions.length >= 4) {
        return;
      }
      newSelection = [...selectedOptions, optionId];
      trackFruitEvent('select', option, newSelection);
    }
    setSelectedOptions(newSelection);
    audio.onSelect?.();
  };
  const handleContinue = () => {
    // Validação rigorosa: mín. 2, máx. 4
    if (selectedOptions.length < 2 || selectedOptions.length > 4) {
      toast({
        description: selectedOptions.length < 2 ? "Escolha pelo menos 2 sabores para personalizar seu chá" : "Escolha no máximo 4 sabores",
        duration: 2500
      });
      audio.onInvalid?.();
      return;
    }
    const selectedTexts = selectedOptions.map(id => allFruits.find(opt => opt.id === id)?.text || '').filter(Boolean);

    // Derive tags and sweet preference
    const selectedTags = selectedOptions.flatMap(id => allFruits.find(opt => opt.id === id)?.tags || []);
    const hasRefreshing = selectedTags.includes('refreshing');
    const sweetPref = hasRefreshing ? 'low' : 'unset';
    const timeToComplete = Date.now() - mountTimeRef.current;
    addAnswer("preferencias_de_frutas", selectedTexts); // Chave canônica

    // Save enhanced fruit preferences for personalization
    localStorage.setItem('fruit_preferences', JSON.stringify({
      fruits: selectedTexts,
      tags: selectedTags,
      sweet_pref: sweetPref,
      timestamp: Date.now()
    }));

    // Track final submission with comprehensive payload
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', TRACKING_EVENTS.FRUITS_SUBMIT, {
        step: 20,
        count: selectedOptions.length,
        selections: selectedOptions,
        sweet_pref: sweetPref,
        variant: ctaVariant,
        time_from_mount_ms: Date.now() - mountTimeRef.current,
        time_to_complete_ms: timeToComplete,
        has_refreshing: selectedTags.includes('refreshing'),
        citrus_count: selectedTags.filter(t => t === 'citrus').length,
        sweet_count: selectedTags.filter(t => t === 'sweet').length,
        tropical_count: selectedTags.filter(t => t === 'tropical').length,
        refreshing_count: selectedTags.filter(t => t === 'refreshing').length
      });
    }
    audio.onValid?.();
    setTimeout(() => {
      audio.onNext?.();
      nextPage();
    }, 100);
  };
  const canContinue = selectedOptions.length >= 2 && selectedOptions.length <= 4;
  const ctaText = 'CONTINUAR';
  return <ProfessionalQuizLayout>
      <div className="animate-fade-in space-y-6">
        {/* Accessible Selection Counter */}
        <div id="p20-counter" aria-live="polite" className="sr-only" aria-label={`Selecionados: ${selectedOptions.length} de 4 sabores`}>
          Selecionados: {selectedOptions.length} de 4
        </div>

        {/* Enhanced Professional Question Header */}
        <div className="professional-question-header">
          <div className="professional-question-icon">
            <Apple className="w-7 h-7 text-primary" />
          </div>
          <h1 className="professional-question-title">
            Quais sabores vão deixar sua jornada mais gostosa?
          </h1>
          <p className="professional-question-subtitle">
            Escolha 2–4 frutas que mais gosta
          </p>
          <div className="professional-trust-badge">
            <Check className="w-4 h-4" />
            Sabores Selecionados por Nutricionistas
          </div>
        </div>

        {/* Categorized Fruit Selection - New Layout */}
        <div className="space-y-8 max-w-3xl mx-auto">
          {fruitCategories.map((category, categoryIndex) => <div key={category.id} className="space-y-4">
              {/* Category Header */}
              <div className="text-center">
                <h3 className="flex items-center justify-center gap-2 text-lg font-semibold text-foreground mb-2">
                  <span className="text-2xl">{category.icon}</span>
                  {category.title}
                </h3>
              </div>
              
              {/* Category Fruits Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {category.fruits.map((option, fruitIndex) => {
              const globalIndex = categoryIndex * 10 + fruitIndex; // Unique animation delay
              return <button key={option.id} onClick={() => handleOptionSelect(option.id)} disabled={!selectedOptions.includes(option.id) && selectedOptions.length >= 4} className={`
                        premium-option-card professional-staggered-animation min-h-[100px] relative
                        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                        ${selectedOptions.includes(option.id) ? 'selected' : ''}
                        ${!selectedOptions.includes(option.id) && selectedOptions.length >= 4 ? 'opacity-50 cursor-not-allowed' : ''}
                      `} style={{
                animationDelay: `${globalIndex * 80}ms`
              }} role="button" tabIndex={0} aria-pressed={selectedOptions.includes(option.id)} aria-labelledby={`fruit-label-${option.id}`} aria-describedby="p20-counter" onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOptionSelect(option.id);
                }
              }}>
                      {/* Premium Selection Indicator */}
                      <div className="premium-selection-indicator">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      
                      <div className="flex flex-col items-center text-center h-full justify-center relative z-10 p-2">
                        {/* Fruit Image - Decorative with fixed dimensions */}
                        <div className="w-12 h-12 mb-1 flex items-center justify-center">
                          <img src={option.image} alt="" role="presentation" className="w-full h-full object-contain" loading={globalIndex < 8 ? "eager" : "lazy"} decoding="sync" width="48" height="48" style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                      backgroundColor: 'transparent'
                    }} />
                        </div>
                        
                        {/* Fruit Name - Accessible Label */}
                        <div id={`fruit-label-${option.id}`} className="premium-text text-xs">
                          {option.shortText}
                        </div>
                      </div>
                    </button>;
            })}
              </div>
            </div>)}
        </div>

        {/* Enhanced Social Proof */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground/80 font-medium">
            🍓 {GLOBAL_CONSTANTS.SOCIAL_COUNT} já escolheram seus sabores preferidos
          </p>
        </div>

        {/* Enhanced Continue Button with A/B Test and Live Counter */}
        <div className="space-y-2">
            <Button onClick={handleContinue} disabled={!canContinue} variant="emerald" size="betterme" className="w-full" aria-live="polite" aria-describedby="p20-counter" aria-label={`${ctaText} com ${selectedOptions.length} de 4 frutas selecionadas`}>
              <Star className="w-5 h-5 mr-2" />
              {ctaText}
            </Button>
          
          {/* Microcopy */}
          
        </div>
      </div>
    </ProfessionalQuizLayout>;
};