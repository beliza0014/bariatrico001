import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SmartImage } from '@/components/ui/SmartImage';

interface NewInformationalPageProps {
  userInfo: {
    height?: number;
    weight?: number;
    name?: string;
  };
  onNext: () => void;
}

interface BMICategoryData {
  category: string;
  color: string;
  description: string;
  percentage: number;
}

export const NewInformationalPage: React.FC<NewInformationalPageProps> = ({
  userInfo,
  onNext
}) => {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [bmiPosition, setBmiPosition] = useState(0);
  const [circularProgress, setCircularProgress] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState([0, 0, 0]);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Calcular IMC
  const calculateBMI = () => {
    if (!userInfo.height || !userInfo.weight) return 22.5; // Valor padrão
    const heightM = userInfo.height / 100;
    return userInfo.weight / (heightM * heightM);
  };

  const bmi = calculateBMI();
  
  // Funções para controle de áudio
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsAudioPlaying(!isAudioPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setAudioCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * audioDuration;
      audioRef.current.currentTime = newTime;
      setAudioCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Obter dados da categoria do IMC
  const getBMICategoryData = (bmiValue: number): BMICategoryData => {
    if (bmiValue < 18.5) return {
      category: 'Abaixo do peso',
      color: '#3b82f6',
      description: 'Pode ser necessário ganhar peso de forma saudável',
      percentage: 15
    };
    if (bmiValue < 25) return {
      category: 'Peso normal',
      color: '#22c55e',
      description: 'Parabéns! Você está na faixa de peso ideal',
      percentage: 35
    };
    if (bmiValue < 30) return {
      category: 'Sobrepeso',
      color: '#eab308',
      description: 'Pequenas mudanças podem trazer grandes benefícios',
      percentage: 87
    };
    if (bmiValue < 35) return {
      category: 'Obesidade grau I',
      color: '#f97316',
      description: 'É importante focar em hábitos saudáveis',
      percentage: 75
    };
    return {
      category: 'Obesidade grau II',
      color: '#ef4444',
      description: 'Recomenda-se acompanhamento profissional',
      percentage: 90
    };
  };

  const bmiData = getBMICategoryData(bmi);

  // Obter posição do IMC na escala (0-100%)
  const getBMIPosition = (bmiValue: number) => {
    if (bmiValue < 18.5) return Math.max(0, bmiValue / 18.5 * 25);
    if (bmiValue < 25) return 25 + (bmiValue - 18.5) / (25 - 18.5) * 35;
    if (bmiValue < 30) return 60 + (bmiValue - 25) / (30 - 25) * 25;
    return Math.min(100, 85 + (bmiValue - 30) / 10 * 15);
  };

  useEffect(() => {
    // Sequência de animações
    const timers = [
      // Fase 1: Mostrar seções iniciais
      setTimeout(() => setAnimationPhase(1), 300),
      
      // Fase 2: Animar IMC horizontal
      setTimeout(() => {
        setAnimationPhase(2);
        const targetPosition = getBMIPosition(bmi);
        let currentPos = 0;
        const animatePosition = () => {
          currentPos += (targetPosition - currentPos) * 0.1;
          setBmiPosition(currentPos);
          if (Math.abs(targetPosition - currentPos) > 0.5) {
            requestAnimationFrame(animatePosition);
          } else {
            setBmiPosition(targetPosition);
          }
        };
        animatePosition();
      }, 800),
      
      // Fase 3: Animar gráfico circular
      setTimeout(() => {
        setAnimationPhase(3);
        let progress = 0;
        const animateCircular = () => {
          progress += (bmiData.percentage - progress) * 0.08;
          setCircularProgress(progress);
          if (Math.abs(bmiData.percentage - progress) > 0.5) {
            requestAnimationFrame(animateCircular);
          } else {
            setCircularProgress(bmiData.percentage);
          }
        };
        animateCircular();
      }, 1500),
      
      // Fase 4: Animar barras semanais
      setTimeout(() => {
        setAnimationPhase(4);
        const weeklyValues = [5, 9, 15];
        weeklyValues.forEach((value, index) => {
          setTimeout(() => {
            setWeeklyProgress(prev => {
              const newProgress = [...prev];
              newProgress[index] = value;
              return newProgress;
            });
          }, index * 300);
        });
      }, 2200)
    ];

    return () => timers.forEach(clearTimeout);
  }, [bmi, bmiData.percentage]);

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto px-4">
      {/* Título do Áudio */}
      <div className={`text-center transition-all duration-500 ${
        animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Ouça o meu áudio urgente
        </h2>
      </div>

      {/* Seção 1: Player de Áudio */}
      <div className={`bg-white rounded-xl p-4 border border-gray-200 shadow-lg transition-all duration-500 ${
        animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <div className="flex items-center gap-3">
          {/* Avatar da Doutora - Tamanho profissional */}
          <div className="w-10 h-10 bg-blue-50 rounded-full overflow-hidden border-2 border-blue-200 shadow-sm flex-shrink-0">
            <SmartImage 
              src="/lovable-uploads/8ed45a1a-8b50-4684-add5-998123b43a04.png" 
              alt="Nutri Camila - Nutricionista"
              className="w-full h-full object-cover"
              currentPage={24}
              priority="critical"
              skeletonType="avatar"
            />
          </div>
          
          {/* Controles de Áudio */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-sm font-semibold text-gray-800">Mensagem da Nutri Camila</h4>
                <p className="text-xs text-gray-600">Nutricionista da Equipe</p>
              </div>
              <button
                onClick={toggleAudio}
                className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex-shrink-0"
              >
                {isAudioPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
              </button>
            </div>
            
            {/* Elemento de áudio */}
            <audio
              ref={audioRef}
              src="https://res.cloudinary.com/dpsmdgdzi/video/upload/DM_20250906194645_001_r47n5l.mp3"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsAudioPlaying(true)}
              onPause={() => setIsAudioPlaying(false)}
              onEnded={() => setIsAudioPlaying(false)}
              preload="metadata"
            />
            
            {/* Barra de progresso do áudio */}
            <div className="mb-2">
              <div 
                className="flex-1 bg-gray-200 rounded-full h-1 shadow-inner cursor-pointer hover:h-1.5 transition-all duration-200"
                onClick={handleProgressClick}
              >
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${audioDuration ? (audioCurrentTime / audioDuration) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            
            {/* Timeline do áudio */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{formatTime(audioCurrentTime)}</span>
              <span>{audioDuration ? formatTime(audioDuration) : '--:--'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seção 2: Gráfico Horizontal do IMC */}
      <div className={`bg-white rounded-xl p-6 border border-gray-200 shadow-lg transition-all duration-500 ${
        animationPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Seu Índice de Massa Corporal</h3>
        
        {/* Bubble do IMC */}
        <div className="relative mb-6">
          <div 
            className="absolute -top-3 transform -translate-x-1/2 transition-all duration-1000 ease-out z-20" 
            style={{ left: `${bmiPosition}%` }}
          >
            <div className="bg-gray-800 text-white rounded-lg px-3 py-2 text-sm font-bold whitespace-nowrap shadow-xl">
              Seu IMC: {bmi.toFixed(1)}
            </div>
            <div className="w-0 h-0 border-l-5 border-r-5 border-t-7 border-transparent border-t-gray-800 mx-auto"></div>
          </div>
          
          {/* Escala colorida */}
          <div 
            className="relative h-9 rounded-full overflow-hidden shadow-lg mt-8" 
            style={{
              background: 'linear-gradient(to right, #3b82f6 0%, #22c55e 25%, #eab308 60%, #f97316 85%, #ef4444 100%)'
            }}
          >
            {/* Linhas divisórias */}
            <div className="absolute inset-y-0 w-0.5 bg-white/50" style={{ left: '25%' }}></div>
            <div className="absolute inset-y-0 w-0.5 bg-white/50" style={{ left: '60%' }}></div>
            <div className="absolute inset-y-0 w-0.5 bg-white/50" style={{ left: '85%' }}></div>
            
            {/* Indicador circular */}
            <div 
              className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out" 
              style={{ left: `${bmiPosition}%` }}
            >
              <div className="w-7 h-7 bg-white border-3 border-gray-800 rounded-full shadow-xl"></div>
            </div>
          </div>
          
          {/* Labels */}
          <div className="flex text-sm font-medium text-gray-700 mt-3">
            <div className="flex-[25] text-left">Abaixo do peso</div>
            <div className="flex-[35] text-center">Normal</div>
            <div className="flex-[25] text-center">Sobrepeso</div>
            <div className="flex-[15] text-right">Obeso</div>
          </div>
        </div>
      </div>

      {/* Seção 3: Análise do Índice de Massa Corporal */}
      <div className={`bg-white rounded-xl p-6 border border-gray-200 shadow-lg transition-all duration-500 ${
        animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Índice de Massa Corporal</h3>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Lado esquerdo: Gráfico circular */}
          <div className="flex flex-col items-center">
            <div className="relative w-36 h-36 mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Círculo de fundo */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#e5e7eb"
                  strokeWidth="9"
                  fill="none"
                />
                {/* Círculo de progresso */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke={bmiData.color}
                  strokeWidth="9"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(circularProgress / 100) * 263.9} 263.9`}
                  className="transition-all duration-1500 ease-out"
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">{Math.round(circularProgress)}%</span>
                <span className="text-sm text-gray-600 font-medium">do seu IMC</span>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-base text-gray-600 leading-relaxed max-w-sm">
                {bmiData.description}
              </p>
            </div>
          </div>
          
          {/* Lado direito: Imagem da transformação */}
          <div className="flex flex-col items-center">
            <h4 className="font-bold text-xl mb-4" style={{ color: bmiData.color }}>
              {bmiData.category}
            </h4>
            <div className="w-40 h-40 rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg bg-gray-50">
              <SmartImage 
                src="/lovable-uploads/5972211c-2643-4f23-a566-91d6de8aa51f.png" 
                alt="Referência corporal"
                className="w-full h-full object-contain"
                currentPage={24}
                priority="high"
                skeletonType="body"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Seção 4: Progressão Semanal */}
      <div className={`bg-white rounded-xl p-6 border border-gray-200 shadow-lg transition-all duration-500 ${
        animationPhase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Progressão Esperada</h3>
        
        <div className="grid grid-cols-3 gap-6">
          {[
            { week: '1 semana', loss: weeklyProgress[0] },
            { week: '2 semanas', loss: weeklyProgress[1] },
            { week: '3 semanas', loss: weeklyProgress[2] }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="bg-gray-100 rounded-xl p-4 mb-3 relative overflow-hidden h-28 shadow-inner">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-500 to-green-400 rounded-b-xl transition-all duration-1000 ease-out"
                  style={{ 
                    height: `${(item.loss / 15) * 100}%`,
                    transitionDelay: `${index * 300}ms`
                  }}
                ></div>
                <div className="relative z-10 flex items-center justify-center h-full">
                  <div className="text-2xl font-bold text-gray-800">-{item.loss}kg</div>
                </div>
              </div>
              <p className="text-base font-bold text-gray-700">{item.week}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Seção 5: Transformação da Fernanda */}
      <div className={`bg-white rounded-xl p-6 border border-gray-200 shadow-lg transition-all duration-500 ${
        animationPhase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Veja a transformação da Fernanda</h3>
        
        <div className="flex flex-col items-center">
          {/* Imagem de transformação da Fernanda */}
          <div className="w-full max-w-lg h-56 rounded-2xl border-2 border-gray-200 overflow-hidden mb-5 shadow-lg">
            <SmartImage 
              src="/lovable-uploads/7bc77183-a871-42db-a879-9b669988e99f.png" 
              alt="Transformação da Fernanda - antes e depois"
              className="w-full h-full object-cover"
              currentPage={24}
              priority="high"
              skeletonType="body"
            />
          </div>
          
          <div className="bg-gray-50 rounded-xl p-5 max-w-2xl">
            <p className="text-base text-gray-700 text-center leading-relaxed italic">
              "Em apenas 4 semanas consegui perder 12kg de forma saudável e sustentável. 
              O chá realmente funciona!"
            </p>
            <p className="text-base font-bold text-gray-800 text-center mt-3">
              - Fernanda, 34 anos
            </p>
          </div>
        </div>
      </div>

      {/* Botão para continuar */}
      <div className="pt-4">
        <Button 
          onClick={onNext}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          🌟 Ver minha receita exclusiva
        </Button>
      </div>
    </div>
  );
};