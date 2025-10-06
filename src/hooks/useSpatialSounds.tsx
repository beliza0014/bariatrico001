import { useEffect, useCallback, useRef } from 'react';

export interface SpatialSoundConfig {
  pageTransition: string;
  correctAnswer: string;
  achievement: string;
  finalCelebration: string;
  iosUnlockSupport: boolean;
  spatialAudio: boolean;
  volume: number;
}

const defaultConfig: SpatialSoundConfig = {
  pageTransition: '/sounds/transition.mp3',
  correctAnswer: '/sounds/success.mp3',
  achievement: '/sounds/achievement.mp3',
  finalCelebration: '/sounds/celebration.mp3',
  iosUnlockSupport: true,
  spatialAudio: true,
  volume: 0.3,
};

export const useSpatialSounds = (config: Partial<SpatialSoundConfig> = {}) => {
  const soundConfig = { ...defaultConfig, ...config };
  const audioContext = useRef<AudioContext | null>(null);
  const audioBuffers = useRef<Map<string, AudioBuffer>>(new Map());
  const isUnlocked = useRef(false);

  // Initialize audio context
  useEffect(() => {
    const initAudio = async () => {
      try {
        // Create audio context
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Preload sound files
        const soundFiles = [
          soundConfig.pageTransition,
          soundConfig.correctAnswer,
          soundConfig.achievement,
          soundConfig.finalCelebration,
        ];

        await Promise.all(
          soundFiles.map(async (url) => {
            try {
              const response = await fetch(url);
              const arrayBuffer = await response.arrayBuffer();
              const audioBuffer = await audioContext.current!.decodeAudioData(arrayBuffer);
              audioBuffers.current.set(url, audioBuffer);
            } catch (error) {
              console.warn(`Failed to load sound: ${url}`, error);
            }
          })
        );
      } catch (error) {
        console.warn('Audio initialization failed:', error);
      }
    };

    initAudio();

    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  // iOS unlock support
  const unlockiOSAudio = useCallback(async () => {
    if (!audioContext.current || isUnlocked.current) return;

    try {
      if (audioContext.current.state === 'suspended') {
        await audioContext.current.resume();
      }

      // Play a silent sound to unlock iOS audio
      const oscillator = audioContext.current.createOscillator();
      const gainNode = audioContext.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.current.destination);
      
      gainNode.gain.value = 0;
      oscillator.frequency.value = 440;
      oscillator.start();
      oscillator.stop(audioContext.current.currentTime + 0.01);
      
      isUnlocked.current = true;
    } catch (error) {
      console.warn('iOS audio unlock failed:', error);
    }
  }, []);

  // Play sound with spatial effects
  const playSound = useCallback((soundType: keyof SpatialSoundConfig, options: {
    x?: number; // -1 to 1 (left to right)
    y?: number; // -1 to 1 (back to front)
    z?: number; // -1 to 1 (down to up)
    volume?: number;
  } = {}) => {
    if (!audioContext.current || !isUnlocked.current) return;

    const soundUrl = soundConfig[soundType] as string;
    const buffer = audioBuffers.current.get(soundUrl);
    
    if (!buffer) return;

    try {
      const source = audioContext.current.createBufferSource();
      const gainNode = audioContext.current.createGain();
      const pannerNode = audioContext.current.createPanner();

      source.buffer = buffer;

      // Configure spatial audio
      if (soundConfig.spatialAudio) {
        pannerNode.panningModel = 'HRTF';
        pannerNode.distanceModel = 'inverse';
        pannerNode.refDistance = 1;
        pannerNode.maxDistance = 10000;
        pannerNode.rolloffFactor = 1;
        pannerNode.coneInnerAngle = 360;
        pannerNode.coneOuterAngle = 0;
        pannerNode.coneOuterGain = 0;

        // Set position
        pannerNode.positionX.value = options.x || 0;
        pannerNode.positionY.value = options.y || 0;
        pannerNode.positionZ.value = options.z || -1;

        source.connect(pannerNode);
        pannerNode.connect(gainNode);
      } else {
        source.connect(gainNode);
      }

      gainNode.connect(audioContext.current.destination);
      gainNode.gain.value = (options.volume || soundConfig.volume) * 0.5;

      source.start();
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  }, [soundConfig]);

  // Predefined sound effects
  const playPageTransition = useCallback(() => {
    playSound('pageTransition', { x: 0, y: 0, z: -0.5 });
  }, [playSound]);

  const playCorrectAnswer = useCallback(() => {
    playSound('correctAnswer', { x: 0.3, y: 0.2, z: -0.3 });
  }, [playSound]);

  const playAchievement = useCallback(() => {
    playSound('achievement', { x: 0, y: 0.5, z: 0, volume: 0.5 });
  }, [playSound]);

  const playFinalCelebration = useCallback(() => {
    playSound('finalCelebration', { x: 0, y: 0, z: 0, volume: 0.6 });
  }, [playSound]);

  // Auto-unlock on user interaction
  useEffect(() => {
    const handleInteraction = () => {
      if (soundConfig.iosUnlockSupport) {
        unlockiOSAudio();
      }
    };

    document.addEventListener('touchstart', handleInteraction, { once: true });
    document.addEventListener('click', handleInteraction, { once: true });

    return () => {
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('click', handleInteraction);
    };
  }, [unlockiOSAudio, soundConfig.iosUnlockSupport]);

  return {
    playSound,
    playPageTransition,
    playCorrectAnswer,
    playAchievement,
    playFinalCelebration,
    unlockiOSAudio,
    isUnlocked: isUnlocked.current,
  };
};