// ARCHIVED - Originally Page23BMIResults-active  
// This page has been moved to archived/ directory for future use
// Original functionality preserved for reference
// @ts-nocheck - Variables removed from active quiz flow

import React, { useEffect, useState, useRef } from 'react';
import { ProfessionalQuizLayout } from '@/components/layout/ProfessionalQuizLayout';
import { useQuiz } from '@/contexts/QuizContext';
import { useQuizStep } from '@/hooks/useQuizStep';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { InteractiveBMIChart } from '@/components/ui/interactive-bmi-chart';
import { Play, Pause, ChevronRight, TrendingUp } from 'lucide-react';
import { QuizPageProps } from '@/types/quiz';
import { SmartImage } from '@/components/ui/SmartImage';
export const Page23BMIResults: React.FC<QuizPageProps> = ({
  audio = {}
}) => {
  useQuizStep('Resultado_IMC');
  const {
    nextPage,
    userInfo,
    updateUserInfo,
    getAnswer
  } = useQuiz();
  const [playingAudio, setPlayingAudio] = useState(false);
  const [showProgression, setShowProgression] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentBMI, setCurrentBMI] = useState(userInfo.bmi || 0);

  // Imagens femininas atualizadas
  const femaleImages = {
    regular: '/lovable-uploads/c24837e6-ee61-4ba9-b6de-9a200a46762d.png',
    barriga_falsa: '/lovable-uploads/57837bef-7591-4ef9-89b1-8e47b0c1eae5.png',
    flacida: '/lovable-uploads/377a8cff-1ed1-469f-980d-ba2699a23f70.png',
    sobrepeso: '/lovable-uploads/40f7afd4-e4e2-4df2-8901-489d1700d3c4.png'
  };

  // Imagens masculinas atualizadas
  const maleImages = {
    regular: '/lovable-uploads/aa08d7c9-81fe-44ad-8062-5e5e38b1a8e4.png',
    barriga_falsa: '/lovable-uploads/c99ed6b3-d600-4bd6-984e-08ed9098fe53.png',
    flacida: '/lovable-uploads/c84ce1ee-67a3-4851-9d33-6678611717a2.png',
    sobrepeso: '/lovable-uploads/9ff653c1-6d24-4a61-be33-43ce144307ea.png'
  };

  // Get initial height and weight from userInfo, with fallbacks
  const initialHeight = userInfo.height || 165;
  const initialWeight = userInfo.weight || 70;
  const getBMICategory = (bmi: number = 23) => {
    if (bmi < 18.5) return {
      category: 'Abaixo do peso',
      color: 'text-blue-600',
      urgency: 'baixa'
    };
    if (bmi < 25) return {
      category: 'Peso normal',
      color: 'text-green-600',
      urgency: 'baixa'
    };
    if (bmi < 30) return {
      category: 'Sobrepeso',
      color: 'text-yellow-600',
      urgency: 'média'
    };
    if (bmi < 35) return {
      category: 'Obesidade grau I',
      color: 'text-orange-600',
      urgency: 'alta'
    };
    if (bmi < 40) return {
      category: 'Obesidade grau II',
      color: 'text-red-600',
      urgency: 'alta'
    };
    return {
      category: 'Obesidade grau III',
      color: 'text-red-800',
      urgency: 'muito alta'
    };
  };
  const bmiData = getBMICategory(currentBMI);
  const getBodyTypeImage = () => {
    const genderAnswer = getAnswer('Qual seu gênero?');
    const bodyTypeAnswer = getAnswer('Qual seu tipo de corpo?');
    const isUserMale = genderAnswer?.answer === 'Homem';
    const bodyType = bodyTypeAnswer?.answer;

    // Map body type selection to corresponding image
    const bodyTypeMap = {
      'Regular': isUserMale ? maleImages.regular : femaleImages.regular,
      'Barriga Falsa': isUserMale ? maleImages.barriga_falsa : femaleImages.barriga_falsa,
      'Flácida': isUserMale ? maleImages.flacida : femaleImages.flacida,
      'Sobrepeso': isUserMale ? maleImages.sobrepeso : femaleImages.sobrepeso
    };
    return bodyTypeMap[bodyType as keyof typeof bodyTypeMap] || (isUserMale ? maleImages.regular : femaleImages.regular);
  };
  const getBodyTypeText = () => {
    const bodyTypeAnswer = getAnswer('Qual seu tipo de corpo?');
    return bodyTypeAnswer?.answer || 'Regular';
  };

  // Handle BMI updates from the interactive chart
  const handleBMIChange = (bmi: number, height: number, weight: number) => {
    setCurrentBMI(bmi);
    updateUserInfo({
      bmi,
      height,
      weight
    });
  };
  useEffect(() => {
    // Show progression after 2 seconds
    const timer = setTimeout(() => setShowProgression(true), 2000);

    // Setup audio event listeners
    if (audioRef.current) {
      const audioElement = audioRef.current;
      const updateTime = () => setCurrentTime(audioElement.currentTime);
      const updateDuration = () => setDuration(audioElement.duration);
      const handlePlay = () => setPlayingAudio(true);
      const handlePause = () => setPlayingAudio(false);
      const handleEnded = () => setPlayingAudio(false);
      audioElement.addEventListener('timeupdate', updateTime);
      audioElement.addEventListener('loadedmetadata', updateDuration);
      audioElement.addEventListener('play', handlePlay);
      audioElement.addEventListener('pause', handlePause);
      audioElement.addEventListener('ended', handleEnded);

      // Auto-play when component mounts  
      const tryAutoPlay = async () => {
        try {
          await audioElement.play();
        } catch (error) {
          console.log('Autoplay prevented by browser');
        }
      };
      tryAutoPlay();
      return () => {
        audioElement.removeEventListener('timeupdate', updateTime);
        audioElement.removeEventListener('loadedmetadata', updateDuration);
        audioElement.removeEventListener('play', handlePlay);
        audioElement.removeEventListener('pause', handlePause);
        audioElement.removeEventListener('ended', handleEnded);
      };
    }

    // Play audio entry sound
    audio.onEnter?.();
    return () => clearTimeout(timer);
  }, []);
  const handlePlayAudio = () => {
    if (audioRef.current) {
      if (playingAudio) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
    }
  };
  const handleContinue = () => {
    audio.onNext?.();
    nextPage();
  };
  return <ProfessionalQuizLayout>
        <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
        {/* Hidden Audio Element */}
        <audio ref={audioRef} src="https://res.cloudinary.com/dfuqtp8jn/video/upload/v1755296093/Untitled_Video_3_online-audio-converter.com_omwluu.mp3" preload="auto" />
        
        {/* Audio Message Header */}
        <div className="text-center space-y-4 animate-slide-up">
          <h2 className="professional-question-title bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent animate-pulse">
            {userInfo.name}, ouça meu áudio urgente!
            <br />
            <span className="bg-gradient-to-r from-red-700 to-red-500 bg-clip-text text-transparent font-extrabold">
              Seu IMC é {currentBMI.toFixed(1)} - preocupante!
            </span>
          </h2>
          <p className="text-muted-foreground text-sm animate-fade-in-delay">
            Escute a análise profissional sobre seu caso específico
          </p>
        </div>

        {/* Audio Player */}
        <div className="bg-card border border-border rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-3">
            {/* Foto da Nutricionista */}
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-border bg-background">
                <SmartImage src="/lovable-uploads/ec4a7979-b632-4e8b-a162-bcb612bfc6c7.png" alt="Lara - Nutricionista da Equipe" className="w-full h-full object-cover" currentPage={23} priority="critical" skeletonType="avatar" />
              </div>
              {playingAudio && <div className="absolute -inset-0.5 border-2 border-primary rounded-full animate-pulse"></div>}
            </div>

            {/* Informações e Controles */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-sm font-medium text-foreground">Análise de IMC por voz</h4>
                  <p className="text-xs text-muted-foreground">Lara • Nutricionista da Equipe</p>
                </div>
                <Button onClick={handlePlayAudio} variant="default" size="sm" className="w-8 h-8 rounded-full p-0" aria-label={playingAudio ? "Pausar áudio" : "Reproduzir áudio"}>
                  {playingAudio ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                </Button>
              </div>

              {/* Barra de Progresso */}
              <div className="mb-2">
                <div className="h-0.5 bg-muted rounded-full cursor-pointer hover:h-1 transition-all duration-200" onClick={e => {
                if (audioRef.current && duration > 0) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const percentage = clickX / rect.width;
                  const newTime = percentage * duration;
                  audioRef.current.currentTime = newTime;
                }
              }}>
                  <div className="h-full bg-primary rounded-full transition-all duration-100" style={{
                  width: duration > 0 ? `${currentTime / duration * 100}%` : '0%'
                }} />
                </div>
              </div>

              {/* Timeline */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {duration > 0 ? `${Math.floor(currentTime / 60)}:${String(Math.floor(currentTime % 60)).padStart(2, '0')}` : '0:00'}
                </span>
                <span>
                  {duration > 0 ? `${Math.floor(duration / 60)}:${String(Math.floor(duration % 60)).padStart(2, '0')}` : '2:45'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive BMI Chart */}
        <InteractiveBMIChart initialHeight={initialHeight} initialWeight={initialWeight} onBMIChange={handleBMIChange} className="max-w-3xl mx-auto" />

        {/* Professional Analysis Section */}
        <div className="grid grid-cols-2 gap-4 animate-slide-up">
          <div className="bg-gradient-to-br from-white to-orange-50 border-2 border-orange-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group">
            <h4 className="text-lg font-semibold text-center mb-2 text-orange-600 group-hover:text-orange-700 transition-colors">Nível de Risco</h4>
            <p className="text-sm text-center text-muted-foreground mb-4 animate-fade-in-delay">
              Baseado na avaliação médica
            </p>
            
            {/* Risk Level Indicator */}
            <div className="relative w-24 h-24 mx-auto group-hover:scale-110 transition-transform duration-300">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-200" />
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={`${(currentBMI > 25 ? 75 : 35) * 2.51} ${100 * 2.51}`} className={`${currentBMI > 30 ? "text-red-500" : currentBMI > 25 ? "text-orange-500" : "text-green-500"} drop-shadow-lg animate-pulse`} style={{
                filter: `drop-shadow(0 0 8px ${currentBMI > 30 ? '#ef4444' : currentBMI > 25 ? '#f97316' : '#22c55e'}33)`
              }} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold bg-white rounded-full px-2 py-1 shadow-md">
                  {currentBMI > 25 ? currentBMI > 30 ? 'Alto' : 'Médio' : 'Baixo'}
                </span>
              </div>
            </div>
            <p className="text-xs text-center mt-2 text-gray-600 bg-gray-50 rounded-full px-3 py-1">
              Categoria: <span className="font-medium">{bmiData.category}</span>
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-white to-green-50 border-2 border-green-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group">
            <h4 className="text-lg font-semibold text-center mb-4 text-green-600 group-hover:text-green-700 transition-colors animate-fade-in">{getBodyTypeText()}</h4>
            <div className="flex justify-center group-hover:scale-110 transition-transform duration-300">
              <div className="relative">
                <SmartImage src={getBodyTypeImage()} alt={`Tipo de corpo: ${getBodyTypeText()}`} className="w-24 h-32 object-cover rounded-lg shadow-lg border-2 border-green-200 hover:border-green-300 transition-all duration-300" currentPage={23} priority="critical" skeletonType="body" />
                <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Weight Loss Projection */}
        <div className="bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
          
          
          <div className="grid grid-cols-3 gap-6">
            {[{
            week: 'Semana 1-7',
            weight: currentBMI > 30 ? '3-5KG' : currentBMI > 25 ? '2-3KG' : '1-2KG',
            days: '7 dias',
            height: 'h-16',
            color: 'bg-gradient-to-t from-green-400 to-green-300',
            glowColor: 'shadow-green-200',
            description: 'Eliminação de retenção e início da queima'
          }, {
            week: 'Semana 8-14',
            weight: currentBMI > 30 ? '6-8KG' : currentBMI > 25 ? '4-6KG' : '2-4KG',
            days: '14 dias',
            height: 'h-24',
            color: 'bg-gradient-to-t from-green-500 to-green-400',
            glowColor: 'shadow-green-300',
            description: 'Aceleração do metabolismo'
          }, {
            week: 'Semana 15-21',
            weight: currentBMI > 30 ? '8-12KG' : currentBMI > 25 ? '6-9KG' : '3-6KG',
            days: '21 dias',
            height: 'h-32',
            color: 'bg-gradient-to-t from-green-600 to-green-500',
            glowColor: 'shadow-green-400',
            description: 'Consolidação dos resultados'
          }].map((item, index) => <div key={index} className="text-center group animate-slide-up" style={{
            animationDelay: `${index * 200}ms`
          }}>
                
                <div className="relative h-32 bg-gradient-to-t from-gray-100 to-gray-50 rounded-lg mb-2 flex items-end justify-center shadow-inner group-hover:shadow-lg transition-all duration-300">
                  <div className={`${item.height} ${item.color} w-10 rounded-t-lg relative flex items-center justify-center ${item.glowColor} shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-white/50`}>
                    <span className="text-white text-xs font-bold transform -rotate-90 whitespace-nowrap drop-shadow-md">
                      {item.weight}
                    </span>
                    <div className="absolute inset-0 bg-white/20 rounded-t-lg"></div>
                  </div>
                </div>
                <div className="text-base font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent group-hover:from-green-700 group-hover:to-green-600 transition-all">-{item.weight}</div>
                <div className="text-xs text-muted-foreground bg-green-50 rounded-full px-2 py-1 mt-1">{item.days}</div>
                <div className="text-xs text-gray-500 mt-2 leading-tight bg-gray-50 rounded-lg p-2 group-hover:bg-gray-100 transition-colors">{item.description}</div>
              </div>)}
          </div>
        </div>

        {/* Main CTA Button - Fixo */}
        <Button 
          onClick={handleContinue}
          variant="emerald"
          size="betterme"
          className="w-full"
        >
          <span className="flex items-center justify-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Quero a receita
            <TrendingUp className="w-5 h-5" />
          </span>
        </Button>
      </div>
    </ProfessionalQuizLayout>;
};
