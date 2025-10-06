import { useEffect, useRef } from 'react';

// HOOK UTILITÁRIO: Throttle para effects problemáticos
export const useThrottledEffect = (
  effect: () => void | (() => void),
  deps: React.DependencyList,
  delay: number = 100
) => {
  const lastRun = useRef(Date.now());
  
  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRun.current >= delay) {
        lastRun.current = Date.now();
        return effect();
      }
    }, delay);

    return () => clearTimeout(handler);
  }, [...deps, delay]);
};