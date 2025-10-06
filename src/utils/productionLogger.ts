// Production-safe logging utility
const isProduction = process.env.NODE_ENV === 'production';

export const devLog = {
  log: (...args: any[]) => {
    if (!isProduction) {
      console.log(...args);
    }
  },
  warn: (...args: any[]) => {
    if (!isProduction) {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    if (!isProduction) {
      console.error(...args);
    }
  }
};

// Sound-specific logging with minimal production output
export const soundLog = {
  ok: (soundKey: string, source: string) => {
    if (!isProduction) {
      console.log(`SOUND OK [${soundKey}] ← ${source}`);
    }
  },
  fallback: (soundKey: string, message: string) => {
    if (!isProduction) {
      console.log(`SOUND FALLBACK [${soundKey}] ${message}`);
    }
  },
  error: (soundKey: string, error: any) => {
    if (!isProduction) {
      console.log(`SOUND ERROR [${soundKey}] ${error}`);
    }
  }
};