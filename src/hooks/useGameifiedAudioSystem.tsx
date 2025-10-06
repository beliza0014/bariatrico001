import { useCallback, useRef, useState, useEffect } from 'react';
import { SoundKey, PlayOptions } from '@/audio/types';
import { SOUND_MANIFEST, FALLBACK_SOUND_MANIFEST, CATEGORY_VOLUMES, SOUND_SOURCE_MODE } from '@/audio/soundManifest';

import { soundLog, devLog } from '@/utils/productionLogger';

export const useGameifiedAudioSystem = () => {
  const audioContext = useRef<AudioContext | null>(null);
  const masterGain = useRef<GainNode | null>(null);
  const audioBuffers = useRef<Map<SoundKey, { buffer: AudioBuffer; source: 'file' | 'cdn' | 'baked' }>>(new Map());
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [bufferLoadProgress, setBufferLoadProgress] = useState(0);
  const [masterVolume, setMasterVolume] = useState(0.9);
  const [enabled, setEnabled] = useState(true);
  const [muted, setMuted] = useState(false);
  const [soundSourceMode, setSoundSourceMode] = useState<'auto' | 'baked-first'>(SOUND_SOURCE_MODE);
  const lastPlayTime = useRef<Map<SoundKey, number>>(new Map());

  // Initialize AudioContext
  const initializeAudioContext = useCallback(() => {
    if (audioContext.current) return;

    try {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      masterGain.current = audioContext.current.createGain();
      masterGain.current.connect(audioContext.current.destination);
      masterGain.current.gain.value = masterVolume;

      devLog.log('🎵 AudioContext initialized:', {
        sampleRate: audioContext.current.sampleRate,
        state: audioContext.current.state
      });
    } catch (error) {
      devLog.warn('AudioContext initialization failed:', error);
    }
  }, [masterVolume]);

  // Baked sample utilities
  const bakeTone = useCallback((ctx: OfflineAudioContext, freq: number, durationMs: number, options: { attackMs?: number; decayMs?: number } = {}) => {
    const { attackMs = 10, decayMs = 50 } = options;
    const duration = durationMs / 1000;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = freq;
    oscillator.type = 'sine';
    
    const attackTime = attackMs / 1000;
    const decayTime = decayMs / 1000;
    
    gainNode.gain.setValueAtTime(0, 0);
    gainNode.gain.linearRampToValueAtTime(0.3, attackTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, Math.max(attackTime + 0.001, duration - decayTime));
    
    oscillator.start(0);
    oscillator.stop(duration);
    
    return ctx.startRendering();
  }, []);

  const bakeTriad = useCallback((ctx: OfflineAudioContext, rootFreq: number, durationMs: number) => {
    const duration = durationMs / 1000;
    const frequencies = [rootFreq, rootFreq * 1.25, rootFreq * 1.5]; // Major triad
    
    frequencies.forEach(freq => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, 0);
      gainNode.gain.linearRampToValueAtTime(0.2, 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, duration - 0.1);
      
      oscillator.start(0);
      oscillator.stop(duration);
    });
    
    return ctx.startRendering();
  }, []);

  const bakeNoiseSweep = useCallback((ctx: OfflineAudioContext, durationMs: number, options: { fromHz: number; toHz: number }) => {
    const duration = durationMs / 1000;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(options.fromHz, 0);
    oscillator.frequency.exponentialRampToValueAtTime(options.toHz, duration);
    
    gainNode.gain.setValueAtTime(0.3, 0);
    gainNode.gain.exponentialRampToValueAtTime(0.001, duration);
    
    oscillator.start(0);
    oscillator.stop(duration);
    
    return ctx.startRendering();
  }, []);

  const bakeTickSequence = useCallback((ctx: OfflineAudioContext, ticks: number, tickMs: number, gapMs: number) => {
    const tickDuration = tickMs / 1000;
    const gapDuration = gapMs / 1000;
    
    for (let i = 0; i < ticks; i++) {
      const startTime = i * (tickDuration + gapDuration);
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = 1200 + (i * 50); // Rising pitch
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.002);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + tickDuration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + tickDuration);
    }
    
    return ctx.startRendering();
  }, []);

  const bakeApplauseLike = useCallback((ctx: OfflineAudioContext, durationMs: number) => {
    const duration = durationMs / 1000;
    const sampleRate = ctx.sampleRate;
    const frameCount = sampleRate * duration;
    const buffer = ctx.createBuffer(1, frameCount, sampleRate);
    const channelData = buffer.getChannelData(0);
    
    // Generate noise with varying amplitude
    for (let i = 0; i < frameCount; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 2) * Math.sin(t * 50);
      const noise = (Math.random() * 2 - 1) * envelope * 0.3;
      channelData[i] = noise;
    }
    
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
    
    return ctx.startRendering();
  }, []);

  const bakeTransitionSwoosh = useCallback((ctx: OfflineAudioContext, durationMs: number) => {
    const duration = Math.min(durationMs, 300) / 1000; // Máximo 300ms para profissionalismo
    
    // TRANSIÇÃO PROFISSIONAL PREMIUM - Inspirado em apps médicos/wellness
    // Som discreto, confiável e não-intrusivo para aplicações de saúde
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    masterGain.gain.setValueAtTime(0.15, 0); // Volume muito mais discreto (-18dB vs -6dB atual)
    
    // BASE PRINCIPAL: Tom puro médico-profissional (C5 - 523Hz)
    const primaryOsc = ctx.createOscillator();
    const primaryGain = ctx.createGain();
    const primaryFilter = ctx.createBiquadFilter();
    
    primaryOsc.type = 'sine'; // Onda senoidal pura, sem artifacts
    primaryOsc.frequency.setValueAtTime(523, 0); // C5 - frequência médica padrão
    
    // Filtro suave para suavizar ainda mais o som
    primaryFilter.type = 'lowpass';
    primaryFilter.frequency.setValueAtTime(2000, 0); // Corte em 2kHz para suavidade
    primaryFilter.Q.setValueAtTime(0.7, 0); // Q baixo para transição suave
    
    // Envelope natural e orgânico
    primaryGain.gain.setValueAtTime(0, 0);
    primaryGain.gain.linearRampToValueAtTime(1.0, 0.01); // Attack rápido (10ms)
    primaryGain.gain.exponentialRampToValueAtTime(0.001, duration); // Decay natural exponencial
    
    primaryOsc.connect(primaryFilter);
    primaryFilter.connect(primaryGain);
    primaryGain.connect(masterGain);
    
    // HARMÔNICA SUTIL: Segunda harmônica muito discreta (1046Hz)
    const harmonicOsc = ctx.createOscillator();
    const harmonicGain = ctx.createGain();
    
    harmonicOsc.type = 'sine';
    harmonicOsc.frequency.setValueAtTime(1046, 0); // C6 - oitava superior
    
    // Volume muito baixo (15% da principal)
    harmonicGain.gain.setValueAtTime(0, 0);
    harmonicGain.gain.linearRampToValueAtTime(0.15, 0.015);
    harmonicGain.gain.exponentialRampToValueAtTime(0.001, duration * 0.8);
    
    harmonicOsc.connect(harmonicGain);
    harmonicGain.connect(masterGain);
    
    // TEXTURA ORGÂNICA: Pink noise filtrado muito sutil para "respiração"
    const bufferSize = ctx.sampleRate * duration;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    
    // Pink noise muito suave
    for (let i = 0; i < bufferSize; i++) {
      const t = i / ctx.sampleRate;
      const envelope = Math.exp(-t * 3) * 0.02; // Envelope muito suave
      const pinkNoise = (Math.random() * 2 - 1) * envelope;
      noiseData[i] = pinkNoise;
    }
    
    const noiseSource = ctx.createBufferSource();
    const noiseGain = ctx.createGain();
    const noiseFilter = ctx.createBiquadFilter();
    
    noiseSource.buffer = noiseBuffer;
    
    // Filtro para frequências médias orgânicas
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(800, 0);
    noiseFilter.Q.setValueAtTime(1.2, 0);
    
    noiseGain.gain.setValueAtTime(0.3, 0);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, duration * 0.6);
    
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    
    // MOVIMENTO ESPACIAL SUTIL: Leve L→R (máximo 20% pan vs 80% atual)
    const spatialPanner = ctx.createStereoPanner();
    spatialPanner.pan.setValueAtTime(-0.2, 0);
    spatialPanner.pan.linearRampToValueAtTime(0.2, duration * 0.7);
    spatialPanner.pan.linearRampToValueAtTime(0, duration); // Retorna ao centro
    
    masterGain.connect(spatialPanner);
    spatialPanner.connect(ctx.destination);
    
    // Iniciar todos os osciladores
    primaryOsc.start(0);
    primaryOsc.stop(duration);
    harmonicOsc.start(0);
    harmonicOsc.stop(duration * 0.8);
    noiseSource.start(0);
    
    return ctx.startRendering();
  }, []);

  const mixBuffers = useCallback((ctx: OfflineAudioContext, buffers: AudioBuffer[]) => {
    if (buffers.length === 0) return ctx.startRendering();
    
    buffers.forEach((buffer, index) => {
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      
      source.buffer = buffer;
      source.connect(gain);
      gain.connect(ctx.destination);
      
      gain.gain.value = 1 / buffers.length;
      source.start(index * 0.1); // Slight offset
    });
    
    return ctx.startRendering();
  }, []);

  const bakeAllSamplesIfNeeded = useCallback(async (ctx: AudioContext, bufferMap: Map<SoundKey, { buffer: AudioBuffer; source: 'file' | 'cdn' | 'baked' }>) => {
    const soundKeys = Object.keys(SOUND_MANIFEST) as SoundKey[];
    
    for (const key of soundKeys) {
      if (bufferMap.has(key) && bufferMap.get(key)?.source === 'baked') continue;
      
      try {
        let buffer: AudioBuffer;
        const offlineCtx = new OfflineAudioContext(1, ctx.sampleRate * 2, ctx.sampleRate);
        
        switch (key) {
          case 'click':
            // CLICK PREMIUM WELLNESS - Som satisfatório e elegante
            const clickDur = 110 / 1000; // Duração otimizada para satisfação
            const clickCtx = new OfflineAudioContext(2, ctx.sampleRate * 0.2, ctx.sampleRate);
            
            // FREQUÊNCIA BASE DOURADA (528Hz - Love Frequency)
            const rootFreq = 528; // Frequência do amor - mais calorosa que 432Hz
            
            // CAMADA 1: Tom principal com micro-progressão satisfatória
            const mainOsc = clickCtx.createOscillator();
            const mainGain = clickCtx.createGain();
            const mainPanner = clickCtx.createStereoPanner();
            const mainFilter = clickCtx.createBiquadFilter();
            
            mainOsc.type = 'sine';
            mainOsc.frequency.setValueAtTime(rootFreq, 0);
            mainOsc.frequency.linearRampToValueAtTime(rootFreq * 1.03, 0.015); // Micro-bend satisfatório
            
            // Filtro para warmth premium
            mainFilter.type = 'lowpass';
            mainFilter.frequency.setValueAtTime(3000, 0);
            mainFilter.Q.setValueAtTime(0.8, 0);
            
            // Envelope premium com punch satisfatório
            mainGain.gain.setValueAtTime(0, 0);
            mainGain.gain.linearRampToValueAtTime(0.35, 0.008); // Punch inicial satisfatório
            mainGain.gain.exponentialRampToValueAtTime(0.12, 0.025); // Sustain doce
            mainGain.gain.exponentialRampToValueAtTime(0.001, clickDur);
            
            mainPanner.pan.value = 0; // Centro perfeito
            
            mainOsc.connect(mainFilter);
            mainFilter.connect(mainGain);
            mainGain.connect(mainPanner);
            mainPanner.connect(clickCtx.destination);
            
            // CAMADA 2: Harmônica dourada (quinta perfeita = 792Hz)
            const harmOsc = clickCtx.createOscillator();
            const harmGain = clickCtx.createGain();
            const harmPanner = clickCtx.createStereoPanner();
            
            harmOsc.type = 'sine';
            harmOsc.frequency.setValueAtTime(792, 0.008); // Quinta perfeita com timing ideal
            
            harmGain.gain.setValueAtTime(0, 0.008);
            harmGain.gain.linearRampToValueAtTime(0.18, 0.022); // Harmônica mais presente
            harmGain.gain.exponentialRampToValueAtTime(0.001, clickDur * 0.85);
            
            harmPanner.pan.value = 0.08; // Ligeiramente à direita
            
            harmOsc.connect(harmGain);
            harmGain.connect(harmPanner);
            harmPanner.connect(clickCtx.destination);
            
            // CAMADA 3: Sparkle premium (oitava superior = 1056Hz)
            const sparkleOsc = clickCtx.createOscillator();
            const sparkleGain = clickCtx.createGain();
            const sparklePanner = clickCtx.createStereoPanner();
            
            sparkleOsc.type = 'sine';
            sparkleOsc.frequency.setValueAtTime(1056, 0.012); // Oitava superior com delay
            
            sparkleGain.gain.setValueAtTime(0, 0.012);
            sparkleGain.gain.linearRampToValueAtTime(0.08, 0.025);
            sparkleGain.gain.exponentialRampToValueAtTime(0.001, clickDur * 0.6);
            
            sparklePanner.pan.value = -0.06; // Ligeiramente à esquerda
            
            sparkleOsc.connect(sparkleGain);
            sparkleGain.connect(sparklePanner);
            sparklePanner.connect(clickCtx.destination);
            
            // Iniciar todos com timing musical perfeito
            mainOsc.start(0);
            mainOsc.stop(clickDur);
            harmOsc.start(0.008);
            harmOsc.stop(clickDur * 0.85);
            sparkleOsc.start(0.012);
            sparkleOsc.stop(clickDur * 0.6);
            
            buffer = await clickCtx.startRendering();
            break;
          case 'correct':
            // RESPOSTA CORRETA WELLNESS - Progressão terapêutica suave
            const correctDur = 450 / 1000; // Mais discreto para contexto médico
            const correctCtx = new OfflineAudioContext(2, ctx.sampleRate * 0.6, ctx.sampleRate);
            
            // Progressão baseada em frequências curativas: 432Hz → 528Hz → 639Hz
            const notes = [
              { freq: 432, start: 0, duration: 0.15 },      // Frequência de cura
              { freq: 528, start: 0.1, duration: 0.2 },     // Frequência do amor/DNA
              { freq: 639, start: 0.22, duration: 0.23 }    // Frequência de conexão
            ];
            
            notes.forEach((note, index) => {
              const osc = correctCtx.createOscillator();
              const gain = correctCtx.createGain();
              const panner = correctCtx.createStereoPanner();
              const filter = correctCtx.createBiquadFilter();
              
              osc.type = 'sine';
              osc.frequency.value = note.freq;
              
              // Filtro suave para warmth terapêutico
              filter.type = 'lowpass';
              filter.frequency.setValueAtTime(1500, 0);
              filter.Q.setValueAtTime(0.3, 0);
              
              // Envelope wellness muito suave
              gain.gain.setValueAtTime(0, note.start);
              gain.gain.linearRampToValueAtTime(0.15 - (index * 0.01), note.start + 0.03);
              gain.gain.exponentialRampToValueAtTime(0.001, note.start + note.duration);
              
              // Espacialização mínima
              panner.pan.value = (index - 1) * 0.05; // -0.05 a +0.05
              
              osc.connect(filter);
              filter.connect(gain);
              gain.connect(panner);
              panner.connect(correctCtx.destination);
              
              osc.start(note.start);
              osc.stop(note.start + note.duration);
            });
            
            buffer = await correctCtx.startRendering();
            break;
          case 'transition':
            // TRANSIÇÃO PREMIUM ELEGANTE - Experiência sonora nota 10
            const transDur = 380 / 1000; // Duração otimizada para elegância
            const transCtx = new OfflineAudioContext(2, ctx.sampleRate * 0.5, ctx.sampleRate);
            
            // PROGRESSÃO HARMÔNICA ELEGANTE: 528Hz → 639Hz → 741Hz
            const masterGain = transCtx.createGain();
            masterGain.connect(transCtx.destination);
            masterGain.gain.setValueAtTime(0.22, 0); // Volume premium balanceado
            
            // FASE 1: Tom base Love Frequency (528Hz) com movimento
            const phase1Osc = transCtx.createOscillator();
            const phase1Gain = transCtx.createGain();
            const phase1Panner = transCtx.createStereoPanner();
            const phase1Filter = transCtx.createBiquadFilter();
            
            phase1Osc.type = 'sine';
            phase1Osc.frequency.setValueAtTime(528, 0);
            phase1Osc.frequency.linearRampToValueAtTime(569, transDur * 0.4); // Transição suave para 569Hz
            
            // Filtro premium para warmth
            phase1Filter.type = 'lowpass';
            phase1Filter.frequency.setValueAtTime(2800, 0);
            phase1Filter.frequency.linearRampToValueAtTime(3200, transDur * 0.6);
            phase1Filter.Q.setValueAtTime(0.6, 0);
            
            // Envelope fase 1 - crescimento elegante
            phase1Gain.gain.setValueAtTime(0, 0);
            phase1Gain.gain.linearRampToValueAtTime(0.8, 0.025);
            phase1Gain.gain.exponentialRampToValueAtTime(0.4, transDur * 0.45);
            phase1Gain.gain.exponentialRampToValueAtTime(0.001, transDur * 0.7);
            
            // Movimento espacial suave L→Centro
            phase1Panner.pan.setValueAtTime(-0.3, 0);
            phase1Panner.pan.linearRampToValueAtTime(0, transDur * 0.5);
            
            phase1Osc.connect(phase1Filter);
            phase1Filter.connect(phase1Gain);
            phase1Gain.connect(phase1Panner);
            phase1Panner.connect(masterGain);
            
            // FASE 2: Harmônica de conexão (639Hz) - overlap elegante
            const phase2Osc = transCtx.createOscillator();
            const phase2Gain = transCtx.createGain();
            const phase2Panner = transCtx.createStereoPanner();
            const phase2Filter = transCtx.createBiquadFilter();
            
            phase2Osc.type = 'sine';
            phase2Osc.frequency.setValueAtTime(639, transDur * 0.2);
            phase2Osc.frequency.linearRampToValueAtTime(684, transDur * 0.7);
            
            phase2Filter.type = 'lowpass';
            phase2Filter.frequency.setValueAtTime(3000, transDur * 0.2);
            phase2Filter.Q.setValueAtTime(0.5, 0);
            
            // Envelope fase 2 - entrada suave, saída elegante  
            phase2Gain.gain.setValueAtTime(0, transDur * 0.2);
            phase2Gain.gain.linearRampToValueAtTime(0.6, transDur * 0.35);
            phase2Gain.gain.exponentialRampToValueAtTime(0.3, transDur * 0.65);
            phase2Gain.gain.exponentialRampToValueAtTime(0.001, transDur);
            
            // Movimento espacial Centro→R
            phase2Panner.pan.setValueAtTime(0, transDur * 0.2);
            phase2Panner.pan.linearRampToValueAtTime(0.25, transDur * 0.8);
            
            phase2Osc.connect(phase2Filter);
            phase2Filter.connect(phase2Gain);
            phase2Gain.connect(phase2Panner);
            phase2Panner.connect(masterGain);
            
            // FASE 3: Textura orgânica sutil - pink noise filtrado
            const noiseBuffer = transCtx.createBuffer(1, transCtx.sampleRate * transDur, transCtx.sampleRate);
            const noiseData = noiseBuffer.getChannelData(0);
            
            for (let i = 0; i < noiseData.length; i++) {
              const t = i / transCtx.sampleRate;
              const envelope = Math.exp(-t * 2.5) * 0.015; // Envelope muito sutil
              const pinkNoise = (Math.random() * 2 - 1) * envelope;
              noiseData[i] = pinkNoise;
            }
            
            const noiseSource = transCtx.createBufferSource();
            const noiseGain = transCtx.createGain();
            const noiseFilter = transCtx.createBiquadFilter();
            
            noiseSource.buffer = noiseBuffer;
            
            noiseFilter.type = 'bandpass';
            noiseFilter.frequency.setValueAtTime(1200, 0);
            noiseFilter.frequency.linearRampToValueAtTime(1600, transDur);
            noiseFilter.Q.setValueAtTime(1.8, 0);
            
            noiseGain.gain.setValueAtTime(0.2, 0);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, transDur * 0.8);
            
            noiseSource.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(masterGain);
            
            // Iniciar todas as fases com timing premium
            phase1Osc.start(0);
            phase1Osc.stop(transDur * 0.7);
            phase2Osc.start(transDur * 0.2);
            phase2Osc.stop(transDur);
            noiseSource.start(0);
            
            buffer = await transCtx.startRendering();
            break;
          case 'wheel':
            buffer = await bakeTickSequence(offlineCtx, 18, 35, 55);
            break;
          case 'confettiPop':
            // Create micro-snaps and mix them
            const snap1 = await bakeTone(new OfflineAudioContext(1, ctx.sampleRate * 0.3, ctx.sampleRate), 1200, 50);
            const snap2 = await bakeTone(new OfflineAudioContext(1, ctx.sampleRate * 0.3, ctx.sampleRate), 1600, 50);
            const snap3 = await bakeTone(new OfflineAudioContext(1, ctx.sampleRate * 0.3, ctx.sampleRate), 2100, 50);
            buffer = await mixBuffers(offlineCtx, [snap1, snap2, snap3]);
            break;
          case 'applause':
            buffer = await bakeApplauseLike(offlineCtx, 1200);
            break;
          case 'achievement':
            buffer = await bakeTriad(offlineCtx, 528, 500); // Frequência do amor, mais curto
            break;
          case 'pageOpen':
            // ABERTURA DE PÁGINA WELLNESS - Chime terapêutico acolhedor
            const openDur = 220 / 1000; // Mais discreto
            const openCtx = new OfflineAudioContext(2, ctx.sampleRate * 0.3, ctx.sampleRate);
            
            // Acorde wellness baseado em frequências curativas
            const welcomeChord = [
              { freq: 432, gain: 0.15 },  // Frequência de cura base
              { freq: 528, gain: 0.12 },  // Frequência do amor
              { freq: 639, gain: 0.1 }    // Frequência de conexão
            ];
            
            welcomeChord.forEach((note, index) => {
              const osc = openCtx.createOscillator();
              const gain = openCtx.createGain();
              const filter = openCtx.createBiquadFilter();
              
              osc.type = 'sine';
              osc.frequency.value = note.freq;
              
              // Filtro suave para warmth
              filter.type = 'lowpass';
              filter.frequency.setValueAtTime(2500, 0);
              filter.Q.setValueAtTime(0.5, 0);
              
              // Envelope acolhedor
              gain.gain.setValueAtTime(0, 0);
              gain.gain.linearRampToValueAtTime(note.gain, 0.04 + (index * 0.01));
              gain.gain.exponentialRampToValueAtTime(0.001, openDur);
              
              osc.connect(filter);
              filter.connect(gain);
              gain.connect(openCtx.destination);
              
              osc.start(0);
              osc.stop(openDur);
            });
            
            buffer = await openCtx.startRendering();
            break;
          default:
            continue;
        }
        
        bufferMap.set(key, { buffer, source: 'baked' });
        soundLog.ok(key, 'baked');
      } catch (error) {
        soundLog.error(key, error);
      }
    }
  }, [bakeTone, bakeTriad, bakeNoiseSweep, bakeTickSequence, bakeApplauseLike, bakeTransitionSwoosh, mixBuffers]);

  // iOS unlock support
  const initializeAudioOnUserGesture = useCallback(async () => {
    if (isUnlocked || !audioContext.current) return;

    try {
      if (audioContext.current.state === 'suspended') {
        await audioContext.current.resume();
      }

      // Play silent sound to unlock iOS audio
      const oscillator = audioContext.current.createOscillator();
      const gainNode = audioContext.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.current.destination);
      
      gainNode.gain.value = 0;
      oscillator.frequency.value = 440;
      oscillator.start();
      oscillator.stop(audioContext.current.currentTime + 0.01);
      
      setIsUnlocked(true);
      localStorage.setItem('audio_activated', 'true');

      // Bake samples after unlock
      await bakeAllSamplesIfNeeded(audioContext.current, audioBuffers.current);

      devLog.log('🔓 iOS audio unlocked and samples baked');
    } catch (error) {
      devLog.warn('iOS audio unlock failed:', error);
    }
  }, [isUnlocked, bakeAllSamplesIfNeeded]);

  // Preload all audio buffers with triple fallback
  const preloadAllBuffers = useCallback(async () => {
    if (!audioContext.current) return;

    const soundKeys = Object.keys(SOUND_MANIFEST) as SoundKey[];
    const totalSounds = soundKeys.length;
    let loadedCount = 0;

    const loadPromises = soundKeys.map(async (key) => {
      const soundDef = SOUND_MANIFEST[key];
      let loadedFromSource: 'file' | 'cdn' | 'baked' | null = null;

      // If soundSourceMode is 'baked-first', skip local/CDN and force baked
      if (soundSourceMode === 'baked-first') {
        // Skip file/CDN loading, force baked samples
        loadedFromSource = 'baked';
        soundLog.fallback(key, 'baked-first mode');
      } else {
        // Original auto mode logic
        const allowedSources = soundDef.preference || ['local', 'cdn', 'baked'];
        
        // Try local file first (prioritize local over CDN)
        if (allowedSources.includes('local')) {
          try {
            const response = await fetch(soundDef.url);
            if (response.ok) {
              const arrayBuffer = await response.arrayBuffer();
              const audioBuffer = await audioContext.current!.decodeAudioData(arrayBuffer);
              audioBuffers.current.set(key, { buffer: audioBuffer, source: 'file' });
              loadedFromSource = 'file';
              soundLog.ok(key, 'file');
            }
          } catch (error) {
            // Continue to next fallback
          }
        }

        // Try CDN if local failed AND CDN is allowed
        if (!loadedFromSource && allowedSources.includes('cdn') && soundDef.cdn) {
          try {
            const response = await fetch(soundDef.cdn);
            if (response.ok) {
              const arrayBuffer = await response.arrayBuffer();
              const audioBuffer = await audioContext.current!.decodeAudioData(arrayBuffer);
              audioBuffers.current.set(key, { buffer: audioBuffer, source: 'cdn' });
              loadedFromSource = 'cdn';
              soundLog.ok(key, 'cdn');
            }
          } catch (error) {
            // Continue to baked fallback
          }
        }

        // Use baked if available and previous methods failed
        if (!loadedFromSource && allowedSources.includes('baked') && soundDef.baked) {
          // Baked samples will be created in bakeAllSamplesIfNeeded
          loadedFromSource = 'baked';
          soundLog.fallback(key, `${allowedSources.join('→')}`);
        }
      }

      loadedCount++;
      setBufferLoadProgress((loadedCount / totalSounds) * 100);
    });

    await Promise.all(loadPromises);

    // Bake samples for any that need them (or all sounds if baked-first mode)
    if (audioContext.current) {
      await bakeAllSamplesIfNeeded(audioContext.current, audioBuffers.current);
    }
  }, [soundSourceMode, bakeAllSamplesIfNeeded]);

  // Initialize on mount
  useEffect(() => {
    initializeAudioContext();
    preloadAllBuffers();

    // Check if audio was previously activated
    const wasActivated = localStorage.getItem('audio_activated') === 'true';
    if (wasActivated) {
      setIsUnlocked(true);
    }
  }, [initializeAudioContext, preloadAllBuffers]);

  // Core sound playing function
  const playSound = useCallback((
    soundKey: SoundKey, 
    options: PlayOptions = {}
  ) => {
    if (!enabled || muted || !isUnlocked || !audioContext.current || !masterGain.current) {
      return;
    }

    const bufferEntry = audioBuffers.current.get(soundKey);
    if (!bufferEntry) {
      devLog.warn(`Sound buffer not found: ${soundKey}`);
      return;
    }

    const buffer = bufferEntry.buffer;

    // Throttle rapid plays of the same sound
    const now = Date.now();
    const lastPlay = lastPlayTime.current.get(soundKey) || 0;
    if (now - lastPlay < 50) return; // 50ms throttle
    lastPlayTime.current.set(soundKey, now);

    try {
      const source = audioContext.current.createBufferSource();
      const gainNode = audioContext.current.createGain();
      let pannerNode: StereoPannerNode | null = null;

      source.buffer = buffer;

      // Apply spatial positioning if needed
      if (options.x !== undefined && audioContext.current.createStereoPanner) {
        pannerNode = audioContext.current.createStereoPanner();
        pannerNode.pan.value = Math.max(-1, Math.min(1, options.x));
        source.connect(pannerNode);
        pannerNode.connect(gainNode);
      } else {
        source.connect(gainNode);
      }

      gainNode.connect(masterGain.current);

      // Set volume based on category and options
      const soundDef = SOUND_MANIFEST[soundKey];
      const categoryVolume = CATEGORY_VOLUMES[soundDef.category];
      const finalVolume = (options.volume || soundDef.volume || 1.0) * categoryVolume;
      gainNode.gain.value = finalVolume;

      source.loop = options.loop || false;
      source.start();

      // Telemetria para click, transition e pageOpen
      if (['click', 'transition', 'pageOpen'].includes(soundKey)) {
        console.info('[AUDIO]', {
          page: window.location.pathname,
          event: 'play',
          key: soundKey,
          origin: bufferEntry.source,
          file: `${soundKey}.mp3`,
          description: soundKey === 'pageOpen' ? 'Som de abertura de página' : 
                      soundKey === 'click' ? 'Som de clique/seleção' :
                      'Som de transição'
        });
      }

      devLog.log(`🔊 Playing: ${soundKey}`, { volume: finalVolume, options });
    } catch (error) {
      devLog.warn(`Sound playback failed for ${soundKey}:`, error);
    }
  }, [enabled, muted, isUnlocked]);

  // Public API functions
  const playButtonClick = useCallback(() => {
    playSound('click');
  }, [playSound]);

  const playCorrectAnswer = useCallback(() => {
    playSound('correct');
  }, [playSound]);

  const playPageTransition = useCallback(() => {
    playSound('transition');
  }, [playSound]);

  const playEnhancedWheelSpin = useCallback((durationMs = 2000) => {
    playSound('wheel', { loop: true });
    // Stop after duration
    setTimeout(() => stopAllSounds(), durationMs);
  }, [playSound]);

  const playEnhancedConfettiCelebration = useCallback(() => {
    playSound('confettiPop');
    // Optional: add subtle applause after confetti
    // setTimeout(() => playSound('applause', { volume: 0.3 }), 300);
  }, [playSound]);

  const playVictorySequence = useCallback(() => {
    // Just play achievement sound - avoid multiple overlapping sounds
    playSound('achievement');
  }, [playSound]);

  const toggleSound = useCallback(() => {
    setEnabled(prev => !prev);
  }, []);

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    setMasterVolume(clampedVolume);
    if (masterGain.current) {
      masterGain.current.gain.value = clampedVolume;
    }
  }, []);

  // Load sound source mode from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('sound_source_mode') as 'auto' | 'baked-first';
    if (savedMode) {
      setSoundSourceMode(savedMode);
    }
  }, []);

  // Save sound source mode to localStorage
  const setSoundSourceModeAndSave = useCallback((mode: 'auto' | 'baked-first') => {
    setSoundSourceMode(mode);
    localStorage.setItem('sound_source_mode', mode);
  }, []);

  const stopAllSounds = useCallback(() => {
    // This is a simplified implementation
    // In a more complex system, you'd track active sources
    if (audioContext.current) {
      try {
        audioContext.current.suspend();
        audioContext.current.resume();
      } catch (error) {
        devLog.warn('Failed to stop all sounds:', error);
      }
    }
  }, []);

  return {
    // State
    isUnlocked,
    bufferLoadProgress,
    masterVolume,
    enabled,
    muted,
    soundSourceMode,
    audioBuffers: audioBuffers.current,

    // Core functions
    initializeAudioOnUserGesture,
    playSound,

    // Public API
    playButtonClick,
    playCorrectAnswer,
    playPageTransition,
    playEnhancedWheelSpin,
    playEnhancedConfettiCelebration,
    playVictorySequence,
    toggleSound,
    setVolume,
    setSoundSourceMode: setSoundSourceModeAndSave,
    stopAllSounds,

    // Setters
    setEnabled,
    setMuted
  };
};