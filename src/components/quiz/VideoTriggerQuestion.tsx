import React from 'react';
import { Card } from '@/components/ui/card';

interface VideoTriggerQuestionProps {
  question: string;
  option1: string;
  option2: string;
  icon1?: string;
  icon2?: string;
  onOptionClick: () => void;
}

export const VideoTriggerQuestion: React.FC<VideoTriggerQuestionProps> = ({
  question,
  option1,
  option2,
  icon1 = "💡",
  icon2 = "📱",
  onOptionClick
}) => {
  return (
    <div className="animate-fade-in space-y-8">
      {/* Question Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
          {question}
        </h2>
      </div>

      {/* Options - Layout 2x1 como nas imagens */}
      <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
        {/* Option 1 */}
        <div
          className="flex flex-col items-center p-8 rounded-2xl border-2 cursor-pointer transition-all duration-200 border-[#22c55e] bg-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2"
          onClick={onOptionClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOptionClick();
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={option1}
        >
          {/* Icon */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center mb-4 shadow-lg">
            <span className="text-4xl">{icon1}</span>
          </div>
          
          {/* Texto */}
          <span className="font-semibold text-[#374151] text-xl text-center">
            {option1}
          </span>
        </div>

        {/* Option 2 */}
        <div
          className="flex flex-col items-center p-8 rounded-2xl border-2 cursor-pointer transition-all duration-200 border-[#22c55e] bg-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2"
          onClick={onOptionClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOptionClick();
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={option2}
        >
          {/* Icon */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#ec4899] to-[#db2777] flex items-center justify-center mb-4 shadow-lg">
            <span className="text-4xl">{icon2}</span>
          </div>
          
          {/* Texto */}
          <span className="font-semibold text-[#374151] text-xl text-center">
            {option2}
          </span>
        </div>
      </div>
    </div>
  );
};