import React from 'react';
import { Lightbulb, Target, Clock, Heart } from 'lucide-react';

interface PersonalizedInsightsProps {
  barriers: string[];
  waterIntake: string;
  routine: string;
  fruitPreferences: string[];
  userName: string;
  persona: string;
}

export const PersonalizedInsights: React.FC<PersonalizedInsightsProps> = ({
  barriers,
  waterIntake,
  routine,
  fruitPreferences,
  userName,
  persona
}) => {
  const getPersonalizedInsights = () => {
    const insights = [];
    
    // Insight baseado na barreira principal
    if (barriers.includes('falta_tempo')) {
      insights.push({
        icon: Clock,
        text: "Seu ritual foi otimizado para levar apenas 3 minutos - perfeito para rotinas corridas.",
        color: "text-blue-600"
      });
    }
    
    if (barriers.includes('ansiedade')) {
      insights.push({
        icon: Heart,
        text: "Incluímos ingredientes calmantes que ajudam a reduzir ansiedade naturalmente.",
        color: "text-emerald-600"
      });
    }
    
    // Insight baseado na hidratação
    if (waterIntake === '0_2_copos' || waterIntake === '3_4_copos') {
      insights.push({
        icon: Target,
        text: "Começar com chás é perfeito - vai aumentar sua hidratação gradualmente.",
        color: "text-emerald-600"
      });
    }
    
    // Insight baseado nas frutas preferidas
    if (fruitPreferences.includes('limao') || fruitPreferences.includes('laranja')) {
      insights.push({
        icon: Lightbulb,
        text: "Suas frutas cítricas preferidas aceleram o metabolismo pela manhã!",
        color: "text-orange-600"
      });
    }
    
    return insights;
  };

  const insights = getPersonalizedInsights();

  if (insights.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-foreground mb-3">
        💡 Insights personalizados para você:
      </h3>
      
      <div className="space-y-3">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div key={index} className="flex items-start gap-3">
              <Icon className={`w-5 h-5 mt-0.5 ${insight.color}`} />
              <p className="text-foreground text-sm">{insight.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};