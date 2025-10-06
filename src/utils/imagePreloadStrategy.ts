// ESTRATÉGIA INTELIGENTE DE PRELOAD
// Sistema invisível que prioriza imagens baseado na navegação do usuário

import { AUDITED_IMAGE_MAP } from './imageAudit';
import { detectUserFlow, getFlowSpecificImages, UserFlow } from './userFlowDetection';

export interface PreloadStrategy {
  critical: string[];    // Página atual - carrega imediatamente
  essential: string[];   // Próxima página - carrega em 100ms
  high: string[];       // 2-3 páginas à frente - carrega em 2s
  normal: string[];     // Resto - carrega em idle time
}

export const getPreloadStrategy = (currentPage: number): PreloadStrategy => {
  const userFlow = detectUserFlow();
  
  // CRÍTICO: Página atual - limita a 5 imagens mais importantes
  const currentPageImages = AUDITED_IMAGE_MAP[currentPage as keyof typeof AUDITED_IMAGE_MAP] || [];
  const critical = getFlowSpecificImages(currentPageImages, userFlow).slice(0, 5);
  
  // ESSENCIAL: Próxima página - limita a 5 imagens
  const nextPageImages = AUDITED_IMAGE_MAP[(currentPage + 1) as keyof typeof AUDITED_IMAGE_MAP] || [];
  const essential = getFlowSpecificImages(nextPageImages, userFlow).slice(0, 5);
  
  // ALTA: 2-3 páginas à frente - limita a 8 imagens
  const high: string[] = [];
  for (let i = 2; i <= 3; i++) {
    const pageImages = AUDITED_IMAGE_MAP[(currentPage + i) as keyof typeof AUDITED_IMAGE_MAP] || [];
    high.push(...getFlowSpecificImages(pageImages, userFlow));
  }
  
  // NORMAL: Resto do quiz (páginas 4+ à frente)
  const normal: string[] = [];
  for (let i = 4; i <= 10; i++) {
    const pageNum = currentPage + i;
    if (pageNum <= 31) { // Máximo de 31 páginas no quiz
      const pageImages = AUDITED_IMAGE_MAP[pageNum as keyof typeof AUDITED_IMAGE_MAP] || [];
      normal.push(...getFlowSpecificImages(pageImages, userFlow));
    }
  }
  
  return {
    critical: [...new Set(critical)],
    essential: [...new Set(essential)],
    high: [...new Set(high)],
    normal: [...new Set(normal)]
  };
};

// UTILITÁRIO: Verificar se imagem é necessária para o fluxo atual
export const isImageNeededForFlow = (imageUrl: string, flow: UserFlow): boolean => {
  return getFlowSpecificImages([imageUrl], flow).length > 0;
};

// UTILITÁRIO: Obter todas as imagens necessárias para o quiz completo
export const getAllQuizImages = (flow?: UserFlow): string[] => {
  const detectedFlow = flow || detectUserFlow();
  const allImages: string[] = [];
  
  // Percorre todas as páginas do quiz
  Object.values(AUDITED_IMAGE_MAP).forEach(pageImages => {
    allImages.push(...getFlowSpecificImages(pageImages, detectedFlow));
  });
  
  return [...new Set(allImages)]; // Remove duplicatas
};