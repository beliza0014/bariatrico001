import { useState, useEffect } from 'react';
import { useQuiz } from '@/contexts/QuizContext';
import { useSoundContext } from '@/contexts/SoundContext';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface GamificationState {
  points: number;
  level: number;
  achievements: Achievement[];
  streakCount: number;
  celebrationTrigger: boolean;
  showAchievement: Achievement | null;
}

const achievementDefinitions: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'fast_responder',
    name: 'Resposta Rápida',
    description: 'Respondeu em menos de 5 segundos',
    icon: '⚡',
    condition: '< 5s'
  },
  {
    id: 'streak_5',
    name: 'Sequência de 5',
    description: '5 respostas seguidas',
    icon: '🔥',
    condition: '5 streak'
  },
  {
    id: 'halfway_hero',
    name: 'Meio Caminho',
    description: 'Completou 50% do quiz',
    icon: '🎯',
    condition: '12/23 pages'
  },
  {
    id: 'completion',
    name: 'Quiz Completo',
    description: 'Completou todas as 23 páginas',
    icon: '🏆',
    condition: '23/23 pages'
  },
  {
    id: 'detail_focused',
    name: 'Focado nos Detalhes',
    description: 'Preencheu informações pessoais completas',
    icon: '📋',
    condition: 'complete profile'
  }
];

export const useGamificationSystem = () => {
  const { points, streakCount, currentPage, userInfo } = useQuiz();
  const { playSpatialSound, playEnhancedConfettiCelebration } = useSoundContext();
  const [achievements, setAchievements] = useState<Achievement[]>(
    achievementDefinitions.map(def => ({ ...def, unlocked: false }))
  );
  const [celebrationTrigger, setCelebrationTrigger] = useState(false);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);
  const [lastResponseTime, setLastResponseTime] = useState<number>(0);

  const level = Math.floor(points / 100) + 1;
  const celebrationPages = [6, 12, 18, 23];

  // Check for achievement unlocks
  useEffect(() => {
    const newAchievements = [...achievements];
    let hasNewAchievement = false;

    // Fast responder achievement
    if (lastResponseTime > 0 && Date.now() - lastResponseTime < 5000) {
      const fastAchievement = newAchievements.find(a => a.id === 'fast_responder');
      if (fastAchievement && !fastAchievement.unlocked) {
        fastAchievement.unlocked = true;
        fastAchievement.unlockedAt = Date.now();
        hasNewAchievement = true;
        setShowAchievement(fastAchievement);
      }
    }

    // Streak achievement
    if (streakCount >= 5) {
      const streakAchievement = newAchievements.find(a => a.id === 'streak_5');
      if (streakAchievement && !streakAchievement.unlocked) {
        streakAchievement.unlocked = true;
        streakAchievement.unlockedAt = Date.now();
        hasNewAchievement = true;
        setShowAchievement(streakAchievement);
      }
    }

    // Halfway achievement
    if (currentPage >= 12) {
      const halfwayAchievement = newAchievements.find(a => a.id === 'halfway_hero');
      if (halfwayAchievement && !halfwayAchievement.unlocked) {
        halfwayAchievement.unlocked = true;
        halfwayAchievement.unlockedAt = Date.now();
        hasNewAchievement = true;
        setShowAchievement(halfwayAchievement);
      }
    }

    // Completion achievement
    if (currentPage >= 23) {
      const completionAchievement = newAchievements.find(a => a.id === 'completion');
      if (completionAchievement && !completionAchievement.unlocked) {
        completionAchievement.unlocked = true;
        completionAchievement.unlockedAt = Date.now();
        hasNewAchievement = true;
        setShowAchievement(completionAchievement);
      }
    }

    // Detail focused achievement - only check if name is provided
    if (userInfo.name) {
      const detailAchievement = newAchievements.find(a => a.id === 'detail_focused');
      if (detailAchievement && !detailAchievement.unlocked) {
        detailAchievement.unlocked = true;
        detailAchievement.unlockedAt = Date.now();
        hasNewAchievement = true;
        setShowAchievement(detailAchievement);
      }
    }

    if (hasNewAchievement) {
      setAchievements(newAchievements);
      // Play achievement sound
      setTimeout(() => {
        playSpatialSound('achievement', 1.0, { x: 0, y: 0.2, z: -0.3 });
      }, 100);
    }
  }, [streakCount, currentPage, userInfo, lastResponseTime, achievements]);

  // Celebration trigger
  useEffect(() => {
    if (celebrationPages.includes(currentPage)) {
      setCelebrationTrigger(true);
      // Play enhanced celebration sounds
      setTimeout(() => {
        playEnhancedConfettiCelebration();
      }, 300);
      setTimeout(() => setCelebrationTrigger(false), 3000);
    }
  }, [currentPage, playEnhancedConfettiCelebration]);

  const recordResponseTime = () => {
    setLastResponseTime(Date.now());
  };

  const dismissAchievement = () => {
    setShowAchievement(null);
  };

  const getUnlockedAchievements = () => {
    return achievements.filter(a => a.unlocked);
  };

  const getProgressToNextLevel = () => {
    const currentLevelPoints = (level - 1) * 100;
    const nextLevelPoints = level * 100;
    const progress = ((points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
    return Math.min(progress, 100);
  };

  return {
    points,
    level,
    achievements,
    streakCount,
    celebrationTrigger,
    showAchievement,
    recordResponseTime,
    dismissAchievement,
    getUnlockedAchievements,
    getProgressToNextLevel,
  };
};