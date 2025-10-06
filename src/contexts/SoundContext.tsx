import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { SoundState, SoundKey, PlayOptions, GameSoundType, SpatialSoundType, SpatialPosition } from '@/audio/types';
import { useGameifiedAudioSystem } from '@/hooks/useGameifiedAudioSystem';
import { useAdvancedSpatialSounds } from '@/hooks/useAdvancedSpatialSounds';
import { useAdvancedGameSounds } from '@/hooks/useAdvancedGameSounds';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';
import { useTelemetrySystem } from '@/hooks/useTelemetrySystem';

interface SoundContextType extends SoundState {
  // Core functions
  initializeAudioOnUserGesture: () => Promise<void>;
  
  // Public API from spec
  playButtonClick: () => void;
  playCorrectAnswer: () => void;
  playPageTransition: () => void;
  playVictorySequence: () => void;
  playEnhancedWheelSpin: (durationMs?: number) => void;
  playEnhancedConfettiCelebration: () => void;
  
  // Individual sound controls
  playAchievement: () => void;
  playApplause: () => void;
  playConfettiPop: () => void;
  playPageOpen: () => void;
  
  // Generic functions
  playGameSound: (type: GameSoundType, intensity?: number, position?: SpatialPosition) => void;
  playSpatialSound: (type: SpatialSoundType, intensity?: number, position?: SpatialPosition) => void;
  
  // Countdown functionality
  startCountdown: (totalSeconds: number, onTimeAlert?: () => void, onTimeUp?: () => void) => void;
  
  // Controls
  toggleSound: () => void;
  setVolume: (volume: number) => void;
  setSoundSourceMode: (mode: 'auto' | 'baked-first') => void;
  stopAllSounds: () => void;
  
  // Device capabilities & diagnostics
  deviceCapabilities: ReturnType<typeof useDeviceCapabilities>;
  soundSourceMode: 'auto' | 'baked-first';
  audioBuffers: Map<SoundKey, { buffer: AudioBuffer; source: 'file' | 'cdn' | 'baked' }>;
}

const SoundContext = createContext<SoundContextType | null>(null);

export const useSoundContext = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSoundContext must be used within SoundProvider');
  }
  return context;
};

interface SoundProviderProps {
  children: React.ReactNode;
}

