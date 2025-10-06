import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface QuizAnswer {
  question: string;
  answer: string | string[];
  pageNumber: number;
  timestamp: number;
}

export interface QuizContextType {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  navigateWithVideoAutoPlay: (page: number) => void;
  navigateToPreviousPage: () => void;
  shouldAutoPlayVideo: boolean;
  answers: QuizAnswer[];
  addAnswer: (question: string, answer: string | string[]) => void;
  getAnswer: (question: string) => QuizAnswer | undefined;
  discount: number;
  recommendation: string;
  progress: number;
  totalSteps: number;
  correctAnswers: number;
  streakCount: number;
  points: number;
  nextPage: () => void;
  resetQuiz: () => void;
  userInfo: {
    name: string;
    age?: string;        // Added for unarchived age page
    body_type?: string;  // Added for unarchived body type page  
    height?: number;     // Added for unarchived height/weight page
    weight?: number;     // Added for unarchived height/weight page
    desired_weight?: number; // Added for desired weight page
  };
  updateUserInfo: (info: Partial<QuizContextType['userInfo']>) => void;
  isComplete: boolean;
  startTime: number;
  leadId: string; // Lead ID para sistema de remarketing
  progressInfo: {
    activeBar: number;
    progress: number;
    bar1Progress: number;
    bar2Progress: number;
    bar3Progress: number;
    bar4Progress: number;
  };
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

interface QuizProviderProps {
  children: ReactNode;
}

export const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [shouldAutoPlayVideo, setShouldAutoPlayVideo] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [streakCount, setStreakCount] = useState(0);
  const [points, setPoints] = useState(0);
  const [startTime] = useState(Date.now());
  const [sessionId] = useState(() => {
    // Gerar ou recuperar session_id único
    const saved = localStorage.getItem('quiz-session-id');
    if (saved) return saved;
    const newId = crypto.randomUUID();
    localStorage.setItem('quiz-session-id', newId);
    return newId;
  });
  
  // Lead ID para rastreamento completo (sistema de remarketing)
  const [leadId] = useState(() => {
    const saved = localStorage.getItem('nutrition-quiz-lead-id');
    if (saved) return saved;
    const newId = crypto.randomUUID();
    localStorage.setItem('nutrition-quiz-lead-id', newId);
    
    // Inicializar lead em background (fire-and-forget)
    supabase.functions.invoke('init-lead', {
      body: { lead_id: newId }
    }).catch(() => {}); // Falha silenciosa
    
    return newId;
  });
  const [userInfo, setUserInfo] = useState({
    name: '',
    age: '',
    body_type: '',
    height: 0,
    weight: 0,
    desired_weight: 0,
  });

  const totalSteps = 31; // Updated: added confirmation page after contact capture
  const discount = 60;
  const recommendation = "Protocolo Nutricional Personalizado Premium";

  // Calculate 4-bar progress system (BetterMe exact) - Updated for 31 pages
  const getProgressBarInfo = (currentPage: number) => {
    // Segment 1: Pages 1-8 (8 pages)
    // Segment 2: Pages 9-16 (8 pages)  
    // Segment 3: Pages 17-24 (8 pages)
    // Segment 4: Pages 25-31 (7 pages)
    
    if (currentPage <= 8) {
      return {
        activeBar: 1,
        progress: Math.round((currentPage / 8) * 100),
        bar1Progress: Math.round((currentPage / 8) * 100),
        bar2Progress: 0,
        bar3Progress: 0,
        bar4Progress: 0
      };
    } else if (currentPage <= 16) {
      return {
        activeBar: 2,
        progress: Math.round(((currentPage - 8) / 8) * 100),
        bar1Progress: 100,
        bar2Progress: Math.round(((currentPage - 8) / 8) * 100),
        bar3Progress: 0,
        bar4Progress: 0
      };
    } else if (currentPage <= 24) {
      return {
        activeBar: 3,
        progress: Math.round(((currentPage - 16) / 8) * 100),
        bar1Progress: 100,
        bar2Progress: 100,
        bar3Progress: Math.round(((currentPage - 16) / 8) * 100),
        bar4Progress: 0
      };
    } else {
      return {
        activeBar: 4,
        progress: Math.round(((currentPage - 24) / 7) * 100),
        bar1Progress: 100,
        bar2Progress: 100,
        bar3Progress: 100,
        bar4Progress: Math.round(((currentPage - 24) / 7) * 100)
      };
    }
  };

