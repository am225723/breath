import type { Covenant } from '../types';

export const COVENANTS: Record<string, Covenant> = {
  respite: {
    id: 'respite',
    name: 'Covenant of Respite',
    title: 'The Way of Blue',
    description: 'Sworn to find peace in the chaos, to calm the storm within.',
    goal: 'Stress & Anxiety Reduction',
    preferredRites: ['twilit-respite', 'estus-breath'],
    uiTint: 'from-blue-900/30 to-blue-800/20',
    glowColor: 'rgba(59, 130, 246, 0.5)',
  },
  focus: {
    id: 'focus',
    name: 'Covenant of Focus',
    title: 'The Blades of the Darkmoon',
    description: 'Sworn to sharpen the mind, to cut through distraction with discipline.',
    goal: 'Discipline & Productivity',
    preferredRites: ['iron-flesh'],
    uiTint: 'from-slate-900/30 to-slate-700/20',
    glowColor: 'rgba(203, 213, 225, 0.5)',
  },
  vigor: {
    id: 'vigor',
    name: 'Covenant of Vigor',
    title: 'The Sunlight Warriors',
    description: 'Sworn to kindle the inner fire, to burn with life and energy.',
    goal: 'Energy & Physical Wellness',
    preferredRites: ['dragons-roar'],
    uiTint: 'from-yellow-900/30 to-amber-800/20',
    glowColor: 'rgba(251, 191, 36, 0.6)',
  },
};