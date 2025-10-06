import { useEffect, useState } from 'react';

interface LogoCacheState {
  isLoaded: boolean;
  imageUrl: string | null;
  error: string | null;
}

// CACHE GLOBAL ÚNICO PARA A LOGO
let globalLogoCache: HTMLImageElement | null = null;
let logoPromise: Promise<HTMLImageElement> | null = null;

const LOGO_URL = "/lovable-uploads/8a30a798-2dcb-4fa8-a240-d4c310691528.png";

// FUNÇÃO PARA CARREGAR LOGO UMA ÚNICA VEZ
const loadLogoOnce = (): Promise<HTMLImageElement> => {
  if (globalLogoCache) {
    return Promise.resolve(globalLogoCache);
  }

  if (logoPromise) {
    return logoPromise;
  }

  logoPromise = new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        globalLogoCache = img;
        if (process.env.NODE_ENV !== 'production') {
          console.log('✅ LOGO CACHED: Logo carregada uma única vez');
        }
        resolve(img);
      } else {
        reject(new Error('Invalid logo dimensions'));
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load logo'));
    };
    
    // CONFIGURAÇÕES OTIMIZADAS PARA LOGO
    img.fetchPriority = 'high';
    img.decoding = 'async';
    img.loading = 'eager';
    img.crossOrigin = 'anonymous';
    img.src = LOGO_URL;
  });

  return logoPromise;
};

// HOOK PARA USAR A LOGO CACHEADA
export const useLogoCache = () => {
  const [state, setState] = useState<LogoCacheState>(() => {
    // INICIALIZAÇÃO IMEDIATA: Se já está em cache, retorna loaded imediatamente
    if (globalLogoCache) {
      return {
        isLoaded: true,
        imageUrl: globalLogoCache.src,
        error: null
      };
    }
    return {
      isLoaded: false,
      imageUrl: null,
      error: null
    };
  });

  useEffect(() => {
    // Se já está em cache, não precisa fazer nada
    if (globalLogoCache) {
      return;
    }

    loadLogoOnce()
      .then((image) => {
        setState({
          isLoaded: true,
          imageUrl: image.src,
          error: null
        });
      })
      .catch((error) => {
        setState({
          isLoaded: false,
          imageUrl: null,
          error: error.message
        });
      });
  }, []);

  return {
    ...state,
    logoUrl: LOGO_URL,
    isCached: !!globalLogoCache
  };
};

// FUNÇÃO PARA PRELOAD DA LOGO (chamada no app start)
export const preloadLogo = () => {
  loadLogoOnce().catch(console.error);
};

// FUNÇÃO PARA LIMPAR CACHE (se necessário)
export const clearLogoCache = () => {
  globalLogoCache = null;
  logoPromise = null;
  console.log('🧹 Logo cache cleared');
};