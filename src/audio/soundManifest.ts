import { SoundDefinition, SoundKey } from './types';

// Sound source preference mode - prioritize baked sounds for consistent performance
export const SOUND_SOURCE_MODE: 'auto' | 'baked-first' = 'baked-first';

// Fallback URLs since local files couldn't be downloaded
const SOUND_URLS = {
  click: 'https://cdn.pixabay.com/download/audio/2023/03/25/audio_5c2e28.mp3',
  correct: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_d3fdac8421.mp3',
  transition: 'https://cdn.pixabay.com/download/audio/2023/03/22/audio_3dfd31f20a.mp3',
  wheel: 'https://cdn.pixabay.com/download/audio/2023/03/03/audio_2761fce233.mp3',
  applause: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_4831c3e0d8.mp3',
  achievement: 'https://cdn.pixabay.com/download/audio/2022/03/31/audio_f5ec76ed7d.mp3',
  confettiPop: 'https://cdn.pixabay.com/download/audio/2023/03/03/audio_2761fce233.mp3', // Unique confetti pop sound
};

export const SOUND_MANIFEST: Record<SoundKey, SoundDefinition> = {
  click: {
    url: `/sounds/click.mp3`,
    cdn: null,
    baked: true,
    category: 'ui',
    volume: 1.0,
    preference: ['local', 'baked']
  },
  correct: {
    url: `/sounds/correct.mp3`,
    cdn: SOUND_URLS.correct,
    baked: true,
    category: 'feedback',
    volume: 1.0
  },
  transition: {
    url: `/sounds/transition.mp3`,
    cdn: null,
    baked: true,
    category: 'ui',
    volume: 1.0,
    preference: ['local', 'baked']
  },
  wheel: {
    url: `/sounds/wheel.mp3`,
    cdn: SOUND_URLS.wheel,
    baked: true,
    category: 'special',
    volume: 1.0
  },
  confettiPop: {
    url: `/sounds/confetti.mp3`,
    cdn: SOUND_URLS.confettiPop,
    baked: true,
    category: 'special',
    volume: 1.0
  },
  applause: {
    url: `/sounds/applause.mp3`,
    cdn: SOUND_URLS.applause,
    baked: true,
    category: 'special',
    volume: 1.0
  },
  achievement: {
    url: `/sounds/achievement.mp3`,
    cdn: SOUND_URLS.achievement,
    baked: true,
    category: 'feedback',
    volume: 1.0
  },
  pageOpen: {
    url: `/sounds/pageOpen.mp3`,
    cdn: null,
    baked: true,
    category: 'ui',
    volume: 1.0,
    preference: ['local', 'baked']
  }
};

// Fallback manifest using external URLs
export const FALLBACK_SOUND_MANIFEST: Record<SoundKey, SoundDefinition> = {
  click: {
    url: SOUND_URLS.click,
    cdn: SOUND_URLS.click,
    baked: true,
    category: 'ui',
    volume: 1.0
  },
  correct: {
    url: SOUND_URLS.correct,
    cdn: SOUND_URLS.correct,
    baked: true,
    category: 'feedback',
    volume: 1.0
  },
  transition: {
    url: SOUND_URLS.transition,
    cdn: SOUND_URLS.transition,
    baked: true,
    category: 'ui',
    volume: 1.0
  },
  wheel: {
    url: SOUND_URLS.wheel,
    cdn: SOUND_URLS.wheel,
    baked: true,
    category: 'special',
    volume: 1.0
  },
  confettiPop: {
    url: SOUND_URLS.confettiPop,
    cdn: SOUND_URLS.confettiPop,
    baked: true,
    category: 'special',
    volume: 1.0
  },
  applause: {
    url: SOUND_URLS.applause,
    cdn: SOUND_URLS.applause,
    baked: true,
    category: 'special',
    volume: 1.0
  },
  achievement: {
    url: SOUND_URLS.achievement,
    cdn: SOUND_URLS.achievement,
    baked: true,
    category: 'feedback',
    volume: 1.0
  },
  pageOpen: {
    url: `/sounds/pageOpen.mp3`,
    cdn: null,
    baked: true,
    category: 'ui',
    volume: 1.0,
    preference: ['local', 'baked']
  }
};

export const CATEGORY_VOLUMES = {
  ui: 0.50,       // -6 dB
  feedback: 0.707, // -3 dB
  special: 1.0,    // 0 dB
  timer: 0.7
};