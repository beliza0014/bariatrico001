import React, { useState } from 'react';
import { LazyImage } from '@/components/ui/LazyImage';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
interface SmartImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onError'> {
  src: string;
  alt: string;
  currentPage?: number;
  priority?: 'critical' | 'essential' | 'high' | 'normal';
  skeletonType?: 'default' | 'avatar' | 'card' | 'body' | 'fruit';
  fallbackSrc?: string;
  showLoadingIndicator?: boolean;
  onLoadComplete?: (loadTime: number) => void;
  onError?: (error: string) => void;
}

// SKELETON PERSONALIZADO BASEADO NO TIPO DE CONTEÚDO
const CustomSkeleton: React.FC<{
  type: string;
  className?: string;
}> = ({
  type,
  className
}) => {
  const baseClasses = "animate-pulse bg-muted";
  switch (type) {
    case 'avatar':
      return <Skeleton className={cn("w-24 h-24 rounded-full", baseClasses, className)} />;
    case 'body':
      return <div className={cn("space-y-2", className)}>
          <Skeleton className={cn("w-full h-48 rounded-xl", baseClasses)} />
          <Skeleton className={cn("w-20 h-4 mx-auto rounded", baseClasses)} />
        </div>;
    case 'fruit':
      return <Skeleton className={cn("w-20 h-20 rounded-full", baseClasses, className)} />;
    case 'card':
      return <div className={cn("space-y-3", className)}>
          <Skeleton className={cn("w-full h-32 rounded-lg", baseClasses)} />
          <Skeleton className={cn("w-24 h-4 rounded", baseClasses)} />
        </div>;
    default:
      return <Skeleton className={cn("w-full h-full rounded-md", baseClasses, className)} />;
  }
};

// COMPONENTE OTIMIZADO: SmartImage usando cache unificado
export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  currentPage,
  priority,
  skeletonType = 'default',
  fallbackSrc,
  showLoadingIndicator = false,
  onLoadComplete,
  onError,
  className,
  style,
  ...props
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleLoad = () => {
    onLoadComplete?.(0);
  };

  const handleError = () => {
    setError('Failed to load image');
    onError?.('Failed to load image');
  };

  // Determina prioridade baseada no prop
  const isPriority = priority === 'critical' || priority === 'essential';

  return (
    <LazyImage
      {...props}
      src={src}
      alt={alt}
      className={className}
      style={style}
      fallbackSrc={fallbackSrc}
      priority={isPriority}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
};

// COMPONENTE ESPECÍFICO PARA IMAGENS DE CORPO
export const BodyImage: React.FC<Omit<SmartImageProps, 'skeletonType'>> = props => <SmartImage {...props} skeletonType="body" />;

// COMPONENTE ESPECÍFICO PARA AVATARES/GÊNERO
export const AvatarImage: React.FC<Omit<SmartImageProps, 'skeletonType'>> = props => <SmartImage {...props} skeletonType="avatar" />;

// COMPONENTE ESPECÍFICO PARA FRUTAS
export const FruitImage: React.FC<Omit<SmartImageProps, 'skeletonType'>> = props => <SmartImage {...props} skeletonType="fruit" />;

// COMPONENTE ESPECÍFICO PARA CARDS
export const CardImage: React.FC<Omit<SmartImageProps, 'skeletonType'>> = props => <SmartImage {...props} skeletonType="card" />;