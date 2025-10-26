import type { BreathingRite } from '../types';

export const BREATHING_RITES: Record<string, BreathingRite> = {
  'twilit-respite': {
    id: 'twilit-respite',
    name: 'Twilit Respite',
    description: 'The 4-7-8 technique. A calming breath to quiet the mind and ease into rest.',
    covenant: 'respite',
    phases: [
      { type: 'inhale', duration: 4, instruction: 'Draw in the twilight...' },
      { type: 'hold', duration: 7, instruction: 'Hold the stillness...' },
      { type: 'exhale', duration: 8, instruction: 'Release into the night...' },
    ],
  },
  'iron-flesh': {
    id: 'iron-flesh',
    name: 'Iron Flesh Technique',
    description: 'Box Breathing. The warrior\'s breath for focus and discipline.',
    covenant: 'focus',
    phases: [
      { type: 'inhale', duration: 4, instruction: 'Forge your resolve...' },
      { type: 'hold', duration: 4, instruction: 'Temper the steel...' },
      { type: 'exhale', duration: 4, instruction: 'Release the weakness...' },
      { type: 'hold-empty', duration: 4, instruction: 'Find the center...' },
    ],
  },
  'dragons-roar': {
    id: 'dragons-roar',
    name: "The Dragon's Roar",
    description: 'Wim Hof inspired. Powerful breaths to awaken the inner fire.',
    covenant: 'vigor',
    cycles: 30,
    phases: [
      { type: 'inhale', duration: 2, instruction: 'Breathe in the flame...' },
      { type: 'exhale', duration: 1, instruction: 'Let it flow...' },
    ],
  },
  'estus-breath': {
    id: 'estus-breath',
    name: 'Estus Breath',
    description: 'Resonance Breathing. The healing breath at 5-6 breaths per minute.',
    covenant: 'respite',
    phases: [
      { type: 'inhale', duration: 5, instruction: 'Draw in the essence...' },
      { type: 'exhale', duration: 5, instruction: 'Pour forth restoration...' },
    ],
  },
};