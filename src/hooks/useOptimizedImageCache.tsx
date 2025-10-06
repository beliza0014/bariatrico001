// SISTEMA UNIFICADO DE CACHE DE IMAGENS OTIMIZADO
// Substitui todos os sistemas de cache anteriores com uma solução única e eficiente

import { useState, useEffect, useCallback, useRef } from 'react';
import { getPreloadStrategy } from '@/utils/imagePreloadStrategy';
import { detectUserFlow } from '@/utils/userFlowDetection';

interface CachedImage {
  image: HTMLImageElement;
  timestamp: number;
  loadTime: number;
  size: number;
}

interface LoadStats {
  total: number;
  loaded: number;
  failed: number;
  cacheHits: number;
  averageLoadTime: number;
}

// CACHE GLOBAL OTIMIZADO
const imageCache = new Map<string, CachedImage>();
const loadingPromises = new Map<string, Promise<HTMLImageElement>>();
const failedImages = new Set<string>();

// CONFIGURAÇÕES ULTRA-OTIMIZADAS
const CACHE_MAX_SIZE = 200; // Cache maior para acomodar todo o quiz
const CACHE_EXPIRY = 90 * 60 * 1000; // 90 minutos
const MAX_CONCURRENT_LOADS = 6; // Aumentado para melhor paralelismo
const RETRY_FAILED_AFTER = 3 * 60 * 1000; // Retry após 3 minutos

// QUEUE DE PRELOAD COM CONTROLE DE CONCORRÊNCIA
class PreloadQueue {
  private queue: Array<{ src: string; priority: number }> = [];
  private activeLoads = 0;
  private processing = false;

  add(src: string, priority: number) {
    // Não adiciona se já está no cache ou falhado recentemente
    if (imageCache.has(src) || loadingPromises.has(src)) return;
    
    // Remove de failed se passou tempo suficiente
    if (failedImages.has(src)) {
      const cached = imageCache.get(src);
      if (cached && Date.now() - cached.timestamp < RETRY_FAILED_AFTER) {
        return;
      }
      failedImages.delete(src);
    }

    this.queue.push({ src, priority });
    this.queue.sort((a, b) => a.priority - b.priority); // Menor número = maior prioridade
    this.process();
  }

  private async process() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0 && this.activeLoads < MAX_CONCURRENT_LOADS) {
      const item = this.queue.shift();
      if (!item) break;

      this.activeLoads++;
      preloadImage(item.src, item.priority)
        .finally(() => {
          this.activeLoads--;
          this.process();
        });
    }

    this.processing = false;
  }

  clear() {
    this.queue = [];
  }
}

const preloadQueue = new PreloadQueue();

// PRELOAD OTIMIZADO COM PRIORIZAÇÃO NATIVA
const preloadImage = async (
  src: string,
  priority: number = 3
): Promise<HTMLImageElement> => {
  try {
    // Cache hit
    if (imageCache.has(src)) {
      const cached = imageCache.get(src)!;
      imageCache.set(src, { ...cached, timestamp: Date.now() });
      return cached.image;
    }

    // Já está carregando
    if (loadingPromises.has(src)) {
      return loadingPromises.get(src)!;
    }

    const startTime = Date.now();
    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();

      // PRIORIZAÇÃO NATIVA OTIMIZADA
      if (priority <= 1) {
        // Critical: 0-1
        img.fetchPriority = 'high';
        img.loading = 'eager';
        img.decoding = 'sync';
      } else if (priority === 2) {
        // Essential: 2
        img.fetchPriority = 'high';
        img.loading = 'eager';
        img.decoding = 'async';
      } else if (priority === 3) {
        // High: 3
        img.fetchPriority = 'auto';
        img.loading = 'lazy';
        img.decoding = 'async';
      } else {
        // Normal: 4+
        img.fetchPriority = 'low';
        img.loading = 'lazy';
        img.decoding = 'async';
      }

      // CORS apenas para externos
      if (!src.includes('/lovable-uploads/') && !src.startsWith('/src/')) {
        img.crossOrigin = 'anonymous';
      }

      img.onload = () => {
        const loadTime = Date.now() - startTime;

        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
          // Estima tamanho (width * height * 4 bytes por pixel)
          const estimatedSize = img.naturalWidth * img.naturalHeight * 4;

          imageCache.set(src, {
            image: img,
            timestamp: Date.now(),
            loadTime,
            size: estimatedSize,
          });

          // Limpeza automática
          if (imageCache.size > CACHE_MAX_SIZE) {
            cleanupCache();
          }

          resolve(img);
        } else {
          reject(new Error(`Invalid image: ${src}`));
        }
      };

      img.onerror = () => {
        failedImages.add(src);
        reject(new Error(`Failed to load: ${src}`));
      };

      img.src = src;
    });

    loadingPromises.set(src, promise);

    promise.finally(() => {
      loadingPromises.delete(src);
    });

    return promise;
  } catch (error) {
    console.warn(`Error preloading ${src}:`, error);
    throw error;
  }
};

