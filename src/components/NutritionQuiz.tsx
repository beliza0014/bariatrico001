import React, { useEffect } from 'react';
import { QuizProvider, useQuiz } from '@/contexts/QuizContext';
import { useInvisibleImageCache } from '@/hooks/useInvisibleImageCache';
import { useQuizAudio } from '@/hooks/useQuizAudio';
import { PreloadHeadManager } from '@/components/ui/PreloadHeadManager';
import { Page01Landing } from './pages/Page01Landing';
import { Page02Question1 } from './pages/Page02Question1';
import { Page03Question2 } from './pages/Page03Question2';
import { Page04BodyMap } from './pages/Page04BodyMap';
import { Page05Age } from './pages/Page05Age';
import { Page06WeightGoal } from './pages/Page06WeightGoal';
import { Page07SocialProof } from './pages/Page07SocialProof';
import { Page06WeightImpact } from './pages/Page06WeightImpact';
import { Page08NameInput } from './pages/Page08NameInput';
import { Page09BodyType } from './pages/Page09BodyType';
import { Page10DailyRoutine } from './pages/Page10DailyRoutine';
import { Page11WeightLossBarriers } from './pages/Page11WeightLossBarriers';
import { Page12PhysicalDifficulties } from './pages/Page12PhysicalDifficulties';
import { Page13TestimonialNew } from './pages/Page13TestimonialNew';
import { Page14VSLNutritionistAuthority } from './pages/Page14VSLNutritionistAuthority';
import { Page15WeightTriggers } from './pages/Page15WeightTriggers';
import { Page22WaterIntake } from './pages/Page22WaterIntake';
import { Page17DesiredBenefits } from './pages/Page17DesiredBenefits';
import { Page18FaceTransformation } from './pages/Page18FaceTransformation';
import { Page19HeightWeight } from './pages/Page19HeightWeight';
import { Page20DesiredWeight } from './pages/Page20DesiredWeight';
import { Page23FruitPreferences } from './pages/Page23FruitPreferences';
import { Page20DailyRoutineQuestion } from './pages/Page20DailyRoutineQuestion';
import { Page21SleepHoursQuestion } from './pages/Page21SleepHoursQuestion';
import { Page16ObjecoesCondicionais } from './pages/Page16ObjecoesCondicionais';
import { Page24TripleAnalysis } from './pages/Page24TripleAnalysis';
import { Page25PreCheckout } from './pages/Page25PreCheckout';
import { Page25bContactCapture } from './pages/Page25bContactCapture';
import Page25cConfirmation from './pages/Page25cConfirmation';
import { Page26Checkout } from './pages/Page26Checkout';
import { Page27ThankYou } from './pages/Page27ThankYou';

// Small helper to auto-skip placeholder step 21 to avoid duplicate WaterIntake rendering
const AutoAdvance: React.FC = () => {
  const { nextPage } = useQuiz();
  useEffect(() => {
    nextPage();
  }, []);
  return null;
};

const QuizContent: React.FC = () => {
  const { currentPage } = useQuiz();
  // REDUZIDO: Logging menos verboso para evitar spam
  if (process.env.NODE_ENV !== 'production' && currentPage !== 1) {
    console.log('🔍 QuizContent rendering, currentPage:', currentPage);
  }
  const audio = useQuizAudio(currentPage);
  
  // SISTEMA INVISÍVEL DE CACHE DE IMAGENS
  const { stats } = useInvisibleImageCache(currentPage);
  
  // PRELOAD HEAD MANAGER - Otimiza carregamento de imagens críticas
  useEffect(() => {
    // Apenas em produção para não poluir console
    if (process.env.NODE_ENV !== 'production') {
      console.log('📸 Image preload stats:', stats);
    }
  }, [stats]);

  // THROTTLED: Log apenas quando não é página 1 para reduzir spam de logs
  if (process.env.NODE_ENV !== 'production' && currentPage !== 1) {
    console.log('🚀 QuizContent render:', { 
      currentPage, 
      cacheStats: stats
    });
  }

  // Audio events are now handled directly by individual pages

  const renderPage = () => {
    const pageComponent = (() => {
      switch (currentPage) {
        // Quiz pages 1-34 - Sequential order matching QUIZ_ORDER
        case 1: return <Page01Landing audio={audio} />; // landing
        case 2: return <Page02Question1 audio={audio} />; // objetivo_principal  
        case 3: return <Page03Question2 audio={audio} />; // genero
        case 4: return <Page04BodyMap audio={audio} />; // mapa_corporal
        case 5: return <Page05Age audio={audio} />; // idade
        case 6: return <Page06WeightGoal audio={audio} />; // meta_peso
        case 7: return <Page07SocialProof audio={audio} />; // prova_social
        case 8: return <Page08NameInput audio={audio} />; // nome
        case 9: return <Page09BodyType audio={audio} />; // tipo_de_corpo
        case 10: return <Page10DailyRoutine audio={audio} />; // rotina_diaria
        case 11: return <Page15WeightTriggers audio={audio} />; // gatilhos
        case 12: return <Page12PhysicalDifficulties audio={audio} />; // dificuldades_fisicas
        case 13: return <Page13TestimonialNew audio={audio} />; // transformacoes
        case 14: return <Page14VSLNutritionistAuthority audio={audio} />; // vsl_autoridade
        case 15: return <Page11WeightLossBarriers audio={audio} />; // barreiras
        case 16: return <Page16ObjecoesCondicionais audio={audio} />; // objecoes_condicionais - COMO O CHÁ FUNCIONA
        case 17: return <Page19HeightWeight audio={audio} />; // altura_peso
        case 18: return <Page20DesiredWeight audio={audio} />; // peso_desejado
        case 19: return <Page18FaceTransformation audio={audio} />; // face_transformation
        case 20: return <Page20DailyRoutineQuestion audio={audio} />; // score_irr (PLACEHOLDER)
        case 21: return <Page21SleepHoursQuestion audio={audio} />; // interpretacao_irr (PLACEHOLDER)
        case 22: return <AutoAdvance />; // ritual_3_passos (auto-skip placeholder)
        case 23: return <Page22WaterIntake audio={audio} />; // consumo_de_agua
        case 24: return <Page23FruitPreferences audio={audio} />; // preferencias_de_frutas
        case 25: return <Page17DesiredBenefits audio={audio} />; // beneficios
        case 26: return <Page24TripleAnalysis audio={audio} />; // analise_tripla
        case 27: return <Page25PreCheckout audio={audio} />; // pre_checkout
        case 28: return <Page25bContactCapture audio={audio} />; // contact_capture
        case 29: return <Page25cConfirmation />; // confirmation
        case 30: return <Page26Checkout audio={audio} />; // checkout
        case 31: return <Page27ThankYou audio={audio} />; // obrigado
        default: return <Page01Landing />;
      }
    })();

    return pageComponent;
  };

  // RENDERIZAÇÃO SEMPRE INSTANTÂNEA - SISTEMA INVISÍVEL COM PRELOAD
  return (
    <>
      <PreloadHeadManager currentPage={currentPage} />
      {renderPage()}
    </>
  );
};

export const NutritionQuiz: React.FC = () => {
  // LOGGING REDUZIDO: Apenas quando necessário
  if (process.env.NODE_ENV !== 'production') {
    console.log('🔍 NutritionQuiz mounted');
  }
  
  return (
    <QuizProvider>
      <QuizContent />
    </QuizProvider>
  );
};
