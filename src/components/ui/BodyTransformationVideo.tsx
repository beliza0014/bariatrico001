import React, { useRef, useState, useEffect } from 'react';

interface BodyTransformationVideoProps {
  className?: string;
}

export const BodyTransformationVideo: React.FC<BodyTransformationVideoProps> = ({
  className = ""
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // URLs otimizadas do Cloudinary
  const baseUrl = "https://res.cloudinary.com/dpsmdgdzi/video/upload";
  const videoId = "v1725014831/DM_20250830082711_001_mqsudn";
  
  // URL MP4 otimizada
  const mp4Url = `${baseUrl}/f_mp4,q_auto:good,c_scale,w_320/${videoId}.mp4`;
  
  // URL HLS para melhor compatibilidade
  const hlsUrl = `${baseUrl}/f_m3u8,q_auto:good,c_scale,w_320/${videoId}.m3u8`;
  
  // Poster image
  const posterUrl = `${baseUrl}/f_jpg,q_auto:good,c_scale,w_320/${videoId}.jpg`;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Configurações otimizadas para autoplay cross-browser
    video.playsInline = true;
    video.muted = true;
    video.loop = true;
    video.preload = 'auto';
    video.crossOrigin = 'anonymous';
    
    // Atributos específicos para mobile
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('x5-playsinline', 'true');

    const handleLoadedMetadata = () => {
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      // Tentar autoplay
      video.play().catch(() => {
        console.log('Autoplay prevented, user interaction required');
      });
    };

    const handleError = (e: Event) => {
      console.error('Video loading error:', e);
      setIsLoading(false);
      setHasError(true);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setHasError(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);

    // Carregar o vídeo
    video.load();

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
    };
  }, [hlsUrl, mp4Url]);

  // Fallback para imagem estática se vídeo falhar
  if (hasError) {
    return (
      <div className={`w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/10 shadow-2xl ${className}`}>
        <div className="w-full h-full flex items-center justify-center bg-muted">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <div className="w-8 h-8 bg-primary/20 rounded-full"></div>
            </div>
            <p className="text-sm text-muted-foreground">Transformação</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-40 h-40 md:w-48 md:h-48 ${className}`}>
      {/* Container circular com animação de moeda girando */}
      <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-primary/10 to-background border-2 border-primary/20 shadow-2xl shadow-primary/10" 
           style={{
             transformStyle: 'preserve-3d',
             animation: 'coinFlip 4s ease-in-out infinite'
           }}>
        <video 
          ref={videoRef}
          className="w-full h-full object-cover rounded-full"
          poster={posterUrl}
          muted
          loop
          playsInline
          preload="auto"
          autoPlay
          disablePictureInPicture
          controlsList="nodownload noplaybackrate"
          crossOrigin="anonymous"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            clipPath: 'circle(50%)',
            WebkitMaskImage: '-webkit-radial-gradient(circle, white 100%, black 100%)'
          }}
        >
          {/* HLS first for better compatibility, MP4 as fallback */}
          <source src={hlsUrl} type="application/x-mpegURL" />
          <source src={mp4Url} type="video/mp4" />
        </video>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-background rounded-full flex items-center justify-center border-2 border-primary/20">
          <div className="relative">
            <div className="w-12 h-12 border-3 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {/* Glow effect sutil */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
    </div>
  );
};