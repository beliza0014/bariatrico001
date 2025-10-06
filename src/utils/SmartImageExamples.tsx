// EXEMPLOS DE USO DO SISTEMA DE IMAGENS SIMPLIFICADO

import React from 'react';
import { SmartImage, BodyImage, AvatarImage, FruitImage, CardImage } from '@/components/ui/SmartImage';
import { LazyImage } from '@/components/ui/LazyImage';

// EXEMPLO 1: Substituição direta de <img> por <LazyImage>
export const BasicImageReplacement = ({ currentPage }: { currentPage: number }) => (
  <div className="space-y-4">
    {/* DEPOIS: LazyImage com preload transparente */}
    <LazyImage
      src="/lovable-uploads/example.png"
      alt="Example"
      className="w-full h-auto"
      priority={currentPage === 1}
    />
  </div>
);

// EXEMPLO 2: Sistema Legacy (SmartImage) - Para compatibilidade
export const LegacySmartImageExample = ({ currentPage }: { currentPage: number }) => (
  <div className="space-y-4">
    <SmartImage
      src="/lovable-uploads/legacy-image.png"
      alt="Legacy example"
      currentPage={currentPage}
      className="w-full h-auto"
    />
  </div>
);