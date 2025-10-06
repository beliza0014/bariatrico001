import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';

interface AnalysisLoadingBarProps {
  onComplete: () => void;
}

export const AnalysisLoadingBar: React.FC<AnalysisLoadingBarProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 3000; // 3 seconds
    const intervalTime = 50; // Update every 50ms for smooth animation
    const increment = (100 / duration) * intervalTime;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 200); // Small delay before completing
          return 100;
        }
        return newProgress;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <ProfessionalQuizLayout showProgress={false}>
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="text-center space-y-8">
            {/* Loading text */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              Analisando suas respostas...
            </h1>
            
            {/* Progress bar */}
            <div className="w-full max-w-md mx-auto space-y-4">
              <Progress 
                value={progress} 
                className="h-3 bg-gray-200"
              />
              <p className="text-lg text-gray-600">
                {Math.round(progress)}%
              </p>
            </div>

            {/* Optional loading dots animation */}
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </ProfessionalQuizLayout>
  );
};