import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
interface InteractiveBMIChartProps {
  initialHeight: number;
  initialWeight: number;
  onBMIChange?: (bmi: number, height: number, weight: number) => void;
  className?: string;
}
export const InteractiveBMIChart: React.FC<InteractiveBMIChartProps> = ({
  initialHeight,
  initialWeight,
  onBMIChange,
  className
}) => {
  const [height, setHeight] = useState(initialHeight);
  const [weight, setWeight] = useState(initialWeight);
  const [heightUnit, setHeightUnit] = useState<'cm' | 'm'>('cm');

  // Calculate BMI
  const calculateBMI = (weightKg: number, heightCm: number) => {
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
  };
  const bmi = calculateBMI(weight, height);

  // Get BMI position on the scale (0-100%)
  const getBMIPosition = (bmiValue: number) => {
    if (bmiValue < 18.5) return Math.max(0, bmiValue / 18.5 * 25);
    if (bmiValue < 25) return 25 + (bmiValue - 18.5) / (25 - 18.5) * 35;
    if (bmiValue < 30) return 60 + (bmiValue - 25) / (30 - 25) * 25;
    return Math.min(100, 85 + (bmiValue - 30) / 10 * 15);
  };
  const getBMICategory = (bmiValue: number) => {
    if (bmiValue < 18.5) return {
      category: 'Abaixo do peso',
      color: 'text-blue-600'
    };
    if (bmiValue < 25) return {
      category: 'Peso normal',
      color: 'text-green-600'
    };
    if (bmiValue < 30) return {
      category: 'Sobrepeso',
      color: 'text-yellow-600'
    };
    if (bmiValue < 35) return {
      category: 'Obesidade grau I',
      color: 'text-orange-600'
    };
    if (bmiValue < 40) return {
      category: 'Obesidade grau II',
      color: 'text-red-600'
    };
    return {
      category: 'Obesidade grau III',
      color: 'text-red-800'
    };
  };
  const bmiData = getBMICategory(bmi);
  const position = getBMIPosition(bmi);

  // Notify parent component when BMI changes
  useEffect(() => {
    onBMIChange?.(bmi, height, weight);
  }, [bmi, height, weight, onBMIChange]);
  const handleHeightChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    if (heightUnit === 'cm') {
      setHeight(Math.max(100, Math.min(250, numValue)));
    } else {
      setHeight(Math.max(100, Math.min(250, numValue * 100)));
    }
  };
  const handleWeightChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setWeight(Math.max(30, Math.min(200, numValue)));
  };
  const displayHeight = heightUnit === 'cm' ? height : (height / 100).toFixed(2);
  return (
    <div className={cn("bg-white border rounded-2xl p-6 shadow-lg", className)}>
      {/* Compact BMI Chart */}
      <div className="relative">
        {/* Reference numbers above */}
        <div className="flex justify-between text-xs text-gray-400 mb-2 px-1">
          <span>15</span>
          <span>18.5</span>
          <span>25</span>
          <span>30</span>
          <span>40+</span>
        </div>

        {/* BMI bubble indicator */}
        <div 
          className="absolute -top-12 transform -translate-x-1/2 transition-all duration-300 ease-out z-20" 
          style={{ left: `${position}%` }}
        >
          <div className="bg-gray-800 text-white rounded-lg px-3 py-1 text-xs font-medium whitespace-nowrap shadow-lg">
            O seu • {bmi.toFixed(2)}
          </div>
          <div className="w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-gray-800 mx-auto"></div>
        </div>

        {/* Compact gradient bar */}
        <div 
          className="relative h-6 rounded-full overflow-hidden shadow-inner mb-3" 
          style={{
            background: 'linear-gradient(to right, #3b82f6 0%, #22c55e 25%, #eab308 60%, #f97316 85%, #ef4444 100%)'
          }}
        >
          {/* Division lines */}
          <div className="absolute inset-y-0 w-px bg-white/30" style={{ left: '25%' }}></div>
          <div className="absolute inset-y-0 w-px bg-white/30" style={{ left: '60%' }}></div>
          <div className="absolute inset-y-0 w-px bg-white/30" style={{ left: '85%' }}></div>
        </div>

        {/* Circular marker */}
        <div 
          className="absolute top-6 transform -translate-x-1/2 transition-all duration-300 ease-out z-10" 
          style={{ left: `${position}%` }}
        >
          <div className="w-4 h-4 bg-white border-2 border-gray-700 rounded-full shadow-md"></div>
        </div>

        {/* Compact labels below */}
        <div className="flex text-xs text-gray-600 mt-2">
          <div className="flex-[25] text-left">Abaixo do peso</div>
          <div className="flex-[35] text-center">Normal</div>
          <div className="flex-[25] text-center">Acima do peso</div>
          <div className="flex-[15] text-right">Obeso</div>
        </div>
      </div>
    </div>
  );
};