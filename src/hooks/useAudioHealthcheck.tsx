import { useCallback, useState } from 'react';
import { devLog } from '@/utils/productionLogger';
import { SoundKey } from '@/audio/types';
import { SOUND_MANIFEST } from '@/audio/soundManifest';

export interface AudioSnapshot {
  soundKey: SoundKey;
  source: 'file' | 'cdn' | 'baked' | 'missing';
  duration: number; // in ms
  frames: number;
  lastPlayed: number | null;
  volume: number;
  status: 'ready' | 'loading' | 'error';
}

export interface SelfTestResult {
  soundKey: SoundKey;
  status: 'OK' | 'FALLBACK' | 'ERROR';
  message?: string;
}

export interface HealthcheckState {
  snapshot: AudioSnapshot[];
  selfTestResults: SelfTestResult[];
  masterVolume: number;
  muted: boolean;
  soundSourceMode: 'auto' | 'baked-first';
  isUnlocked: boolean;
  isRunning: boolean;
  summary: {
    total: number;
    ok: number;
    fallback: number;
    error: number;
  };
}

const SELF_TEST_SOUNDS: SoundKey[] = [
  'click',
  'transition', 
  'correct',
  'achievement',
  'applause',
  'confettiPop',
  'wheel'
];

export const useAudioHealthcheck = (
  audioBuffers: Map<SoundKey, { buffer: AudioBuffer; source: 'file' | 'cdn' | 'baked' }>,
  masterVolume: number,
  muted: boolean,
  soundSourceMode: 'auto' | 'baked-first',
  isUnlocked: boolean,
  playSound: (soundKey: SoundKey, options?: any) => void
) => {
  const [healthcheckState, setHealthcheckState] = useState<HealthcheckState>({
    snapshot: [],
    selfTestResults: [],
    masterVolume,
    muted,
    soundSourceMode,
    isUnlocked,
    isRunning: false,
    summary: { total: 0, ok: 0, fallback: 0, error: 0 }
  });

  const createSnapshot = useCallback((): AudioSnapshot[] => {
    const snapshot: AudioSnapshot[] = [];
    
    SELF_TEST_SOUNDS.forEach(soundKey => {
      const bufferEntry = audioBuffers.get(soundKey);
      const soundDef = SOUND_MANIFEST[soundKey];
      
      const audioSnapshot: AudioSnapshot = {
        soundKey,
        source: bufferEntry?.source || 'missing',
        duration: bufferEntry ? Math.round(bufferEntry.buffer.duration * 1000) : 0,
        frames: bufferEntry ? bufferEntry.buffer.length : 0,
        lastPlayed: null, // We don't track this currently
        volume: soundDef?.volume || 1.0,
        status: bufferEntry ? 'ready' : 'error'
      };
      
      snapshot.push(audioSnapshot);
    });
    
    return snapshot;
  }, [audioBuffers]);

  const runSelfTest = useCallback(async (): Promise<SelfTestResult[]> => {
    devLog.log('[SOUND HEALTHCHECK] Iniciando self-test...');
    
    const results: SelfTestResult[] = [];
    const originalVolume = masterVolume;
    
    // Set temporary volume to 0.6 for testing
    const testVolume = 0.6;
    
    setHealthcheckState(prev => ({ ...prev, isRunning: true }));
    
    for (let i = 0; i < SELF_TEST_SOUNDS.length; i++) {
      const soundKey = SELF_TEST_SOUNDS[i];
      
      try {
        const bufferEntry = audioBuffers.get(soundKey);
        
        if (!bufferEntry) {
        devLog.log(`[SOUND SELFTEST] ${soundKey}: ERROR - Buffer not found`);
          results.push({
            soundKey,
            status: 'ERROR',
            message: 'Buffer not found'
          });
          continue;
        }
        
        // Determine status based on source
        let status: 'OK' | 'FALLBACK' | 'ERROR' = 'OK';
        let message = `Source: ${bufferEntry.source}`;
        
        if (bufferEntry.source === 'baked') {
          status = 'FALLBACK';
          message = 'Using baked audio (file/cdn failed)';
        } else if (bufferEntry.source === 'cdn') {
          status = 'FALLBACK';  
          message = 'Using CDN (local file failed)';
        }
        
        // Try to play the sound
        try {
          playSound(soundKey, { volume: testVolume });
          devLog.log(`[SOUND SELFTEST] ${soundKey}: ${status} - ${message}`);
        } catch (playError) {
          devLog.log(`[SOUND SELFTEST] ${soundKey}: ERROR - Play failed: ${playError}`);
          status = 'ERROR';
          message = `Play failed: ${playError}`;
        }
        
        results.push({
          soundKey,
          status,
          message
        });
        
        // Wait 250ms between sounds
        if (i < SELF_TEST_SOUNDS.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 250));
        }
        
      } catch (error) {
        devLog.log(`[SOUND SELFTEST] ${soundKey}: ERROR - ${error}`);
        results.push({
          soundKey,
          status: 'ERROR',
          message: `${error}`
        });
      }
    }
    
    // Calculate summary
    const summary = {
      total: results.length,
      ok: results.filter(r => r.status === 'OK').length,
      fallback: results.filter(r => r.status === 'FALLBACK').length,
      error: results.filter(r => r.status === 'ERROR').length
    };
    
    devLog.log(`[SOUND SELFTEST] {total:${summary.total}, ok:${summary.ok}, fallback:${summary.fallback}, error:${summary.error}}`);
    
    setHealthcheckState(prev => ({ 
      ...prev, 
      isRunning: false,
      selfTestResults: results,
      summary
    }));
    
    return results;
  }, [audioBuffers, masterVolume, playSound]);

  const runFullHealthcheck = useCallback(async () => {
    devLog.log('[SOUND HEALTHCHECK] Executando healthcheck completo...');
    
    // 1. Create snapshot
    const snapshot = createSnapshot();
    
    // 2. Run self-test
    const selfTestResults = await runSelfTest();
    
    // 3. Update state
    const summary = {
      total: selfTestResults.length,
      ok: selfTestResults.filter(r => r.status === 'OK').length,
      fallback: selfTestResults.filter(r => r.status === 'FALLBACK').length,
      error: selfTestResults.filter(r => r.status === 'ERROR').length
    };
    
    setHealthcheckState({
      snapshot,
      selfTestResults,
      masterVolume,
      muted,
      soundSourceMode,
      isUnlocked,
      isRunning: false,
      summary
    });
    
    return {
      snapshot,
      selfTestResults,
      summary
    };
  }, [createSnapshot, runSelfTest, masterVolume, muted, soundSourceMode, isUnlocked]);

  const getProductionReadiness = useCallback(() => {
    const { summary } = healthcheckState;
    const isReady = summary.ok === 7 && summary.error === 0;
    
    if (isReady) {
      return "PRONTO P/ PRODUÇÃO ✅";
    } else {
      const issues = [];
      if (summary.error > 0) {
        issues.push(`${summary.error} sons com erro`);
      }
      if (summary.ok < 7) {
        issues.push(`apenas ${summary.ok}/7 sons funcionando perfeitamente`);
      }
      return `PRODUÇÃO IMPEDIDA: ${issues.join(', ')}`;
    }
  }, [healthcheckState]);

  return {
    healthcheckState,
    runFullHealthcheck,
    createSnapshot,
    runSelfTest,
    getProductionReadiness
  };
};