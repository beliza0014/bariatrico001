import React from 'react';
import { Button } from './button';
import { ChevronRight, Shield, Check, Lock, Settings } from 'lucide-react';

interface EnhancedCTACardProps {
  onClickAction: () => void;
  disabled?: boolean;
  isProcessing?: boolean;
}

export const EnhancedCTACard: React.FC<EnhancedCTACardProps> = ({
  onClickAction,
  disabled = false,
  isProcessing = false
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Call the parent's tracking and redirect handler
    onClickAction();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 mb-6">
        <div className="bg-emerald-500 text-white py-4 px-6 text-center">
          <h3 className="text-xl font-bold">Plano Personalizado Gerado com Sucesso</h3>
        </div>
        
        <div className="bg-white p-6">
          <div className="flex flex-col items-center justify-center mb-4">
            <div className="text-center">
              <div className="text-lg text-gray-500 mb-1">
                de <span className="line-through">R$ 97,90</span> por
              </div>
              <div className="text-4xl font-bold text-emerald-600">R$ 37,90</div>
              <div className="text-sm mt-2">
                <span className="text-gray-900">ou </span>
                <span className="text-emerald-600 font-semibold">8x de R$ 4,73</span>
                <span className="text-gray-900"> no cartão</span>
              </div>
            </div>
          </div>
          
          <Button
            onClick={handleClick}
            disabled={disabled}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-5 text-lg rounded-xl transition-colors"
          >
            PEGAR MEU PLANO
          </Button>
          
          <div className="text-center mt-3">
            <p className="text-gray-900 font-bold text-base">ACESSO IMEDIATO</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
            <Check className="w-3 h-3 text-gray-600" />
          </div>
          <div className="text-center">
            <div className="font-semibold text-[10px] leading-none">COMPRA</div>
            <div className="font-semibold text-[10px] leading-none">SEGURA</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
            <Settings className="w-3 h-3 text-gray-600" />
          </div>
          <div className="text-center">
            <div className="font-semibold text-[10px] leading-none">SATISFAÇÃO</div>
            <div className="font-semibold text-[10px] leading-none">GARANTIDA</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
            <Lock className="w-3 h-3 text-gray-600" />
          </div>
          <div className="text-center">
            <div className="font-semibold text-[10px] leading-none">PRIVACIDADE</div>
            <div className="font-semibold text-[10px] leading-none">PROTEGIDA</div>
          </div>
        </div>
      </div>
    </div>
  );
};
