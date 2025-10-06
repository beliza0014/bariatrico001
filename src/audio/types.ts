export type SoundCategory = 'ui' | 'feedback' | 'special' | 'timer';

export type SoundKey = 
  | 'click'
  | 'correct'
  | 'transition'
  | 'wheel'
  | 'confettiPop'
  | 'applause'
  | 'achievement'
  | 'pageOpen';

export interface SoundDefinition {
  url: string;
  cdn?: string | null;
  baked?: boolean;
  category: SoundCategory;
  volume?: number;
  preference?: ('local' | 'baked' | 'cdn')[];
}

export interface PlayOptions {
  volume?: number;
  loop?: boolean;
  x?: number; // -1 to 1 (left to right)
  y?: number; // -1 to 1 (back to front)
  z?: number; // -1 to 1 (down to up)
}

export interface SpatialPosition {
  x: number;
  y: number;
  z: number;
}

export interface SoundState {
  enabled: boolean;
  muted: boolean;
  spatial: boolean;
  masterVolume: number;
  isUnlocked: boolean;
  bufferLoadProgress: number;
}

export interface DeviceCapabilities {
  isIOS: boolean;
  isSafari: boolean;
  hasHRTF: boolean;
  sampleRate: number;
  canVibrate: boolean;
}

export type GameSoundType = 
  | 'correct'
  | 'incorrect' 
  | 'level-up'
  | 'alert'
  | 'click'
  | 'page-transition';

export type UrgencyLevel = 'low' | 'medium' | 'high';

export type SpatialSoundType = 
  | 'achievement'
  | 'transition'
  | 'correct'
  | 'incorrect'
  | 'celebration';