import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Star, Trophy } from 'lucide-react';

interface TimelineEvent {
  day: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface PersonalizedTimelineProps {
  irrScore: number;
  mainBarrier: string;
  goalPrimary: string;
  userName: string;
}

export const PersonalizedTimeline: React.FC<PersonalizedTimelineProps> = ({
  irrScore,
  mainBarrier,
  goalPrimary,
  userName
}) => {
  const getPersonalizedTimeline = (): TimelineEvent[] => {
    const baseTimeline: TimelineEvent[] = [
      {
        day: "Dias 1-3",
        title: "Adaptação suave",
        description: "Corpo se acostuma com o novo ritual",
        icon: Calendar,
        color: "text-blue-600"
      }
    ];

    // Timeline personalizada por score IRR
    if (irrScore >= 8) {
      baseTimeline.push(
        {
          day: "Dias 4-7", 
          title: "Primeiros sinais",
          description: "Menos inchaço ao acordar, mais disposição",
          icon: TrendingUp,
          color: "text-emerald-600"
        },
        {
          day: "Dias 8-15",
          title: "Resultados visíveis", 
          description: "Roupas mais folgadas, digestão melhor",
          icon: Star,
          color: "text-emerald-600"
        },
        {
          day: "Dias 16-28",
          title: "Transformação consolidada",
          description: "Hábito formado, resultados consistentes",
          icon: Trophy,
          color: "text-amber-600"
        }
      );
    } else if (irrScore >= 6) {
      baseTimeline.push(
        {
          day: "Dias 4-10",
          title: "Primeiros benefícios",
          description: "Mais energia, menos vontade de doces",
          icon: TrendingUp, 
          color: "text-emerald-600"
        },
        {
          day: "Dias 11-21",
          title: "Progresso acelerado",
          description: "Mudanças na balança, roupas mais soltas",
          icon: Star,
          color: "text-emerald-600"
        },
        {
          day: "Dias 22-35",
          title: "Novo patamar",
          description: "Hábito consolidado, transformação visível",
          icon: Trophy,
          color: "text-amber-600"
        }
      );
    } else {
      baseTimeline.push(
        {
          day: "Dias 4-14",
          title: "Construindo base",
          description: "Consistência crescente, primeiros benefícios",
          icon: TrendingUp,
          color: "text-emerald-600" 
        },
        {
          day: "Dias 15-28",
          title: "Momentum crescente",
          description: "Resultados começam a aparecer",
          icon: Star,
          color: "text-emerald-600"
        },
        {
          day: "Dias 29-42",
          title: "Transformação sólida", 
          description: "Mudança de hábitos, resultados sustentáveis",
          icon: Trophy,
          color: "text-amber-600"
        }
      );
    }

    // Personalização por barreira
    if (mainBarrier === 'falta_tempo') {
      baseTimeline[1].description += " (só 3 min/dia!)";
    } else if (mainBarrier === 'ansiedade') {
      baseTimeline[1].description += ", menos ansiedade";
    } else if (mainBarrier === 'falta_constancia') {
      baseTimeline[2].description += " - constância automática";
    }

    return baseTimeline;
  };

  const timeline = getPersonalizedTimeline();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Rotação automática a cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % timeline.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [timeline.length]);

  const currentEvent = timeline[currentIndex];
  const Icon = currentEvent.icon;

  return (
    <div className="bg-white rounded-lg border border-border p-4">
      <h3 className="text-lg font-semibold text-foreground mb-3 text-center">
        Sua jornada personalizada de transformação
      </h3>
      
      {/* Item único com animação */}
      <div className="relative h-20 overflow-hidden">
        <div 
          key={currentIndex}
          className="absolute inset-0 animate-fade-in flex items-start gap-3"
        >
          <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-white border-2 flex items-center justify-center ${currentEvent.color.replace('text-', 'border-')}`}>
            <Icon className={`w-4 h-4 ${currentEvent.color}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-primary">{currentEvent.day}</span>
            </div>
            <h4 className="font-semibold text-foreground mb-1 text-sm">{currentEvent.title}</h4>
            <p className="text-xs text-muted-foreground leading-tight">{currentEvent.description}</p>
          </div>
        </div>
      </div>

      {/* Indicadores de progresso */}
      <div className="flex justify-center gap-2 mt-3 mb-3">
        {timeline.map((_, index) => (
          <div 
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-primary scale-125' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      <div className="p-3 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg">
        <p className="text-xs text-center text-foreground">
          <strong>Baseado no seu perfil:</strong> {irrScore >= 8 ? 'Resultados rápidos esperados' : irrScore >= 6 ? 'Progresso consistente garantido' : 'Transformação gradual e sustentável'}
        </p>
      </div>
    </div>
  );
};