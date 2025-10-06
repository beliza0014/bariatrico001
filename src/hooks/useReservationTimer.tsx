import { useState, useEffect, useRef, useCallback } from 'react';

interface ReservationTimerConfig {
  initialMinutes?: number;
  pauseOnBlur?: boolean;
  onExpired?: () => void;
}

interface ReservationTimerState {
  timeRemaining: number;
  isExpired: boolean;
  isRunning: boolean;
  formattedTime: string;
}

export const useReservationTimer = (config: ReservationTimerConfig = {}): ReservationTimerState & {
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
} => {
  const {
    initialMinutes = 15,
    pauseOnBlur = true,
    onExpired
  } = config;

  const initialTime = initialMinutes * 60 * 1000; // Convert to milliseconds
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  const formatTime = useCallback((milliseconds: number): string => {
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const start = useCallback(() => {
    setIsRunning(true);
    lastTickRef.current = Date.now();
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resume = useCallback(() => {
    setIsRunning(true);
    lastTickRef.current = Date.now();
  }, []);

  const reset = useCallback(() => {
    setTimeRemaining(initialTime);
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [initialTime]);

  // Main timer effect
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastTickRef.current;
      lastTickRef.current = now;

      setTimeRemaining(prev => {
        const newTime = prev - elapsed;
        if (newTime <= 0) {
          setIsRunning(false);
          onExpired?.();
          return 0;
        }
        return newTime;
      });
    }, 100); // Update every 100ms for smoother countdown

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, onExpired]);

  // Pause on tab blur effect
  useEffect(() => {
    if (!pauseOnBlur) return;

    const handleVisibilityChange = () => {
      if (document.hidden && isRunning) {
        pause();
        // Store pause timestamp for potential resume calculation
        sessionStorage.setItem('timer_paused_at', Date.now().toString());
      } else if (!document.hidden && !isRunning && timeRemaining > 0) {
        const pausedAt = sessionStorage.getItem('timer_paused_at');
        if (pausedAt) {
          sessionStorage.removeItem('timer_paused_at');
          resume();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [pauseOnBlur, isRunning, timeRemaining, pause, resume]);

  // Auto-start timer when component mounts
  useEffect(() => {
    // Check if timer was already started in this session
    const timerStarted = sessionStorage.getItem('reservation_timer_started');
    if (!timerStarted) {
      sessionStorage.setItem('reservation_timer_started', 'true');
      start();
    } else {
      // Timer was already started, check if we should resume
      const savedTime = sessionStorage.getItem('reservation_timer_remaining');
      if (savedTime) {
        const remaining = parseInt(savedTime);
        if (remaining > 0) {
          setTimeRemaining(remaining);
          start();
        }
      }
    }
  }, [start]);

  // Save timer state to session storage
  useEffect(() => {
    if (timeRemaining > 0) {
      sessionStorage.setItem('reservation_timer_remaining', timeRemaining.toString());
    } else {
      sessionStorage.removeItem('reservation_timer_remaining');
      sessionStorage.removeItem('reservation_timer_started');
    }
  }, [timeRemaining]);

  const isExpired = timeRemaining <= 0;
  const formattedTime = formatTime(timeRemaining);

  return {
    timeRemaining,
    isExpired,
    isRunning,
    formattedTime,
    start,
    pause,
    resume,
    reset
  };
};