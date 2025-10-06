import React from 'react';

interface QuizProgressBarsProps {
  currentPage: number;
}

export const QuizProgressBars: React.FC<QuizProgressBarsProps> = ({ currentPage }) => {
  // Don't show progress bars on page 1 (landing page)
  if (currentPage <= 1) return null;

  // Define quiz sections
  // Section 1: Pages 2-7 (Basic info & demographics)
  // Section 2: Pages 8-13 (Body analysis & challenges)  
  // Section 3: Pages 14-19 (Solutions & preferences)
  // Section 4: Pages 20-25 (Final analysis & checkout)
  
  const getSectionProgress = (section: number): number => {
    switch (section) {
      case 1: // Pages 2-7
        if (currentPage < 2) return 0;
        if (currentPage >= 8) return 100;
        return Math.min(100, ((currentPage - 1) / 6) * 100);
      
      case 2: // Pages 8-13
        if (currentPage < 8) return 0;
        if (currentPage >= 14) return 100;
        return Math.min(100, ((currentPage - 7) / 6) * 100);
      
      case 3: // Pages 14-19
        if (currentPage < 14) return 0;
        if (currentPage >= 20) return 100;
        return Math.min(100, ((currentPage - 13) / 6) * 100);
      
      case 4: // Pages 20-25
        if (currentPage < 20) return 0;
        return Math.min(100, ((currentPage - 19) / 6) * 100);
      
      default:
        return 0;
    }
  };

  const shouldShowSection = (section: number): boolean => {
    switch (section) {
      case 1:
        return currentPage >= 2;
      case 2:
        return currentPage >= 8;
      case 3:
        return currentPage >= 14;
      case 4:
        return currentPage >= 20;
      default:
        return false;
    }
  };

  const visibleSections = [1, 2, 3, 4].filter(shouldShowSection);

  return (
    <div className="w-full px-6 py-3 bg-background">
      <div className="flex gap-3 max-w-md mx-auto">
        {visibleSections.map((section) => {
          const progress = getSectionProgress(section);
          return (
            <div key={section} className="flex-1">
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-700 ease-out transform origin-left"
                  style={{ 
                    width: `${progress}%`,
                    boxShadow: progress > 0 ? '0 0 8px rgba(0, 0, 0, 0.3)' : 'none'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};