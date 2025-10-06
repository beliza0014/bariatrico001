// PRELOAD HEAD MANAGER OTIMIZADO
// Injeta <link rel="preload"> apenas para imagens CRÍTICAS da página atual

import { useEffect, useRef } from 'react';
import { getPreloadStrategy } from '@/utils/imagePreloadStrategy';

interface PreloadHeadManagerProps {
  currentPage: number;
}

export const PreloadHeadManager: React.FC<PreloadHeadManagerProps> = ({ 
  currentPage 
}) => {
  const preloadLinksRef = useRef<HTMLLinkElement[]>([]);

  useEffect(() => {
    const strategy = getPreloadStrategy(currentPage);
    
    // Remove links antigos
    preloadLinksRef.current.forEach(link => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    });
    preloadLinksRef.current = [];
    
    // Adiciona imagens CRÍTICAS e ESSENCIAIS com priorização
    const criticalImages = strategy.critical.slice(0, 5); // Top 5 críticas
    const essentialImages = strategy.essential.slice(0, 3); // Top 3 essenciais
    
    // Preload crítico com fetchPriority=high
    criticalImages.forEach(src => {
      if (src && !document.querySelector(`link[href="${CSS.escape(src)}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        link.fetchPriority = 'high';
        
        document.head.appendChild(link);
        preloadLinksRef.current.push(link);
      }
    });
    
    // Preload essencial com fetchPriority=auto
    essentialImages.forEach(src => {
      if (src && !document.querySelector(`link[href="${CSS.escape(src)}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        link.fetchPriority = 'auto';
        
        document.head.appendChild(link);
        preloadLinksRef.current.push(link);
      }
    });
    
    // Cleanup ao desmontar
    return () => {
      preloadLinksRef.current.forEach(link => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
      preloadLinksRef.current = [];
    };
  }, [currentPage]);

  return null;
};