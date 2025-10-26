import type { UserProgress, Session, TravelerEcho } from '../types';
import { ECHO_TEMPLATES } from '../types';

const STORAGE_KEYS = {
  PROGRESS: 'path-of-embers-progress',
  ECHOES: 'path-of-embers-echoes',
};

export const loadProgress = (): UserProgress => {
  const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  if (stored) {
    const parsed = JSON.parse(stored);
    return {
      ...parsed,
      lastSessionDate: parsed.lastSessionDate ? new Date(parsed.lastSessionDate) : undefined,
      gracePeriodEnd: parsed.gracePeriodEnd ? new Date(parsed.gracePeriodEnd) : undefined,
      sessions: parsed.sessions.map((s: Session) => ({
        ...s,
        date: new Date(s.date),
      })),
    };
  }
  return {
    currentStreak: 0,
    longestStreak: 0,
    totalSessions: 0,
    totalMinutes: 0,
    bonfireLevel: 'smoldering',
    sessions: [],
  };
};

export const saveProgress = (progress: UserProgress): void => {
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
};

export const calculateBonfireLevel = (streak: number): UserProgress['bonfireLevel'] => {
  if (streak >= 15) return 'first-flame';
  if (streak >= 8) return 'roaring';
  if (streak >= 4) return 'steady-flame';
  return 'smoldering';
};

export const updateStreak = (progress: UserProgress): UserProgress => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  if (!progress.lastSessionDate) {
    return {
      ...progress,
      currentStreak: 1,
      longestStreak: Math.max(1, progress.longestStreak),
      lastSessionDate: now,
      bonfireLevel: calculateBonfireLevel(1),
    };
  }

  const lastSession = new Date(progress.lastSessionDate);
  const lastSessionDay = new Date(lastSession.getFullYear(), lastSession.getMonth(), lastSession.getDate());
  const daysDiff = Math.floor((today.getTime() - lastSessionDay.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff === 0) {
    // Same day, no streak change
    return progress;
  } else if (daysDiff === 1) {
    // Next day, increment streak
    const newStreak = progress.currentStreak + 1;
    return {
      ...progress,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, progress.longestStreak),
      lastSessionDate: now,
      bonfireLevel: calculateBonfireLevel(newStreak),
      gracePeriodEnd: undefined,
    };
  } else if (daysDiff === 2 && progress.gracePeriodEnd && now <= progress.gracePeriodEnd) {
    // Within grace period, restore streak
    return {
      ...progress,
      lastSessionDate: now,
      gracePeriodEnd: undefined,
    };
  } else if (daysDiff === 2 && !progress.gracePeriodEnd) {
    // Missed one day, enter grace period
    const gracePeriodEnd = new Date(today);
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 2);
    return {
      ...progress,
      gracePeriodEnd,
    };
  } else {
    // Streak broken, reset
    return {
      ...progress,
      currentStreak: 1,
      lastSessionDate: now,
      bonfireLevel: calculateBonfireLevel(1),
      gracePeriodEnd: undefined,
    };
  }
};

export const addSession = (progress: UserProgress, session: Session): UserProgress => {
  const updatedProgress = updateStreak(progress);
  return {
    ...updatedProgress,
    totalSessions: updatedProgress.totalSessions + 1,
    totalMinutes: updatedProgress.totalMinutes + Math.floor(session.duration / 60),
    sessions: [session, ...updatedProgress.sessions],
  };
};

// Echo system
export const loadEchoes = (): TravelerEcho[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.ECHOES);
  if (stored) {
    const parsed = JSON.parse(stored);
    return parsed.map((e: TravelerEcho) => ({
      ...e,
      timestamp: new Date(e.timestamp),
    }));
  }
  return [];
};

export const saveEcho = (echo: TravelerEcho): void => {
  const echoes = loadEchoes();
  echoes.push(echo);
  // Keep only last 100 echoes
  const trimmed = echoes.slice(-100);
  localStorage.setItem(STORAGE_KEYS.ECHOES, JSON.stringify(trimmed));
};

export const getRandomEcho = (): string | null => {
  const echoes = loadEchoes();
  if (echoes.length === 0) return null;
  
  // 30% chance to show an echo
  if (Math.random() > 0.3) return null;
  
  const randomEcho = echoes[Math.floor(Math.random() * echoes.length)];
  return randomEcho.message;
};

export const createEchoMessage = (parts: [string, string]): string => {
  return `${parts[0]}, ${parts[1]}`;
};

export const getRandomEchoTemplate = (): [string, string] => {
  return ECHO_TEMPLATES[Math.floor(Math.random() * ECHO_TEMPLATES.length)] as [string, string];
};