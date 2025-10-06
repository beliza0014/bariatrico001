import React, { useState } from 'react';
import { useQuiz } from '@/contexts/QuizContext';
import { Button } from '@/components/ui/button';
import { Star, Apple, Check } from 'lucide-react';
import limaoImg from '@/assets/fruit-limao-no-bg.png';
import laranjaImg from '@/assets/fruit-laranja-no-bg.png';
import bananaImg from '@/assets/fruit-banana-no-bg.png';
import macaImg from '@/assets/fruit-maca-no-bg.png';
import morangoImg from '@/assets/fruit-morango-no-bg.png';
import abacaxiImg from '@/assets/fruit-abacaxi-no-bg.png';

interface FruitOption {
  id: string;
  text: string;
  image: string;
}

interface FruitSelectionQuestionProps {
  title: string;
  subtitle?: string;
  onAnswer: (answer: string[]) => void;
  // Audio handlers
  onSelect?: () => void;
  onNext?: () => void;
  onValid?: () => void;
  onInvalid?: () => void;
}

export const FruitSelectionQuestion: React.FC<FruitSelectionQuestionProps> = ({
  title,
  subtitle,
  onAnswer,
  // Audio handlers with defaults
  onSelect = () => {},
  onNext = () => {},
  onValid = () => {},
  onInvalid = () => {}
}) => {
  const { addAnswer, nextPage } = useQuiz();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const fruits: FruitOption[] = [
    { id: "limao", text: "Limão", image: limaoImg },
    { id: "laranja", text: "Laranja", image: laranjaImg },
    { id: "banana", text: "Banana", image: bananaImg },
    { id: "maca", text: "Maçã", image: macaImg },
    { id: "morango", text: "Morango", image: morangoImg },
    { id: "abacaxi", text: "Abacaxi", image: abacaxiImg }
  ];

  const handleOptionSelect = (optionId: string) => {
    onSelect();
    
    const newSelection = selectedOptions.includes(optionId)
      ? selectedOptions.filter(id => id !== optionId)
      : [...selectedOptions, optionId];
    
    setSelectedOptions(newSelection);
  };

  const handleContinue = () => {
    if (selectedOptions.length > 0) {
      const selectedTexts = selectedOptions.map(id => 
        fruits.find(fruit => fruit.id === id)?.text || ''
      ).filter(Boolean);
      
      addAnswer(title, selectedTexts);
      onAnswer(selectedTexts);
      onValid();
      setTimeout(() => {
        onNext();
        nextPage();
      }, 100);
    }
  };

  const canContinue = selectedOptions.length > 0;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Enhanced Professional Question Header */}
      <div className="professional-question-header">
        <div className="professional-question-icon">
          <Apple className="w-7 h-7 text-primary" />
        </div>
        <h2 className="professional-question-title">
          {title}
        </h2>
        {subtitle && (
          <p className="professional-question-subtitle">
            {subtitle}
          </p>
        )}
        <div className="professional-trust-badge">
          <Check className="w-4 h-4" />
          Frutas Selecionadas por Nutricionistas
        </div>
      </div>

      {/* Enhanced Fruit Options Grid */}
      <div className="unified-two-column-grid">
        {fruits.map((fruit, index) => (
          <div
            key={fruit.id}
            className={`
              premium-option-card professional-staggered-animation min-h-[140px]
              ${selectedOptions.includes(fruit.id) ? 'selected' : ''}
            `}
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => handleOptionSelect(fruit.id)}
          >
            {/* Premium Selection Indicator */}
            <div className="premium-selection-indicator">
              <Check className="w-3 h-3 text-white" />
            </div>
            
            <div className="flex flex-col items-center text-center h-full justify-center relative z-10">
              {/* Fruit Image */}
              <div className="w-20 h-20 mb-3 flex items-center justify-center">
                <img 
                  src={fruit.image} 
                  alt={fruit.text}
                  className="w-full h-full object-contain"
                  loading="eager"
                  decoding="sync"
                  style={{ 
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                    backgroundColor: 'transparent'
                  }}
                />
              </div>
              
              {/* Fruit Name */}
              <div className="premium-text">
                {fruit.text}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Continue Button */}
      <div className="mt-8">
        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          className={`
            w-full
            ${!canContinue ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          size="lg"
        >
          <Star className="w-5 h-5 mr-2" />
          Continuar com {selectedOptions.length} fruta{selectedOptions.length !== 1 ? 's' : ''}
        </Button>
      </div>
    </div>
  );
};