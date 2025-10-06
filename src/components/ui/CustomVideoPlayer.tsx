import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';

interface CustomVideoPlayerProps {
  src: string;
  onPlay?: () => void;
  onEnded?: () => void;
  onUnmute?: () => void;
  className?: string;
  poster?: string;
  width?: number;
  height?: number;
}

interface DeviceCapabilities {
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  requiresUserGesture: boolean;
  supportsAutoplay: boolean;
}

export const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  src,
  onPlay,
  onEnded,
  onUnmute,
  className = "",
  poster,
  width,
  height
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [showVideo, setShowVideo] = useState(true); // Mostra imediatamente
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [deviceCapabilities, setDeviceCapabilities] = useState<DeviceCapabilities>({
    isMobile: false,
    isIOS: false,
    isAndroid: false,
    requiresUserGesture: false,
    supportsAutoplay: false
  });

  // Detectar capacidades do dispositivo
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/.test(userAgent);
    const isMobile = isIOS || isAndroid || /Mobile|Tablet/.test(userAgent);
    
    setDeviceCapabilities({
      isMobile,
      isIOS,
      isAndroid,
      requiresUserGesture: isIOS || isMobile, // iOS sempre requer, mobile geralmente sim
      supportsAutoplay: !isIOS // iOS geralmente não suporta autoplay com som
    });
  }, []);

  // Configurar vídeo para carregamento inteligente
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Configuração otimizada baseada no dispositivo
    video.playsInline = true;
    video.preload = 'auto'; // Changed to auto to fix AbortError
    
    // Atributos específicos para diferentes browsers
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('x5-playsinline', 'true');
    video.setAttribute('x5-video-player-type', 'h5');

    // Configuração inicial de mute baseada no dispositivo
    if (deviceCapabilities.requiresUserGesture) {
      video.muted = true; // Inicia mudo em dispositivos que requerem gesture
    } else {
      video.muted = false; // Desktop pode iniciar com som
      video.volume = 0.7;
    }

    const handleCanPlay = () => {
      setIsLoading(false);
      setIsReady(true);
    };

    const handleCanPlayThrough = () => {
      setIsReady(true);
      setIsLoading(false);
    };

    const handleLoadedData = () => {
      setIsReady(true);
      setIsLoading(false);
    };

    const handleError = (e: Event) => {
      console.error('Video loading error:', e);
      setIsLoading(false);
      setIsReady(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setShowPlayButton(true);
      onEnded?.();
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setShowPlayButton(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handlePlaying = () => {
      setIsLoading(false);
    };

    // Event listeners
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);

    // Pré-carregar o vídeo
    video.load();

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
    };
  }, [src, deviceCapabilities, onEnded]);

  // Estratégia de ativação de áudio otimizada
  const handlePlayClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!videoRef.current || !isReady) {
      console.log('Video not ready yet');
      return;
    }

    const video = videoRef.current;
    setHasUserInteracted(true);

    try {
      // Estratégia universal: tentar sempre com som primeiro
      video.muted = false;
      video.volume = 0.7;
      
      // Para iOS e dispositivos mobile: unlock audio context primeiro
      if (deviceCapabilities.requiresUserGesture) {
        // Criar um contexto de áudio temporário para unlock
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          if (audioContext.state === 'suspended') {
            await audioContext.resume();
          }
          audioContext.close();
        } catch (audioError) {
          console.log('Audio context unlock failed:', audioError);
        }
      }

      await video.play();
      setIsMuted(false);
      onPlay?.();
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('✅ Video playing with audio successfully');
      }
      
    } catch (playError) {
      console.log('First play attempt failed, trying with muted fallback:', playError);
      
      // Fallback: inicia mudo mas permite unmute manual
      try {
        video.muted = true;
        video.volume = 0;
        await video.play();
        setIsMuted(true);
        onPlay?.();
        
        if (process.env.NODE_ENV !== 'production') {
          console.log('✅ Video playing muted (user can unmute manually)');
        }
        
      } catch (mutedError) {
        console.error('❌ Failed to play video even muted:', mutedError);
        // Último recurso: recarregar
        video.load();
      }
    }
  }, [isReady, deviceCapabilities, onPlay]);

  // Toggle mute/unmute
  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    const wasUnmuting = video.muted;
    video.muted = !video.muted;
    video.volume = video.muted ? 0 : 0.7;
    setIsMuted(video.muted);
    
    // Call onUnmute callback when unmuting
    if (wasUnmuting && !video.muted && onUnmute) {
      onUnmute();
    }
  }, [onUnmute]);

  // Handle video click - apenas previne comportamentos indesejados
  const handleVideoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Não faz nada - vídeo continua tocando normalmente
  }, []);

  return (
    <div className={`relative w-full h-auto overflow-hidden rounded-2xl shadow-xl ${className}`}>
      {/* Video Element - Sempre visível desde o início */}
      <video 
        ref={videoRef}
        className="w-full h-auto cursor-pointer bg-black rounded-2xl"
        src={src}
        poster={poster}
        width={width}
        height={height}
        muted={deviceCapabilities.requiresUserGesture}
        playsInline={true}
        preload="none"
        webkit-playsinline="true"
        x5-playsinline="true"
        x5-video-player-type="h5"
        x5-video-player-fullscreen="false"
        controls={false}
        disablePictureInPicture={true}
        controlsList="nodownload noplaybackrate nofullscreen"
        onClick={handleVideoClick}
        style={{
          maxWidth: '100%',
          height: 'auto',
          objectFit: 'contain'
        }}
      >
        <track 
          kind="captions" 
          src="/captions/p13.vtt" 
          srcLang="pt" 
          label="Português" 
          default 
        />
      </video>

      {/* Loading Spinner - Overlay sobre o vídeo */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-sm rounded-2xl">
          <div className="relative">
            <div className="w-12 h-12 border-3 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {/* Botão de Play Central - Design Premium */}
      {showPlayButton && isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-2xl">
          <button
            onClick={handlePlayClick}
            className="group relative"
            aria-label="Reproduzir vídeo"
            disabled={!isReady}
          >
            {/* Glow Effect Animado */}
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl scale-110 group-hover:scale-125 group-hover:bg-primary/40 transition-all duration-500 animate-pulse"></div>
            
            {/* Botão Principal */}
            <div className="relative w-24 h-24 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 group-active:scale-95 transition-all duration-300 border-2 border-white/50">
              <Play 
                className="w-10 h-10 text-primary ml-1 drop-shadow-sm" 
                fill="currentColor"
              />
            </div>
            
            {/* Pulse Ring */}
            <div className="absolute inset-0 bg-white/10 rounded-full animate-ping scale-110"></div>
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping scale-125 animation-delay-200"></div>
          </button>
        </div>
      )}

      {/* Controle de Volume - Aparece apenas quando tocando */}
      {isPlaying && (
        <button 
          onClick={toggleMute}
          className="absolute top-4 right-4 w-12 h-12 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/80 transition-all duration-200 z-10 shadow-lg"
          aria-label={isMuted ? "Ativar áudio" : "Desativar áudio"}
          aria-pressed={!isMuted}
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6 text-white drop-shadow-sm" />
          ) : (
            <Volume2 className="w-6 h-6 text-white drop-shadow-sm" />
          )}
        </button>
      )}

      {/* Indicator de estado (apenas para debug em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-2 left-2 text-xs text-white/60 bg-black/50 px-2 py-1 rounded">
          {deviceCapabilities.isIOS ? 'iOS' : deviceCapabilities.isAndroid ? 'Android' : 'Desktop'} | 
          {isReady ? 'Ready' : 'Loading'} | 
          {hasUserInteracted ? 'Interacted' : 'No interaction'}
        </div>
      )}
    </div>
  );
};