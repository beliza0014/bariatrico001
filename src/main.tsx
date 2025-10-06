import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { preloadLogo } from '@/hooks/useLogoCache'
import { ErrorBoundary } from './components/ErrorBoundary'

// PRELOAD CRÍTICO: Logo carregada imediatamente no startup
preloadLogo();

// PRELOAD CRÍTICO: Imagem principal da landing page
const preloadHeroImage = () => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = '/lovable-uploads/7b7d27ab-f22a-4116-8992-141c880e5f42.png';
  link.fetchPriority = 'high';
  document.head.appendChild(link);
};

preloadHeroImage();

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
