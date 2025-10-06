import React from 'react';
import { Button } from '@/components/ui/button';

interface QuestionPopupProps {
  question: string;
  onAnswer: (answer: 'yes' | 'no') => void;
  isOpen: boolean;
}

export const QuestionPopup: React.FC<QuestionPopupProps> = ({
  question,
  onAnswer,
  isOpen
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay escuro */}
      <div 
        className="fixed inset-0 bg-black/60 z-40 animate-fade-in"
        onClick={() => onAnswer('no')}
      />
      
      {/* Modal centralizado */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6 animate-scale-in pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Pergunta */}
          <h3 className="text-xl font-bold text-foreground text-center leading-tight">
            {question}
          </h3>
          
          {/* Botões de resposta */}
          <div className="flex gap-3">
            {/* Botão Não - Branco à esquerda */}
            <Button
              onClick={() => onAnswer('no')}
              variant="outline"
              size="lg"
              className="flex-1 bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 font-semibold"
            >
              Não
            </Button>
            
            {/* Botão Sim - Verde à direita */}
            <Button
              onClick={() => onAnswer('yes')}
              size="lg"
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold border-0"
            >
              Sim
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
