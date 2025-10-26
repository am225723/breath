export type BreathingPattern = 'twilit-respite' | 'iron-flesh' | 'dragons-roar' | 'estus-breath';

export type CovenantType = 'respite' | 'focus' | 'vigor';

export interface Covenant {
  id: CovenantType;
  name: string;
  title: string;
  description: string;
  goal: string;
  preferredRites: BreathingPattern[];
  uiTint: string;
  glowColor: string;
}

export interface BreathingRite {
  id: BreathingPattern;
  name: string;
  description: string;
  phases: BreathingPhase[];
  cycles?: number;
  covenant?: CovenantType;
}

export interface BreathingPhase {
  type: 'inhale' | 'hold' | 'exhale' | 'hold-empty';
  duration: number;
  instruction: string;
}

export interface Session {
  id: string;
  date: Date;
  rite: BreathingPattern;
  duration: number;
  cycles: number;
  preRitualNote?: string;
  postRitualNote?: string;
  covenant?: CovenantType;
}

export interface UserProgress {
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  totalMinutes: number;
  lastSessionDate?: Date;
  bonfireLevel: BonfireLevel;
  covenant?: CovenantType;
  gracePeriodEnd?: Date;
  sessions: Session[];
}

export type BonfireLevel = 'smoldering' | 'steady-flame' | 'roaring' | 'first-flame';

export interface TravelerEcho {
  id: string;
  message: string;
  timestamp: Date;
}

export const ECHO_TEMPLATES = [
  ["Don't give up", "skeleton"],
  ["Respite", "ahead"],
  ["You are", "not alone"],
  ["Find your", "flame"],
  ["Praise the", "breath"],
  ["Try", "mindfulness"],
  ["The journey", "continues"],
  ["Strength", "required ahead"],
  ["Be wary of", "stress"],
  ["Time for", "rest"],
  ["Amazing", "progress"],
  ["Keep going", "warrior"],
  ["Peace", "awaits"],
  ["Focus", "required ahead"],
  ["Well done", "traveler"],
];