import React, { useState } from 'react';
import { useQuiz } from '@/contexts/QuizContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Check, Star } from 'lucide-react';
import { SmartImage } from '@/components/ui/SmartImage';
export interface QuizOption {
  id: string;
  text: string;
  icon?: React.ReactNode;
  description?: string;
  badge?: string;
  image?: string;
  fullWidth?: boolean;
}
interface UnifiedQuizQuestionProps {
  title: string;
  subtitle?: string;
  questionIcon?: React.ReactNode;
  trustBadge?: string;
  options?: QuizOption[];
  multipleChoice?: boolean;
  inputType?: 'text' | 'number' | 'height-weight';
  placeholder?: string;
  onAnswer: (answer: string | string[]) => void;
  showContinueButton?: boolean;
  autoAdvance?: boolean;
  required?: boolean;
  heroImage?: string;
  gridColumns?: 1 | 2 | 3;
  showSkipLink?: boolean;
  // Audio handlers
  onSelect?: () => void;
  onNext?: () => void;
  onValid?: () => void;
  onInvalid?: () => void;
}
export const UnifiedQuizQuestion: React.FC<UnifiedQuizQuestionProps> = ({
  title,
  subtitle,
  questionIcon,
  trustBadge,
  options = [],
  multipleChoice = false,
  inputType,
  placeholder,
  onAnswer,
  showContinueButton = true,
  autoAdvance = false,
  required = true,
  heroImage,
  gridColumns = 1,
  showSkipLink = false,
  // Audio handlers with defaults
  onSelect = () => {},
  onNext = () => {},
  onValid = () => {},
  onInvalid = () => {}
}) => {
  const {
    addAnswer,
    nextPage,
    currentPage
  } = useQuiz();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [animatingCard, setAnimatingCard] = useState<string | null>(null);
  // Auto-generate subtitle for multiple choice if not provided
  const displaySubtitle = multipleChoice && !subtitle ? "Escolha todas que se aplicam" : subtitle;
  const handleOptionSelect = (optionId: string, event?: React.MouseEvent) => {
    onSelect();
    if (multipleChoice) {
      const newSelection = selectedOptions.includes(optionId) ? selectedOptions.filter(id => id !== optionId) : [...selectedOptions, optionId];
      setSelectedOptions(newSelection);
      onAnswer(newSelection); // Notify parent component immediately
    } else {
      // Clean selection with animation
      setAnimatingCard(optionId);
      setSelectedOptions([optionId]);
      setIsAnswered(true);
      const selectedOption = options.find(opt => opt.id === optionId);
      if (selectedOption) {
        addAnswer(title, optionId);
        onAnswer(optionId);

        // Clean feedback timing
        setTimeout(() => {
          onValid();
        }, 150);
        if (autoAdvance) {
          setTimeout(() => {
            onNext();
            nextPage();
          }, 600);
        }
      }
    }
  };
  const handleInputSubmit = () => {
    if (inputType === 'height-weight') {
      if (height && weight) {
        const answer = `Altura: ${height}cm, Peso: ${weight}kg`;
        addAnswer(title, answer);
        onAnswer(answer);
        setIsAnswered(true);
        onValid();
        if (autoAdvance) {
          setTimeout(() => {
            onNext();
            nextPage();
          }, 600);
        }
      }
    } else if (inputValue.trim()) {
      addAnswer(title, inputValue);
      onAnswer(inputValue);
      setIsAnswered(true);
      onValid();
      if (autoAdvance) {
        setTimeout(() => {
          onNext();
          nextPage();
        }, 600);
      }
    }
  };
  const handleContinue = () => {
    onSelect();
    if (multipleChoice && selectedOptions.length > 0) {
      addAnswer(title, selectedOptions);
      onAnswer(selectedOptions);
      onValid();
      onNext();
      nextPage();
    } else if (!multipleChoice && selectedOptions.length > 0) {
      // Handle single-choice when autoAdvance is disabled
      addAnswer(title, selectedOptions[0]);
      onAnswer(selectedOptions[0]);
      onValid();
      onNext();
      nextPage();
    } else if (inputType === 'height-weight' && height && weight) {
      const answer = `Altura: ${height}cm, Peso: ${weight}kg`;
      addAnswer(title, answer);
      onAnswer(answer);
      onValid();
      onNext();
      nextPage();
    } else if (inputValue.trim()) {
      handleInputSubmit();
      if (!autoAdvance) {
        onNext();
        nextPage();
      }
    } else {
      onInvalid();
    }
  };
  const canContinue = multipleChoice ? selectedOptions.length > 0 : inputType ? inputType === 'height-weight' ? height && weight : inputValue.trim() : selectedOptions.length > 0;
  return <div className="animate-betterme-page-enter space-y-4">
      {/* BetterMe Question Header */}
      <div className="text-center space-y-2 mb-4">
        <h2 className="betterme-question-title">
          {title}
        </h2>
        {displaySubtitle}
      </div>

      {/* BetterMe Hero Image */}
      {heroImage && <div className="betterme-hero-container mb-3">
          <SmartImage src={heroImage} alt="Hero illustration" currentPage={currentPage} priority="critical" skeletonType="card" className="w-full h-full object-cover" />
        </div>}

      {/* BetterMe Option Cards */}
      {options.length > 0 && <div className={`betterme-options${gridColumns === 2 ? ' betterme-grid-2' : gridColumns === 3 ? ' betterme-grid-3' : ''}`}>
          {options.map((option, index) => {
        const isSelected = selectedOptions.includes(option.id);
        const isAnimating = animatingCard === option.id;
        return <div key={option.id} className={`
                  betterme-option-card
                  ${isSelected ? 'selected' : ''}
                  ${options[0]?.image ? 'border-0 p-0 overflow-hidden' : ''}
                  ${isAnimating ? 'animate-betterme-select' : ''}
                  ${option.fullWidth ? 'col-span-2' : ''}
                `} style={options[0]?.image ? {
          background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-dark)))',
          animationDelay: `${index * 80}ms`
        } : {
          animationDelay: `${index * 50}ms`
        }} onClick={e => handleOptionSelect(option.id, e)} onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOptionSelect(option.id);
          }
        }} tabIndex={0} role="button" aria-pressed={isSelected}>
                {option.image ? <div className="aspect-[4/5] relative">
                    <SmartImage src={option.image} alt={option.text} currentPage={currentPage} priority="critical" skeletonType="body" className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-3">
                      <p className="text-center font-bold text-gray-800">
                        {option.text}
                      </p>
                    </div>
                    {isSelected && <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg animate-betterme-confirm">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>}
                  </div> : <div className="flex items-center w-full relative">
                    {/* BetterMe Icon Container - Left Side */}
                    {option.icon && <div className="professional-icon-container">
                        {option.icon}
                      </div>}
                    
                    {/* BetterMe Text Content */}
                    <div className="flex-1 ml-3">
                      <div className="betterme-option-text">
                        {option.text}
                      </div>
                    </div>
                  </div>}
              </div>;
      })}
        </div>}

      {/* BetterMe Input Fields */}
      {inputType && <div className="mb-6">
          {inputType === 'height-weight' ? <div className="max-w-sm mx-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="height" className="text-sm font-medium text-muted-foreground">
                    Altura
                  </Label>
                  <div className="bg-white border-2 border-border rounded-xl p-4 focus-within:border-primary transition-colors">
                    <Input id="height" type="number" placeholder="165" value={height} onChange={e => setHeight(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleInputSubmit()} className="text-center text-2xl font-bold border-0 focus:outline-none focus:ring-0 bg-transparent" />
                    <p className="text-center text-sm text-muted-foreground mt-1">cm</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="weight" className="text-sm font-medium text-muted-foreground">
                    Peso
                  </Label>
                  <div className="bg-white border-2 border-border rounded-xl p-4 focus-within:border-primary transition-colors">
                    <Input id="weight" type="number" placeholder="70" value={weight} onChange={e => setWeight(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleInputSubmit()} className="text-center text-2xl font-bold border-0 focus:outline-none focus:ring-0 bg-transparent" />
                    <p className="text-center text-sm text-muted-foreground mt-1">kg</p>
                  </div>
                </div>
              </div>
            </div> : <div className="max-w-xs mx-auto space-y-3">
              <div className="bg-white border-2 border-border rounded-xl p-5 focus-within:border-primary transition-colors">
                <Input type={inputType} placeholder={placeholder} value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleInputSubmit()} className="text-center text-xl font-medium border-0 focus:outline-none focus:ring-0 bg-transparent placeholder:text-muted-foreground" autoFocus />
              </div>
            </div>}
        </div>}

      {/* BetterMe Continue Button */}
      {showContinueButton && !autoAdvance}

      {/* Skip Link */}
      {showSkipLink && <button onClick={() => {
      onNext();
      nextPage();
    }} className="text-sm text-gray-600 mt-3 text-center block mx-auto hover:text-gray-800 transition-colors">
          PULAR ESTA PERGUNTA
        </button>}

      {/* Success Feedback */}
      {isAnswered && <div className="text-center text-sm text-primary font-medium mt-6 animate-betterme-confirm">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span>Resposta registrada</span>
          </div>
        </div>}
    </div>;
};