import { useEffect } from 'react';

export function useQuizStep(label: string) {
  useEffect(() => {
    // Removido tracking customizado - usando apenas eventos padrão da Meta
    console.log(`Quiz step: ${label}`);
  }, [label]);
}