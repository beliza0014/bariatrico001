import { useState, useEffect } from 'react';
import { DeviceCapabilities } from '@/audio/types';

export const useDeviceCapabilities = (): DeviceCapabilities => {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    isIOS: false,
    isSafari: false,
    hasHRTF: false,
    sampleRate: 44100,
    canVibrate: false
  });

  useEffect(() => {
    const detectCapabilities = async () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isIOS = /iphone|ipad|ipod/.test(userAgent);
      const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
      
      let hasHRTF = false;
      let sampleRate = 44100;
      
      try {
        // Test AudioContext capabilities
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        sampleRate = audioContext.sampleRate;
        
        // Check for HRTF support by creating a panner
        const panner = audioContext.createPanner();
        hasHRTF = panner.panningModel === 'HRTF' || 'HRTF' in panner;
        
        audioContext.close();
      } catch (error) {
        // Audio capability detection failed - handle silently in production
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Audio capability detection failed:', error);
        }
      }

      const canVibrate = 'vibrate' in navigator;

      setCapabilities({
        isIOS,
        isSafari,
        hasHRTF,
        sampleRate,
        canVibrate
      });
    };

    detectCapabilities();
  }, []);

  return capabilities;
};