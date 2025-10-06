import { useCallback, useRef } from 'react';
import { devLog } from '@/utils/productionLogger';
import { GameSoundType } from '@/audio/types';

export const useAdvancedGameSounds = (audioContext: AudioContext | null, masterGain: GainNode | null) => {
  const lastPlayTime = useRef<Map<GameSoundType, number>>(new Map());

  const createGameOscillator = useCallback((
    frequency: number,
    type: OscillatorType,
    duration: number,
    volume: number = 0.3
  ) => {
    if (!audioContext || !masterGain) return;

    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = type;
      oscillator.frequency.value = frequency;

      oscillator.connect(gainNode);
      gainNode.connect(masterGain);

      const now = audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(volume, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

      oscillator.start(now);
      oscillator.stop(now + duration);
    } catch (error) {
      devLog.warn('Game oscillator creation failed:', error);
    }
  }, [audioContext, masterGain]);

  const playGameSound = useCallback((
    type: GameSoundType,
    intensity: number = 1.0
  ) => {
    // Throttle to prevent overlapping sounds
    const now = Date.now();
    const lastPlay = lastPlayTime.current.get(type) || 0;
    if (now - lastPlay < 100) return; // 100ms throttle
    lastPlayTime.current.set(type, now);

    const volume = intensity * 0.3;

    switch (type) {
      case 'click':
        // Click premium com progressão satisfatória
        createGameOscillator(528, 'sine', 0.09, volume * 0.8); // Love frequency base
        setTimeout(() => createGameOscillator(792, 'sine', 0.06, volume * 0.6), 8); // Quinta perfeita
        setTimeout(() => createGameOscillator(1056, 'sine', 0.04, volume * 0.4), 12); // Sparkle
        break;

      case 'correct':
        // Sequência terapêutica suave
        createGameOscillator(432, 'sine', 0.12, volume * 0.8); // Frequência de cura
        setTimeout(() => createGameOscillator(528, 'sine', 0.15, volume * 0.8), 60); // Frequência do amor
        setTimeout(() => createGameOscillator(639, 'sine', 0.18, volume * 0.8), 120); // Frequência de conexão
        break;

      case 'incorrect':
        // Tom neutro e discreto (evitar negatividade)
        createGameOscillator(396, 'sine', 0.08, volume * 0.5); // Tom neutro mais suave
        setTimeout(() => createGameOscillator(369, 'sine', 0.1, volume * 0.5), 40);
        break;

      case 'level-up':
        // Progressão wellness de conquista
        createGameOscillator(432, 'sine', 0.25, volume * 0.8); // Frequência de cura
        createGameOscillator(528, 'sine', 0.25, volume * 0.8); // Frequência do amor
        setTimeout(() => {
          createGameOscillator(639, 'sine', 0.3, volume * 0.8); // Frequência de conexão
          createGameOscillator(741, 'sine', 0.3, volume * 0.8); // Frequência de limpeza
        }, 150);
        break;

      case 'alert':
        // Tom de atenção suave (evitar alarme)
        for (let i = 0; i < 2; i++) {
          setTimeout(() => {
            createGameOscillator(741, 'sine', 0.06, volume * 0.6); // Frequência de limpeza, mais suave
          }, i * 150);
        }
        break;

      case 'page-transition':
        // Transição premium com progressão harmônica
        const baseFreq = 528; // Love frequency
        createGameOscillator(baseFreq, 'sine', 0.25, volume * 0.6);
        setTimeout(() => createGameOscillator(baseFreq * 1.21, 'sine', 0.2, volume * 0.5), 60); // 639Hz
        setTimeout(() => createGameOscillator(baseFreq * 1.4, 'sine', 0.15, volume * 0.4), 120); // 741Hz
        break;
    }
  }, [createGameOscillator]);

  return {
    playGameSound
  };
};