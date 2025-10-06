import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScrollWheelPickerProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  variant?: 'default' | 'scale';
  className?: string;
}

export const ScrollWheelPicker: React.FC<ScrollWheelPickerProps> = ({
  min,
  max,
  step,
  value,
  onChange,
  variant = 'default',
  className,
}) => {
  const [internalIndex, setInternalIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Gerar lista de opções
  const options = [];
  for (let i = min; i <= max; i += step) {
    options.push(i);
  }

  // Encontrar índice atual baseado no valor
  useEffect(() => {
    const index = options.findIndex(option => Math.abs(option - value) < 0.01);
    if (index !== -1 && index !== internalIndex) {
      setInternalIndex(index);
    }
  }, [value, options.length]);

  // Atualizar valor quando índice muda
  useEffect(() => {
    const newValue = options[internalIndex];
    if (newValue !== undefined && Math.abs(newValue - value) > 0.01) {
      onChange(newValue);
    }
  }, [internalIndex, options, onChange, value]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const itemHeight = 48; // altura de cada item
    const scrollTop = element.scrollTop;
    const newIndex = Math.round(scrollTop / itemHeight);
    
    if (newIndex !== internalIndex && newIndex >= 0 && newIndex < options.length) {
      setInternalIndex(newIndex);
    }
  };

  const nudge = (delta: number) => {
    const newIndex = Math.max(0, Math.min(options.length - 1, internalIndex + delta));
    setInternalIndex(newIndex);
    
    // Scroll suave para o novo item
    if (scrollRef.current) {
      const itemHeight = 48;
      scrollRef.current.scrollTo({
        top: newIndex * itemHeight,
        behavior: 'smooth'
      });
    }
  };

  // Scroll para posição correta quando o componente monta ou índice muda
  useEffect(() => {
    if (scrollRef.current) {
      const itemHeight = 48;
      const targetScrollTop = internalIndex * itemHeight;
      // Só move se a diferença for significativa
      if (Math.abs(scrollRef.current.scrollTop - targetScrollTop) > itemHeight / 2) {
        scrollRef.current.scrollTop = targetScrollTop;
      }
    }
  }, [internalIndex]);

  const selectedValue = options[internalIndex] || min;

  return (
    <div className={cn("flex flex-col items-center space-y-2", className)}>
      {variant === 'scale' && (
        <div className="text-center mb-2">
          <div className="text-3xl font-bold text-primary">
            {selectedValue.toFixed(1)}kg
          </div>
          <div className="text-sm text-muted-foreground">Meta de perda</div>
        </div>
      )}

      <div className="relative">
        {/* Botão para cima */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10 bg-background/80 backdrop-blur-sm"
          onClick={() => nudge(-1)}
          disabled={internalIndex === 0}
        >
          <ChevronUp className="w-4 h-4" />
        </Button>

        {/* Lista de opções */}
        <div
          ref={scrollRef}
          className="h-48 w-24 overflow-y-auto scrollbar-hide relative"
          onScroll={handleScroll}
          style={{
            scrollSnapType: 'y mandatory',
          }}
        >
          {/* Padding superior para centralizar */}
          <div className="h-24" />
          
          {options.map((option, index) => (
            <div
              key={option}
              className={cn(
                "h-12 flex items-center justify-center transition-all duration-200",
                "cursor-pointer",
                index === internalIndex
                  ? "text-primary font-bold text-lg transform scale-110"
                  : "text-muted-foreground text-sm",
                Math.abs(index - internalIndex) === 1
                  ? "text-foreground/80 text-base"
                  : "",
                Math.abs(index - internalIndex) > 1
                  ? "opacity-40"
                  : ""
              )}
              style={{
                scrollSnapAlign: 'center',
              }}
              onClick={() => {
                setInternalIndex(index);
                if (scrollRef.current) {
                  const itemHeight = 48;
                  scrollRef.current.scrollTo({
                    top: index * itemHeight,
                    behavior: 'smooth'
                  });
                }
              }}
            >
              {option.toFixed(1)}
            </div>
          ))}
          
          {/* Padding inferior para centralizar */}
          <div className="h-24" />
        </div>

        {/* Botão para baixo */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 z-10 bg-background/80 backdrop-blur-sm"
          onClick={() => nudge(1)}
          disabled={internalIndex === options.length - 1}
        >
          <ChevronDown className="w-4 h-4" />
        </Button>

        {/* Indicador central */}
        <div className="absolute top-1/2 left-0 right-0 h-12 border-t-2 border-b-2 border-primary/20 pointer-events-none transform -translate-y-1/2" />
      </div>
    </div>
  );
};