// COMPONENTE OTIMIZADO DE IMAGEM COM INTERSECTION OBSERVER
// Carrega imagens apenas quando estão prestes a entrar na viewport

import React, { useState, useEffect, useRef } from 'react';
import { useImageCache } from '@/hooks/useOptimizedImageCache';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
  [key: string]: any;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  fallbackSrc,
  onLoad,
  onError,
  priority = false,
  ...props
}) => {
  const { isLoaded, cachedImage } = useImageCache(src);
  const [error, setError] = useState(false);
  const [displaySrc, setDisplaySrc] = useState<string | null>(priority ? src : null);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // INTERSECTION OBSERVER OTIMIZADO para lazy loading inteligente
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '200px', // Aumentado para carregar bem antes (melhor UX)
        threshold: 0.01,
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority]);

  // Atualiza displaySrc quando imagem está na viewport ou no cache
  useEffect(() => {
    if (isInView || priority) {
      if (isLoaded && cachedImage) {
        setDisplaySrc(cachedImage.src);
        onLoad?.();
      } else {
        setDisplaySrc(src);
      }
    }
  }, [src, isLoaded, cachedImage, isInView, priority, onLoad]);

  const handleError = () => {
    setError(true);

    if (fallbackSrc && displaySrc !== fallbackSrc) {
      setDisplaySrc(fallbackSrc);
      setError(false);
    } else {
      onError?.();
    }
  };

  const handleLoad = () => {
    setError(false);
    onLoad?.();
  };

  return (
    <img
      ref={imgRef}
      src={displaySrc || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}
      alt={alt}
      className={cn(
        'transition-opacity duration-200',
        !displaySrc && 'opacity-0',
        error && 'opacity-50',
        className
      )}
      onLoad={handleLoad}
      onError={handleError}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      {...props}
    />
  );
};

// VARIAÇÃO: Imagem com container responsivo
export const ResponsiveLazyImage: React.FC<LazyImageProps & {
  aspectRatio?: string;
  containerClassName?: string;
}> = ({
  aspectRatio = "aspect-video",
  containerClassName,
  className,
  ...props
}) => {
  return (
    <div className={cn("relative overflow-hidden", aspectRatio, containerClassName)}>
      <LazyImage
        className={cn("absolute inset-0 w-full h-full object-cover", className)}
        {...props}
      />
    </div>
  );
};

// VARIAÇÃO: Imagem de perfil com fallback
export const ProfileLazyImage: React.FC<LazyImageProps & {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({
  size = 'md',
  className,
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };
  
  return (
    <LazyImage
      className={cn(
        "rounded-full object-cover",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
};