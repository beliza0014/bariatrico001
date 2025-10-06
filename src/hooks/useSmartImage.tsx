// DEPRECIADO: Este arquivo foi substituído por useOptimizedImageCache.tsx
// Mantido apenas para compatibilidade durante a transição

import { useState, useEffect } from 'react';
import { useImageCache } from './useOptimizedImageCache';

// HOOK: Agora usa o sistema otimizado
export const useSmartImage = (
  src: string,
  currentPage?: number,
  forcePriority?: 'critical' | 'essential' | 'high' | 'normal'
) => {
  const { isLoaded, cachedImage } = useImageCache(src);

  return {
    isLoaded,
    isLoading: !isLoaded,
    error: null,
    image: cachedImage,
    loadTime: 0,
    reload: () => {},
    priority: forcePriority || 'normal',
    isCached: isLoaded,
  };
};

// UTILITÁRIO: Batch preload (mantido por compatibilidade)
export const useSmartImageBatch = (
  imageUrls: string[],
  currentPage?: number,
  maxConcurrency?: number
) => {
  const [state, setState] = useState({
    loaded: 0,
    failed: 0,
    loading: true,
    images: {} as { [key: string]: HTMLImageElement },
  });

  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) {
      setState({ loaded: 0, failed: 0, loading: false, images: {} });
      return;
    }

    // Marca como loaded após um timeout curto
    // O sistema otimizado cuida do preload em background
    const timer = setTimeout(() => {
      setState({
        loaded: imageUrls.length,
        failed: 0,
        loading: false,
        images: {},
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [imageUrls]);

  return state;
};

export const clearSmartImageCache = () => {
  console.log('🧹 Cache clearing delegated to optimized system');
};

export const getSmartImageCacheStats = () => ({
  totalImages: 0,
  validImages: 0,
  expiredImages: 0,
  averageLoadTime: 0,
  cacheSize: 0,
});

