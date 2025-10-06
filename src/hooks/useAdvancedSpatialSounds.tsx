import { useCallback, useRef, useEffect } from 'react';
import { devLog } from '@/utils/productionLogger';
import { SpatialSoundType, UrgencyLevel, SpatialPosition } from '@/audio/types';

export const useAdvancedSpatialSounds = (audioContext: AudioContext | null, masterGain: GainNode | null) => {
  const compressor = useRef<DynamicsCompressorNode | null>(null);

  useEffect(() => {
    if (audioContext && !compressor.current) {
      compressor.current = audioContext.createDynamicsCompressor();
      compressor.current.threshold.value = -24;
      compressor.current.knee.value = 30;
      compressor.current.ratio.value = 12;
      compressor.current.attack.value = 0.003;
      compressor.current.release.value = 0.25;
      
      if (masterGain) {
        compressor.current.connect(masterGain);
      }
    }
  }, [audioContext, masterGain]);

  const createSpatialOscillator = useCallback((
    frequency: number,
    type: OscillatorType,
    duration: number,
    position: SpatialPosition,
    intensity: number = 1.0
  ) => {
    if (!audioContext || !compressor.current) return;

    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const pannerNode = audioContext.createPanner();

      // Configure panner for HRTF spatial audio
      pannerNode.panningModel = 'HRTF';
      pannerNode.distanceModel = 'inverse';
      pannerNode.refDistance = 1;
      pannerNode.maxDistance = 10;
      pannerNode.rolloffFactor = 1;

      // Set position
      pannerNode.positionX.value = position.x;
      pannerNode.positionY.value = position.y;
      pannerNode.positionZ.value = position.z;

      // Configure oscillator
      oscillator.type = type;
      oscillator.frequency.value = frequency;

      // Connect audio graph
      oscillator.connect(gainNode);
      gainNode.connect(pannerNode);
      pannerNode.connect(compressor.current);

      // Configure envelope
      const now = audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(intensity * 0.3, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

      oscillator.start(now);
      oscillator.stop(now + duration);
    } catch (error) {
      devLog.warn('Spatial oscillator creation failed:', error);
    }
  }, [audioContext]);

  const playSpatialSound = useCallback((
    type: SpatialSoundType,
    intensity: number = 1.0,
    position: SpatialPosition = { x: 0, y: 0, z: -1 }
  ) => {
    switch (type) {
      case 'achievement':
        // Progressão de conquista terapêutica
        createSpatialOscillator(432, 'sine', 0.25, { ...position, x: -0.2 }, intensity * 0.8); // Frequência de cura
        setTimeout(() => createSpatialOscillator(528, 'sine', 0.3, position, intensity * 0.8), 80); // Frequência do amor
        setTimeout(() => createSpatialOscillator(639, 'sine', 0.4, { ...position, x: 0.2 }, intensity * 0.8), 160); // Frequência de conexão
        break;

      case 'celebration':
        // Efeito sparkle wellness com frequências terapêuticas
        const wellnessFreqs = [432, 528, 639, 741]; // Frequências curativas
        for (let i = 0; i < 4; i++) {
          setTimeout(() => {
            const freq = wellnessFreqs[i % wellnessFreqs.length];
            const pos = {
              x: (Math.random() - 0.5) * 1.2, // Menos dispersão
              y: Math.random() * 0.5,
              z: -0.3 - Math.random() * 0.3
            };
            createSpatialOscillator(freq, 'sine', 0.15, pos, intensity * 0.6);
          }, i * 60);
        }
        break;

      case 'correct':
        // Tom ascendente terapêutico
        createSpatialOscillator(432, 'sine', 0.18, position, intensity * 0.8);
        setTimeout(() => createSpatialOscillator(528, 'sine', 0.22, position, intensity * 0.8), 80);
        break;

      case 'incorrect':
        // Tom neutro e discreto (evitar negatividade)
        createSpatialOscillator(396, 'sine', 0.12, position, intensity * 0.6);
        setTimeout(() => createSpatialOscillator(369, 'sine', 0.12, position, intensity * 0.6), 60);
        break;

      case 'transition':
        // Transição espacial premium com movimento elegante
        createSpatialOscillator(528, 'sine', 0.25, { ...position, x: -0.4 }, intensity * 0.7); // Love freq à esquerda
        setTimeout(() => createSpatialOscillator(639, 'sine', 0.2, position, intensity * 0.6), 60); // Centro
        setTimeout(() => createSpatialOscillator(741, 'sine', 0.15, { ...position, x: 0.3 }, intensity * 0.5), 120); // À direita
        break;
    }
  }, [createSpatialOscillator]);

  const playAnswerFeedback = useCallback((isCorrect: boolean) => {
    const position: SpatialPosition = { x: 0, y: 0.2, z: -0.3 };
    playSpatialSound(isCorrect ? 'correct' : 'incorrect', 1.0, position);
  }, [playSpatialSound]);

  const playUrgencyAlert = useCallback((level: UrgencyLevel) => {
    const configs = {
      low: { freq: 432, duration: 0.2, intensity: 0.4 },   // Frequência de cura, mais suave
      medium: { freq: 528, duration: 0.3, intensity: 0.6 }, // Frequência do amor
      high: { freq: 639, duration: 0.4, intensity: 0.8 }    // Frequência de conexão
    };

    const config = configs[level];
    const position: SpatialPosition = { x: 0, y: 0.3, z: 0 };
    
    // Alerta wellness suave
    for (let i = 0; i < 2; i++) {
      setTimeout(() => {
        createSpatialOscillator(config.freq, 'sine', 0.08, position, config.intensity);
      }, i * 180);
    }
  }, [createSpatialOscillator]);

  return {
    playSpatialSound,
    playAnswerFeedback,
    playUrgencyAlert
  };
};