// LIMPEZA INTELIGENTE COM LRU
const cleanupCache = () => {
  if (imageCache.size <= CACHE_MAX_SIZE) return;

  const now = Date.now();
  const entries = Array.from(imageCache.entries());

  // Remove expiradas
  const validEntries = entries.filter(
    ([_, data]) => now - data.timestamp < CACHE_EXPIRY
  );

  // Se ainda tem muitas, remove as menos usadas (LRU)
  if (validEntries.length > CACHE_MAX_SIZE) {
    validEntries.sort((a, b) => b[1].timestamp - a[1].timestamp);
    validEntries.splice(CACHE_MAX_SIZE);
  }

  imageCache.clear();
  validEntries.forEach(([src, data]) => {
    imageCache.set(src, data);
  });
};

// HOOK PRINCIPAL: Sistema Otimizado de Cache
export const useOptimizedImageCache = (currentPage: number) => {
  const [stats, setStats] = useState<LoadStats>({
    total: 0,
    loaded: 0,
    failed: 0,
    cacheHits: 0,
    averageLoadTime: 0,
  });

  const statsRef = useRef({ cacheHits: 0, totalRequests: 0 });
  const userFlow = detectUserFlow();

  // PRELOAD ULTRA-ESCALONADO E OTIMIZADO
  const startOptimizedPreload = useCallback(() => {
    const strategy = getPreloadStrategy(currentPage);

    // FASE 1: CRÍTICO - Imediato (0ms) - Máxima prioridade
    if (strategy.critical.length > 0) {
      strategy.critical.forEach((src) => preloadQueue.add(src, 0));
    }

    // FASE 2: ESSENCIAL - 50ms (reduzido para início mais rápido)
    setTimeout(() => {
      if (strategy.essential.length > 0) {
        strategy.essential.forEach((src) => preloadQueue.add(src, 1));
      }
    }, 50);

    // FASE 3: ALTA - 200ms (reduzido)
    setTimeout(() => {
      if (strategy.high.length > 0) {
        strategy.high.forEach((src) => preloadQueue.add(src, 2));
      }
    }, 200);

    // FASE 4: NORMAL - 500ms ou idle (reduzido para melhor UX)
    const scheduleNormal = () => {
      if (strategy.normal.length > 0) {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(
            () => {
              strategy.normal.forEach((src) => preloadQueue.add(src, 3));
            },
            { timeout: 2000 } // Timeout para garantir execução
          );
        } else {
          setTimeout(() => {
            strategy.normal.forEach((src) => preloadQueue.add(src, 3));
          }, 500);
        }
      }
    };

    setTimeout(scheduleNormal, 500);
  }, [currentPage]);

  useEffect(() => {
    startOptimizedPreload();
  }, [startOptimizedPreload]);

  // Atualiza stats (menos frequente)
  useEffect(() => {
    const updateStats = () => {
      const entries = Array.from(imageCache.values());
      const totalLoadTime = entries.reduce((sum, e) => sum + e.loadTime, 0);

      setStats({
        total: imageCache.size + loadingPromises.size,
        loaded: imageCache.size,
        failed: failedImages.size,
        cacheHits: statsRef.current.cacheHits,
        averageLoadTime: entries.length > 0 ? totalLoadTime / entries.length : 0,
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 3000);

    return () => clearInterval(interval);
  }, [currentPage]);

  return {
    stats,
    userFlow,
    isImageCached: useCallback((src: string) => {
      const cached = imageCache.has(src);
      if (cached) {
        statsRef.current.cacheHits++;
      }
      statsRef.current.totalRequests++;
      return cached;
    }, []),
    getCachedImage: useCallback(
      (src: string) => imageCache.get(src)?.image || null,
      []
    ),
    preloadImage: useCallback((src: string, priority: number = 2) => {
      preloadQueue.add(src, priority);
    }, []),
    clearCache: useCallback(() => {
      imageCache.clear();
      loadingPromises.clear();
      failedImages.clear();
      preloadQueue.clear();
    }, []),
  };
};

// HOOK SIMPLES: Verificar se imagem está no cache
export const useImageCache = (src: string) => {
  const [isLoaded, setIsLoaded] = useState(imageCache.has(src));
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const checkCache = () => {
      if (!mountedRef.current) return;
      setIsLoaded(imageCache.has(src));
    };

    checkCache();

    // Se não está no cache, adiciona à fila
    if (!imageCache.has(src) && !loadingPromises.has(src)) {
      preloadQueue.add(src, 2);

      // Polling otimizado apenas para esta imagem
      const checkInterval = setInterval(() => {
        if (imageCache.has(src) || !mountedRef.current) {
          setIsLoaded(true);
          clearInterval(checkInterval);
        }
      }, 200);

      return () => {
        clearInterval(checkInterval);
        mountedRef.current = false;
      };
    }

    return () => {
      mountedRef.current = false;
    };
  }, [src]);

  return {
    isLoaded,
    cachedImage: imageCache.get(src)?.image || null,
  };
};

// UTILITÁRIOS
export const getImageCacheStats = () => {
  const entries = Array.from(imageCache.values());
  const totalSize = entries.reduce((sum, e) => sum + e.size, 0);
  const totalLoadTime = entries.reduce((sum, e) => sum + e.loadTime, 0);

  return {
    totalImages: imageCache.size,
    totalSize: totalSize / 1024 / 1024, // MB
    averageLoadTime: entries.length > 0 ? totalLoadTime / entries.length : 0,
    failedImages: failedImages.size,
    loadingImages: loadingPromises.size,
  };
};

export const clearImageCache = () => {
  imageCache.clear();
  loadingPromises.clear();
  failedImages.clear();
  preloadQueue.clear();
};
