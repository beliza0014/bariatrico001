import React, { useState } from 'react';
import { CustomVideoPlayer } from '@/components/ui/CustomVideoPlayer';

interface VideoOverlayQuestionProps {
  videoSrc: string;
  question: string;
  option1: string;
  option2: string;
  icon1?: string;
  icon2?: string;
  onVideoEnd?: () => void;
  onVideoStart?: () => void;
}

export const VideoOverlayQuestion: React.FC<VideoOverlayQuestionProps> = ({
  videoSrc,
  question,
  option1,
  option2,
  icon1 = "🔊",
  icon2 = "🔇",
  onVideoEnd,
  onVideoStart
}) => {
  const [showOverlay, setShowOverlay] = useState(true);

  const handlePlayVideo = () => {
    setShowOverlay(false);
    onVideoStart?.();
  };

  const handleVideoEnd = () => {
    onVideoEnd?.();
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <CustomVideoPlayer
        src={videoSrc}
        onPlay={handlePlayVideo}
        onEnded={handleVideoEnd}
      />

      {/* Overlay de Pergunta */}
      {showOverlay && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-8 animate-fade-in z-20">
          <div className="text-center space-y-8">
            {/* Question Header */}
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              {question}
            </h2>

            {/* Options */}
            <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto">
              {/* Option 1 */}
              <button
                className="flex flex-col items-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 border-[#22c55e] bg-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2"
                onClick={handlePlayVideo}
                aria-label={option1}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center mb-3 shadow-lg">
                  <span className="text-3xl">{icon1}</span>
                </div>
                <span className="font-semibold text-[#374151] text-lg text-center">
                  {option1}
                </span>
              </button>

              {/* Option 2 */}
              <button
                className="flex flex-col items-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 border-[#22c55e] bg-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2"
                onClick={handlePlayVideo}
                aria-label={option2}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ec4899] to-[#db2777] flex items-center justify-center mb-3 shadow-lg">
                  <span className="text-3xl">{icon2}</span>
                </div>
                <span className="font-semibold text-[#374151] text-lg text-center">
                  {option2}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};