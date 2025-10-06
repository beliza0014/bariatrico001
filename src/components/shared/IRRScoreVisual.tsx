import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface IRRScoreVisualProps {
  score: number;
  waterScore: number;
  budgetScore: number; 
  routineScore: number;
  waterLabel: string;
  hasFlexibleRoutine: boolean;
  hasNoBudgetBarrier: boolean;
}

export const IRRScoreVisual: React.FC<IRRScoreVisualProps> = ({
  score,
  waterScore,
  budgetScore,
  routineScore,
  waterLabel,
  hasFlexibleRoutine,
  hasNoBudgetBarrier
}) => {
  const criteria = [
    {
      icon: hasNoBudgetBarrier ? CheckCircle : XCircle,
      label: 'Orçamento',
      description: hasNoBudgetBarrier ? 'Sem restrições financeiras' : 'Orçamento é uma barreira',
      points: budgetScore,
      color: hasNoBudgetBarrier ? 'text-emerald-600' : 'text-red-500'
    },
    {
      icon: hasFlexibleRoutine ? CheckCircle : Clock,
      label: 'Rotina',
      description: hasFlexibleRoutine ? 'Tem tempo livre' : 'Rotina mais corrida',
      points: routineScore,
      color: hasFlexibleRoutine ? 'text-emerald-600' : 'text-amber-500'
    },
    {
      icon: waterScore > 0 ? CheckCircle : XCircle,
      label: 'Hidratação',
      description: `Bebe ${waterLabel}`,
      points: waterScore,
      color: waterScore > 0 ? 'text-emerald-600' : 'text-red-500'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border border-gray-200 p-5">
      <h3 className="text-base font-semibold text-foreground mb-3 text-center">
        Como seu índice foi calculado
      </h3>
      
      <div className="space-y-2 mb-4">
        {criteria.map((criterion, index) => {
          const Icon = criterion.icon;
          return (
            <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
              <Icon className={`w-4 h-4 ${criterion.color}`} />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-foreground">{criterion.label}</div>
                <div className="text-xs text-muted-foreground truncate">{criterion.description}</div>
              </div>
              <div className="text-sm font-bold text-emerald-600">
                +{criterion.points}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="text-center pt-3 border-t border-gray-200">
        <div className="text-lg font-bold text-emerald-600 mb-1">
          Total: {score}/10
        </div>
        <div className="text-xs text-muted-foreground leading-relaxed">
          {score >= 8 ? 'Base excelente para resultados rápidos' :
           score >= 6 ? 'Boa base, pequenos ajustes trarão grandes resultados' :
           score >= 4 ? 'Base sólida, vamos otimizar alguns pontos' :
           'Vamos construir uma base forte juntas'}
        </div>
      </div>
    </div>
  );
};