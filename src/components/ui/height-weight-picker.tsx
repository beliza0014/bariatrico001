import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
interface HeightWeightPickerProps {
  height: number;
  weight: number;
  onHeightChange: (height: number) => void;
  onWeightChange: (weight: number) => void;
  className?: string;
}
export const HeightWeightPicker: React.FC<HeightWeightPickerProps> = ({
  height,
  weight,
  onHeightChange,
  onWeightChange,
  className
}) => {
  const heightScrollRef = useRef<HTMLDivElement>(null);
  const weightScrollRef = useRef<HTMLDivElement>(null);

  // Generate height options (130-210cm)
  const heightOptions = [];
  for (let i = 130; i <= 210; i++) {
    heightOptions.push(i);
  }

  // Generate weight options (30-150kg)
  const weightOptions = [];
  for (let i = 30; i <= 150; i++) {
    weightOptions.push(i);
  }
  const [heightIndex, setHeightIndex] = useState(heightOptions.indexOf(height) !== -1 ? heightOptions.indexOf(height) : 20);
  const [weightIndex, setWeightIndex] = useState(weightOptions.indexOf(weight) !== -1 ? weightOptions.indexOf(weight) : 40);

  // Handle height scroll
  const handleHeightScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const itemWidth = 30;
    const scrollLeft = element.scrollLeft;
    const newIndex = Math.round(scrollLeft / itemWidth);
    if (newIndex !== heightIndex && newIndex >= 0 && newIndex < heightOptions.length) {
      setHeightIndex(newIndex);
      onHeightChange(heightOptions[newIndex]);
    }
  };

  // Handle weight scroll
  const handleWeightScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const itemWidth = 30;
    const scrollLeft = element.scrollLeft;
    const newIndex = Math.round(scrollLeft / itemWidth);
    if (newIndex !== weightIndex && newIndex >= 0 && newIndex < weightOptions.length) {
      setWeightIndex(newIndex);
      onWeightChange(weightOptions[newIndex]);
    }
  };

  // Initialize scroll positions
  useEffect(() => {
    if (heightScrollRef.current) {
      const itemWidth = 30;
      heightScrollRef.current.scrollLeft = heightIndex * itemWidth;
    }
  }, []);
  useEffect(() => {
    if (weightScrollRef.current) {
      const itemWidth = 30;
      weightScrollRef.current.scrollLeft = weightIndex * itemWidth;
    }
  }, []);
  return <div className={cn("space-y-3", className)}>
      {/* Height Picker */}
      <div className="bg-gradient-to-br from-white via-emerald-50/30 to-emerald-50/50 rounded-xl border border-emerald-200/60 p-3 shadow-lg shadow-emerald-100/50">
        <div className="text-center mb-2">
          <h3 className="text-sm font-bold text-slate-800 mb-2 tracking-tight">
            Selecione sua altura 📏
          </h3>
          
          <div className="flex items-center justify-center gap-1 mb-2">
            <button className="px-2 py-1 bg-gradient-to-r from-emerald-600 via-emerald-600 to-emerald-700 text-white rounded-full text-xs font-semibold shadow-md shadow-emerald-200">
              cm
            </button>
            
          </div>
          
          <div className="bg-gradient-to-br from-emerald-600 via-emerald-600 to-emerald-700 rounded-lg p-2 shadow-lg shadow-emerald-200/60">
            <div className="text-2xl font-black text-white tracking-tight drop-shadow-sm">
              {heightOptions[heightIndex]}
              <span className="text-sm text-emerald-100 ml-1 font-medium">cm</span>
            </div>
          </div>
        </div>

        <div className="relative bg-gradient-to-r from-emerald-50 via-emerald-50 to-emerald-50 rounded-lg p-2 border border-emerald-100">
          <div ref={heightScrollRef} className="flex overflow-x-auto scrollbar-hide py-3" onScroll={handleHeightScroll} style={{
          scrollSnapType: 'x mandatory'
        }}>
            <div className="w-24 flex-shrink-0" />
            
            {heightOptions.map((option, index) => <div key={option} className="flex flex-col items-center flex-shrink-0 cursor-pointer group" style={{
            width: '28px',
            scrollSnapAlign: 'center'
          }} onClick={() => {
            setHeightIndex(index);
            onHeightChange(option);
            if (heightScrollRef.current) {
              heightScrollRef.current.scrollTo({
                left: index * 28,
                behavior: 'smooth'
              });
            }
          }}>
                <div className={cn("transition-all duration-300 group-hover:bg-emerald-400", index === heightIndex ? "bg-gradient-to-t from-emerald-600 to-emerald-500 shadow-md shadow-emerald-200" : "bg-emerald-200/60", option % 10 === 0 ? "w-1 h-5 rounded-sm" : option % 5 === 0 ? "w-0.5 h-3 rounded-sm" : "w-0.5 h-2 rounded-sm")} />
                
                {option % 10 === 0 && <span className={cn("text-xs mt-1 font-bold transition-colors duration-200", index === heightIndex ? "text-emerald-700" : "text-slate-600")}>
                    {option}
                  </span>}
              </div>)}
            
            <div className="w-24 flex-shrink-0" />
          </div>
          
          <div className="absolute top-2 left-1/2 w-1 h-10 bg-gradient-to-b from-emerald-600 to-emerald-600 transform -translate-x-1/2 rounded-full z-10 shadow-lg shadow-emerald-300" />
        </div>
        
        <p className="text-center text-slate-600 mt-2 font-extrabold text-base">
          Arraste para selecionar sua altura
        </p>
      </div>

      {/* Weight Picker */}
      <div className="bg-gradient-to-br from-white via-emerald-50/30 to-emerald-50/50 rounded-xl border border-emerald-200/60 p-3 shadow-lg shadow-emerald-100/50">
        <div className="text-center mb-2">
          <h3 className="text-sm font-bold text-slate-800 mb-2 tracking-tight">
            Selecione seu peso ⚖️
          </h3>
          
          <div className="flex items-center justify-center gap-1 mb-2">
            <button className="px-2 py-1 bg-gradient-to-r from-emerald-600 via-emerald-600 to-emerald-700 text-white rounded-full text-xs font-semibold shadow-md shadow-emerald-200">
              kg
            </button>
            
          </div>
          
          <div className="bg-gradient-to-br from-emerald-600 via-emerald-600 to-emerald-700 rounded-lg p-2 shadow-lg shadow-emerald-200/60">
            <div className="text-2xl font-black text-white tracking-tight drop-shadow-sm">
              {weightOptions[weightIndex]}
              <span className="text-sm text-emerald-100 ml-1 font-medium">kg</span>
            </div>
          </div>
        </div>

        <div className="relative bg-gradient-to-r from-emerald-50 via-emerald-50 to-emerald-50 rounded-lg p-2 border border-emerald-100">
          <div ref={weightScrollRef} className="flex overflow-x-auto scrollbar-hide py-3" onScroll={handleWeightScroll} style={{
          scrollSnapType: 'x mandatory'
        }}>
            <div className="w-24 flex-shrink-0" />
            
            {weightOptions.map((option, index) => <div key={option} className="flex flex-col items-center flex-shrink-0 cursor-pointer group" style={{
            width: '28px',
            scrollSnapAlign: 'center'
          }} onClick={() => {
            setWeightIndex(index);
            onWeightChange(option);
            if (weightScrollRef.current) {
              weightScrollRef.current.scrollTo({
                left: index * 28,
                behavior: 'smooth'
              });
            }
          }}>
                <div className={cn("transition-all duration-300 group-hover:bg-emerald-400", index === weightIndex ? "bg-gradient-to-t from-emerald-600 to-emerald-500 shadow-md shadow-emerald-200" : "bg-emerald-200/60", option % 10 === 0 ? "w-1 h-5 rounded-sm" : option % 5 === 0 ? "w-0.5 h-3 rounded-sm" : "w-0.5 h-2 rounded-sm")} />
                
                {option % 10 === 0 && <span className={cn("text-xs mt-1 font-bold transition-colors duration-200", index === weightIndex ? "text-emerald-700" : "text-slate-600")}>
                    {option}
                  </span>}
              </div>)}
            
            <div className="w-24 flex-shrink-0" />
          </div>
          
          <div className="absolute top-2 left-1/2 w-1 h-10 bg-gradient-to-b from-emerald-600 to-emerald-600 transform -translate-x-1/2 rounded-full z-10 shadow-lg shadow-emerald-300" />
        </div>
        
        <p className="text-center text-slate-600 mt-2 text-base font-extrabold">
          Arraste para selecionar seu peso
        </p>
      </div>
    </div>;
};