  const progressInfo = getProgressBarInfo(currentPage);
  const progress = Math.round((currentPage / totalSteps) * 100); // Keep for backward compatibility
  const correctAnswers = answers.length;
  const isComplete = currentPage >= totalSteps;

  // Load saved data on mount but always start from page 1
  useEffect(() => {
    const savedData = localStorage.getItem('nutrition-quiz-data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Always start from page 1 on page reload
        setCurrentPage(1);
        setAnswers(parsed.answers || []);
        setStreakCount(parsed.streakCount || 0);
        setPoints(parsed.points || 0);
        setUserInfo(parsed.userInfo || userInfo);
      } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading saved quiz data:', error);
      }
      }
    }
  }, []);

  // Save data whenever state changes (localStorage + Cloud)
  useEffect(() => {
    const dataToSave = {
      currentPage,
      answers,
      streakCount,
      points,
      userInfo,
      timestamp: Date.now(),
    };
    localStorage.setItem('nutrition-quiz-data', JSON.stringify(dataToSave));

    // Salvar respostas no Cloud em background (não bloqueia UI)
    if (answers.length > 0) {
      saveAnswersToCloud();
    }
  }, [currentPage, answers, streakCount, points, userInfo]);

  // Função para salvar respostas no Cloud (save-quiz-answers)
  const saveAnswersToCloud = async () => {
    if (answers.length === 0) return;
    
    try {
      await supabase.functions.invoke('save-quiz-answers', {
        body: {
          lead_id: leadId,
          answers: answers.map(a => ({
            question: a.question,
            answer: a.answer,
            pageNumber: a.pageNumber,
            timestamp: a.timestamp
          })),
        },
      });
    } catch (error) {
      // Falha silenciosa - localStorage é fallback
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao salvar respostas:', error);
      }
    }
  };

  // Scroll to top whenever page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const navigateWithVideoAutoPlay = (page: number) => {
    setShouldAutoPlayVideo(true);
    setCurrentPage(page);
    setTimeout(() => setShouldAutoPlayVideo(false), 1000);
  };

  const navigateToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const addAnswer = (question: string, answer: string | string[]) => {
    const newAnswer: QuizAnswer = {
      question,
      answer,
      pageNumber: currentPage,
      timestamp: Date.now(),
    };

    setAnswers(prev => {
      const filtered = prev.filter(a => a.question !== question);
      return [...filtered, newAnswer];
    });

    // Update streak and points
    setStreakCount(prev => prev + 1);
    setPoints(prev => prev + 10 + (streakCount * 2)); // Bonus for streaks
  };

  const getAnswer = (question: string) => {
    return answers.find(a => a.question === question);
  };

  const nextPage = () => {
    if (currentPage < totalSteps) {
      console.log('➡️ nextPage(): advancing', { from: currentPage, to: currentPage + 1, totalSteps });
      setCurrentPage(currentPage + 1);
    } else {
      console.log('ℹ️ nextPage(): already at last page', { currentPage, totalSteps });
    }
  };

  const resetQuiz = () => {
    setCurrentPage(1);
    setAnswers([]);
    setStreakCount(0);
    setPoints(0);
    setUserInfo({
      name: '',
      age: '',
      body_type: '', 
      height: 0,
      weight: 0,
      desired_weight: 0,
    });
    localStorage.removeItem('nutrition-quiz-data');
  };

  const updateUserInfo = (info: Partial<QuizContextType['userInfo']>) => {
    setUserInfo(prev => ({ ...prev, ...info }));
  };

  const value: QuizContextType = {
    currentPage,
    setCurrentPage,
    navigateWithVideoAutoPlay,
    navigateToPreviousPage,
    shouldAutoPlayVideo,
    answers,
    addAnswer,
    getAnswer,
    discount,
    recommendation,
    progress,
    totalSteps,
    correctAnswers,
    streakCount,
    points,
    nextPage,
    resetQuiz,
    userInfo,
    updateUserInfo,
    isComplete,
    startTime,
    leadId,
    progressInfo,
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};