export const SoundProvider: React.FC<SoundProviderProps> = ({ children }) => {
  const deviceCapabilities = useDeviceCapabilities();
  
  const gameifiedAudio = useGameifiedAudioSystem();
  const spatialSounds = useAdvancedSpatialSounds(
    gameifiedAudio.isUnlocked ? (window as any).audioContext : null,
    gameifiedAudio.isUnlocked ? (window as any).masterGain : null
  );
  const gameSounds = useAdvancedGameSounds(
    gameifiedAudio.isUnlocked ? (window as any).audioContext : null,
    gameifiedAudio.isUnlocked ? (window as any).masterGain : null
  );

  const [countdownInterval, setCountdownInterval] = useState<NodeJS.Timeout | null>(null);

  // Load preferences from localStorage
  useEffect(() => {
    const savedPrefs = localStorage.getItem('quiz_audio_prefs');
    if (savedPrefs) {
      try {
        const prefs = JSON.parse(savedPrefs);
        gameifiedAudio.setEnabled(prefs.enabled ?? true);
        gameifiedAudio.setMuted(prefs.muted ?? false);
        if (prefs.masterVolume !== undefined) {
          gameifiedAudio.setVolume(prefs.masterVolume);
        }
        if (prefs.soundSourceMode !== undefined) {
          gameifiedAudio.setSoundSourceMode(prefs.soundSourceMode);
        }
      } catch (error) {
        // Failed to load audio preferences - handle silently in production
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Failed to load audio preferences:', error);
        }
      }
    }

    // Check for legacy gamified audio setting
    const gamifiedEnabled = localStorage.getItem('gamified_audio_enabled');
    if (gamifiedEnabled !== null) {
      gameifiedAudio.setEnabled(gamifiedEnabled === 'true');
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    const prefs = {
      enabled: gameifiedAudio.enabled,
      muted: gameifiedAudio.muted,
      masterVolume: gameifiedAudio.masterVolume,
      soundSourceMode: gameifiedAudio.soundSourceMode,
      spatial: true // Always enable spatial for now
    };
    localStorage.setItem('quiz_audio_prefs', JSON.stringify(prefs));
  }, [gameifiedAudio.enabled, gameifiedAudio.muted, gameifiedAudio.masterVolume, gameifiedAudio.soundSourceMode]);

  // Register unlock listeners
  useEffect(() => {
    const handleInteraction = () => {
      if (!gameifiedAudio.isUnlocked) {
        gameifiedAudio.initializeAudioOnUserGesture();
      }
    };

    document.addEventListener('pointerdown', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });
    document.addEventListener('click', handleInteraction, { once: true });

    return () => {
      document.removeEventListener('pointerdown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('click', handleInteraction);
    };
  }, [gameifiedAudio.isUnlocked, gameifiedAudio.initializeAudioOnUserGesture]);

  // Enhanced game sound wrapper
  const playGameSound = useCallback((
    type: GameSoundType, 
    intensity: number = 1.0, 
    position?: SpatialPosition
  ) => {
    if (position) {
      // Use spatial version if position provided
      spatialSounds.playSpatialSound(type as any, intensity, position);
    } else {
      gameSounds.playGameSound(type, intensity);
    }
  }, [spatialSounds, gameSounds]);

  // Enhanced spatial sound wrapper
  const playSpatialSound = useCallback((
    type: SpatialSoundType,
    intensity: number = 1.0,
    position: SpatialPosition = { x: 0, y: 0, z: -1 }
  ) => {
    spatialSounds.playSpatialSound(type, intensity, position);
  }, [spatialSounds]);

  // Countdown functionality
  const startCountdown = useCallback((
    totalSeconds: number,
    onTimeAlert?: () => void,
    onTimeUp?: () => void
  ) => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }

    let remainingSeconds = totalSeconds;
    
    const interval = setInterval(() => {
      remainingSeconds--;
      
      // Alert at 10, 5, 3, 2, 1 seconds
      if ([10, 5, 3, 2, 1].includes(remainingSeconds)) {
        spatialSounds.playUrgencyAlert(remainingSeconds <= 3 ? 'high' : 'medium');
        onTimeAlert?.();
      }
      
      if (remainingSeconds <= 0) {
        clearInterval(interval);
        setCountdownInterval(null);
        spatialSounds.playUrgencyAlert('high');
        onTimeUp?.();
      }
    }, 1000);
    
    setCountdownInterval(interval);
  }, [countdownInterval, spatialSounds]);

  const contextValue: SoundContextType = {
    // State
    enabled: gameifiedAudio.enabled,
    muted: gameifiedAudio.muted,
    spatial: true,
    masterVolume: gameifiedAudio.masterVolume,
    isUnlocked: gameifiedAudio.isUnlocked,
    bufferLoadProgress: gameifiedAudio.bufferLoadProgress,

    // Core functions
    initializeAudioOnUserGesture: gameifiedAudio.initializeAudioOnUserGesture,

    // Public API
    playButtonClick: gameifiedAudio.playButtonClick,
    playCorrectAnswer: gameifiedAudio.playCorrectAnswer,
    playPageTransition: gameifiedAudio.playPageTransition,
    playVictorySequence: gameifiedAudio.playVictorySequence,
    playEnhancedWheelSpin: gameifiedAudio.playEnhancedWheelSpin,
    playEnhancedConfettiCelebration: gameifiedAudio.playEnhancedConfettiCelebration,
    
    // Individual sound controls
    playAchievement: () => gameifiedAudio.playSound('achievement'),
    playApplause: () => gameifiedAudio.playSound('applause'),
    playConfettiPop: () => gameifiedAudio.playSound('confettiPop'),
    playPageOpen: () => gameifiedAudio.playSound('pageOpen'),

    // Enhanced functions
    playGameSound,
    playSpatialSound,
    startCountdown,

    // Controls
    toggleSound: gameifiedAudio.toggleSound,
    setVolume: gameifiedAudio.setVolume,
    setSoundSourceMode: gameifiedAudio.setSoundSourceMode,
    stopAllSounds: gameifiedAudio.stopAllSounds,

    // Device capabilities & diagnostics
    deviceCapabilities,
    soundSourceMode: gameifiedAudio.soundSourceMode,
    audioBuffers: gameifiedAudio.audioBuffers
  };

  return (
    <SoundContext.Provider value={contextValue}>
      {children}
    </SoundContext.Provider>
  );
};