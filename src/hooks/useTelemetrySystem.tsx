import { useCallback, useRef } from 'react';
import { SoundKey } from '@/audio/types';

interface TelemetryEvent {
  soundKey: SoundKey;
  origin: 'file' | 'cdn' | 'baked';
  timestamp: number;
  userAgent: string;
}

interface TelemetryConfig {
  enabled: boolean;
  samplingRate: number;
  bufferSize: number;
  endpoint?: string;
}

const DEFAULT_CONFIG: TelemetryConfig = {
  enabled: process.env.NODE_ENV !== 'production', // Dev: 100%, Prod: OFF by default
  samplingRate: process.env.NODE_ENV === 'production' ? 0.01 : 1.0, // Prod: 1%, Dev: 100%
  bufferSize: 50,
  endpoint: undefined // Buffer locally if no endpoint
};

export const useTelemetrySystem = (config: Partial<TelemetryConfig> = {}) => {
  const telemetryConfig = { ...DEFAULT_CONFIG, ...config };
  const eventBuffer = useRef<TelemetryEvent[]>([]);
  const lastFlush = useRef<number>(Date.now());

  // Store events in global buffer for dev inspection
  if (typeof window !== 'undefined' && !window.__audioTelemetryBuffer) {
    window.__audioTelemetryBuffer = [];
  }

  const shouldSample = useCallback((): boolean => {
    return Math.random() < telemetryConfig.samplingRate;
  }, [telemetryConfig.samplingRate]);

  const getUserAgentCategory = useCallback((): string => {
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) return 'ios';
    if (/android/.test(ua)) return 'android';
    if (/chrome/.test(ua)) return 'chrome';
    if (/firefox/.test(ua)) return 'firefox';
    if (/safari/.test(ua)) return 'safari';
    return 'other';
  }, []);

  const trackAudioSourceUsed = useCallback((
    soundKey: SoundKey,
    origin: 'file' | 'cdn' | 'baked'
  ) => {
    // Skip if telemetry disabled
    if (!telemetryConfig.enabled) return;

    // Skip if not sampled (for production rate limiting)
    if (!shouldSample()) return;

    const event: TelemetryEvent = {
      soundKey,
      origin,
      timestamp: Date.now(),
      userAgent: getUserAgentCategory()
    };

    // Add to local buffer
    eventBuffer.current.push(event);

    // Add to global buffer for dev inspection
    if (typeof window !== 'undefined' && window.__audioTelemetryBuffer) {
      window.__audioTelemetryBuffer.push(event);
      
      // Keep global buffer from growing too large
      if (window.__audioTelemetryBuffer.length > 1000) {
        window.__audioTelemetryBuffer = window.__audioTelemetryBuffer.slice(-500);
      }
    }

    // Log in development mode
    if (process.env.NODE_ENV !== 'production') {
      console.log(`📊 TELEMETRY: ${soundKey} from ${origin} (${event.userAgent})`);
    }

    // Auto-flush if buffer is full
    if (eventBuffer.current.length >= telemetryConfig.bufferSize) {
      flushTelemetryBuffer();
    }
  }, [telemetryConfig.enabled, telemetryConfig.bufferSize, shouldSample, getUserAgentCategory]);

  const flushTelemetryBuffer = useCallback(async () => {
    if (eventBuffer.current.length === 0) return;

    const events = [...eventBuffer.current];
    eventBuffer.current = [];
    lastFlush.current = Date.now();

    // If no endpoint configured, just store in global buffer
    if (!telemetryConfig.endpoint) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`📊 TELEMETRY BUFFER (${events.length} events):`, events);
      }
      return;
    }

    // Send to endpoint if configured
    try {
      const response = await fetch(telemetryConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events,
          metadata: {
            timestamp: Date.now(),
            userAgent: getUserAgentCategory(),
            samplingRate: telemetryConfig.samplingRate
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Telemetry upload failed: ${response.status}`);
      }

      if (process.env.NODE_ENV !== 'production') {
        console.log(`📊 TELEMETRY: Uploaded ${events.length} events`);
      }
    } catch (error) {
      // Silently fail in production, log in development
      if (process.env.NODE_ENV !== 'production') {
        console.warn('📊 TELEMETRY: Upload failed:', error);
      }
      
      // Put events back in buffer for retry
      eventBuffer.current.unshift(...events);
    }
  }, [telemetryConfig.endpoint, telemetryConfig.samplingRate, getUserAgentCategory]);

  const getTelemetryStats = useCallback(() => {
    const globalBuffer = typeof window !== 'undefined' ? window.__audioTelemetryBuffer || [] : [];
    
    const stats = {
      bufferSize: eventBuffer.current.length,
      globalBufferSize: globalBuffer.length,
      lastFlush: lastFlush.current,
      config: telemetryConfig,
      sourceDistribution: {} as Record<string, number>,
      soundDistribution: {} as Record<string, number>
    };

    // Calculate distributions from global buffer
    globalBuffer.forEach((event: TelemetryEvent) => {
      stats.sourceDistribution[event.origin] = (stats.sourceDistribution[event.origin] || 0) + 1;
      stats.soundDistribution[event.soundKey] = (stats.soundDistribution[event.soundKey] || 0) + 1;
    });

    return stats;
  }, [telemetryConfig]);

  const clearTelemetryBuffer = useCallback(() => {
    eventBuffer.current = [];
    if (typeof window !== 'undefined' && window.__audioTelemetryBuffer) {
      window.__audioTelemetryBuffer = [];
    }
  }, []);

  return {
    trackAudioSourceUsed,
    flushTelemetryBuffer,
    getTelemetryStats,
    clearTelemetryBuffer,
    config: telemetryConfig
  };
};

// Global type declaration for dev inspection
declare global {
  interface Window {
    __audioTelemetryBuffer?: TelemetryEvent[];
  }
}
