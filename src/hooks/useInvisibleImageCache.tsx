// DEPRECIADO: Este arquivo foi substituído por useOptimizedImageCache.tsx
// Mantido apenas para compatibilidade durante a transição

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  useOptimizedImageCache as useNewCache,
  useImageCache as useNewImageCache 
} from './useOptimizedImageCache';
import { detectUserFlow } from '@/utils/userFlowDetection';

interface CachedImage {
  image: HTMLImageElement;
  timestamp: number;
  loadTime: number;
}

interface CacheStats {
  total: number;
  loaded: number;
  failed: number;
  memoryUsage: number;
}

// CACHE GLOBAL SIMPLES COM MAP
const imageCache = new Map<string, CachedImage>();
const loadingPromises = new Map<string, Promise<HTMLImageElement>>();
const CACHE_MAX_SIZE = 120; // AUMENTADO de 50 para 120
const CACHE_EXPIRY = 45 * 60 * 1000; // AUMENTADO de 15 para 45 minutos

// PRELOAD INDIVIDUAL OTIMIZADO COM TRATAMENTO DE ERRO ROBUSTO
const preloadImage = async (src: string, priority: 'critical' | 'essential' | 'high' | 'normal' = 'normal'): Promise<HTMLImageElement | null> => {
  try {
    // Cache hit - retorna imediatamente
    if (imageCache.has(src)) {
      const cached = imageCache.get(src)!;
      // Atualiza timestamp para LRU
      imageCache.set(src, { ...cached, timestamp: Date.now() });
      return cached.image;
    }
    
    // Se já está carregando, retorna a promise existente
    if (loadingPromises.has(src)) {
      return loadingPromises.get(src)! as Promise<HTMLImageElement>;
    }
    
    const startTime = Date.now();
    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      
      // Otimizações baseadas em prioridade
      if (priority === 'critical' || priority === 'essential') {
        img.fetchPriority = 'high';
        img.loading = 'eager';
      } else {
        img.fetchPriority = 'low';
        img.loading = 'lazy';
      }
      
      img.decoding = 'async';
      
      // CORS apenas para assets externos (não lovable-uploads)
      if (!src.includes('/lovable-uploads/') && !src.startsWith('/src/')) {
        img.crossOrigin = 'anonymous';
      }
      
      img.onload = () => {
        const loadTime = Date.now() - startTime;
        
        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
          // Adiciona ao cache
          imageCache.set(src, {
            image: img,
            timestamp: Date.now(),
            loadTime
          });
          
          // Limpeza do cache se necessário
          cleanupCache();
          
          resolve(img);
        } else {
          reject(new Error(`Invalid image: ${src}`));
        }
      };
      
      img.onerror = (error) => {
        // Log warning mas não quebra o sistema
        console.warn(`Failed to preload image: ${src}`, error);
        
        // Track error para monitoramento (opcional)
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'image_load_error', {
            src: src,
            priority: priority
          });
        }
        
        reject(new Error(`Failed to load: ${src}`));
      };
      
      img.src = src;
    });
    
    loadingPromises.set(src, promise);
    
    // Remove da lista de loading quando completar
    promise.finally(() => {
      loadingPromises.delete(src);
    });
    
    return promise;
  } catch (error) {
    console.warn(`Error setting up preload for ${src}:`, error);
    return null; // Return null instead of throwing
  }
};

// LIMPEZA INTELIGENTE DO CACHE
const cleanupCache = () => {
  if (imageCache.size <= CACHE_MAX_SIZE) return;
  
  const now = Date.now();
  const entries = Array.from(imageCache.entries());
  
  // Remove imagens expiradas primeiro
  const validEntries = entries.filter(([_, data]) => 
    now - data.timestamp < CACHE_EXPIRY
  );
  
  // Se ainda tem muitas, remove as mais antigas (LRU)
  if (validEntries.length > CACHE_MAX_SIZE) {
    validEntries.sort((a, b) => b[1].timestamp - a[1].timestamp);
    validEntries.splice(CACHE_MAX_SIZE);
  }
  
  // Reconstrói o cache
  imageCache.clear();
  validEntries.forEach(([src, data]) => {
    imageCache.set(src, data);
  });
};

// HOOK PRINCIPAL: Agora usa o sistema otimizado
export const useInvisibleImageCache = (currentPage: number) => {
  // Redireciona para o novo sistema otimizado
  return useNewCache(currentPage);
};

// HOOK SIMPLES: Agora usa o sistema otimizado
export const useImageCache = (src: string) => {
  return useNewImageCache(src);
};